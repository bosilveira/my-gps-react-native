// React Native, Axios, and Expo components
import axios, {isCancel, AxiosError} from 'axios';
import { store } from '../redux/store.redux';
import * as Network from 'expo-network';
import { updateLocationPackageStatus, deleteLocationPackage } from './asyncStorage';

// types
import type { LocationObject } from 'expo-location';

export const checkNetworkConnection = async (): Promise<Network.NetworkState> => {
    const networkConnection = await Network.getNetworkStateAsync();
    return networkConnection;
}

// Send Location Package Info to Server
export const apiSendPackage = async (location: LocationObject, id: string, address: string, timeout: number = 0, removeAfterSend: boolean = false): Promise<boolean> => {
    const result = await axios({
        method: 'post',
        url: '/points/' + id,
        baseURL: address,
        timeout,
        data: {
            id,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            speed: location.coords.speed,
            time: location.timestamp
        }
    })
    .then((response) => {
        if (response.status === 201) {
            if (removeAfterSend) {
                deleteLocationPackage(id);
            } else {
                updateLocationPackageStatus(id, 'sent')
            }
            return true;
        } else {
            return false;
        }
    })
    .catch((error)=> {
        console.log(error);
        return false;
    });
    return result;
}

// Perform GET and Check Response Status (200)
export const apiCheckConnection = async (address: string, timeout: number): Promise<boolean> => {
    const result = await axios({
        method: 'get',
        url: '/points/',
        baseURL: address,
        timeout,
    })
    .then((response) => {
        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    })
    .catch((error)=> {
        console.log('check connection error', error);
        return false;
    });
    return result;
}