// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';
import { Appbar, Divider, Button, List, ActivityIndicator, RadioButton, Chip } from 'react-native-paper';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import type { LocationPackage } from '../types/locationPackage.type';
import { LocationPackageStatus } from '../types/locationPackage.type';
import * as Battery from 'expo-battery';
type Props = NativeStackScreenProps<RootStackParamList, 'SinglePackage'>;

// redux
import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';

// utils
import { getLocationPackage } from '../utils/asyncStorage';
import { millisecondsToTime } from '../utils/location.utils';

export default function SinglePackageView({ route, navigation }: Props) {

    const { packageId } = route.params;

    const locationData = useSelector((state: RootState) => state.location);
    const database = useSelector((state: RootState) => state.database);
    const dispatch = useDispatch<AppDispatch>();

    const [loading, setLoading] = React.useState(false);
    const [opacity, setOpacity] = React.useState(1);
    const [packageData, setPackageData] = React.useState({
        id: '',
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
            batteryState: Battery.BatteryState.UNKNOWN,
            lowPowerMode: false,
        },
        status: LocationPackageStatus.PEND
    } as LocationPackage);

  const getPackage = React.useCallback(async () => {
      setLoading(true);
      setOpacity(.4)
      if (packageId) {
          const packageInfo = await getLocationPackage(packageId);
          setPackageData(packageInfo)
      }
      setLoading(false);
      setOpacity(1)
    }, [])
    
    React.useEffect(() => {
      getPackage()
        .catch(console.error);;
    }, [getPackage])


    return (<>

    <StatusBar 
    animated={true}
    translucent={true}
    backgroundColor="#CCCCFF"
    />
    
    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Package Info" />
        <Appbar.Action icon="crosshairs-gps"/>
    </Appbar.Header>

    <ScrollView>
        {loading && <ActivityIndicator size={32} animating={true} style={{marginTop: 32}}/>} 
        {!loading && 
        <>
        <Chip
        style={{padding: 8}}
        icon="information">Package: {packageData.id}
        </Chip>

        <List.Section
        style={{marginVertical: 16, marginHorizontal: 16}}
        >

            <List.Item
            title="Status"
            style={{marginVertical: 0}}
            description={()=><Text variant="bodyLarge">{packageData.status}</Text>}
            left={props => <List.Icon {...props} icon="sync" />}
            />

            <List.Item
            title="Timestamp"
            style={{marginVertical: 0}}
            description={()=> packageData ? <Text variant="bodyLarge">{millisecondsToTime(packageData.location.timestamp)}</Text> : null}
            left={props => <List.Icon {...props} icon="update" />}
            />

            <List.Item
            title="Latitude"
            description={()=> packageData ? <Text variant="bodyLarge">{packageData.location.coords.latitude}</Text> : null}
            left={props => <List.Icon {...props} icon="latitude" />}
            />

            <List.Item
            title="Longitude"
            description={()=> packageData ? <Text variant="bodyLarge">{packageData.location.coords.longitude}</Text> : null}
            left={props => <List.Icon {...props} icon="longitude" />}
            />

            <List.Item
            title="Speed"
            description={()=> packageData ? <Text variant="bodyLarge">{packageData.location.coords.speed}</Text> : null}
            left={props => <List.Icon {...props} icon="speedometer" />}
            />

            <List.Item
            title="Accuracy"
            description={()=> packageData ? <Text variant="bodyLarge">{packageData.location.coords.accuracy}</Text> : null}
            left={props => <List.Icon {...props} icon="crosshairs-gps" />}
            />

            <List.Item
            title="Altitude"
            description={()=> packageData ? <Text variant="bodyLarge">{packageData.location.coords.altitude}</Text> : null}
            left={props => <List.Icon {...props} icon="altimeter" />}
            />

            <List.Item
            title="Compass"
            description={()=> packageData ? <Text variant="bodyLarge">{packageData.location.coords.heading}</Text> : null}
            left={props => <List.Icon {...props} icon="compass" />}
            />

            <List.Item
            title="Battery Level"
            description={()=> packageData ? <Text variant="bodyLarge">{(packageData.power.batteryLevel * 100).toFixed(0) + '%'}</Text> : null}
            left={props => <List.Icon {...props} icon="battery-medium" />}
            />

            <List.Item
            title="Battery State"
            description={()=> packageData ? <Text variant="bodyLarge">{["Unknown", "Unplugged", "Charging", "Full"][packageData.power.batteryState]}</Text> : null}
            left={props => <List.Icon {...props} icon="battery-charging" />}
            />

        </List.Section>

        <Divider style={{marginVertical: 8}} horizontalInset={true}/>

        <Text
        style={{textAlign: 'center', marginVertical: 8, marginHorizontal: 12}}
        >
            If you're using a location tracking service, it's important to check how much battery is being used.
            You can use the timeseries of the location tracking to verify the battery levels and see how much stress the location service is putting on your hardware.
            This will help you ensure that the service is using the battery efficiently and that it isn't draining it too quickly.
        </Text>

        </>}

    </ScrollView>

    </>);
}