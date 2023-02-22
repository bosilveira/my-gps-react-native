// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import * as Battery from 'expo-battery';
import { View, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Appbar, Button, Card, Avatar, Text, Divider, List, RadioButton, SegmentedButtons } from 'react-native-paper';

import PackageCard from './packageCard';

// redux
import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { paginatePackagesThunk } from '../redux/database.slice';

// types
import { LocationObject } from 'expo-location';
import { BatteryState } from 'expo-battery/build/Battery.types';

interface Package {
    id: string,
    location: {
        coords:
        {
            accuracy: number,
            altitude: number,
            altitudeAccuracy: number,
            heading: number,
            latitude: number,
            longitude: number,
            speed: number
        }, 
        mocked: boolean,
        timestamp: number
    },
    power: {
        batteryLevel: number,
        batteryState: Battery.BatteryState,
        lowPowerMode: boolean,
    },
}

// utils
import { getAllPackages } from '../utils/asyncStorage';

export default function PackageList( ) {

    const locationData = useSelector((state: RootState) => state.location);
    const database = useSelector((state: RootState) => state.database);
    const dispatch = useDispatch<AppDispatch>();

    const [refreshing, setRefreshing] = React.useState(false);
    const [opacity, setOpacity] = React.useState(1);


    // PAGINATION

    const previousPage = () => {
        setOpacity(.2);
        if (database.page > 0) {
            dispatch(paginatePackagesThunk(database.page - 1));
        }
        setOpacity(1);
    }

    const nextPage = () => {
        setOpacity(.2)
        if (database.page < database.totalPages) {
            dispatch(paginatePackagesThunk(database.page + 1));
        }
        setOpacity(1);
    }

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        dispatch(paginatePackagesThunk(0));
        setOpacity(.2);
        setTimeout(() => {
          setRefreshing(false);
          setOpacity(1);
        }, 200);
      }, []);
  
    return (
    <>

    <View style={{display: 'flex', flexDirection: 'row', justifyContent:'center', alignItems: 'center', marginVertical: 2}}>
        <Button icon="page-previous-outline" mode="text" onPress={previousPage}
         style={{width:'33%'}}>
            Previous
        </Button>
        <Text style={{width:'33%', textAlign: 'center'}}>Page {database.page + 1} of {database.totalPages + 1}</Text>
        <Button icon="page-next-outline" mode="text" onPress={nextPage} style={{width:'33%'}}>
            Next
        </Button>
    </View>

    <View style={{display: 'flex', flexDirection: 'row', justifyContent:'center', alignItems: 'center', marginVertical: 2}}>
        <Text variant="labelSmall">Pull-to-refresh</Text>
    </View>
    <Divider style={{marginVertical: 8}} />

    <ScrollView 
    style={{opacity}}
    refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>

        <View>
            {database.pageList.length > 0 && database.pageList.map((item: any, index: any)=><PackageCard key={item} packageId={item} />)}
        </View>

    </ScrollView>

    </>

    );
}