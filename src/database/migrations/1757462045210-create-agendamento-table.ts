import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAgendamentoTable1757462045210 implements MigrationInterface {
    name = 'CreateAgendamentoTable1757462045210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "agendamentos" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "dataHora" datetime NOT NULL, "numeroContrato" varchar NOT NULL, "motoristaNome" varchar NOT NULL, "motoristaCpf" varchar NOT NULL, "placaCaminhao" varchar NOT NULL, "status" text NOT NULL DEFAULT ('pendente'), CONSTRAINT "UQ_4b96e5ee58e033f56ebf650c0e8" UNIQUE ("motoristaCpf"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "agendamentos"`);
    }

}
