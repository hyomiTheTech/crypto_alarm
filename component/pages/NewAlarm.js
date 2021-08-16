import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { EditAlarmContext } from "../context/EditAlarmContextProvider";
import { LivePriceContext } from "../context/LivePriceContextProvider";

import { registerBTCFetchAsync, registerLTCFetchAsync, registerETHFetchAsync} from '../helper-functions/BackgroundTaskHelperFunction'

let isBackgroundLiveBitcoinPriceOn = true
let isBackgroundLiveLitecoinPriceOn = true
let isBackgroundLiveEthereumPriceOn = true  


const NewAlarm = ({ navigation }) => {
  const [coinPair, setCoinPair] = useState("BTC-USD");
  const [condition, setCondition] = useState("Less Than");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [price, setPrice] = useState(null);
  const [alarmSound, setAlarmSound] = useState("Morning Clock");
  const [alarmIndex, setAlarmIndex] = useState(`${coinPair}${Math.random()}`)

  const [modalVisible, setModalVisible] = useState(false);
 
  // context
  const { editingAlarmData } = useContext(EditAlarmContext);
  const { editingAlarmIndex } = useContext(EditAlarmContext);
  const { setEditingAlarmIndex } = useContext(EditAlarmContext);
  const { setEditingAlarmData } = useContext(EditAlarmContext);

  const { isLiveBitcoinPriceOn } = useContext(LivePriceContext);
  const { isLiveEthereumPriceOn } = useContext(LivePriceContext);
  const { isLiveLitecoinPriceOn } = useContext(LivePriceContext);

  isBackgroundLiveBitcoinPriceOn = isLiveBitcoinPriceOn
  isBackgroundLiveLitecoinPriceOn = isLiveEthereumPriceOn
  isBackgroundLiveEthereumPriceOn = isLiveLitecoinPriceOn


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

    let selectedCoin

    setAlarmIndex(`${coinPair}${Math.random()}`)

    if(coinPair === "BTC-USD") {
      selectedCoin = "bitcoin"
    } else if (coinPair === "ETH-USD") {
      selectedCoin = "litecoin"
    } else if (coinPair === "LTC-USD") {
      selectedCoin = "ethereum"
    }

    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCoin}&vs_currencies=usd`
    )
      .then((response) => response.json())
      .then((data) =>  {setCurrentPrice(getCoinData(data))});

    const interval = setInterval(() => {
      fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCoin}&vs_currencies=usd`
      )
        .then((response) => response.json())
        .then((data) => setCurrentPrice(getCoinData(data)));
    }, 10000);
    return () => {clearInterval(interval); setEditingAlarmData(null); setEditingAlarmIndex(null);}
  }, [coinPair]);

  const storeData = async () => {
    try {
      const value = {
        coinPair: coinPair,
        condition: condition,
        price: price,
        alarmSound: alarmSound,
        isActive: true
      };

      backgroundAlarmSound = alarmSound
      backgroundCondition = condition
      backgroundPrice = price

      const jsonValue = JSON.stringify(value);

      await AsyncStorage.setItem(
        editingAlarmIndex === null ? alarmIndex : editingAlarmIndex,
        jsonValue
      ).then(() => setModalVisible(!modalVisible));
    } catch (e) {
      error(e);
    }
  };

  function setupBackgroundFetch () {
    if (coinPair === "BTC-USD") {
      registerBTCFetchAsync()
    } else if (coinPair === "LTC-USD") {
      registerLTCFetchAsync()
    } else if (coinPair === "ETH-USD") {
      registerETHFetchAsync()
    }
  }

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
                navigation.reset({routes: [{name: "ExistingAlarm"}]})
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
            setupBackgroundFetch();
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
