import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'

const UserAvatar: React.FC = () => {
	const { data } = useSession()

	if (!data?.user) {
		return null
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar className="h-9 w-9">
					<AvatarImage src={data.user.image} />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>{data?.user.name}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Button
						variant="destructive"
						className="w-full"
						onClick={() =>
							signOut({
								redirect: true,
								redirectTo: '/sign-in',
							})
						}
					>
						Deslogar
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserAvatar
