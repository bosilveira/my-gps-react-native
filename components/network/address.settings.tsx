// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, TextInput, Chip } from 'react-native-paper';

// types
import type { NetworkState } from '../../redux/network.slice';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store.redux';
import { setAPIAddress } from '../../redux/network.slice';

export default function AddressSettings() {
  
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
            Set Remote API Address
        </Text>
        <Text
        style={{textAlign: 'center'}}
        >
            Enter the API address of a reliable external service to send and retrieve data.
        </Text>

        <Chip
        style={{marginVertical: 8, padding: 8}}
        icon="link">
            Base URL is {network.address}
        </Chip>

        <TextInput
        mode="outlined"
        label="API Address"
        placeholder="http://192.168.0.1:8081"
        value={network.address}
        onChangeText={text => dispatch(setAPIAddress(text))}
        right={<TextInput.Icon icon="link" />}
        style={{marginVertical: 8, marginHorizontal: 12}}
        />
    </ScrollView>
    </>);
}