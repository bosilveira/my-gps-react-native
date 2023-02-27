import type { LocationObject } from "expo-location"

export enum LocationStateStatus {
    STARTING = "Starting Location Service",
    ABORTING = "Aborting Location Service",
    ON = "Location Service is ON",
    OFF = "Location Service is OFF",
    ERROR = "Location Service Error; Check Settings."
}

export type LocationState = {
    accuracy: number,
    deferredUpdatesInterval: number,
    status: LocationStateStatus,
    locationUpdates: boolean,
    currentPosition: LocationObject,
}