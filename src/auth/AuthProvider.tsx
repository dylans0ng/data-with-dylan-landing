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
import {
  AuthContext,
  type AuthContextValue,
  type AuthResult,
} from "./authContext";
import {
  ACCOUNT_EXISTS_ERROR_MESSAGE,
  checkAccountExists,
} from "../services/accountExists";

function buildAuthRedirect(redirectTo: string): string {
  const callbackUrl = new URL("/auth/callback", window.location.origin);
  callbackUrl.searchParams.set("redirect", redirectTo);
  return callbackUrl.toString();
}

async function sendAccountWelcomeEmail(session: Session): Promise<void> {
  if (
    Number(session.user.user_metadata.account_welcome_email_version) !== 1
  ) {
    return;
  }

  const response = await fetch("/api/account-welcome", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.warn(
      "[Account welcome] Email delivery did not complete.",
      JSON.stringify({ status: response.status, payload }, null, 2)
    );
  }
}

async function syncKitSubscriber(session: Session): Promise<void> {
  if (session.user.user_metadata.email_list_opt_in !== true) {
    return;
  }

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

  const payload = await response.json().catch(() => ({}));

  if (response.ok && payload.synced === true) {
    window.localStorage.setItem(syncKey, "synced");
    return;
  }

  console.warn(
    "[Kit] Subscriber sync did not complete.",
    JSON.stringify({ status: response.status, payload }, null, 2)
  );
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
        void sendAccountWelcomeEmail(data.session).catch(() => undefined);
        void syncKitSubscriber(data.session).catch(() => undefined);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);

        if (nextSession) {
          void sendAccountWelcomeEmail(nextSession).catch(() => undefined);
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
      redirectTo: string,
      emailListOptIn: boolean
    ): Promise<AuthResult> => {
      const client = getSupabaseClient();
      const normalizedEmail = email.trim().toLowerCase();

      if (await checkAccountExists(normalizedEmail)) {
        throw new Error(ACCOUNT_EXISTS_ERROR_MESSAGE);
      }

      const { data, error } = await client.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            account_welcome_email_version: 1,
            email_list_opt_in: emailListOptIn,
            email_list_source: "signup-page",
          },
          emailRedirectTo: buildAuthRedirect(redirectTo),
        },
      });

      if (error) {
        throw error;
      }

      if (Array.isArray(data.user?.identities) && data.user.identities.length === 0) {
        throw new Error(ACCOUNT_EXISTS_ERROR_MESSAGE);
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
