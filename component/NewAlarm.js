import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, TextInput } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewAlarm = () => {
  const [coinPair, setCoinPair] = useState("");
  const [moreThan, setMoreThan] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null)
  const [price, setPrice] = useState(null);
  const [alarmSound, setAlarmSound] = useState(null);
  const [alarmIndex, setAlarmIndex] = useState(1)

  useEffect(() => {

    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd').then(response => response.json())
    .then(data => setCurrentPrice(data.bitcoin.usd))

    const interval = setInterval(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd').then(response => response.json())
    .then(data => {setCurrentPrice(data.bitcoin.usd); })}, 10000)
    return () => clearInterval(interval);
  },[])

  const storeData = async () => {
    try {
      const value = {
        coinPair: coinPair,
        moreThan: moreThan,
        price: price,
        alarmSound: alarmSound,
      };
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(`@${alarmIndex}`, jsonValue);
    } catch (e) {
      error(e);
    }
  };

  const increaseAlarmIndex = () => {
    setAlarmIndex(prev => prev + 1)
  }

  return (
    <View>
      <View>{currentPrice && <Text>Current Price: ${currentPrice}</Text>}</View>
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
        <TextInput onChangeText={setPrice} style={styles.priceInput} placeholder={"Price"}/>
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
            storeData(); increaseAlarmIndex();
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
  priceInput: {
    backgroundColor: "white",
    height: 25,
    margin: 6,
    borderWidth: 1,
  }
});

export default NewAlarm;
