// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Snackbar, Button, Text, TextInput, Divider, List, RadioButton, Switch, BottomNavigation, Provider, ProgressBar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import type { BottomNavigationProps } from 'react-native-paper';
type Props = NativeStackScreenProps<RootStackParamList, 'Database'>;

// redux
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store.redux';
import { setAPIAddress, setAPITimeout, setAPIAutoUpload } from '../redux/network.slice';
import { setItemsPerPage } from '../redux/database.slice';

// utils
import PaginationSettings from '../components/database/pagination.settings';
import SortingSettings from '../components/database/sorting.settings';

export default function DatabaseView({ navigation }: Props) {
  
    // Redux
    const network = useSelector((state: RootState) => state.network);
    const database = useSelector((state: RootState) => state.database);
    const dispatch = useDispatch<AppDispatch>();

    const [ tabNavIndex, setTabNavIndex ] = React.useState(0);
    const [ routes ] = React.useState([
        { key: 'sorting', title: 'Sorting', focusedIcon: 'sort' },
        { key: 'pagination', title: 'Pagination', focusedIcon: 'file-table-outline' },
        { key: 'export', title: 'Export', focusedIcon: 'export' },
        { key: 'filter', title: 'Filter', focusedIcon: 'filter' },
        { key: 'query', title: 'Query', focusedIcon: 'database-search-outline' },
    ]);

    const renderScene: BottomNavigationProps["renderScene"] = ({ route }) => {
        switch (route.key) {
            case 'pagination':
                return <PaginationSettings />;
            case 'sorting':
                return <SortingSettings />;
        }
    }

    return (<>
    <Provider>
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

        <BottomNavigation
            sceneAnimationEnabled={true}
            sceneAnimationType="shifting"
            navigationState={{ index: tabNavIndex, routes }}
            onIndexChange={setTabNavIndex}
            renderScene={renderScene}
        />

        </Provider>     
    </>);
}