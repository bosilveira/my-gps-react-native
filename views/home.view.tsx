// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Appbar, ProgressBar, Provider, BottomNavigation } from 'react-native-paper';

// redux
import { AppDispatch, RootState } from '../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, BottomTabParamList } from '../App';
import type { BottomNavigationProps } from 'react-native-paper';
import type { LocationState } from '../types/locationState.type';
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// components
import { HomeMenu } from '../components/home/home.menu';
import TrackingCard from '../components/home/tracking.card';
import UploadingCard from '../components/home/uploading.card';
import MapCard from '../components/home/map.card';
import PackageList from '../components/home/package.list';

export default function HomePage({ navigation }: Props) {

    // Redux
    const location = useSelector((state: RootState) => state.location) as LocationState;

    // Bottom Navigation controller
    const [ tabNavIndex, setTabNavIndex ] = React.useState(0);
    const [ routes ] = React.useState([
        { key: 'tracking', title: 'Tracking', focusedIcon: 'car-connected' },
        { key: 'uploading', title: 'Uploading', focusedIcon: 'cloud-upload-outline' },
        { key: 'database', title: 'Packages', focusedIcon: 'format-list-checks' },
        { key: 'map', title: 'Map', focusedIcon: 'vector-square' },
    ]);

    const renderScene: BottomNavigationProps["renderScene"] = ({ route }) => {
        switch (route.key) {
            case 'tracking':
                return <TrackingCard />;
            case 'uploading':
                return <UploadingCard />;
            case 'database':
                return <>{tabNavIndex == 2 && <PackageList/>}</>;
            case 'map':
                return <>{tabNavIndex == 3 && <MapCard />}</>;
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
