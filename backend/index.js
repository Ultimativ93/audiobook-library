const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const Database = require('./tasks/Database');
const { koaBody } = require('koa-body');
const path = require('path');

const app = new Koa();
const router = new Router();
const db = new Database();

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));

// Middleware für den Dateiupload
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

    const files = ctx.request.files && (Array.isArray(ctx.request.files.files) ? ctx.request.files.files : [ctx.request.files.files]);

    if (files && files.length > 0) {
        try {
            const databaseResponses = [];

            // Loop through all files and insert each file path into the database
            for (const file of files) {
                console.log('File:', file);

                const fileName = file.originalFilename;

                const databaseResponse = await db.addFilePath(file.filepath, fileName);
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

router.post('/saveFlow', async(ctx) => {
    const { flow, flowKey } = ctx.request.body;
    try {
        const savedFlowId = await db.saveFlow(flow, flowKey);
        ctx.status = 200;
        ctx.body = { success: true, message: 'Flow saved successfully', savedFlowId};
    } catch (error) {
        console.error('Error saving flow on server: ', error);
        ctx.status = 500;
        ctx.body = {success: false, message: 'Internal Server Error'};
    }
});

router.get('/audioPaths', async (ctx) => {
    try {
        const allFilePaths = await db.getAllFilePaths();
        ctx.status = 200;
        ctx.body = allFilePaths;
    } catch (error) {
        console.error('Error getting audio paths:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
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
