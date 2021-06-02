import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigation } from "@react-navigation/stack";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRYPTO ALARM</Text>
      <View style={styles.buttonContainer}>
        <Button color="#41444b" title="NEW ALARM" />
        <Button color="#41444b" style={styles.button} title="EXISTING ALARM" />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#52575d",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    backgroundColor: "#fff",
    color: "#41444b",
    fontSize: 50,
    marginVertical: 150,
  },
  buttonContainer: {
    height: 100,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
