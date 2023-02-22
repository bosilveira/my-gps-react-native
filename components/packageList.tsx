import * as React from 'react';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import * as Battery from 'expo-battery';
import { BatteryState } from 'expo-battery/build/Battery.types';

import { View, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Appbar, Button, Card, Avatar, Text, Divider, List, RadioButton, SegmentedButtons } from 'react-native-paper';

import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { watchPosition } from '../utils/location.utils';
import { setWatchPosition } from '../redux/location.slice';
import { LocationObject } from 'expo-location';

import { getAllPackages } from '../utils/asyncStorage';

export default function PackageList( ) {

    const locationData = useSelector((state: RootState) => state.location);
    const packagesData = useSelector((state: RootState) => state.database);
    const dispatch = useDispatch<AppDispatch>();

    const [refreshing, setRefreshing] = React.useState(false);
    const [opacity, setOpacity] = React.useState(1);
    const [packages, setPackages] = React.useState([] as string[]);
    const [page, setPage] = React.useState(0);


    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        setOpacity(.2)
        const list = await getAllPackages();
        setPackages(list)
        setTimeout(() => {
          setRefreshing(false);
          setOpacity(1)
          console.log("refreshing")
        }, 1000);
      }, []);
  

const createCards = (list: string[]) => {
    const elements: React.ReactElement[]  = []

    list.slice(page,page+10).forEach( (item, index) =>elements.push(
    <>
    <Card
    style={{margin: 8}}
    key={'package_card_' + index}
    >
        <Card.Content>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', marginBottom: 4}}>
                <View>
                    <Text variant="titleMedium">Package: {item}</Text>
                    <Text variant="titleSmall">12:03 2/21/2023</Text>
                </View>
                <Avatar.Icon size={32} icon="sync" />
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', marginVertical: 2}}>
                <Avatar.Icon size={24} icon="latitude" />
                <Text style={{marginLeft: 8}}>Latitude</Text>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', marginVertical: 2}}>
                <Avatar.Icon size={24} icon="longitude" />
                <Text style={{marginLeft: 8}}>Longitude</Text>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', marginVertical: 2}}>
                <Avatar.Icon size={24} icon="speedometer" />
                <Text style={{marginLeft: 8}}>Speed</Text>
            </View>

        </Card.Content>

    </Card>
    
    </>

    ))

    return elements
}


    return (
    <>
    <ScrollView 
    style={{opacity}}
    refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>

<View>

    <View style={{display: 'flex', flexDirection: 'row', justifyContent:'center', alignItems: 'center', marginVertical: 2}}>
        <Button icon="page-previous-outline" mode="text" onPress={() => console.log('Pressed')} style={{width:'33%'}}>
            Page 1
        </Button>
        <Text style={{width:'33%', textAlign: 'center'}}>Page 2</Text>
        <Button icon="page-next-outline" mode="text" onPress={() => console.log('Pressed')} style={{width:'33%'}}>
            Page 3
        </Button>
    </View>

{createCards(packages)}

</View>

    </ScrollView>

    </>

    );
}