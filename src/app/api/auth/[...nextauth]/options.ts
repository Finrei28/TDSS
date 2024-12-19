// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (
          user &&
          user.password &&
          bcrypt.compareSync(credentials.password, user.password)
        ) {
          return {
            ...user,
            username: user.username || "User", // Fallback to "User" if username is null
            requires2FAExpiresAt: user.requires2FAExpiresAt
              ? user.requires2FAExpiresAt.toISOString()
              : null, // Ensure it's serialized to string
          }
        }

        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/signin", // Custom sign-in page
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email } = user

      if (email) {
        // If using Google, ensure profile is correctly typed
        if (account?.provider === "google" && profile && profile.sub) {
          const { sub: googleId } = profile // This is the providerAccountId

          // Check if the user exists in the database
          const existingUser = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true },
          })
          if (existingUser) {
            // If the user exists and logging in via Google, check if account is already linked
            const existingGoogleAccount = existingUser.accounts.find(
              (acc) => acc.provider === "google"
            )

            if (!existingGoogleAccount) {
              // If Google account is not linked, link it
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  provider: "google",
                  providerAccountId: googleId, // Correctly assigning providerAccountId
                  access_token: account.access_token,
                  refresh_token: account.refresh_token || "", // Ensure refresh_token is provided, or set as an empty string if undefined
                  expires_at: account.expires_at || 0, // Ensure expires_at has a valid value
                  type: "oauth", // OAuth type
                },
              })
            }
          } else {
            // If the user doesn't exist, create a new user
            try {
              const newUser = await prisma.user.create({
                data: {
                  email,
                  name: user.name || "New User",
                  username: user.username || "New User", // Adjust username logic
                  image: user.image || "",
                  accounts: {
                    create: {
                      provider: "google",
                      providerAccountId: googleId, // Correctly assigning providerAccountId
                      access_token: account.access_token,
                      refresh_token: account.refresh_token || "", // Ensure refresh_token is provided
                      expires_at: account.expires_at || 0, // Ensure expires_at has a valid value
                      type: "oauth", // OAuth type
                    },
                  },
                },
              })
              return true
            } catch (error) {
              console.error("Error creating user:", error)
              return false
            }
          }
        }
        return true // Proceed with sign-in if no errors
      }
      return false // Block sign-in if no email is available
    },
    async jwt({ token, user }) {
      if (user) {
        // If the user is required to do 2FA and it's not expired, do not set user data in the token yet
        if (
          !user.requires2FAExpiresAt ||
          new Date(user.requires2FAExpiresAt) < new Date()
        ) {
          return token // Don't return any user data in the token
        }

        // If no 2FA or expired 2FA, set user data in the token
        const firstName = user.name?.split(" ")[0] || "User"
        token.role = user.role
        token.username = user.username || firstName
        token.id = user.id
        token.requires2FAExpiresAt = user.requires2FAExpiresAt
      }
      return token
    },
    async session({ session, token }) {
      if (
        !token.requires2FAExpiresAt ||
        new Date(token.requires2FAExpiresAt) < new Date()
      ) {
        return session
      }

      if (session?.user) {
        session.user.role = token.role
        session.user.username = token.username
        session.user.id = token.id
        session.user.requires2FAExpiresAt = token.requires2FAExpiresAt
      }

      return session
    },
  },
}
