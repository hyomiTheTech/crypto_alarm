import React, { useState, useEffect, useContext } from "react";
import ReactDOM from 'react-dom'
import { StyleSheet, Text, TouchableOpacity, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { EditAlarmContext } from "../context/EditAlarmContextProvider";
import { LivePriceContext } from "../context/LivePriceContextProvider";
import * as BackgroundFetch from 'expo-background-fetch';




const Alarm = ({ navigation, alarmIndex, update, setUpdate }) => {
  const [data, setData] = useState({});

  const { setEditingAlarmData } = useContext(EditAlarmContext);
  const { setEditingAlarmIndex } = useContext(EditAlarmContext);

  const { setIsLiveBitcoinPriceOn } = useContext(LivePriceContext);
  const { setIsLiveEthereumPriceOn } = useContext(LivePriceContext);
  const { setIsLiveLitecoinPriceOn } = useContext(LivePriceContext);

  const getMyObject = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(alarmIndex);
      // console.log(alarmIndex);
      jsonValue != null ? JSON.parse(jsonValue) : null;
      setData(JSON.parse(jsonValue));
    } catch (e) { 
      console.log(e);
      // read error
    }
  }

  const updateAlarmStatus = async () => {
    try {
      const value = {
        coinPair: data.coinPair,
        condition: data.condition,
        price: data.price,
        alarmSound: data.alarmSound,
        isActive: !data.isActive
      };

      const stringifiedValue = JSON.stringify(value)
      await AsyncStorage.setItem(
        alarmIndex,
        stringifiedValue
      )

    } catch(e) {
      error(e)
    }
  }

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      getMyObject()
    }

    return () => {
      isMounted = false;
    };

  }, [data]);

    // helping functions
const checkExistingAlarm = (data) => {
  // let isLiveBTCOn = false
  // let isLiveLTCOn = false
  // let isLiveETHOn = false

  // for (const key of data) {
    
  //   if (key.substring(0, 3) === "BTC") {
  //     isLiveBTCOn = true
  //   } else if (key.substring(0, 3) === "ETH") {
  //     isLiveETHOn = true
  //   } else if (key.substring(0, 3) === "LTC") {
  //     isLiveLTCOn = true
  //   }
  // }
  // // unregister task that is not necessary
  // if (!isLiveBTCOn) {
  //   setIsLiveBitcoinPriceOn(false)
  // } 
  // if (!isLiveLTCOn) {
  //   setIsLiveEthereumPriceOn(false)
  // } 
  // if (!isLiveETHOn) {
  //   setIsLiveLitecoinPriceOn(false)
  // }
}

  const removeValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      // check existing alarm keys to update background tasks status
      await AsyncStorage.getAllKeys().then((data) => {checkExistingAlarm(data)})
    } catch (e) {
      // remove error
      console.log(e);
    }

  };

  return (
    <TouchableOpacity
      style={styles.border}
      onPress={() => {
        setEditingAlarmData(data);
        setEditingAlarmIndex(alarmIndex);
        navigation.navigate("NewAlarm");
      }}
    >
      {data && (
        <>
          <Text style={styles.text}>Coin Pair: {data.coinPair}</Text>
          <Text style={styles.text}>Condition: {data.condition}</Text>
          <Text style={styles.text}>Price: {data.price}</Text>
          <Text style={styles.text}>Sound: {data.alarmSound}</Text>
        </>
      )}
      {data && data.isActive === true ? (<Button title="Active" color='#2196F3' onPress={updateAlarmStatus} /> ) : (<Button title="Not Active" color="#808080" onPress={updateAlarmStatus} />)}
        <Button
        title="Delete"
        onPress={() => {
          removeValue(alarmIndex);
          setUpdate(!update);
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
  },
  text: {
    color: "red",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "black",
  },
});

export default Alarm;
