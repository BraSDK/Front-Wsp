// src/components/campanas/CampanaCreateDialog.jsx
import { useEffect, useState } from "react";
import { api } from "@/api/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CampanaCreateDialog({ open, setOpen, onSuccess }) {
    
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    company_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [empresas, setEmpresas] = useState([]);

  // 🔹 Traer info del usuario y empresas si es superAdmin
  useEffect(() => {
    if (!open) return;

    const fetchUserData = async () => {
      try {
        const res = await api.get("/auth/me");
        setIsSuperAdmin(res.data.isSuperAdmin);

        if (res.data.isSuperAdmin) {
          // Traer todas las empresas
          const companiesRes = await api.get("/companies");
          setEmpresas(companiesRes.data.users ?? companiesRes.data);
        }
      } catch (err) {
        console.error("Error obteniendo usuario:", err);
      }
    };

    fetchUserData();
  }, [open]);

  const handleCreate = async () => {
    if (!form.nombre.trim()) return;

    try {
      setLoading(true);

      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
      };
  
      // 👑 Solo superAdmin envía empresa
      if (isSuperAdmin) {
        if (!form.company_id) {
          alert("Debe seleccionar una empresa");
          return;
        }
        payload.company_id = form.company_id;
      }
  
      await api.post("/campanas", payload);

      setForm({ nombre: "", descripcion: "",company_id: "" });

      onSuccess?.(); // recargar campañas
      setOpen(false);

    } catch (err) {
      alert(err.response?.data?.msg || "Error creando campaña");
    } finally {
      setLoading(false);
    }

  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva campaña</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input
              value={form.nombre}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Descripción</Label>
            <Input
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />
          </div>

          {isSuperAdmin && (
            <div className="space-y-2">
                <Label>Empresa</Label>

                <Select
                value={form.company_id}
                onValueChange={(value) =>
                    setForm({ ...form, company_id: value })
                }
                >
                <SelectTrigger>
                    <SelectValue placeholder="Seleccione una empresa" />
                </SelectTrigger>

                <SelectContent>
                    {empresas.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                        {e.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            )}
        </div>

        <DialogFooter>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creando..." : "Crear"}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
