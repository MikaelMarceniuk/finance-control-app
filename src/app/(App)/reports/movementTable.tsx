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

const transactionTypesOptions = (
	Object.keys(ETransactionType) as Array<keyof typeof ETransactionType>
).map((key) => ({
	value: key,
	label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize
}))

const dateParams = {
	startDate: startOfMonth(new Date()),
	endDate: endOfMonth(new Date()),
}

const formSchema = z.object({
	dateRange: z.object({
		from: z.date(),
		to: z.date(),
	}),
	type: z.string(),
	category: z.string(),
})

type formType = z.infer<typeof formSchema>

const MovementTable: React.FC = () => {
	const { transactions } = useGetTransactions(dateParams)
	const { categories } = useGetCategory({})

	const form = useForm<formType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			dateRange: {
				from: undefined,
				to: undefined,
			},
			type: undefined,
			category: undefined,
		},
	})

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
							<FormItem className="col-span-2">
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
					{transactions.map((row) => (
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
							<TableCell>{moneyFormatter.format(row.amount / 100)}</TableCell>
							<TableCell>{row.Installments.length}</TableCell>
							<TableCell>
								{row.Installments.find((i) =>
									isWithinInterval(new Date(i.dueDate), {
										start: dateParams.startDate,
										end: dateParams.endDate,
									}),
								)?.number || (
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
