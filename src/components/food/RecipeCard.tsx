import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Recipe } from '../../types';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;
const FAVORITES_STORAGE_KEY = 'CHHIWAT_BLADI_FAVORITES';

interface RecipeCardProps {
  item: Recipe;
  index: number;
  onPress: (id: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = React.memo(({ item, index, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (favoritesJson) {
          const favorites = JSON.parse(favoritesJson);
          const isAlreadyFavorite = favorites.some(
            (favorite: Recipe) => favorite.idMeal === item.idMeal
          );
          setIsFavorite(isAlreadyFavorite);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [item.idMeal]);

  // Setup animation on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  const toggleFavorite = useCallback(
    async (event: GestureResponderEvent) => {
      event.stopPropagation();

      // Heart beat animation
      Animated.sequence([
        Animated.timing(heartAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(heartAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Toggle state
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);

      try {
        // Get current favorites from AsyncStorage
        const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        let favorites: Recipe[] = favoritesJson ? JSON.parse(favoritesJson) : [];

        if (newFavoriteStatus) {
          const isAlreadyFavorite = favorites.some(
            (favorite: Recipe) => favorite.idMeal === item.idMeal
          );

          if (!isAlreadyFavorite) {
            const recipeWithDate = {
              ...item,
              dateAdded: new Date().toISOString(),
            };
            favorites.push(recipeWithDate);
          }
        } else {
          favorites = favorites.filter((favorite: Recipe) => favorite.idMeal !== item.idMeal);
        }

        // Save updated favorites back to AsyncStorage
        await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error updating favorites:', error);
        setIsFavorite(!newFavoriteStatus);
      }
    },
    [isFavorite, item, heartAnim]
  );

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
        width: ITEM_WIDTH,
      }}
      className="rounded-xl bg-white overflow-hidden mb-4">
      <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(item.idMeal)} className="flex-1">
        {/* Recipe Image with Favorite Button */}
        <View className="relative">
          <Image
            source={{ uri: item.strMealThumb }}
            className="w-full h-36 rounded-t-xl"
            resizeMode="cover"
          />

          {/* Favorite Button */}
          <TouchableOpacity
            onPress={toggleFavorite}
            activeOpacity={0.8}
            className={`absolute top-2 left-2 w-8 h-8 rounded-full items-center justify-center ${
              isFavorite ? 'bg-white/90' : 'bg-black/40'
            }`}
            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
            <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
              {isFavorite ? (
                <FontAwesome name="heart" size={14} color="#EF4444" />
              ) : (
                <FontAwesome name="heart-o" size={14} color="#FFFFFF" />
              )}
            </Animated.View>
          </TouchableOpacity>

          {/* Category Badge */}
          {item.strCategory && (
            <View className="absolute top-2 right-2 bg-amber-500/90 px-2 py-0.5 rounded-md">
              <Text className="text-xs font-medium text-white">{item.strCategory}</Text>
            </View>
          )}
        </View>

        {/* Card Content */}
        <View className="p-3">
          {/* Title */}
          <Text numberOfLines={2} className="text-sm font-bold text-gray-800 mb-1">
            {item.strMeal}
          </Text>

          {/* Footer */}
          <View className="flex-row justify-between items-center mt-1">
            {/* Origin */}
            {item.strArea && (
              <View className="flex-row items-center">
                <Icon name="map-pin" size={10} color="#9CA3AF" />
                <Text className="text-xs text-gray-500 ml-1">{item.strArea}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default RecipeCard;
