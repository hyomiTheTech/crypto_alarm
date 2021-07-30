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

import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

import { EditAlarmContext } from "../context/EditAlarmContextProvider";
import { LivePriceContext } from "../context/LivePriceContextProvider";

const NewAlarm = ({ navigation }) => {
  const [coinPair, setCoinPair] = useState("BTC-USD");
  const [condition, setCondition] = useState("Less Than");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [price, setPrice] = useState(null);
  const [alarmSound, setAlarmSound] = useState("Morning Clock");

  const [modalVisible, setModalVisible] = useState(false);

  // context
  const { editingAlarmData } = useContext(EditAlarmContext);
  const { editingAlarmIndex } = useContext(EditAlarmContext);
  const { setLiveBitcoinPrice } = useContext(LivePriceContext);

  const createIndex = () => {
    return `${coinPair}${Math.random()}`;
  };

  TaskManager.defineTask(createIndex(), async () => {
    // Be sure to return the successful result type!
    setLiveBitcoinPrice(currentPrice);

    return BackgroundFetch.Result.NewData;
  });

  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(createIndex(), {
      minimumInterval: 1 * 15, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
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

    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    )
      .then((response) => response.json())
      .then((data) => setCurrentPrice(data.bitcoin.usd));

    const interval = setInterval(() => {
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      )
        .then((response) => response.json())
        .then((data) => {
          setCurrentPrice(data.bitcoin.usd);
        });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const storeData = async () => {
    try {
      const value = {
        coinPair: coinPair,
        condition: condition,
        price: price,
        alarmSound: alarmSound,
      };
      const jsonValue = JSON.stringify(value);

      await AsyncStorage.setItem(
        editingAlarmIndex === null ? createIndex() : editingAlarmIndex,
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
            registerBackgroundFetchAsync();
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
