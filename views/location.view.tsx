// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text, Appbar, Divider, Button, List, RadioButton } from 'react-native-paper';
import * as Battery from 'expo-battery';
import { BatteryState } from 'expo-battery/build/Battery.types';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;

// redux
import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { setWatchPosition, setAccuracy, setDeferredUpdatesInterval } from '../redux/location.slice';

// utils
import { getLocationPermission, requestLocationPermission, watchPosition } from '../utils/location.utils';

export default function LocationView({ navigation }: Props) {

    // Redux
    const location = useSelector((state: RootState) => state.location);
    const dispatch = useDispatch<AppDispatch>();

    // Accuracy controller
    const setAccuracyHandler = async (accuracy: number) => {
        dispatch(setAccuracy(accuracy));
    }

    // Tracking interval controller
    const setDeferredUpdatesIntervalHandler = async (interval: number) => {
        dispatch(setDeferredUpdatesInterval(interval));
    }

    // Check Location Permissions
    const [locationPermission, setLocationPermission] = React.useState({
        foregroundPermissionGranted: false,
        foregroundPermissionCanAskAgain: false,
        backgroundPermissionGranted: false,
        backgroundPermissionCanAskAgain: false,
    });
    const getLocationPermissionHandler = async () => {
        const permission = await getLocationPermission();
        setLocationPermission(permission);
    }
    const requestlocationPermissionHandler = async () => {
        const permission = await requestLocationPermission();
        setLocationPermission(permission);
    }
    React.useEffect(()=>{
        getLocationPermissionHandler();
    }, [])

    // Activates on page loading and deactivates on exiting
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
        <Appbar.Content title="Location Tracking" />
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
            Please utilize this service to verify location data.
        </Text>
        <Button
        style={{marginVertical: 8, marginHorizontal: 32}}
        icon="crosshairs-question" mode="contained" onPress={() => navigation.navigate('Watch')} >Test Tracking</Button>

        <Divider style={{marginVertical: 8}} />

        <Text variant="titleMedium"
        style={{marginTop: 16, marginHorizontal: 12}}
        >
            Location Tracking Permissions</Text>
        <Text
        style={{marginVertical: 4, marginHorizontal: 12}}
        >
            Excluding a required permission from a module in your app can break the functionality corresponding to that permission.
            Always make sure to include all permissions a module is dependent on.
        </Text>
 
        <List.Section
        style={{marginVertical: 4, marginHorizontal: 16}}
        >

            <List.Item
            title={(locationPermission.foregroundPermissionGranted) ? "Foreground Services OK" : "Foreground NOT ALLOWED!"}
            descriptionNumberOfLines={0}
            description={"Permissions for location while the app is in the foreground."}
            left={props => <List.Icon {...props} icon="arrange-bring-forward" />}
            />

            <List.Item
            title={(locationPermission.backgroundPermissionGranted) ? "Background Services OK" : "Background Services NOT ALLOWED!"}
            descriptionNumberOfLines={0}
            description={"Permissions for location while the app is in the background."}
            left={props => <List.Icon {...props} icon="arrange-send-backward" />}
            />

            <List.Item
            title={"May ask again? " + (locationPermission.foregroundPermissionCanAskAgain && locationPermission.backgroundPermissionCanAskAgain) ? "Permissions OK" : "Check Device Settings!"}
            descriptionNumberOfLines={0}
            description={"Indicates if user can be asked again for specific permission. If not, one should be directed to the Settings app in order to enable/disable the permission."}
            left={props => <List.Icon {...props} icon="progress-question" />}
            />

        </List.Section>

        <Button 
        icon="alert" 
        mode="contained" 
        onPress={requestlocationPermissionHandler}
        style={{marginVertical: 8, marginHorizontal: 32}}
        >
        Request Permissions
        </Button>

        <Divider style={{marginVertical: 8}} />

        <Text variant="titleMedium"
        style={{marginTop: 16, marginHorizontal: 12}}
        >
            Location Tracking Accuracy
        </Text>
        <Text
        style={{marginVertical: 4, marginHorizontal: 12}}
        >
            GPS accuracy options range from accurate to the nearest three kilometers (Lowest) to the highest possible accuracy that uses additional sensor data
            to facilitate navigation apps (Best For Navigation). In between, accuracy gets progressively better, ranging from accurate to the nearest kilometer
            (Low) to within ten meters of the desired target (High) to the best level of accuracy available (Highest).
        </Text>

        <List.Section
        style={{marginVertical: 4, marginHorizontal: 16}}
        >
            <List.Accordion
            title={[
                "Accuracy: Lowest",
                "Accuracy: Low",
                "Accuracy: Balanced",
                "Accuracy: High",
                "Accuracy: Highest",
                "Accuracy: Best for Navigation"][location.accuracy-1]}
            description={[
                "Accurate to the nearest three kilometers.",
                "Accurate to the nearest kilometer.",
                "Accurate to within one hundred meters.",
                "Accurate to within ten meters of the desired target.",
                "The best level of accuracy available.",
                "The highest possible accuracy that uses additional sensor data to facilitate navigation apps."][location.accuracy-1]}
            descriptionNumberOfLines={0}
            left={props => <List.Icon {...props} icon={ location.watchPosition ? "numeric-6-box" : "numeric-6-box"} />}
            >
                <RadioButton.Group onValueChange={(value)=>{setAccuracyHandler(parseInt(value))}} value={location.accuracy.toString()}>
                    <RadioButton.Item label="Best for Navigation" value="6" />
                    <RadioButton.Item label="Highest" value="5" />
                    <RadioButton.Item label="High" value="4" />
                    <RadioButton.Item label="Balanced" value="3" />
                    <RadioButton.Item label="Low" value="2" />
                    <RadioButton.Item label="Lowest" value="1" />
                </RadioButton.Group>

            </List.Accordion>
        </List.Section>
        <Divider style={{marginVertical: 8}} />

        <Text variant="titleMedium"
        style={{marginTop: 16, marginHorizontal: 12}}
        >
            Location Tracking Interval
        </Text>

        <Text
        style={{marginVertical: 4, marginHorizontal: 12}}
        >
            Enter the default interval in milliseconds.
        </Text>

        <List.Section
        style={{marginVertical: 4, marginHorizontal: 12}}
        >
            <List.Accordion
            title={"Default Interval: " + location.deferredUpdatesInterval.toString() + "ms"}
            left={props => <List.Icon {...props} icon="timer-outline" />}>
                <RadioButton.Group onValueChange={value => setDeferredUpdatesIntervalHandler(parseInt(value))} value={location.deferredUpdatesInterval.toString()}>
                    <RadioButton.Item label="No interval (0s)" value="0" />
                    <RadioButton.Item label="1000 milliseconds (1s)" value="1000" />
                    <RadioButton.Item label="3000 milliseconds (3s)" value="3000" />
                    <RadioButton.Item label="5000 milliseconds (5s)" value="5000" />
                    <RadioButton.Item label="10000 milliseconds (10s)" value="10000" />
                </RadioButton.Group>
            </List.Accordion>
        </List.Section>

        <Divider style={{marginVertical: 8}} />

    </ScrollView>

    </>);
}