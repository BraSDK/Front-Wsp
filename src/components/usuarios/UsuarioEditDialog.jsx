// src/components/usuarios/UsuarioEditDialog.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function UsuarioEditDialog({ open, onClose, userId, onUpdated, api }) {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const authUser = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    name: "",
    email: "",
    role_id: 2,
    role_name: "",
    company_id: ""
  });

  // Cargar datos del usuario → GET /users/{id}
  useEffect(() => {
    if (!open || !userId) return;

    const fetchData  = async () => {
      try {
        setLoading(true);

        // 1. Obtener usuario
        const res = await api.get(`/users/${userId}`);
        const u = res.data.user ?? res.data;

        console.log("🎯 Usuario recibido:", u);

        setForm({
          name: u.name ?? "",
          email: u.email ?? "",
          role_id: Number(u.role_id) || "",
          role_name: u.role_name ?? "",
          company_id: u.company_id || ""
        });


        // 2. Obtener roles dinámicos
        const rolesRes = await api.get("/roles");
        setRoles(rolesRes.data.roles || rolesRes.data);

        console.log("📦 Roles recibidos:", rolesRes.data.roles || rolesRes.data);

        // 3. Empresas (solo SuperAdmin)
        if (authUser?.role_id === 1) {
          const companiesRes = await api.get("/companies");
          setCompanies(companiesRes.data.companies || companiesRes.data);
        }

      } catch (err) {
        alert("Error cargando usuario");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData ();
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
  console.log("🔍 render → form.role_id:", form.role_id, "roles:", roles);

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
              <Label>Rol</Label>
                <select
                  className="border rounded p-2 w-full"
                  value={Number(form.role_id)}
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

              {/* Empresa → Solo SuperAdmin */}
              {authUser?.role_id === 1 && (
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
        )}

        <DialogFooter>
          <Button onClick={handleUpdate}>Guardar cambios</Button>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
