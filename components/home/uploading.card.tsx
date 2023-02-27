// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Card, Avatar, Text, Divider, Chip, ToggleButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// redux
import { AppDispatch, RootState } from '../../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { setAPIAutoUpload } from '../../redux/network.slice';

// types
import type { LocationState } from '../../types/locationState.type';
import type { NetworkState } from '../../types/networkState.type';
import type { DatabaseState } from '../../types/databaseState.type';

import * as Network from 'expo-network';
type Nav = { navigate: (value: string) => void }

// utils
import { checkNetworkConnection } from '../../utils/api.utils';

export default function UploadingCard() {
  
    const { navigate } = useNavigation<Nav>()

    // Redux
    const dispatch = useDispatch<AppDispatch>();
    const location = useSelector((state: RootState) => state.location) as LocationState;
    const network = useSelector((state: RootState) => state.network) as NetworkState;
    const database = useSelector((state: RootState) => state.database) as DatabaseState;

    // Switch component controller: Activate Location Tracking
    const [switchAutoUploadOn, setSwitchAutoUploadOn] = React.useState(network.autoUpload);
    const onToggleSwitchAutoUpload = () => {
        if (network.autoUpload) {
            dispatch(setAPIAutoUpload(false));
            setSwitchAutoUploadOn(false);
        } else {
            dispatch(setAPIAutoUpload(true));
            setSwitchAutoUploadOn(true);
        }
    }

    const [ networkConnection, setNetworkConnection ] = React.useState({ 
        type: Network.NetworkStateType.UNKNOWN,
        isConnected: false,
        isInternetReachable: false
    } as Network.NetworkState);


    React.useEffect(()=>{
        (async ()=>{
            const connection = await checkNetworkConnection();
            setNetworkConnection(connection);
            if (!networkConnection.isConnected || !networkConnection.isInternetReachable ) {
                dispatch(setAPIAutoUpload(false));
            }
        })();

    },[network.autoUpload])

    return (<>
    <ScrollView style={{backgroundColor: 'rgba(245, 245, 245, 1)'}}>
        <Card
        style={{margin: 8}}
        >
            <Card.Title
            title="Auto Uploading"
            subtitleNumberOfLines={0}
            subtitle="Send New Packages to Server"
            right={() => <ToggleButton
                icon={network.autoUpload ? "upload" : "upload-off"}
                value="upload"
                style={{marginRight: 16, borderColor: 'rgba(224, 224, 224, 1)', borderWidth: 1.5}}
                status={switchAutoUploadOn ? "checked" : "unchecked"}
                onPress={onToggleSwitchAutoUpload}
              />}
            left={(props) => <Avatar.Icon {...props} icon="cloud-upload" />}
            />

            <Card.Content>
                <Chip
                style={{ padding: 8}}
                icon="progress-upload">
                    {network.autoUpload ? "Uploading is ON" : "Uploading is OFF"}
                </Chip>
                <Button icon="cloud-upload" mode="outlined" onPress={() => navigate('Network')}
                style={{margin: 8}} >Network Settings</Button>
            </Card.Content>

            <Divider style={{marginVertical: 8}} />

            <Card.Title
            title="Package Syncing"
            subtitle={"Sync " + database.size + " Offline Packages"}
            right={() => <ToggleButton
                icon={network.autoUpload ? "sync" : "sync-off"}
                value="sync"
                style={{marginRight: 16, borderColor: 'rgba(224, 224, 224, 1)', borderWidth: 1.5}}
                status={switchAutoUploadOn ? "checked" : "unchecked"}
                onPress={onToggleSwitchAutoUpload}
              />}
            left={(props) => <Avatar.Icon {...props} icon="progress-upload" />}
            />

            <Card.Content>
                <Chip
                style={{ padding: 8}}
                icon={networkConnection.isConnected ? "check-network-outline" : "close-network-outline"} 
                onPress={() => console.log('Pressed')}>
                    {networkConnection.isConnected && networkConnection.isInternetReachable ? networkConnection.type?.toString() + " is connected" : "Server is not reachable"}
                </Chip>

            </Card.Content>

        </Card>
    </ScrollView>
    </>);
}

