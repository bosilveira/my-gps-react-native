import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { LocationSubscriber } from "expo-location/build/LocationSubscribers";
import { LocationSubscription } from "expo-location";

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
                console.log('new locations',locations)
            }
           });
      }
  );


  export const watchPosition = createAsyncThunk(
    "location/watchPosition",
    async ( args, { getState } ) => {
        const state = getState() as any;
        console.log('start')
        console.log('subscription', state.location.locationSubscription)
        state.location.locationSubscription.remove()
        const subscription = await Location.watchPositionAsync(
            {
                accuracy: state.location.accuracy,
                distanceInterval: state.location.distanceInterval
            },
            (location)=>{
            const { locations } = location as any
            console.log('new locations', location)
        });
        console.log('subscription obj', subscription)
        return { remove: subscription.remove }
      }
  ); 

const initialState = {
    foregroundPermission: false,
    backgroundPermission: false,
    sampling: 1000,
    lastPosition: {},
    currentPosition: {},
    maxAge: 0,
    requiredAccuracy: 1,
    accuracy: 6,
    distanceInterval: 1,
    watchPosition: false
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

      setWatchPosition: (state, action) => {
        state.watchPosition = action.payload
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
  
  export const { locationDataReset, setWatchPosition } =  locationSlice.actions;
  
  export default locationSlice.reducer;