import Combobox from '@/components/ui/combobox'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { ETransactionType } from '@prisma/client'
import { useFormContext } from 'react-hook-form'
import { movementTableFormType } from '..'

const transactionTypesOptions = (
	Object.keys(ETransactionType) as Array<keyof typeof ETransactionType>
).map((key) => ({
	value: key,
	label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize
}))

const TypeFilter: React.FC = () => {
	const { control } = useFormContext<movementTableFormType>()

	return (
		<FormField
			control={control}
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
	)
}

export default TypeFilter
