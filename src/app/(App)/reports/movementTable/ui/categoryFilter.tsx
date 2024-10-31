'use client'

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import useGetCategory from '@/hooks/useGetCategory'
import { useFormContext } from 'react-hook-form'
import { movementTableFormType } from '.'
import { useState } from 'react'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import useGetTransactions from '@/hooks/useGetTransactions'

const CategoryFilter = () => {
	const [open, setOpen] = useState(false)
	const { categories } = useGetCategory({})
	const form = useFormContext<movementTableFormType>()

	const dateRangeWatcher = form.getValues('dateRange')

	const { transactions } = useGetTransactions({
		startDate: dateRangeWatcher.from,
		endDate: dateRangeWatcher.to,
	})

	const handleOnSelect = (selectedVal: string) => {
		const currentValue = form.getValues('category')
		const newValue = currentValue ? [...currentValue] : []
		const valueAlreadySelectedIndex = newValue.findIndex(
			(v) => v == selectedVal,
		)

		if (valueAlreadySelectedIndex != -1) {
			newValue.splice(valueAlreadySelectedIndex, 1)
		} else {
			newValue.push(selectedVal)
		}

		form.setValue('category', newValue)
	}

	const handleOnReset = () => form.setValue('category', [])

	return (
		<FormField
			control={form.control}
			name="category"
			render={({ field: { value } }) => (
				<FormItem className="col-span-2">
					<FormLabel>Categoria</FormLabel>
					<FormControl>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={open}
									className="w-full justify-start gap-4 border-dashed px-2"
								>
									{value.length == 0 && 'Selecionar categoria...'}
									{value.length > 0 && value.length < 3 && (
										<div className="space-x-2">
											{value.map((v) => (
												<Badge key={v} variant={'secondary'}>
													{categories.find((c) => c.id == v)?.name}
												</Badge>
											))}
										</div>
									)}
									{value.length >= 3 && (
										<Badge>{value.length} Selecionados</Badge>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[200px] p-0">
								<Command>
									<CommandInput placeholder="Procurar..." className="h-9" />
									<CommandList>
										<CommandEmpty>Categoria não encontrada</CommandEmpty>
										<CommandGroup>
											{categories.map((opt) => (
												<CommandItem
													key={opt.id}
													value={opt.id}
													onSelect={handleOnSelect}
													className="justify-between"
												>
													<div className="flex items-center gap-2">
														<Checkbox
															checked={Boolean(value.find((v) => v == opt.id))}
														/>
														{opt.name}
													</div>
													<span>
														{
															transactions.filter((t) => t.categoryId == opt.id)
																.length
														}
													</span>
												</CommandItem>
											))}
										</CommandGroup>
										{value.length > 1 && (
											<CommandGroup>
												<Separator />
												<CommandItem
													className="mt-2 cursor-pointer justify-center"
													onSelect={handleOnReset}
												>
													Limpar filtros
												</CommandItem>
											</CommandGroup>
										)}
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</FormControl>
				</FormItem>
			)}
		/>
	)
}

export default CategoryFilter
