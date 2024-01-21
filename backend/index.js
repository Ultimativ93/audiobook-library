const Koa = require('koa');
const multer = require('@koa/multer');
const Router = require('koa-router');
const cors = require('@koa/cors');
const Database = require('./tasks/Database');
const bodyParser = require('koa-bodyparser');
const path = require('path');

const app = new Koa();
const router = new Router();
const db = new Database();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Middleware für den Dateiupload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post('/upload', upload.array('files'), async (ctx) => {
    console.log('Upload route hit');
    console.log('Request body:', ctx.request.body);  // Logge den Request-Body
    ctx.status = 200;
    ctx.body = { message: 'Test success' };
});

// Route für den Fall, dass du auch andere Anfragen auf der Wurzel verarbeiten möchtest
router.post('/', async (ctx) => {
    console.log('Habe POST-Anfrage auf der Wurzel erhalten ;)');
    ctx.status = 200;
    ctx.body = { message: 'Test success for root' };
});

// Weitere Routen und Middleware hier hinzufügen...

// Routen
app.use(async (ctx) => {
    const filePath = '/pfad/zu/meiner/datei.txt';
    // zum Löschen der Dateipfade, später für Benutzer/Admin zum Löschen seiner Geschichte
    // await db.removeAllFilePaths();
    // Hinzufügen eines Dateipfads zur Datenbank
    // await db.addFilePath(filePath);

    const allFilePaths = await db.getAllFilePaths();
    console.log('Alle Dateipfade aus der Datenbank:', allFilePaths);

    ctx.body = 'Hallo, Koa!';
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server hört auf http://localhost:${PORT}`);
});


/* router.post('/', upload.array('files'), async (ctx) => {
    console.log('habe post bekommen ;)')
    const files = ctx.req.files;

    if (files.length > 0) {
        const filePath = path.join('uploads', files[0].filename);

        try {
            console.log('in try')
            await db.addFilePath(filePath);

            console.log('Files successfully uploaded and path to audio saved in the database.');
            ctx.status = 200;
            ctx.body = { message: 'Files uploaded successfully' };

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

*/