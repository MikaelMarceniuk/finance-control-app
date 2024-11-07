'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { NextPage } from 'next'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'

import googleIcon from '@/assets/google-icon.png'
import githubIconDark from '@/assets/github-mark.png'

const AuthPage: NextPage = () => {
	const { status } = useSession()

	return (
		<div className="flex min-h-dvh items-center justify-center">
			<Card className="h-fit w-96">
				<CardHeader>
					<CardTitle>Fazer login</CardTitle>
					<CardDescription>
						Selecione uma maneira de fazer login
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						{/* <Button className="gap-2" onClick={() => signIn('google')}>
							<Image src={googleIcon} alt="GoogleIcon" className="h-6 w-6" />
							<span className="font-semibold text-gray-700">Google</span>
						</Button> */}
						<Button
							className="gap-2"
							onClick={() => signIn('github')}
							disabled={status != 'unauthenticated'}
						>
							<Image
								src={githubIconDark}
								alt="GithubIconDark"
								className="h-6 w-6"
							/>
							<span className="font-semibold text-gray-700">Github</span>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default AuthPage
