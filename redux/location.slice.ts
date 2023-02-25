import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LocationObject } from 'expo-location';
import { checkLocationUpdates, startLocationUpdates, stopLocationUpdates, checkLocationPermissions } from "../utils/location.utils";

// 1) BACKGROUND (MAIN) LOCATION TRACKING
// 1.1) Start Background (Main) Location Tracking
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

// 1.2) Stop Background (Main) Location Tracking
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


export type LocationState = {
    accuracy: number,
    deferredUpdatesInterval: number,
    status: string,
    locationUpdates: boolean,
    currentPosition: LocationObject,
}

 const locationSlice = createSlice({
    name: "location",
    
    initialState: { 
        accuracy: 6,
        deferredUpdatesInterval: 0,
        status: 'Location Service is OFF',
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
        } as LocationObject
    } as LocationState,

    reducers: {

        setAccuracy: (state, action) => {
            state.accuracy = action.payload 
        },

        setDeferredUpdatesInterval: (state, action) => {
            state.deferredUpdatesInterval = action.payload 
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
            state.status = 'Location Service is ON';
        });

        builder.addCase(stopLocationUpdatesThunk.fulfilled, (state, action) => {
            state.locationUpdates = false;
            state.status = 'Location Service is OFF';
        });

        builder.addCase(startLocationUpdatesThunk.rejected, (state, action) => {
            state.locationUpdates = false;
            state.status = 'Could not start Location Service';
        });

        builder.addCase(startLocationUpdatesThunk.pending, (state, action) => {
            state.status = 'Starting Location Service';
        });


        builder.addCase(stopLocationUpdatesThunk.pending, (state, action) => {
            state.status = 'Aborting Location Service';
        });

    },
});
  
export const { setAccuracy, setDeferredUpdatesInterval, setLocationUpdates, setCurrentPosition  } =  locationSlice.actions;
export default locationSlice.reducer;