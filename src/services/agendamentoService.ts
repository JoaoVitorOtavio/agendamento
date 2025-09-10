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

	const agendamentoOnDb = await agendamentoRepository.findOneBy({ id });

	if (!agendamentoOnDb) {
		throw new Error("Agendamento não encontrado");
	}

	if (agendamentoOnDb.status === "concluido" && novoStatus === "cancelado") {
		throw new Error("Não é possível cancelar um agendamento já concluído");
	}

	if (agendamentoOnDb.status === "cancelado") {
		throw new Error("Não é possível alterar um agendamento cancelado");
	}

	await agendamentoRepository.update({ id }, { status: novoStatus });


	return { ...agendamentoOnDb, status: novoStatus };
};


interface FiltroAgendamento {
	data?: Date;
	status?: StatusAgendamento;
	motoristaCpf?: string;
}

export const listarAgendamentos = async (filtros: FiltroAgendamento): Promise<Agendamento[]> => {
	const agendamentoRepo = AppDataSource.getRepository(Agendamento);

	let agendamentos = await agendamentoRepo.find();

	if (filtros.data) {
		agendamentos = agendamentos.filter((a) => {
			const dataString = a.dataHora.toISOString().split("T")[0];

			return isSameDay(new Date(dataString), filtros.data!)
		});
	}

	if (filtros.status) {
		agendamentos = agendamentos.filter((a) => a.status === filtros.status);
	}

	if (filtros.motoristaCpf) {
		agendamentos = agendamentos.filter((a) => a.motoristaCpf === filtros.motoristaCpf);
	}

	return agendamentos;
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
