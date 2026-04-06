import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma" 
import { verifyPassword } from "@/lib/hash"

export const authOptions = {
  providers: [
    CredentialsProvider({
        name: "Credentials",

        credentials: {
            username: {label: "Uživatelské jméno", type: "text"},
            password: {label: "Heslo", type: "password"}
        },

        async authorize(credentials, req) {

            const user = await prisma.user.findUnique({
                where: { name: credentials?.username }
            });

            if (user && await verifyPassword(credentials?.password || "", user.password)){
                return { id: user.id.toString(), name: user.name };
            }
                return null;
        }
    })
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
}

export default NextAuth(authOptions)