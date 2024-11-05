'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
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
import { ETransactionType } from '@prisma/client'

type TransactionTypeComboboxInput = {
	type: ETransactionType
	value: string
	handleOnChange: (data: string | undefined) => void
	isDisabled?: boolean
}

const availableTypes = Object.values(ETransactionType) as string[]

const TransactionTypeComboboxInput: React.FC<TransactionTypeComboboxInput> = ({
	value,
	handleOnChange,
	isDisabled = false,
}) => {
	const [open, setOpen] = React.useState(false)

	const handleOnSelect = (categoryId: string) => (selectedValue: string) => {
		handleOnChange(selectedValue == value ? undefined : categoryId)
		setOpen(false)
	}

	const getCurrentValue = () => {
		const selectedValue = availableTypes.find((type) => type == value)!
		return selectedValue == 'expense' ? 'Despesa' : 'Receita'
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="justify-between"
					disabled={isDisabled}
				>
					{value ? getCurrentValue() : 'Selecione uma tipo'}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0">
				<Command>
					<CommandList>
						<CommandGroup>
							{availableTypes.map((opt) => (
								<CommandItem
									key={opt}
									value={opt}
									onSelect={handleOnSelect(opt)}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value == opt ? 'opacity-100' : 'opacity-0',
										)}
									/>
									{opt == 'expense' ? 'Despesa' : 'Receita'}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export default TransactionTypeComboboxInput
