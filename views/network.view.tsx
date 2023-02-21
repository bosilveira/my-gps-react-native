import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native';
import { Appbar, Snackbar, Button, Text, TextInput, Divider, List, RadioButton } from 'react-native-paper';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Network'>;

// redux
import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { setAPIAddress, setAPITimeout } from '../redux/network.slice';
import { apiCheckConnection } from '../utils/api.utils';

export default function NetworkView({ navigation }: Props) {
  
    const networkData = useSelector((state: RootState) => state.network);
    const dispatch = useDispatch<AppDispatch>();

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);

    const apiCheckHandler = async () => {
        const result = await apiCheckConnection(networkData.address + '/points/', networkData.timeout);
        setSuccess(result.success);
        setError(result.error);
    }

    return (
    <>
    <StatusBar 
    animated={true}
    translucent={true}
    backgroundColor="#CCCCFF"
    />

    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="API Connection" />
        <Appbar.Action icon="link"/>
    </Appbar.Header>

    <Snackbar
    elevation={5}
    visible={success}
    onDismiss={()=>{}}>
        API is Connected!
    </Snackbar>

    <Snackbar
    elevation={5}
    visible={error}
    onDismiss={()=>{}}>
        Could not connect to API!
    </Snackbar>

    <ScrollView>
    
        <Text
        style={{marginVertical: 4, marginTop: 16, marginHorizontal: 12}}
        >
            Enter the API address of a reliable external service to send and retrieve data.
        </Text>

        <TextInput
        mode="outlined"
        label="API Address"
        placeholder="http://192.168.1.4:8081"
        value={networkData.address}
        onChangeText={text => dispatch(setAPIAddress(text))}
        right={<TextInput.Icon icon="link" />}
        style={{marginVertical: 8, marginHorizontal: 12}}
        />

        <Divider style={{marginVertical: 8}} />

        <Text
        style={{marginVertical: 4, marginHorizontal: 12}}
        >
            Enter the API timeout in milliseconds.
        </Text>

        <List.Section
        style={{marginVertical: 4, marginHorizontal: 12}}
        >
            <List.Accordion
                title={"Timeout (milliseconds): " + networkData.timeout.toString()}
                left={props => <List.Icon {...props} icon="timer-outline" />}>
                <RadioButton.Group onValueChange={value => dispatch(setAPITimeout(parseInt(value)))} value={networkData.timeout.toString()}>
                <RadioButton.Item label="1000 milliseconds (1s)" value="1000" />
                <RadioButton.Item label="2000 milliseconds (2s)" value="2000" />
                <RadioButton.Item label="3000 milliseconds (3s)" value="3000" />
                <RadioButton.Item label="4000 milliseconds (4s)" value="4000" />
                </RadioButton.Group>
            </List.Accordion>
        </List.Section>

        <Divider style={{marginVertical: 8}} />

        <Button 
        icon="check-circle-outline" 
        mode="contained" 
        onPress={apiCheckHandler}
        style={{marginVertical: 8, marginHorizontal: 32}}
        >
            Check API Connection
        </Button>

    </ScrollView>
    </>
    );
}