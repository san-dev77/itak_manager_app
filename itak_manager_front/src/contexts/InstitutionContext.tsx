import { createContext, useState, useEffect, type ReactNode } from "react";

export interface Institution {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InstitutionContextType {
  selectedInstitution: Institution | null;
  institutions: Institution[];
  setSelectedInstitution: (institution: Institution | null) => void;
  isLoading: boolean;
  fetchInstitutions: () => Promise<void>;
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(
  undefined
);

interface InstitutionProviderProps {
  children: ReactNode;
}

export const InstitutionProvider = ({ children }: InstitutionProviderProps) => {
  const [selectedInstitution, setSelectedInstitutionState] =
    useState<Institution | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'institution sélectionnée depuis localStorage au démarrage
  useEffect(() => {
    const loadInstitution = () => {
      try {
        const stored = localStorage.getItem("selectedInstitution");
        if (stored) {
          const parsed = JSON.parse(stored);
          setSelectedInstitutionState(parsed);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'institution:", error);
      }
    };

    loadInstitution();
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("/api/class-categories/institutions/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des institutions");
      }

      const data = await response.json();
      setInstitutions(data);

      // Si aucune institution n'est sélectionnée et qu'il y a des institutions, sélectionner la première
      if (!selectedInstitution && data.length > 0) {
        const stored = localStorage.getItem("selectedInstitution");
        if (!stored) {
          setSelectedInstitutionState(data[0]);
          localStorage.setItem("selectedInstitution", JSON.stringify(data[0]));
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des institutions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedInstitution = (institution: Institution | null) => {
    setSelectedInstitutionState(institution);
    if (institution) {
      localStorage.setItem("selectedInstitution", JSON.stringify(institution));
    } else {
      localStorage.removeItem("selectedInstitution");
    }
  };

  const value: InstitutionContextType = {
    selectedInstitution,
    institutions,
    setSelectedInstitution,
    isLoading,
    fetchInstitutions,
  };

  return (
    <InstitutionContext.Provider value={value}>
      {children}
    </InstitutionContext.Provider>
  );
};

export default InstitutionContext;
