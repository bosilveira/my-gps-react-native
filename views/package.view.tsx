// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';
import { Appbar, Divider, Button, List, ActivityIndicator, RadioButton, Chip } from 'react-native-paper';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'SinglePackage'>;

// redux
import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';

// utils
import { getPackageById} from '../utils/asyncStorage';
import { millisecondsToTime } from '../utils/location.utils';

export default function SinglePackageView({ route, navigation }: Props) {

    const { packageId } = route.params;

    const locationData = useSelector((state: RootState) => state.location);
    const database = useSelector((state: RootState) => state.database);
    const dispatch = useDispatch<AppDispatch>();

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


    return (<>

    <StatusBar 
    animated={true}
    translucent={true}
    backgroundColor="#CCCCFF"
    />
    
    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Packages')} />
        <Appbar.Content title="Package Info" />
        <Appbar.Action icon="crosshairs-gps" onPress={() => {}} />
    </Appbar.Header>

    <ScrollView>

        <Chip
        style={{padding: 8, margin: 12}}
        icon="information" onPress={() => console.log('Pressed')}>Total Packages: {database.size}</Chip>



        <List.Section
            style={{marginVertical: 16, marginHorizontal: 16}}
        >

            <Text variant="titleMedium"
            style={{textAlign: 'center', marginHorizontal: 12}}
            >
                Package Information
            </Text>

            <List.Item
            title="Package Id"
            style={{marginVertical: 0}}
            description={()=><Text variant="bodyLarge">{packageData && packageData.packageId}</Text>}
            left={props => <List.Icon {...props} icon="tag" />}
            />
            
            <List.Item
            title="Status"
            style={{marginVertical: 0}}
            description={()=><Text variant="bodyLarge">{packageData && packageData.status}</Text>}
            left={props => <List.Icon {...props} icon="sync" />}
            />

            <Divider style={{marginVertical: 8}} />

            <Text variant="titleMedium"
            style={{textAlign: 'center'}}
            >
                Information Sent to Server
            </Text>
            <Text
            style={{textAlign: 'center', marginVertical: 4, marginHorizontal: 12}}
            >
                If you need to send additional information beyond 'Package Id', 'Timestamp', 'Latitude', and 'Longitude', please contact the developers directly.
                They will be able to help you out.
            </Text>

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

            <Divider style={{marginVertical: 8}} />

            <Text variant="titleMedium"
            style={{textAlign: 'center'}}
            >
                Other Information
            </Text>

            <Text
            style={{textAlign: 'center', marginVertical: 4, marginHorizontal: 12}}
            >
                If you're using a location tracking service, it's important to check how much battery is being used.
                You can use the timeseries of the location tracking to verify the battery levels and see how much stress the location service is putting on your hardware.
                This will help you ensure that the service is using the battery efficiently and that it isn't draining it too quickly.
            </Text>

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
            title="Accuracy"
            description={()=> packageData ? <Text variant="bodyLarge">{packageData.location.coords.accuracy}</Text> : null}
            left={props => <List.Icon {...props} icon="crosshairs-gps" />}
            />


        </List.Section>

    </ScrollView>

    </>);
}