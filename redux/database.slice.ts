import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LocationObject } from 'expo-location';
import { storePackage, clearStorage, storePendingPackage, storeSentPackage, deletePackage, deletePendingPackage, countPendingPackages,
    countSentPackages, getPackagesPerPage, getPackagesPerPageAndType } from "../utils/asyncStorage";

// save package as PENDING
export const savePendingPackageThunk = createAsyncThunk(
    "database/savePendingPackage",
    async ( location: LocationObject ) => {
        await storePendingPackage(location);
    }
);

// save package as SENT
export const saveSentPackageThunk = createAsyncThunk(
    "database/storeSentPackage",
    async ( location: LocationObject ) => {
        await storeSentPackage(location);
    }
);

// delete package by ID
export const deletePackageThunk = createAsyncThunk(
    "database/deletePackage",
    async ( packageId: string ) => {
        await deletePackage(packageId);
    }
);

// count database package entries; return packages (total), pending, and sent
export const countDatabasePackagesThunk = createAsyncThunk(
    "database/countDatabasePackages",
    async ( ) => {
        const pending = await countPendingPackages();
        const sent = await countSentPackages();
        return { packages: pending + sent, pending, sent };
    }
);

// get packages per page
export const paginatePackagesThunk = createAsyncThunk(
    "database/getPackagesPerPage",
    async ( args: any ) => {
        const { page, type } = args;
        const { list, totalPages, packages } = await getPackagesPerPageAndType(page, type);
        return { list, totalPages, packages, page, type };
    }
);

// delete all database entries
export const clearDatabaseThunk = createAsyncThunk(
    "database/clearDatabase",
    async ( ) => {
        clearStorage();
        return 0;
    }
);

// delete pending package
export const deletePendingPackageThunk = createAsyncThunk(
    "database/clearDatabase",
    async ( location: LocationObject) => {
        await deletePendingPackage(location);
    }
);


const initialState = {
    packages: 0,
    pending: 0,
    sent: 0,
    totalPages: 0,
    page: 0,
    pageList: [],
    type: '@PEND',
    loading: false
} as any;

const databaseSlice = createSlice({
    name: "database",
    initialState,
    reducers: {

        setType: (state, action) => {
            state.type = action.payload 
        },

        setPackages: (state, action) => {
            state.packages = action.payload 
        },

        addPackages: (state, action) => {
            state.packages = state.packages + action.payload 
        },

    },
    extraReducers: (builder) => {

        builder.addCase(savePendingPackageThunk.fulfilled, (state, action) => {
            state.packages = state.packages + 1;
            state.pending = state.pending + 1;
        });

        builder.addCase(saveSentPackageThunk.fulfilled, (state, action) => {
            state.packages = state.packages + 1;
            state.sent = state.sent + 1;
        });

        builder.addCase(countDatabasePackagesThunk.fulfilled, (state, action) => {
            state.packages = action.payload.packages;
            state.pending = action.payload.pending;
            state.sent = action.payload.sent;
        });

        builder.addCase(paginatePackagesThunk.fulfilled, (state, action) => {
            state.totalPages = action.payload.totalPages;
            state.pageList = action.payload.list;
            state.packages = action.payload.packages;
            state.page = action.payload.page;
            state.type = action.payload.type;
        });


        builder.addCase(clearDatabaseThunk.fulfilled, (state, action) => {
            state.packages = 0;
            state.pending = 0;
            state.sent = 0;
        });

    },
});
  
export const { setType, setPackages, addPackages } =  databaseSlice.actions;
export default databaseSlice.reducer;