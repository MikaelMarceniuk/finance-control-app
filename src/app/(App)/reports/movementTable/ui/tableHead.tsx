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

type TableHeadProps = {
	name: string
	field: string
	width?: string
	isVisible?: boolean
	isSortable?: boolean
}

const CustomTableHead: React.FC<TableHeadProps> = ({
	name,
	field,
	width,
	isVisible,
	isSortable,
}) => {
	const { handleOnAction, values } = useTableActionProvider()
	const [isOpen, setIsOpen] = useState(false)

	const getOrderByIcon = () => {
		const currentOrderBy = values.orderBy?.[field]

		if (currentOrderBy == 'asc')
			return <ArrowUpWideNarrow size={14} className="text-muted-foreground" />

		if (currentOrderBy == 'desc')
			return <ArrowDownWideNarrow size={14} className="text-muted-foreground" />

		return <ArrowUpDown size={12} className="text-muted-foreground" />
	}

	if (!isSortable) {
		return (
			<TableHead
				className={cn(isVisible ? 'table-cell' : 'hidden', 'my-1')}
				style={{ minWidth: width }}
			>
				{name}
			</TableHead>
		)
	}

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					role="combobox"
					className={cn(isVisible ? 'flex' : 'hidden', 'my-1')}
					style={{ minWidth: width }}
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
								onSelect={() => handleOnAction({ action: 'asc', key: field })}
							>
								<ArrowUpWideNarrow
									size={16}
									className="text-muted-foreground"
								/>
								Asc
							</CommandItem>
							<CommandItem
								className="flex gap-2"
								onSelect={() => handleOnAction({ action: 'desc', key: field })}
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
									handleOnAction({ action: 'visibility', key: field })
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
