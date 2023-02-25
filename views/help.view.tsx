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
        <Appbar.Action icon="help-circle-outline" onPress={() => {}} />
    </Appbar.Header>

    <ScrollView style={{backgroundColor: 'rgba(245, 245, 245, 1)'}}>
        <Text variant="titleMedium"
            style={{textAlign: 'center', marginHorizontal: 12}}
            >
                Location Tracking Accuracy
            </Text>
            <Text
            style={{textAlign: 'center', marginVertical: 4, marginHorizontal: 12}}
            >
                GPS accuracy options range from accurate to the nearest three kilometers (Lowest) to the highest possible accuracy that uses additional sensor data
                to facilitate navigation apps (Best For Navigation). In between, accuracy gets progressively better, ranging from accurate to the nearest kilometer
                (Low) to within ten meters of the desired target (High) to the best level of accuracy available (Highest).
            </Text>
    </ScrollView>

    </>);
}