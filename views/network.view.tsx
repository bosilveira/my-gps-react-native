// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { Appbar, BottomNavigation } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import type { BottomNavigationProps } from 'react-native-paper';
type Props = NativeStackScreenProps<RootStackParamList, 'Network'>;

// utils
import AddressSettings from '../components/network/address.settings';
import AutoUploadSettings from '../components/network/autoUpload.settings';
import TimeoutSettings from '../components/network/timeout.settings';
import ReiterationSettings from '../components/network/reiteration.settings';

export default function NetworkView({ navigation }: Props) {
  
    const [ tabNavIndex, setTabNavIndex ] = React.useState(1);
    const [ routes ] = React.useState([
        { key: 'test', title: 'Test', focusedIcon: 'access-point' },
        { key: 'address', title: 'Address', focusedIcon: 'link' },
        { key: 'timeout', title: 'Timeout', focusedIcon: 'timer-sand' },
    ]);
  
    const renderScene: BottomNavigationProps["renderScene"] = ({ route }) => {
        switch (route.key) {
            case 'address':
                return <AddressSettings/>;
            case 'autoupload':
                return <AutoUploadSettings/>;
            case 'timeout':
                return <TimeoutSettings />;
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
        <Appbar.Content title="Network (API) Settings" />
        <Appbar.Action icon="cloud-upload-outline"/>
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