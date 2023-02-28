// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Card, Avatar, Text, Divider, Chip, ToggleButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// redux
import { AppDispatch, RootState } from '../../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { setAPIAutoUpload, checkConnectionThunk } from '../../redux/network.slice';

// types
import type { LocationState } from '../../types/locationState.type';
import type { NetworkState } from '../../types/networkState.type';
import type { DatabaseState } from '../../types/databaseState.type';
import { countLocationPackagesThunk } from '../../redux/database.slice';
type Nav = { navigate: (value: string) => void }

export default function UploadingCard() {
  
    const { navigate } = useNavigation<Nav>()

    // Redux
    const dispatch = useDispatch<AppDispatch>();
    const location = useSelector((state: RootState) => state.location) as LocationState;
    const network = useSelector((state: RootState) => state.network) as NetworkState;
    const database = useSelector((state: RootState) => state.database) as DatabaseState;

    React.useEffect(()=>{
        dispatch(checkConnectionThunk());
        if (!network.connection.isConnected || !network.connection.isInternetReachable ) {
            dispatch(setAPIAutoUpload(false));
        }
    },[])

    // Pagination controller
    React.useEffect(()=>{
        dispatch(countLocationPackagesThunk());
    },[])


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
                icon={network.upload ? "upload" : "upload-off"}
                value="upload"
                style={{marginRight: 16, borderColor: 'rgba(224, 224, 224, 1)', borderWidth: 1.5}}
                status={network.upload ? "checked" : "unchecked"}
                onPress={()=>dispatch(setAPIAutoUpload(!network.upload))}
              />}
            left={(props) => <Avatar.Icon {...props} icon="cloud-upload" />}
            />

            <Card.Content>

                <Chip
                mode="outlined"
                style={{ padding: 8}}
                icon="progress-upload">
                    {network.upload ? "Uploading is ON" : "Uploading is OFF"}
                </Chip>

                <Button
                disabled={network.upload && location.locationUpdates}
                icon="cloud-upload" mode="outlined" onPress={() => navigate('Network')}
                style={{margin: 8}} >Network Settings</Button>
                
            </Card.Content>

            <Divider style={{marginVertical: 8}} bold={true}/>

            <Card.Title
            title="Package Syncing"
            subtitle="Network Status"
            left={(props) => <Avatar.Icon {...props} icon="progress-upload" />}
            />

            <Card.Content>

                <Chip
                style={{ padding: 8}}
                icon={network.connection.isConnected ? "check-network-outline" : "close-network-outline"} 
                >
                    {network.connection.isConnected && network.connection.isInternetReachable ? 
                        network.connection.type?.toString() + " is connected" : "Server is not reachable"}
                </Chip>

            </Card.Content>

        </Card>

        <Divider style={{marginVertical: 8}} horizontalInset={true}/>

        <Text style={{textAlign: 'center', padding: 8}}>
            All location packages are saved into the database. If there is a fetch error, you can sync packages later.
        </Text>

    </ScrollView>
    </>);
}

