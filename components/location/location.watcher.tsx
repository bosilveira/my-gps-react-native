// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, Chip, Divider, Button, List, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// types
import type { LocationObject } from 'expo-location';
import type { LocationState } from '../../types/locationState.type';
type Nav = { navigate: (value: string) => void }

// redux
import { RootState } from '../../redux/store.redux';
import { useSelector } from 'react-redux';

// utils
import { watchPosition, millisecondsToTime } from '../../utils/location.utils';

export default function LocationWatcher() {

    // Redux state
    const location = useSelector((state: RootState) => state.location) as LocationState;

    // Location Watch controller
    const [ isWatching, setIsWatching] = React.useState(false);
    const [ position, setPosition] = React.useState(
    {
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
    } as LocationObject);

    // Activates on page loading and deactivates on exiting
    React.useEffect(()=>{
        if (isWatching) {
            const watcher = watchPosition(location.accuracy, setPosition)
            return () => {
                watcher.then((subscription)=>subscription.remove())
            }
        }
    },[isWatching])

    return (<>
    <ScrollView
    style={{padding: 16, backgroundColor: 'rgba(245, 245, 245, 1)'}}
    >

        <Text variant="titleMedium"
        style={{textAlign: 'center'}}
        >
            Test Location Tracking
        </Text>

        <Text
        style={{textAlign: 'center'}}
        >
            Please utilize this service to verify location data. Values that are displayed are not stored in the database; please use the home page for this purpose.
        </Text>

        <Divider style={{marginVertical: 8}} />

        <Button
        icon={isWatching ? ()=><ActivityIndicator animating={isWatching} color={'white'}/> : "radar"}
        mode="contained"
        onPress={() => setIsWatching(previous=>!previous)}
        style={{marginVertical: 8, marginHorizontal: 32}}
        >
        Watch Position
        </Button>

        <Chip
        style={{marginVertical: 8, padding: 8}}
        icon={ isWatching ? "map-marker-radius-outline" : "map-marker-off-outline"}>
            {isWatching ? "Tracking Current Position" : "Press 'Watch Position' to Start"}
        </Chip>

        <List.Section
            style={{marginVertical: 4, marginHorizontal: 16}}
        >
    
            <List.Item
            title="Last Update"
            description={()=> isWatching ? <Text>{millisecondsToTime(position.timestamp)}</Text> : null}
            left={props => <List.Icon {...props} icon="update" />}
            />

            <List.Item
            title="Latitude"
            description={()=> isWatching ? <Text>{position.coords.latitude}</Text> : null}
            left={props => <List.Icon {...props} icon="latitude" />}
            />

            <List.Item
            title="Longitude"
            description={()=> isWatching ? <Text>{position.coords.longitude}</Text> : null}
            left={props => <List.Icon {...props} icon="longitude" />}
            />

            <List.Item
            title="Altitude"
            description={()=> isWatching ? <Text>{position.coords.altitude}</Text> : null}
            left={props => <List.Icon {...props} icon="altimeter" />}
            />

            <List.Item
            title="Speed"
            description={()=> isWatching ? <Text>{position.coords.speed}</Text> : null}
            left={props => <List.Icon {...props} icon="speedometer" />}
            />

            <List.Item
            title="Compass"
            description={()=> isWatching ? <Text>{position.coords.heading}</Text> : null}
            left={props => <List.Icon {...props} icon="compass" />}
            />

            <List.Item
            title="Accuracy"
            description={()=> isWatching ? <Text>{position.coords.accuracy}</Text> : null}
            left={props => <List.Icon {...props} icon="crosshairs-gps" />}
            />

        </List.Section>

    </ScrollView>

    </>);
}