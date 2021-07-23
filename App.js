import "react-native-gesture-handler";
import React  from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator} from "@react-navigation/stack";
import NewAlarm from "./component/pages/NewAlarm";
import Home from "./component/pages/Home";
import ExistingAlarm from "./component/pages/ExistingAlarm";
import Alarm from './component/pages/Alarm'

import EditAlarmContextProvider from './component/context/EditAlarmContextProvider'

const Stack = createStackNavigator();

export default function App() {
  return (
    <EditAlarmContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="NewAlarm" component={NewAlarm} />
          <Stack.Screen name="ExistingAlarm" component={ExistingAlarm} />
          <Stack.Screen name="Alarm" component={Alarm} />
        </Stack.Navigator>
      </NavigationContainer>
    </EditAlarmContextProvider>
  );
}
