import { Input } from '../ui/input' // Shandcn UI Input

// Brazilian currency config
const moneyFormatter = Intl.NumberFormat('pt-BR', {
	currency: 'BRL',
	currencyDisplay: 'symbol',
	currencySign: 'standard',
	style: 'currency',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

type CurrencyInputProps = {
	value: string
	onHandleChange: (value: string) => void
	isDisabled?: boolean
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
	value,
	onHandleChange,
	isDisabled = false,
}) => {
	return (
		<Input
			type="text"
			onChange={(ev) => {
				const digits = ev.target.value.replace(/\D/g, '')
				const formatedValue = moneyFormatter.format(Number(digits) / 100)
				onHandleChange(formatedValue)
			}}
			value={value}
			disabled={isDisabled}
		/>
	)
}

export default CurrencyInput
