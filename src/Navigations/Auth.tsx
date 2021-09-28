import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignIn from '../Screens/Auth/SignIn';
import SignUp from '../Screens/Auth/SignUp';
import ResetPassword from '../Screens/Auth/ResetPassword';
import CodeConfirmation from '../Screens/Auth/CodeConfirmation';
import NewPassword from '../Screens/Auth/NewPassword';
import UserType from '../Screens/Auth/UserType';

const Stack = createStackNavigator();

const AuthScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={{header: () => null}}
      initialRouteName={'SignIn'}>
      <Stack.Screen name={'SignIn'} component={SignIn} />
      <Stack.Screen name={'SignUp'} component={SignUp} />
      <Stack.Screen name={'UserType'} component={UserType} />
      <Stack.Screen name={'ResetPassword'} component={ResetPassword} />
      <Stack.Screen name={'codeConfirmation'} component={CodeConfirmation} />
      <Stack.Screen name={'NewPassword'} component={NewPassword} />
    </Stack.Navigator>
  );
};

export default AuthScreens;
