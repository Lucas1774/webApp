export const handleError = (prefix, error) => {
    const message = error.response?.data ? error.response.data : error.message
    alert(prefix + ": " + message);
}