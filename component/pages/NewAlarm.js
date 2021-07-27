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

const NewAlarm = ({ navigation }) => {
  const [coinPair, setCoinPair] = useState("");
  const [moreThan, setMoreThan] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [price, setPrice] = useState(null);
  const [alarmSound, setAlarmSound] = useState(null);
  // editing price
  const [editingAlarmPrice, setEditingAlarmPrice] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const { editingAlarmData } = useContext(EditAlarmContext);
  const { editingAlarmIndex } = useContext(EditAlarmContext);

  useEffect(() => {
    editingAlarmData === null
      ? null
      : setEditingAlarmPrice(editingAlarmData.price);
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
        moreThan: moreThan,
        price: editingAlarmData === null ? price : editingAlarmPrice,
        alarmSound: alarmSound,
      };
      const jsonValue = JSON.stringify(value);

      await AsyncStorage.setItem(
        editingAlarmIndex === null ? `@${Math.random()}` : editingAlarmIndex,
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
                setModalVisible(!modalVisible);
                navigation.navigate("ExistingAlarm");
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
        {editingAlarmData === null ? (
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
            placeholder={{ label: "LTC-USD", value: "LTC-USD" }}
          />
        ) : (
          <RNPickerSelect
            style={styles.inputAndroid}
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
            value={editingAlarmData.coinPair}
          />
        )}
      </View>
      <View>
        {editingAlarmData === null ? (
          <RNPickerSelect
            name="moreThan"
            style={styles.inputAndroid}
            useNativeAndroidPickerStyle={false}
            fixAndroidTouchableBug={true}
            onValueChange={(value) => setMoreThan(value)}
            items={[
              { label: "Less Than", value: "Less Than" },
              { label: "More Than", value: "More Than" },
            ]}
            placeholder={{}}
          />
        ) : (
          <RNPickerSelect
            name="moreThan"
            style={styles.inputAndroid}
            useNativeAndroidPickerStyle={false}
            fixAndroidTouchableBug={true}
            onValueChange={(value) => setMoreThan(value)}
            items={[
              { label: "Less Than", value: "Less Than" },
              { label: "More Than", value: "More Than" },
            ]}
            placeholder={{}}
            value={editingAlarmData.moreThan}
          />
        )}
      </View>
      <View>
        <Text>Price</Text>
        {editingAlarmData === null ? (
          <TextInput
            onChangeText={setPrice}
            style={styles.priceInput}
            placeholder={"Price"}
          />
        ) : (
          <TextInput
            onChangeText={setEditingAlarmPrice}
            style={styles.priceInput}
            placeholder={"Price"}
            value={editingAlarmPrice}
          />
        )}
      </View>
      <View>
        <Text>Alarm Sound</Text>
        {editingAlarmData === null ? (
          <RNPickerSelect
            style={styles.inputAndroid}
            useNativeAndroidPickerStyle={false}
            fixAndroidTouchableBug={true}
            onValueChange={(value) => setAlarmSound(value)}
            items={[
              { label: "Bitconnect", value: "Bitconnect" },
              { label: "Elon Musk", value: "Elon Musk" },
              { label: "Standard", value: "Standard" },
            ]}
            placeholder={{}}
          />
        ) : (
          <RNPickerSelect
            style={styles.inputAndroid}
            useNativeAndroidPickerStyle={false}
            fixAndroidTouchableBug={true}
            onValueChange={(value) => setAlarmSound(value)}
            items={[
              { label: "Bitconnect", value: "Bitconnect" },
              { label: "Elon Musk", value: "Elon Musk" },
              { label: "Standard", value: "Standard" },
            ]}
            placeholder={{}}
            value={editingAlarmData.alarmSound}
          />
        )}
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