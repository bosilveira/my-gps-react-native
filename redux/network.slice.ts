import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGetPoints } from "../utils/api.utils";

export const getPoints = createAsyncThunk(
    "network/getPoints",
    async ( args, { getState } ) => {
        const state = getState() as any;
        const result = await apiGetPoints(state.network.address, state.network.timeout)
        console.log(result)
        return result;
      }
    );


const restoreApiData = createAsyncThunk(
  "network/restoreApiData",
  async ( ) => {
    
    let storageError = false
    let address = ''
    let timeout = ''

    try {
        const jsonValue = await AsyncStorage.getItem('@apiData')
        const data = jsonValue != null ? JSON.parse(jsonValue) : null;
        storageError = false;
        return data;
      } catch (e) {
        storageError = true;
        return { storageError }
    }
  }
)

const initialState = {
    address: 'http://192.168.1.3:8081',
    timeout: 4000,
    token: '',
 } as any;

 const networkSlice = createSlice({
    name: "network",
    initialState,
    reducers: {

    //   networkDataReset: (state) => {
    //     state = { ...initialState };
    //   },

      setAPIAddress: (state, action) => {
        state.address = action.payload;
      },

      setAPITimeout: (state, action) => {
        state.timeout = action.payload;
      },

      setAPIToken: (state, action) => {
        state.timeout = action.payload;
      },

    },
    extraReducers: (builder) => {

      builder.addCase(getPoints.fulfilled, (state, action) => {
        state.result = action.payload;
      });
  
      builder.addCase(restoreApiData.fulfilled, (state, action) => {
        state = { ...state, ...action.payload };
      });

      builder.addCase(getPoints.pending, (state, action) => {
        state.loading = true;
      });

    },
  });
  
  export const { setAPIAddress, setAPITimeout } =  networkSlice.actions;
  
  export default networkSlice.reducer;