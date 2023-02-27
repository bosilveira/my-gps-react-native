import * as Network from 'expo-network';

export type NetworkState = {
    address: string,
    timeout: number,
    autoUpload: boolean,
    //token: string,
    connection: Network.NetworkState,
    fetchErrorCount: number

}