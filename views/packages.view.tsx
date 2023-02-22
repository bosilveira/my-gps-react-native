// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';
import { Appbar, Divider, Button, SegmentedButtons, Card, Switch, Avatar, List } from 'react-native-paper';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Packages'>;

// redux
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store.redux';
import { countDatabasePackagesThunk, paginatePackagesThunk, setType } from '../redux/database.slice';
import { startLocationUpdatesThunk, stopLocationUpdatesThunk } from '../redux/location.slice';

// components
import PackageList from '../components/packageList';

export default function PackagesView({ navigation }: Props) {

    // Redux state
    const dispatch = useDispatch<AppDispatch>();
    const database = useSelector((state: RootState) => state.database);
    const locationData = useSelector((state: RootState) => state.location);

    // Pagination controller
    React.useEffect(()=>{
        dispatch(countDatabasePackagesThunk());
        //dispatch(paginatePackagesThunk({page: 0, type: database.type}))
    },[])

    // Location tracking switch controller
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => {
        if (isSwitchOn) {
            dispatch(stopLocationUpdatesThunk());
        } else {
            dispatch(startLocationUpdatesThunk());
        }
        setIsSwitchOn(!isSwitchOn);
    }

  return (<>

    <StatusBar 
    animated={true}
    translucent={true}
    backgroundColor="#CCCCFF"
    />
    
    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title={"Package Sync"} />
        <Appbar.Action icon="sync" onPress={() => {}} />
    </Appbar.Header>


    <View style={{paddingVertical: 8, paddingHorizontal: 12}}>
      <SegmentedButtons
        value={database.type}
        onValueChange={(value)=>dispatch(paginatePackagesThunk({page: 0, type: value}))}
        buttons={[
            {
                value: '@SENT',
                label: 'Sent ' + database.sent
            },
            {
                value: '@PEND',
                label: 'Pending ' + database.pending,
            },
        ]}
      />
    </View>

    <PackageList/>

    </>);
}