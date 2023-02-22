import * as React from 'react';
import { Button, List } from 'react-native-paper';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import * as Battery from 'expo-battery';
import { BatteryState } from 'expo-battery/build/Battery.types';

import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { watchPosition } from '../utils/location.utils';
import { setWatchPosition } from '../redux/location.slice';
import { LocationObject } from 'expo-location';

export default function PositionWatcher( ) {

    const locationData = useSelector((state: RootState) => state.location);
    const dispatch = useDispatch<AppDispatch>();

    const [location, setLocation ] = React.useState({
        coords:
        {
            accuracy: 16.474000930786133,
            altitude: 210,
            altitudeAccuracy: 1.2659136056900024,
            heading: 37.12635040283203,
            latitude: -21.9943997,
            longitude: -42.9162007,
            speed: 0.5416816473007202
        }, 
        mocked: false,
        timestamp: 1676944389442
    } as LocationObject
    )

    React.useEffect(()=>{
        if (locationData.watchPosition) {
            const watcher = watchPosition(locationData.accuracy, locationData.distanceInterval)
            return () => {
                watcher.then((subscription)=>subscription.remove())
            }
        }
    },[locationData.watchPosition])

    return (
    <>
        <Button
        icon={locationData.watchPosition ? ()=><ActivityIndicator animating={locationData.watchPosition} color={'white'}/> : "radar"}
        mode="contained"
        onPress={() => dispatch(setWatchPosition(!locationData.watchPosition))}
        style={{marginVertical: 8, marginHorizontal: 32}}
        >
        Watch Position
        </Button>

        <List.Section
        style={{marginVertical: 4, marginHorizontal: 16}}
        >

            <List.Accordion
            title={locationData.watchPosition ? "Position Tracking ON" : "Position Tracking OFF"}
            left={props => <List.Icon {...props} icon={ locationData.watchPosition ? "map-marker-radius-outline" : "map-marker-off-outline"} />}>

                <List.Item
                title="Last Update"
                description={(()=> { let date = new Date(); date.setTime(location.timestamp); return date.toTimeString() })()}
                left={props => <List.Icon {...props} icon="update" />}
                />

                <List.Item
                title="Latitude"
                description={location.coords.latitude}
                left={props => <List.Icon {...props} icon="latitude" />}
                />

                <List.Item
                title="Longitude"
                description={location.coords.longitude}
                left={props => <List.Icon {...props} icon="longitude" />}
                />

                <List.Item
                title="Altitude"
                description={location.coords.altitude}
                left={props => <List.Icon {...props} icon="altimeter" />}
                />

                <List.Item
                title="Speed"
                description={location.coords.speed}
                left={props => <List.Icon {...props} icon="speedometer" />}
                />

                <List.Item
                title="Compass"
                description={location.coords.heading}
                left={props => <List.Icon {...props} icon="compass" />}
                />

                <List.Item
                title="Accuracy"
                description={location.coords.accuracy}
                left={props => <List.Icon {...props} icon="crosshairs-gps" />}
                />

            </List.Accordion>
        </List.Section>

    </>

    );
}