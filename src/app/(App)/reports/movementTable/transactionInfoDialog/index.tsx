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
import useGetTransactions from '@/hooks/useGetTransactions'
import useGetTransactionInfo from '@/hooks/useGetTransactionInfo'
import { useEffect, useState } from 'react'
import moneyFormatter from '@/lib/moneyFormatter'

const formSchema = z.object({
	description: z.string().min(0),
	amount: z.string(),
	type: z.enum(['revenue', 'expense']),
	date: z.date(),
	category: z.string(),
	isInstallment: z.boolean(),
	installmentAmount: z.coerce.number(),
	isEditMode: z.boolean(),
})

type formData = Partial<z.infer<typeof formSchema>>

const TransactionInfoDialog: React.FC = () => {
	const { toast } = useToast()
	const { mutate } = useSWRConfig()

	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const transactionId = searchParams.get('transaction') || undefined

	const { transaction, isLoading } = useGetTransactionInfo({
		id: transactionId,
	})

	const form = useForm<formData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			isEditMode: false,
		},
	})

	const isEditing = form.watch('isEditMode')

	useEffect(() => {
		if (!transaction) return

		const digits = String(transaction.amount).replace(/\D/g, '')
		const formatedAmount = moneyFormatter.format(Number(digits) / 100)

		form.setValue('description', transaction.description)
		form.setValue('amount', formatedAmount)
		form.setValue('type', transaction.type)
		form.setValue('date', transaction.date)
		form.setValue('category', transaction.categoryId)
		form.setValue('isInstallment', transaction.isInstallment)
		form.setValue('installmentAmount', Number(transaction.installmentAmount))
	}, [form, transaction])

	const isInstallment = form.watch('isInstallment')

	const onSubmit = async (data: formData) => {}

	const handleOnClose = () => {
		const params = new URLSearchParams(searchParams.toString())
		params.delete('transaction')

		router.push(pathname + '?' + params.toString())
	}

	return (
		<Dialog open={Boolean(transactionId)}>
			<DialogContent onCloseHandler={handleOnClose}>
				<DialogHeader>
					<DialogTitle>Informações da movimentação</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="isEditMode"
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
											Editar movimentação?
										</label>
									</div>
								</FormItem>
							)}
						/>

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
												isDisabled={!isEditing}
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
												isDisabled={!isEditing}
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
											type={transaction?.type}
											value={field.value}
											handleOnChange={field.onChange}
											isDisabled={!isEditing}
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
										<Textarea {...field} rows={2} disabled={!isEditing} />
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
												disabled={!isEditing}
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
											<Input
												{...field}
												type="number"
												step={1}
												min={1}
												disabled={!isEditing}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{isEditing && <Button type="submit">Atualizar</Button>}
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default TransactionInfoDialog
