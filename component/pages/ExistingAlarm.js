import React, { useState, useEffect, useContext } from "react";
import { Button, StyleSheet, TouchableOpacity, View, ScrollView, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundFetch from 'expo-background-fetch';

import Alarm from "./Alarm";

import { LivePriceContext } from "../context/LivePriceContextProvider";

const ExistingAlarm = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(true);

  const { liveBitcoinPrice } = useContext(LivePriceContext);
  const { liveLitecoinPrice } = useContext(LivePriceContext);
  const { liveEthereumPrice } = useContext(LivePriceContext);

   const { isLiveBitcoinPriceOn } = useContext(LivePriceContext);
  const { isLiveLitecoinPriceOn } = useContext(LivePriceContext);
  const { isLiveEthereumPriceOn } = useContext(LivePriceContext);

  const getData = async () => {
    let keys = [];
    try {
      keys = await AsyncStorage.getAllKeys();
      setData(keys);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      getData();
    }

    return () => {
      isMounted = false;
    };
  }, [update]);

  return (
    <View style={styles.background}>
    <ScrollView>
      {data && (
        <View>
          {data.map((alarmIndex) => (
            <Alarm
            key={alarmIndex}
            alarmIndex={alarmIndex}
            navigation={navigation}
            update={update}
            setUpdate={setUpdate}
            />
            ))}
        </View>
      )}
    </ScrollView>
      <TouchableOpacity
      style={styles.newAlarmButton}
      title="NEW ALARM"
      onPress={() => navigation.reset({routes: [{name: "NewAlarm"}]})}
      >
        <View style={styles.cross}>
          <View style={styles.crossUp} />
          <View style={styles.crossFlat} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#222831",
    flex: 1,
  },
  cross: {display: "flex",
  justifyContent: "center",
  alignItems: "center"
},
  newAlarmButton : {
    backgroundColor: "#00ADB5",
    position: "absolute",
    width: 65,
    height: 65,
    bottom: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
  },
  crossUp: {
    backgroundColor: "#222831",
    height: 35,
    width: 3,
    },
    crossFlat: {
    backgroundColor: "#222831",
    position: "absolute",
    bottom: "47%",
    height: 3,
    width: 35,
    },
})

export default ExistingAlarm;


