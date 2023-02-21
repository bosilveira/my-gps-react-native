import * as Location from 'expo-location';
import * as Battery from 'expo-battery';
import { BatteryState } from 'expo-battery/build/Battery.types';


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

    const last = await Location.getLastKnownPositionAsync({maxAge: 40000, requiredAccuracy: 100})
    console.log('last', last?.coords );
    const current = await Location.getCurrentPositionAsync({accuracy: 6, distanceInterval: 10000});
    console.log('current', current?.coords );

    return {last, current}

}

export const watchPosition = async (accuracy: number, distanceInterval: number, callback = (location: any)=>{}) => {
    const subscription = await Location.watchPositionAsync(
        { accuracy, distanceInterval },
        (location)=>{
        const { locations } = location as any
        callback(location)
    });
    return subscription
}
