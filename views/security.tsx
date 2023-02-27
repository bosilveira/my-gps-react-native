// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';
import { Appbar, Divider, Button } from 'react-native-paper';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Security'>;
import type { DatabaseState } from '../types/databaseState.type';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store.redux';
import { clearDatabaseThunk } from '../redux/database.slice';

export default function SecurityPage({ navigation }: Props) {

    // Redux state
    const dispatch = useDispatch<AppDispatch>();
    const packagesData = useSelector((state: RootState) => state.database) as DatabaseState;

    return (<>
    
    <StatusBar 
    animated={true}
    translucent={true}
    backgroundColor="#CCCCFF"
    />
    
    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Security" />
        <Appbar.Action icon="security" />
    </Appbar.Header>

    <Button icon="database-off-outline" buttonColor={'red'} mode="contained" onPress={() => dispatch(clearDatabaseThunk())} 
        style={{marginVertical: 16, marginHorizontal: 32}} >Clear Storage</Button>

    </>);
}