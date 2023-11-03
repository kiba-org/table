// @vitest-environment happy-dom
import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KabiTable } from '../src/table/index'
import { ColumnDef } from '@tanstack/react-table'
import * as React from 'react'

test('renders table correctly with provided data', () => {
	const columns = [
		{
			accessorKey: 'id',
			enableHiding: true,
			cell(props) {
				return <div>{props.row.original.id}</div>
			},
		},
		{
			accessorKey: 'name',
			header: () => <p>{'Nom'}</p>,
			cell(props) {
				return <div>{props.row.original.name}</div>
			},
		},
	] satisfies Array<ColumnDef<{ id: string; name: string }>>

	const data = [
		{ id: '1', name: 'Hakim' },
		{ id: '2', name: 'Sophie' },
	]

	render(<KabiTable columns={columns} data={data} total={data.length} />)

	// Assert that specific content is present in the rendered component
	expect(screen.getByText('Hakim')).toBeInTheDocument()
	expect(screen.getByText('Sophie')).toBeInTheDocument()
	expect(screen.getByText('Nom')).toBeInTheDocument()
})
