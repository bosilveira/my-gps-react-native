import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import { LocationObject } from 'expo-location';

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

