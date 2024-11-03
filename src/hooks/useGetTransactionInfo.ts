import GetTransactionInfo, {
	GetTransactionInfoParams,
} from '@/api/getTransactionInfo'
import useSWR from 'swr'

const useGetTransactionInfo = ({ id }: Partial<GetTransactionInfoParams>) => {
	const isIdValid = Boolean(id)

	const { data, error, isLoading, mutate } = useSWR(
		['transaction', id],
		() => {
			if (!id) return null
			return GetTransactionInfo({ id })
		},
		{
			revalidateIfStale: isIdValid,
			revalidateOnFocus: isIdValid,
			revalidateOnReconnect: isIdValid,
		},
	)

	return {
		transaction: data,
		isLoading,
		isError: Boolean(error),
		error,
		mutate,
	}
}

export default useGetTransactionInfo
