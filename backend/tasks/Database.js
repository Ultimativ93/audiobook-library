const sqlite3 = require('sqlite3').verbose();
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
            this.db.run('CREATE TABLE IF NOT EXISTS audioPaths (id INTEGER PRIMARY KEY, audioPath TEXT, audioName TEXT, audiobookTitle TEXT, audioCategory TEXT, uploadDate TEXT)', (err) => {
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

            this.db.run('CREATE TABLE IF NOT EXISTS validatedFlows (id INTEGER PRIMARY KEY, flowData TEXT, flowKey TEXT, thumbnail TEXT, description TEXT, length TEXT, keywords TEXT, title TEXT)', (err) => {
                if (err) {
                    console.log('Error while creating table validatedFlows: ', err);
                } else {
                    console.log('Created table "validatedFlows" or it already exists');
                }
            })

            this.db.run('CREATE TABLE IF NOT EXISTS tutorials (id INTEGER PRIMARY KEY, tutorialName TEXT, tutorialData TEXT, tutorialVideoPath TEXT, tutorialThumbnailPath TEXT)', (err) => {
                if (err) {
                    console.log('Error while creating table tutorials: ', err);
                } else {
                    console.log('Created table "tutorials" or it already exists')
                }
            })
        });
    }

    // Adding an audioPath and audioName into audioPaths in the database
    addFilePath(filePath, audioName, audiobookTitle, category, uploadDate) {
        console.log('Adding file path to database:', filePath, ' with audioName: ', audioName, ' and category: ', category, 'and uploadData: ', uploadDate);

        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO audioPaths (audioPath, audioName, audiobookTitle, audioCategory, uploadDate) VALUES (?, ?, ?, ?, ?)', [filePath, audioName, audiobookTitle, category, uploadDate], function (err) {
                if (err) {
                    reject(err.message);
                } else {
                    console.log('File path successfully added to the database:', filePath, ' with audioName: ', audioName);
                    resolve(this.lastID);
                }
            });
        });
    }

    // Change Category of an audioFile
    changeCategory(fileName, category, audiobookTitle) {
        console.log('Updating category', fileName, category);

        return new Promise((resolve, reject) => {
            this.db.run('UPDATE audioPaths SET audioCategory = ? WHERE audioName = ? AND audiobookTitle = ?', [category, fileName, audiobookTitle], function (err) {
                if (err) {
                    console.error('Error updating category:', err);
                    reject(err);
                } else {
                    console.log(`Category updated for file ${fileName}`);
                    resolve(category);
                }
            });
        });
    }

    // Change audioName
    changeAudioName(audiobookTitle, audioName, newAudioName) {
        console.log(`Changing audio name from ${audioName} to ${newAudioName} for audiobook ${audiobookTitle}`);

        return new Promise((resolve, reject) => {
            this.db.run('UPDATE audioPaths SET audioName = ? WHERE audioName = ? AND audiobookTitle = ?', [newAudioName, audioName, audiobookTitle], function (err) {
                if (err) {
                    console.error('Error updating audio name:', err);
                    reject(err);
                } else {
                    console.log(`Audio name updated successfully from ${audioName} to ${newAudioName} for audiobook ${audiobookTitle}`);
                    resolve(newAudioName);
                }
            });
        });
    }

    // Change graphic name in details
    changeDetailsGraphicName(audiobookTitle, audioName, newAudioName) {
        console.log(`Changing graphic name from ${audioName} to ${newAudioName} for audiobook ${audiobookTitle} in details`);

        return new Promise((resolve, reject) => {
            this.db.get('SELECT detailData FROM details WHERE audiobookTitle = ?', [audiobookTitle], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!row || !row.detailData) {
                    reject(new Error(`No details found for audiobookTitle ${audiobookTitle}`));
                    return;
                }

                const detailData = JSON.parse(row.detailData);
                if (detailData.thumbnail || detailData.thumbnail !== '' || detailData.thumbnail === '') {
                    detailData.thumbnail = newAudioName;

                    const updatedDetailData = JSON.stringify(detailData);

                    this.db.run('UPDATE details SET detailData = ? WHERE audiobookTitle = ?', [updatedDetailData, audiobookTitle], (updateErr) => {
                        if (updateErr) {
                            reject(updateErr);
                            return;
                        }

                        resolve(true);
                    });
                } else {
                    resolve(false);
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

    // Deleting a file path from audioPaths in the database for a specific audiobookTitle
    deleteFilePath(file, audiobookTitle) {
        console.log(`Deleting file path '${file}' from audioPaths for audiobook '${audiobookTitle}'`);

        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM audioPaths WHERE audioName = ? AND audiobookTitle = ?', [file, audiobookTitle], function (err) {
                if (err) {
                    reject(err.message);
                } else {
                    console.log(`Deleted file path '${file}' from the database for audiobook '${audiobookTitle}'.`);
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
        console.log('Adding audiobook details to database', audiobookDetails, ' with audiobookTitle: ', audiobookTitle);

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

    // Removing all audioPath in audioPaths from the database
    removeAllFilePaths() {
        console.log('Deleting all file paths');

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
        console.log('Getting all file paths with audiobookTitle', audiobookTitle);

        return new Promise((resolve, reject) => {
            this.db.all('SELECT audioPath, audioName, audioCategory FROM audioPaths WHERE audiobookTitle = ?', [audiobookTitle], (err, rows) => {
                if (err) {
                    reject(err.message);
                } else {
                    console.log('All filePaths with the audiobookTitle: ', audiobookTitle)
                    resolve(rows);
                }
            });
        });
    }

    // Get thumbnail path from details.
    getThumbnailName(audiobookTitle) {
        //console.log('Getting thumbnail path for audiobook title:', audiobookTitle);

        return new Promise((resolve, reject) => {
            this.db.get('SELECT detailData FROM details WHERE audiobookTitle = ?', [audiobookTitle], (err, row) => {
                if (err) {
                    reject(err.message);
                    return;
                }

                if (!row || !row.detailData) {
                    reject(new Error(`No details found for audiobookTitle ${audiobookTitle}`));
                    return;
                }

                const detailData = JSON.parse(row.detailData);
                const thumbnailPath = detailData.thumbnail;

                if (!thumbnailPath) {
                    reject(new Error(`No thumbnail found for audiobookTitle ${audiobookTitle}`));
                    return;
                }

                resolve(thumbnailPath);
            });
        });
    }

    // Get single audioPath from audioPaths for a specific audiobookTitle
    getFilePath(audioName, audiobookTitle) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT audioPath FROM audioPaths WHERE audioName = ? AND audiobookTitle = ?', [audioName, audiobookTitle], (err, row) => {
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

    // Save validated Flow to the database
    saveValidatedFlow(flow, flowKey, thumbnail, description, length, keywords, title) {
        console.log('Saving validated flow to database: ', flow);

        return new Promise((resolve, reject) => {
            this.db.get('SELECT id FROM validatedFlows WHERE flowKey = ?', [flowKey], (err, row) => {
                if (err) {
                    reject(err.message);
                    return;
                }

                if (row) {
                    this.db.run('UPDATE validatedFlows SET flowData = ?, thumbnail = ?, description = ?, length = ?, keywords = ?, title = ? WHERE flowKey = ?', [JSON.stringify(flow), thumbnail, description, length, keywords, title, flowKey], (updateErr) => {
                        if (updateErr) {
                            reject(updateErr.message);
                        } else {
                            console.log('Validated flow successfully updated in the database:', flow);
                            resolve(row.id);
                        }
                    });
                } else {
                    this.db.run('INSERT INTO validatedFlows (flowData, flowKey, thumbnail, description, length, keywords, title) VALUES (?, ?, ?, ?, ?, ?, ?)', [JSON.stringify(flow), flowKey, thumbnail, description, length, keywords, title], (insertErr) => {
                        if (insertErr) {
                            reject(insertErr.message);
                        } else {
                            console.log('Updated Flow successfully added to the database: ', flow);
                        }
                    });
                }
            });
        });
    }

    // Get Title of a validatedFlow
    getValidatedFlowTitle(title) {
        console.log('Checking if title exists:', title);

        return new Promise((resolve, reject) => {
            this.db.get('SELECT id FROM validatedFlows WHERE flowKey = ?', [title], (err, row) => {
                if (err) {
                    reject(err.message);
                    return;
                }

                if (row) {
                    console.log('Title already exists:', title);
                    resolve(true);
                } else {
                    console.log('Title does not exist:', title);
                    resolve(false);
                }
            });
        });
    }

    // Get validatedFlow from the table validatedFlows
    getValidatedFlow(title) {
        console.log('Get validatedFlow with audiobookTitle: ', title);

        return new Promise((resolve, reject) => {
            this.db.get('SELECT id, flowData, flowKey, thumbnail, description, length, keywords, title FROM validatedFlows WHERE flowKey = ?', [title], (err, row) => {
                if (err) {
                    reject(err.message);
                    return;
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Gets flow with from the table flow
    getFlow(flowKey) {
        console.log('Get flow with flowkey: ', flowKey);

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

    // Get all flows from the flows table
    getAllFlows() {
        console.log('Get all flows');

        return new Promise((resolve, reject) => {
            this.db.all('SELECT id, flowData, flowKey FROM flows', [], (err, rows) => {
                if (err) {
                    reject(err.message);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get all validated Flows from the validatedFlows table
    getAllValidatedFlows() {
        console.log('Get all validated flows')
        
        return new Promise((resolve, reject) => {
            this.db.all('SELECT id, flowData, flowKey, thumbnail, description, length, keywords, title FROM validatedFlows', [], (err, rows) => {
                if (err) {
                    reject(err.message);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get all details from details
    getAllDetails() {
        console.log('Get all details');

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
        console.log('AudiobookTitle in getDetailsByTitle: ', audiobookTitle)

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
        console.log('AudiobookTitle in changeDetailsByTitle: ', audiobookTitle, ' details: ', audiobookDetails);

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

    // Get all file names and category from the database
    getAllFileNames(audiobookTitle) {
        console.log('Get all filenames with audiobookTitle: ', audiobookTitle);

        return new Promise((resolve, reject) => {
            this.db.all('SELECT audioName, audioCategory, uploadDate FROM audioPaths WHERE audiobookTitle = ?', [audiobookTitle], (err, rows) => {
                if (err) {
                    reject(err.message);
                } else {
                    const fileData = rows.map(row => ({ name: row.audioName, category: row.audioCategory, uploadDate: row.uploadDate }));
                    resolve(fileData);
                }
            });
        });
    }


    // Get all grafic names from the database
    getAllGraficFileNames(audiobookTitle) {
        console.log('Get all grafic names with the audiobookTitle: ', audiobookTitle)

        return new Promise((resolve, reject) => {
            this.db.all('SELECT audioName FROM audioPaths WHERE audiobookTitle = ?', [audiobookTitle], (err, rows) => {
                if (err) {
                    reject(err.message);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get all tutorials from the database
    getAllTutorials() {
        console.log('Get all tutorials')

        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM tutorials', (err, rows) => {
                if (err) {
                    reject(err.message);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getAllCategories(title) {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT detailData FROM details WHERE audiobookTitle = ?', [title], (err, rows) => {
                if (err) {
                    reject(err.message);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    

    // Closing database
    close() {
        console.log('Closing the database')

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
