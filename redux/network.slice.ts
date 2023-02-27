import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkNetworkConnection } from "../utils/network.utils";
import * as Network from 'expo-network';

// types
import { NetworkState } from "../types/networkState.type";
import { NetworkStateStatus } from "../types/networkState.type";

// Send Package Thunk

export const checkConnectionThunk = createAsyncThunk(
    "network/checkConnection",
    async (): Promise<Network.NetworkState> => {
        const connection = await checkNetworkConnection();
        return connection;
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
        autoUpload: true,
        uploading: false,
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
            state.autoUpload = action.payload;
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


    },
});
  
export const { setAPIAddress, setAPITimeout, setAPIAutoUpload, incrementFetchErrorCount } =  networkSlice.actions;
export default networkSlice.reducer;