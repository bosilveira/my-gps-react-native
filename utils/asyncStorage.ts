// React Native, and Expo components
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import { LocationObject } from 'expo-location';

export interface Package {
    packageId: string,
    location: {
        coords:
        {
            accuracy: number,
            altitude: number,
            altitudeAccuracy: number,
            heading: number,
            latitude: number,
            longitude: number,
            speed: number
        }, 
        mocked: boolean,
        timestamp: number
    },
    power: {
        batteryLevel: number,
        batteryState: Battery.BatteryState,
        lowPowerMode: boolean,
    },
    status: string
} 

// Location Package Database Entry Prefix
const packagePrefix = "@_";

// Save Location Package Entry into Database (AsyncStorage)
export const saveLocationPackage = async (packageId: string, location: LocationObject) => {
    const power = await Battery.getPowerStateAsync();
    const status = 'pending';
    const item = { packageId, location, power, status }
    try {
        const jsonValue = JSON.stringify(item)
        await AsyncStorage.setItem(packagePrefix + packageId, jsonValue)
    } catch (e) {
        // saving error
    }
}

// Retrieve Location Package by packageId from Database (AsyncStorage)
export const getLocationPackageById = async (packageId: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(packagePrefix + packageId)
        return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch(e) {
        // read error
    }
}

// Update Location Package status in Database (AsyncStorage)
export const updateLocationPackageStatus = async (packageId: string, status: string) => {
    const update = { status }
    try {
        await AsyncStorage.mergeItem(packagePrefix + packageId, JSON.stringify(update));
    } catch (e) {
        // saving error
    }
}

// Delete Location Package status (AsyncStorage)
export const deleteLocationPackage = async (packageId: string) => {
    try {
        await AsyncStorage.removeItem(packagePrefix + packageId)
    } catch (e) {
        // saving error
    }
}

// CAUTION!!!
export const clearLocationDatabase = async () => {
    await AsyncStorage.clear()
}


export const getLocationPackagesPerPage = async ( currentPage: number, itemsPerPage: number ) => {
    let keys = [];
    try {
        keys = await AsyncStorage.getAllKeys() as any;
    } catch(e) {
        // read key error
    }
    const list = keys.filter((item: string)=> item.slice(0,packagePrefix.length) === packagePrefix);
    list.reverse();
    const size = list.length;
    const totalPages = Math.trunc(list.length / itemsPerPage);
    if (currentPage < 0 ) currentPage = 0;
    if (currentPage > totalPages ) currentPage = totalPages;
    const currentPagelist = list.slice(itemsPerPage * currentPage, itemsPerPage * currentPage + itemsPerPage);
    return { size, itemsPerPage, currentPage, currentPagelist, totalPages }
}

export const countLocationPackages = async () => {
    const keys = await AsyncStorage.getAllKeys() as any;
    const count = keys.filter((item: string)=> item.slice(0,packagePrefix.length) === packagePrefix).length;
    return count;
}

export const getMultiple = async () => {
    const keys = await AsyncStorage.getAllKeys() as any;
    const list = keys.filter((item: string)=> item.slice(0,packagePrefix.length) === packagePrefix);
    const values = await AsyncStorage.multiGet(list);

    const locationPackages: Package[] = []
    values.forEach( async (item, index)=> {
        const data = JSON.parse(item[1] as string);
        locationPackages.push(data);
    })
  
    return locationPackages;
    // example console.log output:
    // [ ['@MyApp_user', 'myUserValue'], ['@MyApp_key', 'myKeyValue'] ]
  }


  export const getAllLocationPackages = async () => {
    const keys = await AsyncStorage.getAllKeys() as any;
    const list = keys.filter((item: string)=> item.slice(0,packagePrefix.length) === packagePrefix);
    const values = await AsyncStorage.multiGet(list);

    const locationPackages: Package[] = []
    values.forEach( async (item, index)=> {
        const data = JSON.parse(item[1] as string);
        locationPackages.push(data);
    })
  
    return locationPackages;
    // example console.log output:
    // [ ['@MyApp_user', 'myUserValue'], ['@MyApp_key', 'myKeyValue'] ]
  }
















export const storePendingPackage = async (location: LocationObject) => {
    const power = await Battery.getPowerStateAsync();
    const id = '' + location.timestamp;
    const item = { id, location, power }
    try {
        const jsonValue = JSON.stringify(item)
        await AsyncStorage.setItem('@PEND_' + id, jsonValue)
    } catch (e) {
        // saving error
    }
}

export const storeSentPackage = async (location: LocationObject) => {
    const power = await Battery.getPowerStateAsync();
    const id = '' + location.timestamp;
    const item = { id, location, power }
    try {
        const jsonValue = JSON.stringify(item)
        await AsyncStorage.setItem('@SENT_' + id, jsonValue)
    } catch (e) {
        // saving error
    }
}

export const deletePendingPackage = async (location: LocationObject) => {
    try {
        await AsyncStorage.removeItem('@PEND_' + location.timestamp)
    } catch (e) {
        // saving error
    }
}


export const deletePackage = async (packageId: string) => {
    try {
        await AsyncStorage.removeItem(packageId)
    } catch (e) {
        // saving error
    }
}

export const getPackageById = async (id: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(id)
        return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch(e) {
        // read error
    }
}

export const storePackage = async (location: LocationObject) => {
    const power = await Battery.getPowerStateAsync();
    const title = '' + location.timestamp;
    const item = { title, location, power, synced: false }
    try {
      const jsonValue = JSON.stringify(item)
      await AsyncStorage.setItem('@' + title, jsonValue)
    } catch (e) {
      // saving error
    }
}

export const getPackagesPerPage = async (page: number) => {
    let keys = [];
    try {
        keys = await AsyncStorage.getAllKeys() as any
    } catch(e) {
        // read key error
    }
    const list = keys.filter((item: string)=> item[0] === '@');
    list.sort();
    return { list: list.slice(10*page,10*page+10), totalPages: Math.trunc(list.length / 10), packages: list.length }
}

export const getPackagesPerPageAndType = async ( page: number, type: string ) => {
    let keys = [];
    try {
        keys = await AsyncStorage.getAllKeys() as any
    } catch(e) {
        // read key error
    }
    const list = keys.filter((item: string)=> item.slice(0,5) === type);
    list.sort();
    return { list: list.slice(10*page,10*page+10), totalPages: Math.trunc(list.length / 10), packages: list.length }
}

export const getAllPackages = async () => {
    let keys = [];
    try {
        keys = await AsyncStorage.getAllKeys() as any
    } catch(e) {
        // read key error
    }
    const list = keys.filter((item: string)=> item[0] === '@');
    return list;
}

export const countAllPackages = async () => {
    const list = await getAllPackages()
    return list.length as number;
}

export const countPendingPackages = async () => {
    const list = await getAllPackages()
    return list.filter((item: string)=> item.slice(0,5) === '@PEND').length as number;
}

export const countSentPackages = async () => {
    const list = await getAllPackages()
    return list.filter((item: string)=> item.slice(0,5) === '@SENT').length as number;
}

export const clearStorage = async () => {
    await AsyncStorage.clear()
}

