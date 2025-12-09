// src/components/empresas/EmpresasTable.jsx
import { useState } from "react";
import { empresasColumns } from "./empresas-columns";
import EmpresaEditDialog from "./EmpresaEditDialog";
import EmpresaDeleteDialog from "./EmpresaDeleteDialog";
import { api } from "@/api/axios";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
  } from "@tanstack/react-table";

  import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

  export default function EmpresasTable({ empresas, refresh }) {
    const [sorting, setSorting] = useState([]);
    const [CompaniesIdToEdit, setCompaniesIdToEdit] = useState(null);
    const [CompaniesIdToDelete, setCompaniesIdToDelete] = useState(null);

    // Aquí agregamos ambas funciones
    const handleEdit = (id) => {
        setCompaniesIdToEdit(id);
      };

    const handleDelete = (id) => {
        setCompaniesIdToDelete(id); // Aquí sí usamos el estado
      };

    const columns = empresasColumns(handleEdit, handleDelete);

    const table = useReactTable({
      data: empresas,
      columns,
      state: {
          sorting,
      },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });

    return (
    <>
        <div className="rounded-lg border mt-4">
            <Table>
            <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                    <TableHead
                        key={header.id}
                        className="cursor-pointer select-none text-left whitespace-nowrap"
                        onClick={header.column.getToggleSortingHandler()}
                    >
                        {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                        )}

                        {/* Indicador de orden */}
                        {{
                        asc: " ▲",
                        desc: " ▼",
                        }[header.column.getIsSorted()] ?? null}
                    </TableHead>
                    ))}
                </TableRow>
                ))}
            </TableHeader>

            <TableBody>
                {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="text-left whitespace-nowrap">
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
                    <TableCell colSpan={columns.length} className="text-center py-4">
                    No hay usuarios
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        {/* 📌 Modal editar */}
        <EmpresaEditDialog
          open={!!CompaniesIdToEdit}
          companieId={CompaniesIdToEdit}
          onClose={() => setCompaniesIdToEdit(null)}
          onUpdated={refresh}
          api={api}
        />

        {/* Modal Eliminar */}
        <EmpresaDeleteDialog
          open={!!CompaniesIdToDelete}
          companieId={CompaniesIdToDelete}
          onClose={() => setCompaniesIdToDelete(null)}
          onDeleted={refresh}
          api={api}
        />
    </>
    );
}