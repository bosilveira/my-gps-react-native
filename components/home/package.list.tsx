// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { Divider, SegmentedButtons, Card, Avatar, ActivityIndicator } from 'react-native-paper';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Packages'>;
import type { DatabaseState } from '../../types/databaseState.type';
import type { LocationState } from '../../types/locationState.type';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store.redux';
import { reloadLocationPackagesThunk, setCurrentPage } from '../../redux/database.slice';

// components
import PackagesMenu from './packages.menu';
import LocationPackageCard from './locationPackage.card';
import { LocationPackage } from '../../types/locationPackage.type';

export default function PackageList() {

    // Redux state
    const dispatch = useDispatch<AppDispatch>();
    const database = useSelector((state: RootState) => state.database) as DatabaseState;

    // Pagination controller
    React.useEffect(()=>{
        dispatch(reloadLocationPackagesThunk())
    },[database.currentPage, database.sorting, database.itemsPerPage])

  return (<>
    <View style={{backgroundColor: 'rgba(245, 245, 245, 1)'}}>

        <Card
        style={{margin: 8}}
        >
            <Card.Title
            title="Location Package Database"
            subtitleNumberOfLines={0}
            subtitle={!database.loading ? `Page ${database.currentPage + 1} of ${database.totalPages + 1} (${database.size} items)` : "Loading Database"}
            right={() => <PackagesMenu/>}
            left={(props) => <Avatar.Icon {...props} icon="database"/>}
            />
            <Card.Content>

                <SegmentedButtons
                value={database.currentPage.toString()}
                density="small"
                onValueChange={(value)=>dispatch(setCurrentPage(parseInt(value)))}
                buttons={[
                    {
                        value: (0).toString(),
                        icon: 'page-first'
                    },
                    {
                        value: (database.currentPage - 1).toString(),
                        icon: 'page-previous-outline'
                    },
                    {
                        value: (database.currentPage + 1).toString(),
                        icon: 'page-next-outline'
                    },
                    {
                        value: (database.totalPages).toString(),
                        icon: 'page-last'
                    },
                ]}
                />

            </Card.Content>

        </Card>

    </View>

    <ScrollView style={{backgroundColor: 'rgba(245, 245, 245, 1)'}}>

        {!database.loading && database.size > 0 && (
        <View>{database.currentPageList.map((item: LocationPackage, index: any)=><LocationPackageCard key={index} data={item}/>)}</View>)}

        <Divider style={{marginVertical: 8}} horizontalInset={true}/>

        <Text style={{textAlign: 'center', padding: 8}}>
            All location packages are saved into the database. If there is a fetch error, you can sync packages later.
        </Text>

        {!database.loading && database.size === 0 && 
                <Avatar.Icon size={92} color={'rgb(192,192,192)'} icon="circle-off-outline" style={{alignSelf: 'center', backgroundColor:"rgba(245, 245, 245, 1)", marginVertical: 64}}/>}
            {database.loading && <ActivityIndicator size={32} animating={true} style={{marginVertical: 64}}/>} 

    </ScrollView>

    </>);
}