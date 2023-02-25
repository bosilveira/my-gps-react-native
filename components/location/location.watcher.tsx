// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text, Appbar, Divider, Button, List, RadioButton, BottomNavigation, Chip } from 'react-native-paper';
import * as Battery from 'expo-battery';
import { BatteryState } from 'expo-battery/build/Battery.types';

// redux
import { AppDispatch, RootState } from '../../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { setDeferredUpdatesInterval  } from '../../redux/location.slice';

export default function LocationWatcher() {

    // Redux
    const location = useSelector((state: RootState) => state.location);
    const dispatch = useDispatch<AppDispatch>();

    // Tracking interval controller
    const setDeferredUpdatesIntervalHandler = async (interval: number) => {
        dispatch(setDeferredUpdatesInterval(interval));
    }

    return (<>
    <ScrollView
    style={{padding: 16, backgroundColor: 'rgba(245, 245, 245, 1)'}}
    >
        <Text variant="titleMedium"
        style={{textAlign: 'center'}}
        >
            Tracking Interval
        </Text>

        <Chip
        style={{marginVertical: 8, padding: 8}}
        icon="timer-outline" onPress={() => console.log('Pressed')}>{"Default Interval: " + location.deferredUpdatesInterval.toString() + "ms"}</Chip>

        <RadioButton.Group onValueChange={value => setDeferredUpdatesIntervalHandler(parseInt(value))} value={location.deferredUpdatesInterval.toString()}>
            <RadioButton.Item label="No interval (0s)" value="0" />
            <RadioButton.Item label="1000 milliseconds (1s)" value="1000" />
            <RadioButton.Item label="3000 milliseconds (3s)" value="3000" />
            <RadioButton.Item label="5000 milliseconds (5s)" value="5000" />
            <RadioButton.Item label="10000 milliseconds (10s)" value="10000" />
        </RadioButton.Group>

        <Divider style={{marginVertical: 8}} />

        <Text
        style={{textAlign: 'center'}}
        >
            Deferred Updates Interval. Minimum time interval in milliseconds that must pass since last reported location before all later locations are reported in a batched update.
        </Text>

    </ScrollView>
    </>);
}