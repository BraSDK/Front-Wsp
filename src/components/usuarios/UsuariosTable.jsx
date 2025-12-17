// src/components/usuarios/UsuariosTable.jsx
import { useState, useMemo } from "react";
import { usuariosColumns } from "./usuarios-columns";
import UsuarioEditDialog from "./UsuarioEditDialog";
import UsuarioDeleteDialog from "./UsuarioDeleteDialog";
import { api } from "@/api/axios";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
  } from "@tanstack/react-table";
  import { Button } from "@/components/ui/button";
  import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
  
  export default function UsuariosTable({ usuarios, refresh }) {
    const [sorting, setSorting] = useState([]);
    const [userIdToEdit, setUserIdToEdit] = useState(null);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10, // usuarios por página
    });
    
    // Aquí agregamos ambas funciones
    const handleEdit = (id) => {
      setUserIdToEdit(id);
    };

    const handleDelete = (id) => {
      setUserIdToDelete(id); // Aquí sí usamos el estado
    };

    const columns = usuariosColumns(handleEdit, handleDelete);

    const table = useReactTable({
      data: usuarios,
      columns,
      state: {
        sorting,
        pagination,
      },
      onSortingChange: setSorting,
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
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
        <div className="flex items-center justify-between px-2 py-4">
          {/* Información */}
          <div className="text-sm text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>

          {/* Controles */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
      {/* 📌 Modal editar */}
      <UsuarioEditDialog
        open={!!userIdToEdit}
        userId={userIdToEdit}
        onClose={() => setUserIdToEdit(null)}
        onUpdated={refresh}
        api={api}
      />

      {/* Modal Eliminar */}
      <UsuarioDeleteDialog
        open={!!userIdToDelete}
        userId={userIdToDelete}
        onClose={() => setUserIdToDelete(null)}
        onDeleted={refresh}
        api={api}
      />
    </>
    );
  }
  