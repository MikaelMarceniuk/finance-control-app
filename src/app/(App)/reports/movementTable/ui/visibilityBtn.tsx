import { Button } from '@/components/ui/button'
import { Settings2 } from 'lucide-react'

const VisibilityBtn: React.FC = () => {
	return (
		<div className="mb-2 self-end pl-2">
			<Button variant="outline" type="button">
				<Settings2 size={16} className="mr-2" />
				Visualização
			</Button>
		</div>
	)
}

export default VisibilityBtn
