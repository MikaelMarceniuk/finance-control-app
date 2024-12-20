'use client'

import { ThemeToggle } from '@/components/themeToggle'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { HandCoins } from 'lucide-react'
import Link from 'next/link'
import { Separator } from './ui/separator'
import UserAvatar from './userAvatar'

const Navbar = () => {
	const pathname = usePathname()

	return (
		<div className="flex items-center border-b px-4 py-2">
			<div className="flex items-center gap-2">
				<HandCoins />
				<span>Finances Control App</span>
			</div>
			<Separator orientation="vertical" className="ml-6 mr-2 h-6" />
			<nav className="flex flex-1 justify-between">
				<div className="flex gap-2">
					<Link href="/dashboard">
						<Button
							variant="link"
							className="text-gray-500 data-[current=true]:text-foreground"
							data-current={pathname == '/dashboard'}
						>
							Dashboard
						</Button>
					</Link>
					<Button
						variant="link"
						className="text-gray-500 data-[current=true]:text-foreground"
						data-current={pathname == '/goals'}
					>
						Metas
					</Button>
					<Link href="/reports">
						<Button
							variant="link"
							className="text-gray-500 data-[current=true]:text-foreground"
							data-current={pathname == '/reports'}
						>
							Relatórios
						</Button>
					</Link>
				</div>

				<div className="flex gap-4">
					<ThemeToggle />
					<UserAvatar />
				</div>
			</nav>
		</div>
	)
}

export default Navbar
