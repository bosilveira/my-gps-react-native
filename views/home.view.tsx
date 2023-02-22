// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Switch, Appbar, Button, Card, Avatar, Text, Divider, List, ProgressBar, ToggleButton, Modal, Portal, Provider } from 'react-native-paper';

// redux
import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { startLocationUpdatesThunk, stopLocationUpdatesThunk, setDeferredUpdatesInterval } from '../redux/location.slice';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomePage({ navigation }: Props) {

    // Redux
    const dispatch = useDispatch<AppDispatch>();
    const network = useSelector((state: RootState) => state.network);
    const location = useSelector((state: RootState) => state.location);
    const database = useSelector((state: RootState) => state.database);

    // Modal navigation controllers
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);


    // BACKGROUND (MAIN) LOCATION TRACKING

    // Switch component controller: Activate Location Tracking
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => {
        if (isSwitchOn) {
            dispatch(stopLocationUpdatesThunk());
        } else {
            dispatch(startLocationUpdatesThunk());
        }
        setIsSwitchOn(!isSwitchOn);
    }

    // Time interval toggle controller
    const setDeferredUpdatesIntervalHandler = async (interval: number) => {
        if (isNaN(interval)) {
            dispatch(setDeferredUpdatesInterval(0));
        } else {
            dispatch(setDeferredUpdatesInterval(interval));
        }
    }

    return (<>

    <StatusBar 
    animated={true}
    translucent={true}
    backgroundColor="#CCCCFF"
    />
    
    <Provider>
        <Appbar.Header>
            <Appbar.Action icon="home" onPress={showModal} />
            <Appbar.Content title="My GPS" />
            <Appbar.Action icon="help-circle-outline" onPress={() => navigation.navigate('Help')} />
            <Appbar.Action icon="dots-vertical" onPress={showModal} />
        </Appbar.Header>

        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{backgroundColor: 'white', margin: 24, padding: 24}}>
            <Button icon="sync" mode="contained" onPress={() => navigation.navigate('Packages')} style={{marginVertical: 4}}>Packages</Button>
            <Button icon="broadcast" mode="contained" onPress={() => navigation.push('Location')} style={{marginVertical: 4}}>Location</Button>
            <Button icon="link" mode="contained" onPress={() => navigation.navigate('Network')} style={{marginVertical: 4}} >Network</Button>
            <Button icon="security" mode="contained" onPress={() => navigation.navigate('Security')} style={{marginVertical: 4}}>Security</Button>
            <Button icon="information-outline" mode="contained" onPress={() => navigation.navigate('Disclaimer')} style={{marginVertical: 4}}>Disclaimer</Button>
            <Divider style={{marginVertical: 8}} />
            <Button icon="help-circle-outline" mode="contained" onPress={() => navigation.navigate('Help')} style={{marginVertical: 4}}>Help</Button>
            </Modal>
        </Portal>

        <ScrollView>

            <Card
            style={{margin: 8}}
            >
                <Card.Title
                title="GPS Tracking and Network"
                subtitle={"Service is " + (location.locationUpdates ? 'ON' : 'OFF')}
                right={() => <Switch value={isSwitchOn} onValueChange={onToggleSwitch}/>}
                left={(props) => <Avatar.Icon {...props} icon="car-connected" />}
                />
                <Card.Content>

                    <List.Section>
                        <Divider style={{marginVertical: 8}} />
                        <List.Item
                        title="Tracking Interval"
                        description={()=><>
                            <View>
                                <ToggleButton.Row
                                style={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: 8}}
                                onValueChange={value => setDeferredUpdatesIntervalHandler(parseInt(value))} value={location.deferredUpdatesInterval.toString()}
                                >
                                    <ToggleButton icon={() => <Text >0s</Text>} value="0" />
                                    <ToggleButton icon={() => <Text>1s</Text>} value="1000" />
                                    <ToggleButton icon={() => <Text>3s</Text>} value="3000" />
                                    <ToggleButton icon={() => <Text>5s</Text>} value="5000" />
                                    <ToggleButton icon={() => <Text>10s</Text>} value="10000" />
                                </ToggleButton.Row>
                                <Button icon="package" mode="contained" onPress={() => navigation.navigate('Location')} style={{marginTop: 24}} >Tracking Settings</Button>
                            </View>
                            </>}
                        />
                        <Divider style={{marginVertical: 8}} />
                        <List.Item
                        title="Location Broadcast"
                        description={()=><>
                            <Text>Address: {network.address}</Text>
                            <Button icon="link" mode="contained" onPress={() => navigation.navigate('Network')} style={{marginTop: 24}} >Connection Settings</Button>
                            </>}
                        />
                        <Divider style={{marginVertical: 8}} />
                        <List.Item
                            title="Package Uploading"
                            description={()=><>
                            <Text>Sent: {database.sent}, Pending: {database.pending}</Text>
                            <Button icon="package" mode="contained" onPress={() => navigation.navigate('Packages')} style={{marginTop: 24}} >Check Packages</Button>
                            </>}
                        />
                    </List.Section>

                </Card.Content>

                <ProgressBar animatedValue={(database.sent / (database.sent + database.pending))} style={{marginHorizontal: 12, marginVertical: 12}}/>

            </Card>

        </ScrollView>

    </Provider>

    </>);
}