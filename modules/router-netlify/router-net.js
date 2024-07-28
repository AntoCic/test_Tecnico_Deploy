export default {
    isSecondSet: false,
    event: null,
    response: null,
    stateError: false,
    statusCode: 200,

    pathParams: [],

    start(event) {
        this.event = event
        this.stateError = false;
        this.statusCode = 200;
        this.isSecondSet = false;
        this.clearRes();

        this.pathParams = this.getPathParams();
    },

    isStarted() {
        if (this.event && !this.stateError) {
            return true
        } else {
            console.error('ERROR 500: non hai inizializzato il router');
            this.error(500, 'ERROR 500: non hai inizializzato il router')
            return false
        }
    },

    setRes(response) {
        if (this.isStarted()) {
            if (this.response) {
                if (this.isSecondSet) {
                    this.response = [this.response]
                    this.isSecondSet = false
                }
                this.response.push(response)

            } else {
                this.response = response
                this.isSecondSet = true
            }
        }
    },

    clearRes() {
        if (this.isStarted()) {
            this.response = null
        }
    },

    error(statusCode = 400, error = 'Errore: 400 Bad Request') {
        this.stateError = true
        this.response = error;
        this.statusCode = statusCode
    },

    sendRes() {
        return {
            statusCode: this.statusCode,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.response),
        }
    },

    getPathParams() {
        if (this.isStarted()) {
            const params = this.event.path.split("/")
            if (params.length > 3) {
                for (let index = 0; index < 3; index++) {
                    params.shift();
                }

                return params[0].trim() !== "" ? params : false
            } else {
                return false
            }
        }
    },

    params(index = 0) {
        if (this.pathParams.length >= index + 1) {
            return this.pathParams[index]
        } else {
            return false
        }

    },

    async GET(pathParam, ArrowFunction) {
        if (this.event.httpMethod === 'GET') {
            if (pathParam === this.params() || !this.params()) {
                return await ArrowFunction();
            } else {
                return false
            }
        } else {
            return false
        }
    },
    async POST(pathParam, ArrowFunction) {
        if (this.event.httpMethod === 'POST') {
            if (pathParam === this.params() || !this.params()) {
                return await ArrowFunction();
            } else {
                return false
            }
        } else {
            return false
        }
    },
    async PUT(pathParam, ArrowFunction) {
        if (this.event.httpMethod === 'PUT') {
            if (pathParam === this.params() || !this.params()) {
                return await ArrowFunction();
            } else {
                return false
            }
        } else {
            return false
        }
    },
    async PATCH(pathParam, ArrowFunction) {
        if (this.event.httpMethod === 'PATCH') {
            if (pathParam === this.params() || !this.params()) {
                return await ArrowFunction();
            } else {
                return false
            }
        } else {
            return false
        }
    },
    async DELETE(pathParam, ArrowFunction) {
        if (this.event.httpMethod === 'DELETE') {
            if (pathParam === this.params() || !this.params()) {
                return await ArrowFunction();
            } else {
                return false
            }
        } else {
            return false
        }
    },


}