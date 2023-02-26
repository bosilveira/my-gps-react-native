import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LocationObject } from 'expo-location';
import { countLocationPackages, getLocationPackagesPerPage, clearStorage, deletePendingPackage, countPendingPackages,
    countSentPackages, getPackagesPerPage, getPackagesPerPageAndType,  } from "../utils/asyncStorage";

// count database package entries; return packages (total), pending, and sent
export const countLocationPackagesThunk = createAsyncThunk(
    "database/countLocationPackages",
    async ( ) => {
        const size = await countLocationPackages();
        return size;
    }
);

// get packages per page
export const paginateLocationPackagesThunk = createAsyncThunk(
    "database/paginateLocationPackages",
    async ( args: any ) => {
        const { page, itemsPerPage } = args;
        const { size, currentPage, currentPagelist, totalPages } = await getLocationPackagesPerPage(page, itemsPerPage);
        return { size, itemsPerPage, currentPage, currentPagelist, totalPages };
    }
);

// get packages per page
export const reloadLocationPackagesThunk = createAsyncThunk(
    "database/reloadLocationPackages",
    async ( args=undefined, { getState } ) => {
        const state = getState() as any;
        const { size, itemsPerPage, currentPage, currentPagelist, totalPages } = await getLocationPackagesPerPage(state.database.currentPage, state.database.itemsPerPage);
        return { size, itemsPerPage, currentPage, currentPagelist, totalPages };
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

export type DatabaseState = {
    size: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number,
    currentPageList: any[],
    sorting: string,
    query: {
        applied: false,
        start: number,
        end: number
    }
    loading: boolean
}

const databaseSlice = createSlice({
    name: "database",

    initialState: {
        size: 0,
        itemsPerPage: 4,
        totalPages: 0,
        currentPage: 0,
        currentPageList: [],
        sorting: 'ASC',
        query: {
            applied: false,
            start: 0,
            end: 0,
        },
        loading: false
    },

    reducers: {

        setItemsPerPage: (state, action) => {
            state.itemsPerPage = action.payload 
        },

    },
    extraReducers: (builder) => {

        builder.addCase(countLocationPackagesThunk.pending, (state, action) => {
            state.loading = true;
        });

        builder.addCase(countLocationPackagesThunk.fulfilled, (state, action) => {
            state.size = action.payload;
            state.loading = false;
        });

        builder.addCase(paginateLocationPackagesThunk.pending, (state, action) => {
            state.loading = true;
        });

        builder.addCase(paginateLocationPackagesThunk.fulfilled, (state, action) => {
            state.size = action.payload.size;
            state.itemsPerPage = action.payload.itemsPerPage;
            state.currentPage = action.payload.currentPage;
            state.currentPageList = action.payload.currentPagelist;
            state.totalPages = action.payload.totalPages;
            state.loading = false;
        });

        builder.addCase(reloadLocationPackagesThunk.pending, (state, action) => {
            state.loading = true;
        });

        builder.addCase(reloadLocationPackagesThunk.fulfilled, (state, action) => {
            state.size = action.payload.size;
            state.itemsPerPage = action.payload.itemsPerPage;
            state.currentPage = action.payload.currentPage;
            state.currentPageList = action.payload.currentPagelist;
            state.totalPages = action.payload.totalPages;
            state.loading = false;
        });



        builder.addCase(clearDatabaseThunk.fulfilled, (state, action) => {
            state.size = 0;
        });

    },
});
  
export const { setItemsPerPage } =  databaseSlice.actions;
export default databaseSlice.reducer;