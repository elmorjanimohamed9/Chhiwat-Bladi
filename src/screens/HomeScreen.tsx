import React, { useState } from 'react';
import { SafeAreaView, StatusBar, ScrollView, RefreshControl, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Components
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import CategoryList from '../components/food/CategoryList';
import AreaList from '../components/food/AreaList';
import FeaturedRecipeCard from '../components/food/FeaturedRecipeCard';
import RecipeGrid from '../components/food/RecipeGrid';
import BottomNavigation from '../components/common/BottomNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Custom Hooks
import { useFetchCategories } from '../hooks/useFetchCategories';
import { useFetchAreas } from '../hooks/useFetchAreas';
import { useFetchRecipes } from '../hooks/useFetchRecipes';
import { useFetchFeaturedRecipe } from '../hooks/useFetchFeaturedRecipe';

import { RootStackParamList } from '../types';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fetch data using custom hooks
  const { categories } = useFetchCategories();
  const { areas } = useFetchAreas();
  const { featuredRecipe } = useFetchFeaturedRecipe();
  const { recipes, loading, error, loadRecipes, searchRecipes } = useFetchRecipes(
    selectedCategory,
    selectedArea
  );

  // Event handlers
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    loadRecipes(category, selectedArea);
  };

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    loadRecipes(selectedCategory, area);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      searchRecipes(text);
    } else if (text.length === 0) {
      loadRecipes(selectedCategory, selectedArea);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadRecipes(selectedCategory, selectedArea);
  };

  const handleRecipePress = (mealId: string) => {
    navigation.navigate('RecipeDetailScreen', { id: mealId });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRecipes(selectedCategory, selectedArea);
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <StatusBar backgroundColor="#f59e0b" barStyle="dark-content" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#f59e0b']} />
        }>
        <View className="p-4 pb-2 mt-5 bg-amber-50">
          <Header
            title="Chhiwat Bladi"
            subtitle="Discover Moroccan cuisine"
          />

          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search Moroccan recipes"
          />
        </View>

        <CategoryList
          title="Categories"
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          onViewAll={() => {
            /* Implement view all categories */
          }}
        />

        <AreaList
          title="Cuisines"
          areas={areas}
          selectedArea={selectedArea}
          onSelectArea={handleAreaSelect}
          onViewAll={() => {
            /* Implement view all areas */
          }}
        />

        {featuredRecipe && (
          <FeaturedRecipeCard
            recipe={featuredRecipe}
            onPress={() => handleRecipePress(featuredRecipe.idMeal)}
          />
        )}

        <RecipeGrid
          title={getRecipeListTitle(searchQuery, selectedCategory, selectedArea)}
          recipes={recipes}
          loading={loading}
          error={error}
          onRetry={() => loadRecipes(selectedCategory, selectedArea)}
          onRecipePress={handleRecipePress}
          onViewAll={() =>
            navigation.navigate('AllRecipesScreen', {
              category: selectedCategory,
              area: selectedArea,
            })
          }
        />
      </ScrollView>

      <BottomNavigation navigation={navigation} currentRoute={route.name} />
    </SafeAreaView>
  );
};

// Helper function for recipe list title
const getRecipeListTitle = (searchQuery: string, category: string, area: string): string => {
  if (searchQuery) return 'Search Results';
  if (area !== 'All' && category !== 'All') return `${category} • ${area}`;
  if (area !== 'All') return `${area} Cuisine`;
  return `${category} Recipes`;
};

export default HomeScreen;
