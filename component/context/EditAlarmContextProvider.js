import React from "react";
import { createContext, useState } from "react";

export const EditAlarmContext = createContext({});

const EditingAlarmContextProvider = ({ children }) => {
  const [editingAlarmData, setEditingAlarmData] = useState(null);
  const [editingAlarmIndex, setEditingAlarmIndex] = useState(null);

  return (
    <EditAlarmContext.Provider
      value={{
        editingAlarmData,
        setEditingAlarmData,
        editingAlarmIndex,
        setEditingAlarmIndex,
      }}
    >
      {children}
    </EditAlarmContext.Provider>
  );
};

export default EditingAlarmContextProvider;
