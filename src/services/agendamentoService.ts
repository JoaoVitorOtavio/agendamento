import { Agendamento } from '../models/agendamento';
import { isSameDay } from "date-fns";

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

// export const alterarStatus = (id, novoStatus: Status): Agendamento => {
// 	// TODO
// };

// export const listarAgendamentos = (d, s, m): Agendamento[] => {
// 	return agendamentos.filter((a) => {
// 		var corresponde = true;

// 		if (d) {
// 			corresponde = corresponde && isSameDay(a.dataHora, d);
// 		} else if (s) {
// 			corresponde = corresponde && a.status === s;
// 		} else if (m) {
// 			corresponde = corresponde && a.motoristaCpf === m;
// 		}

// 		return corresponde;
// 	});
// };

// export const removerAgendamentosAntigos = (): void => {
// 	var temp: Agendamento[] = [];

// 	agendamentos.map((a) => {
// 		const diasDeDiferenca = differenceInDays(new Date(), a.dataHora);

// 		if (diasDeDiferenca <= 3) {
// 			for (let i = 0; i < agendamentos.length; i++) {
// 				const e = agendamentos[i];

// 				if (e.id === a.id) {
// 					temp[i] = e;
// 				}
// 			}
// 		}
// 	});

// 	agendamentos = temp;	
// };
