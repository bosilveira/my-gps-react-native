import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkNetworkConnection } from "../utils/network.utils";
import * as Network from 'expo-network';

// types
import { NetworkState } from "../types/networkState.type";
import { NetworkStateStatus } from "../types/networkState.type";
import { store } from '../redux/store.redux';

// utils
import { apiSendPackage } from "../utils/network.utils";
import { LocationPackage, LocationPackageStatus } from "../types/locationPackage.type";
import { updateLocationPackageStatus } from "../utils/asyncStorage";

// Send Package Thunk

export const checkConnectionThunk = createAsyncThunk(
    "network/checkConnection",
    async (): Promise<Network.NetworkState> => {
        const connection = await checkNetworkConnection();
        return connection;
    }
)

export const sendLocationPackageThunk = createAsyncThunk(
    "network/sendLocationPackage",
    async ( locationPackage: LocationPackage, { getState, dispatch })  => {
        const state = getState() as any;
        if (state.network.autoUpload) {
            const result = await apiSendPackage(locationPackage.location, locationPackage.id, state.network.address, state.network.timeout);
            if (!result) {
                throw Error('uploading error');
            } else {
                await updateLocationPackageStatus(locationPackage.id, LocationPackageStatus.SENT);
                return true;
            }
        } else {
            return false;
        }
    }
)



const restoreApiData = createAsyncThunk(
    "network/restoreApiData",
    async () => {
        let storageError = false;
        let address = '';
        let timeout = '';
        try {
            const jsonValue = await AsyncStorage.getItem('@apiData');
            const data = jsonValue != null ? JSON.parse(jsonValue) : null;
            storageError = false;
            return data;
        } catch (e) {
            storageError = true;
            return { storageError };
        }
    }
);

const networkSlice = createSlice({
    name: "network",

    initialState: {
        address: 'http://192.168.1.3:8081',
        timeout: 4000,
        upload: true,
        syncing: false,
        //token: '',
        fetchErrorCount: 0,
        connection: {
            isConnected: false,
            isInternetReachable: false,
            type: Network.NetworkStateType.UNKNOWN
        },
        status: NetworkStateStatus.UPLOADING_ON
    } as NetworkState,

    reducers: {
        setAPIAddress: (state, action) => {
            state.address = action.payload;
            state.status = NetworkStateStatus.ADDRESS_SET;
        },
        setAPITimeout: (state, action) => {
            state.timeout = action.payload;
            state.status = NetworkStateStatus.TIMEOUT_SET;
        },
        setAPIAutoUpload: (state, action) => {
            state.upload = action.payload;
            state.status = NetworkStateStatus.UPLOADING_ON;
        },
        setConnection: (state, action) => {
            state.connection = action.payload;
        },
        // setAPIToken: (state, action) => {
        //     state.timeout = action.payload;
        // },
        incrementFetchErrorCount: (state) => {
            state.fetchErrorCount += 1;
            state.status = NetworkStateStatus.FETCH_ERROR;
        },
    },
    extraReducers: (builder) => {

        builder.addCase(restoreApiData.fulfilled, (state, action) => {
            state = { ...state, ...action.payload };
        });

        builder.addCase(checkConnectionThunk.fulfilled, (state, action) => {
            state.connection = action.payload;
        });

        builder.addCase(sendLocationPackageThunk.fulfilled, (state, action) => {
            if (action.payload) {
                state.status = NetworkStateStatus.SENT;
                console.log('sent sent sent')
            }
        });

        builder.addCase(sendLocationPackageThunk.rejected, (state, action) => {
            state.status = NetworkStateStatus.FETCH_ERROR;
            state.fetchErrorCount += 1;
            if (state.fetchErrorCount > 4) {
                state.upload = false;
                state.fetchErrorCount = 0;
            }
        });


    },
});
  
export const { setAPIAddress, setAPITimeout, setAPIAutoUpload, incrementFetchErrorCount } =  networkSlice.actions;
export default networkSlice.reducer;