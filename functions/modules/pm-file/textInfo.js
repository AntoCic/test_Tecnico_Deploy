export default class TextInfo {
    // function to get number of totals word
    numWords(text = "") {
        text = text.replace(/[^a-zA-Z ]/g, "");
        text = text.replace(/\s+/g, ' ')
        const words = text.trim().split(" ");
        return words.length
    }
    // function to get number of totals letters
    numLetters(text = "") {
        text = text.replace(/\s+/g, '')
        text = text.replace(/[^a-zA-Z ]/g, "");
        return text.length
    }
    // function to get number of totals spaces
    numWhiteSpaces(text = "") {
        const words = text.split(" ");
        return words.length - 1
    }
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
    }
}