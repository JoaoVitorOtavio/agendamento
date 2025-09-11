import { Agendamento, StatusAgendamento } from '../models/agendamento';
import { differenceInDays, isSameDay } from "date-fns";

var agendamentos: Agendamento[] = [];

const possuiAgendamentoPendenteOuAtrasado = (
	motoristaCpf: string
): boolean => {
	return agendamentos.some(
		(agendamento) =>
			agendamento.motoristaCpf === motoristaCpf &&
			(agendamento.status === "pendente" || agendamento.status === "atrasado")
	);
};

const verificarConflitoNoMesmoHorario = (
	dataHora: Date
): boolean => {
	return agendamentos.some(
		(agendamento) =>
			new Date(agendamento.dataHora).getTime() === new Date(dataHora).getTime()
	);
};

export const criarAgendamento = (novoAgendamento: Agendamento): Agendamento => {

	const possuiPendenciaOuAtraso = possuiAgendamentoPendenteOuAtrasado(novoAgendamento.motoristaCpf);
	const conflitoNoMesmoHorario = verificarConflitoNoMesmoHorario(novoAgendamento.dataHora);

	if (possuiPendenciaOuAtraso || conflitoNoMesmoHorario) {
		throw new Error("Conflito de agendamento");
	}

	agendamentos.push(novoAgendamento);
	return agendamentos[agendamentos.length - 1];
};

export const alterarStatus = (id: string, novoStatus: StatusAgendamento): Agendamento => {
	const agendamento = agendamentos.find((a) => a.id === id);

	if (agendamento!.status === "cancelado") {
		throw new Error("Não é possível alterar um agendamento cancelado");
	}

	if (agendamento!.status === "concluido" && novoStatus === "cancelado") {
		throw new Error(
			"Não é possível cancelar um agendamento já concluído"
		);
	}

	agendamento!.status = novoStatus;
	return agendamento!;
};

export const listarAgendamentos = (
	dataHora?: Date,
	status?: StatusAgendamento,
	motoristaCpf?: string
): Agendamento[] => {
	return agendamentos.filter((a) => {
		let corresponde = true;

		if (dataHora) {
			const dataSplited = a.dataHora.toISOString().split("T")[0];

			corresponde = corresponde && isSameDay(new Date(dataSplited), dataHora);
		}

		if (status) {
			corresponde = corresponde && a.status === status;
		}

		if (motoristaCpf) {
			corresponde = corresponde && a.motoristaCpf === motoristaCpf;
		}

		return corresponde;
	});
};

export const removerAgendamentosAntigos = (): void => {
	var temp: Agendamento[] = [];

	agendamentos.map((a) => {
		const diasDeDiferenca = differenceInDays(new Date(), a.dataHora);

		if (diasDeDiferenca <= 3) {
			for (let i = 0; i < agendamentos.length; i++) {
				const e = agendamentos[i];

				if (e.id === a.id) {
					temp[i] = e;
				}
			}
		}
	});

	agendamentos = temp;
};

export const limparAgendamentos = () => {
	agendamentos = [];
};