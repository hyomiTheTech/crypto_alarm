import React, { useState, useEffect, useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Alarm from "./Alarm";

import { LivePriceContext } from "../context/LivePriceContextProvider";

const ExistingAlarm = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(true);

  const { liveBitcoinPrice } = useContext(LivePriceContext);

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
    getData();

    return getData;
  }, [update]);

  const removeValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      // remove error
      console.log(e);
    }
  };

  return (
    <View>
      <Text>
        Live Price: {liveBitcoinPrice === null ? "Nothing" : liveBitcoinPrice}
      </Text>
      {data && (
        <View>
          {data.map((alarmIndex) => (
            <Alarm
              key={alarmIndex}
              alarmIndex={alarmIndex}
              navigation={navigation}
              removeValue={removeValue}
              update={update}
              setUpdate={setUpdate}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default ExistingAlarm;
