import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

const NewAlarm = () => {
  return (
    <View>
      <View style={styles.selectSection}>
        <Text>
        Coin Pair
        </Text>
        <RNPickerSelect
        useNativeAndroidPickerStyle={false}
          onValueChange={(value) => console.log(value)}
          items={[
            { label: "BTC-USD", value: "BTC-USD" },
            { label: "ETH-USD", value: "ETH-USD" },
            { label: "LTC-USD", value: "LTC-USD" },
          ]}
          placeholder={{ label: "Select Pair...", value: null }}
          />
      </View>
      <View style={styles.selectSection}>

      <RNPickerSelect
      useNativeAndroidPickerStyle={false}
        onValueChange={(value) => console.log(value)}
        items={[{ label: "Less Than", value: "Less Than" }]}
        placeholder={{ label: "More Than", value: "More Than" }}
        />
        </View>
        <View style={styles.selectSection}>

      <Text>
      Price
      </Text>
        </View>
        <View style={styles.selectSection}>

      <Text>
      Alarm Sound
      </Text>
      <RNPickerSelect
      useNativeAndroidPickerStyle={false}
        onValueChange={(value) => console.log(value)}
        items={[{ label: "Bitconnect", value: "Bitconnect" }, {label:"Elon Musk", value: "Elon Musk"}]}
        placeholder={{ label: "Standard", value: "Standard" }}
        />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectSection: {
    flexDirection: "column",
    justifyContent:"center",
    alignItems: "center"

  }
})

export default NewAlarm;
