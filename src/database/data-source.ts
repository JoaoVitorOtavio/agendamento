import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";

const isTest = process.env.NODE_ENV === "test";

const IN_MEMORY_DATABASE = ':memory:'

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: isTest
        ? IN_MEMORY_DATABASE
        : path.join(__dirname, "agendamento-db.sqlite"),
    synchronize: isTest ? true : false,
    logging: false,
    entities: [path.join(__dirname, "../models/*.ts")],
    migrations: [path.join(__dirname, "migrations", "*.ts")],
});
