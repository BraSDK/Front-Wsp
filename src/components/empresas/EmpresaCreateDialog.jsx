// src/components/empresas/EmpresaCreateDialog.jsx

import { useState, useEffect } from "react";
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/api/axios";

export default function EmpresaCreateDialog({ open, setOpen, onSuccess }) {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    ruc: "",
    email: "",
    Description: "",
    address: "",
    admin_user_id: 2
  });

  // Cargar roles al abrir modal
  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/list");
        setUsers(res.data.users || res.data);
      } catch (err) {
        console.error(err);
        alert("Error cargando roles");
      }
    };

    fetchUsers();
  }, [open]);

  // Crear empresa
  const handleCreate = async () => {
    try {
      await api.post("/companies", form);
      onSuccess(); // recargar lista
      setOpen(false);
      setForm({ name: "", ruc: "", description: "", address: "", admin_user_id: 2 });
    } catch (err) {
      alert(err.response?.data?.msg || "Error al registrar usuario");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className=" bg-blue-800 hover:bg-blue-900 text-white"> 
          Registrar Usuario
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Empresa</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label>Nombre</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <Label>Ruc</Label>
            <Input
              type="number"
              inputMode="numeric" 
              pattern="[0-9]*"
              value={form.ruc}
              onChange={(e) => setForm({ ...form, ruc: e.target.value.replace(/\D/g, "") })}
              maxLength={11}
            />
          </div>

          <div>
            <Label>Descripcion</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <Label>Direccion</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div>
            <Label>Usuario</Label>
            <select
              className="border rounded p-2 w-full"
              value={form.admin_user_id}
              onChange={(e) =>
                setForm({ ...form, admin_user_id: Number(e.target.value) })
              }
            >
              <option value="">Seleccione un Usuario</option>

              {users.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleCreate}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
