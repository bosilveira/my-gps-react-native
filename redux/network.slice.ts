import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGetPoints, apiSendPackage, apiReSendPackage } from "../utils/api.utils";

export const sendPackage = createAsyncThunk(
    "network/sendPackage",
    async ( data: any, { getState } ) => {
        const state = getState() as any;
        const result = await apiSendPackage(data, state.network.address, state.network.timeout);
    }
);

export const reSendPackage = createAsyncThunk(
    "network/reSendPackage",
    async ( data: any, { getState } ) => {
        const state = getState() as any;
        const result = await apiReSendPackage(data, state.network.address, state.network.timeout);
    }
);



const restoreApiData = createAsyncThunk(
    "network/restoreApiData",
    async ( ) => {
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

const initialState = {
    address: 'http://192.168.1.3:8081',
    timeout: 4000,
    //token: '',
} as any;

 const networkSlice = createSlice({
    name: "network",
    initialState,
    reducers: {
        setAPIAddress: (state, action) => {
            state.address = action.payload;
        },
        setAPITimeout: (state, action) => {
            state.timeout = action.payload;
        },
        // setAPIToken: (state, action) => {
        //     state.timeout = action.payload;
        // },
    },
    extraReducers: (builder) => {
        builder.addCase(restoreApiData.fulfilled, (state, action) => {
            state = { ...state, ...action.payload };
        });
    },
});
  
export const { setAPIAddress, setAPITimeout } =  networkSlice.actions;
export default networkSlice.reducer;