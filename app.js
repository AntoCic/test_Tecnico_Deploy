const form = document.getElementById('form');
const labelFile = document.getElementById('label-file');
const inputFile = document.getElementById('input-file');
const inputUrl = document.getElementById('input-url');
const btnUrl = document.getElementById('btn-url');
const resultsBox = document.getElementById('results-box');

// check if the file has been uploaded.
// if uploaded fix the style and clean the results-box element
inputFile.addEventListener('change', () => {
    labelFile.classList.remove('btn-outline-secondary')
    labelFile.classList.add('btn-success')
    inputUrl.classList.remove('is-invalid')
    inputUrl.value = `Hai caricato il file "${inputFile.files[0].name}"`;
    // Clear page
    while (resultsBox.firstChild) {
        resultsBox.firstChild.remove();
    }
    if (document.getElementById('fullFile')) {
        document.getElementById('fullFile').remove();
    }

});

// Check if someone is typing in the input.
// If someone is typing fix the style and cleans the file input
inputUrl.addEventListener('input', () => {
    labelFile.classList.add('btn-outline-secondary')
    labelFile.classList.remove('btn-success')
    inputUrl.classList.remove('is-invalid')
    inputFile.value = '';
});

// Main submit function
// gets the form content and submits it to get the processed results
form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (inputFile.value !== '') { // if try to get result from local file
        let reader = new FileReader(); // built in 
        reader.readAsText(event.target[0].files[0]); // Read the first file as text.
        reader.onload = async () => { // onload file
            const fileStr = reader.result;
            fetch('/api/function/strfile', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileStr })
            })
                .then((response) => response.json())
                .then((res) => {
                    console.log(res);
                    // showResults(res, inputUrl.value.trim())
                    // resetForm()
                })
                .catch((err) => {
                    console.log(err);
                    inputUrl.classList.add('is-invalid')
                })
        };


    } else { // if try to get result from web url file
        fetch('/api/function/urlfile', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileUrl: inputUrl.value.trim() })
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                // showResults(res, inputUrl.value.trim())
                // resetForm()
            })
            .catch((err) => {
                console.log(err);
                inputUrl.classList.add('is-invalid')
            })
    }
});

// Function to clear and popolate with the results the results-box element in the DOM
function showResults(infoText, resource) {
    // Clear page
    while (resultsBox.firstChild) {
        resultsBox.firstChild.remove();
    }
    if (document.getElementById('fullFile')) {
        document.getElementById('fullFile').remove();
    }

    // Show total words
    if (infoText.numWords) {
        const totalWords = document.createElement("li");
        totalWords.classList.add('list-group-item');
        totalWords.textContent = "Numero totale di parole: " + infoText.numWords
        resultsBox.appendChild(totalWords);
    }

    // Show number of letters
    if (infoText.numLetters) {
        const totalChars = document.createElement("li");
        totalChars.classList.add('list-group-item');
        totalChars.textContent = "Numero di lettere: " + infoText.numLetters
        resultsBox.appendChild(totalChars);
    }

    // Show number of whitespaces
    if (infoText.numWhiteSpaces) {
        const totalWhiteSpaces = document.createElement("li");
        totalWhiteSpaces.classList.add('list-group-item');
        totalWhiteSpaces.textContent = "Numero di spazi: " + infoText.numWhiteSpaces
        resultsBox.appendChild(totalWhiteSpaces);
    }

    // Show recurring words and the relative number
    if (infoText.numRecurringWords.length) {
        const recurringWords = document.createElement("li");
        recurringWords.classList.add('list-group-item');
        recurringWords.innerHTML = "Parole che si ripetono più di 10 volte: <br/>" + infoText.numRecurringWords.join('<br/>')
        resultsBox.appendChild(recurringWords);
    }

    // Show full file
    if (infoText.fileStr) {
        const fullFile = document.createElement("p");
        fullFile.setAttribute("id", "fullFile");
        fullFile.innerHTML = `
                <div class="position-relative border rounded p-3 pt-4 mt-4 text-white">
                    <span class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-white text-dark fs-5 mw-100 overflow-x-hidden">
                        Testo file "${resource}"
                    </span>
                    ${infoText.fileStr}
                </div>
        `
        resultsBox.insertAdjacentElement('afterend', fullFile);
    }
}

// Function to reset form
function resetForm() {
    labelFile.classList.add('btn-outline-secondary')
    labelFile.classList.remove('btn-success')
    inputUrl.classList.remove('is-invalid')
    inputFile.value = '';
    inputUrl.value = '';
}
