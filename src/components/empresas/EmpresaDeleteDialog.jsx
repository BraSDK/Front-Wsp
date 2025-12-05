// src/components/empresas/EmpresaDeleteDialog.jsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function EmpresaDeleteDialog({ open, onClose, companieId, onDeleted, api }) {

  const handleDelete = async () => {
    try {
      await api.delete(`/companies/${companieId}`);
      onDeleted(); // refrescar tabla
      onClose();   // cerrar modal
    } catch (err) {
      alert(err.response?.data?.msg || "Error eliminando usuario");
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
        </DialogHeader>

        <p className="py-4">
          ¿Estás seguro de que deseas eliminar esta empresa?
          <br />
          <strong>Esta acción no se puede deshacer.</strong>
        </p>

        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
