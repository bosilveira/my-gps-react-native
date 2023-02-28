// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';
import { Appbar, Divider } from 'react-native-paper';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Help'>;

export default function HelpPage({ navigation }: Props) {

return (<>

    <StatusBar 
    animated={true}
    translucent={true}
    backgroundColor="#CCCCFF"
    />

    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Help" />
        <Appbar.Action icon="help-circle-outline" />
    </Appbar.Header>

    <ScrollView
    style={{padding: 16, backgroundColor: 'rgba(245, 245, 245, 1)'}}
    >
        <Text variant="titleMedium"
        style={{textAlign: 'center'}}
        >
            My GPS
        </Text>
        <Text
        style={{textAlign: 'center'}}
        >
           Este projeto Expo React Native foi criado com o objetivo de seguir o banco de dados do servidor Contele hospedado em https://github.com/contele/contele-vagas/tree/master/react-native , que lida com serviços de geolocalização.
           O projeto Expo React Native permite que os usuários naveguem pelo banco de dados Contele de uma forma intuitiva.
        </Text>
    </ScrollView>

    </>);
}