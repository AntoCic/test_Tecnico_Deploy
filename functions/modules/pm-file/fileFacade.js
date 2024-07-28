import FileReader from './fileReader.js'
import TextInfo from './textInfo.js'
// MAIN MODULE CLASS
class FileFacade {
    constructor() {
        this.fileReader = new FileReader();
        this.textInfo = new TextInfo();
    }
    // function to get object with string details from local file path
    async processPath(filePath) {
        try {
            const fileStr = await this.fileReader.readPath(filePath);
            return this.textResult(fileStr)
        } catch (error) {
            console.error('Error processing file: ', error);
            return false
        }
    }
    // function to get object with string details from web url 
    async processUrl(fileUrl) {
        try {
            const fileStr = await this.fileReader.readUrl(fileUrl);
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
    }
    // function to get object with string details from web url 
    async processStr(fileStr) {
        if (fileStr !== '') {
            return this.textResult(fileStr)
        } else {
            console.error('Error processing file: Errore: 500 Empty text');
            return false
        }
    }
    // function to get object from string with its details
    textResult(fileStr) {
        const numWords = this.textInfo.numWords(fileStr);
        const numLetters = this.textInfo.numLetters(fileStr);
        const numWhiteSpaces = this.textInfo.numWhiteSpaces(fileStr);
        const numRecurringWords = this.textInfo.numRecurringWords(fileStr, 10);
        return {
            fileStr,
            numWords,
            numLetters,
            numWhiteSpaces,
            numRecurringWords
        };
    }
}
// Initializing fileProcessor with the class FileFacade
const fileFacade = new FileFacade();
export default fileFacade