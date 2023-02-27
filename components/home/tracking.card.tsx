// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Switch, Button, Card, Avatar, Text, Divider, ToggleButton, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// redux
import { AppDispatch, RootState } from '../../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { startLocationUpdatesThunk, stopLocationUpdatesThunk, setDeferredUpdatesInterval, getAndStoreCurrentPositionThunk } from '../../redux/location.slice';

// types
import type { LocationState } from '../../types/locationState.type';
import { LocationStateStatus } from '../../types/locationState.type';
import type { DatabaseState } from '../../types/databaseState.type';

type Nav = { navigate: (value: string) => void }

export default function TrackingCard() {
  
    // Navigation
    const { navigate } = useNavigation<Nav>()

    // Redux
    const dispatch = useDispatch<AppDispatch>();
    const location = useSelector((state: RootState) => state.location) as LocationState;
    const database = useSelector((state: RootState) => state.database) as DatabaseState;

    // Location Tracking controller
    const [switchLocationOn, setSwitchLocationOn] = React.useState(false);
    const onToggleSwitchLocation = () => {
        if (location.status !== LocationStateStatus.GETTING) {
            if (location.locationUpdates) {
                dispatch(stopLocationUpdatesThunk());
                setSwitchLocationOn(false);
            } else {
                dispatch(startLocationUpdatesThunk());
                setSwitchLocationOn(true);
            }
        } else {
            setSwitchLocationOn(false);
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
                mode="outlined"
                style={{ padding: 8}}
                icon={location.locationUpdates ? "map-marker-radius-outline" : "map-marker-off-outline"}>
                    {location.status}
                </Chip>
                <Divider style={{marginVertical: 8}} />

                <Chip
                style={{ padding: 8}}
                icon="database" 
                mode="outlined"
                >
                    Total: {database.size} Packages
                </Chip>

                <Text variant="labelLarge" style={{textAlign: 'center', width: '100%', marginTop: 8}}>Tracking Interval</Text>
                <View>
                    <ToggleButton.Row
                    style={{display: 'flex', justifyContent: 'center', width: '100%', marginVertical: 8}}
                    onValueChange={()=>{}} value={location.deferredUpdatesInterval.toString()}
                    >
                        <ToggleButton icon={() => <Text >0s</Text>} value="0" disabled={location.locationUpdates} 
                            onPress={()=>dispatch(setDeferredUpdatesInterval(0))}/>
                        <ToggleButton icon={() => <Text>1s</Text>} value="1000" disabled={location.locationUpdates}
                            onPress={()=>dispatch(setDeferredUpdatesInterval(1000))}/>
                        <ToggleButton icon={() => <Text>3s</Text>} value="3000" disabled={location.locationUpdates}
                            onPress={()=>dispatch(setDeferredUpdatesInterval(3000))}/>
                        <ToggleButton icon={() => <Text>5s</Text>} value="5000" disabled={location.locationUpdates}
                            onPress={()=>dispatch(setDeferredUpdatesInterval(5000))}/>
                        <ToggleButton icon={() => <Text>10s</Text>} value="10000" disabled={location.locationUpdates}
                            onPress={()=>dispatch(setDeferredUpdatesInterval(10000))}/>
                    </ToggleButton.Row>
                    <Button icon="car-connected" mode="outlined" onPress={() => navigate('Location')}
                    disabled={location.locationUpdates}
                    style={{margin: 8}} >Location Settings</Button>
                </View>
            </Card.Content>

            <Divider style={{marginVertical: 8}} bold={true}/>

            <Card.Title
            title="Current GPS Position"
            subtitle="Store Position into Database"
            left={(props) => <Avatar.Icon {...props} icon="map-marker-check"/>}
            />

            <Card.Content>

                <Button icon="map-marker-check" mode="contained" onPress={() => dispatch(getAndStoreCurrentPositionThunk())}
                loading={location.locationUpdates} disabled={location.locationUpdates}
                style={{margin: 8}} >Store Current Position</Button>

            </Card.Content>

        </Card>

        <Divider style={{marginVertical: 8}} horizontalInset={true}/>

        <Text style={{textAlign: 'center', padding: 8}}>
            All location packages are saved into the database. If there is a fetch error, you can sync packages later.
        </Text>

        <Text style={{textAlign: 'center', padding: 8}}>
            Calling "Current Position" causes the location manager to obtain a location fix which may take several seconds.
        </Text>

    </ScrollView>
    </>);
}

