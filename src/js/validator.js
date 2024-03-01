const isDataValid = (fieldName,pattern) => {
    if(!fieldName.trim()) return false;

    return pattern.test(fieldName);
}


export default isDataValid;