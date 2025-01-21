//importing required libraries
import mongoose from "mongoose";
import MongoStore from "connect-mongo";//session of user stored in db
import express from "express";
import session from "express-session";//helps store sessiondata of user to keep logged in
import dotenv from 'dotenv';

//importing database models

import Admin from "./Models/Admin.js";
import { Books, IssuedBooks } from "./Models/Books.js";

//importing Routes
import adminRoutes  from "./routers/adminRoutes.js";
import genralRoutes from "./routers/generalRoutes.js";



import { fileURLToPath } from "url";
import { dirname, join } from 'path';
import { error } from "console";


dotenv.config();//reading .env file
const dbURL = process.env.DB_URL;//fetching data from .env file
await mongoose.connect(dbURL)

const app = express();
const port = 3000;
export const __dirName = dirname(fileURLToPath(import.meta.url));
const publicPath = join(__dirName, 'public');



app.set('view engine', 'ejs');
app.set('views', join(__dirName, 'views'));


app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 4, //session will auto ends in 4 hour
        },
    })
)
app.use(express.static(publicPath));
app.use(express.json());
app.use("/", genralRoutes);
app.use("/admin", adminRoutes);




// admin end points


app.listen(port, () => {
    console.log('app is listening at port 3000');

})