// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, ScrollView, Dimensions, GestureResponderEvent } from 'react-native';
import { Switch, Button, Card, Avatar, Divider, ToggleButton, Chip, ActivityIndicator, IconButton, Text } from 'react-native-paper';
import Svg, { Circle, Rect, Line, Text as TextSVG } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

// redux
import { AppDispatch, RootState } from '../../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { startLocationUpdatesThunk, stopLocationUpdatesThunk, setDeferredUpdatesInterval } from '../../redux/location.slice';
import { reloadLocationPackagesThunk } from '../../redux/database.slice';

// types
import type { LocationState } from '../../types/locationState.type';
import type { DatabaseState } from '../../types/databaseState.type';
import type { LocationObject } from 'expo-location';
import { LocationPackageStatus } from '../../types/locationPackage.type';

type Nav = { navigate: (value: string) => void }

import { watchPosition, millisecondsToTime, getMap } from '../../utils/location.utils';

export default function MapCard() {
  
    // Redux
    const dispatch = useDispatch<AppDispatch>();
    const location = useSelector((state: RootState) => state.location) as LocationState;
    const database = useSelector((state: RootState) => state.database) as DatabaseState;


    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    // Loading controller
    React.useEffect(()=>{
        if (!location.locationUpdates) {
            dispatch(reloadLocationPackagesThunk());
            plotMap();
        }  
    },[])

    // Map controller
    const [ circles, setCircles ] = React.useState([] as JSX.Element[]) 
    const [ loading, setLoading ] = React.useState(false) 
    const [ mapInfo, setMapInfo ] = React.useState({ centerLatitude: 0, centerLongitude: 0, minAccuracy: 0, maxAccuracy: 0 });

    const plotMap = async () =>{
        setLoading(true);
        const map = await getMap();
        setMapInfo({ 
            centerLatitude: map.center.centerLatitude,
            centerLongitude: map.center.centerLongitude, 
            minAccuracy: map.limits.minAccuracy, 
            maxAccuracy: map.limits.maxAccuracy 
        })
        let elements = [
            <TextSVG key="west" x="0" y="49" fill="rgba(92, 92, 92, 1)" fontSize={4} textAnchor="start">West</TextSVG>,
            <TextSVG key="east" x="100" y="49" fill="rgba(92, 92, 92, 1)" fontSize={4} textAnchor="end">East</TextSVG>,
            <TextSVG key="north" x="51" y="0" fill="rgba(92, 92, 92, 1)" fontSize={4} textAnchor="start" translateY="4">North</TextSVG>,
            <TextSVG key="south" x="51" y="100" fill="rgba(92, 92, 92, 1)" fontSize={4} textAnchor="start" translateY="-1">South</TextSVG>
        ];
        elements = elements.concat(map.points.map( (item, index)=> {
            const x = item.x;
            const y = item.y;
            const radius = 5*(1-.5*item.accuracy/map.limits.maxAccuracy);
            const color = item.status === LocationPackageStatus.PEND ? `rgba(255, 0, 0, .5)` : `rgba(0, 0, 255, .5)`;
            return <Circle key={index} cx={x*100} cy={y*100} r={radius} fill={color} />;
        }));

        setCircles(elements);
        setLoading(false);
    }

    return (<>
    <ScrollView style={{backgroundColor: 'rgba(245, 245, 245, 1)'}}>
        <Card
        style={{margin: 8}}
        >
            <Card.Title
            title="Location Packages Map"
            subtitle="Coordinates and Accuracy Plot"
            left={(props) => <Avatar.Icon {...props} icon="vector-square"/>}
            />
            
            <Card.Content>

                <Chip
                style={{ padding: 8}}
                icon="target-variant"
                >
                    {database.size} Points to Plot
                </Chip>

                <Button icon="vector-line" mode="contained" onPress={plotMap}
                loading={location.locationUpdates} disabled={location.locationUpdates || database.size === 0}
                style={{margin: 8}} >Plot Location Packages</Button>

            </Card.Content>

        </Card>

        <View style={{ height:windowWidth, padding: 8 }}>
            { loading ?
            <ActivityIndicator size={32} animating={loading} style={{marginTop: 32}}/> :
            <>
            <Svg height={windowWidth-16} width={windowWidth-16} viewBox="0 0 100 100">
                <Line x1={25} y1={0} x2={25} y2={100} stroke={'rgba(192, 192, 192, .5)'} strokeWidth={.5} strokeDasharray={1}/>
                <Line x1={50} y1={0} x2={50} y2={100} stroke={'rgba(192, 192, 192, 1)'} strokeWidth={.5} strokeDasharray={1}/>
                <Line x1={75} y1={0} x2={75} y2={100} stroke={'rgba(192, 192, 192, .5)'} strokeWidth={.5} strokeDasharray={1}/>
                <Line x1={0} y1={25} x2={100} y2={25} stroke={'rgba(192, 192, 192, .5)'} strokeWidth={.5} strokeDasharray={1}/>
                <Line x1={0} y1={50} x2={100} y2={50} stroke={'rgba(192, 192, 192, 1)'} strokeWidth={.5} strokeDasharray={1}/>
                <Line x1={0} y1={75} x2={100} y2={75} stroke={'rgba(192, 192, 192, .5)'} strokeWidth={.5} strokeDasharray={1}/>
                {circles}
            </Svg>
            </>}
        </View>

        {database.size !== 0 && <>
        <Chip
        mode="outlined"
        style={{marginHorizontal: 16, marginVertical: 4, padding: 8}}
        icon="latitude"
        >
            Center Latitude: {mapInfo.centerLatitude}
        </Chip>

        <Chip
        mode="outlined"
        style={{marginHorizontal: 16, marginVertical: 4, padding: 8}}
        icon="longitude"
        >
            Center Longitude: {mapInfo.centerLongitude}
        </Chip>

        <Chip
        mode="outlined"
        style={{marginHorizontal: 16, marginVertical: 4, padding: 8}}
        icon="bullseye"
        >
            Accuracy: {mapInfo.minAccuracy.toFixed(2)} m - {mapInfo.maxAccuracy.toFixed(2)} m
        </Chip>
        </>}
        <Divider style={{marginVertical: 8}} horizontalInset={true}/>

        <Text style={{textAlign: 'center', padding: 8, bottom: 0}}>
        Positive latitudes are north of the equator, negative latitudes are south of the equator.
        Positive longitudes are east of Prime Meridian, negative longitudes are west of the Prime Meridian.
        Latitude and longitude are usually expressed in that sequence, latitude before longitude. 
        </Text>

    </ScrollView>
    </>);
}

