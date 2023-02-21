import * as React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';
import { Appbar, Divider, Button } from 'react-native-paper';

import { checkLocationPermission, requestLocationPermission, getPosition } from '../utils/location.utils';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;

export default function LocationPage({ navigation }: Props) {

    const [locationPermission, setLocationPermission] = React.useState({
        foregroundPermissionGranted: false,
        foregroundPermissionCanAskAgain: false,
        backgroundPermissionGranted: false,
        backgroundPermissionCanAskAgain: false,
     });

     const getLocationPermissionHandler = async () => {
        const permission = await checkLocationPermission();
        setLocationPermission(permission);
     }

     const requestlocationPermissionHandler = async () => {
        const permission = await requestLocationPermission();
        setLocationPermission(permission);
     }

     React.useEffect(()=>{
        getLocationPermissionHandler()
     })

  return (
    <>
    <StatusBar 
        animated={true}
        translucent={true}
        backgroundColor="#CCCCFF"/>
    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Location Tracking" />
        <Appbar.Action icon="broadcast" onPress={() => {}} />
    </Appbar.Header>

    <ScrollView>
  
  <Text
    style={{marginVertical: 4, marginTop: 16, marginHorizontal: 12}} >
    Foreground Location Permission {locationPermission.foregroundPermissionGranted.toString()}
  </Text>

  <Text
    style={{marginVertical: 4, marginTop: 16, marginHorizontal: 12}} >
    Foreground Location Can Ask Again? {locationPermission.foregroundPermissionCanAskAgain.toString()}
  </Text>

  <Text
    style={{marginVertical: 4, marginTop: 16, marginHorizontal: 12}} >
    Background Location Permission {locationPermission.backgroundPermissionGranted.toString()}
  </Text>

  <Text
    style={{marginVertical: 4, marginTop: 16, marginHorizontal: 12}} >
    Background Location Can Ask Again? {locationPermission.backgroundPermissionCanAskAgain.toString()}
  </Text>


  <Divider style={{marginVertical: 8}} />

  <Button 
    icon="check-circle-outline" 
    mode="contained" 
    onPress={requestlocationPermissionHandler}
    style={{marginVertical: 8, marginHorizontal: 32}}
    >
    Request Location Permission
  </Button>

  <Button 
    icon="map-marker" 
    mode="contained" 
    onPress={()=>getPosition()}
    style={{marginVertical: 8, marginHorizontal: 32}}
    >
    Get Position
  </Button>

</ScrollView>



    </>
  );
}