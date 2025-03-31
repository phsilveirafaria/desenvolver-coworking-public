# Desenvolver Coworking

Sistema de gerenciamento e reserva de salas para o Desenvolver Coworking.

![Desenvolver Coworking](public/carousel-01.jpg)

## 🚀 Funcionalidades

- **Autenticação Segura**
  - Sistema de token para acesso controlado
  - Proteção de rotas e recursos

- **Gestão de Salas**
  - Visualização de todas as salas disponíveis
  - Detalhes completos de cada espaço
  - Imagens e descrições detalhadas

- **Sistema de Reservas**
  - Calendário interativo
  - Visualização de disponibilidade em tempo real
  - Confirmação instantânea

- **Interface Moderna**
  - Design responsivo
  - Modo claro/escuro
  - Animações suaves
  - Carrossel de imagens na página inicial

## 🛠️ Tecnologias

- **Frontend**
  - React 18
  - TypeScript
  - Material UI
  - Tailwind CSS
  - Lucide Icons
  - Swiper (carrossel)

- **Backend**
  - Supabase (Banco de dados e autenticação)

- **Ferramentas de Desenvolvimento**
  - Vite
  - ESLint
  - PostCSS

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/desenvolver-coworking.git
   cd desenvolver-coworking
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   VITE_SUPABASE_URL=sua-url-do-supabase
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
   VITE_AUTH_TOKEN=seu-token-de-autenticacao
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## 📂 Estrutura do Projeto

```
desenvolver-coworking/
├── public/                 # Arquivos estáticos
│   ├── carousel-*.jpg      # Imagens do carrossel
│   └── desenvolver-coworking-logo.svg
├── src/
│   ├── components/        # Componentes React reutilizáveis
│   │   ├── AuthModal     # Modal de autenticação
│   │   ├── Calendar      # Calendário de reservas
│   │   ├── Layout        # Layout principal
│   │   └── ...
│   ├── context/          # Contextos React
│   │   ├── AuthContext   # Gerenciamento de autenticação
│   │   ├── BookingContext# Gerenciamento de reservas
│   │   └── ThemeContext  # Gerenciamento de tema
│   ├── lib/              # Configurações de bibliotecas
│   │   └── supabase.ts   # Cliente Supabase
│   ├── pages/            # Páginas da aplicação
│   │   ├── HomePage      # Página inicial
│   │   ├── RoomsPage     # Lista de salas
│   │   └── ...
│   └── types/            # Definições de tipos TypeScript
└── package.json          # Dependências e scripts
```

## 🔧 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a versão de produção
- `npm run preview`: Visualiza a versão de produção localmente
- `npm run lint`: Executa a verificação de código

## 🌐 Ambiente de Produção

Para fazer deploy em produção:

1. **Build do projeto**
   ```bash
   npm run build
   ```

2. **Teste local da build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   - Os arquivos de produção estarão na pasta `dist`
   - Faça deploy em sua plataforma preferida (Netlify, Vercel, etc.)

## 🔐 Segurança

- Todas as chaves sensíveis devem ser armazenadas em variáveis de ambiente
- Nunca commite o arquivo `.env` no repositório
- Mantenha o token de autenticação seguro

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📧 Contato

Desenvolver Coworking - [Website](https://desenvolver.com)

Link do projeto: [https://github.com/seu-usuario/desenvolver-coworking](https://github.com/seu-usuario/desenvolver-coworking)