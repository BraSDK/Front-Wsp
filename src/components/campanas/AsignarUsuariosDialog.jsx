// src/components/campanas/AsignarUsuariosDialog.jsx
import { useEffect, useState } from "react";
import { api } from "@/api/axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AsignarUsuariosDialog({
  open,
  campanaId,
  onClose,
  onAssigned,
}) {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !campanaId) return;

    const fetchUsers = async () => {
      setLoading(true);
      const res = await api.get(
        `/campanas/${campanaId}/assignable-users`
      );
      setUsers(res.data.users || []);
      setLoading(false);
    };

    fetchUsers();
  }, [open, campanaId]);

  const handleAssign = async () => {
    if (!userId) return;

    await api.post("/campanas/assign-user", {
      campana_id: campanaId,
      user_id: userId,
    });

    onAssigned?.();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar usuarios</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <div className="space-y-2">
            <Label>Usuario</Label>

            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un usuario" />
              </SelectTrigger>

              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.name} ({u.role_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleAssign} disabled={!userId}>
            Asignar
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
