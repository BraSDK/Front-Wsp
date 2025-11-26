// src/components/usuarios/UsuarioEditDialog.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function UsuarioEditDialog({ open, onClose, userId, onUpdated, api }) {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role_id: 2,
  });

  // Cargar datos del usuario → GET /users/{id}
  useEffect(() => {
    if (!open || !userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/${userId}`);
        const u = res.data.user ?? res.data;

        setForm({
          name: u.name ?? "",
          email: u.email ?? "",
          role_id: u.role_id ?? 2,
        });

      } catch (err) {
        alert("Error cargando usuario");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [open, userId, api]);

  // Enviar actualización → PUT /users/{id}
  const handleUpdate = async () => {
    try {
      await api.put(`/users/${userId}`, form);

      onUpdated(); // refrescar tabla
      onClose();   // cerrar modal

    } catch (err) {
      alert(err.response?.data?.msg || "Error actualizando usuario");
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="grid gap-4 py-4">
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
              <Label>Rol (role_id)</Label>
              <Input
                type="number"
                value={form.role_id}
                onChange={(e) => setForm({ ...form, role_id: Number(e.target.value) })}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleUpdate}>Guardar cambios</Button>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
