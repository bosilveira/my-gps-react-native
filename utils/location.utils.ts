import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { store } from '../redux/store.redux';
import { setLocation, setWatchPosition, setPackages, addPackages } from '../redux/location.slice';
import { savePackage } from '../redux/database.slice';
import { storePackage, countAllPackages } from './asyncStorage';

export const checkLocationPermission = async () => {
    const foregroundPermission = await Location.getForegroundPermissionsAsync();
    const backgroundPermission = await Location.getBackgroundPermissionsAsync();
    return { 
        foregroundPermissionGranted: foregroundPermission.granted,
        foregroundPermissionCanAskAgain: foregroundPermission.canAskAgain,
        backgroundPermissionGranted: backgroundPermission.granted,
        backgroundPermissionCanAskAgain: backgroundPermission.canAskAgain,
    }
}

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

export const getPosition = async () => {
    // Accuracy.Lowest ＝ 1 Accurate to the nearest three kilometers.
    // Accuracy.Low ＝ 2 Accurate to the nearest kilometer.
    // Accuracy.Balanced ＝ 3 Accurate to within one hundred meters.
    // Accuracy.High ＝ 4 Accurate to within ten meters of the desired target.
    // Accuracy.Highest ＝ 5 The best level of accuracy available.
    // Accuracy.BestForNavigation ＝ 6 The highest possible accuracy that uses additional sensor data to facilitate navigation apps.
    const last = await Location.getLastKnownPositionAsync({ maxAge: 40000, requiredAccuracy: 100 });
    const current = await Location.getCurrentPositionAsync({ accuracy: 6, distanceInterval: 10000 });
    return { last, current };
}

// foreground tracking
export const watchPosition = async (accuracy: number, distanceInterval: number) => {
    store.dispatch(setWatchPosition(true));
    const subscription = await Location.watchPositionAsync(
        { accuracy, distanceInterval },
        (location)=>{
            store.dispatch(setLocation(location));
        }
    );
    return subscription;
}

// background tracking
export const startLocationUpdates = async (accuracy=6, deferredUpdatesInterval=0, deferredUpdatesTimeout=0,
    killServiceOnDestroy=true, notificationTitle='Location Tracking', notificationBody='Location Tracking is Active', notificationColor="#CCCCFF") => {
    const count = await countAllPackages();
    setPackages(count);
    const task = await Location.startLocationUpdatesAsync("MY_GPS_LOCATION", {
        accuracy, deferredUpdatesInterval, deferredUpdatesTimeout, foregroundService: {killServiceOnDestroy, notificationTitle, notificationBody, notificationColor}
    });
    TaskManager.defineTask("MY_GPS_LOCATION", ({ data, error }) => {
        if (error) {
            // check `error.message` for more details.
            return;
        }
        if (data) {
            const { locations } = data as any;
            store.dispatch(setLocation(locations[0]));
            store.dispatch(savePackage(locations[0]));
        }
    });
}

export const stopLocationUpdates = async ( ) => {
    const task = await Location.stopLocationUpdatesAsync("MY_GPS_LOCATION");
}

export const checkLocationUpdates = async ( ) => {
    const check = await Location.hasStartedLocationUpdatesAsync("MY_GPS_LOCATION");
}