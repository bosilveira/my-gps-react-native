// React Native, and Expo components
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Gyroscope } from 'expo-sensors';
import { Dispatch } from 'react';
import { getAllLocationPackages } from './asyncStorage';
import * as Battery from 'expo-battery';

//types
import type { LocationObject } from 'expo-location';
import type { GyroscopeMeasurement } from 'expo-sensors';

// redux
import { store } from '../redux/store.redux';
import { setCurrentPosition } from '../redux/location.slice';
import { saveLocationPackage, countLocationPackages } from './asyncStorage';
import { countLocationPackagesThunk, reloadLocationPackagesThunk } from '../redux/database.slice';
import { GyroscopeSensor } from 'expo-sensors/build/Gyroscope';

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


export const reverseGeocode = async (location: LocationObject) => {
    const result = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    return result;
}

export const watchGyroscope = (updateInterval: number, getGyroscope: Dispatch<React.SetStateAction<GyroscopeMeasurement>> ): ReturnType<GyroscopeSensor["addListener"]> => {
    Gyroscope.setUpdateInterval(updateInterval);
    const subscription = Gyroscope.addListener(gyroscopeData => {
        //console.log('x',gyroscopeData.x.toString(),'y',gyroscopeData.y.toString(),'z',gyroscopeData.z.toString())
        getGyroscope( (prevState: GyroscopeMeasurement) => { 
            console.log('z',prevState.z.toString(), gyroscopeData.z.toString())

            return { x: prevState.x + gyroscopeData.x, y: prevState.y + gyroscopeData.y, z: prevState.z + gyroscopeData.z } });
    });
    return subscription;
}

export type MapData = { 
    center: {
        centerLatitude: number,
        centerLongitude: number,
    },
    limits: {
        minLatitude: number,
        maxLatitude: number,
        minLongitude: number,
        maxLongitude: number,
        minAccuracy: number,
        maxAccuracy: number
    },
    user: {
        currentPosition: LocationObject,
        normalizedCurrentPositionX: number,
        normalizedCurrentPositionY: number
    },
    points: {
        x: number,
        y: number,
        accuracy: number,
        status: string,
        power: Battery.PowerState
    }[]
}

export const getMap = async (): Promise<MapData> =>{
    const currentPosition = await getCurrentPosition(6);
    //const geo = await reverseGeocode(currentPosition);
    // console.log(geo[0].city, geo[0].country, geo[0].district, geo[0].postalCode, geo[0].region, geo[0].isoCountryCode, geo[0].name,
    //     geo[0].street, geo[0].streetNumber, geo[0].subregion, geo[0].timezone )
    // console.log("Here:", geo[0].street, geo[0].streetNumber, geo[0].district, geo[0].subregion, geo[0].region, geo[0].country, geo[0].postalCode )
    const positions = await getAllLocationPackages();
    const latitudes = positions.map(item=>item.location.coords.latitude);
    const longitudes = positions.map(item=>item.location.coords.longitude);
    const accuracies = positions.map(item=>item.location.coords.accuracy);
    const minLatitude = Math.min(...latitudes);
    const maxLatitude = Math.max(...latitudes);
    const minLongitude = Math.min(...longitudes);
    const maxLongitude = Math.max(...longitudes);
    const minAccuracy = Math.min(...accuracies);
    const maxAccuracy = Math.max(...accuracies);
    const longitudeDelta = maxLongitude - minLongitude;
    const latitudeDelta = maxLatitude - minLatitude;
    const accuracyDelta = maxAccuracy - minAccuracy;
    const centerLatitude = (maxLatitude + minLatitude) / 2;
    const centerLongitude = (maxLongitude + minLongitude) / 2;
    const maxLength = Math.max(latitudeDelta, longitudeDelta);
    const points = positions.map( (item, index)=> {
        const normalizedY = 1 - ((maxLength - latitudeDelta)/2 + item.location.coords.latitude - minLatitude) / maxLength;
        const normalizedX = ((maxLength - longitudeDelta)/2 + item.location.coords.longitude - minLongitude) / maxLength;
        //const normalizedAccuracy = (item.location.coords.accuracy - minAccuracy) / (accuracyDelta);
        return { x: normalizedX, y: normalizedY, accuracy: item.location.coords.accuracy, status: item.status, power: item.power };
    });
    const normalizedCurrentPositionY = 1 - ((maxLength - latitudeDelta)/2 + currentPosition.coords.latitude - minLatitude) / maxLength;
    const normalizedCurrentPositionX = ((maxLength - longitudeDelta)/2 + currentPosition.coords.longitude - minLongitude) / maxLength;
    return { 
        center: {
            centerLatitude,
            centerLongitude,
        },
        limits: {
            minLatitude,
            maxLatitude,
            minLongitude,
            maxLongitude,
            minAccuracy,
            maxAccuracy
        },
        user: {
            currentPosition,
            normalizedCurrentPositionX,
            normalizedCurrentPositionY
        },
        points
    }
}