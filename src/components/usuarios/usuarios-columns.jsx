// src/components/usuarios/usuarios-columns.jsx

import { Pencil, Trash2 } from "lucide-react";

export const usuariosColumns = (handleEdit, handleDelete) => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    header: "Acciones",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex gap-3">
          {/* Editar */}
          <button
            className="text-blue-600"
            onClick={() => handleEdit(user.id)}
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* Eliminar */}
          <button
            className="text-red-600"
            onClick={() => handleDelete(user.id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    },
  },
];
