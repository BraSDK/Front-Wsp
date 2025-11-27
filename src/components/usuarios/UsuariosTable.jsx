// src/components/usuarios/UsuariosTable.jsx
import { useState } from "react";
import { usuariosColumns } from "./usuarios-columns";
import UsuarioEditDialog from "./UsuarioEditDialog";
import UsuarioDeleteDialog from "./UsuarioDeleteDialog";
import { api } from "@/api/axios";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
  } from "@tanstack/react-table";
  
  import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
  
  export default function UsuariosTable({ usuarios, refresh }) {
    const [sorting, setSorting] = useState([]);
    const [userIdToEdit, setUserIdToEdit] = useState(null);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

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
                    className="cursor-pointer select-none"
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
                <TableCell colSpan={columns.length} className="text-center py-4">
                  No hay usuarios
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
  