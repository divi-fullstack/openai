export function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export function getSearchParam(param) {
    // Get the full query string from the URL
    const queryString = window.location.search;

    // Use URLSearchParams to parse the query string
    const urlParams = new URLSearchParams(queryString);

    // Get the value of the specified parameter
    const paramValue = urlParams.get(param);

    return paramValue;
}
