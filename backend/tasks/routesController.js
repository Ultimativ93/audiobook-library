const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const Database = require('../tasks/Database');

const router = new Router();
const db = new Database();

// The routes controller manages backend routes and enables communication between the frontend and backend.
// It processes the provided data, storing it in the database, and manages files on the server.

router.post('/upload', async (ctx) => {
    console.log('Uploaded files:', ctx.request.files, ' Audiobook Name in Backend: ', ctx.request.body.audiobookTitle, ' Category in Backend: ', ctx.request.body.category, ' Upload Date: ', ctx.request.body.uploadDate);
    const files = ctx.request.files && (Array.isArray(ctx.request.files.files) ? ctx.request.files.files : [ctx.request.files.files]);
    const audiobookTitle = ctx.request.body.audiobookTitle;
    const category = ctx.request.body.category;
    const uploadDate = ctx.request.body.uploadDate;
    if (files && files.length > 0) {
        try {
            const databaseResponses = [];
            for (const file of files) {
                console.log('File:', file);
                const fileName = file.originalFilename;
                const relativePath = 'uploads/' + file.filepath.replace(/^.*uploads[\\/]/, '');
                const databaseResponse = await db.addFilePath(relativePath, fileName, audiobookTitle, category, uploadDate);
                databaseResponses.push(databaseResponse);
            }
            console.log('Files successfully uploaded and paths saved in the database.');
            ctx.status = 200;
            ctx.type = 'application/json';
            ctx.body = { success: true, message: 'Files uploaded successfully', databaseResponses };
        } catch (error) {
            console.error('Error:', error);
            ctx.status = 500;
            ctx.type = 'application/json';
            ctx.body = { success: false, message: 'Internal Server Error' };
        }
    } else {
        ctx.status = 400;
        ctx.type = 'application/json';
        ctx.body = { success: false, message: 'Bad Request: No files provided' };
    }
});

// Change Category of and audio file
router.post('/updateCategory', async (ctx) => {
    try {
        console.log('Trying to update category');
        const { fileName, category, audiobookTitle } = ctx.request.body;
        const changedCategory = await db.changeCategory(fileName, category, audiobookTitle)
        ctx.status = 200;
        ctx.body = { success: true, message: 'Category updated successfully.', changedCategory }
    } catch (error) {
        console.error('Error updating category:', error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'Internal Server Error while updating category' };
    }
});

// Save flow with flowKey
router.post('/saveFlow', async (ctx) => {
    const { flow, flowKey } = ctx.request.body;
    try {
        const savedFlowId = await db.saveFlow(flow, flowKey);
        ctx.status = 200;
        ctx.body = { success: true, message: 'Flow saved successfully', savedFlowId };
    } catch (error) {
        console.error('Error saving flow on server: ', error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'Internal Server Error while saving Flow' };
    }
});

// Save Validated Flow on the server
router.post('/saveValidatedFlow', async (ctx) => {
    const { flow, flowKey, thumbnail, description, length, keywords, title } = ctx.request.body;
    try {
        const savedFlowId = await db.saveValidatedFlow(flow, flowKey, thumbnail, description, length, keywords, title);
        ctx.status = 200;
        ctx.body = { success: true, message: 'Flow saved successfully', savedFlowId }
    } catch (error) {
        console.error('Error saving Validated Flow: ', error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'Internal Server Error while saving Validated Flow' };
    }
});

// Get validated Flow with audiobookTitle
router.get('/getValidateFlowTitle', async (ctx) => {
    const { title } = ctx.request.query;
    try {
        const titleExists = await db.getValidatedFlowTitle(title);
        ctx.status = 200;
        ctx.body = { exists: titleExists };
    } catch (error) {
        console.error('Error validating flow title:', error);
        ctx.status = 500;
        ctx.body = { error: 'Internal Server Error while validating flow title.' };
    }
});

// Get validated flow from the server
router.get('/getValidatedFlow', async (ctx) => {
    const { title } = ctx.request.query;
    try {
        const validatedFlow = await db.getValidatedFlow(title);
        ctx.status = 200;
        ctx.body = { validatedFlow: validatedFlow }
    } catch (error) {
        console.error('Error fetching validated flow:', error)
        ctx.status = 500;
        ctx.body = { error: 'Internal Server Error while validating flow title.' };
    }
});

// Get all validated flows from the backend
router.get('/getAllValidatedFlows', async (ctx) => {
    try {
        const allValidatedFlows = await db.getAllValidatedFlows();
        ctx.status = 200;
        ctx.body = { allValidatedFlows: allValidatedFlows }
    } catch (error) {
        console.error('Error fetchin all validated flows:', error);
        ctx.status = 500;
        ctx.body = { error: 'Internal Server Error while fetching all validated flows.' }
    }
});

// Get all flows from the backend
router.get('/getAllFlows', async (ctx) => {
    try {
        const allFlows = await db.getAllFlows();
        ctx.status = 200;
        ctx.body = { allFlows: allFlows }
    } catch (error) {
        console.error('Error fetching all flows:', error);
        ctx.status = 500;
        ctx.body = { error: 'Internal Server Error while fetching all flows.' };
    }
});

// Delete paths with audiobookTitle
router.post('/deletePaths', async (ctx) => {
    const audiobookTitle = ctx.request.body;
    console.log('Audiobook Title to delete audioPaths: ', audiobookTitle);
    try {
        const deletedPaths = await db.deletePath(audiobookTitle);
        ctx.status = 200;
        ctx.body = { success: true, message: 'AudiPaths deleted successfully', deletedPaths }
    } catch (error) {
        console.error('Error deleting audioPaths');
        ctx.status = 500;
        ctx.body = { success: false, message: 'Internal Server Error while deleting Path' }
    }
});

// Delete files from the backend
router.post('/deleteFiles', async (ctx) => {
    const audiobookTitle = ctx.request.body;
    console.log('Audiobook Title to delete files: ', audiobookTitle);
    try {
        const filePaths = await db.getFilePathsByTitle(audiobookTitle);
        console.log('FilePaths in deleteFiles: ', filePaths)
        for (const filePath of filePaths) {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
        }
        ctx.status = 200;
        ctx.body = { success: true, message: 'Files deleted successfully' };
    } catch (error) {
        console.error('Error deleting files:', error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'Internal Server Error while deleting files' };
    }
});

// Delete flow with audiobookTitle
router.post('/deleteFlow', async (ctx) => {
    const audiobookTitle = ctx.request.body;
    console.log('AudiobookTitle to delete flow: ', audiobookTitle);
    try {
        const deletedFlow = await db.deleteFlow(audiobookTitle);
        ctx.status = 200;
        ctx.body = { success: true, message: 'Flow deleted successfully', deletedFlow }
    } catch (error) {
        console.error('Error deleting flow:', error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'Internal Server Error while deleting Flow' }
    }
});

// Delete details with audiobookTitle
router.post('/deleteDetail', async (ctx) => {
    const audiobookTitle = ctx.request.body;
    console.log('AudiobookTitle to delete detail: ', audiobookTitle);
    try {
        const deletedDetail = await db.deleteDetail(audiobookTitle);
        ctx.status = 200;
        ctx.body = { success: true, message: 'Detail deleted successfully', deletedDetail }
    } catch (error) {
        console.error('Error deleting detail:', error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'Internal Server Error while deleting Detail' }
    }
});

// Save audiobookDetails on the server
router.post('/saveAudiobookDetails', async (ctx) => {
    const { audiobookDetails } = ctx.request.body;
    console.log('AudiobookDeatils in saveAudiobookDetails: ', audiobookDetails);
    const audiobookTitle = audiobookDetails.title;
    try {
        const savedDetailsId = await db.addDetails(audiobookDetails, audiobookTitle);
        ctx.status = 200;
        ctx.body = { success: true, message: 'Audiobook details saved successfully', savedDetailsId };
    } catch (error) {
        console.error('Error saving audiobook details on server: ', error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'Internal Server Error' };
    }
});

// Delete files from the backend
router.post('/deleteFile', async (ctx) => {
    const { file, audiobookTitle } = ctx.request.body;
    console.log('Deleting file: ', file, 'for audiobookTitle: ', audiobookTitle);
    try {
        const filePath = await db.getFilePath(file, audiobookTitle);
        if (!filePath) {
            console.error('File not found in the database:', file);
            ctx.status = 404;
            ctx.body = { success: false, message: 'File not found' };
            return;
        }

        fs.unlinkSync(filePath);
        await db.deleteFilePath(file, audiobookTitle);

        console.log('File deleted successfully:', file);
        ctx.status = 200;
        ctx.body = { success: true, message: 'File deleted successfully' };
    } catch (error) {
        console.error('Error deleting file:', error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'Internal Server Error while deleting file' };
    }
});

// Getting all the audioPaths
router.get('/audioPaths', async (ctx) => {
    const { audiobookTitle } = ctx.request.query;
    console.log('Audiobooktitle to get all audioPaths: ', audiobookTitle);
    try {
        const allFilePaths = await db.getAllFilePaths(audiobookTitle);
        const audioFilePaths = allFilePaths.filter(file => {
            const fileName = file.audioName.toLowerCase();
            return (
                fileName.endsWith('.mp4') ||
                fileName.endsWith('.m4a') ||
                fileName.endsWith('.mp3') ||
                fileName.endsWith('.aac') ||
                fileName.endsWith('.ogg') ||
                fileName.endsWith('.mpeg')
            );
        });
        ctx.status = 200;
        ctx.body = audioFilePaths;
    } catch (error) {
        console.error('Error getting audio paths:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error, paths';
    }
});

// Get all grafic Paths for audiobookTitle
router.get('/graficPaths', async (ctx) => {
    const { audiobookTitle } = ctx.request.query;
    console.log('GraficPaths for audiobookTitle: ', audiobookTitle);
    try {
        const allFilePaths = await db.getAllFileNames(audiobookTitle);
        console.log('AllfilePaths in graficPaths: ', allFilePaths)
        const graficFilePaths = allFilePaths.filter(file => {
            const fileName = file.audioName.toLowerCase();
            return (
                fileName.endsWith('.png') ||
                fileName.endsWith('.jpeg') ||
                fileName.endsWith('.jpg')
            );
        });

        ctx.status = 200;
        ctx.body = graficFilePaths;
    } catch (error) {
        console.error('Error getting grafic paths:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error, paths';
    }
});

//Get all graphic names
router.get('/getAllGraficNames', async (ctx) => {
    const { audiobookTitle } = ctx.request.query;
    console.log('AudiobookTitle in getAllGraficNames: ', audiobookTitle)
    try {
        const allFileNames = await db.getAllGraficFileNames(audiobookTitle);
        console.log('AllFileNames in getAllGraficNames: ', allFileNames);
        const graficFileNames = allFileNames.filter(file => {
            const fileName = file.audioName.toLowerCase();
            return (
                fileName.endsWith('.png') ||
                fileName.endsWith('.jpeg') ||
                fileName.endsWith('.jpg')
            );
        });
        ctx.status = 200;
        ctx.body = graficFileNames;
    } catch (error) {
        console.error('Error getting all grafic names:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error, allGraficNames';
    }
});

// Get thumbnail path
router.get('/graficThumbnail', async (ctx) => {
    const { audiobookTitle } = ctx.request.query;
    console.log('AudiobookTitle in graficThumbnail: ', audiobookTitle);
    try {
        const thumbnailName = await db.getThumbnailName(audiobookTitle);
        if (thumbnailName) {
            const thumbnailPath = await db.getFilePath(thumbnailName, audiobookTitle);
            ctx.status = 200;
            ctx.body = thumbnailPath;
        } else {
            ctx.status = 404;
            ctx.body = 'No Thumbnail found in the database';
        }
    } catch (error) {
        console.error('Error gettin thumbnail path:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error, path';
    }
});

// Get names and categorys from the files in a flow
router.get('/getDataFromFlow', async (ctx) => {
    const { flowKey } = ctx.request.query;
    console.log('FlowKey in getDataFromFlow: ', flowKey);
    try {
        const allFileData = await db.getAllFileNames(flowKey);
        ctx.status = 200;
        ctx.body = allFileData;
    } catch (error) {
        console.error('Error getting data from flow: ', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error, data from flow';
    }
});

// Get flow with flowKey
router.get('/getFlow', async (ctx) => {
    const { flowKey } = ctx.request.query;
    console.log('GetFlow with flowKey: ', flowKey);
    try {
        const flow = await db.getFlow(flowKey);
        if (flow) {
            ctx.status = 200;
            ctx.body = flow;
        } else {
            console.warn('No flow found in the database');
            ctx.status = 404;
            ctx.body = 'No flow found in the database';
        }
    } catch (error) {
        console.error('Error getting flow from the database:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error, flow';
    }
});

// Get all Details
router.get('/getAllDetails', async (ctx) => {
    console.log('GetAllDetails from the server');
    try {
        const details = await db.getAllDetails();
        if (details) {
            ctx.status = 200;
            ctx.body = details;
        } else {
            console.warn('No details found in the database');
            ctx.status = 404;
            ctx.body = 'No details found in the database';
        }
    } catch (error) {
        console.error('Error getting all details from the database:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error, all details'
    }
});

// Get Audioname with audioName and audiobookTitle
router.get('/getAudioName', async (ctx) => {
    const { audioName, audiobookTitle } = ctx.request.query;
    console.log('AudioName in getAudioName, audiobookTitle: ', audioName, audiobookTitle)
    try {
        const audioNameFromPath = await db.getFilePath(audioName, audiobookTitle);
        if (audioNameFromPath) {
            ctx.status = 200;
            ctx.body = audioNameFromPath;
        } else {
            console.warn('No audio from path found in the database');
            ctx.status = 404;
            ctx.body = 'No audio from path found in the database';
        }
    } catch (error) {
        console.error('Error getting audio with path from the database:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
    }
});

// Get Audio from the backend
router.get('/getAudio', async (ctx) => {
    const { audioPath } = ctx.request.query;
    console.log('Get audio with audioPath: ', audioPath);
    try {
        const normalizedPath = audioPath.replace(/\\/g, path.sep);
        const relativePath = path.join('..', normalizedPath);
        console.log("Relative Path getAudio: ", relativePath);
        const absolutePath = path.resolve(__dirname, relativePath);
        console.log("Absolute Path getAudio: ", absolutePath);
        const stat = fs.statSync(absolutePath);
        ctx.response.status = 200;
        ctx.response.type = 'audio/ogg';
        ctx.response.length = stat.size;
        ctx.body = fs.createReadStream(absolutePath);
    } catch (error) {
        console.error(`Error getting audio with path ${audioPath} from the server`, error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
    }
});

// Get audiobookDetails from the backend
router.get('/getAudiobookDetails', async (ctx) => {
    const audiobookTitle = ctx.request.query.audiobookTitle;
    console.log('AudiobookTitle in getAudiobookDetails: ', audiobookTitle);
    try {
        const details = await db.getDetailsByTitle(audiobookTitle);
        if (details) {
            ctx.status = 200;
            ctx.body = details;
        } else {
            console.warn('No details found for the audiobook title:', audiobookTitle);
            ctx.status = 404;
            ctx.body = 'No details found for the audiobookTitle';
        }
    } catch (error) {
        console.error('Error getting audiobook details from the database:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
    }
});

// Change audioName in the database
router.post('/changeAudioName', async (ctx) => {
    const { audiobookTitle, audioName, newAudioName } = ctx.request.body;
    console.log('AudiobookTitle in changeAudioName, audioName: ', audiobookTitle, audioName);
    try {
        const changedName = await db.changeAudioName(audiobookTitle, audioName, newAudioName)
        if (changedName) {
            ctx.status = 200;
            ctx.body = changedName;
        } else {
            console.warn('No audioName found for the audiobookTitle and audioName', audiobookTitle, audioName)
            ctx.status = 404;
            ctx.body = `No audioName found for the audiobookTitle and audioName ${audiobookTitle}, ${audioName}`
        }
    } catch (error) {
        console.error('Error changing audioName in changeAudioName', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error'
    }
});

// Change details graphic name on the server
router.post('/changeDetailsGraphicName', async (ctx) => {
    const { audiobookTitle, audioName, newAudioName } = ctx.request.body;
    console.log('AudiobookTitle in changeDetailsGraphicName, audioName, newAudioname: ', audiobookTitle, audioName, newAudioName);
    try {
        const changedName = await db.changeDetailsGraphicName(audiobookTitle, audioName, newAudioName);
        if (changedName) {
            ctx.status = 200;
            ctx.body = changedName;
        } else {
            console.warn('No graphic found for the audiobookTitle and audioName in details', audiobookTitle, audioName);
            ctx.status = 404;
            ctx.body = `No graphic found for the audiobookTitle and audioName in details ${audiobookTitle}, ${audioName}`;
        }
    } catch (error) {
        console.error('Error changing graphic name in changeDetailsGraphicName', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error'
    }
});

// Change details with audiobookTitle
router.post('/changeDetails', async (ctx) => {
    const { audiobookDetails, audiobookTitle } = ctx.request.body;
    console.log('AudiobookTitle in changeDetails: ', audiobookTitle);
    try {
        const details = await db.changeDetailsByTitle(audiobookDetails, audiobookTitle);
        if (details) {
            ctx.status = 200;
            ctx.body = details;
        } else {
            console.warn('No details found for the audiobookTitle', audiobookTitle);
            ctx.status = 404;
            ctx.body = 'No details found for audiobookTitle';
        }
    } catch (error) {
        console.error('Error changing audiobook details in the database:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
    }
});

// Get GraphicName with audiobookTitle
router.get('/getGraphicName', async (ctx) => {
    const { graphicName, audiobookTitle } = ctx.request.query;
    console.log('Get graphicName with audiobookTitle: ', graphicName, audiobookTitle);
    try {
        const graphicPath = await db.getFilePath(graphicName, audiobookTitle);
        if (graphicPath) {
            ctx.status = 200;
            ctx.body = graphicPath;
        } else {
            console.warn('No graphic with the specified name found in the database');
            ctx.status = 404;
            ctx.body = 'No graphic found with the specified name';
        }
    } catch (error) {
        console.error('Error getting graphic name from the database:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
    }
});

// Get Graphic with graphicPath
router.get('/getGraphic', async (ctx) => {
    const { graphicPath } = ctx.request.query;
    console.log('Get graphic with graphicPath: ', graphicPath);
    try {
        const normalizedPath = graphicPath.replace(/\\/g, path.sep);
        const relativePath = path.join(normalizedPath);
        console.log("Relative Path getGraphic: ", relativePath);
        const stat = fs.statSync(relativePath);
        ctx.response.status = 200;
        ctx.response.type = 'image/jpeg' || 'image/png';
        ctx.response.length = stat.size;
        ctx.body = fs.createReadStream(relativePath);
    } catch (error) {
        console.error(`Error getting graphic with path ${graphicPath} from the server`, error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
    }
});

// Get all tutorials
router.get('/getAllTutorials', async (ctx) => {
    console.log('Getting all tutorials from the server');
    try {
        const allTutorials = await db.getAllTutorials();
        if (allTutorials) {
            ctx.status = 200;
            ctx.body = allTutorials;
        } else {
            console.warn('No tutorials found in the database');
            ctx.status = 404;
            ctx.body = 'No tutorials found in the database';
        }
    } catch (error) {
        console.error('Error getting allTutorials from the server', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
    }
})

// Get video from the server

router.get('/getVideo', async (ctx) => {
    const { videoPath } = ctx.request.query;
    console.log('Getting video from the backend with videoPath: ', videoPath);
    try {
        const normalizedPath = videoPath.replace(/\\/g, path.sep);
        const relativePath = path.join('..', normalizedPath);
        console.log("Relative Path getVideo: ", relativePath);
        const absolutePath = path.resolve(__dirname, relativePath);
        console.log("Absolute Path getVideo: ", absolutePath);
        
        const stat = await fs.promises.stat(absolutePath);
        if (stat) {
            ctx.response.status = 200;
            ctx.response.type = 'video/mp4';
            ctx.response.length = stat.size;
            ctx.body = fs.createReadStream(absolutePath);
        }
    } catch (error) {
        console.error(`Error getting video with path ${videoPath} from the server`, error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
    }
});

module.exports = router;