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
            this.db.run('CREATE TABLE IF NOT EXISTS audioPaths (id INTEGER PRIMARY KEY, audioPath TEXT, audioName TEXT, audiobookTitle TEXT)', (err) => {
                if (err) {
                    console.log('Error while creating table audioFiles: ', err);
                } else {
                    console.log('Created table "audioFiles" or it already excists');
                }
            });

            // Creating table flows
            this.db.run('CREATE TABLE IF NOT EXISTS flows (id INTEGER PRIMARY KEY, flowData TEXT, flowKey TEXT)', (err) => {
                if (err) {
                    console.log('Error while creating table flows: ', err);
                } else {
                    console.log('Created table "flows" or it already exists');
                }
            })

            // Creating table details
            this.db.run('CREATE TABLE IF NOT EXISTS details (id INTEGER PRIMARY KEY, detailData TEXT, audiobookTitle TEXT)', (err) => {
                if (err) {
                    console.log('Error while creating table details: ', err);
                } else {
                    console.log('Created table "details" or it already exists')
                }
            })
        });
    }

    // Adding an audioPath and audioName into audioPaths in the database
    addFilePath(filePath, audioName, audiobookTitle) {
        console.log('Adding file path to database:', filePath);
        console.log('Adding audio name to database:', audioName);

        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO audioPaths (audioPath, audioName, audiobookTitle) VALUES (?, ?, ?)', [filePath, audioName, audiobookTitle], function (err) {
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

    // Deleting audioPaths and audioNames from audioPaths in the database
    deletePath(audiobookTitle) {
        console.log('Deleting audioPaths with audiobookTitle:', audiobookTitle);

        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM audioPaths WHERE audiobookTitle = ?', [audiobookTitle], function (err) {
                if (err) {
                    reject(err.message);
                } else {
                    console.log(`Deleted all audioPaths with audiobookTitle '${audiobookTitle}' from the database.`);
                    resolve();
                }
            });
        });
    }

    // Deleting a file path from audioPaths in the database
    deleteFilePath(file) {
        console.log('Deleting file path from audioPaths:', file);

        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM audioPaths WHERE audioName = ?', [file], function (err) {
                if (err) {
                    reject(err.message);
                } else {
                    console.log(`Deleted file path '${file}' from the database.`);
                    resolve();
                }
            });
        });
    }

    // Deleting a flow from flows in the database
    deleteFlow(audiobookTitle) {
        console.log('Deleting flow with audiobookTitle:', audiobookTitle);

        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM flows WHERE flowKey = ?', [audiobookTitle], function (err) {
                if (err) {
                    reject(err.message);
                } else {
                    console.log(`Deleted flow with flowKey '${audiobookTitle}' from the database.`);
                    resolve();
                }
            });
        });
    }

    // Deletes a detail with the name of audiobookTitle from the databse
    deleteDetail(audiobookTitle) {
        console.log('Deleting detail with audiobookTitle:', audiobookTitle);

        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM details WHERE audiobookTitle = ?', [audiobookTitle], function (err) {
                if (err) {
                    reject(err.message);
                } else {
                    console.log(`Deleted detail with audiobookTitle '${audiobookTitle}' from the database.`);
                    resolve();
                }
            });
        });
    }

    // Get File Path by Title from the audiobook
    getFilePathsByTitle(audiobookTitle) {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT audioPath FROM audioPaths WHERE audiobookTitle = ?', [audiobookTitle], (err, rows) => {
                if (err) {
                    reject(err.message);
                } else {
                    const filePaths = rows.map(row => row.audioPath);
                    resolve(filePaths);
                }
            });
        });
    }

    // Adding audiobook details into details
    addDetails(audiobookDetails, audiobookTitle) {
        console.log('Adding audiobook details to database', audiobookDetails);
        console.log('Adding audiobook title to database', audiobookDetails);

        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO details (detailData, audiobookTitle) VALUES (?, ?)', [JSON.stringify(audiobookDetails), audiobookTitle], function (err) {
                if (err) {
                    reject(err.message);
                } else {
                    console.log('Audiobook Details successfully added to the database:', audiobookDetails);
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
    getAllFilePaths(audiobookTitle) {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT audioPath, audioName FROM audioPaths WHERE audiobookTitle = ?', [audiobookTitle], (err, rows) => {
                if (err) {
                    reject(err.message);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get single audioPath from audioPaths
    getFilePath(audioName) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT audioPath FROM audioPaths WHERE audioName = ?', [audioName], (err, row) => {
                if (err) {
                    reject(err.message);
                } else {
                    const audioPath = row ? row.audioPath : null;
                    resolve(audioPath);
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

    // Get all details from details
    getAllDetails() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT id, detailData, audiobookTitle FROM details', [], (err, rows) => {
                if (err) {
                    reject(err.message);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get details by title from details
    getDetailsByTitle(audiobookTitle) {
        console.log("AudiobookTitle in getDetailsByTitle", audiobookTitle)
        return new Promise((resolve, reject) => {
            this.db.get('SELECT detailData FROM details WHERE audiobookTitle = ?', [audiobookTitle], (err, row) => {
                if (err) {
                    reject(err.message);
                } else {
                    const details = row ? JSON.parse(row.detailData) : null;
                    resolve(details);
                }
            });
        });
    }

    // Change details of exisiting details by title
    changeDetailsByTitle(audiobookDetails, audiobookTitle) {
        console.log("AudiobookTitle in changeDetailsByTitle", audiobookTitle);
        console.log("Details in changeDetailsByTitle", audiobookDetails);

        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE details SET detailData = ? WHERE audiobookTitle = ?',
                [JSON.stringify(audiobookDetails), audiobookTitle],
                function (err) {
                    if (err) {
                        console.error('Error updating audiobook details:', err);
                        reject(err);
                    } else {
                        console.log('Audiobook details updated successfully:', this.changes);
                        resolve(this.changes);
                    }
                }
            );
        });
    }

    getAllFileNames(audiobookTitle) {
        console.log("AudiobookTitle", audiobookTitle);

        return new Promise((resolve, reject) => {
            this.db.all('SELECT audioName FROM audioPaths WHERE audiobookTitle = ?', [audiobookTitle], (err, rows) => {
                if (err) {
                    reject(err.message);
                } else {
                    const fileNames = rows.map(row => row.audioName);
                    resolve(fileNames);
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
