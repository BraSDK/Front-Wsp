// src/pages/Campanas.jsx
import { useEffect, useState } from "react";
import { api } from "@/api/axios";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "@/components/ui/card";

  
import CampanasTable from "@/components/campanas/CampanasTable";

export default function Campanas() {
    const [campanas, setCampanas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchCampanas = async () => {
      try {
        setLoading(true);
        const res = await api.get("/campanas");
        const data = res.data.campanas ?? res.data;
        setCampanas(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.msg || err.message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchCampanas();
    }, []);
  
    if (loading) return <p>Cargando...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
  
    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Campañas ({campanas.length})</CardTitle>
          </CardHeader>
  
          <CardContent>
            <CampanasTable
              campanas={campanas}
              refresh={fetchCampanas}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
