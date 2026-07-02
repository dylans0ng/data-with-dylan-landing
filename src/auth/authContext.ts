import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export interface AuthResult {
  needsEmailConfirmation?: boolean;
}

export interface AuthContextValue {
  isConfigured: boolean;
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    redirectTo: string,
    emailListOptIn: boolean
  ) => Promise<AuthResult>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
