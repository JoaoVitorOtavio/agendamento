import { AppDataSource } from '../database/data-source';
import { Agendamento, StatusAgendamento } from '../models/agendamento';
import { isSameDay } from "date-fns";

var agendamentos: Agendamento[] = [];

const possuiAgendamentoPendenteOuAtrasado = async (
	motoristaCpf: string
): Promise<boolean> => {
	const agendamentoRepository = AppDataSource.getRepository(Agendamento);

	const existe = await agendamentoRepository.exists({
		where: [
			{ motoristaCpf, status: "pendente" },
			{ motoristaCpf, status: "atrasado" },
		],
	});

	return existe;
};

const verificarConflitoNoMesmoHorario = async (
	dataHora: Date
): Promise<boolean> => {
	const agendamentoRepository = AppDataSource.getRepository(Agendamento);

	const existe = await agendamentoRepository.exists({
		where: { dataHora },
	});

	return existe;
}

export const criarAgendamento = async (novoAgendamento: Agendamento): Promise<Agendamento> => {
	const agendamentoRepository = AppDataSource.getRepository(Agendamento);

	const possuiPendenciaOuAtraso = await possuiAgendamentoPendenteOuAtrasado(novoAgendamento.motoristaCpf);

	const conflitoNoMesmoHorario = await verificarConflitoNoMesmoHorario(novoAgendamento.dataHora);

	if (possuiPendenciaOuAtraso || conflitoNoMesmoHorario) {
		throw new Error("Conflito de agendamento");
	}

	const createdRepository = await agendamentoRepository.save(novoAgendamento);

	return createdRepository;
};


export const alterarStatus = async (id: string, novoStatus: StatusAgendamento): Promise<Agendamento> => {
	const agendamentoRepository = AppDataSource.getRepository(Agendamento);

	const agendamentoAtualizado = await agendamentoRepository.findOneBy({ id });

	if (!agendamentoAtualizado) {
		throw new Error("Agendamento não encontrado");
	}

	await agendamentoRepository.update({ id }, { status: novoStatus });


	return { ...agendamentoAtualizado, status: novoStatus };
};

// TODO: arrumar tipagens
export const listarAgendamentos = (d: any, s: any, m: any): Agendamento[] => {
	return agendamentos.filter((a) => {
		var corresponde = true;

		if (d) {
			corresponde = corresponde && isSameDay(a.dataHora, d);
		} else if (s) {
			corresponde = corresponde && a.status === s;
		} else if (m) {
			corresponde = corresponde && a.motoristaCpf === m;
		}

		return corresponde;
	});
};

export const removerAgendamentosAntigos = (): void => {
	var temp: Agendamento[] = [];

	// TODO: construir funcao
	function differenceInDays(date: Date, hora: Date): number {
		return 3;
	}

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
