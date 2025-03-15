import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import SearchBar from '../components/common/SearchBar';
import BottomNavigation from '../components/common/BottomNavigation';

// Constants
const FAVORITES_STORAGE_KEY = 'CHHIWAT_BLADI_FAVORITES';

// Types
interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  dateAdded: string;
}

const SavedRecipesScreen = () => {
  const navigation = useNavigation();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('All');

  // Animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const loadingRotate = React.useRef(new Animated.Value(0)).current;

  // Start loading animation
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(loadingRotate, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      loadingRotate.setValue(0);
    }
  }, [loading]);

  // Filter types with icons
  const filterTypes = [
    { key: 'All', icon: 'grid' },
    { key: 'Recent', icon: 'clock' },
    { key: 'Alphabetical', icon: 'list' },
  ];

  // Load saved recipes from AsyncStorage
  const loadSavedRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (favoritesJson) {
        const favorites = JSON.parse(favoritesJson);
        setSavedRecipes(favorites);
        applyFilterToData(favorites, filterType);

        // Staggered fade-in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } else {
        setSavedRecipes([]);
        setFilteredRecipes([]);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load your saved recipes');
    } finally {
      setTimeout(() => setLoading(false), 400); 
    }
  }, [filterType, fadeAnim]);

  const applyFilterToData = useCallback(
    (data: Recipe[], type: string) => {
      let sorted = [...data];

      switch (type) {
        case 'Recent':
          sorted = sorted.sort(
            (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
          break;
        case 'Alphabetical':
          sorted = sorted.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
          break;
        default:
          sorted = sorted.sort(
            (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
      }

      if (searchQuery.trim() !== '') {
        sorted = sorted.filter(recipe =>
          recipe.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredRecipes(sorted);
    },
    [searchQuery]
  );

  useEffect(() => {
    loadSavedRecipes();
  }, [loadSavedRecipes]);

  useFocusEffect(
    useCallback(() => {
      loadSavedRecipes();
    }, [loadSavedRecipes])
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    applyFilterToData(savedRecipes, filterType);
  };

  const applyFilter = (type: string) => {
    // Animate filter change
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setFilterType(type);
    applyFilterToData(savedRecipes, type);
  };

  const handleRemoveRecipe = (id: string) => {
    Alert.alert(
      'Remove Recipe',
      'Are you sure you want to remove this recipe from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedRecipes = savedRecipes.filter(recipe => recipe.idMeal !== id);
              setSavedRecipes(updatedRecipes);
              setFilteredRecipes(filteredRecipes.filter(recipe => recipe.idMeal !== id));
              await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedRecipes));
            } catch (err) {
              Alert.alert('Error', 'Failed to remove recipe');
              loadSavedRecipes();
            }
          },
        },
      ]
    );
  };

  // Dynamic recipe card styling with staggered animation
  const getRecipeCardStyle = index => {
    return {
      opacity: fadeAnim,
      transform: [
        {
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
      ],
    };
  };

  // Format date to be more readable (e.g., "2 days ago", "May 15", etc)
  const formatDate = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Create rotation interpolation for loading spinner
  const spin = loadingRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-8">
      <View className="w-20 h-20 rounded-full bg-amber-500 justify-center items-center mb-4">
        <Icon name="bookmark" size={40} color="#FEF3C7" />
      </View>
      <Text className="text-2xl font-bold text-gray-800 mb-3">No saved recipes</Text>
      <Text className="text-base text-gray-500 text-center mb-6 leading-5">
        {searchQuery
          ? "We couldn't find any recipes matching your search"
          : "You haven't saved any recipes yet. Explore recipes and tap the heart icon to save your favorites."}
      </Text>
      <TouchableOpacity
        className="flex-row items-center bg-amber-500 py-3.5 px-6 rounded-full"
        onPress={() => {
          if (searchQuery) {
            setSearchQuery('');
            applyFilterToData(savedRecipes, filterType);
          } else {
            navigation.navigate('HomeScreen');
          }
        }}>
        <Text className="text-white font-semibold text-base">
          {searchQuery ? 'Clear Search' : 'Explore Recipes'}
        </Text>
        <Icon
          name={searchQuery ? 'x-circle' : 'arrow-right'}
          size={16}
          color="#FFFFFF"
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>
    </View>
  );

  const renderFilterItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => applyFilter(item.key)}
      className={`flex-row items-center py-2 px-4 mr-2.5 rounded-full ${
        filterType === item.key ? 'bg-amber-500' : 'bg-gray-100'
      }`}>
      <Icon
        name={item.icon}
        size={14}
        color={filterType === item.key ? '#FFFFFF' : '#4B5563'}
        style={{ marginRight: 6 }}
      />
      <Text
        className={`font-medium text-sm ${
          filterType === item.key ? 'text-white' : 'text-gray-600'
        }`}>
        {item.key}
      </Text>
    </TouchableOpacity>
  );

  const renderRecipeItem = ({ item, index }) => (
    <Animated.View style={getRecipeCardStyle(index)} className="mb-4">
      <TouchableOpacity
        onPress={() => navigation.navigate('RecipeDetailScreen', { id: item.idMeal })}
        activeOpacity={0.8}
        className="flex-row bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <Image source={{ uri: item.strMealThumb }} className="w-24 h-24" />

        <View className="flex-1 justify-between p-3">
          <View>
            <Text className="text-base font-semibold text-gray-800" numberOfLines={1}>
              {item.strMeal}
            </Text>
            <View className="flex-row items-center flex-wrap">
              {item.strCategory && (
                <View className="bg-amber-100 px-2 py-0.5 rounded-full mr-2 mt-1">
                  <Text className="text-amber-800 text-xs font-medium">{item.strCategory}</Text>
                </View>
              )}
              {item.strArea && (
                <View className="flex-row items-center bg-gray-100 px-2 py-0.5 rounded-full mt-1">
                  <Icon name="map-pin" size={10} color="#6B7280" />
                  <Text className="text-gray-600 text-xs ml-1">{item.strArea}</Text>
                </View>
              )}
            </View>
          </View>

          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-gray-400 text-xs">{`Saved ${formatDate(item.dateAdded)}`}</Text>
            <TouchableOpacity
              onPress={() => handleRemoveRecipe(item.idMeal)}
              className="p-1.5"
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Icon name="trash-2" size={16} color="#F87171" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-amber-50 mt-5">
      <StatusBar backgroundColor="#f59e0b" barStyle="dark-content" />

      {/* Header */}
      <View className="px-5 pt-4 pb-2.5">
        <View className="flex-row items-center mb-0.5">
          <Text className="text-2xl font-bold text-gray-800">My Cookbook</Text>
          <View className="bg-amber-500 rounded-full px-2 py-0.5 ml-2.5">
            <Text className="text-white font-bold text-xs">{savedRecipes.length}</Text>
          </View>
        </View>
        <Text className="text-gray-500 text-sm mb-4">Your saved recipes collection</Text>

        {/* Search bar */}
        <View className="mb-2">
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            onClear={() => {
              setSearchQuery('');
              applyFilterToData(savedRecipes, filterType);
            }}
            placeholder="Search your recipes..."
          />
        </View>
      </View>

      {/* Filter chips */}
      <View className="border-b border-gray-100 pb-2.5">
        <FlatList
          data={filterTypes}
          renderItem={renderFilterItem}
          keyExtractor={item => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Icon name="loader" size={32} color="#F59E0B" />
          </Animated.View>
          <Text className="mt-3 text-gray-500">Loading your recipes...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-6">
          <Icon name="alert-circle" size={40} color="#EF4444" />
          <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">{error}</Text>
          <Text className="text-gray-500 text-center mb-6">
            We couldn't load your recipes at this time.
          </Text>
          <TouchableOpacity
            className="bg-amber-500 py-3 px-6 rounded-full"
            onPress={loadSavedRecipes}>
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          {filteredRecipes.length > 0 ? (
            <FlatList
              data={filteredRecipes}
              renderItem={renderRecipeItem}
              keyExtractor={item => item.idMeal}
              contentContainerStyle={{ padding: 20 }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyState()
          )}
        </Animated.View>
      )}

      <BottomNavigation navigation={navigation} currentRoute="SavedRecipesScreen" />
    </SafeAreaView>
  );
};

export default SavedRecipesScreen;
