// React Native, and Expo components
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';

// types
import type { LocationPackage } from '../types/locationPackage.type';
import { LocationPackageStatus } from '../types/locationPackage.type';
import { LocationObject } from 'expo-location';

// Location Package Database Entry Prefix
const packagePrefix = "@_";

// Save Location Package Entry into Database (AsyncStorage)
export const saveLocationPackage = async (id: string, location: LocationObject) => {
    const power = await Battery.getPowerStateAsync();
    const status = LocationPackageStatus.PEND;
    const item = { id, location, power, status };
    const jsonValue = JSON.stringify(item);
    await AsyncStorage.setItem(packagePrefix + id, jsonValue);
}

// Retrieve Location Package from Database (AsyncStorage)
export const getLocationPackage = async (id: string): Promise<LocationPackage> => {
    const jsonValue = await AsyncStorage.getItem(packagePrefix + id) as string;
    const locationPackage: LocationPackage = JSON.parse(jsonValue);
    return locationPackage;
}

// Update Location Package status in Database (AsyncStorage)
export const updateLocationPackageStatus = async (id: string, status: string) => {
    const update = { status }
    await AsyncStorage.mergeItem(packagePrefix + id, JSON.stringify(update));
}

// Delete Location Package (AsyncStorage)
export const deleteLocationPackage = async (id: string) => {
    await AsyncStorage.removeItem(packagePrefix + id);
}

// CAUTION!!!
export const clearLocationDatabase = async () => {
    await AsyncStorage.clear();
}

export const getLocationPackagesPerPage = async (currentPage: number, itemsPerPage: number) => {
    let keys = [];
    keys = await AsyncStorage.getAllKeys() as string[];
    const list = keys.filter((item: string)=> item.slice(0,packagePrefix.length) === packagePrefix);
    list.reverse();
    const size = list.length;
    const totalPages = Math.trunc(list.length / itemsPerPage);
    if (currentPage < 0 ) currentPage = 0;
    if (currentPage > totalPages ) currentPage = totalPages;
    const currentPagelist = list.slice(itemsPerPage * currentPage, itemsPerPage * currentPage + itemsPerPage);

    const values = await AsyncStorage.multiGet(currentPagelist);

    const locationPackages: LocationPackage[] = []
    values.forEach( async (item, index)=> {
        const data = JSON.parse(item[1] as string);
        locationPackages.push(data);
    })
  
    return { size, itemsPerPage, currentPage, currentPagelist: locationPackages, totalPages }
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

    const locationPackages: LocationPackage[] = []
    values.forEach( async (item, index)=> {
        const data = JSON.parse(item[1] as string);
        locationPackages.push(data);
    })
    return locationPackages;
  }


  export const getAllLocationPackages = async () => {
    const keys = await AsyncStorage.getAllKeys() as any;
    const list = keys.filter((item: string)=> item.slice(0,packagePrefix.length) === packagePrefix);
    const values = await AsyncStorage.multiGet(list);

    const locationPackages: LocationPackage[] = []
    values.forEach( async (item, index)=> {
        const data = JSON.parse(item[1] as string);
        locationPackages.push(data);
    })
    return locationPackages;
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

