import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Recipe } from '../types';
import BottomNavigation from '../components/common/BottomNavigation';
import SearchBar from '../components/common/SearchBar';
import Icon from 'react-native-vector-icons/Feather';
import { useFetchRecipes } from '../hooks/useFetchRecipes';
import RecipeCard from '../components/food/RecipeCard';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

// Separate component for filter chip
const FilterChip: React.FC<FilterChipProps> = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-3 py-2 mr-2 rounded-full ${active ? 'bg-amber-500' : 'bg-gray-200'}`}>
    <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-700'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

const AllRecipesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const { category = 'All', area = 'All' } = route.params || {};

  // Animation
  const scrollY = useRef(new Animated.Value(0)).current;

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(category);
  const [activeCuisine, setActiveCuisine] = useState(area);
  const [refreshing, setRefreshing] = useState(false);
  const [displayedRecipes, setDisplayedRecipes] = useState<Recipe[]>([]);

  const { recipes, loading, error, loadRecipes, searchRecipes } = useFetchRecipes(
    activeCategory,
    activeCuisine
  );

  const categories = [
    'All',
    'Beef',
    'Chicken',
    'Dessert',
    'Lamb',
    'Pasta',
    'Seafood',
    'Vegetarian',
  ];

  const cuisines = ['All', 'Moroccan', 'French', 'Italian', 'Chinese', 'American', 'Indian'];

  // Filter recipes based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setDisplayedRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe =>
        recipe.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayedRecipes(filtered);
    }
  }, [recipes, searchQuery]);

  // Load recipes when filter changes
  useEffect(() => {
    loadRecipes(activeCategory, activeCuisine);
  }, [activeCategory, activeCuisine, loadRecipes]);

  // Handle search
  const handleSearch = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (text.length > 2) {
        searchRecipes(text);
      }
    },
    [searchRecipes]
  );

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadRecipes(activeCategory, activeCuisine).finally(() => {
      setRefreshing(false);
    });
  }, [activeCategory, activeCuisine, loadRecipes]);

  // Handle recipe press
  const handleRecipePress = useCallback(
    (id: string) => {
      navigation.navigate('RecipeDetailScreen', { id });
    },
    [navigation]
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    setActiveCategory('All');
    setActiveCuisine('All');
    setSearchQuery('');
  }, []);

  // Show empty state
  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-6 -mt-16">
      {loading ? (
        <View className="items-center">
          <Icon name="loader" size={40} color="#F59E0B" className="mb-4 rotate-45" />
          <Text className="text-gray-500 text-base text-center">
            Discovering delicious recipes...
          </Text>
        </View>
      ) : error ? (
        <View className="items-center">
          <Icon name="alert-triangle" size={40} color="#EF4444" className="mb-3" />
          <Text className="text-gray-800 text-lg font-bold mb-2">Oops! Something went wrong</Text>
          <Text className="text-gray-500 text-base text-center mb-6">{error}</Text>
          <TouchableOpacity
            className="bg-amber-500 py-3 px-6 rounded-2xl"
            onPress={() => loadRecipes(activeCategory, activeCuisine)}>
            <Text className="text-white font-semibold text-base">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="items-center">
          <Icon name="search" size={40} color="#9CA3AF" className="mb-3" />
          <Text className="text-gray-800 text-lg font-bold mb-2">No Recipes Found</Text>
          <Text className="text-gray-500 text-base text-center mb-6">
            {searchQuery
              ? "We couldn't find any recipes matching your search"
              : 'Try changing your filters to discover more recipes'}
          </Text>
          <TouchableOpacity className="bg-amber-500 py-3 px-6 rounded-2xl" onPress={resetFilters}>
            <Text className="text-white font-semibold text-base">Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-amber-50 mt-5">
      <StatusBar backgroundColor="#f59e0b" barStyle="dark-content" />

      {/* Header */}
      <View className="bg-amber-50 pt-4 px-4 pb-2 border-b border-gray-100">
        <View className="flex-row items-center mb-2">
          <Text className="flex-1 text-2xl font-bold text-gray-800">Discover Recipes</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SavedRecipesScreen')}
            className="p-2 bg-amber-500 rounded-full">
            <Icon name="heart" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text className="text-sm text-gray-500 mb-3">
          Explore our collection of delicious Moroccan cuisine
        </Text>

        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          onClear={() => setSearchQuery('')}
          placeholder="Search for tajine, couscous..."
        />
      </View>

      {/* Filters */}
      <View className="px-4 pt-3">
        {/* Categories */}
        <Text className="text-sm font-medium text-gray-600 mb-1.5">Categories</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => `category-${item}`}
          className="mb-3"
          renderItem={({ item }) => (
            <FilterChip
              label={item}
              active={activeCategory === item}
              onPress={() => setActiveCategory(item)}
            />
          )}
        />

        {/* Cuisines */}
        <Text className="text-sm font-medium text-gray-600 mb-1.5">Cuisines</Text>
        <FlatList
          data={cuisines}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => `cuisine-${item}`}
          className="mb-3"
          renderItem={({ item }) => (
            <FilterChip
              label={item}
              active={activeCuisine === item}
              onPress={() => setActiveCuisine(item)}
            />
          )}
        />
      </View>

      {/* Results count */}
      {!loading && displayedRecipes.length > 0 && (
        <View className="flex-row justify-between items-center px-4 mt-1 mb-2">
          <Text className="text-base font-bold text-gray-700">
            {displayedRecipes.length} {displayedRecipes.length === 1 ? 'Recipe' : 'Recipes'}
          </Text>
          {(activeCategory !== 'All' || activeCuisine !== 'All' || searchQuery) && (
            <TouchableOpacity className="flex-row items-center" onPress={resetFilters}>
              <Text className="text-xs text-amber-500 mr-1">Reset Filters</Text>
              <Icon name="x" size={14} color="#F59E0B" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Recipe Grid */}
      {displayedRecipes.length > 0 ? (
        <Animated.FlatList
          data={displayedRecipes}
          keyExtractor={item => item.idMeal}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ padding: 16 }}
          initialNumToRender={6}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: true,
          })}
          renderItem={({ item, index }) => (
            <RecipeCard item={item} index={index} onPress={handleRecipePress} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#F59E0B']}
              tintColor="#F59E0B"
            />
          }
        />
      ) : (
        renderEmptyState()
      )}

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentRoute="AllRecipesScreen" />
    </SafeAreaView>
  );
};

export default AllRecipesScreen;
