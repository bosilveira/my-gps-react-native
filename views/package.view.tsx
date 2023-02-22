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

// utils
import { watchPosition } from '../utils/location.utils';

export default function SinglePackageView({ route, navigation }: Props) {

      /* 2. Get the param */
  const { packageId } = route.params;

    const locationData = useSelector((state: RootState) => state.location);
    const dispatch = useDispatch<AppDispatch>();

    const millisecondsToTime = (ms: number)=> {
        let date = new Date();
        date.setTime(ms);
        return date.toTimeString() 
    }

    React.useEffect(()=>{
        if (locationData.watchPosition) {
            const watcher = watchPosition(locationData.accuracy)
            return () => {
                watcher.then((subscription)=>subscription.remove())
            }
        }
    },[locationData.watchPosition])

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
                description={packageId}
                left={props => <List.Icon {...props} icon="tag" />}
                />

                <List.Item
                title="Timestamp"
                description={()=> locationData.watchPosition ? <Text>{millisecondsToTime(locationData.location.timestamp)}</Text> : null}
                left={props => <List.Icon {...props} icon="update" />}
                />

                <List.Item
                title="Latitude"
                description={()=> locationData.watchPosition ? <Text>{locationData.location.coords.latitude}</Text> : null}
                left={props => <List.Icon {...props} icon="latitude" />}
                />

                <List.Item
                title="Longitude"
                description={()=> locationData.watchPosition ? <Text>{locationData.location.coords.longitude}</Text> : null}
                left={props => <List.Icon {...props} icon="longitude" />}
                />

                <List.Item
                title="Altitude"
                description={()=> locationData.watchPosition ? <Text>{locationData.location.coords.altitude}</Text> : null}
                left={props => <List.Icon {...props} icon="altimeter" />}
                />

                <List.Item
                title="Speed"
                description={()=> locationData.watchPosition ? <Text>{locationData.location.coords.speed}</Text> : null}
                left={props => <List.Icon {...props} icon="speedometer" />}
                />

                <List.Item
                title="Compass"
                description={()=> locationData.watchPosition ? <Text>{locationData.location.coords.heading}</Text> : null}
                left={props => <List.Icon {...props} icon="compass" />}
                />

                <List.Item
                title="Accuracy"
                description={()=> locationData.watchPosition ? <Text>{locationData.location.coords.accuracy}</Text> : null}
                left={props => <List.Icon {...props} icon="crosshairs-gps" />}
                />

        </List.Section>

    </ScrollView>

    </>);
}