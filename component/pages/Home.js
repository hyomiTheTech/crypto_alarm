import React, {useEffect} from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

const Home = ({ navigation }) => {

  useEffect(() => {
    setTimeout(()=> {
      navigation.reset({routes: [{name: "ExistingAlarm"}]})
    },1000)
  },[])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRYPTO ALARM</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#595260",
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
