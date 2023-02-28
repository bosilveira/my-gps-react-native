// React Native, and Expo components
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';

// types
import type { LocationPackage } from '../types/locationPackage.type';
import { LocationPackageStatus } from '../types/locationPackage.type';
import { LocationObject } from 'expo-location';
import { DatabaseSorting } from '../types/databaseState.type';

// Location Package Database Entry Prefix
const packagePrefix = "@_";

// Save Location Package Entry into Database
export const saveLocationPackage = async (id: string, location: LocationObject) => {
    const power = await Battery.getPowerStateAsync();
    const status = LocationPackageStatus.PEND;
    const item = { id, location, power, status };
    const jsonValue = JSON.stringify(item);
    await AsyncStorage.setItem(packagePrefix + id, jsonValue);
    return item;
}

// Retrieve Location Package from Database
export const getLocationPackage = async (id: string): Promise<LocationPackage> => {
    const jsonValue = await AsyncStorage.getItem(packagePrefix + id) as string;
    const locationPackage: LocationPackage = JSON.parse(jsonValue);
    return locationPackage;
}

// Update Location Package status in Database 
export const updateLocationPackageStatus = async (id: string, status: string) => {
    const update = { status }
    await AsyncStorage.mergeItem(packagePrefix + id, JSON.stringify(update));
}

// Delete Location Package
export const deleteLocationPackage = async (id: string) => {
    await AsyncStorage.removeItem(packagePrefix + id);
}

// CAUTION!!! Drop Database
export const clearLocationDatabase = async () => {
    await AsyncStorage.clear();
}

// Paginate Location Packages
export const getLocationPackagesPerPage = async (currentPage: number, itemsPerPage: number, orderBy: DatabaseSorting = DatabaseSorting.DESC) => {
    let keys = [];
    keys = await AsyncStorage.getAllKeys() as string[];
    const list = keys.filter((item: string)=> item.slice(0,packagePrefix.length) === packagePrefix);
    list.sort;
    if (orderBy ===  DatabaseSorting.DESC) {
        list.reverse();
    }
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

// Count Location Packages total
export const countLocationPackages = async () => {
    const keys = await AsyncStorage.getAllKeys() as any;
    const count = keys.filter((item: string)=> item.slice(0,packagePrefix.length) === packagePrefix).length;
    return count;
}

// Get all Location Packages (for map plotting)
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

