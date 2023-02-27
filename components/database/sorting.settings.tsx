// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Divider, RadioButton, Chip, ToggleButton } from 'react-native-paper';

// redux
import { AppDispatch, RootState } from '../../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { setItemsPerPage } from '../../redux/database.slice';

// types
import type { DatabaseState } from '../../redux/database.slice';

export default function SortingSettings() {

    // Redux
    const database = useSelector((state: RootState) => state.database) as DatabaseState;
    const dispatch = useDispatch<AppDispatch>();

    const [sorting, setSorting] = React.useState('Descending');

    return (<>
    <ScrollView
    style={{padding: 16, backgroundColor: 'rgba(245, 245, 245, 1)'}}
    >

    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4}}>
        <View>
            <Text variant="titleMedium"
            >
                Package Sorting
            </Text>
            <Text
            >
            Set package sorting order
            </Text>
        </View>

        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4}}>
            <ToggleButton
            icon="sort-ascending"
            value="Ascending"
            style={{marginLeft: 8, borderColor: 'rgba(192, 192, 192, 1)', borderWidth: 1}}
            status={sorting === 'Ascending' ? "checked" : "unchecked"}
            onPress={()=>setSorting('Ascending')}
            />
            <ToggleButton
            icon="sort-descending"
            value="Descending"
            style={{marginLeft: 8, borderColor: 'rgba(192, 192, 192, 1)', borderWidth: 1}}
            status={sorting === 'Descending' ? "checked" : "unchecked"}
            onPress={()=>setSorting('Descending')}
            />
        </View>
    </View>

        <Chip
        style={{marginVertical: 8, padding: 8}}
        icon="sort">
            Package Sorting is {sorting}
        </Chip>

        <Divider style={{marginVertical: 8}} />

    </ScrollView>
    </>);
}