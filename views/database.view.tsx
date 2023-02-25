// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Snackbar, Button, Text, TextInput, Divider, List, RadioButton, Switch } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Database'>;

// redux
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store.redux';
import { setAPIAddress, setAPITimeout, setAPIAutoUpload } from '../redux/network.slice';
import { setItemsPerPage } from '../redux/database.slice';

// utils
import { apiCheckConnection } from '../utils/api.utils';

export default function DatabaseView({ navigation }: Props) {
  
    // Redux
    const network = useSelector((state: RootState) => state.network);
    const database = useSelector((state: RootState) => state.database);
    const dispatch = useDispatch<AppDispatch>();

    // API Address checking: show snackbar (bottom message) and text
    // Snackbar controllers    
    const [connectionTest, setConnectionTest] = React.useState('');
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const apiCheckHandler = async () => {
        setConnectionTest('Verifying connection');
        setSnackbarVisible(true);
        setTimeout(async () => {
            const result = await apiCheckConnection(network.address + '/points/', network.timeout);
            if (result) {
                setConnectionTest('API is Connected!');
            } else {
                setConnectionTest('Could not connect to API!');
            }
        }, 1000);
    }

    return (<>
    
    <StatusBar 
    animated={true}
    translucent={true}
    backgroundColor="#CCCCFF"
    />

    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Database Settings" />
        <Appbar.Action icon="database-outline"/>
    </Appbar.Header>

    <Snackbar
    elevation={5}
    visible={snackbarVisible}
    onDismiss={()=>{}}>
        {connectionTest}
    </Snackbar>

    <ScrollView>
        <View>
            <Text variant="labelLarge" style={{textAlign: 'center', marginTop: 16}}>Automatically Upload Packages to Server</Text>
            <Text
            style={{textAlign: 'center', marginVertical: 4, marginHorizontal: 12}}
            >
            App will follow Location Service state (or not).
        </Text>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 4}}>
                <Text variant="bodyLarge" >Auto Upload is {network.autoUpload ? "ON" : "OFF"}</Text>
                <Switch value={network.autoUpload} onValueChange={()=>{dispatch(setAPIAutoUpload(!network.autoUpload))}}/>
            </View>
        </View>
        <Divider style={{marginVertical: 8}} />
        <Text variant="labelLarge" style={{textAlign: 'center', marginTop: 8}}>Set Remote API Address</Text>
        <Text
        style={{textAlign: 'center', marginVertical: 4, marginHorizontal: 12}}
        >
            Enter the API address of a reliable external service to send and retrieve data.
        </Text>

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

        <Text variant="labelLarge" style={{textAlign: 'center', marginTop: 8}}>
            Items Per Page
        </Text>
        <Text
        style={{textAlign: 'center', marginVertical: 4, marginHorizontal: 12}}
        >
            Set the number o packages displayed per page.
        </Text>

        <List.Section
        style={{marginVertical: 4, marginHorizontal: 12}}
        >
            <List.Accordion
                title={"Items per Page: " + database.itemsPerPage.toString() + " packages"}
                left={props => <List.Icon {...props} icon="view-list" />}>
                <RadioButton.Group onValueChange={value => dispatch(setItemsPerPage(parseInt(value)))} value={database.itemsPerPage.toString()}>
                <RadioButton.Item label="4 packages" value="4" />
                <RadioButton.Item label="6 packages" value="6" />
                <RadioButton.Item label="8 packages" value="8" />
                <RadioButton.Item label="10 packages" value="10" />
                <RadioButton.Item label="20 packages" value="20" />
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
    
    </>);
}