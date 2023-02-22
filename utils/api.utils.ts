import axios, {isCancel, AxiosError} from 'axios';
import { store } from '../redux/store.redux';
import { savePendingPackageThunk, saveSentPackageThunk, deletePendingPackageThunk, countDatabasePackagesThunk, paginatePackagesThunk } from '../redux/database.slice';

export const apiSendPackage = async (data: any, address: string, timeout: number = 0) => {
    await axios({
        method: 'post',
        url: '/points/' + data.timestamp,
        baseURL: address,
        timeout,
        data: {
            id: data.coords.timestamp,
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
            speed: data.coords.speed,
            time: data.timestamp
        }
    })
    .then((response) => {
        if (response.status === 201) {
            store.dispatch(saveSentPackageThunk(data));
        } else {
            store.dispatch(savePendingPackageThunk(data));
        }
    })
    .catch((error)=> {
        console.log(error);
        store.dispatch(savePendingPackageThunk(data));
    });
}


export const apiReSendPackage = async (data: any, address: string, timeout: number = 0) => {
    await axios({
        method: 'post',
        url: '/points/' + data.timestamp,
        baseURL: address,
        timeout,
        data: {
            id: data.coords.timestamp,
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
            speed: data.coords.speed,
            time: data.timestamp
        }
    })
    .then((response) => {
        if (response.status === 201) {
            store.dispatch(saveSentPackageThunk(data));
            store.dispatch(deletePendingPackageThunk(data));
            store.dispatch(countDatabasePackagesThunk());
            store.dispatch(paginatePackagesThunk({page: 0, type: '@PEND'}));
        } 
    })
    .catch((error)=> {
        console.log(error);
    });
}



export const apiGetPoints = async (address: string, timeout: number) => {

    let result = {
        start: 0,
        end: 0,
        status: 0,
        data: {} as any,
        error: ''
    }

    const controller = new AbortController();
    const abortSignal = setTimeout(() => controller.abort(), timeout);

    result.start = Date.now();

    await fetch(address + '/points/', {
        method: 'GET',
        signal: controller.signal
    }).then((response) => {
        result.status = response.status;
        return response.json()
    }).then((data) => {
        result.data = data;
        result.end = Date.now();
    }).catch((error) => {
        result.error = error.name + '; ' + error.message;
        result.end = Date.now();
    });

    return result;
}


export const apiCheckConnection = async (address: string, timeout: number) => {
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