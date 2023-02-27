// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Switch, Button, Card, Avatar, Text, Divider, ToggleButton, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// redux
import { AppDispatch, RootState } from '../../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { startLocationUpdatesThunk, stopLocationUpdatesThunk, setDeferredUpdatesInterval } from '../../redux/location.slice';

// types
import type { LocationState } from '../../types/locationState.type';
import type { DatabaseState } from '../../types/databaseState.type';

type Nav = { navigate: (value: string) => void }

export default function TrackingCard() {
  
    const { navigate } = useNavigation<Nav>()

    // Redux
    const dispatch = useDispatch<AppDispatch>();
    const location = useSelector((state: RootState) => state.location) as LocationState;
    const database = useSelector((state: RootState) => state.database) as DatabaseState;

    // Switch component controller: Activate Location Tracking
    const [switchLocationOn, setSwitchLocationOn] = React.useState(false);
    const onToggleSwitchLocation = () => {
        if (location.locationUpdates) {
            dispatch(stopLocationUpdatesThunk());
            setSwitchLocationOn(false);
        } else {
            dispatch(startLocationUpdatesThunk());
            setSwitchLocationOn(true);
        }
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
    <ScrollView style={{backgroundColor: 'rgba(245, 245, 245, 1)'}}>
        <Card
        style={{margin: 8}}
        >
            <Card.Title
            title="GPS Tracking"
            subtitle="Location Service"
            right={() => <Switch value={switchLocationOn} onValueChange={()=>onToggleSwitchLocation()} style={{marginRight: 8}} />}
            left={(props) => <Avatar.Icon {...props} icon="car-connected"/>}
            />
            
            <Card.Content>

            <Chip
            style={{ padding: 8}}
            icon={location.locationUpdates ? "map-marker-radius-outline" : "map-marker-off-outline"} onPress={() => console.log('Pressed')}>
                {location.status}
            </Chip>

                <Text variant="labelLarge" style={{textAlign: 'center', width: '100%', marginTop: 8}}>Tracking Interval</Text>
                <View>
                    <ToggleButton.Row
                    style={{display: 'flex', justifyContent: 'center', width: '100%', marginVertical: 8}}
                    onValueChange={value => setDeferredUpdatesIntervalHandler(parseInt(value))} value={location.deferredUpdatesInterval.toString()}
                    >
                        <ToggleButton icon={() => <Text >0s</Text>} value="0" disabled={location.locationUpdates}/>
                        <ToggleButton icon={() => <Text>1s</Text>} value="1000" disabled={location.locationUpdates}/>
                        <ToggleButton icon={() => <Text>3s</Text>} value="3000" disabled={location.locationUpdates}/>
                        <ToggleButton icon={() => <Text>5s</Text>} value="5000" disabled={location.locationUpdates}/>
                        <ToggleButton icon={() => <Text>10s</Text>} value="10000" disabled={location.locationUpdates}/>
                    </ToggleButton.Row>
                    <Button icon="car-connected" mode="outlined" onPress={() => navigate('Location')}
                    disabled={location.locationUpdates}
                    style={{margin: 8}} >Location Settings</Button>
                </View>
                </Card.Content>

                <Divider style={{marginVertical: 8}} />

                <Card.Title
                title="Current GPS Position"
                subtitle="Store Position into Database"
                left={(props) => <Avatar.Icon {...props} icon="map-marker-check"/>}
                />

                <Card.Content>

                <Chip
                style={{ padding: 8}}
                icon="database" onPress={() => console.log('Pressed')}>
                    Total: {database.size} Packages
                </Chip>

                <Button icon="map-marker-check" mode="contained" onPress={() => navigate('Packages')}
                loading={location.locationUpdates} disabled={location.locationUpdates}
                style={{margin: 8}} >Store Current Position</Button>




            </Card.Content>


        </Card>
    </ScrollView>
    </>);
}

