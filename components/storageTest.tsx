import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Battery from 'expo-battery';
import { BatteryState } from 'expo-battery/build/Battery.types';
import { Appbar, Button, Card, Avatar, Text, Divider, List, RadioButton } from 'react-native-paper';
import { ProgressBar, MD3Colors } from 'react-native-paper';

export default function StorageTest( ) {

    const [progress, setProgress] = React.useState(0);
    const [partial, setPartial] = React.useState(0);
    const [items, setItems] = React.useState(0);
    const [timer, setTimer] = React.useState(0);
    const [battery, setBattery] = React.useState({ batteryLevel: 0.0, batteryState: BatteryState.UNPLUGGED });

    const testStorageCalls = async (runs: number) => {

        let storageError = 0

        const power = await Battery.getPowerStateAsync();
        setBattery(power)
           await (async () => {
                await AsyncStorage.clear()
                .then(()=>{
                    const after = Date.now()
                    setPartial(1/3)
                })
                .catch((e)=>{
                    storageError++;
                })
            })()


        const beforeAll = Date.now();
        const limit = 10
        setProgress(0)
        setTimer(0)

        await (async () => {
            setPartial(2/3)
            const before = Date.now()
            for (let j = 0; j < 10; j++) {
            for (let i = 1; i <= limit; i++) {
                await AsyncStorage.setItem('test_' + i, JSON.stringify(
                    { 
                        id: Math.random().toString(),
                        latitude: Math.random().toString(),
                        longitude: Math.random().toString(),
                        speed: Math.random() 
                    }
                ))
                .then(()=>{
                    setProgress((j*limit+i)/(10*limit))
                    setItems(i)
                    //if ( i % 1000 === 0) console.log('items:', i)
                //after.push(['AsyncStorage.setItem.clear()', Date.now()]);
                })
                .catch((e)=>{
                    storageError++;
                    //console.log('Storage Error: AsyncStorage.setItem() #' + i,e)
                })
            }}

            const after = Date.now()
            setTimer(after-before)
            console.log('AsyncStorage.setItem()', before, after, after-before, storageError);
        })()

        await (async () => {
            await AsyncStorage.clear()
            .then(()=>{
                const after = Date.now()
                setPartial(3/3)
            })
            .catch((e)=>{
                storageError++;
            })
        })()

        // for (let run = 1; run <= runs; run++) { 
    
        //     setProgress(run/runs)

        //     let storageError = 0
        //     const beforeAll = Date.now();
    
        //     await (async () => {
        //         console.log('Starting: AsyncStorage.clear()')
        //         const before = Date.now();
        //         await AsyncStorage.clear()
        //         .then(()=>{
        //             const after = Date.now()
        //             setPartial(1/3)
        //             console.log('AsyncStorage.clear()', before, after, after-before);
        //         })
        //         .catch((e)=>{
        //             storageError++;
        //             console.log('Storage Error: AsyncStorage.clear()', e)
        //         })
        //     })()
    
    
        //     await (async () => {
        //         console.log('Starting: AsyncStorage.setItem() Calls per 1000ms')
        //         let after = Date.now()
        //         const before = Date.now()
        //         let limit = 0
        //         for (let i = 1; i < 60*60*4; i++) {
        //             await AsyncStorage.setItem('test_' + i, JSON.stringify({ id: Math.random().toString(), latitude: Math.random().toString(), longitude: Math.random().toString(), speed: Math.random() }))
        //             .then(()=>{
        //             //after.push(['AsyncStorage.setItem.clear()', Date.now()]);
        //             })
        //             .catch((e)=>{
        //                 storageError++;
        //                 console.log('Storage Error: AsyncStorage.setItem() #' + i,e)
        //             })
    
        //             await AsyncStorage.setItem('test_' + i, JSON.stringify({ id: Math.random().toString(), latitude: Math.random().toString(), longitude: Math.random().toString(), speed: Math.random() }))
        //             .then(()=>{
        //             //after.push(['AsyncStorage.setItem.clear()', Date.now()]);
        //             })
        //             .catch((e)=>{
        //                 storageError++;
        //                 console.log('Storage Error: AsyncStorage.setItem() Twice #' + i,e)
        //             })
    
        //             after = Date.now()
        //             if (after-before >= 100) {
        //                 limit = i;
        //                 break;
        //             }
        //             setPartial(2/3)

        //         }
    
        //         for (let i = 1; i <= limit; i++) {
    
        //             await AsyncStorage.removeItem('test_' + i)
        //             .then(()=>{
        //             //after.push(['AsyncStorage.setItem.clear()', Date.now()]);
        //             })
        //             .catch((e)=>{
        //                 storageError++;
        //                 console.log('Storage Error: AsyncStorage.removeItem() #' + i,e)
        //             })
        //             setPartial(3/3)
   
        //         }
    
        //         const afterAll = Date.now()
        //         console.log('Run #', run, 'AsyncStorage:', 'setItem()', after-before, 'removeItem()',afterAll-beforeAll, 'Total items', limit, 'errors:', storageError);
        //     })()
    
        // }
    }

    return (
      <>
        <Button icon="memory" mode="contained" onPress={() => testStorageCalls(10)} style={{marginVertical: 8}} >Test Storage {items} {timer > 0 ? (1000 * items / timer).toFixed(2) : null}</Button>

        <Button icon="chip" mode="contained" style={{marginVertical: 8}} >Test Hardware</Button>
        <Button icon="database" mode="contained" style={{marginVertical: 8}} >Test Database Storage</Button>
        <Button icon="server-network" mode="contained" style={{marginVertical: 8}} >Test Server Connection</Button>
        <Button icon="radar" mode="contained" style={{marginVertical: 8}} >Test Location Services</Button>
        <Button icon="battery-charging" mode="contained" style={{marginVertical: 8}} >Battery {(battery?.batteryLevel*100).toFixed(1)+'%'} {(['','Unplugged', 'Charging', 'Full'][battery?.batteryState])}</Button>
        <Button icon="bug" mode="contained" style={{marginVertical: 8}} >Report Bug</Button>
        <Button icon="chart-line" mode="contained" style={{marginVertical: 8}} >Test Report</Button>

        <ProgressBar animatedValue={partial} style={{marginHorizontal: 12, marginVertical: 12}}/>
        <ProgressBar animatedValue={progress} style={{marginHorizontal: 12, marginVertical: 12}}/>

      </>
    );
  }



interface AsyncFunction {
    ( ): Promise<any>;
  }

const timer = (asyncFunc: AsyncFunction) => {
    const before = Date.now();
    asyncFunc().then(() => {
      const after = Date.now();
      console.log(after, before, after - before);
    });
    
}


export const getAllKeys = async () => {
    let keys = []
    const before = Date.now();
    try {
      keys = await AsyncStorage.getAllKeys() as any
    } catch(e) {
      // read key error
    }
  
    console.log('keys', keys)
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
  }


export const timedGetAllKeys = () =>{ 
    timer(getAllKeys)
}


export const testStorage = async (runs: number) => {

    for (let run = 1; run <= runs; run++) { 


        let storageError = 0
        const beforeAll = Date.now();

        await (async () => {
            console.log('Starting: AsyncStorage.clear()')
            const before = Date.now();
            await AsyncStorage.clear()
            .then(()=>{
                const after = Date.now()
                console.log('AsyncStorage.clear()', before, after, after-before);
            })
            .catch((e)=>{
                storageError++;
                console.log('Storage Error: AsyncStorage.clear()', e)
            })
        })()


        await (async () => {
            const list = []
            for (let i = 1; i < 60*60*8; i++) { 
                list.push({ id: Math.random().toString(), latitude: Math.random().toString(), longitude: Math.random().toString(), speed: Math.random() })
            }
            const before = Date.now()
            console.log('Starting: AsyncStorage.setItem(JSON.string)')
            await AsyncStorage.setItem('list', JSON.stringify(list))
            .then(()=>{
                const after = Date.now()
                console.log('AsyncStorage.setItem(JSON.string)', before, after, after-before);
            })
            .catch((e)=>{
                storageError++;
                console.log('Storage Error: AsyncStorage.setItem(JSON.string)',e)
            })
        })()


        await (async () => {
            console.log('Starting: AsyncStorage.setItem() Calls per 100ms')
            const before = Date.now()
            for (let i = 1; i < 60*60*4; i++) {
                await AsyncStorage.setItem('test_' + i, JSON.stringify({ id: Math.random().toString(), latitude: Math.random().toString(), longitude: Math.random().toString(), speed: Math.random() }))
                .then(()=>{
                    if ( i % 1000 === 0) console.log('items:', i)
                //after.push(['AsyncStorage.setItem.clear()', Date.now()]);
                })
                .catch((e)=>{
                    storageError++;
                    console.log('Storage Error: AsyncStorage.setItem() #' + i,e)
                })
                const timer = Date.now()
                if (before-timer >= 100) break;
            }
            const after = Date.now()
            console.log('AsyncStorage.setItem() Calls per 100ms', before, after, after-before);
        })()


        await (async () => {
            const before = Date.now()
            console.log('Starting: AsyncStorage.setItem()')
            for (let i = 1; i < 60*60*4; i++) {
                await AsyncStorage.setItem('test_' + i, JSON.stringify({ id: Math.random().toString(), latitude: Math.random().toString(), longitude: Math.random().toString(), speed: Math.random() }))
                .then(()=>{
                    if ( i % 1000 === 0) console.log('items:', i)
                //after.push(['AsyncStorage.setItem.clear()', Date.now()]);
                })
                .catch((e)=>{
                    storageError++;
                    console.log('Storage Error: AsyncStorage.setItem() #' + i,e)
                })
            }
            const after = Date.now()
            console.log('AsyncStorage.setItem()', before, after, after-before);
        })()

        await (async () => {
            console.log('Starting: AsyncStorage.getAllKeys()')
            const before = Date.now()
            const keys = await AsyncStorage.getAllKeys()
            .then(()=>{
                const after = Date.now()
                console.log('AsyncStorage.getAllKeys()', before, after, after-before);
            })
            .catch((e)=> {
                storageError++;
                console.log('Storage Error: AsyncStorage.getAllKeys()',e)
            })
        })()

        await (async () => {
            console.log('Starting: AsyncStorage.clear()')
            const before = Date.now()
            await AsyncStorage.clear()
            .then(()=>{
                const after = Date.now()
                console.log('AsyncStorage.clear()', before, after, after-before);
            })
            .catch((e)=>{
                storageError++;
                console.log('Storage Error: AsyncStorage.clear()',e)
            })
        })()

        const afterAll = Date.now();
        console.log('Run #', run, 'Total time:', beforeAll, afterAll, afterAll-beforeAll, 'errors:', storageError)
    }
}


export const testStorageCalls = async (runs: number) => {

    for (let run = 1; run <= runs; run++) { 

        let storageError = 0
        const beforeAll = Date.now();

        await (async () => {
            console.log('Starting: AsyncStorage.clear()')
            const before = Date.now();
            await AsyncStorage.clear()
            .then(()=>{
                const after = Date.now()
                console.log('AsyncStorage.clear()', before, after, after-before);
            })
            .catch((e)=>{
                storageError++;
                console.log('Storage Error: AsyncStorage.clear()', e)
            })
        })()


        await (async () => {
            console.log('Starting: AsyncStorage.setItem() Calls per 1000ms')
            let after = Date.now()
            const before = Date.now()
            let limit = 0
            for (let i = 1; i < 60*60*4; i++) {
                await AsyncStorage.setItem('test_' + i, JSON.stringify({ id: Math.random().toString(), latitude: Math.random().toString(), longitude: Math.random().toString(), speed: Math.random() }))
                .then(()=>{
                //after.push(['AsyncStorage.setItem.clear()', Date.now()]);
                })
                .catch((e)=>{
                    storageError++;
                    console.log('Storage Error: AsyncStorage.setItem() #' + i,e)
                })

                await AsyncStorage.setItem('test_' + i, JSON.stringify({ id: Math.random().toString(), latitude: Math.random().toString(), longitude: Math.random().toString(), speed: Math.random() }))
                .then(()=>{
                //after.push(['AsyncStorage.setItem.clear()', Date.now()]);
                })
                .catch((e)=>{
                    storageError++;
                    console.log('Storage Error: AsyncStorage.setItem() Twice #' + i,e)
                })

                after = Date.now()
                if (after-before >= 100) {
                    limit = i;
                    break;
                }
            }

            for (let i = 1; i <= limit; i++) {

                await AsyncStorage.removeItem('test_' + i)
                .then(()=>{
                //after.push(['AsyncStorage.setItem.clear()', Date.now()]);
                })
                .catch((e)=>{
                    storageError++;
                    console.log('Storage Error: AsyncStorage.removeItem() #' + i,e)
                })

            }

            const afterAll = Date.now()
            console.log('Run #', run, 'AsyncStorage:', 'setItem()', after-before, 'removeItem()',afterAll-beforeAll, 'Total items', limit, 'errors:', storageError);
        })()

    }
}