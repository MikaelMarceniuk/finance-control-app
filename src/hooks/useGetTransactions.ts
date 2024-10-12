import GetTransactionsApi, {
	GetTransactionsApiParams,
} from '@/api/getTransactions'
import { isWithinInterval } from 'date-fns'
import useSWR from 'swr'

const useGetTransactions = (params: GetTransactionsApiParams) => {
	const { data, error, isLoading, mutate } = useSWR(
		['transaction', { ...params }],
		() => GetTransactionsApi(params),
	)

	const totalAmount =
		data?.reduce((acc, { type, amount, Installments }) => {
			if (type == 'revenue') {
				return (acc += amount)
			}

			// Will only check for the last installment if there is date filters
			const { startDate, endDate } = params
			if (startDate && endDate && Installments.length > 0) {
				const installmentBetweenDateParams = Installments.filter((i) =>
					isWithinInterval(new Date(i.dueDate), {
						start: startDate,
						end: endDate,
					}),
				)
				const installmentAmount = installmentBetweenDateParams.reduce(
					(acc, { amount }) => acc + amount,
					0,
				)

				return (acc -= installmentAmount)
			}

			return (acc -= amount)
		}, 0) || 0

	return {
		transactions: data || [],
		totalAmount,
		isLoading,
		isError: Boolean(error),
		error,
		mutate,
	}
}

export default useGetTransactions
