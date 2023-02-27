import type { LocationPackage } from "./locationPackage.type"

export enum DatabaseSorting {
    ASC = "Ascending",
    DESC = "Descending"
}

export type DatabaseState = {
    size: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number,
    currentPageList: LocationPackage[],
    sorting: DatabaseSorting,
    loading: boolean
}