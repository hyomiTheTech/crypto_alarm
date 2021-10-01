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
import styled from "styled-components";

import { EditAlarmContext } from "../context/EditAlarmContextProvider";

const pickerStyle = {
	inputIOS: {
		color: 'white',
		paddingTop: 13,
		paddingHorizontal: 10,
		paddingBottom: 12,
	},
	inputAndroid: {
		color: 'white',
	},
	placeholderColor: 'white',
	underline: { borderTopWidth: 0 },
	icon: {
		position: 'absolute',
		backgroundColor: 'transparent',
		borderTopWidth: 5,
		borderTopColor: '#00000099',
		borderRightWidth: 5,
		borderRightColor: 'transparent',
		borderLeftWidth: 5,
		borderLeftColor: 'transparent',
		width: 0,
		height: 0,
		top: 20,
		right: 15,
	},
};



const NewAlarm = ({ navigation }) => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [alarmInfo, setAlarmInfo] = useState({
    coinPair: "BTC-USD",
    condition: "Less Than",
    price: null,
    alarmSound: "Morning Clock",
  })

  const [alarmIndex, setAlarmIndex] = useState(`${alarmInfo.coinPair}${Math.random()}`)
  const [modalVisible, setModalVisible] = useState(false);
 
  // context
  const { editingAlarmData } = useContext(EditAlarmContext);
  const { editingAlarmIndex } = useContext(EditAlarmContext);
  const { setEditingAlarmIndex } = useContext(EditAlarmContext);
  const { setEditingAlarmData } = useContext(EditAlarmContext);

  function getCoinData (data) {
    let coinData
    if (alarmInfo.coinPair === "BTC-USD") {
      coinData = data.bitcoin.usd
    } else if (alarmInfo.coinPair === "LTC-USD") {
      coinData = data.litecoin.usd
    } else if (alarmInfo.coinPair === "ETH-USD") {
      coinData = data.ethereum.usd
    }
    return coinData
  }

  function clearState() {
    setAlarmInfo({
      coinPair: "BTC-USD",
      condition: "Less Than",
      price: null,
      alarmSound: "Morning Clock",
    })
  }

  function retrieveEditingData() {
    setAlarmInfo({
      coinPair: editingAlarmData.coinPair,
      condition: editingAlarmData.condition,
      price: editingAlarmData.price,
      alarmSound: editingAlarmData.alarmSound,
    })
  }

  useEffect(() => {
    editingAlarmData === null ? null : retrieveEditingData();

    let selectedCoin

    setAlarmIndex(`${alarmInfo.coinPair}${Math.random()}`)

    if (alarmInfo.coinPair === "BTC-USD") {
      selectedCoin = "bitcoin"
    } else if (alarmInfo.coinPair === "ETH-USD") {
      selectedCoin = "ethereum"
    } else if (alarmInfo.coinPair === "LTC-USD") {
      selectedCoin = "litecoin"
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
  }, [alarmInfo.coinPair]);

  const storeData = async () => {
    try {
      const value = {
        ...alarmInfo,
        isActive: true
      };

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
    <View style={styles.background}>
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
              <Text style={styles.header}>Close Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View>{currentPrice && <Text style={styles.header}>Current Price: ${currentPrice}</Text>}</View>
      <View>
        <Text style={styles.header}>Coin Pair</Text>

        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          fixAndroidTouchableBug={true}
          onValueChange={(value) => setAlarmInfo({...alarmInfo, coinPair: value})}
          name="coinPair"
          items={[
            { label: "BTC-USD", value: "BTC-USD" },
            { label: "ETH-USD", value: "ETH-USD" },
            { label: "LTC-USD", value: "LTC-USD" },
          ]}
          placeholder={{}}
          value={alarmInfo.coinPair}
        />
      </View>
      <View>
        <Text style={styles.header}>Condition</Text>

        <RNPickerSelect
          name="condition"
          useNativeAndroidPickerStyle={false}
          style={pickerStyle}
          useNativeAndroidPickerStyle={false}
          fixAndroidTouchableBug={true}
          onValueChange={(value) => setAlarmInfo({...alarmInfo, condition: value})}
          items={[
            { label: "Less Than", value: "Less Than" },
            { label: "More Than", value: "More Than" },
          ]}
          placeholder={{}}
          value={alarmInfo.condition}
        />
      </View>
      <View>
        <Text style={styles.header}>Price</Text>
        <TextInput
          onChangeText={(input) => setAlarmInfo({...alarmInfo, price: input})}
          style={styles.priceInput}
          placeholder={"Price"}
          value={alarmInfo.price}
        />
      </View>
      <View>
        <Text style={styles.header}>Alarm Sound</Text>
        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          style={pickerStyle}
          useNativeAndroidPickerStyle={false}
          fixAndroidTouchableBug={true}
          onValueChange={(value) => setAlarmInfo({...alarmInfo, alarmSound: value})}
          items={[
            { label: "Morning Clock", value: "Morning Clock" },
            { label: "Slot Machine", value: "Slot Machine" },
            { label: "Police Siren", value: "Police Siren" },
            { label: "Buglar Alert", value: "Buglar Alert" },
          ]}
          placeholder={{}}
          value={alarmInfo.alarmSound}
        />
      </View>
      <View>
        <Button
          color="#00ADB5"
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
  background: {
    backgroundColor: "#222831",
    height: "100%",
    alignContent: "space-around",
    justifyContent: "space-around",
  },
  selectSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  priceInput: {
    backgroundColor: "white",
    height: 45,
    margin: 6,
    borderWidth: 1,
  },
  modal: {
    width: "80%",
    height: "30%",
  },
  inputAndroid: {
    color: "#EEEEEE"
  },
  header: {
    fontSize:20,
    color: "#EEEEEE"
  }
});

export default NewAlarm;
