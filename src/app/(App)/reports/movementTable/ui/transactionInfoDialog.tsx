'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { CircleMinus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import DatePicker from '@/components/ui/datePicker'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import CurrencyInput from '@/components/ui/currencyInput'
import { Input } from '@/components/ui/input'
import CategoryComboboxInput from '@/components/ui/categoryComboboxInput'
import { Checkbox } from '@/components/ui/checkbox'
import AddTransactionApi from '@/api/addTransactionApi'
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from 'date-fns'
import { useSWRConfig } from 'swr'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const formSchema = z.object({
	description: z.string().min(0),
	amount: z.string(),
	type: z.enum(['revenue', 'expense']),
	date: z.date(),
	category: z.string(),
	isInstallment: z.boolean(),
	installmentAmount: z.coerce.number(),
})

type formData = z.infer<typeof formSchema>

const TransactionInfoDialog: React.FC = () => {
	const { toast } = useToast()
	const { mutate } = useSWRConfig()

	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const form = useForm<formData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: '',
			amount: 'R$ 0,00',
			type: 'expense',
			date: new Date(),
			category: undefined,
			isInstallment: false,
			installmentAmount: 1,
		},
	})

	// const isInstallment = form.watch('isInstallment')

	// const onSubmit = async (data: formData) => {
	// 	await AddTransactionApi({
	// 		description: data.description,
	// 		amount: Number(data.amount.replace(/\D/g, '')),
	// 		type: 'expense',
	// 		date: data.date,
	// 		categoryId: data.category,
	// 		isInstallment: data.isInstallment,
	// 		installmentAmount: data.installmentAmount,
	// 	})

	// 	const monthParams = {
	// 		startDate: startOfMonth(new Date()),
	// 		endDate: endOfMonth(new Date()),
	// 	}

	// 	mutate(['transaction', { ...monthParams }]) // currentBalance
	// 	mutate(['transaction', { ...monthParams, type: 'expense' }]) // totalExpenses
	// 	mutate(['transaction', { ...monthParams, type: 'revenue' }]) // ExpensesByCategoryInMonthChart
	// 	mutate([
	// 		'transaction',
	// 		{ startDate: startOfYear(new Date()), endDate: endOfYear(new Date()) },
	// 	]) // RevenueAndExpensesInMonthChart

	// 	form.reset()
	// 	toast({
	// 		title: 'Despesa salva com sucesso!',
	// 		variant: 'success',
	// 	})
	// }

	const handleOnClose = () => {
		const params = new URLSearchParams(searchParams.toString())
		params.delete('transaction')

		router.push(pathname + '?' + params.toString())
	}

	return (
		<Dialog open={Boolean(searchParams.get('transaction'))}>
			<DialogContent onCloseHandler={handleOnClose}>
				<DialogHeader>
					<DialogTitle>Informações da movimentação</DialogTitle>
				</DialogHeader>
				{/* <Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Valor</FormLabel>
										<FormControl>
											<CurrencyInput
												value={field.value}
												onHandleChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Data</FormLabel>
										<FormControl>
											<DatePicker
												date={field.value}
												handleOnChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Categoria</FormLabel>
									<FormControl>
										<CategoryComboboxInput
											type="expense"
											value={field.value}
											handleOnChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição</FormLabel>
									<FormControl>
										<Textarea {...field} rows={2} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isInstallment"
							render={({ field }) => (
								<FormItem>
									<div className="items-top flex space-x-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
											Despesa foi parcelada?
										</label>
									</div>
								</FormItem>
							)}
						/>

						{isInstallment && (
							<FormField
								control={form.control}
								name="installmentAmount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Quantidade de parcelas</FormLabel>
										<FormControl>
											<Input {...field} type="number" step={1} min={1} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<Button type="submit">Adicionar</Button>
					</form>
				</Form> */}
			</DialogContent>
		</Dialog>
	)
}

export default TransactionInfoDialog
