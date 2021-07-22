import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Alarm from "./Alarm";

const ExistingAlarm = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      let keys = [];
      try {
        keys = await AsyncStorage.getAllKeys();
        setData(keys);
      } catch (e) {}
    };
    getData();
  }, []);

  return (
    <View>
      <Text>Existing Alarm</Text>
      {data && (
        <View>
          {data.map((alarm, index) => (
            <Alarm key={index} alarm={alarm} />
          ))}
        </View>
      )}
    </View>
  );
};

export default ExistingAlarm;
