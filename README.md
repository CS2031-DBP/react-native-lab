Vamos a crear un proyecto en React Native que utiliza los mismos API que nuestro proyecto anterior de react. Seguimos los siguientes pasos. 

### Paso 1: Set up el proyecto de React Native

Utilizamos el siguiente comando para crear un proyecto-ejemplo.

```bash
npx create-expo-app --template   
```

Elegimos blank y le damos un nombre a nuestro proyecto.

```bash
cd ReactNativeProject
```

### Paso 2: Instalamos las dependencies del API

Entras a tu directorio del proyecto y instalas `axios`:

```bash
npm install axios
```

### Paso 3: Crear el servicio API

Crea un nuevo archivo llamado `api.js` en el directorio `src`:

```javascript
// src/api.js
import axios from 'axios';

const API_URL = 'http://52.3.234.203:8080'; 

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const register = async (name, email, password, isTeacher) => {
  const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, isTeacher });
  return response.data;
};

export const listCourses = async (token) => {
  const response = await axios.get(`${API_URL}/course`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
```

### Paso 4: Crear Componentes

#### Login Component

Crear `LoginScreen.js` en el directorio `src`:

```javascript
// src/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { login } from './api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = await login(email, password);
      navigation.navigate('Courses', { token: data.token });
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Go to Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default LoginScreen;
```

#### Register Component

Crear `RegisterScreen.js` en el directorio `src`:

```javascript
// src/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { register } from './api';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);

  const handleRegister = async () => {
    try {
      await register(name, email, password, isTeacher);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  const toggleCheckbox = () => {
    setIsTeacher(!isTeacher);
  };

  return (
    <View style={styles.container}>
      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={toggleCheckbox} style={styles.checkbox}>
          {isTeacher && <View style={styles.checked} />}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Are you a teacher?</Text>
      </View>
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: 'blue',
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default RegisterScreen;
```

#### Courses Component

Crear `CoursesScreen.js` en el directorio `src`:
```javascript
// src/CoursesScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { listCourses } from './api';

const CoursesScreen = ({ route }) => {
  const { token } = route.params;
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await listCourses(token);
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };

    fetchCourses();
  }, [token]);

  return (
    <View style={styles.container}>
      <Text>Courses:</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <Text>{item.title}</Text>
            <Text>{item.remaining_spots}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  courseItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default CoursesScreen;
```

### Paso 5: Navigation

Usa React Navigation para cambiar entre pantallas. Instala React Navigation:

```bash
npm install @react-navigation/native @react-navigation/stack
```

Agrega la navegación a tu aplicación:

```javascript
// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/LoginScreen';
import RegisterScreen from './src/RegisterScreen';
import CoursesScreen from './src/CoursesScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Courses" component={CoursesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

```

### Paso 6: Correr el proyecto

Corre tu proyecto para ver los cambios:

```bash
npx expo start
```

### Paso 7: Agregamos async storage para guardar el token

Instalamos async storage:

```bash
npm install @react-native-async-storage/async-storage
```

Modificamos el archivo `api.js` para guardar el token en el dispositivo:

```javascript
// src/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://52.3.234.203:8080'; 

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  await AsyncStorage.setItem('token', response.data.token); // Store token
  return response.data;
};

export const register = async (name, email, password, isTeacher) => {
  const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, isTeacher });
  return response.data;
};

export const listCourses = async () => {
  const token = await AsyncStorage.getItem('token'); // Retrieve token
  const response = await axios.get(`${API_URL}/course`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('token'); // Remove token
};
```

Luego updateamos el archivo `LoginScreen.js` para que redireccione a la pantalla de cursos si ya hay un token guard

```javascript
// src/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { login } from './api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.navigate('Courses');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Go to Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default LoginScreen;
```

### Paso 8: Agregamos un botón de logout

Modificamos el archivo `CoursesScreen.js` para agregar un botón de logout:

```javascript
// src/CoursesScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { listCourses, logout } from './api';

const CoursesScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await listCourses();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };

    fetchCourses();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text>Courses:</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <Text>{item.title}</Text>
            <Text>{item.available_slots}</Text>
          </View>
        )}
      />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  courseItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default CoursesScreen;
```

### Paso 9: Correr el proyecto

Corre tu proyecto para ver los cambios:

```bash
npx expo start
```

### Paso 10: Agregando notificaciones push

Instalamos las dependencias necesarias:

```bash
npx expo install expo-notifications
```

Vamos a crear una notificación para cuando un usuario se logea exitosamente:

```javascript
// src/NotificationHelper.js
import * as Notifications from 'expo-notifications';

export const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('You need to enable notifications to use this app.');
    }
}

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const scheduleNotification = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: { seconds: 1 },
  });
};
```

### Paso 11: Modificamos el archivo `LoginScreen.js` para que envíe una notificación cuando un usuario se logea exitosamente:

```javascript
// src/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { login } from './api';
import { requestPermissions, scheduleNotification } from './notificationHelper';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    requestPermissions();
  }, []);

  const handleLogin = async () => {
    try {
      await login(email, password);
      await scheduleNotification('Login Successful', 'You have successfully logged in.');
      navigation.navigate('Courses');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Go to Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default LoginScreen;
```

### Paso 12: Correr el proyecto

Corre tu proyecto para ver las notificaciones en acción:

```bash
npx expo start
```

### Paso 13: Expo Sensors

Vamos a crear un nuevo view donde podemos ver el sensor de aceleración en acción.

Instalamos las dependencias necesarias:

```bash
npx expo install expo-sensors
```

Creamos un nuevo archivo llamado `SensorScreen.js` en el directorio `src`:

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const SensorScreen = ({ navigation }) => {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
      })
    );
    Accelerometer.setUpdateInterval(1000); // Set update interval to 1 second
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Accelerometer Data:</Text>
      <Text style={styles.data}>
        x: {data.x.toFixed(2)} y: {data.y.toFixed(2)} z: {data.z.toFixed(2)}
      </Text>
      <Button title="Unsubscribe" onPress={_unsubscribe} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  data: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default SensorScreen;
```

### Paso 14: Agregamos la navegación a `SensorScreen` en `App.js`:

```javascript
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/LoginScreen';
import RegisterScreen from './src/RegisterScreen';
import CoursesScreen from './src/CoursesScreen';
import SensorScreen from './src/SensorScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Courses" component={CoursesScreen} />
        <Stack.Screen name="Sensor" component={SensorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
```

### Paso 15: Agregamos un botón para navegar a `SensorScreen` en `CoursesScreen.js`:

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { listCourses, logout } from './api';

const CoursesScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await listCourses();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };

    fetchCourses();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text>Courses:</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <Text>{item.title}</Text>
            <Text>{item.available_slots}</Text>
          </View>
        )}
      />
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Go to Sensor" onPress={() => navigation.navigate('Sensor')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  courseItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default CoursesScreen;
```

### Paso 16: Correr el proyecto

Corre tu proyecto para ver el sensor de aceleración en acción:

```bash
npx expo start
```

### Final

¡Felicidades! Has completado el tutorial de React Native. Ahora puedes crear aplicaciones móviles con React Native y Expo. ¡Sigue adelante y crea algo increíble! 🚀
