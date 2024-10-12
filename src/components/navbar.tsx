'use client'

import { ThemeToggle } from '@/components/themeToggle'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { Github, HandCoins } from 'lucide-react'
import Link from 'next/link'
import { Separator } from './ui/separator'

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

				<div className="flex gap-2">
					<Link href="https://github.com/MikaelMarceniuk" target="_blank">
						<Button variant="ghost">
							<Github />
						</Button>
					</Link>
					<ThemeToggle />
				</div>
			</nav>
		</div>
	)
}

export default Navbar
