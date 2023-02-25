// React Native, and Expo components
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

//types
import { LocationObject } from 'expo-location';

// redux
import { store } from '../redux/store.redux';
import { setCurrentPosition } from '../redux/location.slice';
import { saveLocationPackage, countLocationPackages } from './asyncStorage';
import { countLocationPackagesThunk, reloadLocationPackagesThunk } from '../redux/database.slice';

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
export const watchPosition = async (accuracy:number, getPosition: (position: LocationObject) => void) => {
    const subscription = await Location.watchPositionAsync({ accuracy },
        (location)=>{
            getPosition(location);
        }
    );
    return subscription;
}

// 3) BACKGROUND TRACKING (MAIN)

const locationTaskName = "MY_GPS_LOCATION";

// 3.1) Start background location tracking
export const startLocationUpdates = async (accuracy=6, deferredUpdatesInterval=0) => {
    const count = await countLocationPackages();
    //setPackages(count);
    const task = await Location.startLocationUpdatesAsync(locationTaskName, { accuracy, deferredUpdatesInterval });
    TaskManager.defineTask(locationTaskName, ({ data, error }) => {
        if (error) {
            console.log('taskmanager error', error);
        }
        if (data) {
            const { locations } = data as any;
            (async()=>{
                await saveLocationPackage(locations[0].timestamp, locations[0]);
                await store.dispatch(countLocationPackagesThunk());
            })()
        }
    });
}

// 3.2) check if background location tracking is active and return boolean
export const checkLocationUpdates = async ( ) => {
    const check = await Location.hasStartedLocationUpdatesAsync(locationTaskName);
    return check;
}

// 3.3) stop background location tracking
export const stopLocationUpdates = async ( ) => {
    const task = await Location.stopLocationUpdatesAsync(locationTaskName);
    await store.dispatch(reloadLocationPackagesThunk());
    return task;
}

// 4) convert milliseconds to date
export const millisecondsToTime = (ms: number)=> {
    let date = new Date();
    date.setTime(ms);
    return date.toTimeString() 
}