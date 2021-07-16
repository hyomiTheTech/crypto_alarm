import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Alarm = ({alarm}) => {

    const [data, setData] = useState({})

   const getMyObject = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem(alarm)
          jsonValue != null ? JSON.parse(jsonValue) : null
          setData(JSON.parse(jsonValue))
        } catch(e) {
            console.log(e)
          // read error
        }
      
      }

      useEffect(() => {
          getMyObject()
      },[])

    return (
        <View>
            <Text style={styles.text} >Coin Pair: {data.coinPair}</Text>
            <Text style={styles.text} >Side: {data.moreThan}</Text>
            <Text style={styles.text} >Price: {data.price}</Text>
            <Text style={styles.text} >Sound: {data.alarmSound}</Text>
            <Button style={styles.button}/>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "red"
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "black"
      }
})

export default Alarm