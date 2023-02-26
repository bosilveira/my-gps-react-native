// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Appbar, ProgressBar, Provider, BottomNavigation } from 'react-native-paper';

// redux
import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, BottomTabParamList } from '../App';
import type { BottomNavigationProps } from 'react-native-paper';
import type { LocationState } from '../redux/location.slice';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// components
import HomeMenu from '../components/home/home.menu';
import TrackingCard from '../components/home/tracking.card';
import UploadingCard from '../components/home/uploading.card';

export default function HomePage({ navigation }: Props) {

    // Redux
    const location = useSelector((state: RootState) => state.location) as LocationState;

    const [ tabNavIndex, setTabNavIndex ] = React.useState(1);
    const [ routes ] = React.useState([
        { key: 'uploading', title: 'Uploading', focusedIcon: 'cloud-upload-outline' },
        { key: 'tracking', title: 'Tracking', focusedIcon: 'car-connected' },
        { key: 'database', title: 'Database', focusedIcon: 'database-outline' },
    ]);

    const renderScene: BottomNavigationProps["renderScene"] = ({ route }) => {
        switch (route.key) {
            case 'database':
                return <ScrollView style={{backgroundColor: 'rgba(245, 245, 245, 1)'}}>
                </ScrollView>;
            case 'tracking':
                return <TrackingCard />;
            case 'uploading':
                return <UploadingCard />;
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
            <Appbar.Action icon="home" />
            <Appbar.Content title="My GPS" />
            <Appbar.Action icon="help-circle-outline" onPress={() => navigation.navigate('Help')} />
            <HomeMenu />
        </Appbar.Header>
        <ProgressBar progress={0} indeterminate={location.locationUpdates} />

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
