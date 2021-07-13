import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ExistingAlarm = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        let jsonValue = await AsyncStorage.getItem("@1");
        let parsedValue = JSON.parse(jsonValue)
        console.log(parsedValue);
        setData(parsedValue);
      } catch (e) {
        // read error
      }
    };

    getData();
  },[]);

  return (
    <View>
      <Text>Existing Alarm</Text>
      {data && <Text>{data.price}</Text>}
    </View>
  );
};

export default ExistingAlarm;
