import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ExistingAlarm = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@1");
        jsonValue != null ? JSON.parse(jsonValue) : null;
        console.log(jsonValue);
        setData(jsonValue);
      } catch (e) {
        // read error
      }
    };

    getData();
  });

  return (
    <View>
      <Text>Existing Alarm</Text>
      <Text>{data.coinPair}</Text>
    </View>
  );
};

export default ExistingAlarm;
