import React from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native';
import Animated, {
  createAnimatedPropAdapter,
  interpolateColor,
  processColor,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Circle} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(TextInput);

const RADIUS = 45;
const ANIMATION_DURATION = 3000;
const CIRCLE_CIRCUMFERENCE = RADIUS * Math.PI * 2;
const CIRCLE_INTERPOLATION_RANGE = [25, 50, 90];
const COLORS = ['#D95D5D', '#D9A25E', '#4EBA7D'];
const STROKE = 'stroke';

const adapter = createAnimatedPropAdapter(
  props => {
    if (Object.keys(props).includes(STROKE)) {
      props.stroke = {
        type: 0,
        payload: processColor(props?.[STROKE]),
      };
      // delete props.stroke;
    }
  },
  [STROKE],
);

const App = ({value}) => {
  const strokeOffset = useSharedValue(0);

  const textAnimation = useDerivedValue(() => {
    return withTiming(strokeOffset.value, {duration: 3000});
  });

  const animatedTextProps = useAnimatedProps(() => {
    return {
      text: `${Math.round(textAnimation.value)}%`,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        textAnimation.value,
        CIRCLE_INTERPOLATION_RANGE,
        COLORS,
      ),
    };
  });

  const percentage = useDerivedValue(() => {
    const number = (strokeOffset.value / 100) * CIRCLE_CIRCUMFERENCE;
    return withTiming(number, {duration: ANIMATION_DURATION});
  });

  const strokeColor = useDerivedValue(() => {
    const number = (percentage.value * 100) / CIRCLE_CIRCUMFERENCE;
    return interpolateColor(number, CIRCLE_INTERPOLATION_RANGE, COLORS);
  });

  const animatedCircleProps = useAnimatedProps(
    () => {
      return {
        strokeDasharray: [
          percentage.value,
          CIRCLE_CIRCUMFERENCE - percentage.value,
        ],
        stroke: strokeColor.value,
      };
    },
    [],
    adapter,
  );

  React.useEffect(() => {
    strokeOffset.value = value;
  }, [value]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <AnimatedText
          style={[styles.text, textStyle]}
          animatedProps={animatedTextProps}
        />

        <Svg width={100} height={100} viewBox="0 0 100 100">
          <Circle {...styles.circlePlaceholder} />

          <AnimatedCircle
            {...styles.animatedCircleStyle}
            animatedProps={animatedCircleProps}
          />
        </Svg>
      </View>

      <View style={{height: 50}} />

      <Button
        title="Percentage"
        onPress={() => {
          const value = Math.random() * 100;
          strokeOffset.value = value;
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
  circlePlaceholder: {
    cx: 50,
    cy: 50,
    r: '45',
    stroke: '#e1e1e1',
    fill: 'transparent',
  },
  animatedCircleStyle: {
    cx: 50,
    cy: 50,
    r: '45',
    strokeWidth: '10',
    stroke: 'royalblue',
    fill: 'none',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    position: 'absolute',
  },
});

const ParentComponent = () => {
  return <App value={Math.random() * 100} />;
};

export default ParentComponent;
