import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import {
  getSupabaseClient,
  isSupabaseConfigured,
  supabase,
} from "../lib/supabase";
import { AuthContext, type AuthContextValue, type AuthResult } from "./authContext";

function buildAuthRedirect(redirectTo: string): string {
  const callbackUrl = new URL("/auth/callback", window.location.origin);
  callbackUrl.searchParams.set("redirect", redirectTo);
  return callbackUrl.toString();
}

async function syncKitSubscriber(session: Session): Promise<void> {
  const syncKey = `kit-sync:${session.user.id}:python-fundamentals`;

  if (window.localStorage.getItem(syncKey) === "synced") {
    return;
  }

  const response = await fetch("/api/sync-kit", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topicSlug: "python-fundamentals" }),
  });

  if (response.ok) {
    window.localStorage.setItem(syncKey, "synced");
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setSession(data.session);
      setIsLoading(false);

      if (data.session) {
        void syncKitSubscriber(data.session).catch(() => undefined);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);

        if (nextSession) {
          void syncKitSubscriber(nextSession).catch(() => undefined);
        }
      }
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const client = getSupabaseClient();
      const { error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return {};
    },
    []
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      redirectTo: string
    ): Promise<AuthResult> => {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: buildAuthRedirect(redirectTo),
        },
      });

      if (error) {
        throw error;
      }

      return {
        needsEmailConfirmation: Boolean(data.user && !data.session),
      };
    },
    []
  );

  const signOut = useCallback(async () => {
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut();

    if (error) {
      throw error;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isConfigured: isSupabaseConfigured,
      isLoading,
      session,
      signIn,
      signOut,
      signUp,
      user: session?.user ?? null,
    }),
    [isLoading, session, signIn, signOut, signUp]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
