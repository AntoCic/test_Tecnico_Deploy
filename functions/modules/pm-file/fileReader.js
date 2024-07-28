import fs from 'fs'
import path from 'path'

export default class FileReader {
    // Function to get string from local path
    async readPath(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path.resolve(filePath), 'utf-8', (err, data) => {
                if (err) {
                    return reject(err);
                }
                fs.unlinkSync(path.resolve(filePath));
                resolve(data);
            });
        });
    }
    // Function to get string from web url 
    async readUrl(fileUrl) {
        return await fetch(fileUrl)
            .then((res) => res.text())
            .catch((e) => "Errore: 400 Bad Request");
    }
}