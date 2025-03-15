import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Linking,
  Share,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

interface Ingredient {
  name: string;
  measure: string;
}

interface RecipeDetail {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  strTags: string;
  ingredients: Ingredient[];
}

const RecipeDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };

  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch recipe details');
      }

      const data = await response.json();

      if (!data.meals || data.meals.length === 0) {
        throw new Error('Recipe not found');
      }

      const mealData = data.meals[0];

      // Extract ingredients and measurements
      const ingredients: Ingredient[] = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = mealData[`strIngredient${i}`];
        const measure = mealData[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== '') {
          ingredients.push({
            name: ingredient,
            measure: measure || '',
          });
        }
      }

      setRecipe({
        ...mealData,
        ingredients,
      });
    } catch (err) {
      console.error('Error fetching recipe details:', err);
      setError('Failed to load recipe details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = () => {
    // Toggle saved state (in a real app, this would save to storage/database)
    setIsSaved(!isSaved);
    // TODO: Implement actual save functionality
  };

  const handleShareRecipe = async () => {
    if (!recipe) return;

    try {
      await Share.share({
        message: `Check out this amazing recipe for ${recipe.strMeal}! ${recipe.strYoutube || ''}`,
        title: recipe.strMeal,
      });
    } catch (err) {
      console.error('Error sharing recipe:', err);
    }
  };

  const handleWatchVideo = () => {
    if (recipe?.strYoutube) {
      Linking.openURL(recipe.strYoutube);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-amber-50 items-center justify-center">
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text className="text-gray-500 mt-4">Loading recipe...</Text>
      </SafeAreaView>
    );
  }

  if (error || !recipe) {
    return (
      <SafeAreaView className="flex-1 bg-amber-50 items-center justify-center px-4">
        <Icon name="alert-triangle" size={48} color="#EF4444" />
        <Text className="text-gray-800 text-lg font-medium mt-4 mb-2">Something went wrong</Text>
        <Text className="text-gray-500 text-center mb-6">{error}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-amber-500 px-6 py-3 rounded-full">
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Recipe Image with Gradient Overlay */}
        <View className="w-full h-72 relative">
          <Image
            source={{ uri: recipe.strMealThumb }}
            className="w-full h-full"
            resizeMode="cover"
          />

          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent']}
            style={styles.topGradient}>
            <View className="flex-row justify-between items-center w-full px-4 pt-10">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="p-2 bg-white/20 rounded-full">
                <Icon name="arrow-left" size={22} color="#FFF" />
              </TouchableOpacity>

              <View className="flex-row">
                <TouchableOpacity
                  onPress={handleSaveRecipe}
                  className="p-2 bg-white/20 rounded-full mr-3">
                  <Icon
                    name={isSaved ? 'heart' : 'heart'}
                    size={22}
                    color={isSaved ? '#EF4444' : '#FFF'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShareRecipe}
                  className="p-2 bg-white/20 rounded-full">
                  <Icon name="share-2" size={22} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.bottomGradient}>
            <View className="px-4 pb-4">
              <View className="flex-row space-x-2 mb-2">
                <View className="bg-amber-500 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-medium">{recipe.strCategory}</Text>
                </View>
                <View className="bg-white/20 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-medium">{recipe.strArea}</Text>
                </View>
                {recipe.strTags && (
                  <View className="bg-white/20 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs font-medium">
                      {recipe.strTags.split(',')[0]}
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-white text-2xl font-bold">{recipe.strMeal}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Content Container */}
        <View className="px-4 py-6">
          {/* Ingredients Section */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">Ingredients</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} className="flex-row items-center mb-3">
                <View className="w-2 h-2 rounded-full bg-amber-500 mr-3" />
                <Text className="text-gray-700 font-medium flex-1">{ingredient.name}</Text>
                <Text className="text-gray-500">{ingredient.measure}</Text>
              </View>
            ))}
          </View>

          {/* Instructions Section */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">Instructions</Text>
            {recipe.strInstructions
              .split('.')
              .filter(Boolean)
              .map((instruction, index) => (
                <View key={index} className="flex-row mb-4">
                  <Text className="text-amber-500 font-bold mr-3">{index + 1}.</Text>
                  <Text className="text-gray-700 flex-1">{`${instruction.trim()}.`}</Text>
                </View>
              ))}
          </View>

          {/* Watch Video Button - if available */}
          {recipe.strYoutube && (
            <TouchableOpacity
              onPress={handleWatchVideo}
              className="bg-red-600 flex-row items-center justify-center py-3 rounded-xl mb-6">
              <Icon name="youtube" size={24} color="#FFF" className="mr-2" />
              <Text className="text-white font-bold text-base ml-2">Watch Video</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View className="bg-white px-4 py-3 border-t border-gray-100">
        <TouchableOpacity
          onPress={handleSaveRecipe}
          className={`w-full py-3 rounded-xl flex-row justify-center items-center ${
            isSaved ? 'bg-gray-100' : 'bg-amber-500'
          }`}>
          <Icon
            name={isSaved ? 'check' : 'bookmark'}
            size={20}
            color={isSaved ? '#4B5563' : '#FFF'}
          />
          <Text className={`font-bold text-base ml-2 ${isSaved ? 'text-gray-700' : 'text-white'}`}>
            {isSaved ? 'Saved to Cookbook' : 'Save to Cookbook'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
  },
});

export default RecipeDetailScreen;
