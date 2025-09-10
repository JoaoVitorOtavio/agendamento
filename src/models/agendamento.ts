import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export type StatusAgendamento = "pendente" | "concluido" | "atrasado" | "cancelado";

@Entity("agendamentos")
export class Agendamento {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "datetime" })
    dataHora: Date;

    @Column()
    numeroContrato: string;

    @Column()
    motoristaNome: string;

    @Column()
    motoristaCpf: string;

    @Column()
    placaCaminhao: string;

    @Column({
        type: "text",
        default: "pendente",
    })
    status: StatusAgendamento;
}
