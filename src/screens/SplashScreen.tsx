import React, {useEffect, useRef} from 'react';
import {View, Image, StatusBar, Animated} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      {iterations: 2},
    ).start();

    const timer = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Welcome'}],
        })
      );
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, pulseAnim, scaleAnim]);

  const highlightStyle = {
    transform: [{scale: pulseAnim}],
  };

  const logoAnimStyle = {
    opacity: fadeAnim,
    transform: [{scale: Animated.multiply(scaleAnim, pulseAnim)}],
  };

  return (
    <View className="flex-1 items-center justify-center bg-amber-400">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Animated.View
        className="absolute w-72 h-72 rounded-full bg-white/15"
        style={highlightStyle}
      />

      <Animated.View
        className="absolute w-60 h-60 rounded-full bg-white/20"
        style={highlightStyle}
      />

      <Animated.View
        style={logoAnimStyle}
        className="items-center justify-center">
        <Image
          source={require('../assets/images/logo.png')}
          className="w-52 h-52"
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
