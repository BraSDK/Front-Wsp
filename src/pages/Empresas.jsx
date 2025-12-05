// src/pages/Empresas.jsx
import { useEffect, useState } from "react";
import { api } from "@/api/axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import EmpresasTable from "@/components/empresas/EmpresasTable";
import EmpresaCreateDialog from "@/components/empresas/EmpresaCreateDialog";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  // Mostrar empresas
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/companies");
      const empreData = res.data.users ?? res.data;
      setEmpresas(Array.isArray(empreData) ? empreData : []);
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Empresas ({empresas.length})</CardTitle>

          <EmpresaCreateDialog
            open={open}
            setOpen={setOpen}
            onSuccess={fetchCompanies}
          />
        </CardHeader>

        <CardContent>
          <EmpresasTable empresas={empresas} refresh={fetchCompanies} />
        </CardContent>
      </Card>
    </div>
  );
}

