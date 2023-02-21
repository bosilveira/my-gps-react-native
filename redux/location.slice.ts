import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

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

export const checkForegroundPermission = createAsyncThunk(
  "location/checkForegroundPermission",
    async ( ) => {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status == 'granted') return status
        const { status: foregroundPermission } = await Location.requestForegroundPermissionsAsync();
        if (foregroundPermission == 'granted') {
            return true;
        } else {
            return false
        }
    }
);

export const checkBackgroundPermission = createAsyncThunk(
    "location/checkBackgroundPermission",
    async ( ) => {
        const { status } = await Location.getBackgroundPermissionsAsync();
        if (status == 'granted') return true
        const { status: backgroundPermission } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundPermission == 'granted') {
            return true;
        } else {
            return false
        }
    }
);

export const watchLocationUpdates = createAsyncThunk(
    "location/watchLocationUpdates",
    async ( ) => {
        await Location.startLocationUpdatesAsync("MY_GPS_LOCATION", {
            accuracy: Location.Accuracy.Balanced,
        });

        TaskManager.defineTask("MY_GPS_LOCATION", ({ data, error }) => {
            if (error) {
              // check `error.message` for more details.
              return;
            }
            if (data) {
                const { locations } = data as any
                console.log(locations)
            }
            console.log('Received new locations', data.toString());
           });
      }
  );

  export const watchPosition = createAsyncThunk(
    "location/watchPosition",
    async ( ) => {
        await Location.watchPositionAsync({
            accuracy: 5,
            distanceInterval: 1,

        },(location)=>{
            const { locations } = location as any
            console.log(location)
            
        //    console.log('teste', locations.toString())
        });
      }
  ); 

const initialState = {
    foregroundPermission: false,
    backgroundPermission: false,
    sampling: 1000,
 } as any;

 const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {

      locationDataReset: (state) => {
        state.foregroundPermission = false;
        state.backgroundPermission = false;
        state.sampling = 1000;
      },

    },
    extraReducers: (builder) => {

      builder.addCase(checkForegroundPermission.fulfilled, (state, action) => {
        state.foregroundPermission = action.payload;
      });

      builder.addCase(checkBackgroundPermission.fulfilled, (state, action) => {
        state.backgroundPermission = action.payload;
      });


    },
  });
  
  export const { locationDataReset } =  locationSlice.actions;
  
  export default locationSlice.reducer;