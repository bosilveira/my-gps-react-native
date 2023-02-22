// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';
import { Appbar, Divider, Button, List, ActivityIndicator, RadioButton } from 'react-native-paper';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'SinglePackage'>;

// redux
import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { paginatePackagesThunk } from '../redux/database.slice';

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
            batteryState: 0,
            batteryLowPowerMode: false
        }
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
        <Appbar.Action icon="broadcast" onPress={() => {}} />
    </Appbar.Header>

    <ScrollView>

        <List.Section
            style={{marginVertical: 4, marginHorizontal: 16}}
        >

                <List.Item
                title="Package Id"
                description={packageData && packageData.id}
                left={props => <List.Icon {...props} icon="tag" />}
                />

                <List.Item
                title="Timestamp"
                description={()=> packageData ? <Text>{millisecondsToTime(packageData.location.timestamp)}</Text> : null}
                left={props => <List.Icon {...props} icon="update" />}
                />

                <List.Item
                title="Latitude"
                description={()=> packageData ? <Text>{packageData.location.coords.latitude}</Text> : null}
                left={props => <List.Icon {...props} icon="latitude" />}
                />

                <List.Item
                title="Longitude"
                description={()=> packageData ? <Text>{packageData.location.coords.longitude}</Text> : null}
                left={props => <List.Icon {...props} icon="longitude" />}
                />

                <List.Item
                title="Altitude"
                description={()=> packageData ? <Text>{packageData.location.coords.altitude}</Text> : null}
                left={props => <List.Icon {...props} icon="altimeter" />}
                />

                <List.Item
                title="Speed"
                description={()=> packageData ? <Text>{packageData.location.coords.speed}</Text> : null}
                left={props => <List.Icon {...props} icon="speedometer" />}
                />

                <List.Item
                title="Compass"
                description={()=> packageData ? <Text>{packageData.location.coords.heading}</Text> : null}
                left={props => <List.Icon {...props} icon="compass" />}
                />

                <List.Item
                title="Accuracy"
                description={()=> packageData ? <Text>{packageData.location.coords.accuracy}</Text> : null}
                left={props => <List.Icon {...props} icon="crosshairs-gps" />}
                />

        </List.Section>

    </ScrollView>

    </>);
}