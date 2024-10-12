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
import useGetExpense from '@/hooks/useGetExpense'
import useGetRevenue from '@/hooks/useGetRevenue'
import moneyFormatter from '@/lib/moneyFormatter'
import { zodResolver } from '@hookform/resolvers/zod'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Combobox from '@/components/ui/combobox'
import useGetCategory from '@/hooks/useGetCategory'

const tipoMovimentacaoOptions = [
	{
		value: 'revenue',
		label: 'Receita',
	},
	{
		value: 'expense',
		label: 'Despesa',
	},
]

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
	const { revenue } = useGetRevenue(dateParams)
	const { expenses } = useGetExpense(dateParams)
	const { categories } = useGetCategory()

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

	form.watch('type')

	const tableData = [...revenue, ...expenses]

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
										options={tipoMovimentacaoOptions}
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
					{tableData.map((row) => (
						<TableRow key={row.id}>
							<TableCell>
								<Badge variant={row.category ? 'destructive' : 'revenue'}>
									{row.category ? 'Despesa' : 'Receita'}
								</Badge>
							</TableCell>
							<TableCell>
								{row.description || (
									<span className="text-gray-600">Sem descrição</span>
								)}
							</TableCell>
							<TableCell>
								{row.category ? (
									<Badge variant="secondary">{row.category.name}</Badge>
								) : (
									<span className="text-gray-600">Sem categoria</span>
								)}
							</TableCell>
							<TableCell>{moneyFormatter.format(row.amount / 100)}</TableCell>
							<TableCell>
								{row.installmentAmout || (
									<span className="text-gray-600">Sem parcela</span>
								)}
							</TableCell>
							<TableCell>
								{row.installment || (
									<span className="text-gray-600">Sem parcela</span>
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
