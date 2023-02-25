import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export type NetworkState = {
    address: string,
    timeout: number,
    autoUpload: boolean,
    //token: string,

}

const networkSlice = createSlice({
    name: "network",

    initialState: {
        address: 'http://192.168.1.3:8081',
        timeout: 4000,
        autoUpload: true,
        //token: '',
    } as NetworkState,

    reducers: {
        setAPIAddress: (state, action) => {
            state.address = action.payload;
        },
        setAPITimeout: (state, action) => {
            state.timeout = action.payload;
        },
        setAPIAutoUpload: (state, action) => {
            state.autoUpload = action.payload;
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
  
export const { setAPIAddress, setAPITimeout, setAPIAutoUpload } =  networkSlice.actions;
export default networkSlice.reducer;