import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CharacterContext } from "../context/CharacterContext";

const IndexPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingCarga, setLoadingCarga] = useState(false);
  const [pilotosCargados, setPilotosCargados] = useState(false);
  const { refetchDrivers } = useContext(CharacterContext);

  const mockApiURL = "https://67efdbaa2a80b06b88960b03.mockapi.io/api/v1/drivers";

  // Verificar si ya hay pilotos cargados al iniciar
  useEffect(() => {
    const verificarPilotos = async () => {
      try {
        const { data: existingDrivers } = await axios.get(mockApiURL);
        if (existingDrivers.length > 0) {
          setPilotosCargados(true);
        }
      } catch (error) {
        console.error("Error al verificar pilotos:", error);
      }
    };

    verificarPilotos();
  }, []);

  const cargarPilotosDesdeAPI = async () => {
    setLoadingCarga(true);
    try {
      const { data: existingDrivers } = await axios.get(mockApiURL);
      const existingNames = new Set(
        existingDrivers.map((d) =>
          `${d.name}`.toLowerCase().replace(/\s+/g, "")
        )
      );

      const f1Response = await axios.get("https://ergast.com/api/f1/2024/drivers.json");
      const f1Drivers = f1Response.data.MRData.DriverTable.Drivers;

      const enrichedDrivers = await Promise.all(
        f1Drivers.map(async (driver) => {
          const imageUrl = await fetchWikipediaImage(driver.givenName, driver.familyName);
          return {
            name: `${driver.givenName} ${driver.familyName}`,
            nationality: translateNationality(driver.nationality),
            dateOfBirth: driver.dateOfBirth,
            image: imageUrl,
          };
        })
      );

      let insertedCount = 0;
      for (const driver of enrichedDrivers) {
        const normalizedName = driver.name.toLowerCase().replace(/\s+/g, "");
        if (!existingNames.has(normalizedName)) {
          await axios.post(mockApiURL, driver);
          insertedCount++;
        }
      }

      const { data: finalDrivers } = await axios.get(mockApiURL);
      setPilotosCargados(true);

      if (insertedCount > 0) {
        console.log(`✅ Se insertaron ${insertedCount} nuevos pilotos`);
        toast.success("Datos cargados y guardados en MockAPI ✅");
      } else {
        console.log("ℹ️ Todos los pilotos ya estaban cargados en MockAPI.");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error al obtener datos");
    } finally {
      setLoadingCarga(false);
    }
  };

  const fetchWikipediaImage = async (firstName, lastName) => {
    const searchQuery = `${firstName} ${lastName}`;
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=original&titles=${encodeURIComponent(searchQuery)}`;

    try {
      const response = await axios.get(url);
      const pages = response.data.query.pages;
      const firstPage = Object.values(pages)[0];
      return (
        firstPage.original?.source ||
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
      );
    } catch (error) {
      console.error("Error obteniendo imagen:", error);
      return "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
    }
  };

  const translateNationality = (nationality) => {
    const translations = {
      Argentinian: "Argentino",
      Thai: "Tailandés",
      British: "Británico",
      German: "Alemán",
      Spanish: "Español",
      French: "Francés",
      Italian: "Italiano",
      Dutch: "Neerlandés",
      Finnish: "Finlandés",
      Brazilian: "Brasileño",
      American: "Estadounidense",
      Mexican: "Mexicano",
      Japanese: "Japonés",
      Australian: "Australiano",
      Canadian: "Canadiense",
    };

    return translations[nationality.trim()] || nationality.trim();
  };

  const handleIngresar = async () => {
    setLoading(true);
    await refetchDrivers(); // Cargo los pilotos actualizados del context
    navigate("/pilotos");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://www.impulsyn.com/wp-content/uploads/2024/05/pj-f123-bel-w01-rus-unmarked.jpg.adapt_.crop191x100.628p.jpg')",
      }}
    >
      <div className="bg-black bg-opacity-60 p-10 rounded-xl text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a la F1 App</h1>
        <p className="text-lg mb-6">¡Explorá a tus pilotos favoritos!</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={cargarPilotosDesdeAPI}
            className={`${
              pilotosCargados ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            } text-white font-semibold py-2 px-6 rounded-lg transition duration-300`}
            disabled={loadingCarga || pilotosCargados}
          >
            {loadingCarga
              ? "Cargando pilotos..."
              : pilotosCargados
              ? "Pilotos ya cargados"
              : "Cargar Pilotos"}
          </button>

          <button
            onClick={handleIngresar}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
