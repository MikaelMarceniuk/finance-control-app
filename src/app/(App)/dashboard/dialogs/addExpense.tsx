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
import ComboboxInput from '@/components/ui/combobox'
import AddExpenseApi from '@/api/addExpenseApi'

const formSchema = z.object({
	description: z.string().min(0),
	amount: z.string(),
	date: z.date(),
	category: z.object({
		id: z.number(),
		label: z.string(),
	}),
	installmentAmout: z.coerce.number(),
})

type formData = z.infer<typeof formSchema>

const AddExpenseDialog = () => {
	const { toast } = useToast()

	const form = useForm<formData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: '',
			amount: 'R$ 0,00',
			date: new Date(),
			category: undefined,
			installmentAmout: 1,
		},
	})

	const onSubmit = async (data: formData) => {
		const formatedData = {
			...data,
			amount: Number(data.amount.replace(/\D/g, '')),
		}

		const apiResp = await AddExpenseApi(formatedData)
		if (apiResp.isSuccess) {
			form.reset()
			toast({
				title: 'Despesa salva com sucesso!',
				variant: 'success',
			})
			return
		}

		toast({
			title: 'Erro ao salvar despesa. Tente novamente mais tarde.',
			variant: 'destructive',
		})
	}

	const handleOnOpenChange = (isOpen: boolean) => {
		if (isOpen) form.reset()
	}

	return (
		<Dialog onOpenChange={handleOnOpenChange}>
			<DialogTrigger asChild>
				<Button variant={'destructive'} className="gap-2">
					<CircleMinus />
					Despesa
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Adicionar nova despesa</DialogTitle>
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

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Categoria</FormLabel>
										<FormControl>
											<ComboboxInput
												value={field.value}
												handleOnChange={field.onChange}
												options={[
													{ id: 1, label: 'Transporte' },
													{ id: 2, label: 'Diversao' },
													{ id: 3, label: 'Streaming' },
												]}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="installmentAmout"
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
						</div>

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

export default AddExpenseDialog
