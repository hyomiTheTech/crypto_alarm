import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { EditAlarmContext } from "../context/EditAlarmContextProvider";

const Alarm = ({ navigation, alarmIndex, removeValue, update, setUpdate }) => {
  const [data, setData] = useState({});
  const [sound, setSound] = useState();

  const { setEditingAlarmData } = useContext(EditAlarmContext);
  const { setEditingAlarmIndex } = useContext(EditAlarmContext);

  const getMyObject = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(alarmIndex);
      console.log(alarmIndex);
      jsonValue != null ? JSON.parse(jsonValue) : null;
      setData(JSON.parse(jsonValue));
    } catch (e) {
      console.log(e);
      // read error
    }
  };

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync();
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    let isMounted = true;

    if (isMounted) getMyObject();
    return () => {
      sound
        ? () => {
            sound.unloadAsync();
          }
        : undefined;
      isMounted = false;
    };
  }, [sound]);

  return (
    <TouchableOpacity
      style={styles.border}
      onPress={() => {
        setEditingAlarmData(data);
        setEditingAlarmIndex(alarmIndex);
        navigation.push("NewAlarm");
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
