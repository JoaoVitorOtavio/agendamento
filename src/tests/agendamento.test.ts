import {
	criarAgendamento,
	alterarStatus,
	listarAgendamentos,
	removerAgendamentosAntigos,
} from "../services/agendamentoService";
import { Agendamento } from "../models/agendamento";
import { addDays } from "date-fns";
import { AppDataSource } from "../database/data-source";

describe("Agendamento Service", () => {
	let agendamento: Agendamento;

	beforeAll(async () => {
		await AppDataSource.initialize();
	});

	beforeEach(async () => {
		const agendamentoRepo = AppDataSource.getRepository(Agendamento);
		await agendamentoRepo.clear();

		agendamento = {
			id: "1",
			motoristaNome: "João",
			motoristaCpf: "12345678900",
			placaCaminhao: "ABC-1234",
			numeroContrato: "CT123",
			dataHora: new Date("2024-09-15T10:00:00Z"),
			status: "pendente",
		};
	});

	afterAll(async () => {
		await AppDataSource.destroy();
	});

	it("Deve criar um novo agendamento", async () => {
		const novoAgendamento = await criarAgendamento(agendamento);
		expect(novoAgendamento).toEqual(agendamento);
	});

	it("Não deve permitir agendamento se o motorista tem um agendamento pendente ou atrasado", async () => {
		await criarAgendamento(agendamento);

		const novoAgendamento = { ...agendamento, id: "2" };

		await expect(criarAgendamento(novoAgendamento)).rejects.toThrow(
			"Conflito de agendamento"
		);
	});

	it("Não deve permitir agendamento de dois motoristas no mesmo horário", async () => {
		await criarAgendamento(agendamento);
		const outroAgendamento = {
			...agendamento,
			id: "2",
			motoristaCpf: "98765432100",
		};

		await expect(criarAgendamento(outroAgendamento)).rejects.toThrow(
			"Conflito de agendamento"
		)
	});

	it("Deve alterar o status de um agendamento", async () => {
		await criarAgendamento(agendamento);

		const atualizado = await alterarStatus(agendamento.id, "concluido");

		expect(atualizado.status).toBe("concluido");
	});

	it("Deve lançar erro se tentar alterar status de agendamento inexistente", async () => {
		const idInexistente = '999';

		await expect(alterarStatus(idInexistente, "concluido"))
			.rejects
			.toThrow("Agendamento não encontrado");
	});

	it("Não deve permitir cancelar um agendamento concluído", async () => {
		await criarAgendamento(agendamento);
		await alterarStatus(agendamento.id, "concluido");

		await expect(alterarStatus(agendamento.id, "cancelado")).rejects.toThrow(
			"Não é possível cancelar um agendamento já concluído"
		);
	});

	it("Não deve permitir alterar um agendamento cancelado", async () => {
		await criarAgendamento(agendamento);
		await alterarStatus(agendamento.id, "cancelado");

		await expect(alterarStatus(agendamento.id, "concluido")).rejects.toThrow(
			"Não é possível alterar um agendamento cancelado"
		);
	});
});

describe("Agendamento Service - Filtros", () => {
	let agendamento1: Agendamento;
	let agendamento2: Agendamento;
	let agendamento3: Agendamento;

	beforeEach(() => {
		agendamento1 = {
			id: "1",
			motoristaNome: "João",
			motoristaCpf: "12345678900",
			placaCaminhao: "ABC-1234",
			numeroContrato: "CT123",
			dataHora: new Date("2024-09-15T10:00:00Z"),
			status: "pendente",
		};

		agendamento2 = {
			id: "2",
			motoristaNome: "Pedro",
			motoristaCpf: "98765432100",
			placaCaminhao: "XYZ-5678",
			numeroContrato: "CT456",
			dataHora: new Date("2024-09-16T11:00:00Z"),
			status: "concluido",
		};

		agendamento3 = {
			id: "3",
			motoristaNome: "João",
			motoristaCpf: "12345678900",
			placaCaminhao: "ABC-1234",
			numeroContrato: "CT789",
			dataHora: new Date("2024-09-17T12:00:00Z"),
			status: "atrasado",
		};

		criarAgendamento(agendamento1);
		criarAgendamento(agendamento2);
		criarAgendamento(agendamento3);
	});

	it("Deve listar todos os agendamentos sem filtro", () => {
		const agendamentos = listarAgendamentos();
		expect(agendamentos.length).toBe(3);
	});

	it("Deve filtrar agendamentos por dia específico", () => {
		const agendamentos = listarAgendamentos(new Date("2024-09-15"));
		expect(agendamentos.length).toBe(1);
		expect(agendamentos[0].id).toBe("1");
	});

	it("Deve filtrar agendamentos por status", () => {
		const agendamentosPendente = listarAgendamentos(undefined, "pendente");
		expect(agendamentosPendente.length).toBe(1);
		expect(agendamentosPendente[0].status).toBe("pendente");

		const agendamentosConcluido = listarAgendamentos(undefined, "concluido");
		expect(agendamentosConcluido.length).toBe(1);
		expect(agendamentosConcluido[0].status).toBe("concluido");
	});

	it("Deve filtrar agendamentos por motorista (CPF)", () => {
		const agendamentosMotorista = listarAgendamentos(
			undefined,
			undefined,
			"12345678900"
		);
		expect(agendamentosMotorista.length).toBe(2);
		expect(agendamentosMotorista[0].motoristaCpf).toBe("12345678900");
		expect(agendamentosMotorista[1].motoristaCpf).toBe("12345678900");
	});

	it("Deve filtrar agendamentos por dia, status e motorista ao mesmo tempo", () => {
		const agendamentos = listarAgendamentos(
			new Date("2024-09-17"),
			"atrasado",
			"12345678900"
		);
		expect(agendamentos.length).toBe(1);
		expect(agendamentos[0].id).toBe("3");
	});
});


describe("Agendamento Service - Remover Agendamentos Antigos", () => {
	let agendamento1: Agendamento;
	let agendamento2: Agendamento;
	let agendamento3: Agendamento;

	beforeEach(() => {
		agendamento1 = {
			id: "1",
			motoristaNome: "João",
			motoristaCpf: "12345678900",
			placaCaminhao: "ABC-1234",
			numeroContrato: "CT123",
			dataHora: addDays(new Date(), -4), // Agendamento com 4 dias atrás
			status: "pendente",
		};

		agendamento2 = {
			id: "2",
			motoristaNome: "Pedro",
			motoristaCpf: "98765432100",
			placaCaminhao: "XYZ-5678",
			numeroContrato: "CT456",
			dataHora: addDays(new Date(), -2), // Agendamento com 2 dias atrás
			status: "concluido",
		};

		agendamento3 = {
			id: "3",
			motoristaNome: "Maria",
			motoristaCpf: "11122233344",
			placaCaminhao: "JKL-9101",
			numeroContrato: "CT789",
			dataHora: new Date(), // Agendamento de hoje
			status: "atrasado",
		};

		criarAgendamento(agendamento1);
		criarAgendamento(agendamento2);
		criarAgendamento(agendamento3);
	});

	it("Deve remover agendamentos com mais de 3 dias", () => {
		removerAgendamentosAntigos();
		const agendamentos = listarAgendamentos();

		expect(agendamentos.length).toBe(2); // Apenas dois agendamentos devem restar
		expect(agendamentos.find((a) => a.id === "1")).toBeUndefined(); // Agendamento com 4 dias foi removido
		expect(agendamentos.find((a) => a.id === "2")).toBeDefined(); // Agendamento com 2 dias continua
		expect(agendamentos.find((a) => a.id === "3")).toBeDefined(); // Agendamento de hoje continua
	});
});