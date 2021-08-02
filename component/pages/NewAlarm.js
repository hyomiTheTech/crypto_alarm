import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  Pressable,
  Alert
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { EditAlarmContext } from "../context/EditAlarmContextProvider";
import { LivePriceContext } from "../context/LivePriceContextProvider";

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { Audio } from 'expo-av';

let backgroundCoinPair
let backgroundCondition
let backgroundAlarmIndex
let backgroundAlarmSound
let backgroundPrice

function getData (data, pair) {
  
  if (pair === "bitcoin") {
    return data.bitcoin.usd
  } else if (pair === "litecoin") {
    return data.litecoin.usd
  } else if (pair === "ethereum") {
    return data.ethereum.usd
  }
  
}

let setBackgroundLivePrice  = () => {
}

/*
1. have a three different defined tasks

2. In each tasks
  1. fetch the api data and set it live
  2. set the if statement with saved price, condition, alarm sound 
    - if the condition is achieved then trigger alarmsound


1. coinPair
2. condition
3. alarmIndex
4. alarmSound

fn
1. setLive price
*/

TaskManager.defineTask("setLiveBitcoinPrice", async () => {

  let backgroundLivePrice 
  
  alert(`value = ${backgroundCoinPair}, ${backgroundCondition}, ${backgroundAlarmIndex}, ${backgroundAlarmSound}, price: ${backgroundLivePrice}`)

  fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${backgroundCoinPair}&vs_currencies=usd`
  )
    .then((response) => response.json())
    .then((data) =>  { backgroundLivePrice = getData(data, backgroundCoinPair); setBackgroundLivePrice(backgroundLivePrice) })

    const createTwoButtonAlert = () =>
    Alert.alert(
      "Alert Title",
      "My Alert Msg",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );

    createTwoButtonAlert()

    async function playSound() {

      alert("woeking?")
      
      const { sound } = await Audio.Sound.createAsync(
         require('../../assets/alarm-sound/mixkit-police-siren-us-1643.mp3')
      );
  
      await sound.playAsync(); }

      playSound()

  // // 2. set the if statement with saved price, condition, alarm sound 
  //   // - if the condition is achieved then trigger alarmsound
  //   if (backgroundCondition === "More Than" && backgroundPrice > backgroundLivePrice) {
  //     // alarmSound
  //     if (backgroundPrice > backgroundLivePrice) {

  //     }
  //   }
  return BackgroundFetch.Result.NewData;
});

TaskManager.defineTask("setLiveLitecoinPrice", async () => {
  
  alert(`value = ${backgroundCoinPair}, ${backgroundCondition}, ${backgroundAlarmIndex}, ${backgroundAlarmSound}, price: ${backgroundLivePrice}`)

  fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${backgroundCoinPair}&vs_currencies=usd`
  )
    .then((response) => response.json())
    .then((data) =>  setBackgroundLivePrice(getData(data, backgroundCoinPair)))

  // 2. set the if statement with saved price, condition, alarm sound 
    // - if the condition is achieved then trigger alarmsound

  return BackgroundFetch.Result.NewData;
});

TaskManager.defineTask("setLiveEthereumPrice", async () => {
  
  alert(`value = ${backgroundCoinPair}, ${backgroundCondition}, ${backgroundAlarmIndex}, ${backgroundAlarmSound}, price: ${backgroundLivePrice}`)

  fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${backgroundCoinPair}&vs_currencies=usd`
  )
    .then((response) => response.json())
    .then((data) =>  setBackgroundLivePrice(getData(data, backgroundCoinPair)))

  // 2. set the if statement with saved price, condition, alarm sound 
    // - if the condition is achieved then trigger alarmsound
  return BackgroundFetch.Result.NewData;
});

const NewAlarm = ({ navigation }) => {
  const [coinPair, setCoinPair] = useState("BTC-USD");
  const [condition, setCondition] = useState("Less Than");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [price, setPrice] = useState(null);
  const [alarmSound, setAlarmSound] = useState("Morning Clock");
  const [alarmIndex, setAlarmIndex] = useState(`${coinPair}${Math.random()}`)

  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState("setLiveBitcoinPrice")

  // context
  const { editingAlarmData } = useContext(EditAlarmContext);
  const { editingAlarmIndex } = useContext(EditAlarmContext);
  const { setLiveBitcoinPrice } = useContext(LivePriceContext);
  setBackgroundLivePrice = setLiveBitcoinPrice


  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync("setLiveBitcoinPrice", {
      minimumInterval: 1 * 15, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }


  function getCoinData (data) {
    let coinData
  
    if (coinPair === "BTC-USD") {
      coinData = data.bitcoin.usd
    } else if (coinPair === "LTC-USD") {
      coinData = data.litecoin.usd
    } else if (coinPair === "ETH-USD") {
      coinData = data.ethereum.usd
    }
  
    return coinData
  }

  function clearState() {
    setAlarmSound("Morning Clock");
    setCoinPair("BTC-USD");
    setCondition("Less Than");
    setPrice(null);
  }

  function retrieveEditingData() {
    setCoinPair(editingAlarmData.coinPair);
    setCondition(editingAlarmData.condition);
    setAlarmSound(editingAlarmData.alarmSound);
    setPrice(editingAlarmData.price);
  }

  useEffect(() => {
    editingAlarmData === null ? null : retrieveEditingData();
    

    

    if (coinPair === "BTC-USD") {
      backgroundCoinPair = "bitcoin"
      setCurrentTask("setLiveBitcoinPrice")
    } else if (coinPair === "LTC-USD") {
      backgroundCoinPair = "litecoin"
      setCurrentTask("setLiveLitecoinPrice")
    } else if (coinPair === "ETH-USD") {
      backgroundCoinPair = "ethereum"
      setCurrentTask("setLiveEthereumPrice")
    }

    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${backgroundCoinPair}&vs_currencies=usd`
    )
      .then((response) => response.json())
      .then((data) =>  setCurrentPrice(getCoinData(data)));

    const interval = setInterval(() => {
      fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${backgroundCoinPair}&vs_currencies=usd`
      )
        .then((response) => response.json())
        .then((data) => {
          setCurrentPrice(getCoinData(data));
        });
    }, 10000);
    return () => clearInterval(interval);
  }, [coinPair]);

  const storeData = async () => {
    try {
      const value = {
        coinPair: coinPair,
        condition: condition,
        price: price,
        alarmSound: alarmSound,
      };
      backgroundAlarmSound = alarmSound
      backgroundCondition = condition
      backgroundPrice = price

      registerBackgroundFetchAsync()

      const jsonValue = JSON.stringify(value);

      await AsyncStorage.setItem(
        editingAlarmIndex === null ? alarmIndex : editingAlarmIndex,
        jsonValue
      ).then(() => setModalVisible(!modalVisible));
    } catch (e) {
      error(e);
    }
  };

  return (
    <View>
      <Modal transparent={true} visible={modalVisible}>
        <View style={{ backgroundColor: "black", flex: 1 }}>
          <View style={{ margin: 50, padding: 40, backgroundColor: "white" }}>
            <Text style={{ fontSize: 20 }}>Alarm Saved!</Text>
            <Pressable
              onPress={() => {
                clearState();
                setModalVisible(!modalVisible);
                navigation.push("ExistingAlarm");
              }}
            >
              <Text>Close Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View>{currentPrice && <Text>Current Price: ${currentPrice}</Text>}</View>
      <View>
        <Text>Coin Pair</Text>

        <RNPickerSelect
          // style={styles.inputAndroid}
          useNativeAndroidPickerStyle={false}
          fixAndroidTouchableBug={true}
          onValueChange={(value) => setCoinPair(value)}
          name="coinPair"
          items={[
            { label: "BTC-USD", value: "BTC-USD" },
            { label: "ETH-USD", value: "ETH-USD" },
            { label: "LTC-USD", value: "LTC-USD" },
          ]}
          placeholder={{}}
          value={coinPair}
        />
      </View>
      <View>
        <Text>Condition</Text>

        <RNPickerSelect
          name="condition"
          style={styles.inputAndroid}
          useNativeAndroidPickerStyle={false}
          fixAndroidTouchableBug={true}
          onValueChange={(value) => setCondition(value)}
          items={[
            { label: "Less Than", value: "Less Than" },
            { label: "More Than", value: "More Than" },
          ]}
          placeholder={{}}
          value={condition}
        />
      </View>
      <View>
        <Text>Price</Text>

        <TextInput
          onChangeText={setPrice}
          style={styles.priceInput}
          placeholder={"Price"}
          value={price}
        />
      </View>
      <View>
        <Text>Alarm Sound</Text>

        <RNPickerSelect
          style={styles.inputAndroid}
          useNativeAndroidPickerStyle={false}
          fixAndroidTouchableBug={true}
          onValueChange={(value) => setAlarmSound(value)}
          items={[
            { label: "Morning Clock", value: "Morning Clock" },
            { label: "Slot Machine", value: "Slot Machine" },
            { label: "Police Siren", value: "Police Siren" },
            { label: "Buglar Alert", value: "Buglar Alert" },
          ]}
          placeholder={{}}
          value={alarmSound}
        />
      </View>
      <View>
        <Button
          color="#41444b"
          title="Save"
          onPress={() => {
            storeData();
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
  },
  modal: {
    width: "80%",
    height: "30%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "black",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "yellow",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default NewAlarm;
