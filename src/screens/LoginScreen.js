import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import * as Yup from 'yup';
import {
  ErrorMessage,
  AppForm,
  AppFormField,
  SubmitButton,
} from '../components/forms';
import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import AuthContext from '../contexts/AuthContext';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(4).label('Password'),
});

const LoginScreen = ({ navigation }) => {
  const { onLogin, error } = useContext(AuthContext);

  return (
    <Screen>
      <Text>LOGIN SCREEN error is: {error}</Text>
      <AppForm
        initialValues={{ email: 'wross@example.com', password: 'test123' }}
        //initialValues={{ email: '', password: '' }}
        onSubmit={onLogin}
        validationSchema={validationSchema}
      >
        <ErrorMessage error='Invalid email and/or password' visible={error} />
        <AppFormField
          autoCapitalize='none'
          autoCorrect={false}
          icon='email'
          keyboardType='email-address'
          name='email'
          placeholder='Email'
          textContentType='emailAddress'
        />
        <AppFormField
          autoCapitalize='none'
          autoCorrect={false}
          icon='lock'
          name='password'
          placeholder='Password'
          secureTextEntry
          textContentType='password'
        />
        <SubmitButton title='Log In' />
        <AppButton title='Back' onPress={() => navigation.goBack()} />
      </AppForm>
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default LoginScreen;
