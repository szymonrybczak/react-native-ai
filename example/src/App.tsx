import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { doGenerate } from 'react-native-ai';

export default function App() {
  const askQuestion = async () => {
    try {
      const data = await doGenerate('ai', 'whats react native');
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={askQuestion}>
        <Text>Ask a question</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'darkblue',
  },
  button: { width: 200, height: 200, backgroundColor: 'red' },
});
