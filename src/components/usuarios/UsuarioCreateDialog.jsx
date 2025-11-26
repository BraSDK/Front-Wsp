// src/components/usuarios/UsuarioCreateDialog.jsx

import { useState } from "react";
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/api/axios";

export default function UsuarioCreateDialog({ open, setOpen, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: 2
  });

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
        <Button>Registrar Usuario</Button>
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
        </div>

        <DialogFooter>
          <Button onClick={handleCreate}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
