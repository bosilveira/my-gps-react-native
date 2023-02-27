// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Divider, RadioButton, Chip, ToggleButton, IconButton, Tooltip } from 'react-native-paper';

// redux
import { AppDispatch, RootState } from '../../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { setItemsPerPage, setSortingASC, setSortingDESC, setSorting } from '../../redux/database.slice';

// types
import type { DatabaseState } from '../../types/databaseState.type';
import { DatabaseSorting } from "../../types/databaseState.type";

export default function FilterSettings() {

    // Redux
    const database = useSelector((state: RootState) => state.database) as DatabaseState;
    const dispatch = useDispatch<AppDispatch>();

    const [sorting, setSorting] = React.useState('Descending');

    return (<>
    <ScrollView
    style={{padding: 16, backgroundColor: 'rgba(245, 245, 245, 1)'}}
    >

        <Chip
        style={{marginVertical: 8, padding: 8}}
        icon={database.sorting === DatabaseSorting.ASC ? "sort-clock-ascending-outline" : "sort-clock-descending-outline"} >
            {"Package Sorting is : " + database.itemsPerPage.toString() + " packages"}
        </Chip>

        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',marginHorizontal: 32}}>
            <View>
                <Text variant="titleMedium"
                >
                    Package Sorting
                </Text>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4}}>

                <Tooltip title="Ascending">
                    <ToggleButton
                    icon="sort-ascending"
                    value="Ascending"
                    style={{marginLeft: 8, borderColor: 'rgba(192, 192, 192, 1)', borderWidth: 1}}
                    status={sorting === 'Ascending' ? "checked" : "unchecked"}
                    onPress={()=>setSorting('Ascending')}
                    />
                </Tooltip>
                <Tooltip title="Descending">
                    <ToggleButton
                    icon="sort-descending"
                    value="Descending"
                    style={{marginLeft: 8, borderColor: 'rgba(192, 192, 192, 1)', borderWidth: 1}}
                    status={sorting === 'Descending' ? "checked" : "unchecked"}
                    onPress={()=>setSorting('Descending')}
                    />
                </Tooltip>
            </View>
        </View>

        <Divider style={{marginVertical: 8}} />

        <Chip
        style={{marginVertical: 8, padding: 8}}
        icon="set-split" >
            {"Items per Page: " + database.itemsPerPage.toString() + " packages"}
        </Chip>

        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 4, marginHorizontal: 32}}>
            <View>
                <Text variant="titleMedium"
                >
                    Pagination
                </Text>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4}}>

                <Tooltip title="8 items per page">
                    <ToggleButton
                    icon={()=><Text variant="titleMedium">8</Text>}
                    value="Ascending"
                    style={{marginLeft: 8, borderColor: 'rgba(192, 192, 192, 1)', borderWidth: 1}}
                    status={sorting === 'Ascending' ? "checked" : "unchecked"}
                    onPress={()=>setSorting('Ascending')}
                    />
                </Tooltip>
                <Tooltip title="16 items per page">
                    <ToggleButton
                    icon={()=><Text variant="titleMedium">16</Text>}
                    value="Ascending"
                    style={{marginLeft: 8, borderColor: 'rgba(192, 192, 192, 1)', borderWidth: 1}}
                    status={sorting === 'Ascending' ? "checked" : "unchecked"}
                    onPress={()=>setSorting('Ascending')}
                    />
                </Tooltip>
                <Tooltip title="32 items per page">
                    <ToggleButton
                    icon={()=><Text variant="titleMedium">32</Text>}
                    value="Ascending"
                    style={{marginLeft: 8, borderColor: 'rgba(192, 192, 192, 1)', borderWidth: 1}}
                    status={sorting === 'Ascending' ? "checked" : "unchecked"}
                    onPress={()=>setSorting('Ascending')}
                    />
                </Tooltip>
            </View>
        </View>

        <Divider style={{marginVertical: 8}} />


        <Text
        style={{textAlign: 'center'}}
        >
            Location manager accuracy. For low-accuracies the implementation can avoid geolocation providers that consume a significant amount of power (such as GPS).
        </Text>

    </ScrollView>
    </>);
}