import React, { useState, useEffect, useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundFetch from 'expo-background-fetch';

import Alarm from "./Alarm";

import { LivePriceContext } from "../context/LivePriceContextProvider";

const ExistingAlarm = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(true);

  const { liveBitcoinPrice } = useContext(LivePriceContext);
  const { liveLitecoinPrice } = useContext(LivePriceContext);
  const { liveEthereumPrice } = useContext(LivePriceContext);

   const { isLiveBitcoinPriceOn } = useContext(LivePriceContext);
  const { isLiveLitecoinPriceOn } = useContext(LivePriceContext);
  const { isLiveEthereumPriceOn } = useContext(LivePriceContext);

  const getData = async () => {
    let keys = [];
    try {
      keys = await AsyncStorage.getAllKeys();
      setData(keys);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      getData();
    }

    return () => {
      isMounted = false;
    };
  }, [update]);

  return (
    // testing 
    <View>
      <Text>
        Live Bitcoin Price: {liveBitcoinPrice === null ? "Nothing" : liveBitcoinPrice}
      </Text>
      <Text>
        Live LTC Price: {liveLitecoinPrice === null ? "Nothing" : liveLitecoinPrice}
      </Text>
      <Text>
        Live Ethereum Price: {liveEthereumPrice === null ? "Nothing" : liveEthereumPrice}
      </Text>
      <Text>
        BTC : {isLiveBitcoinPriceOn === true ? "True" : "False"}
      </Text>
      <Text>
        LTC : {isLiveLitecoinPriceOn === true ? "True" : "False"}
      </Text>
      <Text>
        ETH : {isLiveEthereumPriceOn === true ? "True" : "False"}
      </Text>
      {data && (
        <View>
          {data.map((alarmIndex) => (
            <Alarm
              key={alarmIndex}
              alarmIndex={alarmIndex}
              navigation={navigation}
              update={update}
              setUpdate={setUpdate}
            />
          ))}
          <Button
          color="#41444b"
          title="NEW ALARM"
          onPress={() => navigation.reset({routes: [{name: "NewAlarm"}]})}
        />
        </View>
      )}
    </View>
  );
};

export default ExistingAlarm;
