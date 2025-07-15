/*
 * @Author: heweifeng
 * @Date: 2025-07-14 17:30:07
 * @LastEditors: heweifeng
 * @LastEditTime: 2025-07-15 10:32:07
 * @Description: 
 */
import ExpoNativeAlipay from 'expo-native-alipay';
import { useState } from 'react';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { EventEmitter } from 'expo-modules-core';
export default function App() {
  const [version, setVersion] = useState('');
  ExpoNativeAlipay.getVersion().then(setVersion);

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
          <Text>Alipay SDK Version: {version}</Text>
    </SafeAreaView>
  );
}


const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  view: {
    flex: 1,
    height: 200,
  },
};
