'use client'

import * as React from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'

type ComboboxProps = {
	label: string
	searchLabel: string
	emptyLabel: string
	options: { value: string; label: string }[]
	value: string | undefined
	handleOnChange: (selectedValue: string) => void
}

const Combobox: React.FC<ComboboxProps> = ({
	label,
	searchLabel,
	emptyLabel,
	options,
	value,
	handleOnChange,
}) => {
	const [open, setOpen] = React.useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value ? options.find((opt) => opt.value == value)?.label : label}
					<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder={searchLabel} className="h-9" />
					<CommandList>
						<CommandEmpty>{emptyLabel}</CommandEmpty>
						<CommandGroup>
							{options.map((opt) => (
								<CommandItem
									key={opt.value}
									value={opt.value}
									onSelect={(currentValue) => {
										console.log('currentValue: ', currentValue)
										handleOnChange(
											currentValue == value ? undefined : currentValue,
										)
										setOpen(false)
									}}
								>
									{opt.label}
									<CheckIcon
										className={cn(
											'ml-auto h-4 w-4',
											value === opt.value ? 'opacity-100' : 'opacity-0',
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export default Combobox
