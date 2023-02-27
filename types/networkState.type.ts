import * as Network from 'expo-network';

export enum NetworkStateStatus {
    TIMEOUT_SET = "Timeout Settings Updated",
    ADDRESS_SET = "API Address Updated",
    UPLOADING_ON = "Uploading is ON",
    UPLOADING_OFF = "Uploading is OFF",
    SENDING = "Sending Location Package",
    CHECKING = "Checking Connection to Server",
    FETCH_ERROR = "API Fetch Error",
}

export type NetworkState = {
    address: string,
    timeout: number,
    autoUpload: boolean,
    uploading: boolean,
    syncing: boolean,
    //token: string,
    connection: Network.NetworkState,
    fetchErrorCount: number,
    status: NetworkStateStatus,
}