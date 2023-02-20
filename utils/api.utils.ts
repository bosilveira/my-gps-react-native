export const apiFetch = async ( request: Request, timeout: number, status: number ) => {

    const controller = new AbortController();
    const abortSignal = setTimeout(() => controller.abort(), timeout);

    request = { ...request, signal: controller.signal}

    await fetch(request)
        .then((response) => {
          if (response.status !== status) {
            throw Error('status');
            } else {
                clearTimeout(abortSignal)
                const data = response.json()                
                return data;
            }
        })
        .catch((error) => {
            throw error;
        });
}

export const apiGetPoints = async (address: string, timeout: number) => {

    let result = {
        start: 0,
        end: 0,
        status: 0,
        data: {} as any,
        error: ''
    }

    const controller = new AbortController();
    const abortSignal = setTimeout(() => controller.abort(), timeout);

    result.start = Date.now();

    await fetch(address + '/points/', {
        method: 'GET',
        signal: controller.signal
    }).then((response) => {
        result.status = response.status;
        return response.json()
    }).then((data) => {
        result.data = data;
        result.end = Date.now();
    }).catch((error) => {
        result.error = error.name + '; ' + error.message;
        result.end = Date.now();
    });

    return result;
}


export const apiCheckConnection = async (url: string, timeout: number) => {
    let result = {
        start: 0,
        end: 0,
        success: false,
        error: false
    }
    const controller = new AbortController();
    const abortSignal = setTimeout(() => controller.abort(), timeout);
    result.start = Date.now();
    await fetch(url, {
        method: 'GET',
        signal: controller.signal
    }).then((response) => {
        if (response.status === 200) {
            result.success = true;
            result.end = Date.now();
        }
    }).catch((error) => {
        result.error = true;
        result.end = Date.now();
    });
    return result;
}