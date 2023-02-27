import * as Battery from 'expo-battery';

export type LocationPackage = {
    id: string,
    location: {
        coords:
        {
            accuracy: number,
            altitude: number,
            altitudeAccuracy: number,
            heading: number,
            latitude: number,
            longitude: number,
            speed: number
        }, 
        mocked: boolean,
        timestamp: number
    },
    power: {
        batteryLevel: number,
        batteryState: Battery.BatteryState,
        lowPowerMode: boolean,
    },
    status: string
};