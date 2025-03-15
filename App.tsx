import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import './global.css';
import SplashScreen from './src/screens/SplashScreen';
import Welcome from './src/screens/Welcome';
import HomeScreen from './src/screens/HomeScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import SavedRecipesScreen from './src/screens/SavedRecipesScreen';
import AllRecipesScreen from './src/screens/AllRecipesScreen';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown: false}}>
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="RecipeDetailScreen" component={RecipeDetailScreen} />
                <Stack.Screen name="SavedRecipesScreen" component={SavedRecipesScreen}/>
                <Stack.Screen name="AllRecipesScreen" component={AllRecipesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;