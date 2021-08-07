import "react-native-gesture-handler";
import React, {useState, useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from 'expo-linking';

import NewAlarm from "./component/pages/NewAlarm";
import Home from "./component/pages/Home";
import ExistingAlarm from "./component/pages/ExistingAlarm";
import Alarm from "./component/pages/Alarm";

import EditAlarmContextProvider from "./component/context/EditAlarmContextProvider";
import LivePriceContextProvider from "./component/context/LivePriceContextProvider";

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


  function handleDeepLink (event) {
    console.log(event)
    let data = Linking.parse(event.url)
    setLinkingData(data)
  }

  useEffect(() => {

    async function getInitialURL() {
      const initialURL = await Linking.getInitialURL();
      // console.log("initial?", initialURL)
      if (initialURL) {
        setLinkingData(Linking.parse(initialURL))
      }
    }

    Linking.addEventListener("url", handleDeepLink)

    if (!linkingData) {
      getInitialURL()
      console.log("herhe?")
    }

    console.log(linkingData)

    

    return () => { Linking.removeEventListener("url") }
  }, [])

  return (
    <LivePriceContextProvider>
      <EditAlarmContextProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} linkingData={linkingData} />
            <Stack.Screen name="NewAlarm" component={NewAlarm} />
            <Stack.Screen name="ExistingAlarm" component={ExistingAlarm} />
            <Stack.Screen name="Alarm" component={Alarm} />
          </Stack.Navigator>
        </NavigationContainer>
      </EditAlarmContextProvider>
    </LivePriceContextProvider>
  );
}
