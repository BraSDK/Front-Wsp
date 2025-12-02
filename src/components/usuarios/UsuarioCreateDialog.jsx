// src/components/usuarios/UsuarioCreateDialog.jsx

import { useState, useEffect } from "react";
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/api/axios";

export default function UsuarioCreateDialog({ open, setOpen, onSuccess }) {
  const [roles, setRoles] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: 2
  });

  // Cargar roles al abrir modal
  useEffect(() => {
    if (!open) return;

    const fetchRoles = async () => {
      try {
        const res = await api.get("/roles");
        setRoles(res.data.roles || res.data);
      } catch (err) {
        console.error(err);
        alert("Error cargando roles");
      }
    };

    fetchRoles();
  }, [open]);

  const handleCreate = async () => {
    try {
      await api.post("/users/create", form);
      onSuccess(); // recargar lista
      setOpen(false);
      setForm({ name: "", email: "", password: "", role_id: 2 });
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
          <DialogTitle>Nuevo Usuario</DialogTitle>
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
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <Label>Contraseña</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div>
            <Label>Rol</Label>
            <select
              className="border rounded p-2 w-full"
              value={form.role_id}
              onChange={(e) =>
                setForm({ ...form, role_id: Number(e.target.value) })
              }
            >
              <option value="">Seleccione un rol</option>

              {roles.map((r) => (
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
