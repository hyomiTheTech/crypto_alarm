import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewAlarm = ({ navigation }) => {
  const [coinPair, setCoinPair] = useState("");
  const [moreThan, setMoreThan] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [price, setPrice] = useState(null);
  const [alarmSound, setAlarmSound] = useState(null);
  const [alarmIndex, setAlarmIndex] = useState(1);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
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
        price: price,
        alarmSound: alarmSound,
      };
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(`@${alarmIndex}`, jsonValue).then(() =>
        setModalVisible(!modalVisible)
      );
    } catch (e) {
      error(e);
    }
  };

  const increaseAlarmIndex = () => {
    setAlarmIndex((prev) => prev + 1);
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
        />
      </View>
      <View>
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
      </View>
      <View>
        <Text>Price</Text>
        <TextInput
          onChangeText={setPrice}
          style={styles.priceInput}
          placeholder={"Price"}
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
            { label: "Bitconnect", value: "Bitconnect" },
            { label: "Elon Musk", value: "Elon Musk" },
            { label: "Standard", value: "Standard" },
          ]}
          placeholder={{}}
        />
      </View>
      <View>
        <Button
          color="#41444b"
          title="Save"
          onPress={() => {
            storeData();
            increaseAlarmIndex();
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
