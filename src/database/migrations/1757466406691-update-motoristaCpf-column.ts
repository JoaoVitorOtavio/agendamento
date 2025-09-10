import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMotoristaCpfColumn1757466406691 implements MigrationInterface {
    name = 'UpdateMotoristaCpfColumn1757466406691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_agendamentos" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "dataHora" datetime NOT NULL, "numeroContrato" varchar NOT NULL, "motoristaNome" varchar NOT NULL, "motoristaCpf" varchar NOT NULL, "placaCaminhao" varchar NOT NULL, "status" text NOT NULL DEFAULT ('pendente'), CONSTRAINT "UQ_4b96e5ee58e033f56ebf650c0e8" UNIQUE ("motoristaCpf"))`);
        await queryRunner.query(`INSERT INTO "temporary_agendamentos"("id", "dataHora", "numeroContrato", "motoristaNome", "motoristaCpf", "placaCaminhao", "status") SELECT "id", "dataHora", "numeroContrato", "motoristaNome", "motoristaCpf", "placaCaminhao", "status" FROM "agendamentos"`);
        await queryRunner.query(`DROP TABLE "agendamentos"`);
        await queryRunner.query(`ALTER TABLE "temporary_agendamentos" RENAME TO "agendamentos"`);
        await queryRunner.query(`CREATE TABLE "temporary_agendamentos" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "dataHora" datetime NOT NULL, "numeroContrato" varchar NOT NULL, "motoristaNome" varchar NOT NULL, "motoristaCpf" varchar NOT NULL, "placaCaminhao" varchar NOT NULL, "status" text NOT NULL DEFAULT ('pendente'), CONSTRAINT "UQ_4b96e5ee58e033f56ebf650c0e8" UNIQUE ("motoristaCpf"))`);
        await queryRunner.query(`INSERT INTO "temporary_agendamentos"("id", "dataHora", "numeroContrato", "motoristaNome", "motoristaCpf", "placaCaminhao", "status") SELECT "id", "dataHora", "numeroContrato", "motoristaNome", "motoristaCpf", "placaCaminhao", "status" FROM "agendamentos"`);
        await queryRunner.query(`DROP TABLE "agendamentos"`);
        await queryRunner.query(`ALTER TABLE "temporary_agendamentos" RENAME TO "agendamentos"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agendamentos" RENAME TO "temporary_agendamentos"`);
        await queryRunner.query(`CREATE TABLE "agendamentos" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "dataHora" datetime NOT NULL, "numeroContrato" varchar NOT NULL, "motoristaNome" varchar NOT NULL, "motoristaCpf" varchar NOT NULL, "placaCaminhao" varchar NOT NULL, "status" text NOT NULL DEFAULT ('pendente'), CONSTRAINT "UQ_4b96e5ee58e033f56ebf650c0e8" UNIQUE ("motoristaCpf"))`);
        await queryRunner.query(`INSERT INTO "agendamentos"("id", "dataHora", "numeroContrato", "motoristaNome", "motoristaCpf", "placaCaminhao", "status") SELECT "id", "dataHora", "numeroContrato", "motoristaNome", "motoristaCpf", "placaCaminhao", "status" FROM "temporary_agendamentos"`);
        await queryRunner.query(`DROP TABLE "temporary_agendamentos"`);
        await queryRunner.query(`ALTER TABLE "agendamentos" RENAME TO "temporary_agendamentos"`);
        await queryRunner.query(`CREATE TABLE "agendamentos" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "dataHora" datetime NOT NULL, "numeroContrato" varchar NOT NULL, "motoristaNome" varchar NOT NULL, "motoristaCpf" varchar NOT NULL, "placaCaminhao" varchar NOT NULL, "status" text NOT NULL DEFAULT ('pendente'), CONSTRAINT "UQ_4b96e5ee58e033f56ebf650c0e8" UNIQUE ("motoristaCpf"))`);
        await queryRunner.query(`INSERT INTO "agendamentos"("id", "dataHora", "numeroContrato", "motoristaNome", "motoristaCpf", "placaCaminhao", "status") SELECT "id", "dataHora", "numeroContrato", "motoristaNome", "motoristaCpf", "placaCaminhao", "status" FROM "temporary_agendamentos"`);
        await queryRunner.query(`DROP TABLE "temporary_agendamentos"`);
    }

}
