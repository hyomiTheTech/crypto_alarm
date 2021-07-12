import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewAlarm = () => {
  const [coinPair, setCoinPair] = useState("");
  const [moreThan, setMoreThan] = useState(null);
  const [price, setPrice] = useState(100);
  const [alarmSound, setAlarmSound] = useState(null);

  const storeData = async () => {
    try {
      const value = {
        coinPair: coinPair,
        moreThan: moreThan,
        price: price,
        alarmSound: alarmSound,
      };
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@1", jsonValue);
    } catch (e) {
      error(e);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@1");
      if (value !== null) {
        console.log(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  return (
    <View>
      <View style={styles.selectSection}>
        <Text>Coin Pair</Text>
        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          onValueChange={(value) => setCoinPair(value)}
          name="coinPair"
          items={[
            { label: "BTC-USD", value: "BTC-USD" },
            { label: "ETH-USD", value: "ETH-USD" },
            { label: "LTC-USD", value: "LTC-USD" },
          ]}
          placeholder={{ label: "Select Pair...", value: "" }}
        />
      </View>
      <View style={styles.selectSection}>
        <RNPickerSelect
          name="moreThan"
          useNativeAndroidPickerStyle={false}
          onValueChange={(value) => setMoreThan(value)}
          items={[{ label: "Less Than", value: "Less Than" }]}
          placeholder={{ label: "More Than", value: "More Than" }}
        />
      </View>
      <View style={styles.selectSection}>
        <Text>Price</Text>
      </View>
      <View style={styles.selectSection}>
        <Text>Alarm Sound</Text>
        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          onValueChange={(value) => setAlarmSound(value)}
          items={[
            { label: "Bitconnect", value: "Bitconnect" },
            { label: "Elon Musk", value: "Elon Musk" },
          ]}
          placeholder={{ label: "Standard", value: "Standard" }}
        />
      </View>
      <View>
        <Button
          color="#41444b"
          title="Save"
          onPress={() => {
            console.log(coinPair, moreThan, price, alarmSound), storeData();
          }}
        />

        <Button
          color="#41444b"
          title="check"
          onPress={() => {
            getData();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NewAlarm;
