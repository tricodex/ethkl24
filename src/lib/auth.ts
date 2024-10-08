import { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      verificationLevel: string;
      role: string;
      address?: string;
    };
  }
}

interface AuthUser {
  id: string;
  verificationLevel: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid" } },
      clientId: process.env.WORLDCOIN_CLIENT_ID,
      clientSecret: process.env.WORLDCOIN_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.sub,
          verificationLevel: profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthUser;
        token.id = authUser.id;
        token.verificationLevel = authUser.verificationLevel;
      }
      token.userRole = "admin";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.verificationLevel = token.verificationLevel as string;
        session.user.role = token.userRole as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/world-id',
  },
  debug: process.env.NODE_ENV === 'development',
};