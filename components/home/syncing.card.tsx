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

export default function SyncingCard() {
  
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
            title="Package Syncing"
            subtitle="Sync Offline Packages"
            right={() => <ToggleButton
                icon={network.autoUpload ? "sync" : "sync-off"}
                value="sync"
                style={{marginRight: 8, borderColor: 'rgba(224, 224, 224, 1)', borderWidth: 1.5}}
                status={switchAutoUploadOn ? "checked" : "unchecked"}
                onPress={onToggleSwitchAutoUpload}
              />}
            left={(props) => <Avatar.Icon {...props} icon="package-up" />}
            />

            <Chip
            style={{margin: 8, padding: 8}}
            icon={networkConnection.isConnected ? "check-network-outline" : "close-network-outline"} 
            onPress={() => console.log('Pressed')}>
                {networkConnection.isConnected && networkConnection.isInternetReachable ? networkConnection.type?.toString() + " is connected" : "Server is not reachable"}
            </Chip>
            <Divider style={{marginVertical: 8}} />

            <Card.Content>
            <Chip
            style={{margin: 8, padding: 8}}
            icon="database" onPress={() => console.log('Pressed')}>
                Total: {database.size} Packages
            </Chip>
                    <Button icon="cloud-upload" mode="outlined" onPress={() => navigate('Network')}
                    style={{marginVertical: 16, marginHorizontal: 32}} >Network Settings</Button>
            </Card.Content>

            <Divider style={{marginVertical: 8}} />



            <Text variant="labelLarge" style={{textAlign: 'center', padding: 8}}>
                All location packages are saved into the database. If there is a fetch error, you can sync packages later.
            </Text>

        </Card>
    </ScrollView>
    </>);
}

