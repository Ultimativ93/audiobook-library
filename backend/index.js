const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');
const path = require('path');
const routesController = require('./tasks/routesController');

const app = new Koa();
const router = new Router();

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

app.use(routesController.routes())

const PORT = 3005;

app.use(router.routes());

app.listen(PORT, () => {
    console.log(`Server hört auf http://localhost:${PORT}`);
});
