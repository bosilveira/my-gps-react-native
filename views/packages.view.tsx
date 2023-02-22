import * as React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';
import { Appbar, Divider, Button, SegmentedButtons } from 'react-native-paper';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Packages'>;

// redux
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store.redux';
import { clearDatabase } from '../redux/database.slice';

// components
import PackageList from '../components/packageList';

import { startLocationUpdates, stopLocationUpdates, checkLocationUpdates } from '../utils/location.utils';
import { getAllPackages, clearStorage } from '../utils/asyncStorage';

export default function PackagesView({ navigation }: Props) {

    const dispatch = useDispatch<AppDispatch>();
    const packagesData = useSelector((state: RootState) => state.database);


  return (<>

    <StatusBar 
    animated={true}
    translucent={true}
    backgroundColor="#CCCCFF"
    />
    
    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Package Sync" />
        <Appbar.Action icon="sync" onPress={() => {}} />
    </Appbar.Header>
    

    <View style={{paddingVertical: 8, paddingHorizontal: 12}}>
      <SegmentedButtons
        value={'pending'}
        onValueChange={()=>{}}
        buttons={[
            {
                value: 'pending',
                label: 'Pending: ' + packagesData.pending
            },
            {
                value: 'packages',
                label: 'Total: ' + packagesData.packages,
            },

        ]}
      />
    </View>

    <Button icon="package" mode="contained" onPress={() => startLocationUpdates()} style={{marginVertical: 8, marginHorizontal: 32}} >Start Tracking</Button>

    <Button icon="package" mode="contained" onPress={() => stopLocationUpdates()} style={{marginVertical: 8, marginHorizontal: 32}} >Stop Tracking</Button>

    <Button icon="package" mode="contained" onPress={() => checkLocationUpdates()} style={{marginVertical: 8, marginHorizontal: 32}} >Check Tracking</Button>

    <Button icon="trash-can-outline" mode="contained" onPress={() => dispatch(clearDatabase())} style={{marginVertical: 8, marginHorizontal: 32}} >Clear Storage</Button>


    <PackageList />

    </>);
}