import React from "react";
import { createContext, useState } from "react";

export const LivePriceContext = createContext({});

const LivePriceContextProvider = ({ children }) => {
  const [liveBitcoinPrice, setLiveBitcoinPrice] = useState(null);
  const [liveEthereumPrice, setLiveEthereumPrice] = useState(null);
  const [liveLitecoinPrice, setLiveLitecoinPrice] = useState(null);

  return (
    <LivePriceContext.Provider
      value={{
        liveBitcoinPrice,
        setLiveBitcoinPrice,
        liveEthereumPrice,
        setLiveEthereumPrice,
        liveLitecoinPrice,
        setLiveLitecoinPrice,
      }}
    >
      {children}
    </LivePriceContext.Provider>
  );
};

export default LivePriceContextProvider;
