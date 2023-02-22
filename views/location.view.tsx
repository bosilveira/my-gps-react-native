import * as React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';
import { Appbar, Divider, Button, List, ActivityIndicator } from 'react-native-paper';
import * as Battery from 'expo-battery';
import { BatteryState } from 'expo-battery/build/Battery.types';

// redux
import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { checkLocationPermission, requestLocationPermission, getPosition, watchPosition } from '../utils/location.utils';
import { setWatchPosition } from '../redux/location.slice';

import PositionWatcher from '../components/positionWatcher';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;

export default function LocationView({ navigation }: Props) {

    const locationData = useSelector((state: RootState) => state.location);
    const dispatch = useDispatch<AppDispatch>();
    const [battery, setBattery] = React.useState({ batteryLevel: 0.0, batteryState: BatteryState.UNPLUGGED });

    const [locationPermission, setLocationPermission] = React.useState({
        foregroundPermissionGranted: false,
        foregroundPermissionCanAskAgain: false,
        backgroundPermissionGranted: false,
        backgroundPermissionCanAskAgain: false,
    });

    const getLocationPermissionHandler = async () => {
        const permission = await checkLocationPermission();
        setLocationPermission(permission);
    }

    const requestlocationPermissionHandler = async () => {
        const permission = await requestLocationPermission();
        setLocationPermission(permission);
    }

    React.useEffect(()=>{
        getLocationPermissionHandler();
    }, [])


    React.useEffect(()=>{
        Battery.getPowerStateAsync().then(power => setBattery(power));
    }, [locationData.location.timestamp])

    React.useEffect(()=>{
        if (locationData.watchPosition) {
            const watcher = watchPosition(locationData.accuracy, locationData.distanceInterval)
            return () => {
                watcher.then((subscription)=>subscription.remove())
            }
        }
    },[locationData.watchPosition])


    return (<>

    <StatusBar 
    animated={true}
    translucent={true}
    backgroundColor="#CCCCFF"
    />
    
    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Location Tracking" />
        <Appbar.Action icon="broadcast" onPress={() => {}} />
    </Appbar.Header>

    <ScrollView>

        <Text
        style={{marginVertical: 4, marginTop: 16, marginHorizontal: 12}}
        >
            Excluding a required permission from a module in your app can break the functionality corresponding to that permission.
            Always make sure to include all permissions a module is dependent on.
        </Text>

        <Divider style={{marginVertical: 8}} />

        <Button 
        icon="alert" 
        mode="contained" 
        onPress={requestlocationPermissionHandler}
        style={{marginVertical: 8, marginHorizontal: 32}}
        >
        Request Permissions
        </Button>

         <List.Section
        style={{marginVertical: 4, marginHorizontal: 16}}
        >
            <List.Accordion
            title={"Location Permissions"}
            left={props => <List.Icon {...props} icon={ locationData.watchPosition ? "crosshairs-question" : "crosshairs-question"} />}
            >

                <List.Item
                title={"Foreground: " + locationPermission.foregroundPermissionGranted.toString()}
                descriptionNumberOfLines={0}
                description={"Permissions for location while the app is in the foreground."}
                left={props => <List.Icon {...props} icon="arrange-bring-forward" />}
                />

                <List.Item
                title={"Background: " + locationPermission.backgroundPermissionGranted.toString()}
                descriptionNumberOfLines={0}
                description={"Permissions for location while the app is in the background."}
                left={props => <List.Icon {...props} icon="arrange-send-backward" />}
                />

                <List.Item
                title={"May ask again? " + (locationPermission.foregroundPermissionCanAskAgain && locationPermission.backgroundPermissionCanAskAgain).toString()}
                descriptionNumberOfLines={0}
                description={"Indicates if user can be asked again for specific permission. If not, one should be directed to the Settings app in order to enable/disable the permission."}
                left={props => <List.Icon {...props} icon="progress-question" />}
                />

            </List.Accordion>
        </List.Section>

        <Divider style={{marginVertical: 8}} />

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
                description={(()=> { let date = new Date(); date.setTime(locationData.location.timestamp); return date.toTimeString() })()}
                left={props => <List.Icon {...props} icon="update" />}
                />

                <List.Item
                title="Latitude"
                description={locationData.location.coords.latitude}
                left={props => <List.Icon {...props} icon="latitude" />}
                />

                <List.Item
                title="Longitude"
                description={locationData.location.coords.longitude}
                left={props => <List.Icon {...props} icon="longitude" />}
                />

                <List.Item
                title="Altitude"
                description={locationData.location.coords.altitude}
                left={props => <List.Icon {...props} icon="altimeter" />}
                />

                <List.Item
                title="Speed"
                description={locationData.location.coords.speed}
                left={props => <List.Icon {...props} icon="speedometer" />}
                />

                <List.Item
                title="Compass"
                description={locationData.location.coords.heading}
                left={props => <List.Icon {...props} icon="compass" />}
                />

                <List.Item
                title="Accuracy"
                description={locationData.location.coords.accuracy}
                left={props => <List.Icon {...props} icon="crosshairs-gps" />}
                />

            </List.Accordion>
        </List.Section>

    </ScrollView>

    </>);
}