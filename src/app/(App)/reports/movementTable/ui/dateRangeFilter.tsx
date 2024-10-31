import { useFormContext } from 'react-hook-form'
import { movementTableFormType } from '..'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { DateRangePicker } from '@/components/ui/dateRangePicker'

const DateRangeFilter: React.FC = () => {
	const { control } = useFormContext<movementTableFormType>()

	return (
		<FormField
			control={control}
			name="dateRange"
			render={({ field }) => (
				<FormItem className="col-span-3">
					<FormLabel>Intervalo de datas</FormLabel>
					<FormControl>
						<DateRangePicker date={field.value} onDateChange={field.onChange} />
					</FormControl>
					<FormDescription />
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export default DateRangeFilter
