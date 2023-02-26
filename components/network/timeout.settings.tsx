// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, Divider, List, RadioButton, Chip } from 'react-native-paper';

// types
import type { NetworkState } from '../../redux/network.slice';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store.redux';
import { setAPITimeout } from '../../redux/network.slice';

export default function TimeoutSettings() {
  
    // Redux
    const network = useSelector((state: RootState) => state.network) as NetworkState;
    const dispatch = useDispatch<AppDispatch>();

    return (<>
    <ScrollView
    style={{padding: 16, backgroundColor: 'rgba(245, 245, 245, 1)'}}
    >
        <Text variant="titleMedium"
        style={{textAlign: 'center'}}
        >
            Set API Fetching Timeout
        </Text>
        <Text
        style={{textAlign: 'center'}}
        >
            Select the API timeout in milliseconds.
        </Text>

        <Chip
        style={{marginVertical: 8, padding: 8}}
        icon="timer-sand" onPress={() => console.log('Pressed')}>
            {"Default Timeout: " + network.timeout.toString() + " milliseconds"}
        </Chip>

        <RadioButton.Group onValueChange={value => dispatch(setAPITimeout(parseInt(value)))} value={network.timeout.toString()}>
            <RadioButton.Item label="1000 milliseconds (1s)" value="1000" />
            <RadioButton.Item label="2000 milliseconds (2s)" value="2000" />
            <RadioButton.Item label="3000 milliseconds (3s)" value="3000" />
            <RadioButton.Item label="4000 milliseconds (4s)" value="4000" />
            <RadioButton.Item label="4000 milliseconds (4s)" value="5000" />
        </RadioButton.Group>

        <Divider style={{marginVertical: 8}} />

    </ScrollView>
    </>);
}