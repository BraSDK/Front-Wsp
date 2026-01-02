// src/components/campanas/DesasignarUsuariosDialog.jsx
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

export default function DesasignarUsuariosDialog({ open, campanaId, onClose, onUnassigned }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !campanaId) return;

    const fetchUsers = async () => {
      setLoading(true);
      const res = await api.get(`/campanas/${campanaId}/users`);
      setUsers(res.data.users || []);
      setLoading(false);
    };

    fetchUsers();
  }, [open, campanaId]);

  const handleRemove = async (userId) => {
    await api.post("/campanas/unassign-user", {
      campana_id: campanaId,
      user_id: userId,
    });

    setUsers((prev) => prev.filter((u) => u.id !== userId));
    onUnassigned?.();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Usuarios asignados</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground">
            Cargando usuarios...
          </p>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay usuarios asignados
          </p>
        ) : (
          <ScrollArea className="max-h-64 pr-2">
            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.email} • {u.role_name}
                    </p>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemove(u.id)}
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
