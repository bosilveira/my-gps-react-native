// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text, Appbar, Divider, Button, List, ActivityIndicator, RadioButton } from 'react-native-paper';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Watch'>;

// redux
import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { setWatchPosition, setAccuracy, setDeferredUpdatesInterval } from '../redux/location.slice';

// utils
import { watchPosition, millisecondsToTime } from '../utils/location.utils';

export default function WatchView({ navigation }: Props) {

    // Redux state
    const location = useSelector((state: RootState) => state.location);
    const dispatch = useDispatch<AppDispatch>();

    // Location Watch controller
    React.useEffect(()=>{
        if (location.watchPosition) {
            const watcher = watchPosition(location.accuracy)
            return () => {
                watcher.then((subscription)=>subscription.remove())
            }
        }
    },[location.watchPosition])

    return (<>

    <StatusBar 
    animated={true}
    translucent={true}
    backgroundColor="#CCCCFF"
    />
    
    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Location Watcher" />
        <Appbar.Action icon="broadcast" onPress={() => {}} />
    </Appbar.Header>

    <ScrollView>

        <Text variant="titleMedium"
        style={{marginTop: 16, marginHorizontal: 12}}
        >
            Test Location Tracking
        </Text>

        <Text
        style={{marginVertical: 4, marginHorizontal: 12}}
        >
            Please utilize this service to verify location data. Values that are displayed are not stored in the database; please use the home page for this purpose.
        </Text>

        <Divider style={{marginVertical: 8}} />


        <Button
        icon={location.watchPosition ? ()=><ActivityIndicator animating={location.watchPosition} color={'white'}/> : "radar"}
        mode="contained"
        onPress={() => dispatch(setWatchPosition(!location.watchPosition))}
        style={{marginVertical: 8, marginHorizontal: 32}}
        >
        Watch Position
        </Button>

        <List.Section
            style={{marginVertical: 4, marginHorizontal: 16}}
        >
    
                <List.Item
                title={"Tracking Status"}
                description={location.watchPosition ? "Location Tracking is ACTIVATED" : "Location Tracking is DEACTIVATED"}
                left={props => <List.Icon {...props} icon={ location.watchPosition ? "map-marker-radius-outline" : "map-marker-off-outline"} />}
                />

                <List.Item
                title="Last Update"
                description={()=> location.watchPosition ? <Text>{millisecondsToTime(location.currentPosition.timestamp)}</Text> : null}
                left={props => <List.Icon {...props} icon="update" />}
                />

                <List.Item
                title="Latitude"
                description={()=> location.watchPosition ? <Text>{location.currentPosition.coords.latitude}</Text> : null}
                left={props => <List.Icon {...props} icon="latitude" />}
                />

                <List.Item
                title="Longitude"
                description={()=> location.watchPosition ? <Text>{location.currentPosition.coords.longitude}</Text> : null}
                left={props => <List.Icon {...props} icon="longitude" />}
                />

                <List.Item
                title="Altitude"
                description={()=> location.watchPosition ? <Text>{location.currentPosition.coords.altitude}</Text> : null}
                left={props => <List.Icon {...props} icon="altimeter" />}
                />

                <List.Item
                title="Speed"
                description={()=> location.watchPosition ? <Text>{location.currentPosition.coords.speed}</Text> : null}
                left={props => <List.Icon {...props} icon="speedometer" />}
                />

                <List.Item
                title="Compass"
                description={()=> location.watchPosition ? <Text>{location.currentPosition.coords.heading}</Text> : null}
                left={props => <List.Icon {...props} icon="compass" />}
                />

                <List.Item
                title="Accuracy"
                description={()=> location.watchPosition ? <Text>{location.currentPosition.coords.accuracy}</Text> : null}
                left={props => <List.Icon {...props} icon="crosshairs-gps" />}
                />

        </List.Section>

    </ScrollView>

    </>);
}