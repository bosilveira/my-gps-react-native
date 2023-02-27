// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, Alert } from 'react-native';
import { Button, Card, Avatar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// redux
import { AppDispatch, RootState } from '../../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';

// types
import type { LocationPackage } from '../../types/locationPackage.type';
import { LocationPackageStatus } from '../../types/locationPackage.type';
type Nav = { navigate: (value: string, {}: any) => void }

// utils
import { millisecondsToTime } from '../../utils/location.utils';
import { apiSendPackage } from '../../utils/network.utils';
import { updateLocationPackageStatus } from '../../utils/asyncStorage';

type Props = {
    data: LocationPackage
}

export default function LocationPackageCard( { data }: Props ) {

    const database = useSelector((state: RootState) => state.database);
    const network = useSelector((state: RootState) => state.network);

    const { navigate } = useNavigation<Nav>()

    const [loading, setLoading] = React.useState(false);
    const [status, setStatus] = React.useState(data.status);

    const syncHandler = async () => {
        setLoading(true);
        const result = await apiSendPackage(data.location, data.id, network.address);
        if (result) {
            await updateLocationPackageStatus(data.id, LocationPackageStatus.SENT);
            setStatus(LocationPackageStatus.SENT);
            Alert.alert('Success: Package Uploaded', 'Package ' + data.id, [
                {
                    text: 'Back to Database',
                },
            ]);
        } else {
            Alert.alert('Could Not Sync Package', 'Package ' + data.id, [
                {
                    text: 'Check Network',
                    onPress: () => navigate('Network', {}),
                },
                {
                    text: 'OK'
                },
            ]);
        }
        setLoading(false)
    }

    return (
    <>

    <Card
    style={{marginVertical: 4, marginHorizontal: 8, opacity: database.loading ? 0.4 : 1}}
    >
        <Card.Title
            title={"Package: " + data.id}
            subtitle={"Status: " + status}
            left={(props) => <Avatar.Icon {...props} icon="crosshairs-gps" />}
        />
    
          <Card.Content>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', marginVertical: 2}}>
                <Avatar.Icon size={24} icon="latitude" />
                <Text style={{marginLeft: 8}}>Latitude: {data.location.coords.latitude}</Text>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', marginVertical: 2}}>
                <Avatar.Icon size={24} icon="longitude" />
                <Text style={{marginLeft: 8}}>Longitude {data.location.coords.longitude}</Text>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', marginVertical: 2}}>
                <Avatar.Icon size={24} icon="speedometer" />
                <Text style={{marginLeft: 8}}>Speed {data.location.coords.speed}</Text>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', marginVertical: 2}}>
                <Avatar.Icon size={24} icon="timer-outline" />
                <Text style={{marginLeft: 8}}>Timestamp {millisecondsToTime(data.location.timestamp)}</Text>
            </View>
        </Card.Content>
        <Card.Actions>
            <Button icon="information-outline" mode="outlined"
            onPress={() => navigate( 'SinglePackage', {packageId: data.id}) } 
            >
                Info
            </Button>
            <Button icon="sync" mode="contained" onPress={syncHandler} loading={loading} disabled={status != LocationPackageStatus.PEND}>
                Sync
            </Button>
    </Card.Actions>
    </Card>
    </>
    );
}