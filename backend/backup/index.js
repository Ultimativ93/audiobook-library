const Koa = require('koa');
const app = new Koa();
const Database = require('./tasks/Database');

const db = new Database();

// Middleware-Beispiel
app.use(async (ctx, next) => {
    console.log('Middleware vor der Antwort');
    await next();
    console.log('Middleware nach der Antwort');
})

// Routen
app.use(async (ctx) => {
    const filePath = '/pfad/zu/meiner/datei.txt'
    // for us to delete the file paths, later for user/admin to delete his story
    await db.removeAllFilePaths();
    // Adding a File Path to the database
    await db.addFilePath(filePath);

    const allFilePaths = await db.getAllFilePaths();
    console.log('Alle Dateipfade aus der Datenbank:', allFilePaths);

    ctx.body = 'Hallo, Koa!';
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server hört auf http://localhost:${PORT}`);
});
