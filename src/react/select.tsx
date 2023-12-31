import * as React from 'react'
export type Selectprops = {
	value: string
	label: string
}
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '../ui/select'

interface SelectedProps {
	label: string
	placeholder: string
	data: Array<Selectprops>
	onSelect?: (value: string) => void
	name?: string
	defaultValue?: string
}

function KibaSelect({
	data,
	label,
	placeholder,
	onSelect,
	name,
	defaultValue,
}: Readonly<SelectedProps>) {
	return (
		<Select
			defaultValue={defaultValue}
			name={name}
			onValueChange={(value) => (onSelect ? onSelect(value) : {})}
		>
			<SelectTrigger id={name}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>{label}</SelectLabel>
					{data.map((item) => (
						<SelectItem value={item.value} key={item.value}>
							{item.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}

export { KibaSelect }
