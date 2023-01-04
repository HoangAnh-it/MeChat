export const isObjectEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
}

export const trimObject = (obj) => {
    if (obj === null || typeof obj !== 'object') return;
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') obj[key] = obj[key].trim();
        else if (obj[key] !== null && typeof obj[key] === 'object') {
            trimObject(obj[key])
        }
    })
    return obj
}