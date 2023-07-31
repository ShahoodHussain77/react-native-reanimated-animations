import React from 'react';
import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import Animated, {
  useSharedValue,
  useDerivedValue,
  withTiming,
  useAnimatedProps,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(TextInput);

const App = () => {
  const animatedTextValue = useSharedValue(1);

  const animatedValue = useDerivedValue(() => {
    return withTiming(animatedTextValue.value, {duration: 3000});
  });

  const animatedText = useAnimatedProps(() => {
    return {
      text: `${Math.round(animatedValue.value)}`,
    };
  });

  return (
    <View style={styles.container}>
      <AnimatedText
        style={styles.text}
        animatedProps={animatedText}
        editable={false}
      />

      <View style={{height: 50}} />

      <Button
        title="Start Animation"
        onPress={() => {
          animatedTextValue.value = Math.random() * 100;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#111',
    fontSize: 22,
    textAlign: 'center',
  },
});

export default App;
