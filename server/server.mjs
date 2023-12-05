import express from "express";
import session from "express-session";
import SQLiteStore from "connect-sqlite3";
import passport from "passport";
import cors from "cors";
import { nanoid } from "nanoid";

const hostname = "127.0.0.1";
const port = 3500;
const app = express();

// Express-Session-Configuration
const SQLiteStoreInstance = SQLiteStore(session);

app.use(
  session({
    genid: (_) => {
      return nanoid();
    },
    store: new SQLiteStoreInstance({
      dir: "./data",
      db: "data.db",
      table: "Session",
    }),
    secret: "12Wsx09Ijn",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Usage of cors middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow just certain domains access to the backend, security feature CHECK
    credentials: true, // Allow cookies
  })
);

const tryText = {
  text:
    "This is great news, we wanted to see this working. Now that we got the fix, we will look for different ideas and ways to include the following data",
};

// First route CHECK
app.get("/", (req, res) => {
  res.json(tryText);
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});