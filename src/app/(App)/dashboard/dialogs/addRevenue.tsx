'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { CirclePlus } from 'lucide-react'
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
import CategoryComboboxInput from '@/components/ui/categoryComboboxInput'
import AddTransactionApi from '@/api/addTransactionApi'
import { useSWRConfig } from 'swr'
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from 'date-fns'

const formSchema = z.object({
	description: z.string().min(0),
	amount: z.string(),
	type: z.enum(['revenue', 'expense']),
	date: z.date(),
	category: z.string(),
	hasInstallment: z.boolean(),
})

type formData = z.infer<typeof formSchema>

const AddRevenueDialog = () => {
	const { toast } = useToast()
	const { mutate } = useSWRConfig()

	const form = useForm<formData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: '',
			amount: 'R$ 0,00',
			type: 'revenue',
			date: new Date(),
			category: undefined,
			hasInstallment: false,
		},
	})

	const onSubmit = async (data: formData) => {
		await AddTransactionApi({
			transactionData: {
				description: data.description,
				amount: Number(data.amount.replace(/\D/g, '')),
				type: 'revenue',
				date: data.date,
				categoryId: data.category,
			},
			hasInstallment: data.hasInstallment,
			installmentAmount: 0,
		})

		const monthParams = {
			startDate: startOfMonth(new Date()),
			endDate: endOfMonth(new Date()),
		}

		mutate(['transaction', { ...monthParams }]) // currentBalance
		mutate(['transaction', { ...monthParams, type: 'expense' }]) // totalExpenses
		mutate(['transaction', { ...monthParams, type: 'revenue' }]) // totalRevenue
		mutate(['transaction', { ...monthParams, type: 'revenue' }]) // ExpensesByCategoryInMonthChart
		mutate([
			'transaction',
			{ startDate: startOfYear(new Date()), endDate: endOfYear(new Date()) },
		]) // RevenueAndExpensesInMonthChart

		form.reset()
		toast({
			title: 'Receita salva com sucesso!',
			variant: 'success',
		})
	}

	const handleOnOpenChange = (isOpen: boolean) => {
		if (isOpen) form.reset()
	}

	return (
		<Dialog onOpenChange={handleOnOpenChange}>
			<DialogTrigger asChild>
				<Button
					variant={'default'}
					className="gap-2 bg-green-800 text-white hover:bg-green-800/90"
				>
					<CirclePlus />
					Receita
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Adicionar nova receita</DialogTitle>
				</DialogHeader>
				<Form {...form}>
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
											type="revenue"
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

						<Button type="submit">Adicionar</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default AddRevenueDialog
