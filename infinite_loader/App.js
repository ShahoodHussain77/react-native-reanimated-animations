import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const {width} = Dimensions.get('screen');

const LOADER_WIDTH = 100;

const App = () => {
  const loaderOffset = useSharedValue(-LOADER_WIDTH);
  const loaderWidth = useSharedValue(LOADER_WIDTH);

  useEffect(() => {
    loaderOffset.value = withRepeat(
      withTiming(width + LOADER_WIDTH, {
        duration: 1000,
        easing: Easing.linear,
      }),
      Infinity,
      false,
    );

    loaderWidth.value = withRepeat(
      withSequence(
        withTiming(LOADER_WIDTH * 2, {duration: 400}),
        withTiming(LOADER_WIDTH * 0.7, {duration: 600}),
      ),
      Infinity,
      false,
    );
  }, []);

  const loaderAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: loaderOffset.value,
        },
      ],
      width: loaderWidth.value,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <Animated.View style={[styles.loadingBar, loaderAnimatedStyles]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#feeee1',
  },
  loadingContainer: {
    height: 5,
    width: width,
    backgroundColor: '#fff',
  },
  loadingBar: {
    flex: 1,
    width: LOADER_WIDTH,
    borderRadius: 20,
    backgroundColor: 'red',
  },
});

export default App;
