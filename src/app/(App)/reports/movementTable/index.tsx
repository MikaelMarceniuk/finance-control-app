'use client'

import { Badge } from '@/components/ui/badge'
import { Form } from '@/components/ui/form'
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import moneyFormatter from '@/lib/moneyFormatter'
import { zodResolver } from '@hookform/resolvers/zod'
import { endOfDay, endOfMonth, format, startOfMonth } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import useGetCategory from '@/hooks/useGetCategory'
import useGetTransactions from '@/hooks/useGetTransactions'
import getTransactionsWithoutInstallments from '@/lib/getTransactionsWithoutInstallments'
import { createContext, useContext, useState } from 'react'
import { TransactionsOrderBy } from '@/api/getTransactions'
import { cn } from '@/lib/utils'
import CustomTableHead from './ui/tableHead'
import CategoryFilter from './ui/categoryFilter'
import TypeFilter from './ui/typeFilter'
import DateRangeFilter from './ui/dateRangeFilter'
import VisibilityBtn from './ui/visibilityBtn'

const formSchema = z.object({
	dateRange: z.object({
		from: z.date(),
		to: z.date(),
	}),
	type: z.enum(['expense', 'revenue']).optional(),
	category: z.array(z.string()),
})

const formDefaultValues = {
	dateRange: {
		from: startOfMonth(new Date()),
		to: endOfMonth(new Date()),
	},
	type: undefined,
	category: [],
}

export type movementTableFormType = z.infer<typeof formSchema>

export type HeaderAction = 'asc' | 'desc' | 'hide'

export type HandleTableHeaderActionParams = {
	action: HeaderAction
	key: 'amount' | 'date'
}

type TableActionsType = {
	orderBy?: TransactionsOrderBy
	isVisible: {
		type: boolean
		description: boolean
		category: boolean
		amount: boolean
		installmentAmount: boolean
		installmentNumber: boolean
		date: boolean
	}
}

type TableActionProviderType = {
	handleOnAction: (action: HandleTableHeaderActionParams) => void
	values: TableActionsType
}

const TableActionProvider = createContext({} as TableActionProviderType)

export const useTableActionProvider = () => useContext(TableActionProvider)

const MovementTable: React.FC = () => {
	const form = useForm<movementTableFormType>({
		resolver: zodResolver(formSchema),
		defaultValues: formDefaultValues,
	})

	const [tableAction, setTableAction] = useState<TableActionsType>({
		isVisible: {
			type: true,
			description: true,
			category: true,
			amount: true,
			installmentAmount: true,
			installmentNumber: true,
			date: true,
		},
		orderBy: {
			date: 'asc',
		},
	})

	const typeWatcher = form.watch('type')
	const categoryWatcher = form.watch('category')
	const dateWatcher = form.watch('dateRange')

	const { transactions } = useGetTransactions({
		startDate: dateWatcher.from,
		endDate: endOfDay(dateWatcher.to),
		type: typeWatcher,
		categoryId: categoryWatcher.length == 0 ? undefined : categoryWatcher,
		orderBy: tableAction.orderBy,
	})
	const { categories } = useGetCategory({})

	const handleTableHeaderAction = ({
		action,
		key,
	}: HandleTableHeaderActionParams) => {
		if (!action) return

		let newTableAction: TableActionsType

		if (action == 'hide') {
			newTableAction = {
				isVisible: {
					...tableAction.isVisible,
					[key]: false,
				},
				orderBy: { ...tableAction.orderBy },
			}
		}

		if (action == 'asc' || action == 'desc') {
			newTableAction = {
				isVisible: { ...tableAction.isVisible },
				orderBy: {
					[key]: action,
				},
			}
		}

		setTableAction(newTableAction!)
	}

	const tableData = getTransactionsWithoutInstallments(transactions)

	return (
		<div className="space-y-4">
			<Form {...form}>
				<form className="grid grid-cols-12 space-x-2">
					<TypeFilter />
					<CategoryFilter />
					<DateRangeFilter />
					<VisibilityBtn />
				</form>
			</Form>

			<Table>
				<TableActionProvider.Provider
					value={{
						handleOnAction: handleTableHeaderAction,
						values: tableAction,
					}}
				>
					<TableHeader>
						<TableRow>
							<CustomTableHead
								name="Tipo"
								isVisible={tableAction.isVisible.type}
								className="w-24"
							/>
							<CustomTableHead
								name="Descrição"
								isVisible={tableAction.isVisible.description}
								className="w-96"
							/>
							<CustomTableHead
								name="Categoria"
								isVisible={tableAction.isVisible.category}
								className="w-40"
							/>
							<CustomTableHead
								name="Valor"
								orderByKey="amount"
								isVisible={tableAction.isVisible.amount}
								isSortable
								className="w-28"
							/>
							<CustomTableHead
								name="Qtd de parcelas"
								isVisible={tableAction.isVisible.installmentAmount}
								className="w-28"
							/>
							<CustomTableHead
								name="Nro Parcela"
								isVisible={tableAction.isVisible.installmentNumber}
								className="w-28"
							/>
							<CustomTableHead
								name="Data"
								orderByKey="date"
								isVisible={tableAction.isVisible.date}
								isSortable
							/>
						</TableRow>
					</TableHeader>
				</TableActionProvider.Provider>
				<TableBody>
					{tableData.map((row) => {
						const { isVisible } = tableAction

						return (
							<TableRow key={row.id} className="w-24">
								<TableCell
									className={cn(
										isVisible.type ? 'table-cell' : 'hidden',
										'w-24',
									)}
								>
									<Badge
										variant={row.type == 'expense' ? 'destructive' : 'revenue'}
									>
										{row.type == 'expense' ? 'Despesa' : 'Receita'}
									</Badge>
								</TableCell>

								<TableCell
									className={cn(
										isVisible.description ? 'table-cell' : 'hidden',
										'w-96',
									)}
								>
									{row.description || (
										<span className="text-gray-600">Sem descrição</span>
									)}
								</TableCell>

								<TableCell
									className={cn(
										isVisible.category ? 'table-cell' : 'hidden',
										'w-40',
									)}
								>
									<Badge variant="secondary">
										{categories.find((c) => c.id == row.categoryId)?.name}
									</Badge>
								</TableCell>

								<TableCell
									className={cn(isVisible.amount ? 'flex' : 'hidden', 'w-28')}
								>
									{row.type == 'expense' && '-'}{' '}
									{moneyFormatter.format(row.amount / 100)}
								</TableCell>

								<TableCell
									className={cn(
										isVisible.installmentAmount ? 'table-cell' : 'hidden',
										'w-28',
									)}
								>
									{row.type == 'revenue'
										? 'A vista'
										: row.installmentAmount == 1
											? 'A vista'
											: row.installmentAmount}
								</TableCell>

								<TableCell
									className={cn(
										isVisible.installmentNumber ? 'table-cell' : 'hidden',
										'w-28',
									)}
								>
									{row.installmentNumber || (
										<span className="text-gray-600">Sem parcelas</span>
									)}
								</TableCell>

								<TableCell
									className={cn(isVisible.date ? 'table-cell' : 'hidden')}
								>
									{format(new Date(row.date), 'dd/MM/yyyy')}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}

export default MovementTable
