import { Request, Response } from 'express';
import {
	alterarStatus,
	criarAgendamento,
	listarAgendamentos,
	removerAgendamentosAntigos,
} from "../services/agendamentoService";
import { parseISO } from "date-fns";
import { StatusAgendamento } from '../models/agendamento';

export const criarNovoAgendamento = async (req: Request, res: Response) => {
	const body = req.body;

	const result = await criarAgendamento(body);

	res.status(201).json(result);
};

export const atualizarStatusAgendamento = async (req: Request, res: Response) => {
	const id = req.params.id;
	const status = req.body.status as StatusAgendamento;

	const result = await alterarStatus(id, status);

	res.status(200).json(result);
};

export const listarTodosAgendamentos = async (req: Request, res: Response) => {
	var data = req.query.data;
	var status = req.query.status as StatusAgendamento;
	var motoristaCpf = req.query.motoristaCpf as string;

	let dataFinal: Date | undefined = undefined;
	if (data) dataFinal = parseISO(data as string);

	const result = await listarAgendamentos({ data: dataFinal, status: status, motoristaCpf });
	res.status(200).json(result);
};

export const deletarAgendamentosAntigos = (req: Request, res: Response) => {
	removerAgendamentosAntigos();
	res.status(204).send("Agendamentos com mais de 3 dias foram removidos");
};