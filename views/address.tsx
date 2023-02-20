import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Appbar, Snackbar } from 'react-native-paper';
import { View, ScrollView } from 'react-native';
import { Button, Card, Avatar, Text, TextInput, Divider } from 'react-native-paper';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Address'>;

import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { checkAddress } from '../redux/api.slice';

export default function AddressPage({ navigation }: Props) {
  
  const apiData = useSelector((state: RootState) => state.api);

  const dispatch = useDispatch<AppDispatch>();
  
  const [ address, setAddress ] = React.useState('192.168.1.4:8081')
  const [ timeout, setTimeout ] = React.useState('4000')

  return (
    <>
    <StatusBar 
        animated={true}
        translucent={true}
        backgroundColor="#61dafb"/>
    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="API Connection" />
        <Appbar.Action icon="link"/>
    </Appbar.Header>

    <Snackbar
        elevation={5}
        visible={apiData.checked && apiData.fetchError == false && apiData.loading == false}
        onDismiss={()=>{}}>
        API is Connected!
    </Snackbar>

    <Snackbar
        elevation={5}
        visible={apiData.checked && apiData.fetchError && apiData.loading == false}
        onDismiss={()=>{}}>
        Could not connect to API!
    </Snackbar>


    <ScrollView>

        <TextInput
        mode="outlined"
        label="API Address"
        placeholder="192.168.1.4:8081"
        value={address}
        onChangeText={text => setAddress(text)}
        right={<TextInput.Icon icon="link" />}
        style={{marginVertical: 8, marginHorizontal: 8}}
        />

        <TextInput
        mode="outlined"
        label="Timeout (milliseconds)"
        placeholder="4000"
        value={timeout}
        onChangeText={text => setTimeout(text)}
        right={<TextInput.Icon icon="timer-outline" />}
        style={{marginVertical: 8, marginHorizontal: 8}}
        />

        <Button 
        icon="check-circle-outline" 
        mode="contained" 
        onPress={() => {
          console.log('Pressed');
          dispatch(checkAddress( { address, timeout }))
        }}
        style={{marginVertical: 16, marginHorizontal: 32}}
        >Check</Button>

        <Divider style={{marginVertical: 8}} />

    </ScrollView>

</>
  );
}