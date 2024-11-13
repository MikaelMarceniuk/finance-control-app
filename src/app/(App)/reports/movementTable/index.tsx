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
import React, { createContext, useCallback, useContext, useState } from 'react'
import { TransactionsOrderBy } from '@/api/getTransactions'
import { cn } from '@/lib/utils'
import CustomTableHead from './ui/tableHead'
import CategoryFilter from './ui/categoryFilter'
import TypeFilter from './ui/typeFilter'
import DateRangeFilter from './ui/dateRangeFilter'
import VisibilityBtn from './ui/visibilityBtn'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import TransactionInfoDialog from './transactionInfoDialog'
import { Skeleton } from '@/components/ui/skeleton'

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

interface IColumn {
	name: string
	field: string
	width?: string
	isSortable: boolean
}

const defineTableColumns = <T extends IColumn[]>(columns: T) => columns

const tableColumns = defineTableColumns([
	{
		name: 'Tipo',
		field: 'type',
		width: '6rem',
		isSortable: false,
	},
	{
		name: 'Descrição',
		field: 'description',
		width: '24rem',
		isSortable: false,
	},
	{
		name: 'Categoria',
		field: 'category',
		width: '10rem',
		isSortable: false,
	},
	{
		name: 'Valor',
		field: 'amount',
		width: '7rem',
		isSortable: true,
	},
	{
		name: 'Qtd de Parcelas',
		field: 'installmentAmount',
		width: '7rem',
		isSortable: false,
	},
	{
		name: 'Nro Parcela',
		field: 'installmentNumber',
		width: '7rem',
		isSortable: false,
	},
	{
		name: 'Data',
		field: 'date',
		isSortable: true,
	},
] as const)

type TableColumnFields = (typeof tableColumns)[number]['field']

export type movementTableFormType = z.infer<typeof formSchema>

export type HeaderAction = 'asc' | 'desc' | 'visibility'

export type HandleTableHeaderActionParams = {
	action: HeaderAction
	key: TableColumnFields
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
	columns: IColumn[]
}

const TableActionProvider = createContext({} as TableActionProviderType)

export const useTableActionProvider = () => useContext(TableActionProvider)

const MovementTable: React.FC = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()

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

	const { transactions, isLoading } = useGetTransactions({
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

		if (action == 'visibility') {
			newTableAction = {
				isVisible: {
					...tableAction.isVisible,
					[key]: !tableAction.isVisible[key],
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

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString())
			params.set(name, value)

			return params.toString()
		},
		[searchParams],
	)

	const tableData = getTransactionsWithoutInstallments(transactions)

	return (
		<React.Fragment>
			<TransactionInfoDialog />
			<TableActionProvider.Provider
				value={{
					handleOnAction: handleTableHeaderAction,
					values: tableAction,
					columns: tableColumns,
				}}
			>
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
						<TableHeader>
							<TableRow>
								{tableColumns.map((column) => (
									<CustomTableHead
										key={column.field}
										isVisible={tableAction.isVisible[column.field]}
										{...column}
									/>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ||
								(tableData.length == 0 &&
									Array.from({ length: 6 }).map((_, i) => (
										<TableRow key={i}>
											<TableCell>
												<Skeleton className="h-4 w-12 rounded-full" />
											</TableCell>

											<TableCell>
												<Skeleton className="h-6 w-96 rounded-full" />
											</TableCell>

											<TableCell>
												<Skeleton className="h-4 w-16 rounded-full" />
											</TableCell>

											<TableCell>
												<Skeleton className="h-6 w-20 rounded-full" />
											</TableCell>

											<TableCell>
												<Skeleton className="h-6 w-20 rounded-full" />
											</TableCell>

											<TableCell>
												<Skeleton className="h-6 w-28 rounded-full" />
											</TableCell>

											<TableCell>
												<Skeleton className="h-6 w-28 rounded-full" />
											</TableCell>
										</TableRow>
									)))}

							{tableData.map((row) => {
								const { isVisible } = tableAction

								return (
									<TableRow
										key={row.id}
										className="cursor-pointer"
										onClick={() =>
											router.push(
												pathname +
													'?' +
													createQueryString('transaction', row.id),
											)
										}
									>
										<TableCell
											className={cn(
												isVisible.type ? 'table-cell' : 'hidden',
												'w-24',
											)}
										>
											<Badge
												variant={
													row.type == 'expense' ? 'destructive' : 'revenue'
												}
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
											className={cn(
												isVisible.amount ? 'flex' : 'hidden',
												'w-28',
											)}
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
			</TableActionProvider.Provider>
		</React.Fragment>
	)
}

export default MovementTable
