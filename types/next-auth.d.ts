// types/next-auth.d.ts

import NextAuth, {
  DefaultJWT,
  DefaultSession,
  User as DefaultUser,
  Default,
} from "next-auth"
import { JWT as DefaultJWTType } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      username: string
      role: string
      requires2FAExpiresAt?: Date | string | null
    } & DefaultSession
  }

  interface User extends DefaultUser {
    id: string
    role: string
    username: string
    requires2FAExpiresAt?: Date | string | null
  }

  interface SignInResponse extends DefaultSignInResponse {
    user: User
    requires2FAExpiresAt?: Date | string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: string
    username: string
    requires2FAExpiresAt?: Date | string | null
  }
}
