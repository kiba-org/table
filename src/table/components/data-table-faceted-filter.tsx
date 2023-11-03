import * as React from 'react'
import { Badge } from '#src/ui/badge.tsx'
import { Button } from '#src/ui/button.tsx'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '#src/ui/command.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '#src/ui/popover.tsx'
import { Separator } from '#src/ui/separator.tsx'
import { cn } from '#src/utils/misc.ts'

interface DataTableFacetedFilterProps {
	title?: string
	multiple?: boolean
	defaultValue?: string[]
	options: {
		label: string
		value: string
		icon?: React.ComponentType<{ className?: string }>
	}[]
	onSelect: (value: string[]) => void
	onReset: () => void
}

export function DataTableFacetedFilter({
	title,
	options,
	multiple = false,
	onSelect,
	onReset,
	defaultValue,
}: Readonly<DataTableFacetedFilterProps>) {
	const [selectedValues, setSelectedValues] = React.useState<string[]>([
		...(defaultValue ?? []),
	])

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="border-dashed">
					<svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="mr-2 h-4 w-4"
					>
						<path
							d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
							fill="currentColor"
							fillRule="evenodd"
							clipRule="evenodd"
						></path>
					</svg>
					{title}
					{selectedValues?.length > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge
								variant="secondary"
								className="rounded-sm px-1 font-normal lg:hidden"
							>
								{selectedValues.length}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								{selectedValues.length > 2 ? (
									<Badge
										variant="secondary"
										className="rounded-sm px-1 font-normal"
									>
										{selectedValues.length} sélectionnée
									</Badge>
								) : (
									options
										.filter((option) =>
											selectedValues.find((t) => t === option.value),
										)
										.map((option) => (
											<Badge
												variant="secondary"
												key={option.value}
												className="rounded-sm px-1 font-normal"
											>
												{option.label}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0" align="start">
				<Command>
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>Aucun resultats.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValues.find(
									(t) => t === option.value,
								)
								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											if (isSelected) {
												setSelectedValues((prevValues) => {
													onSelect(
														prevValues.filter(
															(value) => value !== option.value,
														),
													)
													return prevValues.filter(
														(value) => value !== option.value,
													)
												})
											} else if (multiple) {
												onSelect([...selectedValues, option.value])
												setSelectedValues([...selectedValues, option.value])
											} else {
												onSelect([option.value])
												setSelectedValues([option.value])
											}
										}}
									>
										<div
											className={cn(
												'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
												isSelected
													? 'bg-primary text-primary-foreground'
													: 'opacity-50 [&_svg]:invisible',
											)}
										>
											<svg
												width="15"
												height="15"
												viewBox="0 0 15 15"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												className={'h-4 w-4 text-white'}
											>
												<path
													d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
													fill="currentColor"
													fillRule="evenodd"
													clipRule="evenodd"
												></path>
											</svg>
										</div>
										{option.icon && (
											<option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
										)}
										<span>{option.label}</span>
									</CommandItem>
								)
							})}
						</CommandGroup>
						{selectedValues.length > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => {
											setSelectedValues([])
											onReset()
										}}
										className="justify-center text-center"
									>
										Réinitialiser
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
