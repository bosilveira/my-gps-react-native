import type { LocationObject } from "expo-location"
import * as Battery from 'expo-battery';

export type MapData = { 
    center: {
        centerLatitude: number,
        centerLongitude: number,
    },
    limits: {
        minLatitude: number,
        maxLatitude: number,
        minLongitude: number,
        maxLongitude: number,
        minAccuracy: number,
        maxAccuracy: number
    },
    user: {
        currentPosition: LocationObject,
        normalizedCurrentPositionX: number,
        normalizedCurrentPositionY: number
    },
    points: Array<{
        x: number,
        y: number,
        accuracy: number,
        status: string,
        power: Battery.PowerState
    }>
}