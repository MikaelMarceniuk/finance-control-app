import GetTransactionsApi, {
	GetTransactionsApiParams,
} from '@/api/getTransactions'
import getTransactionsWithoutInstallments from '@/lib/getTransactionsWithoutInstallments'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

const useGetTransactions = (params: Partial<GetTransactionsApiParams>) => {
	const { data: session } = useSession()

	const {
		data = [],
		error,
		isLoading,
		mutate,
	} = useSWR(['transaction', { ...params }], () =>
		GetTransactionsApi({
			...params,
			userId: session!.user.id,
		}),
	)

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
