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
            // Creating table audioPaths
            this.db.run('CREATE TABLE IF NOT EXISTS audioPaths (id INTEGER PRIMARY KEY, audioPath TEXT, audioName TEXT)', (err) => {
                if (err) {
                    console.log('Error while creating table: ', err);
                } else {
                    console.log('Created table "audioFiles" or it already excists');
                }
            });

            // Creating table flows
            this.db.run('CREATE TABLE IF NOT EXISTS flows (id INTEGER PRIMARY KEY, flowData TEXT, flowKey TEXT)', (err) => {
                if (err) {
                    console.log('Error while creating table: ', err);
                } else {
                    console.log('Created table "flows" or it already exists');
                }
            })
        });
    }

    // Adding an audioPath and audioName into audioPaths in the database
    addFilePath(filePath, audioName) {
        console.log('Adding file path to database:', filePath);
        console.log('Adding audio name to database:', audioName);

        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO audioPaths (audioPath, audioName) VALUES (?, ?)', [filePath, audioName], function (err) {
                if (err) {
                    reject(err.message);
                } else {
                    console.log('File path successfully added to the database:', filePath);
                    console.log('Audio name successfully added to the database:', audioName);
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
            this.db.all('SELECT audioPath, audioName FROM audioPaths', [], (err, rows) => {
                if (err) {
                    reject(err.message);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Saving flow in the table flows
    saveFlow(flow, flowKey) {
        console.log('Saving flow to database:', flow);
    
        return new Promise((resolve, reject) => {
            this.db.get('SELECT id FROM flows WHERE flowKey = ?', [flowKey], (err, row) => {
                if (err) {
                    reject(err.message);
                    return;
                }
    
                if (row) {
                    this.db.run('UPDATE flows SET flowData = ? WHERE flowKey = ?', [JSON.stringify(flow), flowKey], (updateErr) => {
                        if (updateErr) {
                            reject(updateErr.message);
                        } else {
                            console.log('Flow successfully updated in the database:', flow);
                            resolve(row.id);
                        }
                    });
                } else {
                    this.db.run('INSERT INTO flows (flowData, flowKey) VALUES (?, ?)', [JSON.stringify(flow), flowKey], (insertErr) => {
                        if (insertErr) {
                            reject(insertErr.message);
                        } else {
                            console.log('Flow successfully added to the database:', flow);
                            resolve(this.lastID);
                        }
                    });
                }
            });
        });
    }

    // Gets flow with from the table flow
    getFlow(flowKey) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT flowData FROM flows WHERE flowKey = ?', [flowKey], (err, row) => {
                if (err) {
                    reject(err.message);
                } else {
                    const flow = row ? JSON.parse(row.flowData) : null;
                    resolve(flow);
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
