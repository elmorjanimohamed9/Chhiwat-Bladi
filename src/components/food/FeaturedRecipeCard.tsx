import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

interface FeaturedRecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

const FeaturedRecipeCard = ({ recipe, onPress }: FeaturedRecipeCardProps) => {
  return (
    <View className="px-4 mb-6">
      <Text className="text-xl font-bold text-gray-800 mb-3">Featured Recipe</Text>
      <TouchableOpacity
        onPress={onPress}
        className="rounded-2xl overflow-hidden bg-white shadow-sm"
        activeOpacity={0.9}>
        <Image source={{ uri: recipe.strMealThumb }} className="w-full h-48" resizeMode="cover" />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
          }}>
          <View className="bg-amber-500 self-start px-2 py-1 rounded-full mb-1">
            <Text className="text-white text-xs font-medium">
              {recipe.strCategory || 'Featured'}
            </Text>
          </View>

          <Text className="text-white font-bold text-lg">{recipe.strMeal}</Text>

          {recipe.strArea && <Text className="text-white/80">{recipe.strArea} cuisine</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default FeaturedRecipeCard;
