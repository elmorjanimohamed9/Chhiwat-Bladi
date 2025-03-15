import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

interface BottomNavigationProps {
  navigation: NavigationProp<RootStackParamList>;
  currentRoute: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ navigation, currentRoute }) => {
  return (
    <View className="bg-white flex-row justify-around items-center py-3 shadow-lg border-t border-gray-100">
      <TouchableOpacity className="items-center" onPress={() => navigation.navigate('HomeScreen')}>
        <Icon
          name="home"
          size={22}
          color={currentRoute === 'HomeScreen' ? '#F59E0B' : '#9CA3AF'}
          className="mb-1"
        />
        <Text
          className={`text-xs ${
            currentRoute === 'HomeScreen' ? 'text-amber-500 font-medium' : 'text-gray-400'
          }`}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center"
        onPress={() => navigation.navigate('AllRecipesScreen')}>
        <Icon
          name="search"
          size={22}
          color={currentRoute === 'AllRecipesScreen' ? '#F59E0B' : '#9CA3AF'}
          className="mb-1"
        />
        <Text
          className={`text-xs ${
            currentRoute === 'AllRecipesScreen' ? 'text-amber-500 font-medium' : 'text-gray-400'
          }`}>
          Recipes
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center"
        onPress={() => navigation.navigate('SavedRecipesScreen')}>
        <Icon
          name="heart"
          size={22}
          color={currentRoute === 'SavedRecipesScreen' ? '#F59E0B' : '#9CA3AF'}
          className="mb-1"
        />
        <Text
          className={`text-xs ${
            currentRoute === 'SavedRecipesScreen' ? 'text-amber-500 font-medium' : 'text-gray-400'
          }`}>
          Favorites
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;
