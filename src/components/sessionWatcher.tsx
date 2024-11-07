'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const SessionWatcher = () => {
	const { status } = useSession()

	const pathname = usePathname()
	const router = useRouter()

	useEffect(() => {
		if (status == 'loading') return

		const isAuthpath = pathname.includes('sign-in')
		if (isAuthpath && status == 'authenticated') {
			router.replace('/dashboard')
		}

		if (!isAuthpath && status == 'unauthenticated') {
			router.replace('/sign-in')
		}
	}, [pathname, router, status])

	return null
}

export default SessionWatcher
