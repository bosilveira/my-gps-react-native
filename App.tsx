import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';

import { Provider } from 'react-redux';
import { store } from './redux/store.redux';

import DisclaimerPage from './views/disclaimer.view';
import HelpPage from './views/help.view';
import HomePage from './views/home.view';
import LocationView from './views/location.view';
import WatchView from './views/watch.view';
import NetworkView from './views/network.view';
import SecurityPage from './views/security';
import SinglePackageView from './views/package.view';

export type RootStackParamList = {
    Home: undefined,
    Packages: undefined,
    SinglePackage: { packageId: string },
    Database: undefined,
    Sync: undefined,
    Location: undefined,
    Watch: undefined,
    Network: undefined,
    Security: undefined,
    Disclaimer: undefined,
    Help: undefined,
}

export type BottomTabParamList = {
    DatabaseTab: undefined;
    LocationTab: undefined;
    UploadingTab: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
    <Provider store={store}>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }}/>
                <Stack.Screen name="SinglePackage" component={SinglePackageView} options={{ headerShown: false }}/>
                <Stack.Screen name="Location" component={LocationView} options={{ headerShown: false }}/>
                <Stack.Screen name="Watch" component={WatchView} options={{ headerShown: false }}/>
                <Stack.Screen name="Network" component={NetworkView} options={{ headerShown: false }}/>
                <Stack.Screen name="Security" component={SecurityPage} options={{ headerShown: false }}/>
                <Stack.Screen name="Disclaimer" component={DisclaimerPage} options={{ headerShown: false }}/>
                <Stack.Screen name="Help" component={HelpPage} options={{ headerShown: false }}/>
            </Stack.Navigator>
        </NavigationContainer>
    </Provider>
    );
}

