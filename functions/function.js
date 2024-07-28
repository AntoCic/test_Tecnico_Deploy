exports.handler = async function (event, context) {
    router.start(event);

    router.POST('strfile', async () => {
        const { fileStr } = JSON.parse(event.body)
        if (fileStr) {
            // process fileUrl
            const result = await FileFacade.processStr(fileStr);
            if (result) {
                // send response
                router.setRes(result)
            } else {
                router.error();
            }
        } else {
            router.error();
        }
    })

    await router.POST('urlfile', async () => {
        const { fileUrl } = JSON.parse(event.body)
        if (fileUrl) {
            // process fileUrl
            const result = await FileFacade.processUrl(fileUrl);
            if (result) {
                // send response
                router.setRes(result)
            } else {
                router.error();
            }
        } else {
            router.error();
        }
    })

    return router.sendRes()
};

const router = {
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

const FileFacade = {
    // function to get object with string details from web url 
    async processUrl(fileUrl) {
        try {
            const fileStr = await this.readUrl(fileUrl);
            if (fileStr !== 'Errore: 400 Bad Request') {
                return this.textResult(fileStr)
            } else {
                console.error('Error processing file: Errore: 400 Bad Request');
                return false
            }

        } catch (error) {
            console.error('Error processing file: ', error);
            return false
        }
    },
    // function to get object with string details from web url 
    async processStr(fileStr) {
        if (fileStr !== '') {
            return this.textResult(fileStr)
        } else {
            console.error('Error processing file: Errore: 500 Empty text');
            return false
        }
    },
    // function to get object from string with its details
    textResult(fileStr) {
        const numWords = this.numWords(fileStr);
        const numLetters = this.numLetters(fileStr);
        const numWhiteSpaces = this.numWhiteSpaces(fileStr);
        const numRecurringWords = this.numRecurringWords(fileStr, 10);
        return {
            fileStr,
            numWords,
            numLetters,
            numWhiteSpaces,
            numRecurringWords
        };
    },
    async readUrl(fileUrl) {
        return await fetch(fileUrl)
            .then((res) => res.text())
            .catch((e) => "Errore: 400 Bad Request");
    },
    numWords(text = "") {
        text = text.replace(/[^a-zA-Z ]/g, "");
        text = text.replace(/\s+/g, ' ')
        const words = text.trim().split(" ");
        return words.length
    },
    // function to get number of totals letters
    numLetters(text = "") {
        text = text.replace(/\s+/g, '')
        text = text.replace(/[^a-zA-Z ]/g, "");
        return text.length
    },
    // function to get number of totals spaces
    numWhiteSpaces(text = "") {
        const words = text.split(" ");
        return words.length - 1
    },
    // function to get object with totals recurring words with relative number of occurrences
    // if the number of occurrences is up to quantity 
    // quantity default is 10
    numRecurringWords(text = "", quantity = 10) {
        text = text.replace(/[^a-zA-Z ]/g, "");
        text = text.replace(/\s+/g, ' ')
        const words = text.trim().split(" ");

        let wordsObject = {}
        words.forEach(element => {
            if (wordsObject[element]) {
                wordsObject[element]++
            } else {
                wordsObject[element] = 1
            }
        });
        let filtredWords = []
        for (const key in wordsObject) {
            if (wordsObject[key] > quantity) {
                filtredWords.push(key + ": " + wordsObject[key])
            }
        }

        return filtredWords
    },
}