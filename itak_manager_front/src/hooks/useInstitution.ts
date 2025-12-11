import { useContext } from "react";
import InstitutionContext, {
  type InstitutionContextType,
} from "../contexts/InstitutionContext";

export const useInstitution = (): InstitutionContextType => {
  const context = useContext(InstitutionContext);
  if (context === undefined) {
    throw new Error(
      "useInstitution doit être utilisé dans un InstitutionProvider"
    );
  }
  return context;
};

export default useInstitution;

