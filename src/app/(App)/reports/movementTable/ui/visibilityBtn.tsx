'use client'

import { Button } from '@/components/ui/button'
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Check, Settings2 } from 'lucide-react'
import { useState } from 'react'
import { useTableActionProvider } from '..'
import { cn } from '@/lib/utils'

const VisibilityBtn: React.FC = () => {
	const { handleOnAction, values, columns } = useTableActionProvider()
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger className="mb-2 self-end pl-2">
				<div>
					<Button variant="outline" type="button">
						<Settings2 size={16} className="mr-2" />
						Visualização
					</Button>
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandGroup className="p-2 text-center">
						<span className="text-sm font-bold">Visualização das colunas</span>
					</CommandGroup>
					<CommandSeparator />
					<CommandList>
						<CommandGroup>
							{columns.map((c) => (
								<CommandItem
									className="flex gap-2"
									key={c.field}
									onSelect={() =>
										handleOnAction({
											action: 'visibility',
											key: c.field,
										})
									}
								>
									<Check
										size={16}
										className={cn(
											values.isVisible[c.field]
												? 'text-muted-foreground'
												: 'text-transparent',
										)}
									/>
									{c.name}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export default VisibilityBtn
