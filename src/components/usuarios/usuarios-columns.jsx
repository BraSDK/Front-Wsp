// src/components/usuarios/usuarios-columns.jsx

import { Pencil } from "lucide-react";

export const usuariosColumns = (handleEdit) => [
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
        <button
          className="text-blue-600 hover:text-blue-800 p-2"
          onClick={() => handleEdit(user.id)}
          title="Editar usuario"
        >
          <Pencil className="h-4 w-4" />
        </button>
      );
    },
  },
];
