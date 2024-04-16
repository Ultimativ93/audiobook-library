const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');
const path = require('path');
const serve = require('koa-static');
const routesController = require('./tasks/routesController');

const app = new Koa();
const router = new Router();

// Using CORS middleware to enable cross-origin requests
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));

// Using koa-body middleware to parse request bodies
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, 'uploads'),
        keepExtensions: true,
        multiples: true,
        binary: true,
    },
}));

// Serving static files from the 'uploads' directory
app.use(serve('uploads'));

// Middleware to restrict file system access to the allowed routes and within a specific directory
// Middleware to restrict file system access to the allowed routes and within a specific directory
app.use(async (ctx, next) => {
    const allowedRoutes = ['/upload', '/updateCategory', '/saveFlow', '/saveValidatedFlow', '/getValidateFlowTitle', '/getValidatedFlow', '/getAllValidatedFlows', '/getAllFlows', '/deletePaths', '/deleteFiles', '/deleteFlow', '/deleteDetail', '/saveAudiobookDetails', '/deleteFile', '/audioPaths', '/graficPaths', '/getAllGraficNames', '/graficThumbnail', '/getDataFromFlow', '/getFlow', '/getAllDetails', '/getAudioName', '/getAudio', '/getAudiobookDetails', '/changeAudioName', '/changeDetailsGraphicName', '/changeDetails', '/getGraphicName', '/getGraphic', '/getAllTutorials', '/getVideo'];

    const requestPath = ctx.path;
    const queryKeys = Object.keys(ctx.request.query);
    const allowedDirectory1 = 'uploads';
    console.log("ALLOWED DIERETORY1: ", allowedDirectory1)

    const allowedDirectory2 = 'tutorials';

    if (!allowedRoutes.includes(requestPath)) {
        console.log("in allowed routes")
        ctx.status = 403;
        ctx.body = 'Forbidden';
        return;
    }

    if (queryKeys.length > 0) {
        for (const key of queryKeys) {
            const value = ctx.request.query[key];
            if (!value) {
                console.log(`Query parameter '${key}' is missing or empty.`);
                ctx.status = 403;
                ctx.body = 'Forbidden';
                return;
            }

            if ((!ctx.request.query.audiobookTitle && !ctx.request.query.flowKey && !ctx.request.query.title) && !(value.startsWith(allowedDirectory1) || value.startsWith(allowedDirectory2))) {
                console.log(`Query parameter '${key}' value does not start with allowed directory. Value: ${value}`);
                ctx.status = 403;
                ctx.body = 'Forbidden';
                return;
            }
        }
    }

    await next();
});

// Using the routes controller
app.use(routesController.routes())

const PORT = 3005;

app.use(router.routes());

app.listen(PORT, () => {
    console.log(`Server hört auf http://localhost:${PORT}`);
});
