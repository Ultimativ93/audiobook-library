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
    origin: 'http://localhost:3000',
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

    const files = ctx.request.files && ctx.request.files.files;

    if (files && files.length > 0) {
        try {
            const databaseResponses = [];

            // Schleife durch alle Dateien und füge jeden Dateipfad in die Datenbank ein
            for (const file of files) {
                console.log('File:', file);

                // Extrahiere den Dateinamen aus der newFilename-Eigenschaft
                const fileName = file.originalFilename;

                const databaseResponse = await db.addFilePath(file.filepath, fileName);
                databaseResponses.push(databaseResponse);
            }

            console.log('Files successfully uploaded and paths saved in the database.');
            ctx.status = 200;
            ctx.body = { message: 'Files uploaded successfully', databaseResponses };
        } catch (error) {
            console.error('Error:', error);
            ctx.status = 500;
            ctx.body = 'Internal Server Error';
        }
    } else {
        ctx.status = 400;
        ctx.body = 'Bad Request: No files provided';
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

router.get('/', async (ctx) => {
    ctx.body = 'Hallo Welt von Koa';
});

const PORT = 3001;

app.use(router.routes());

app.listen(PORT, () => {
    console.log(`Server hört auf http://localhost:${PORT}`);
});
