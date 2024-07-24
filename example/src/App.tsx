import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { GiftedChat, type IMessage } from 'react-native-gifted-chat';
import { getModel } from 'react-native-ai';
import { generateText } from 'ai';
import { v4 as uuid } from 'uuid';

const modelId = 'Phi-3-mini-4k-instruct-q4f16_1-MLC';

const aiBot = {
  _id: 2,
  name: 'AI Chat Bot',
  avatar: require('./../assets/avatar.png'),
};

export default function Example() {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      _id: uuid(),
      text: 'Hello! How can I help you today?',
      createdAt: new Date(),
      user: aiBot,
    },
  ]);

  const onSendMessage = async (prompt: string) => {
    const { text } = await generateText({
      model: getModel(modelId),
      prompt,
    });

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, {
        // @ts-ignore
        _id: uuid(),
        text,
        createdAt: new Date(),
        user: aiBot,
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(newMessage) => {
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, newMessage)
          );

          onSendMessage(newMessage[0]!.text);
        }}
        user={{
          _id: 1,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
