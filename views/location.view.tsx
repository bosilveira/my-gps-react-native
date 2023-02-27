// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Appbar, BottomNavigation } from 'react-native-paper';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import type { BottomNavigationProps } from 'react-native-paper';
type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;

// redux
import AccuracySettings from '../components/location/accuracy.settings';
import IntervalSettings from '../components/location/interval.settings';
import PermissionSettings from '../components/location/permission.settings';
import LocationWatcher from '../components/location/location.watcher';

export default function LocationView({ navigation }: Props) {

    // Bottom Navigation controller
    const [ tabNavIndex, setTabNavIndex ] = React.useState(0);
    const [ routes ] = React.useState([
        { key: 'accuracy', title: 'Accuracy', focusedIcon: 'crosshairs-gps' },
        { key: 'interval', title: 'Interval', focusedIcon: 'timer-outline' },
        { key: 'permission', title: 'Permission', focusedIcon: 'incognito' },
        { key: 'test', title: 'Test', focusedIcon: 'radar' },
    ]);
  
    const renderScene: BottomNavigationProps["renderScene"] = ({ route }) => {
        switch (route.key) {
            case 'accuracy':
                return <AccuracySettings/>;
            case 'interval':
                return <IntervalSettings />;
            case 'permission':
                return <PermissionSettings />;
            case 'test':
                return <>{tabNavIndex == 3 && <LocationWatcher/>}</>;
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
        <Appbar.Action icon="car-connected"/>
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