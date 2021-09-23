import React, {useEffect} from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

const Home = ({ navigation }) => {

  useEffect(() => {
    setTimeout(()=> {
      navigation.reset({routes: [{name: "ExistingAlarm"}]})
    }, 2000)
  },[])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRYPTO PRICE ALARM</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    backgroundColor: "#EEEEEE",
    marginHorizontal: 100,
    color: "#41444b",
    textAlign: "center",
    fontSize: 30,
    padding: 20
  },
  logo: {
    width: 150,
    height: 150,
    borderColor: "#00ADB5"
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
