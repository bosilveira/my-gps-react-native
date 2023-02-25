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

export default function UploadingCard() {
  
    const { navigate } = useNavigation<Nav>()

    // Redux
    const dispatch = useDispatch<AppDispatch>();
    const location = useSelector((state: RootState) => state.location);
    const network = useSelector((state: RootState) => state.network);

    // BACKGROUND (MAIN) LOCATION TRACKING

    // Switch component controller: Activate Location Tracking
    const [switchAutoUploadOn, setSwitchAutoUploadOn] = React.useState(false);
    const onToggleSwitchAutoUpload = () => {
        if (network.autoUpload) {
            dispatch(setAPIAutoUpload(false));
            setSwitchAutoUploadOn(false);
        } else {
            dispatch(setAPIAutoUpload(true));
            setSwitchAutoUploadOn(true);
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
            title="Package Uploading"
            subtitle="Network (Server API) Service"
            right={() => <Switch value={network.autoUpload} onValueChange={onToggleSwitchAutoUpload}/>}
            left={(props) => <Avatar.Icon {...props} icon="cloud-upload" />}
            />

            <Chip
            style={{margin: 8, padding: 8}}
            icon={network.autoUpload ? "check-network-outline" : "close-network-outline"} onPress={() => console.log('Pressed')}>
                {network.autoUpload ? "Auto Uploading is ON" : "Auto Uploading is OFF"}
            </Chip>

            <Divider style={{marginVertical: 8}} />

            <Card.Content>
                <View>
                    <Text variant="labelLarge" style={{textAlign: 'center', width: '100%', marginTop: 4}}>API Address</Text>
                    <Text style={{textAlign: 'center', width: '100%', marginTop: 4}}>{network.address}</Text>
                    <Text variant="labelLarge" style={{textAlign: 'center', width: '100%', marginTop: 4}}>
                        {network.autoUpload ?
                            "Uploading will start automatically" :
                            "Uploading is set to manual"}
                    </Text>
                    <Button icon="cloud-upload" mode="outlined" onPress={() => navigate('Network')}
                    style={{marginVertical: 16, marginHorizontal: 32}} >Check Upload Settings</Button>
                </View>
            </Card.Content>

            <Divider style={{marginVertical: 8}} />

            <Chip
            style={{margin: 8, padding: 8}}
            icon="cloud-alert" onPress={() => console.log('Pressed')}>
                API Fetch Error
            </Chip>

            <Text variant="labelLarge" style={{textAlign: 'center', padding: 8}}>
                All location packages are saved into the database. If there is a fetch error, you can sync packages later.
            </Text>


            <Button icon="database-outline" mode="contained" onPress={() => navigate('Packages')}
            loading={location.locationUpdates} disabled={location.locationUpdates}
            style={{marginVertical: 16, marginHorizontal: 32}} >Check Package Database</Button>

        </Card>
    </ScrollView>
    </>);
}

