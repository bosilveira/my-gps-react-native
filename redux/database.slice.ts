import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import { storePackage, clearStorage, storePendingPackage, storeSentPackage } from "../utils/asyncStorage";

export const savePendingPackage = createAsyncThunk(
    "database/savePendingPackage",
      async ( location: LocationObject, { getState } ) => {
          const { status } = await Location.getForegroundPermissionsAsync();
          storePendingPackage(location);
          const state = getState() as any;
          return state.database.pending + 1;
      }
  );

  export const saveSentPackage = createAsyncThunk(
    "database/storeSentPackage",
      async ( location: LocationObject, { getState } ) => {
          const { status } = await Location.getForegroundPermissionsAsync();
          storeSentPackage(location);
          const state = getState() as any;
          return state.database.sent + 1;
      }
  );


export const savePackage = createAsyncThunk(
  "database/savePackage",
    async ( location: LocationObject, { getState } ) => {
        const { status } = await Location.getForegroundPermissionsAsync();
        storePackage(location);
        const state = getState() as any;
        return state.database.packages + 1;
    }
);

export const clearDatabase = createAsyncThunk(
    "database/clearDatabase",
      async ( ) => {
          clearStorage();
          return 0;
      }
  );
  

const initialState = {
    packages: 0,
    pending: 0,
    sent: 0
 } as any;

 const databaseSlice = createSlice({
    name: "database",
    initialState,
    reducers: {

      setPackages: (state, action) => {
        state.packages = action.payload 
      },

      addPackages: (state, action) => {
        state.packages = state.packages + action.payload 
      },


    },
    extraReducers: (builder) => {

      builder.addCase(savePackage.fulfilled, (state, action) => {
        state.packages = action.payload;
      });

      builder.addCase(savePendingPackage.fulfilled, (state, action) => {
        state.packages = state.packages + 1;
        state.pending = action.payload;
      });

      builder.addCase(saveSentPackage.fulfilled, (state, action) => {
        state.packages = state.packages + 1;
        state.sent = action.payload;
      });


      builder.addCase(clearDatabase.fulfilled, (state, action) => {
        state.packages = action.payload;
      });


    },
  });
  
  export const { setPackages, addPackages } =  databaseSlice.actions;
  
  export default databaseSlice.reducer;