// src/components/campanas/CampanasTable.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { campanasColumns } from "./campanas-columns";
import AsignarUsuariosDialog from "./AsignarUsuariosDialog";
import DesasignarUsuariosDialog from "./DesasignarUsuariosDialog";
import { api } from "@/api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function CampanasTable({ campanas, refresh }) {
  const [sorting, setSorting] = useState([]);
  const [selectedCampana, setSelectedCampana] = useState(null);
  const [unassignCampana, setUnassignCampana] = useState(null);

  // 👇 handler que se pasa a las columnas
  const handleAssignUsers = (campanaId) => {
    setSelectedCampana(campanaId);
  };

  // 📌 Abrir modal desasignar
  const handleUnassignUsers = (campanaId) => {
    setUnassignCampana(campanaId);
  };

  const columns = campanasColumns(handleAssignUsers, handleUnassignUsers);

  const table = useReactTable({
    data: campanas,
    columns,
    state: { sorting },
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
        {/* 📌 Modal Asignar Usuario */}
        <AsignarUsuariosDialog
          open={!!selectedCampana}
          campanaId={selectedCampana}
          onClose={() => setSelectedCampana(null)}
          onAssigned={refresh}
          api={api}
        />

        {/* 📌 Modal Desasignar */}
        <DesasignarUsuariosDialog
          open={!!unassignCampana}
          campanaId={unassignCampana}
          onClose={() => setUnassignCampana(null)}
          onUnassigned={refresh}
          api={api}
        />
    </>
  );
}
