import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style = {styles.title} >Hello World</Text>
      <Link href={"/(auth)/signup"} >SignUp</Link>
      <Link href={"/(auth)"} >Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "blue",
  }
});