import React, { useState, useEffect, useContext } from "react";
import ReactDOM from 'react-dom'
import { StyleSheet, Text, TouchableOpacity, Button, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { EditAlarmContext } from "../context/EditAlarmContextProvider";
import { LivePriceContext } from "../context/LivePriceContextProvider";

import TrashCan from '../svg/trash-can'

import styled from "styled-components";

/*
darkest: #222831
dark gray: #393E46
granta: #00ADB5
gray: #EEEEEE
red: #FF2E63
*/

const StyledSlideButton = styled.TouchableOpacity`
  background-color: ${props => props.data.isActive === true ? `#00ADB5;`: `#EEEEEE` }
  position: absolute;
  right: 80px;
  width: 65px;
  height: 31px;
  bottom: 20px;
  align-self: center;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 100px;
`

const StyledDeleteButton = styled.TouchableOpacity`
  background-color: #00ADB5;
  position: absolute;
  right: 17px;
  width: 50px;
  height: 31px;
  bottom: 20px;
  align-self: center;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 100px;
`

const StyledSlideButtonDot = styled.TouchableOpacity`
  background-color: #393E46;
  position: absolute;
  width: 28px;
  height: 27px;
  right: ${props => props.data.isActive === true ? `116px;`: `81px;` }
  bottom: 22px;
  align-self: center;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 100px;
`


const Alarm = ({ navigation, alarmIndex, update, setUpdate }) => {
  const [data, setData] = useState({});
  // this is a artificial updater that re-render the page whenever alarm status is updated.
  const [updater, setUpdater] = useState(false)

  const { setEditingAlarmData } = useContext(EditAlarmContext);
  const { setEditingAlarmIndex } = useContext(EditAlarmContext);

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
    setUpdater(!updater)
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

  }, [updater]);

  const removeValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      // check existing alarm keys to update background tasks status
      // await AsyncStorage.getAllKeys().then((data) => {checkExistingAlarm(data)})
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
        <View>
          <Text style={styles.pair}>{data.coinPair}</Text>
          <View style={styles.priceAndCondition}>
            <Text style={styles.price}>{data.condition === "Less Than" ? "< " : "> "}</Text>
            <Text style={styles.price}>${data.price}</Text>
          </View>
        </View>
      )}

        <StyledDeleteButton onPress={() => {
          removeValue(alarmIndex);
          setUpdate(!update);
        }} >
          <TrashCan />
          </StyledDeleteButton>
        
      
        <StyledSlideButton onPress={updateAlarmStatus} data={data} />
        <StyledSlideButtonDot onPress={ updateAlarmStatus} data={data}/>
        
        <TouchableOpacity  />

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    backgroundColor: "#393E46",
    height: 80
  },
  priceAndCondition: {
    flexDirection: "row",
    color: "#EEEEEE"
  },
  pair: {
    color: "#EEEEEE",
    fontSize:20},
  price: {
    color: "#EEEEEE",
    fontSize: 25
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "black",
  },
});

export default Alarm;
