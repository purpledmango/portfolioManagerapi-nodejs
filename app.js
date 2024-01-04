import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import { default as MongoDBStore } from 'connect-mongodb-session';
import connectDB from './config/db.js';
import AuthRoutes from './routes/authRoutes.js';
import LeadRoutes from './routes/leadRoute.js';
import DesignRoutes from './routes/designsRoute.js';
import { checkSessionMiddleware } from './middleware/sessionMiddleware.js';

dotenv.config();
const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

// SESSION STORAGE
const MongoDBStoreSession = MongoDBStore(session);

const sessionStorage = new MongoDBStoreSession({
    uri: process.env.DB_URI,
    collection: 'sessions', // Corrected collection name
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },

});

// Middlewares
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});


app.use(
    session({
        secret: 'dasdaddsad',
        saveUninitialized: false,
        credentials: true,
        resave: false,
        store: sessionStorage,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
        },
    })
);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.get('/', (req, res) => {
    res.send('API hello');
});
app.use('/auth', AuthRoutes);
app.use('/lead', checkSessionMiddleware, LeadRoutes);
app.use('/design', DesignRoutes);

app.listen(PORT, () => {
    console.log('API server LISTENING !! PORT', PORT);
});
