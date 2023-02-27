// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Divider, RadioButton, Chip, ToggleButton } from 'react-native-paper';

// redux
import { AppDispatch, RootState } from '../../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { setItemsPerPage } from '../../redux/database.slice';

// types
import type { DatabaseState } from '../../types/databaseState.type';

export default function PaginationSettings() {

    // Redux
    const database = useSelector((state: RootState) => state.database) as DatabaseState;
    const dispatch = useDispatch<AppDispatch>();

    const [sorting, setSorting] = React.useState('Descending');

    return (<>
    <ScrollView
    style={{padding: 16, backgroundColor: 'rgba(245, 245, 245, 1)'}}
    >

        <Text variant="titleMedium"
        style={{textAlign: 'center'}}
        >
            Items Per Page
        </Text>
        <Text
        style={{textAlign: 'center'}}
        >
            Set the number o packages displayed per page.
        </Text>

        <Chip
        style={{marginVertical: 8, padding: 8}}
        icon="set-split" >
            {"Items per Page: " + database.itemsPerPage.toString() + " packages"}
        </Chip>

        <RadioButton.Group onValueChange={value => dispatch(setItemsPerPage(parseInt(value)))} value={database.itemsPerPage.toString()}>
            <RadioButton.Item label="4 packages" value="4" />
            <RadioButton.Item label="8 packages" value="8" />
            <RadioButton.Item label="12 packages" value="12" />
            <RadioButton.Item label="24 packages" value="24" />
        </RadioButton.Group>

        <Divider style={{marginVertical: 8}} />

        <Text
        style={{textAlign: 'center'}}
        >
            Location manager accuracy. For low-accuracies the implementation can avoid geolocation providers that consume a significant amount of power (such as GPS).
        </Text>

    </ScrollView>
    </>);
}