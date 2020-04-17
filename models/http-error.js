class HTTPError extends Error {
    constructor(message, code){
        super(message) //automatically adds a "message" property to each instance
        this.code = code
    }
}

module.exports = HTTPError