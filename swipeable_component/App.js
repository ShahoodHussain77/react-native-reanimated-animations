import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  LinearTransition,
  SlideOutLeft,
} from 'react-native-reanimated';

function RightAction(props) {
  return (
    <TouchableOpacity onPress={props?._handleDeleteItem} style={styles.options}>
      <Text style={styles.rightAction}>delete</Text>
    </TouchableOpacity>
  );
}

const App = () => {
  const itemRef = useRef({});

  const [data, setData] = useState([]);

  useEffect(() => {
    setData(dummyData);
  }, []);

  const deleteItem = id => {
    setData(data => data.filter(item => item.id !== id));
  };

  const _renderItem = ({item}) => {
    return (
      <Animated.View exiting={SlideOutLeft}>
        <Swipeable
          key={item.id}
          friction={2}
          overshootFriction={8}
          renderRightActions={() => (
            <RightAction _handleDeleteItem={() => deleteItem(item.id)} />
          )}
          ref={ref => (itemRef.current[item.id] = ref)}
          onSwipeableOpenStartDrag={async () => {
            const keys = Object.keys(itemRef.current);
            keys.map(async key => {
              if (key !== item.id) {
                await itemRef.current[key]?.close();
              }
            });
          }}>
          <View style={styles.item}>
            {item.imageUrl && (
              <Image source={{uri: item.imageUrl}} style={styles.image} />
            )}

            <View style={styles.itemDetails}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.description}>Price: ${item.price}</Text>
              <Text style={styles.description}>Category: {item.category}</Text>
            </View>
          </View>
        </Swipeable>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <GestureHandlerRootView>
        <Animated.FlatList
          data={data}
          renderItem={_renderItem}
          contentInsetAdjustmentBehavior="automatic"
          style={{flex: 1}}
          itemLayoutAnimation={LinearTransition}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee1ee',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#888',
  },
  itemDetails: {
    marginHorizontal: 16,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 8,
    borderRadius: 8,
  },
  rightAction: {
    fontSize: 18,
    color: 'white',
  },
  options: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee1ee',
    paddingHorizontal: 20,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const dummyData = Array.from({length: 50}, (_, i) => ({
  // Creates 50 dummy items
  id: String(i + 1), // Generate unique IDs
  name: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
  price: (i + 1) * 10, // Example: Price increases with item number
  category: ['Electronics', 'Clothing', 'Books', 'Home', 'Food'][i % 5], // Cycle through categories
  imageUrl: `https://picsum.photos/200/300?random=${i}`, // Example: Random image URLs (replace with your image URLs)
  // Add more properties as needed
}));

export default App;
