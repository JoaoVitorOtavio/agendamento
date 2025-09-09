import dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";
import { AppDataSource } from "./database/data-source";

import app from "./index";

// TODO: exportar para .env
const PORT = 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("📦 Data Source initialized");
        app.listen(PORT, () => {
            console.log(`🚀 Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error during Data Source initialization:", err);
    });
