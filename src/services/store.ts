import AsyncStorage from '@react-native-async-storage/async-storage';

// --- INTERFACES ---
export interface Turma { id: string; nome: string; }
export interface Aluno { id: string; nome: string; turmaId: string; }
export interface Presencas { [alunoId: string]: boolean; }
export interface Chamada { id: string; turmaId: string; dataISO: string; presencas: Presencas; }
export interface AppData { turmas: Turma[]; alunos: Aluno[]; chamadas: Chamada[]; }
export interface RelatorioItem { aluno: Aluno; presencas: number; totalAulas: number; perc: number; }
export interface Relatorio { totalAulas: number; itens: RelatorioItem[]; }

// --- CONSTANTES ---
const KEY = 'mf-data-v1';
const initial: AppData = { turmas: [], alunos: [], chamadas: [] };

// --- LÓGICA DE CACHE ---
let dataCache: AppData | null = null;



async function getData(): Promise<AppData> {
  // CAMINHO 1: O cache já tem dados (continua igual e correto).
  if (dataCache) {
    return dataCache;
  }

  // CAMINHO 2: O cache está vazio, tenta carregar do disco.
  try {
    const raw = await AsyncStorage.getItem(KEY);
    // Cria uma variável local com o resultado.
    const loadedData = raw ? (JSON.parse(raw) as AppData) : JSON.parse(JSON.stringify(initial));
    
    // Atribui o resultado ao cache.
    dataCache = loadedData;
    // Retorna a variável local (que o TS sabe que é AppData).
    return loadedData;

  } catch (e) {
    console.error("Falha ao carregar dados do AsyncStorage", e);

    // CAMINHO 3: Ocorreu um erro, usa o valor inicial.
    const initialData = JSON.parse(JSON.stringify(initial));
    
    // Atribui o valor inicial ao cache para futuras tentativas.
    dataCache = initialData;
    // Retorna a variável local (que o TS sabe que é AppData).
    return initialData;
  }
}

async function saveData(data: AppData): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
    dataCache = data;
  } catch (e) {
    console.error("Falha ao salvar dados no AsyncStorage", e);
  }
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

// --- API PÚBLICA DO STORE ---
export const store = {
  async refresh(): Promise<AppData> {
    dataCache = null;
    return await getData();
  },

  async get(): Promise<AppData> {
    return await getData();
  },
  
  async set(next: AppData): Promise<void> {
    await saveData(next);
  },

  // --- MÉTODOS PARA TURMAS ---
  async addTurma(nome: string): Promise<Turma> {
    const data = await getData();
    const nova: Turma = { id: uid(), nome: nome.trim() };
    // Padrão de imutabilidade: cria um novo objeto de dados com um novo array de turmas.
    const newData = { ...data, turmas: [...data.turmas, nova] };
    await saveData(newData);
    return nova;
  },

  async deleteTurma(id: string): Promise<void> {
    const data = await getData();
    const newData = {
      ...data,
      turmas: data.turmas.filter(t => t.id !== id),
      alunos: data.alunos.filter(a => a.turmaId !== id),
      chamadas: data.chamadas.filter(c => c.turmaId !== id),
    };
    await saveData(newData);
  },

  async listTurmas(): Promise<Turma[]> {
    const data = await getData();
    return data.turmas;
  },

  // --- MÉTODOS PARA ALUNOS ---
  async addAluno(nome: string, turmaId: string): Promise<Aluno> {
    const data = await getData();
    const novo: Aluno = { id: uid(), nome: nome.trim(), turmaId };
    const newData = { ...data, alunos: [...data.alunos, novo] };
    await saveData(newData);
    return novo;
  },

  async deleteAluno(id: string): Promise<void> {
    const data = await getData();
    const newAlunos = data.alunos.filter(a => a.id !== id);
    const newChamadas = data.chamadas.map(chamada => {
      if (id in chamada.presencas) {
        const { [id]: _, ...restantes } = chamada.presencas; // Remove a presença de forma imutável
        return { ...chamada, presencas: restantes };
      }
      return chamada;
    });
    const newData = { ...data, alunos: newAlunos, chamadas: newChamadas };
    await saveData(newData);
  },

  async listAlunosByTurma(turmaId: string | number): Promise<Aluno[]> {
    const data = await getData();
    return data.alunos.filter(a => a.turmaId === turmaId);
  },

  // --- MÉTODOS PARA CHAMADAS ---
  async registrarChamada(turmaId: string, dataISO: string, presencas: Presencas): Promise<void> {
    const data = await getData();
    const existIndex = data.chamadas.findIndex(c => c.turmaId === turmaId && c.dataISO === dataISO);
    
    let newChamadas: Chamada[];
    if (existIndex !== -1) {
      // Se existe, atualiza a chamada existente de forma imutável
      newChamadas = data.chamadas.map((chamada, index) => 
        index === existIndex ? { ...chamada, presencas } : chamada
      );
    } else {
      // Se não existe, adiciona uma nova chamada ao array
      const novaChamada = { id: uid(), turmaId, dataISO, presencas };
      newChamadas = [...data.chamadas, novaChamada];
    }
    const newData = { ...data, chamadas: newChamadas };
    await saveData(newData);
  },

  async obterChamada(turmaId: string | number, dataISO: string): Promise<Chamada | null> {
    const data = await getData();
    return data.chamadas.find(c => c.turmaId === turmaId && c.dataISO === dataISO) || null;
  },

  async listarChamadasPorTurma(turmaId: string | number): Promise<Chamada[]> {
    const data = await getData();
    return data.chamadas
      .filter(c => c.turmaId === turmaId)
      .sort((a, b) => a.dataISO.localeCompare(b.dataISO));
  },

  // --- MÉTODOS PARA RELATÓRIOS ---
  async relatorioTurma(turmaId: string | number): Promise<Relatorio> {
    const data = await getData();
    const alunos = data.alunos.filter(a => a.turmaId === turmaId);
    const chamadas = data.chamadas.filter(c => c.turmaId === turmaId);
    const totalAulas = chamadas.length;

    const mapa: RelatorioItem[] = alunos.map(aluno => {
      const presencas = chamadas.reduce((acc, chamada) => {
        return acc + (chamada.presencas[aluno.id] ? 1 : 0);
      }, 0);
      const perc = totalAulas > 0 ? Math.round((presencas / totalAulas) * 100) : 0;
      return { aluno, presencas, totalAulas, perc };
    });

    return { totalAulas, itens: mapa };
  }
};