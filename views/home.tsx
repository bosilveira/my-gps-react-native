import * as React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Appbar, Button, Card, Avatar, Text, Divider, List, RadioButton } from 'react-native-paper';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import { Switch } from 'react-native-paper';


import { Menu, Modal, Portal, Provider } from 'react-native-paper';

import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { checkAddress } from '../redux/api.slice';
import { checkForegroundPermission, checkBackgroundPermission, watchPosition } from '../redux/location.slice';

import { getAllKeys, timedGetAllKeys, testStorage, testStorageCalls } from '../utils/asyncStorage';

import StorageTest from '../components/storageTest';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomePage({ navigation }: Props) {

    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const dispatch = useDispatch<AppDispatch>();
    const apiData = useSelector((state: RootState) => state.api);
    const locationData = useSelector((state: RootState) => state.location);

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    const [service, setService] = React.useState('1 second');

    const [refreshing, setRefreshing] = React.useState(false);
    const [opacity, setOpacity] = React.useState(1);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setOpacity(.2)
      setTimeout(() => {
        setRefreshing(false);
        setOpacity(1)
        console.log("refreshing")
      }, 2000);
    }, []);

    return (
    <>
    <StatusBar 
    animated={true}
    translucent={true}
    backgroundColor="#CCCCFF"/>
    <Provider>
        <Appbar.Header>
            <Appbar.Action icon="home" onPress={showModal} />
            <Appbar.Content title="My GPS" />
            <Appbar.Action icon="help-circle-outline" onPress={() => navigation.navigate('Help')} />
            <Appbar.Action icon="dots-vertical" onPress={showModal} />
        </Appbar.Header>

        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{backgroundColor: 'white', margin: 24, padding: 24}}>
            <Button icon="sync" mode="contained" onPress={() => navigation.navigate('Network')} style={{marginVertical: 4}}>Packages</Button>
            <Button icon="broadcast" mode="contained" onPress={() => navigation.push('Location')} style={{marginVertical: 4}}>Location</Button>
            <Button icon="link" mode="contained" onPress={() => navigation.navigate('Address')} style={{marginVertical: 4}} >Network</Button>
            <Button icon="security" mode="contained" onPress={() => navigation.navigate('Security')} style={{marginVertical: 4}}>Security</Button>
            <Button icon="information-outline" mode="contained" onPress={() => navigation.navigate('Disclaimer')} style={{marginVertical: 4}}>Disclaimer</Button>
            <Button icon="help-circle-outline" mode="contained" onPress={() => navigation.navigate('Help')} style={{marginVertical: 4}}>Help</Button>
            </Modal>
        </Portal>

        <ScrollView 
        style={{opacity}}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
    <Card
    style={{margin: 8}}
    >
        <Card.Title
        title="GPS Tracking and Network"
        subtitle="Service is ACTIVE"
        right={() => <Switch value={isSwitchOn} onValueChange={onToggleSwitch}/>}
        left={(props) => <Avatar.Icon {...props} icon="car-connected" />}
        />
        <Card.Content>

            <List.Section>
                <List.Item
                title="Location Broadcast"
                description={()=><>
                <Text>Address: {apiData.address}</Text>
                <Button icon="link" mode="contained" onPress={() => navigation.navigate('Address')} style={{marginVertical: 8}} >Connection</Button>
                </>}
                />

                <List.Accordion
                title={"Sampling rate: " + service}
                left={props => <List.Icon {...props} icon="timer-outline" />}>
                <RadioButton.Group onValueChange={value => setService(value)} value={service}>
                    <RadioButton.Item label="1 second" value="1s" />
                    <RadioButton.Item label="3 seconds" value="3s" />
                    <RadioButton.Item label="5 seconds" value="5s" />
                    <RadioButton.Item label="10 seconds" value="10s" />
                </RadioButton.Group>
                </List.Accordion>

            <List.Item
                title="Package Uploading"
                description={()=><>
                <Text>Uploads: {10}, Pending: 5</Text>
                <Button icon="package" mode="contained" onPress={() => navigation.navigate('Address')} style={{marginVertical: 8}} >Check Packages</Button>
            </>}
            />

            </List.Section>

        <StorageTest />

        <Button icon="package" mode="contained" onPress={() => dispatch(checkBackgroundPermission())} style={{marginVertical: 8}} >Permission</Button>
        <Button icon="package" mode="contained" onPress={() => dispatch(watchPosition())} style={{marginVertical: 8}} >Watch</Button>

        <Button icon="package" mode="contained" onPress={() => testStorageCalls(10)} style={{marginVertical: 8}} >Test Storage</Button>


        <Text>Permission: {locationData.backgroundPermission.toString()}</Text>

        </Card.Content>

        <ProgressBar animatedValue={0.1} style={{marginHorizontal: 12, marginVertical: 12}}/>
    </Card>
    </ScrollView>


    </Provider>
    </>
    );
}