import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LocationObject } from 'expo-location';
import { checkLocationUpdates, startLocationUpdates, stopLocationUpdates, checkLocationPermissions } from "../utils/location.utils";

export const startLocationUpdatesThunk = createAsyncThunk(
    "location/startLocationUpdates",
    async ( args=undefined, { getState, dispatch } ) => {
        const permissions = await checkLocationPermissions()
        if (!permissions) {
            throw Error('permissions')
        }
        const state = getState() as any;
        const running = await checkLocationUpdates();
        if (!running) {
            await startLocationUpdates(state.location.accuracy, state.location.deferredUpdatesInterval)
        }
    }
); 

export const stopLocationUpdatesThunk = createAsyncThunk(
    "location/stopLocationUpdates",
    async ( args=undefined, { getState } ) => {
        const status = await checkLocationUpdates();
        if (status) {
            const state = getState() as any;
            await stopLocationUpdates()
        }
      }
  ); 

const initialState = {
    accuracy: 6,
    deferredUpdatesInterval: 0,
    watchPosition: false,
    locationUpdates: false,
    currentPosition: {
        coords:
        {
            accuracy: 0,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: 0,
            latitude: 0,
            longitude: 0,
            speed: 0
        }, 
        mocked: true,
        timestamp: 0
    } as LocationObject,
 } as any;

 const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {

        setAccuracy: (state, action) => {
            state.accuracy = action.payload 
        },

        setDeferredUpdatesInterval: (state, action) => {
            state.deferredUpdatesInterval = action.payload 
        },

        setWatchPosition: (state, action) => {
            state.watchPosition = action.payload
        },

        setLocationUpdates: (state, action) => {
            state.locationUpdates = action.payload
        },

        setCurrentPosition: (state, action) => {
            state.currentPosition = action.payload
        },

    },
    extraReducers: (builder) => {

        builder.addCase(startLocationUpdatesThunk.fulfilled, (state, action) => {
            state.locationUpdates = true;
        });

        builder.addCase(startLocationUpdatesThunk.rejected, (state, action) => {
            state.locationUpdates = false;
        });

        builder.addCase(stopLocationUpdatesThunk.fulfilled, (state, action) => {
            state.locationUpdates = false;
        });

    },
});
  
export const { setAccuracy, setDeferredUpdatesInterval, setWatchPosition, setLocationUpdates, setCurrentPosition  } =  locationSlice.actions;
export default locationSlice.reducer;