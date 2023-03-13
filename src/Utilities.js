import { useState, useEffect } from "react";

export function compareByValue(a, b) {
    if (a === b) {
        return true;
    }

    if (typeof a !== typeof b) {
        return false;
    }

    if (a === null || b === null) {
        return false;
    }

    const compareSet = key => compareByValue(a[key], b[key])
    if (a instanceof Array) {
        if (a.length !== b.length) {
            return false;
        }

        return a.every(compareSet);
    }

    if (typeof a === "object") {
        const keysA = Object.keys(a);

        if (keysA.length !== Object.keys(b).length) {
            return false;
        }

        return keysA.every(compareSet);
    }

    return false;
};

export function identicalObject(oldObject, updatedObject) {
    if (oldObject === updatedObject) {
        return true;
    }

    if (!oldObject || !updatedObject) {
        return false;
    }

    if (Object.keys(oldObject).length !== Object.keys(updatedObject).length) {
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
            }
            i++;
        }
    }

    return !foundDifferentValue;
}

export function arrayToObject(array, keyField, arrayDuplicates) {
    return array.reduce((obj, item) => {
        if(arrayDuplicates && item[keyField] in obj){
            obj[item[keyField]] = [obj[item[keyField]], item]
        } else {
            obj[item[keyField]] = item;
        }
        return obj;
    }, {});
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
