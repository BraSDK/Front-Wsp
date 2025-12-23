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
  const authUser = JSON.parse(localStorage.getItem("user"));
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: authUser?.role_id === 2 ? 3 : 2,
    company_id: ""
  });

  // Cargar roles al abrir modal
  useEffect(() => {
    if (!open) return;
  
    const fetchData = async () => {
      try {
        const [rolesRes, companiesRes] = await Promise.all([
          api.get("/roles"),
          api.get("/companies")
        ]);
  
        setRoles(rolesRes.data.roles || rolesRes.data);
        setCompanies(companiesRes.data.companies || companiesRes.data);
      } catch (err) {
        console.error(err);
        alert("Error cargando datos");
      }
    };
  
    fetchData();
  }, [open]);

  const handleCreate = async () => {
    try {
      const adminUser = JSON.parse(localStorage.getItem("user"));
  
      // Si es super admin, debe seleccionar empresa
      if (adminUser.role_id === 1 && !form.company_id) {
        alert("Debes seleccionar una empresa.");
        return;
      }
  
      await api.post("/users/create", {
        name: form.name,
        email: form.email,
        password: form.password,
        role_id: form.role_id,
        company_id: form.company_id // Solo aplica si super admin
      });
  
      onSuccess();
      setOpen(false);
  
    } catch (err) {
      console.error(err);
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

              {roles
                .filter((r) => {
                  // ❌ Admin no puede ver SuperAdmin
                  if (authUser?.role_id === 2 && r.id === 1) return false;
                  return true;
                })
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
              ))}
            </select>
          </div>

          {authUser?.role_id === 1 && ( // Solo SuperAdmin ve esto
          <div>
            <Label>Empresa</Label>
            <select
              className="border rounded p-2 w-full"
              value={form.company_id}
              onChange={(e) =>
                setForm({ ...form, company_id: Number(e.target.value) })
              }
            >
              <option value="">Seleccione una empresa</option>

              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleCreate}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
