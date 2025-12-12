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
  const [preview, setPreview] = useState(null);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({
    name: "",
    ruc: "",
    email: "",
    description: "",
    address: "",
    admin_user_id: 2,
    logo: null,
  });

  // Cargar roles al abrir modal
  useEffect(() => {
    if (!open) return;
  
    const fetchAdmins = async () => {
      try {
        const res = await api.get("/users/admins");
        setAdmins(res.data.users || res.data);
      } catch (err) {
        console.error(err);
        alert("Error cargando administradores");
      }
    };
  
    fetchAdmins();
  }, [open]);  

  useEffect(() => {
    if (!open && preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }, [open, preview]);  

  // Crear empresa
  const handleCreate = async () => {
    try {
      const formData = new FormData();
  
      formData.append("name", form.name);
      formData.append("ruc", form.ruc);
      formData.append("description", form.description);
      formData.append("address", form.address);
  
      if (form.logo) {
        formData.append("logo", form.logo); // ✅ archivo
      }
  
      await api.post("/companies", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      onSuccess();
      setOpen(false);
  
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);

      // Reset
      setForm({
        name: "",
        ruc: "",
        description: "",
        address: "",
        admin_user_id: 2,
        logo: null,
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error al registrar empresa");
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
            <Label>Logo de la empresa</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setForm({ ...form, logo: file });
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
            {preview && (
              <div className="mt-2 flex justify-center">
                <img
                  src={preview}
                  alt="Preview Logo"
                  className="w-32 h-32 object-contain rounded border"
                />
              </div>
            )}
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

              {admins.map((r) => (
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
