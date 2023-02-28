// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Divider, Chip, ToggleButton } from 'react-native-paper';

// types
import type { NetworkState } from '../../types/networkState.type';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store.redux';
import { setAPIAutoUpload } from '../../redux/network.slice';

export default function AutoUploadSettings() {
  
    // Redux
    const network = useSelector((state: RootState) => state.network) as NetworkState;
    const dispatch = useDispatch<AppDispatch>();

    return (<>
    <ScrollView
    style={{padding: 16, backgroundColor: 'rgba(245, 245, 245, 1)'}}
    >
        <View>
            <Text variant="titleMedium"
            style={{textAlign: 'center'}}
            >
                Automatically Upload Packages to Server
            </Text>
            <Text
            style={{textAlign: 'center'}}
            >
            Send location packages directly to server while location tracking is activated.
        </Text>

        <Chip
        style={{marginVertical: 8, padding: 8}}
        icon="progress-upload">
            Auto Upload is {network.upload ? "ON" : "OFF"}
        </Chip>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 4}}>
                <Text variant="bodyLarge" >Toggle Auto Upload</Text>
                <ToggleButton
                icon="upload"
                value="upload"
                style={{marginLeft: 8, borderColor: 'rgba(192, 192, 192, 1)', borderWidth: 1}}
                status={network.upload ? "checked" : "unchecked"}
                onPress={()=>{dispatch(setAPIAutoUpload(!network.upload))}}
              />
            </View>
        </View>
        <Divider style={{marginVertical: 8}} />
    </ScrollView>
    </>);
}