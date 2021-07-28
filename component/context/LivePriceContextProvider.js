import React from "react";
import { createContext, useState } from "react";

export const LivePriceContext = createContext({});

const LivePriceContextProvider = ({ children }) => {
  const [liveBitcoinPrice, setLiveBitcoinPrice] = useState(null);
  const [liveEthereumPrice, setLiveEthereumPrice] = useState(null);
  const [liveLitecoinPrice, setLiveLitecoinPrice] = useState(null);

  const [existingAlarmsStore, setExistingAlarmsStore] = useState({});

  return (
    <LivePriceContext.Provider
      value={{
        liveBitcoinPrice,
        setLiveBitcoinPrice,
        liveEthereumPrice,
        setLiveEthereumPrice,
        liveLitecoinPrice,
        setLiveLitecoinPrice,
        existingAlarmsStore,
        setExistingAlarmsStore,
      }}
    >
      {children}
    </LivePriceContext.Provider>
  );
};

export default LivePriceContextProvider;
