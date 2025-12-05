// src/components/empresas/empresas-columns.jsx

import { Pencil, Trash2 } from "lucide-react";

export const empresasColumns = (handleDelete) => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "ruc",
    header: "Ruc",
  },
  {
    accessorKey: "description",
    header: "Descripcion",
  },
  {
    accessorKey: "address",
    header: "Direccion",
  },
  {
    header: "Acciones",
    cell: ({ row }) => {
      const empresa = row.original;

      return (
        <div className="flex gap-3">

          {/* Eliminar */}
          <button
            className="text-red-600"
            onClick={() => handleDelete(empresa.id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    },
  },
];
