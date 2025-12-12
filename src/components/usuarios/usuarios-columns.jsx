// src/components/usuarios/usuarios-columns.jsx
import { Pencil, Trash2 } from "lucide-react";

export const usuariosColumns = (handleEdit, handleDelete) => {
  // ✅ Usuario autenticado
  const authUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  const canEditOrDelete =
    authUser?.role_id === 1 || authUser?.role_id === 2; // super_admin o admin

  return [
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

        // 🚫 Supervisor y Usuario no ven acciones
        if (!canEditOrDelete) return null;

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
};
