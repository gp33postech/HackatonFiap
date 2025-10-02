# Documentação do Projeto HackatonFiap

## Estrutura de Pastas

```
HACKATONFIAP/
├── .cursor/                # Configurações do editor Cursor
├── .expo/                  # Configurações do Expo
├── .vscode/                # Configurações do Visual Studio Code
├── app/                    # Código-fonte principal da aplicação
├── assets/
│   └── images/             # Imagens e recursos estáticos do projeto
├── node_modules/           # Dependências instaladas do projeto
├── scripts/                # Scripts auxiliares do projeto
├── src/
│   ├── components/         # Componentes reutilizáveis
│   ├── config/             # Arquivos de configuração
│   ├── constants/          # Constantes globais do projeto
│   ├── hooks/              # Hooks personalizados
│   └── services/           # Serviços e integração com APIs
├── .env                    # Variáveis de ambiente
├── .env.example            # Exemplo de variáveis de ambiente
├── .gitignore              # Arquivos e pastas ignorados pelo Git
├── app.json                # Configurações do projeto (Expo)
├── App.tsx                 # Componente principal da aplicação
├── babel.config.js         # Configuração do Babel
├── eslint.config.js        # Configuração do ESLint
├── expo-env.d.ts           # Tipagens do ambiente Expo
├── package-lock.json       # Controle de versões das dependências
├── package.json            # Dependências e scripts do projeto
├── README.md               # Documentação principal do projeto
└── tsconfig.json           # Configuração do TypeScript
```

## Dependências Principais

O projeto utiliza as seguintes dependências (verifique o arquivo `package.json` para detalhes e versões exatas):

- **react** / **react-dom**: Biblioteca principal para construção da interface.
- **react-native**: Framework para desenvolvimento mobile (se aplicável).
- **expo**: Ferramenta para desenvolvimento React Native (se aplicável).
- **@react-navigation/**: Navegação entre telas.
- **axios**: Requisições HTTP.
- **styled-components**: Estilização de componentes.
- **typescript**: Tipagem estática para JavaScript (se aplicável).
- **eslint** / **prettier**: Ferramentas de lint e formatação de código.

> **Nota:** Consulte o arquivo `package.json` para a lista completa e versões das dependências.

## Como rodar o projeto

1. Instale as dependências:
   ```
   npm install
   ```
2. Inicie o projeto:
   ```
   npm run start
   ```

## Observações

- Certifique-se de ter o Node.js instalado.
- Para desenvolvimento mobile, configure o ambiente conforme a documentação do React Native ou Expo.

---

## Principais Aprendizados da Equipe

- **Complexidade do Ambiente Escolar Público:**  
  A estruturação de soluções para escolas públicas revelou-se extremamente desafiadora, principalmente na identificação e compreensão das necessidades reais do ambiente educacional público.

- **Diagnóstico Sistêmico:**  
  Os problemas vão além de questões técnicas, envolvendo aspectos sociais, econômicos e culturais específicos da educação pública.

- **Barreira Real: Tempo vs. Tecnologia:**  
  A limitação tecnológica não é o principal obstáculo. O verdadeiro desafio está na disponibilidade de tempo dos pais/responsáveis para acompanhar o desempenho escolar dos filhos.

- **Priorização:**  
  Muitas famílias enfrentam demandas socioeconômicas que competem com o tempo dedicado ao acompanhamento educacional.

## Oportunidades de Aprimoramento Futuro

- **Mecanismo de Engajamento Obrigatório:**  
  Proposta de implementar sistema de acordos quinzenais entre pais/responsáveis e a instituição, garantindo participação ativa no processo educacional como requisito para manutenção da matrícula.

- **Impacto Esperado:**  
  Criar cultura de acompanhamento sistemático e responsabilidade compartilhada.

- **Próximos Passos:**  
  - Desenvolver interface intuitiva para facilitar o engajamento parental.
  - Criar alertas e lembretes automatizados.
  - Estabelecer métricas de acompanhamento e feedback contínuo.

