// TODO Handle installments expenses

'use client'

import { Badge } from '@/components/ui/badge'
import { DateRangePicker } from '@/components/ui/dateRangePicker'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import moneyFormatter from '@/lib/moneyFormatter'
import { zodResolver } from '@hookform/resolvers/zod'
import { endOfMonth, format, isWithinInterval, startOfMonth } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Combobox from '@/components/ui/combobox'
import useGetCategory from '@/hooks/useGetCategory'
import useGetTransactions from '@/hooks/useGetTransactions'
import { ETransactionType } from '@prisma/client'
import getTransactionsWithoutInstallments from '@/lib/getTransactionsWithoutInstallments'

const transactionTypesOptions = (
	Object.keys(ETransactionType) as Array<keyof typeof ETransactionType>
).map((key) => ({
	value: key,
	label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize
}))

const formSchema = z.object({
	dateRange: z.object({
		from: z.date(),
		to: z.date(),
	}),
	type: z.enum(['expense', 'revenue']).optional(),
	category: z.string().optional(),
})

const formDefaultValues = {
	dateRange: {
		from: startOfMonth(new Date()),
		to: endOfMonth(new Date()),
	},
	type: undefined,
	category: undefined,
}

type formType = z.infer<typeof formSchema>

const MovementTable: React.FC = () => {
	const form = useForm<formType>({
		resolver: zodResolver(formSchema),
		defaultValues: formDefaultValues,
	})

	const typeWatcher = form.watch('type')
	const categoryWatcher = form.watch('category')
	const dateWatcher = form.watch('dateRange')

	const { transactions } = useGetTransactions({
		startDate: form.watch('dateRange.from'),
		endDate: form.watch('dateRange.to'),
		type: typeWatcher == '' ? undefined : typeWatcher,
		categoryId: categoryWatcher == '' ? undefined : categoryWatcher,
	})
	const { categories } = useGetCategory({})

	const intervalValues = {
		start: dateWatcher.from,
		end: dateWatcher.to,
	}

	const tableData = getTransactionsWithoutInstallments(transactions)
	// .filter((e) => {
	// 	// Return all expenses that has installments
	// 	if (e.Installments.length > 0) {
	// 		return e.Installments.find((i) =>
	// 			isWithinInterval(new Date(i.dueDate), intervalValues),
	// 		)
	// 	}

	// 	return isWithinInterval(new Date(e.date), intervalValues)
	// })
	// .map((e) => {
	// 	if (e.Installments.length > 0) {
	// 		const monthInstallment = e.Installments.find((i) =>
	// 			isWithinInterval(new Date(i.dueDate), intervalValues),
	// 		)

	// 		return monthInstallment
	// 	}

	// 	return e
	// })

	console.log('tableData: ', tableData)

	return (
		<div className="space-y-4">
			<Form {...form}>
				<form className="grid grid-cols-12 gap-6">
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem className="col-span-2">
								<FormLabel>Tipo de Movimentação</FormLabel>
								<FormControl>
									<Combobox
										label="Selecionar tipo..."
										searchLabel="Procurar..."
										emptyLabel="Nenhum dado encontrado"
										options={transactionTypesOptions}
										value={field.value}
										handleOnChange={field.onChange}
									/>
								</FormControl>
								<FormDescription />
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="category"
						render={({ field }) => (
							<FormItem className="col-span-2">
								<FormLabel>Categoria</FormLabel>
								<FormControl>
									<Combobox
										label="Selecionar categoria..."
										searchLabel="Procurar..."
										emptyLabel="Nenhuma categoria encontrada"
										options={categories.map((c) => ({
											label: c.name,
											value: c.id,
										}))}
										value={field.value}
										handleOnChange={field.onChange}
									/>
								</FormControl>
								<FormDescription />
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="dateRange"
						render={({ field }) => (
							<FormItem className="col-span-4">
								<FormLabel>Intervalo de datas</FormLabel>
								<FormControl>
									<DateRangePicker
										date={field.value}
										onDateChange={field.onChange}
									/>
								</FormControl>
								<FormDescription />
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Tipo</TableHead>
						<TableHead>Descrição</TableHead>
						<TableHead>Categoria</TableHead>
						<TableHead>Valor</TableHead>
						<TableHead>Qtd de parcelas</TableHead>
						<TableHead>N. Parcela</TableHead>
						<TableHead>Data</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tableData.map((row) => (
						<TableRow key={row.id}>
							<TableCell>
								<Badge
									variant={row.type == 'expense' ? 'destructive' : 'revenue'}
								>
									{row.type == 'expense' ? 'Despesa' : 'Receita'}
								</Badge>
							</TableCell>
							<TableCell>
								{row.description || (
									<span className="text-gray-600">Sem descrição</span>
								)}
							</TableCell>
							<TableCell>
								<Badge variant="secondary">
									{categories.find((c) => c.id == row.categoryId)?.name}
								</Badge>
							</TableCell>
							<TableCell>
								{row.type == 'expense' && '-'}{' '}
								{moneyFormatter.format(row.amount / 100)}
							</TableCell>
							<TableCell>
								{row.type == 'revenue'
									? 'A vista'
									: row.installmentAmount == 1
										? 'A vista'
										: row.installmentAmount}
							</TableCell>
							<TableCell>
								{row.installmentNumber || (
									<span className="text-gray-600">Sem parcelas</span>
								)}
							</TableCell>
							<TableCell>{format(new Date(row.date), 'dd/MM/yyyy')}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

export default MovementTable
