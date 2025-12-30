// src/components/campanas/campanas-columns.jsx

import { Pencil, Trash2 } from "lucide-react";
import { Users, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const campanasColumns = (onAssignUsers, onUnassignUsers, handleEdit, handleDelete) => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "descripcion",
    header: "Descripcion",
  },
  {
    header: "Acciones",
    cell: ({ row }) => {
      const campana = row.original;

      return (
        <div className="flex gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAssignUsers(campana.id)}
          >
            <Users className="w-4 h-4 mr-1" />
            Asignar
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onUnassignUsers(campana.id)}
          >
            <UserMinus className="w-4 h-4 mr-1 text-red-500" />
            Desasignar
          </Button>
        </div>
      );
    },
  },
];
