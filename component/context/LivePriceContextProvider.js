import React from "react";
import { createContext, useState} from "react";

export const LivePriceContext = createContext({});

const LivePriceContextProvider = ({ children }) => {
  const [liveBitcoinPrice, setLiveBitcoinPrice] = useState(null);
  const [liveEthereumPrice, setLiveEthereumPrice] = useState(null);
  const [liveLitecoinPrice, setLiveLitecoinPrice] = useState(null);

  const [isLiveBitcoinPriceOn, setIsLiveBitcoinPriceOn] = useState(true)
  const [isLiveLitecoinPriceOn, setIsLiveLitecoinPriceOn] = useState(true)
  const [isLiveEthereumPriceOn, setIsLiveEthereumPriceOn] = useState(true)



  return (
    <LivePriceContext.Provider
      value={{
        liveBitcoinPrice,
        setLiveBitcoinPrice,
        liveEthereumPrice,
        setLiveEthereumPrice,
        liveLitecoinPrice,
        setLiveLitecoinPrice,

        isLiveBitcoinPriceOn,
        isLiveLitecoinPriceOn,
        isLiveEthereumPriceOn,

        setIsLiveBitcoinPriceOn,
        setIsLiveEthereumPriceOn,
        setIsLiveLitecoinPriceOn,
      }}
    >
      {children}
    </LivePriceContext.Provider>
  );
};

export default LivePriceContextProvider;
