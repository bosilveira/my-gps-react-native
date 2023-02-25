// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import * as Battery from 'expo-battery';
import { View, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Appbar, Button, Card, Avatar, Text, Divider, List, RadioButton, SegmentedButtons, IconButton, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// redux
import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';

// utils
import { getPackageById} from '../utils/asyncStorage';

// types
import { LocationObject } from 'expo-location';
import { BatteryState } from 'expo-battery/build/Battery.types';

type Nav = {
    navigate: (value: string, {}: any) => void;
}
  
interface Package {
    id: string,
    location: {
        coords:
        {
            accuracy: number,
            altitude: number,
            altitudeAccuracy: number,
            heading: number,
            latitude: number,
            longitude: number,
            speed: number
        }, 
        mocked: boolean,
        timestamp: number
    },
    power: {
        batteryLevel: number,
        batteryState: Battery.BatteryState,
        lowPowerMode: boolean,
    },
}

// utils
import { getAllPackages } from '../utils/asyncStorage';
import { millisecondsToTime } from '../utils/location.utils';

interface Props {
    packageId?: string,
}

export default function PackageCard( { packageId }: Props ) {

    const locationData = useSelector((state: RootState) => state.location);
    const database = useSelector((state: RootState) => state.database);
    const network = useSelector((state: RootState) => state.network);
    const dispatch = useDispatch<AppDispatch>();

    const { navigate } = useNavigation<Nav>()

    const [loading, setLoading] = React.useState(false);
    const [opacity, setOpacity] = React.useState(1);
    const [packageData, setPackageData] = React.useState({
        packageId: '',
        location: {
            coords:
            {
                accuracy: 0,
                altitude: 0,
                altitudeAccuracy: 0,
                heading: 0,
                latitude: 0,
                longitude: 0,
                speed: 0
            }, 
            mocked: true,
            timestamp: 0
        },
        power: {
            batteryLevel: 0,
            batteryState: 0,
            batteryLowPowerMode: false
        },
        status: ''
    });

    const getPackage = React.useCallback(async () => {
        setLoading(true);
        setOpacity(.4)
        if (packageId) {
            const packageInfo = await getPackageById(packageId);
            setPackageData(packageInfo)
        }
        setLoading(false);
        setOpacity(1)
      }, [])
      
      React.useEffect(() => {
        getPackage()
          .catch(console.error);;
      }, [getPackage])

    return (
    <>

    <Card
    style={{marginVertical: 4, marginHorizontal: 8, opacity: database.loading ? 0.4 : 1}}
    >
        <Card.Title
            title={"Package: " + packageData.packageId}
            subtitle={"Status: " + packageData.status}
            left={(props) => <Avatar.Icon {...props} icon="crosshairs-gps" />}
        />
    
          <Card.Content>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', marginVertical: 2}}>
                <Avatar.Icon size={24} icon="latitude" />
                <Text style={{marginLeft: 8}}>Latitude: {packageData.location.coords.latitude}</Text>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', marginVertical: 2}}>
                <Avatar.Icon size={24} icon="longitude" />
                <Text style={{marginLeft: 8}}>Longitude {packageData.location.coords.longitude}</Text>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', marginVertical: 2}}>
                <Avatar.Icon size={24} icon="speedometer" />
                <Text style={{marginLeft: 8}}>Speed {packageData.location.coords.speed}</Text>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', marginVertical: 2}}>
                <Avatar.Icon size={24} icon="timer-outline" />
                <Text style={{marginLeft: 8}}>Timestamp {millisecondsToTime(packageData.location.timestamp)}</Text>
            </View>
        </Card.Content>
        <Card.Actions>
            <Button icon="information-outline" mode="outlined"
            onPress={() => navigate( 'SinglePackage', {packageId: packageId}) } 
            >
                Info
            </Button>
            <Button icon="sync" mode="contained" onPress={() => console.log('Pressed')} loading={false} disabled={packageData.status !== 'pending'}>
                Sync
            </Button>
    </Card.Actions>
    </Card>
    </>
    );
}