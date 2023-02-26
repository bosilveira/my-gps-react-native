// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, Divider, Button, List, Chip } from 'react-native-paper';

// utils
import { getLocationPermission, requestLocationPermission } from '../../utils/location.utils';

export default function PermissionSettings() {

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

    return (<>
    <ScrollView
    style={{padding: 16, backgroundColor: 'rgba(245, 245, 245, 1)'}}
    >
        <Text variant="titleMedium"
        style={{textAlign: 'center'}}
        >
            Location Tracking Permissions
        </Text>

        <Chip
        style={{marginVertical: 8, padding: 8}}
        icon="arrange-bring-forward" onPress={() => console.log('Pressed')}>
            {(locationPermission.foregroundPermissionGranted) ? "Foreground Services ALLOWED" : "Foreground NOT ALLOWED!"}
        </Chip>

        <Chip
        style={{marginVertical: 8, padding: 8}}
        icon="arrange-send-backward" onPress={() => console.log('Pressed')}>
            {(locationPermission.backgroundPermissionGranted) ? "Background Services ALLOWED" : "Background Services NOT ALLOWED!"}
        </Chip>

        <Chip
        style={{marginVertical: 8, padding: 8}}
        icon="progress-question" onPress={() => console.log('Pressed')}>
            {(locationPermission.foregroundPermissionCanAskAgain && locationPermission.backgroundPermissionCanAskAgain) ? "May ask again? ALLOWED" : "Check Device Settings!"}
        </Chip>

        <Button 
        icon="alert" 
        mode="contained" 
        onPress={requestlocationPermissionHandler}
        style={{marginVertical: 8, marginHorizontal: 32}}
        disabled={locationPermission.foregroundPermissionGranted && locationPermission.foregroundPermissionGranted && locationPermission.foregroundPermissionCanAskAgain && locationPermission.backgroundPermissionCanAskAgain}
        >
            Request Permissions
        </Button>

        <Divider style={{marginVertical: 8}} />

        <Text
        style={{textAlign: 'center'}}
        >
            Excluding a required permission from a module in your app can break the functionality corresponding to that permission.
            Always make sure to include all permissions a module is dependent on.
        </Text>

        <List.Section
        style={{marginVertical: 4, marginHorizontal: 16}}
        >

            <List.Item
            title="Foreground Services"
            descriptionNumberOfLines={0}
            description={"Permissions for location while the app is in the foreground."}
            left={props => <List.Icon {...props} icon="arrange-bring-forward" />}
            />

            <List.Item
            title="Background Services"
            descriptionNumberOfLines={0}
            description={"Permissions for location while the app is in the background."}
            left={props => <List.Icon {...props} icon="arrange-send-backward" />}
            />

            <List.Item
            title="May ask again?"
            descriptionNumberOfLines={0}
            description={"Indicates if user can be asked again for specific permission. If not, one should be directed to the Settings app in order to enable/disable the permission."}
            left={props => <List.Icon {...props} icon="progress-question" />}
            />

        </List.Section>
    </ScrollView>
    </>);
}