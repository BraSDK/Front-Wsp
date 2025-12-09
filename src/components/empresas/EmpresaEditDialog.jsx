// src/components/usuarios/UsuarioEditDialog.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function EmpresaEditDialog({ open, onClose, companieId, onUpdated, api }) {
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);     // preview imagen
  const [logoFile, setLogoFile] = useState(null);   // archivo nuevo
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    ruc: "",
    description: "",
    address: "",
    admin_user_id: 2,
  });

  // Cargar datos de la empresa → GET /companies/{id}
  useEffect(() => {
    console.log("🧪 open:", open, "companieId:", companieId);
    if (!open || !companieId) return;

    const fetchData  = async () => {
      try {
        setLoading(true);

        // 1. Obtener usuario
        const res = await api.get(`/companies/${companieId}`);
        const c = res.data.companies ?? res.data;

        console.log("🎯 Empresa recibida:", c);

        setForm({
          name: c.name ?? "",
          ruc: c.ruc ?? "",
          description: c.description ?? "",
          address: c.address ?? "",
          admin_user_id: Number(c.admin_user_id) || ""
        });

        // ✅ logo actual (URL del backend)
        if (c.logo) {
          setPreview(c.logo);
        }

        // 2. Obtener usuarios dinámicos
        const companieRes = await api.get("/users/list");
        setUsers(companieRes.data.users || companieRes.data);

        console.log("📦 Usuarios recibidos:", companieRes.data.users || companieRes.data);


      } catch (err) {
        alert("Error cargando empresa");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData ();
  }, [open, companieId, api]);

  useEffect(() => {
    if (!open && preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
      setPreview(null);
      setLogoFile(null);
    }
  }, [open, preview]);
  

  // Enviar actualización → PUT /companies/{id}
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
  
      formData.append("name", form.name);
      formData.append("ruc", form.ruc);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("admin_user_id", form.admin_user_id);
  
      // ✅ solo si elige logo nuevo
      if (logoFile) {
        formData.append("logo", logoFile);
      }
  
      await api.put(`/companies/${companieId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
  
      onUpdated();
      onClose();
  
    } catch (err) {
      alert(err.response?.data?.msg || "Error actualizando empresa");
      console.error(err);
    }
  };
  

  if (!open) return null;
  console.log("🔍 render → form.admin_user_id:", form.admin_user_id, "usuarios:", users);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
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

              {preview && (
                <img
                  src={preview}
                  alt="Logo preview"
                  className="w-32 h-32 object-contain border rounded mb-2"
                />
              )}

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setLogoFile(file);

                  // liberar preview anterior si era blob
                  if (preview && preview.startsWith("blob:")) {
                    URL.revokeObjectURL(preview);
                  }

                  setPreview(URL.createObjectURL(file));
                }}
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
        )}

        <DialogFooter>
          <Button onClick={handleUpdate}>Guardar cambios</Button>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
