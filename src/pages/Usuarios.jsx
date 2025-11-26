// src/pages/Usuarios.jsx
import { useEffect, useState } from "react";
import { api } from "@/api/axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import UsuariosTable from "@/components/usuarios/UsuariosTable";
import UsuarioCreateDialog from "@/components/usuarios/UsuarioCreateDialog";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/list");
      const usersData = res.data.users ?? res.data;
      setUsuarios(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Usuarios ({usuarios.length})</CardTitle>

          <UsuarioCreateDialog
            open={open}
            setOpen={setOpen}
            onSuccess={fetchUsers}
          />
        </CardHeader>

        <CardContent>
          <UsuariosTable usuarios={usuarios} />
        </CardContent>
      </Card>
    </div>
  );
}

