import React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    FilterFn,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Search } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

// Fonction de filtre personnalisée pour rechercher dans plusieurs champs
const globalFilterFn: FilterFn<any> = (row, columnId, value) => {
    const searchFields = ['email', 'name', 'organizationName', 'phoneNumber']

    if (!value) return true

    const searchValue = value.toLowerCase()

    return searchFields.some(field => {
        const fieldValue = row.getValue(field)
        if (fieldValue == null) return false
        return String(fieldValue).toLowerCase().includes(searchValue)
    })
}

export function DataTableWithSearch<TData, TValue>({
                                                       columns,
                                                       data,
                                                   }: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = React.useState("")

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    })

    return (
        <div className="w-full">
            {/* Barre de recherche */}
            <div className="flex items-center py-4 w-full">
                <div className="relative max-w-sm w-full">
                    <Input
                        startIcon={Search}
                        placeholder="Rechercher par email, nom, entreprise ou téléphone..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="pl-8"
                    />
                </div>
                {globalFilter && (
                    <div className="ml-4 text-sm text-muted-foreground">
                        {table.getFilteredRowModel().rows.length} résultat(s) trouvé(s)
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getFilteredRowModel().rows?.length ? (
                            table.getFilteredRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {globalFilter
                                        ? "Aucun résultat trouvé pour votre recherche."
                                        : "Aucun utilisateur trouvé."
                                    }
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}