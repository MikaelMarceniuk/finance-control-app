'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

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

type ComboboxValue = {
	id: number
	label: string
}

type ComboboxInputProps = {
	options: ComboboxValue[]
	value: ComboboxValue
	handleOnChange: (data: { id: number; label: string } | undefined) => void
}

const ComboboxInput: React.FC<ComboboxInputProps> = ({
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
					{value
						? options.find((p) => p.id === value.id)?.label
						: 'Selecione um valor...'}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search framework..." />
					<CommandList>
						<CommandEmpty>Nenhuma categoria encontrada...</CommandEmpty>
						<CommandGroup>
							{options.map((opt) => (
								<CommandItem
									key={opt.id}
									value={opt.id.toString()}
									onSelect={(currentValue) => {
										handleOnChange(
											currentValue == value?.id.toString() ? undefined : opt,
										)
										setOpen(false)
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === opt.id ? 'opacity-100' : 'opacity-0',
										)}
									/>
									{opt.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export default ComboboxInput
