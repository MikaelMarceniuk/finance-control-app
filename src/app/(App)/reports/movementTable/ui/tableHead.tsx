'use client'

import { Button } from '@/components/ui/button'
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { TableHead } from '@/components/ui/table'
import {
	ArrowDownWideNarrow,
	ArrowUpDown,
	ArrowUpWideNarrow,
	EyeOff,
} from 'lucide-react'
import { useState } from 'react'
import { useTableActionProvider } from '..'
import { cn } from '@/lib/utils'
import { TransactionsOrderBy } from '@/api/getTransactions'

type TableHeadProps = {
	name: string
	orderByKey?: keyof TransactionsOrderBy
	isVisible?: boolean
	isSortable?: boolean
	className?: string
}

const CustomTableHead: React.FC<TableHeadProps> = ({
	name,
	orderByKey,
	className,
	isVisible,
	isSortable = false,
}) => {
	const { handleOnAction, values } = useTableActionProvider()
	const [isOpen, setIsOpen] = useState(false)

	const getOrderByIcon = () => {
		console.log('getOrderByIcon.orderBy: ', orderByKey)
		const currentOrderBy = values.orderBy?.[orderByKey]

		if (currentOrderBy == 'asc')
			return <ArrowUpWideNarrow size={14} className="text-muted-foreground" />

		if (currentOrderBy == 'desc')
			return <ArrowDownWideNarrow size={14} className="text-muted-foreground" />

		return <ArrowUpDown size={12} className="text-muted-foreground" />
	}

	if (!isSortable) {
		return <TableHead className={className}>{name}</TableHead>
	}

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					role="combobox"
					className={cn(isVisible ? 'flex' : 'hidden', 'my-1 w-28')}
				>
					<TableHead className="flex items-center">{name}</TableHead>
					{getOrderByIcon()}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[160px] p-0">
				<Command>
					<CommandList>
						<CommandGroup>
							<CommandItem
								className="flex gap-2"
								onSelect={() =>
									handleOnAction({ action: 'asc', key: orderByKey })
								}
							>
								<ArrowUpWideNarrow
									size={16}
									className="text-muted-foreground"
								/>
								Asc
							</CommandItem>
							<CommandItem
								className="flex gap-2"
								onSelect={() =>
									handleOnAction({ action: 'desc', key: orderByKey })
								}
							>
								<ArrowDownWideNarrow
									size={16}
									className="text-muted-foreground"
								/>
								Desc
							</CommandItem>
						</CommandGroup>
						<Separator orientation="horizontal" />
						<CommandGroup>
							<CommandItem
								className="flex gap-2"
								onSelect={() => {
									setIsOpen(false)
									handleOnAction({ action: 'hide', key: orderByKey })
								}}
							>
								<EyeOff size={16} className="text-muted-foreground" />
								Esconder
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export default CustomTableHead
