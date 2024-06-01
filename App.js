import { StyleSheet, View } from 'react-native';
import LoginScreen from './src/LoginScreen';
import RegisterScreen from './src/RegisterScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <LoginScreen />
      <RegisterScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
