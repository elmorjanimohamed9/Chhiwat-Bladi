import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import ErrorDisplay from '../common/ErrorDisplay';
import LoadingIndicator from '../common/LoadingIndicator';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strArea?: string;
  strCategory?: string;
}

interface RecipeGridProps {
  title: string;
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onRecipePress: (id: string) => void;
  onViewAll?: () => void;
}

const RecipeGrid = ({
  title,
  recipes,
  loading,
  error,
  onRetry,
  onRecipePress,
  onViewAll,
}: RecipeGridProps) => {
  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      onPress={() => onRecipePress(item.idMeal)}
      className="mb-4 w-[48%] rounded-xl overflow-hidden bg-white shadow-sm"
      activeOpacity={0.7}>
      <Image
        source={{ uri: item.strMealThumb }}
        className="w-full h-32 rounded-t-xl"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="font-bold text-gray-800" numberOfLines={1}>
          {item.strMeal}
        </Text>
        <View className="flex-row justify-between items-center mt-1">
          {item.strArea && <Text className="text-gray-500 text-xs">{item.strArea}</Text>}
          {item.strCategory && (
            <Text className="text-amber-500 text-xs font-medium">{item.strCategory}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="px-4 mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-xl font-bold text-gray-800">{title}</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text className="text-amber-500 font-medium">View all</Text>
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <ErrorDisplay message={error} onRetry={onRetry} />
      ) : loading ? (
        <LoadingIndicator />
      ) : recipes && recipes.length > 0 ? (
        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={item => item.idMeal}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          scrollEnabled={false}
        />
      ) : (
        <View className="items-center justify-center py-8">
          <Text className="text-gray-500">No recipes found</Text>
        </View>
      )}
    </View>
  );
};

export default RecipeGrid;
