const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const Database = require('./tasks/Database');
const { koaBody } = require('koa-body');
const path = require('path');
const fs = require('fs');

const app = new Koa();
const router = new Router();
const db = new Database();

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));

app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, 'uploads'),
        keepExtensions: true,
        multiples: true,
        binary: true,
    },
}));

router.post('/upload', async (ctx) => {
    console.log('Upload route hit');
    console.log('Uploaded files:', ctx.request.files);
    console.log('Audiobook Name in Backend: ', ctx.request.body.audiobookTitle)

    const files = ctx.request.files && (Array.isArray(ctx.request.files.files) ? ctx.request.files.files : [ctx.request.files.files]);
    const audiobookTitle = ctx.request.body.audiobookTitle;
    if (files && files.length > 0) {
        try {
            const databaseResponses = [];

            for (const file of files) {
                console.log('File:', file);

                const fileName = file.originalFilename;

                const databaseResponse = await db.addFilePath(file.filepath, fileName, audiobookTitle);
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

router.post('/deletePaths', async (ctx) => {
    const audiobookTitle = ctx.request.body;
    console.log("Audiobook Title to delete audioPaths:", audiobookTitle);
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

router.post('/deleteFiles', async (ctx) => {
    console.log("ctx Request body #########################", ctx.request.body)
    const audiobookTitle = ctx.request.body;
    console.log("Audiobook Title to delete files:", audiobookTitle);
    try {
        const filePaths = await db.getFilePathsByTitle(audiobookTitle);

        for (const filePath of filePaths) {
            const fileName = path.basename(filePath);
            const fullPath = path.join(__dirname, 'uploads', fileName);
            fs.unlinkSync(fullPath);
            console.log(`Deleted file: ${fullPath}`);
        }

        ctx.status = 200;
        ctx.body = { success: true, message: 'Files deleted successfully' };
    } catch (error) {
        console.error('Error deleting files:', error);
        ctx.status = 500;
        ctx.body = { success: false, message: 'Internal Server Error while deleting files' };
    }
});

router.post('/deleteFlow', async (ctx) => {
    const audiobookTitle = ctx.request.body;
    console.log("Audiobook Title to delete flow:", audiobookTitle);
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

router.post('/deleteDetail', async (ctx) => {
    const audiobookTitle = ctx.request.body;
    console.log("Audiobook Title to delete detail:", audiobookTitle);
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

router.post('/deleteDetail', async (ctx) => {
    const audiobookTitle = ctx.request.body.audiobookTitle;
    console.log("Audiobook Title to delete detail:", audiobookTitle);
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

router.post('/saveAudiobookDetails', async (ctx) => {
    const { audiobookDetails } = ctx.request.body;
    console.log("im post", audiobookDetails);
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

router.post('/deleteFile', async (ctx) => {
    const { file, audiobookTitle } = ctx.request.body;
    console.log("Deleting file:", file, "for audiobookTitle:", audiobookTitle);

    try {
        const filePath = await db.getFilePath(file);

        if (!filePath) {
            console.error('File not found in the database:', file);
            ctx.status = 404;
            ctx.body = { success: false, message: 'File not found' };
            return;
        }

        fs.unlinkSync(filePath);

        await db.deleteFilePath(file);

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
                fileName.endsWith('.mpeg') ||
                fileName.endsWith('.wav')
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

router.get('/getDataFromFlow', async (ctx) => {
    const { flowKey } = ctx.request.query;
    console.log("in get", flowKey);
    try {
        const allFileNames = await db.getAllFileNames(flowKey);
        ctx.status = 200;
        ctx.body = allFileNames;
    } catch (error) {
        console.error('Error getting data from flow: ', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error, data from flow';
    }
});

router.get('/getFlow', async (ctx) => {
    const { flowKey } = ctx.request.query;

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

router.get('/getAllDetails', async (ctx) => {
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
})

router.get('/getAudioName', async (ctx) => {
    const { audioName } = ctx.request.query;

    try {
        const audioNameFromPath = await db.getFilePath(audioName);
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

})

router.get('/getAudio', async (ctx) => {
    const { audioPath } = ctx.request.query;

    try {
        const stat = fs.statSync(audioPath);

        ctx.response.status = 200;
        ctx.response.type = 'audio/ogg';
        ctx.response.length = stat.size;
        ctx.body = fs.createReadStream(audioPath);

    } catch (error) {
        console.error(`Error getting audio with path ${audioPath} from the server`, error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
    }
});

router.get('/getAudiobookDetails', async (ctx) => {
    const audiobookTitle = ctx.request.query.audiobookTitle;
    console.log("Audiobook Title:", audiobookTitle);
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

router.post('/changeDetails', async (ctx) => {
    const { audiobookDetails, audiobookTitle } = ctx.request.body;
    console.log("Audiobook Title in changeDetails:", audiobookTitle);
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
        console.error('Error changing audiobook details from the database:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
    }
})

router.get('/getGraphicName', async (ctx) => {
    const { graphicName } = ctx.request.query;
    try {
        const graphicPath = await db.getFilePath(graphicName);
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

router.get('/getGraphic', async (ctx) => {
    const { graphicPath } = ctx.request.query;
    try {
        const stat = fs.statSync(graphicPath);
        ctx.response.status = 200;
        ctx.response.type = 'image/jpeg';
        ctx.response.length = stat.size;
        ctx.body = fs.createReadStream(graphicPath);
    } catch (error) {
        console.error(`Error getting graphic with path ${graphicPath} from the server`, error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
    }
});


router.get('/', async (ctx) => {
    ctx.body = 'Hallo Welt von Koa';
});

const PORT = 3005;

app.use(router.routes());

app.listen(PORT, () => {
    console.log(`Server hört auf http://localhost:${PORT}`);
});
