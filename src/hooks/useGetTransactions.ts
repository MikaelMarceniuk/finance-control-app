import GetTransactionsApi, {
	GetTransactionsApiParams,
} from '@/api/getTransactions'
import getTransactionsWithoutInstallments from '@/lib/getTransactionsWithoutInstallments'
import useSWR from 'swr'

const useGetTransactions = (params: GetTransactionsApiParams) => {
	const {
		data = [],
		error,
		isLoading,
		mutate,
	} = useSWR(['transaction', { ...params }], () => GetTransactionsApi(params))

	const totalAmount =
		getTransactionsWithoutInstallments(data).reduce((acc, { type, amount }) => {
			return type == 'revenue' ? (acc += amount) : (acc -= amount)
		}, 0) || 0

	return {
		transactions: data,
		totalAmount,
		isLoading,
		isError: Boolean(error),
		error,
		mutate,
	}
}

export default useGetTransactions
