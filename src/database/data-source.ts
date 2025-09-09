import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: path.join(__dirname, "agendamento-db.sqlite"),
    synchronize: false,
    migrations: [path.join(__dirname, "migrations", "*.ts")],
    logging: false,
    entities: [path.join(__dirname, "../models/*.ts")],
});