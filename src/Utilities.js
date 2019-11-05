export function identicalObject(oldObject, updatedObject) {
    if (!oldObject || !updatedObject) {
        return false;
    }
    return Object.keys(oldObject).every(
        key => oldObject[key] === updatedObject[key],
    );
}

export function identicalArray(oldArray, updatedArray) {
    if (oldArray.length !== updatedArray.length) {
        return false;
    }

    var i = 0;
    var foundDifferentValue = false;
    while (i < oldArray.length && !foundDifferentValue) {
        if (Array.isArray(oldArray[i])) {
            if (identicalArray(oldArray[i], updatedArray[i])) {
                i++;
            } else {
                foundDifferentValue = true;
            }
        } else {
            if (oldArray[i] !== updatedArray[i]) {
                foundDifferentValue = true;
            } else {
            }
            i++;
        }
    }

    return !foundDifferentValue;
}
