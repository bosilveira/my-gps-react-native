// React Native, React Native Paper, and Expo components
import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, Divider, RadioButton, Chip } from 'react-native-paper';

// redux
import { AppDispatch, RootState } from '../../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { setAccuracy  } from '../../redux/location.slice';

//types
import type { LocationState } from '../../types/locationState.type';

export default function AccuracySettings() {

    // Redux
    const location = useSelector((state: RootState) => state.location) as LocationState;
    const dispatch = useDispatch<AppDispatch>();

    // Accuracy controller
    const setAccuracyHandler = async (accuracy: number) => {
        dispatch(setAccuracy(accuracy));
    }

    return (<>
    <ScrollView
    style={{padding: 16, backgroundColor: 'rgba(245, 245, 245, 1)'}}
    >
        <Text variant="titleMedium"
        style={{textAlign: 'center'}}
        >
            Location Tracking Accuracy
        </Text>

        <Chip
        style={{marginVertical: 8, padding: 8}}
        icon="crosshairs-gps">
            Accuracy: {["Lowest", "Low", "Balanced", "High", "Highest", "Best for Navigation"][location.accuracy - 1]}
        </Chip>

        <Text variant="labelLarge"
        style={{textAlign: 'center'}}
        >
        {[
            "Accurate to the nearest three kilometers.",
            "Accurate to the nearest kilometer.",
            "Accurate to within one hundred meters.",
            "Accurate to within ten meters of the desired target.",
            "The best level of accuracy available.",
            "The highest possible accuracy that uses additional sensor data to facilitate navigation apps.",
        ][location.accuracy - 1]}
        </Text>

        <RadioButton.Group onValueChange={(value)=>{setAccuracyHandler(parseInt(value))}} value={location.accuracy.toString()} >
            <RadioButton.Item label="Best for Navigation" value="6" />
            <RadioButton.Item label="Highest" value="5" />
            <RadioButton.Item label="High" value="4" />
            <RadioButton.Item label="Balanced" value="3" />
            <RadioButton.Item label="Low" value="2" />
            <RadioButton.Item label="Lowest" value="1" />
        </RadioButton.Group>

        <Divider style={{marginVertical: 8}} />

        <Text
        style={{textAlign: 'center'}}
        >
            Location manager accuracy. For low-accuracies the implementation can avoid geolocation providers that consume a significant amount of power (such as GPS).
        </Text>
    </ScrollView>
    </>);
}