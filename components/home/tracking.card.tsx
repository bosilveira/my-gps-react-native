// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Switch, Appbar, Button, Card, Avatar, Text, Divider, List, ProgressBar, ToggleButton, Modal, Portal, Provider, ActivityIndicator, BottomNavigation, Chip } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useNavigation } from '@react-navigation/native';

import HomeMenu from './home.menu';
// redux
import { AppDispatch, RootState } from '../../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { startLocationUpdatesThunk, stopLocationUpdatesThunk, setDeferredUpdatesInterval } from '../../redux/location.slice';
import { setAPIAutoUpload } from '../../redux/network.slice';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Nav = {
    navigate: (value: string) => void;
}

export default function TrackingCard() {
  
    const { navigate } = useNavigation<Nav>()

    // Redux
    const dispatch = useDispatch<AppDispatch>();
    const location = useSelector((state: RootState) => state.location);
    const database = useSelector((state: RootState) => state.database);

    // BACKGROUND (MAIN) LOCATION TRACKING

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

    return (<>
    <ScrollView style={{backgroundColor: 'rgba(245, 245, 245, 1)'}}>
        <Card
        style={{margin: 8}}
        >
            <Card.Title
            title="Location Tracking"
            subtitle="Location (GPS) Service"
            right={() => <Switch value={switchLocationOn} onValueChange={()=>onToggleSwitchLocation()}/>}
            left={(props) => <Avatar.Icon {...props} icon="car-connected"/>}
            />

            <Chip
            style={{margin: 8, padding: 8}}
            icon={location.locationUpdates ? "map-marker-radius-outline" : "map-marker-off-outline"} onPress={() => console.log('Pressed')}>
                {location.status}
            </Chip>

            <Divider style={{marginVertical: 8}} />
            
            <Card.Content>
                <Text variant="labelLarge" style={{textAlign: 'center', width: '100%', marginTop: 4}}>Tracking Interval</Text>
                <View>
                    <ToggleButton.Row
                    style={{display: 'flex', justifyContent: 'center', width: '100%', marginVertical: 8}}
                    onValueChange={value => setDeferredUpdatesIntervalHandler(parseInt(value))} value={location.deferredUpdatesInterval.toString()}
                    >
                        <ToggleButton icon={() => <Text >0s</Text>} value="0" disabled={location.locationUpdates}/>
                        <ToggleButton icon={() => <Text>1s</Text>} value="1000" disabled={location.locationUpdates}/>
                        <ToggleButton icon={() => <Text>3s</Text>} value="3000" disabled={location.locationUpdates}/>
                        <ToggleButton icon={() => <Text>5s</Text>} value="5000" disabled={location.locationUpdates}/>
                        <ToggleButton icon={() => <Text>10s</Text>} value="10000" disabled={location.locationUpdates}/>
                    </ToggleButton.Row>
                    <Button icon="car-connected" mode="outlined" onPress={() => navigate('Location')}
                    disabled={location.locationUpdates}
                    style={{marginVertical: 16, marginHorizontal: 32}} >Check Tracking Settings</Button>
                </View>

            </Card.Content>

            <Divider style={{marginVertical: 8}} />

            <Chip
            style={{margin: 8, padding: 8}}
            icon="database" onPress={() => console.log('Pressed')}>
                Total: {database.size} Packages
            </Chip>

            <Button icon="database-outline" mode="contained" onPress={() => navigate('Packages')}
            loading={location.locationUpdates} disabled={location.locationUpdates}
            style={{marginVertical: 16, marginHorizontal: 32}} >Check Package Database</Button>

        </Card>
    </ScrollView>
    </>);
}

