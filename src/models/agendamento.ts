export type StatusAgendamento = "pendente" | "concluido" | "atrasado" | "cancelado";

export class Agendamento {
    id: string;

    dataHora: Date;

    numeroContrato: string;

    motoristaNome: string;

    motoristaCpf: string;

    placaCaminhao: string;

    status: StatusAgendamento;
}
