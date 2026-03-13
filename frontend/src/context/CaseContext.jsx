import { createContext, useContext, useState } from "react";

const CaseContext = createContext();

export const CaseProvider = ({ children }) => {
  const [cases, setCases] = useState([]);

  const addCase = (newCase) => {
    setCases([...cases, newCase]);
  };

  return (
    <CaseContext.Provider value={{ cases, addCase }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCases = () => {
  return useContext(CaseContext);
};