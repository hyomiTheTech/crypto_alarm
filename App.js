import "react-native-gesture-handler";
import React, {useState, useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from 'expo-linking';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

import NewAlarm from "./component/pages/NewAlarm";
import Home from "./component/pages/Home";
import ExistingAlarm from "./component/pages/ExistingAlarm";
import Alarm from "./component/pages/Alarm";

import EditAlarmContextProvider from "./component/context/EditAlarmContextProvider";
import LivePriceContextProvider from "./component/context/LivePriceContextProvider";

import {getData, getExistingAlarmKeys, getExistingAlarmData, registerBTCFetchAsync, registerLTCFetchAsync, registerETHFetchAsync} from './component/helper-functions/BackgroundTaskHelperFunction'

let setBackgroundLiveBitcoinPrice  = () => {
}

let setBackgroundLiveLitecoinPrice  = () => {
}

let setBackgroundLiveEthereumPrice  = () => {
}


TaskManager.defineTask("setLiveBTCPrice", async () => {
  console.log("setLiveBitcoinPrice still running")

    let backgroundLivePrice 

    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`
      )
      .then((response) => response.json()).catch((e) => console.log(e))
      .then((data) =>  { backgroundLivePrice = getData(data, "bitcoin"); 
        setBackgroundLiveBitcoinPrice(backgroundLivePrice);  
        // the data below is a array with keys
        getExistingAlarmKeys().then((data) => getExistingAlarmData(data, "BTC", backgroundLivePrice))})
  
  return BackgroundFetch.Result.NewData;
});

TaskManager.defineTask("setLiveLTCPrice", async () => {
  console.log("setLiveLitecoinPrice still running")

    let backgroundLivePrice 

    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd`
    )
      .then((response) => response.json()).catch((e) => console.log(e))
      .then((data) =>  { backgroundLivePrice = getData(data, "litecoin"); 
        setBackgroundLiveLitecoinPrice(backgroundLivePrice);  
        // the data below is a array with keys
        getExistingAlarmKeys().then((data) => getExistingAlarmData(data, "LTC", backgroundLivePrice))})
  
      return BackgroundFetch.Result.NewData;
});

TaskManager.defineTask("setLiveETHPrice", async () => {
  console.log("setLiveEthPrice still running")
  
    let backgroundLivePrice 
    
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
    )
      .then((response) => response.json()).catch((e) => console.log(e))
      .then((data) =>  { backgroundLivePrice = getData(data, "ethereum"); 
        setBackgroundLiveEthereumPrice(backgroundLivePrice);  
        // the data below is a array with keys
        getExistingAlarmKeys().then((data) => getExistingAlarmData(data, "ETH", backgroundLivePrice))})
  
  return BackgroundFetch.Result.NewData;
});

const Stack = createStackNavigator();

export default function App() {

  const [linkingData, setLinkingData] = useState(null)

  const prefix = Linking.makeUrl("/")

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        ExistingAlarm: "existingalarm",
      }
    }
  }

  function setupBackgroundFetch () {

    getExistingAlarmKeys().then((data) => {
      let isBTCAlarmOn = false
      let isLTCAlarmOn = false
      let isETHAlarmOn = false

      for (const key of data) {
        if (key.substring(0, 3) === "BTC") {
          isBTCAlarmOn = true
        } else if (key.substring(0, 3) === "LTC") {
          isLTCAlarmOn = true
        } else if (key.substring(0, 3) === "ETH") {
          isETHAlarmOn = true
        }
      }

      if (isLTCAlarmOn) {
        registerLTCFetchAsync()
      }
      if (isBTCAlarmOn) {
        registerBTCFetchAsync()
      } 
      if (isETHAlarmOn) {
        registerETHFetchAsync()
      }
    })
  }


  function handleDeepLink (event) {
    let data = Linking.parse(event.url)
    setLinkingData(data)
  }

  useEffect(() => {

    
    async function getInitialURL() {
      const initialURL = await Linking.getInitialURL();
      
      if (initialURL) {
        setLinkingData(Linking.parse(initialURL))
      }
    }
    setupBackgroundFetch()

    Linking.addEventListener("url", handleDeepLink)

    if (!linkingData) {
      getInitialURL()
    }

    return () => { Linking.removeEventListener("url") }
  }, [])

  return (
    <LivePriceContextProvider>
      <EditAlarmContextProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name="Home"  component={Home} linkingData={linkingData} />
            <Stack.Screen options={{headerShown: false}} name="NewAlarm" component={NewAlarm} />
            <Stack.Screen options={{headerShown: false}} name="ExistingAlarm" component={ExistingAlarm} />
            <Stack.Screen name="Alarm" component={Alarm} />
          </Stack.Navigator>
        </NavigationContainer>
      </EditAlarmContextProvider>
    </LivePriceContextProvider>
  );
}
