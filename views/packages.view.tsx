// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';
import { Appbar, Divider, Button, SegmentedButtons, Card, Switch, Avatar, List, Chip, ActivityIndicator, BottomNavigation } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import type { BottomNavigationProps } from 'react-native-paper';
import type { DatabaseState } from '../redux/database.slice';
import type { LocationState } from '../redux/location.slice';
type Props = NativeStackScreenProps<RootStackParamList, 'Packages'>;

// redux
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store.redux';
import { countLocationPackagesThunk, paginateLocationPackagesThunk, reloadLocationPackagesThunk } from '../redux/database.slice';
import { startLocationUpdatesThunk, stopLocationUpdatesThunk } from '../redux/location.slice';

// components
import PackageCard from '../components/packageCard';

export default function PackagesView({ navigation }: Props) {

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

    const [show, setShow] = React.useState(false);
    const [startDateTime, setStartDateTime] = React.useState(new Date());
    const [endDateTime, setEndDate] = React.useState(new Date());


    const [ tabNavIndex, setTabNavIndex ] = React.useState(1);
    const [ routes ] = React.useState([
        { key: 'list', title: 'List', focusedIcon: 'list-status' },
        { key: 'filter', title: 'Filter', focusedIcon: 'filter' },
        { key: 'export', title: 'Export', focusedIcon: 'export' },
        { key: 'database', title: 'Database', focusedIcon: 'database-outline' },
    ]);

    const renderScene: BottomNavigationProps["renderScene"] = ({ route }) => {
        switch (route.key) {
            case 'filter':
                return <ScrollView style={{backgroundColor: 'rgba(245, 245, 245, 1)'}}>
                    {show && <DateTimePicker value={new Date()} mode='date' onChange={(event, selectedDate)=>{console.log(event, selectedDate);setShow(false);}}/>}
                    <Button onPress={()=>setShow(previous=>!previous)}>TimePicker {show.toString()}</Button>
                </ScrollView>;
            case 'list':
                return <>
                <ScrollView>
                    <View>

                        <SegmentedButtons
                        value={database.currentPage.toString()}
                        style={{marginHorizontal: 12, marginVertical: 8}}
                        density="small"
                        onValueChange={(value)=>dispatch(paginateLocationPackagesThunk({page: parseInt(value), itemsPerPage: database.itemsPerPage}))}
                        buttons={[
                            {
                                value: (database.currentPage - 1).toString(),
                                label: 'Previous'
                            },
                            {
                                value: (database.currentPage).toString(),
                                label: !database.loading ? '' + pageFirstItem() + '-' + pageLastItem() + '/'  + (database.size).toString() : (database.size).toString()
                            },
                            {
                                value: (database.currentPage + 1).toString(),
                                label: 'Next'
                            },
                        ]}
                        />
                    </View>

                    <View>
                        {!database.loading && database.size > 0 && database.currentPageList.map((item: any, index: any)=><PackageCard key={item} packageId={item}/>)}
                        {database.loading && <ActivityIndicator size={32} animating={true} style={{marginTop: 32}}/>} 

                    </View>
                </ScrollView>
                </>;
            case 'uploading':
                return <></>;
        }
    }


  return (<>

    <StatusBar 
    animated={true}
    translucent={true}
    backgroundColor="#CCCCFF"
    />
    
    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title={"Packages: " + database.size} />
        <Appbar.Action icon="sync" onPress={() => {}} />
        <Appbar.Action icon="dots-vertical" onPress={()=>{}} />
    </Appbar.Header>

    <BottomNavigation
            sceneAnimationEnabled={true}
            sceneAnimationType="shifting"
            navigationState={{ index: tabNavIndex, routes }}
            onIndexChange={setTabNavIndex}
            renderScene={renderScene}
          />

    </>);
}