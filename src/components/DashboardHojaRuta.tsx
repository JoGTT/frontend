import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../contexts/AuthContext";
import HojaRutaDetalleView from "./HojaRutaDetalleView";

const DashboardHojaRuta: React.FC = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [hoja, setHoja] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHoja = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(API_ENDPOINTS.HOJAS_RUTA_DETALLE(id), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const payload = res.data?.hoja || res.data?.data || res.data;
        setHoja(payload);
      } catch (err) {
        setError("No se pudo cargar la hoja de ruta.");
      } finally {
        setLoading(false);
      }
    };
    fetchHoja();
  }, [id, token]);

  if (loading) return <div className="p-8 text-center text-[var(--color-gris-600)]">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!hoja) return <div className="p-8 text-center text-[var(--color-gris-600)]">Sin datos</div>;

  return (
    <HojaRutaDetalleView
      onBack={() => navigate("/registros")}
    />
  );
};

export default DashboardHojaRuta;
