// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';
import { Appbar, Divider, Button, SegmentedButtons, Card, Switch, Avatar, List, Chip, ActivityIndicator } from 'react-native-paper';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Packages'>;
import type { DatabaseState } from '../../types/databaseState.type';
import type { LocationState } from '../../types/locationState.type';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store.redux';
import { countLocationPackagesThunk, paginateLocationPackagesThunk, reloadLocationPackagesThunk } from '../../redux/database.slice';
import { startLocationUpdatesThunk, stopLocationUpdatesThunk } from '../../redux/location.slice';

// components
import PackagesMenu from './packages.menu';
import PackageCard from '../packageCard';


export default function PackageList() {

    // Redux state
    const dispatch = useDispatch<AppDispatch>();
    const database = useSelector((state: RootState) => state.database) as DatabaseState;
    const location = useSelector((state: RootState) => state.location) as LocationState;

    // Pagination controller
    React.useEffect(()=>{
        //dispatch(countLocationPackagesThunk());
        dispatch(reloadLocationPackagesThunk())
    },[database.itemsPerPage])

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

    const pageFirstItem = () => {
        return (database.itemsPerPage * (database.currentPage) + 1).toString();
    }
    const pageLastItem = () => {
        return (database.itemsPerPage * (database.currentPage + 1)).toString();
    }

  return (<>
    <ScrollView style={{backgroundColor: 'rgba(245, 245, 245, 1)'}}>

        <Card
        style={{margin: 8}}
        >
            <Card.Title
            title="Location Package Database"
            subtitle={!database.loading ? 'Packages ' + pageFirstItem() + '-' + pageLastItem() + ' of '  + (database.size).toString() : "Updating Database"}
            right={() => <PackagesMenu/>}
            left={(props) => <Avatar.Icon {...props} icon="database"/>}
            />
            
            <Card.Content>

                <SegmentedButtons
                value={database.currentPage.toString()}
                density="small"
                onValueChange={(value)=>dispatch(paginateLocationPackagesThunk({page: parseInt(value), itemsPerPage: database.itemsPerPage}))}
                buttons={[
                    {
                        value: (database.currentPage - 1).toString(),
                        icon: 'page-first'
                    },
                    {
                        value: (database.currentPage - 1).toString(),
                        icon: 'page-previous-outline'
                    },
                    {
                        value: (database.currentPage - 1).toString(),
                        icon: 'page-next-outline'
                    },
                    {
                        value: (database.currentPage - 1).toString(),
                        icon: 'page-last'
                    },
                ]}
                />

            </Card.Content>

        </Card>

        <View>
            {false && !database.loading && database.size > 0 && database.currentPageList.map((item: any, index: any)=><PackageCard key={item} packageId={item}/>)}
            {database.loading && <ActivityIndicator size={32} animating={true} style={{marginTop: 32}}/>} 

        </View>

    </ScrollView>

    </>);
}