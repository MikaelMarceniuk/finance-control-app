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

type ComboboxValue = {
	id: string
	name: string
}

type CategoryComboboxInput = {
	value: ComboboxValue
	handleOnChange: (data: { id: string; name: string } | undefined) => void
}

const CategoryComboboxInput: React.FC<CategoryComboboxInput> = ({
	value,
	handleOnChange,
}) => {
	const [open, setOpen] = React.useState(false)
	const [searchValue, setSearchValue] = React.useState('')
	const { categories, mutate } = useGetCategory()
	const { toast } = useToast()

	const handleCreateNewCategory = async () => {
		const apiResp = await AddCategoryApi({ name: searchValue })
		if (apiResp.isSuccess) {
			const { data: newCategory } = apiResp

			mutate({ isSuccess: true, data: [...categories, newCategory] })
			setSearchValue('')
			handleOnSelect(newCategory)(newCategory.id)
			return
		}

		toast({
			title: 'Erro ao criar categoria.',
			variant: 'destructive',
		})
	}

	const handleOnSelect =
		(category: ComboboxValue) => (selectedValue: string) => {
			handleOnChange(selectedValue == value?.id ? undefined : category)
			setOpen(false)
		}

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
						? categories.find((c) => c.id === value.id)?.name
						: 'Selecione uma categoria'}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput
						placeholder="Procurar..."
						value={searchValue}
						onInput={(e) => setSearchValue(e.target.value)}
					/>
					<CommandList>
						<CommandEmpty>
							<Button variant="secondary" onClick={handleCreateNewCategory}>
								Criar nova categoria
							</Button>
						</CommandEmpty>
						<CommandGroup>
							{categories.map((opt) => (
								<CommandItem
									key={opt.id}
									value={opt.id.toString()}
									onSelect={handleOnSelect(opt)}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === opt.id ? 'opacity-100' : 'opacity-0',
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
