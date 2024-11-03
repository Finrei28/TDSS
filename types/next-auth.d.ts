// types/next-auth.d.ts

import NextAuth, { DefaultJWT, DefaultSession } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      username: string
      role: string // Other properties if needed
    } & DefaultSession
  }
  interface User extends DefaultUser {
    role: string
    username: string
    id: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string
    username: string
    id: string
  }
}
