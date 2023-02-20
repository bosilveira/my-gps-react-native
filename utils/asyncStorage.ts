import AsyncStorage from '@react-native-async-storage/async-storage';

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