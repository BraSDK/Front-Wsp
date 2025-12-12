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

  // ✅ PASO 1: Usuario logueado desde localStorage
  const authUser = JSON.parse(localStorage.getItem("user"));

  // ✅ PASO 2: Permisos por rol
  const canCreateUser =
    authUser?.role_id === 1 || authUser?.role_id === 2;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user-company/by-company");
      
      console.log("🔥 RESPUESTA DEL BACKEND:", res.data);

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

          {canCreateUser && (
          <UsuarioCreateDialog
            open={open}
            setOpen={setOpen}
            onSuccess={fetchUsers}
          />
          )}
        </CardHeader>

        <CardContent>
          <UsuariosTable usuarios={usuarios} refresh={fetchUsers} />
        </CardContent>
      </Card>
    </div>
  );
}

