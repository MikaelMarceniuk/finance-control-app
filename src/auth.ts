import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [GitHub],
	callbacks: {
		async jwt({ token, account }) {
			// Persists providerAccountId on signIn
			if (account) {
				token.id = account.providerAccountId
			}

			return token
		},
		async session({ session, token }) {
			// Sends providerAccountId from Token to client
			if (token.id) {
				session.user.id = token.id
			}

			return session
		},
	},
})
