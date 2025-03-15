import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <View className="flex-row justify-between items-center mb-4">
      <View>
        <Text className="text-gray-800 text-2xl font-bold">{title}</Text>
        <Text className="text-gray-500">{subtitle}</Text>
      </View>
      <TouchableOpacity className="p-2 bg-transparent">
        <Image
          source={require('../../assets/images/logo.png')}
          className="w-16 h-16 rounded-full"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
