'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
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
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useGetTransactionInfo from '@/hooks/useGetTransactionInfo'
import { useEffect } from 'react'
import moneyFormatter from '@/lib/moneyFormatter'
import UpdateTransactionApi from '@/api/updateTransactionApi'
import TransactionTypeComboboxInput from '@/components/ui/transactionTypeComboboxInput'
import { z } from 'zod'
import DeleteTransactionApi from '@/api/deleteTransactionApi'

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

	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const transactionId = searchParams.get('transaction') || undefined

	const { transaction } = useGetTransactionInfo({
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

	const typeWatcher = form.watch('type')
	const isInstallment = form.watch('isInstallment')

	const onSubmit = async (data: formData) => {
		// TODO Mutate swr cache
		const { success, data: parsedData } = formSchema.safeParse(data)

		if (!success) {
			toast({
				title: 'Verifique os dados e tente novamente!',
				variant: 'destructive',
			})
			return
		}

		if (parsedData.isEditMode) {
			try {
				await UpdateTransactionApi({
					id: transactionId!,
					description: parsedData.description,
					amount: Number(parsedData.amount.replace(/\D/g, '')),
					type: parsedData.type,
					date: parsedData.date,
					categoryId: parsedData.category,
				})
				toast({
					title: 'Movimentação atualizada com sucesso!',
					variant: 'success',
				})
				return handleOnClose()
			} catch (e) {
				toast({
					title: 'Erro ao atualizar a movimentação!',
					variant: 'destructive',
				})
				return
			}
		}
	}

	const handleOnDelete = async () => {
		// TODO Mutate swr cache
		try {
			await DeleteTransactionApi({
				id: transactionId!,
			})
			toast({
				title: 'Movimentação deletada com sucesso!',
				variant: 'success',
			})
			handleOnClose()
		} catch (e) {
			toast({
				title: 'Erro ao deletar a movimentação!',
				variant: 'destructive',
			})
		}
	}

	const handleOnClose = () => {
		const params = new URLSearchParams(searchParams.toString())
		params.delete('transaction')

		router.push(pathname + '?' + params.toString())
		form.reset()
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

						<div className="grid grid-cols-2 gap-4">
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
								name="type"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Tipo</FormLabel>
										<FormControl>
											<TransactionTypeComboboxInput
												value={field.value}
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

						{typeWatcher == 'expense' && (
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
						)}

						{isInstallment && typeWatcher == 'expense' && (
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

						<div className="flex justify-end gap-2">
							{isEditing && <Button type="submit">Atualizar</Button>}
							<Button
								type="button"
								variant="destructive"
								onClick={handleOnDelete}
							>
								Deletar
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default TransactionInfoDialog
