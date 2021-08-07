import {
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from 'expo-av';
import * as Linking from 'expo-linking';
import * as BackgroundFetch from 'expo-background-fetch';


// the background coin pair is selected at the same time when the user select coin pairs
export function getData (data, pair) {
  
    if (pair === "bitcoin") {
      return data.bitcoin.usd
    } else if (pair === "litecoin") {
      return data.litecoin.usd
    } else if (pair === "ethereum") {
      return data.ethereum.usd
    }
    
  }

  export const getExistingAlarmKeys = async () => {
    let keys = [];
    try {
      keys = await AsyncStorage.getAllKeys();
    } catch (e) {
      console.log(e);
    }
  
    return keys;
  };


// each sound is played by its own function
async function playMorningClock() {
            
    const { sound } = await Audio.Sound.createAsync(
       require(`../../assets/alarm-sound/morning-clock.wav`)
    );
  
    await sound.playAsync(); }
  
  async function playPoliceSiren() {
            
    const { sound } = await Audio.Sound.createAsync(
        require(`../../assets/alarm-sound/police-siren.wav`)
    );
  
  await sound.playAsync(); }
  
  async function playBuglarAlert() {
          
    const { sound } = await Audio.Sound.createAsync(
        require(`../../assets/alarm-sound/buglar-alert.wav`)
    );
    
  await sound.playAsync(); }
  
  async function playSlotMachine() {
        
    const { sound } = await Audio.Sound.createAsync(
        require(`../../assets/alarm-sound/slot-machine.wav`)
    );
  
    await sound.playAsync(); }
  
  // alarm sound function
  function playSound(soundData) {
      
    if (soundData === "Morning Clock") {
      playMorningClock()
    } else if (soundData ==="Police Siren") {
      playPoliceSiren()
    } else if (soundData === "Buglar Alert") {
      playBuglarAlert()
    } else if ("Slot Machine" === soundData) {
      playSlotMachine()
    }
      }
  
    const updateAlarmStatus = async (data, index) => {
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
          index,
          stringifiedValue
        )
  
      } catch(e) {
        error(e)
      }
    }
  
  // Not only does it get existing alarm data, but also it checks the condition of alarm as well.
  export function getExistingAlarmData (data, pair, livePrice) {
  
    for (const key of data) {
      if (key.substring(0, 3) === pair) {
          AsyncStorage.getItem(key).then((data) => {
          let parsedData = JSON.parse(data)
        // check for status of alarm.  
        if (parsedData.isActive) {
          // since the function is used for multiple function, I need to check which pair this function is used for.
          // this statement would turn on the live price for corresponding pairs. It turns on because it checked one or more alarm is active.
        //   switch (pair) {
        //     case "BTC": 
        //       setIsBackgroundLiveBitcoinPriceOn(true)
        //       break;
        //     case "LTC":
        //       setIsBackgroundLiveLitecoinPriceOn(true)
        //       break;
        //     case "ETH":
        //       setIsBackgroundLiveEthereumPriceOn(true)
        //       break;  
        //   }
          
          // condition checking
          if (parsedData.condition === "Less Than" && Number(parsedData.price) > livePrice ) {
            Linking.openURL("exp://192.168.43.185:19000/--/existingalarm")
            
            // Alarm alert that pop up when the alarm is triggered
            const createTwoButtonAlert = () => {
              Alert.alert(
                `Let's Trade ${pair}!`,
                `${pair} is ${parsedData.condition} ${parsedData.price}!`,
                [
                  {
                    text: "Dismiss",
                    // turn setIsactive(false)
                    onPress: () => updateAlarmStatus(parsedData, key),
                    style: "cancel"
                  },
                  // turn setIsactive(false)
                  { text: "OK", onPress: () => updateAlarmStatus(parsedData, key) }
                ],
                { cancelable: false }
              );
            }
            setTimeout(() => {createTwoButtonAlert(); playSound(parsedData.alarmSound)}, 2000)
          
          } else if (parsedData.condition === "More Than" && Number(parsedData.price) < livePrice) {
            Linking.openURL("exp://192.168.43.185:19000/--/existingalarm")
            playSound(parsedData.alarmSound)
  
            const createTwoButtonAlert = () => {
              Alert.alert(
                `Let's Trade ${pair}!`,
                `${pair} is ${parsedData.condition} ${parsedData.price}!`,
                [
                  {
                    text: "Cancel",
                    onPress: () => updateAlarmStatus(parsedData, key),
                    style: "cancel"
                  },
                  { text: "OK", onPress: () => updateAlarmStatus(parsedData, key) }
                ],
                { cancelable: false }
              );
            }
            setTimeout(() => {createTwoButtonAlert(); playSound(parsedData.alarmSound)}, 2000)
          }
        } }
      )
        
      }
    }
  }

export async function registerBTCFetchAsync() {
    console.log("BTC ONNONO")
    return await BackgroundFetch.registerTaskAsync("setLiveBTCPrice", {
      minimumInterval: 1 * 15, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }

export async function registerLTCFetchAsync() {
    console.log("LTC ONNONO")
    return await BackgroundFetch.registerTaskAsync("setLiveLTCPrice", {
      minimumInterval: 1 * 15, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }

export async function registerETHFetchAsync() {

    console.log("ETH ONNONO")
    return await BackgroundFetch.registerTaskAsync("setLiveETHPrice", {
      minimumInterval: 1 * 15, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }