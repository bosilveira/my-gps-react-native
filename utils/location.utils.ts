import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

// redux
import { store } from '../redux/store.redux';
import { setCurrentPosition, setWatchPosition } from '../redux/location.slice';
import { storePackage, countAllPackages } from './asyncStorage';
import { sendPackage } from '../redux/network.slice';

// 1) LOCATION PERMISSIONS

// 1.1) Check all location permissions and returns a boolean
export const checkLocationPermissions = async (): Promise<boolean> => {
    const foregroundPermission = await Location.getForegroundPermissionsAsync();
    const backgroundPermission = await Location.getBackgroundPermissionsAsync();
    return (foregroundPermission.granted &&
        foregroundPermission.canAskAgain &&
        backgroundPermission.granted &&
        backgroundPermission.canAskAgain)
}
// 1.2) Check and return all location permissions
export const getLocationPermission = async () => {
    const foregroundPermission = await Location.getForegroundPermissionsAsync();
    const backgroundPermission = await Location.getBackgroundPermissionsAsync();
    return { 
        foregroundPermissionGranted: foregroundPermission.granted,
        foregroundPermissionCanAskAgain: foregroundPermission.canAskAgain,
        backgroundPermissionGranted: backgroundPermission.granted,
        backgroundPermissionCanAskAgain: backgroundPermission.canAskAgain,
    }
}
// 1.3) Request user's all location permissions
export const requestLocationPermission = async () => {
    const foregroundPermission = await Location.requestForegroundPermissionsAsync();
    const backgroundPermission = await Location.requestBackgroundPermissionsAsync();
    return { 
        foregroundPermissionGranted: foregroundPermission.granted,
        foregroundPermissionCanAskAgain: foregroundPermission.canAskAgain,
        backgroundPermissionGranted: backgroundPermission.granted,
        backgroundPermissionCanAskAgain: backgroundPermission.canAskAgain,
    }
}

// foreground tracking
export const getLastKnownPosition = async () => {
    const last = await Location.getLastKnownPositionAsync();
    return last;
}

// 2) FOREGROUND TRACKING

// 2.1) Get foreground location (current position)
export const getCurrentPosition = async (accuracy:number=6) => {
    const current = await Location.getCurrentPositionAsync({ accuracy });
    return current;
}

// 2.2) Start foreground location tracking
export const watchPosition = async (accuracy:number) => {
    store.dispatch(setWatchPosition(true));
    const subscription = await Location.watchPositionAsync({ accuracy },
        (location)=>{
            store.dispatch(setCurrentPosition(location));
        }
    );
    return subscription;
}

// 3) BACKGROUND TRACKING

// 3.1) Start background location tracking
export const startLocationUpdates = async (accuracy=6, deferredUpdatesInterval=0) => {
    const count = await countAllPackages();
    //setPackages(count);
    const task = await Location.startLocationUpdatesAsync("MY_GPS_LOCATION", { accuracy, deferredUpdatesInterval });
    TaskManager.defineTask("MY_GPS_LOCATION", ({ data, error }) => {
        if (error) {
            console.log('taskmanager error', error);
        }
        if (data) {
            const { locations } = data as any;
            store.dispatch(setCurrentPosition(locations[0]));
            store.dispatch(sendPackage(locations[0]));
        }
    });
}

// 3.2) check if background location tracking is active and return boolean
export const checkLocationUpdates = async ( ) => {
    const check = await Location.hasStartedLocationUpdatesAsync("MY_GPS_LOCATION");
    return check;
}

// 3.3) stop background location tracking
export const stopLocationUpdates = async ( ) => {
    const task = await Location.stopLocationUpdatesAsync("MY_GPS_LOCATION");
}

// 4) convert milliseconds to date
export const millisecondsToTime = (ms: number)=> {
    let date = new Date();
    date.setTime(ms);
    return date.toTimeString() 
}