const handleError = (error) => {
    const errorObject = JSON.parse(error.message);
    const errorObjectKeys = Object.keys(errorObject);
    const errorName = errorObjectKeys[errorObjectKeys.length - 1];
    const errorValue = errorObject[errorName];

    return { errorObject, errorValue,errorName };
}


export default handleError;