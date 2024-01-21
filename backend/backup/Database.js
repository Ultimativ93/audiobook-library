const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        const dbFilePath = path.resolve(__dirname, 'audiopaths.db');
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.error(`Error while opening database: ${dbFilePath}: ${err.message}`);
            } else {
                console.log(`Connected with database: ${dbFilePath}`);
                this.initialize();
            }
        });
    }


    // Initializing database and creating a table "audioPaths" if doesnt exist
    initialize() {
        this.db.serialize(() => {
            this.db.run('CREATE TABLE IF NOT EXISTS audioPaths (id INTEGER PRIMARY KEY, audioPath TEXT)', (err) =>{
                if (err) {
                    console.log(`Error while creating table: ${err}`)
                } else {
                    console.log('Created table "audioFiles" or it already excists');
                }
            });
        });
    }

    // Adding an audioPath into audioPaths in the database
    addFilePath(filePath) {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO audioPaths (audioPath) VALUES (?)', [filePath], function (err) {
                if (err) {
                    reject(err.message);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    // Removing all audioPath in audioPaths into the database
    removeAllFilePaths() {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM audioPaths', function (err) {
                if (err) {
                    reject(err.message);
                } else {
                    console.log('Deleted all audioPaths entrys from the database.')
                    resolve();
                }
            })
        })
    }

    // Get all audioPath from audioPaths
    getAllFilePaths() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT audioPath FROM audioPaths', [], (err, rows) => {
                if (err) {
                    reject(err.message);
                } else {
                    resolve(rows.map(row => row.audioPath));
                }
            });
        });
    }

    // Closing database
    close() {
        this.db.close((err) => {
            if (err) {
                console.error(`Error while closing database: ${err.message}`);
            } else {
                console.log('Database succesfully closed.');
            }
        });
    }
}

module.exports = Database;
