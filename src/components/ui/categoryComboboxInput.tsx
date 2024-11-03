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
import AddCategoryApi from '@/api/addCategoryApi'
import useGetCategory from '@/hooks/useGetCategory'
import { useToast } from '@/hooks/use-toast'
import { ETransactionType } from '@prisma/client'

type CategoryComboboxInput = {
	type: ETransactionType
	value: string
	handleOnChange: (data: string | undefined) => void
	isDisabled?: boolean
}

const CategoryComboboxInput: React.FC<CategoryComboboxInput> = ({
	type,
	value,
	handleOnChange,
	isDisabled = false,
}) => {
	const [open, setOpen] = React.useState(false)
	const [searchValue, setSearchValue] = React.useState('')
	const { categories, mutate } = useGetCategory({ type })
	const { toast } = useToast()

	const handleCreateNewCategory = async () => {
		try {
			const newCategory = await AddCategoryApi({ type, name: searchValue })

			mutate([...categories, newCategory])
			setSearchValue('')
			handleOnSelect(newCategory.id)(newCategory.id)
		} catch (e) {
			console.log('E: ', e)
			toast({
				title: 'Erro ao criar categoria.',
				variant: 'destructive',
			})
		}
	}

	const handleOnSelect = (categoryId: string) => (selectedValue: string) => {
		handleOnChange(selectedValue == value ? undefined : categoryId)
		setOpen(false)
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
					{value
						? categories.find((c) => c.id === value)?.name
						: 'Selecione uma categoria'}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0">
				<Command>
					<CommandInput
						placeholder="Procurar..."
						value={searchValue}
						onInput={(e) => setSearchValue(e.currentTarget.value)}
					/>
					<CommandList>
						<CommandEmpty>
							{searchValue == '' ? (
								'Nenhuma categoria encontrada.'
							) : (
								<Button variant="secondary" onClick={handleCreateNewCategory}>
									Criar nova categoria
								</Button>
							)}
						</CommandEmpty>
						<CommandGroup>
							{categories.map((opt) => (
								<CommandItem
									key={opt.id}
									value={opt.id.toString()}
									onSelect={handleOnSelect(opt.id)}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value == opt.id ? 'opacity-100' : 'opacity-0',
										)}
									/>
									{opt.name}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export default CategoryComboboxInput
