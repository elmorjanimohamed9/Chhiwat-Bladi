export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb?: string;
  strCategoryDescription?: string;
}

export type RootStackParamList = {
  SplashScreen: undefined;
  Welcome: undefined;
  HomeScreen: undefined;
  RecipeDetailScreen: { id: string };
  SavedRecipesScreen: undefined;
  AllRecipesScreen: { category?: string; area?: string };
};

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  dateAdded: string;
}
