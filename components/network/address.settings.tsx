// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView, Alert } from 'react-native';
import { Text, TextInput, Chip, Divider, Button } from 'react-native-paper';

// types
import type { NetworkState } from '../../types/networkState.type';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store.redux';
import { setAPIAddress } from '../../redux/network.slice';

// utils
import { apiCheckConnection } from '../../utils/network.utils';

export default function AddressSettings() {
  
    // Redux
    const network = useSelector((state: RootState) => state.network) as NetworkState;
    const dispatch = useDispatch<AppDispatch>();

    const apiCheckHandler = async () => {
        setLoading(true)
        setTimeout(async () => {
            const result = await apiCheckConnection(network.address + '/points/', network.timeout);
            if (result) {
                Alert.alert('Success: API is Connected', 'Server Response was OK', [
                    {
                        text: 'Back to Settings',
                    },
                ]);
            } else {
                Alert.alert('Could Not Connect', 'Server is Unavailable', [
                    {
                        text: 'Back to Settings',
                    },
                ]);
            }
            setLoading(false);
        }, 1000);
    }
    const [loading, setLoading] = React.useState(false);


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

        <Divider style={{marginVertical: 8}} />

        <Button 
        icon="check-circle-outline" 
        mode="contained" 
        onPress={apiCheckHandler}
        loading={loading}
        style={{marginVertical: 8, marginHorizontal: 32}}
        >
            Check API Connection
        </Button>


    </ScrollView>
    </>);
}