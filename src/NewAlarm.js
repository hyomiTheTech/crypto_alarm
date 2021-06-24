import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

const NewAlarm = () => {
  return (
    <View>
      Coin Pair
      <RNPickerSelect
        onValueChange={(value) => console.log(value)}
        items={[
          { label: "BTC-USD", value: "BTC-USD" },
          { label: "ETH-USD", value: "ETH-USD" },
          { label: "LTC-USD", value: "LTC-USD" },
        ]}
        placeholder={{ label: "Select Pair...", value: null }}
      />
      <RNPickerSelect
        onValueChange={(value) => console.log(value)}
        items={[{ label: "Less Than", value: "Less Than" }]}
        placeholder={{ label: "More Than", value: "More Than" }}
      />
      Price
      Alarm Sound
      <RNPickerSelect
        onValueChange={(value) => console.log(value)}
        items={[{ label: "Bitconnect", value: "Bitconnect" }, {label:"Elon Musk", value: "Elon Musk"}]}
        placeholder={{ label: "Standard", value: "Standard" }}
      />
    </View>
  );
};

export default NewAlarm;
