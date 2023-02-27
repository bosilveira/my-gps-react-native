import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { countLocationPackages, getLocationPackagesPerPage, clearStorage } from "../utils/asyncStorage";

// types
import type { DatabaseState } from "../types/databaseState.type";
import { DatabaseSorting } from "../types/databaseState.type";

// Count total database package entries
export const countLocationPackagesThunk = createAsyncThunk(
    "database/countLocationPackages",
    async (): Promise<number> => {
        const size = await countLocationPackages();
        return size;
    }
);

// Get packages per page
export const paginateLocationPackagesThunk = createAsyncThunk(
    "database/paginateLocationPackages",
    async (page: number, { getState } ) => {
        const state = getState() as any;
        const { size, currentPage, currentPagelist, totalPages } = await getLocationPackagesPerPage(page, state.database.itemsPerPage);
        return { size, currentPage, currentPagelist, totalPages };
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
    async () => {
        clearStorage();
        return 0;
    }
);

const databaseSlice = createSlice({
    name: "database",

    initialState: {
        size: 0,
        itemsPerPage: 8,
        totalPages: 0,
        currentPage: 0,
        currentPageList: [],
        sorting: DatabaseSorting.ASC,
        loading: false
    } as DatabaseState,

    reducers: {

        setItemsPerPage: (state, action) => {
            state.itemsPerPage = action.payload 
        },

        setSortingASC: (state) => {
            state.sorting = DatabaseSorting.ASC;
        },

        setSortingDESC: (state) => {
            state.sorting = DatabaseSorting.DESC;
        },

        incrementSize: (state) => {
            state.size += 1;
        },

        setCurrentPage: (state, action) => {
            if (action.payload < 0) {
                state.currentPage = 0;
            } else if (action.payload > state.totalPages) {
                state.currentPage = state.totalPages;
            } else {
                state.currentPage = action.payload;
            }
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
  
export const { setItemsPerPage, setSortingASC, setSortingDESC, incrementSize, setCurrentPage } =  databaseSlice.actions;
export default databaseSlice.reducer;