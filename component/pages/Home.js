import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

const Home = ({ navigation, linkingData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRYPTO ALARM</Text>
      {linkingData === undefined ? <Text>nothing...</Text> :(<Text>{`blajsljf??: ${linkingData}`}</Text>) }
      <View style={styles.buttonContainer}>
        <Button
          color="#41444b"
          title="NEW ALARM"
          onPress={() => navigation.navigate("NewAlarm")}
        />
        <Button
          color="#41444b"
          style={styles.button}
          title="EXISTING ALARM"
          onPress={() => navigation.navigate("ExistingAlarm")}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

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
    fontSize: 40,
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

export default Home;
