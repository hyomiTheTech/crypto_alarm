import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  Pressable,
  Alert
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { EditAlarmContext } from "../context/EditAlarmContextProvider";
import { LivePriceContext } from "../context/LivePriceContextProvider";

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { Audio } from 'expo-av';

// the background coin pair is selected at the same time when the user select coin pairs

function getData (data, pair) {
  
  if (pair === "bitcoin") {
    return data.bitcoin.usd
  } else if (pair === "litecoin") {
    return data.litecoin.usd
  } else if (pair === "ethereum") {
    return data.ethereum.usd
  }
  
}

let setBackgroundLiveBitcoinPrice  = () => {
}

let setBackgroundLiveLitecoinPrice  = () => {
}

let setBackgroundLiveEthereumPrice  = () => {
}

let setIsBackgroundLiveBitcoinPriceOn= () => {
}
let setIsBackgroundLiveEthereumPriceOn= () => {
}
let setIsBackgroundLiveLitecoinPriceOn= () => {
}

let isBackgroundLiveBitcoinPriceOn = true
let isBackgroundLiveLitecoinPriceOn = true
let isBackgroundLiveEthereumPriceOn = true

const getExistingAlarmKeys = async () => {
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
function getExistingAlarmData (data, pair, livePrice) {

  for (const key of data) {
    if (key.substring(0, 3) === pair) {
        AsyncStorage.getItem(key).then((data) => {
        let parsedData = JSON.parse(data)
      // check for status of alarm.  
      if (parsedData.isActive) {
        // since the function is used for multiple function, I need to check which pair this function is used for.
        // this statement would turn on the live price for corresponding pairs. It turns on because it checked one or more alarm is active.
        switch (pair) {
          case "BTC": 
            setIsBackgroundLiveBitcoinPriceOn(true)
            break;
          case "LTC":
            setIsBackgroundLiveLitecoinPriceOn(true)
            break;
          case "ETH":
            setIsBackgroundLiveEthereumPriceOn(true)
            break;  
        }
        
        // condition checking
        if (parsedData.condition === "Less Than" && Number(parsedData.price) > livePrice ) {
            playSound(parsedData.alarmSound)
          
          // Alarm alert that pop up when the alarm is triggered
          const createTwoButtonAlert = () => {
            Alert.alert(
              `what is goingon...!`,
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
          createTwoButtonAlert()
        
        } else if (parsedData.condition === "More Than" && Number(parsedData.price) < livePrice) {
          playSound(parsedData.alarmSound)

          const createTwoButtonAlert = () => {
            Alert.alert(
              `what is goingon..`,
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
          createTwoButtonAlert()
        }
      } }
    )
      
    }
  }
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

const NewAlarm = ({ navigation }) => {
  const [coinPair, setCoinPair] = useState("BTC-USD");
  const [condition, setCondition] = useState("Less Than");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [price, setPrice] = useState(null);
  const [alarmSound, setAlarmSound] = useState("Morning Clock");
  const [alarmIndex, setAlarmIndex] = useState(`${coinPair}${Math.random()}`)

  const [modalVisible, setModalVisible] = useState(false);
 

  // context
  const { editingAlarmData } = useContext(EditAlarmContext);
  const { editingAlarmIndex } = useContext(EditAlarmContext);
  const { setEditingAlarmIndex } = useContext(EditAlarmContext);
  const { setEditingAlarmData } = useContext(EditAlarmContext);
  const { setLiveBitcoinPrice } = useContext(LivePriceContext);
  const { liveBitcoinPrice } = useContext(LivePriceContext);

  const { setLiveLitecoinPrice } = useContext(LivePriceContext);
  const { liveLitecoinPrice } = useContext(LivePriceContext);

  const { setLiveEthereumPrice } = useContext(LivePriceContext);
  const { liveEthereumPrice } = useContext(LivePriceContext);

  const { setIsLiveBitcoinPriceOn } = useContext(LivePriceContext);
  const { setIsLiveEthereumPriceOn } = useContext(LivePriceContext);
  const { setIsLiveLitecoinPriceOn } = useContext(LivePriceContext);

  const { isLiveBitcoinPriceOn } = useContext(LivePriceContext);
  const { isLiveEthereumPriceOn } = useContext(LivePriceContext);
  const { isLiveLitecoinPriceOn } = useContext(LivePriceContext);

  setIsBackgroundLiveBitcoinPriceOn = setIsLiveBitcoinPriceOn
  setIsBackgroundLiveEthereumPriceOn = setIsLiveEthereumPriceOn
  setIsBackgroundLiveLitecoinPriceOn = setIsLiveLitecoinPriceOn

  setBackgroundLiveBitcoinPrice = setLiveBitcoinPrice
  setBackgroundLiveEthereumPrice = setLiveEthereumPrice
  setBackgroundLiveLitecoinPrice = setLiveLitecoinPrice

  backgroundLiveBitcoinPrice = liveBitcoinPrice
  backgroundLiveEthereumPrice = liveEthereumPrice
  backgroundLiveLitecoinPrice = liveLitecoinPrice

  isBackgroundLiveBitcoinPriceOn = isLiveBitcoinPriceOn
  isBackgroundLiveLitecoinPriceOn = isLiveEthereumPriceOn
  isBackgroundLiveEthereumPriceOn = isLiveLitecoinPriceOn

  async function registerBTCFetchAsync() {
    return await BackgroundFetch.registerTaskAsync("setLiveBTCPrice", {
      minimumInterval: 1 * 15, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }

  async function registerLTCFetchAsync() {
    return await BackgroundFetch.registerTaskAsync("setLiveLTCPrice", {
      minimumInterval: 1 * 15, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }

  async function registerETHFetchAsync() {
    return await BackgroundFetch.registerTaskAsync("setLiveETHPrice", {
      minimumInterval: 1 * 15, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }


  function getCoinData (data) {
    let coinData
    if (coinPair === "BTC-USD") {
      coinData = data.bitcoin.usd
    } else if (coinPair === "LTC-USD") {
      coinData = data.litecoin.usd
    } else if (coinPair === "ETH-USD") {
      coinData = data.ethereum.usd
    }
  
    return coinData
  }

  function clearState() {
    setAlarmSound("Morning Clock");
    setCoinPair("BTC-USD");
    setCondition("Less Than");
    setPrice(null);
  }

  function retrieveEditingData() {
    setCoinPair(editingAlarmData.coinPair);
    setCondition(editingAlarmData.condition);
    setAlarmSound(editingAlarmData.alarmSound);
    setPrice(editingAlarmData.price);
  }

  useEffect(() => {
    editingAlarmData === null ? null : retrieveEditingData();

    let selectedCoin

    setAlarmIndex(`${coinPair}${Math.random()}`)

    if(coinPair === "BTC-USD") {
      selectedCoin = "bitcoin"
    } else if (coinPair === "ETH-USD") {
      selectedCoin = "litecoin"
    } else if (coinPair === "LTC-USD") {
      selectedCoin = "ethereum"
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
        .then((data) => {
     
          setCurrentPrice(getCoinData(data));
        });
    }, 10000);
    return () => {clearInterval(interval); setEditingAlarmData(null); setEditingAlarmIndex(null);}
  }, [coinPair]);

  const storeData = async () => {
    try {
      const value = {
        coinPair: coinPair,
        condition: condition,
        price: price,
        alarmSound: alarmSound,
        isActive: true
      };

      backgroundAlarmSound = alarmSound
      backgroundCondition = condition
      backgroundPrice = price

      console.log("pair", coinPair)
      
      if (coinPair === "BTC-USD") {
        await registerBTCFetchAsync()
      } else if (coinPair === "LTC-USD") {
        await registerLTCFetchAsync()
      } else if (coinPair === "ETH-USD") {
        await registerETHFetchAsync()
      }

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
    <View>
      <Modal transparent={true} visible={modalVisible}>
        <View style={{ backgroundColor: "black", flex: 1 }}>
          <View style={{ margin: 50, padding: 40, backgroundColor: "white" }}>
            <Text style={{ fontSize: 20 }}>Alarm Saved!</Text>
            <Pressable
              onPress={() => {
                clearState();
                setModalVisible(!modalVisible);
                navigation.push("ExistingAlarm");
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
          // style={styles.inputAndroid}
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
          value={coinPair}
        />
      </View>
      <View>
        <Text>Condition</Text>

        <RNPickerSelect
          name="condition"
          style={styles.inputAndroid}
          useNativeAndroidPickerStyle={false}
          fixAndroidTouchableBug={true}
          onValueChange={(value) => setCondition(value)}
          items={[
            { label: "Less Than", value: "Less Than" },
            { label: "More Than", value: "More Than" },
          ]}
          placeholder={{}}
          value={condition}
        />
      </View>
      <View>
        <Text>Price</Text>

        <TextInput
          onChangeText={setPrice}
          style={styles.priceInput}
          placeholder={"Price"}
          value={price}
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
            { label: "Morning Clock", value: "Morning Clock" },
            { label: "Slot Machine", value: "Slot Machine" },
            { label: "Police Siren", value: "Police Siren" },
            { label: "Buglar Alert", value: "Buglar Alert" },
          ]}
          placeholder={{}}
          value={alarmSound}
        />
      </View>
      <View>
        <Button
          color="#41444b"
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
