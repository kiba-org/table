import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type Row,
} from '@tanstack/react-table'

import * as React from 'react'
import { useDebounce } from './use-debounce'
import { KabiSelect } from './select'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table'
import { DataTableFacetedFilter } from './data-table-faceted-filter'

type TableProps<TData> = {
	defaultSearchValue?: string
	data: Array<TData>
	columns: ColumnDef<TData, any>[]
	onChangeRowSelection?: (data: TData[]) => void
	total?: number
	onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void
	onPageSize?: (value: string) => void
	getRowCanExpand?: (row: Row<TData>) => boolean
	renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement
	pagination?: {
		disabledPrevious: boolean
		disabledNext: boolean
		onPrevious: () => void
		onNext: () => void
	}

	filter?: {
		filter1?: {
			title: string
			multiple?: boolean
			defaultValue?: string[]
			onSelect: (value: string[]) => void
			onReset: () => void
			options: {
				label: string
				value: string
			}[]
		}
		filter2?: {
			title: string
			defaultValue?: string[]
			onSelect: (value: string[]) => void
			onReset: () => void
			options: {
				label: string
				value: string
			}[]
		}
	}
}

export function KibaTable<TData>({
	columns,
	data,
	onChangeRowSelection,
	total,
	filter,
	onSearch,
	pagination,
	onPageSize,
	getRowCanExpand = () => false,
	renderSubComponent,
	defaultSearchValue,
}: Readonly<TableProps<TData>>) {
	const getData = React.useMemo(() => data, [data])

	const getColumns = React.useMemo(() => columns, [columns])

	const [globalFilter, setGlobalFilter] = React.useState('')

	const [rowSelection, setRowSelection] = React.useState({})
	const mounted = React.useRef(false)

	const table = useReactTable({
		data: getData,
		columns: getColumns,
		enableGlobalFilter: true,

		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		getRowCanExpand,
		state: {
			rowSelection,
			globalFilter,
		},
	})

	React.useEffect(() => {
		if (!mounted.current) {
			mounted.current = true
			return
		}
		if (onChangeRowSelection)
			onChangeRowSelection(
				table.getSelectedRowModel().flatRows.map((row) => row.original),
			)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rowSelection])

	const handleSearchChange = useDebounce(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			onSearch?.(event)
		},
		400,
	)
	return (
		<div className="relative w-full @container/table">
			{pagination || onSearch ? (
				<div className="flex flex-col gap-1 rounded-md bg-slate-100/95  px-0.5 py-2 @xl/table:sticky @xl/table:flex-row @xl/table:items-center  @xl/table:justify-between dark:bg-slate-800/75 sm:top-[4rem] sm:z-10 ">
					<div className="flex flex-1 flex-col items-center sm:ml-2 sm:flex-row">
						<div className="flex w-full flex-col gap-1  sm:flex-row sm:items-center sm:gap-3">
							{onSearch ? (
								<>
									<Label htmlFor="search" className="sr-only">
										Recherche
									</Label>
									<Input
										type="search"
										id="search"
										name="search"
										defaultValue={defaultSearchValue}
										placeholder="Recherche ..."
										onChange={(event) => handleSearchChange(event)}
										className="w-full lg:w-[250px]"
									/>
								</>
							) : null}
							{filter?.filter1 ? (
								<DataTableFacetedFilter
									title={filter.filter1.title}
									defaultValue={filter.filter1.defaultValue}
									options={filter.filter1.options}
									onSelect={(v) => filter.filter1?.onSelect(v)}
									onReset={() => filter.filter1?.onReset()}
									multiple={filter.filter1.multiple}
								/>
							) : null}

							{filter?.filter2 ? (
								<DataTableFacetedFilter
									title={filter.filter2.title}
									defaultValue={filter.filter2.defaultValue}
									options={filter.filter2.options}
									onSelect={(v) => filter.filter2?.onSelect(v)}
									onReset={() => filter.filter2?.onReset()}
								/>
							) : null}

							{total ? (
								<Badge className="hidden h-8 w-8 items-center justify-center rounded-full font-bold  sm:flex">
									{total}
								</Badge>
							) : null}
						</div>
					</div>

					{pagination ? (
						<div className="mt-1 text-end">
							<div className="space-x-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => pagination.onPrevious()}
									disabled={pagination.disabledPrevious}
								>
									Précedent
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => pagination.onNext()}
									disabled={pagination.disabledNext}
								>
									Suivant
								</Button>
							</div>
						</div>
					) : null}
				</div>
			) : null}

			<div className="h-2" />
			<div className="rounded-md  border">
				<Table>
					<TableHeader className="bg-slate-50 dark:bg-slate-700/50">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											{...{
												style: {
													width: header.getSize(),
												},
												className: 'font-bold',
											}}
											key={header.id}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
												  )}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<React.Fragment key={row.id}>
									<TableRow data-state={row.getIsSelected() && 'selected'}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
									{row.getIsExpanded() && renderSubComponent ? (
										<TableRow>
											{/* 2nd row is a custom 1 cell row */}
											<TableCell colSpan={row.getVisibleCells().length}>
												{renderSubComponent({ row })}
											</TableCell>
										</TableRow>
									) : null}
								</React.Fragment>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Aucune donnée.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
				{onPageSize ? (
					<div className="my-2 self-end">
						<KabiSelect
							label="Taille"
							placeholder="sélectionner la taille"
							data={[
								{ value: '20', label: '20' },
								{ value: '100', label: '100' },
								{ value: '150', label: '150' },
								{ value: '200', label: '200' },
								{ value: '500', label: '500' },
							]}
							onSelect={(v) => onPageSize(v)}
						/>
					</div>
				) : null}
			</div>
			<div className="h-2" />
			{pagination || onChangeRowSelection ? (
				<div className="flex items-center justify-end space-x-2 rounded-md bg-slate-100 px-2.5 py-2 dark:bg-slate-800/75">
					{onChangeRowSelection ? (
						<div className="flex-1 text-sm text-muted-foreground">
							{table.getFilteredSelectedRowModel().rows.length} sur{' '}
							{table.getFilteredRowModel().rows.length} ligne(s) sélectionner.
						</div>
					) : null}
					{pagination ? (
						<div className="space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => pagination.onPrevious()}
								disabled={pagination.disabledPrevious}
							>
								Précedent
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => pagination.onNext()}
								disabled={pagination.disabledNext}
							>
								Suivant
							</Button>
						</div>
					) : null}
				</div>
			) : null}
		</div>
	)
}
