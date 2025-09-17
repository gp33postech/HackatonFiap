// src/store.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'mf-data-v1';

const initial = {
  turmas: [],     // { id, nome }
  alunos: [],     // { id, nome, turmaId }
  chamadas: []    // { id, turmaId, dataISO, presencas: { [alunoId]: true|false } }
};

// Modificado para ser assíncrono
async function load() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : structuredClone(initial);
  } catch (e) {
    console.error("Failed to load data from AsyncStorage", e);
    return structuredClone(initial);
  }
}

// Modificado para ser assíncrono
async function save(data) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data to AsyncStorage", e);
  }
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export const store = {
  // get() agora é assíncrono
  async get() {
    return await load();
  },
  // set() agora é assíncrono
  async set(next) {
    await save(next);
  },

  // Turmas - Funções agora são assíncronas
  async addTurma(nome) {
    const data = await load();
    const nova = { id: uid(), nome: nome.trim() };
    data.turmas.push(nova);
    await save(data);
    return nova;
  },
  async deleteTurma(id) {
    const data = await load();
    data.turmas = data.turmas.filter(t => t.id !== id);
    data.alunos = data.alunos.filter(a => a.turmaId !== id);
    data.chamadas = data.chamadas.filter(c => c.turmaId !== id);
    await save(data);
  },
  async listTurmas() {
    const data = await load();
    return data.turmas;
  },

  // Alunos - Funções agora são assíncronas
  async addAluno(nome, turmaId) {
    const data = await load();
    const novo = { id: uid(), nome: nome.trim(), turmaId };
    data.alunos.push(novo);
    await save(data);
    return novo;
  },
  async deleteAluno(id) {
    const data = await load();
    data.alunos = data.alunos.filter(a => a.id !== id);
    // Também remover presença do aluno em chamadas passadas
    data.chamadas = data.chamadas.map(c => {
      const { presencas, ...rest } = c;
      if (presencas && id in presencas) {
        const np = { ...presencas };
        delete np[id];
        return { ...rest, presencas: np };
      }
      return c;
    });
    await save(data);
  },
  async listAlunosByTurma(turmaId) {
    const data = await load();
    return data.alunos.filter(a => a.turmaId === turmaId);
  },

  // Chamada - Funções agora são assíncronas
  async registrarChamada(turmaId, dataISO, presencas) {
    const data = await load();
    const exist = data.chamadas.find(c => c.turmaId === turmaId && c.dataISO === dataISO);
    if (exist) {
      exist.presencas = presencas;
    } else {
      data.chamadas.push({ id: uid(), turmaId, dataISO, presencas });
    }
    await save(data);
  },
  async obterChamada(turmaId, dataISO) {
    const data = await load();
    return data.chamadas.find(c => c.turmaId === turmaId && c.dataISO === dataISO) || null;
  },
  async listarChamadasPorTurma(turmaId) {
    const data = await load();
    return data.chamadas.filter(c => c.turmaId === turmaId).sort((a, b) => a.dataISO.localeCompare(b.dataISO));
  },

  // Relatórios - Funções agora são assíncronas
  async relatorioTurma(turmaId) {
    const data = await load();
    const alunos = data.alunos.filter(a => a.turmaId === turmaId);
    const chamadas = data.chamadas.filter(c => c.turmaId === turmaId);
    const totalAulas = chamadas.length;

    const mapa = alunos.map(a => {
      let presencas = 0;
      for (const c of chamadas) {
        if (c.presencas && c.presencas[a.id]) presencas += 1;
      }
      const perc = totalAulas ? Math.round((presencas / totalAulas) * 100) : 0;
      return { aluno: a, presencas, totalAulas, perc };
    });

    return { totalAulas, itens: mapa };
  }
};