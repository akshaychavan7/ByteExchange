// input must be a 24 character hex string, 12 byte Uint8Array, or an integer
const validateId = (id) => {
    if (typeof id === "string" && id.match(/^[0-9a-fA-F]{24}$/)) {
        return true;
    } else if (id instanceof Uint8Array && id.length === 12) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    validateId
};
