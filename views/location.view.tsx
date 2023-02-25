// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text, Appbar, Divider, Button, List, RadioButton, BottomNavigation, Chip } from 'react-native-paper';
import * as Battery from 'expo-battery';
import { BatteryState } from 'expo-battery/build/Battery.types';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;
import type { BottomNavigationProps } from 'react-native-paper';
import type { LocationState } from '../redux/location.slice';

// redux
import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import AccuracySettings from '../components/location/accuracy.settings';
import IntervalSettings from '../components/location/interval.settings';
import PermissionSettings from '../components/location/permission.settings';
import LocationWatcher from '../components/location/location.watcher';

export default function LocationView({ navigation }: Props) {

    // Redux
    const location = useSelector((state: RootState) => state.location) as LocationState;
    const dispatch = useDispatch<AppDispatch>();

    const [ tabNavIndex, setTabNavIndex ] = React.useState(1);
    const [ routes ] = React.useState([
        { key: 'testing', title: 'Test', focusedIcon: 'crosshairs-question' },
        { key: 'accuracy', title: 'Accuracy', focusedIcon: 'crosshairs-gps' },
        { key: 'interval', title: 'Interval', focusedIcon: 'timer-outline' },
        { key: 'permission', title: 'Permission', focusedIcon: 'incognito' },
    ]);
  
    const renderScene: BottomNavigationProps["renderScene"] = ({ route }) => {
        switch (route.key) {
            case 'accuracy':
                return <LocationWatcher/>;
            case 'accuracy':
                return <AccuracySettings/>;
            case 'interval':
                return <IntervalSettings />;
            case 'permission':
                return <PermissionSettings />;
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
        <Appbar.Content title="Location Settings" />
        <Appbar.Action icon="car-connected" onPress={() => {}} />
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