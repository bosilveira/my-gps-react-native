import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface checkAddressProps {
  address: string,
  timeout: string
}

interface checkAddressReturnProps {
  address: string,
  timeout: number,
  fetchError: boolean,
  storageError: boolean,
}

export const checkAddress = createAsyncThunk(
  "api/checkAddress",
  async ( { address, timeout }: checkAddressProps ) => {

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), parseInt(timeout));

    let storageError = false
    let fetchError = false

    await fetch('http://' + address + '/points/', {
      method: 'GET',
      signal: controller.signal 
    })
      .then((response) => {

        if (response.status !== 200) {
          fetchError = true;
        } else {
          fetchError = false;
        }

        async ({address, timeout}: checkAddressProps) => {
          try {
              const jsonValue = JSON.stringify({address, timeout})
              await AsyncStorage.setItem('@apiData', jsonValue)
              storageError = false;
             } catch (e) {
              storageError = true;
          }
        }

      })
      .catch((error) => {
        console.log(error.name === 'AbortError');
        fetchError  = true;
      });

      return { address, timeout, fetchError, storageError, checked: true };
    }
  );


const restoreApiData = createAsyncThunk(
  "api/restoreApiData",
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
    address: '',
    timeout: 4000,
    checked: false,
    loading: false,
    fetchError: false,
    storageError: false,
 } as any;

 const apiSlice = createSlice({
    name: "api",
    initialState,
    reducers: {

      apiDataReset: (state) => {
        state.loading = false;
        state.address = '';
        state.timeout = 4000;
        state.fetchError = false;
        state.storageError = false;
        state.checked = false;
      },

    },
    extraReducers: (builder) => {

      builder.addCase(checkAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload.address;
        state.timeout = action.payload.timeout;
        state.fetchError = action.payload.fetchError;
        state.storageError = action.payload.storageError;
        state.checked = action.payload.checked;
      });
  
      builder.addCase(restoreApiData.fulfilled, (state, action) => {
        state = { ...state, ...action.payload };
      });

      builder.addCase(checkAddress.pending, (state, action) => {
        state.loading = true;
      });

    },
  });
  
  export const { apiDataReset } =  apiSlice.actions;
  
  export default apiSlice.reducer;