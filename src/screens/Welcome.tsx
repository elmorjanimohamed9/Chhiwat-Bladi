import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, SafeAreaView, Animated } from 'react-native';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
const Welcome = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const foodPhrases: FoodPhrase[] = [
    {
      phrase: 'Discover authentic Moroccan recipes with step-by-step instructions and cooking tips.',
      title: 'Recipe Collection',
      subtitle: 'Moroccan Cuisine',
    },
    {
      phrase: 'Savour the rich spices and flavors of authentic Moroccan tagines delivered to your door.',
      title: 'Authentic Tagine',
      subtitle: 'Moroccan Flavor',
    },
    {
      phrase: 'Experience the magic of couscous, Morocco\'s beloved dish prepared with care and tradition',
      title: 'Royal Couscous',
      subtitle: 'Family Recipe',
    },
  ];

  const fadeTransition = React.useCallback((nextSlide: React.SetStateAction<number>) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentSlide(nextSlide);
      slideAnim.setValue(30);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      fadeTransition((currentSlide + 1) % foodPhrases.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide, fadeTransition, foodPhrases.length]);

  interface FoodPhrase {
    phrase: string;
    title: string;
    subtitle: string;
  }

  const handleDotPress = (index: number): void => {
    if (index !== currentSlide) {
      fadeTransition(index);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-amber-500">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View className="flex-1">
        <View className="w-full h-3/5 mt-[2.4rem] items-center justify-center overflow-hidden">
          <Image
            source={require('../assets/images/welcome.png')}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>

        <View className="absolute bottom-0 left-0 right-0 px-8 pb-10 pt-8 bg-white rounded-t-[32px] items-center">
          <View className="w-12 h-1 bg-gray-200 rounded-full mb-6" />

          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }]}}
            className="w-full mb-4"
          >
            <Text className="text-gray-700 text-3xl font-bold text-center mb-2">
              {foodPhrases[currentSlide].title}
            </Text>
            <Text className="text-xl font-semibold text-amber-500 mb-4 text-center">
              {foodPhrases[currentSlide].subtitle}
            </Text>

            <Text className="text-gray-500 text-center mb-8 text-sm leading-5">
              {foodPhrases[currentSlide].phrase}
            </Text>
          </Animated.View>

          <View className="flex-row justify-center items-center gap-2.5 mb-8">
            {foodPhrases.map((phrase, index) => (
              <TouchableOpacity
              key={`slide-dot-${phrase.title}`}
                onPress={() => handleDotPress(index)}
                className={`rounded-full h-2 ${currentSlide === index ? 'w-8 bg-amber-500' : 'w-2 bg-gray-300'}`}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('HomeScreen')}
            className="w-full rounded-2xl overflow-hidden"
            activeOpacity={0.8}
          >
            <View className="bg-amber-400 w-full py-4 items-center">
              <Text className="text-white font-bold text-lg">Get Started</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;