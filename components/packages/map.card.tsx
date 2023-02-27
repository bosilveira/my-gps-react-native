// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, ScrollView, Dimensions, GestureResponderEvent } from 'react-native';
import { Switch, Button, Card, Avatar, Divider, ToggleButton, Chip, ActivityIndicator, IconButton } from 'react-native-paper';
import Svg, { Circle, Rect, Line, Text } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { Gyroscope } from 'expo-sensors';
// redux
import { AppDispatch, RootState } from '../../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { startLocationUpdatesThunk, stopLocationUpdatesThunk, setDeferredUpdatesInterval } from '../../redux/location.slice';

// types
import type { LocationState } from '../../types/locationState.type';
import type { DatabaseState } from '../../types/databaseState.type';
import type { LocationObject } from 'expo-location';

type Nav = { navigate: (value: string) => void }

import { watchPosition, millisecondsToTime, getMap } from '../../utils/location.utils';

export default function MapCard() {
  
    const { navigate } = useNavigation<Nav>()

    // Redux
    const dispatch = useDispatch<AppDispatch>();
    const location = useSelector((state: RootState) => state.location) as LocationState;
    const database = useSelector((state: RootState) => state.database) as DatabaseState;

    // Switch component controller: Activate Location Tracking
    const [switchLocationOn, setSwitchLocationOn] = React.useState(false);
    const onToggleSwitchLocation = () => {
        if (location.locationUpdates) {
            dispatch(stopLocationUpdatesThunk());
            setSwitchLocationOn(false);
        } else {
            dispatch(startLocationUpdatesThunk());
            setSwitchLocationOn(true);
        }
    }

    // Time interval toggle controller
    const setDeferredUpdatesIntervalHandler = async (interval: number) => {
        if (isNaN(interval)) {
            dispatch(setDeferredUpdatesInterval(0));
        } else {
            dispatch(setDeferredUpdatesInterval(interval));
        }
    }

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;


    const plotMap = async () =>{
        setLoading(true);
        setX(.5*windowWidth);
        setY(.5*windowWidth);
        const map = await getMap();
        setPosition(map.user.currentPosition);
        //const geo = await reverseGeocode(currentPosition);
        // console.log(geo[0].city, geo[0].country, geo[0].district, geo[0].postalCode, geo[0].region, geo[0].isoCountryCode, geo[0].name,
        //     geo[0].street, geo[0].streetNumber, geo[0].subregion, geo[0].timezone )
        // console.log("Here:", geo[0].street, geo[0].streetNumber, geo[0].district, geo[0].subregion, geo[0].region, geo[0].country, geo[0].postalCode )

        const elements = map.points.map( (item, index)=> {
            const x = item.x;
            const y = item.y;
            const radius = 1 + (item.accuracy - map.limits.minAccuracy)/(map.limits.maxAccuracy-map.limits.minAccuracy);
            const color = item.status === 'pending' ? `rgba(255, 0, 0, ${1-(item.accuracy/map.limits.maxAccuracy)})` : `rgba(0, 255, 0, ${1-(item.accuracy/map.limits.maxAccuracy)})`;
            return <Circle key={index} cx={x*100} cy={y*100} r={2} fill={color} />;
        });

        setCircles(elements);
        setLoading(false);
    }

    const [ x, setX ] = React.useState((windowWidth-16)/2);
    const [ y, setY ] = React.useState((windowWidth-16)/2);


    const [ circles, setCircles ] = React.useState([] as JSX.Element[]) 
    const [ loading, setLoading ] = React.useState(false) 
    const [ position, setPosition ] = React.useState({
        coords:
        {
            accuracy: 0,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: 0,
            latitude: 0,
            longitude: 0,
            speed: 0
        }, 
        mocked: true,
        timestamp: 0
    } as LocationObject ) 

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
            loading={location.locationUpdates} disabled={location.locationUpdates}
            style={{margin: 8}} >Plot Location Packages</Button>
            </Card.Content>

        </Card>
    
            <View style={{ height:windowWidth, padding: 8 }}>
                { loading ?

                <ActivityIndicator size={32} animating={loading} style={{marginTop: 32}}/> :
                <>
                <Svg height={windowWidth-16} width={windowWidth-16} viewBox="0 0 100 100" onPress={(event: GestureResponderEvent)=> { setX(event.nativeEvent.locationX); setY(event.nativeEvent.locationY); }}>
                    <Line x1={25} y1={0} x2={25} y2={100} stroke={'rgba(192, 192, 192, .5)'} strokeWidth={.5} strokeDasharray={1}/>
                    <Line x1={50} y1={0} x2={50} y2={100} stroke={'rgba(192, 192, 192, 1)'} strokeWidth={.5} strokeDasharray={1}/>
                    <Line x1={75} y1={0} x2={75} y2={100} stroke={'rgba(192, 192, 192, .5)'} strokeWidth={.5} strokeDasharray={1}/>
                    <Line x1={0} y1={25} x2={100} y2={25} stroke={'rgba(192, 192, 192, .5)'} strokeWidth={.5} strokeDasharray={1}/>
                    <Line x1={0} y1={50} x2={100} y2={50} stroke={'rgba(192, 192, 192, 1)'} strokeWidth={.5} strokeDasharray={1}/>
                    <Line x1={0} y1={75} x2={100} y2={75} stroke={'rgba(192, 192, 192, .5)'} strokeWidth={.5} strokeDasharray={1}/>
                    <Text x="0" y="49" fill="rgba(92, 92, 92, 1)" fontSize={4} textAnchor="start">12 km</Text>
                    <Text x="100" y="49" fill="rgba(92, 92, 92, 1)" fontSize={4} textAnchor="end">12 km</Text>
                    <Text x="51" y="0" fill="rgba(92, 92, 92, 1)" fontSize={4} textAnchor="start" translateY="4">12 km</Text>
                    <Text x="51" y="100" fill="rgba(92, 92, 92, 1)" fontSize={4} textAnchor="start" translateY="-1">12 km</Text>
                    {circles}
                    <Circle cx={100*x/windowWidth} cy={100*y/windowWidth} r={10} fill={'rgba(0, 0, 92, .2)'} />
                </Svg>
                </>}
            </View>

            <Chip
            mode="outlined"
            style={{marginHorizontal: 16, marginVertical: 4, padding: 8}}
            icon="latitude"
            >
                Center Latitude: {}
            </Chip>

            <Chip
            mode="outlined"
            style={{marginHorizontal: 16, marginVertical: 4, padding: 8}}
            icon="longitude"
            >
                Center Longitude: 
            </Chip>

            <Chip
            mode="outlined"
            style={{marginHorizontal: 16, marginVertical: 4, padding: 8}}
            icon="bullseye"
            >
                Accuracy: 1 m - 3 km
            </Chip>

    </ScrollView>
    </>);
}

