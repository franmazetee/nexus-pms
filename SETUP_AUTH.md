# 🔐 Setup de Autenticação e Gerenciamento de Usuários

## Visão Geral

Este documento explica como configurar o sistema de autenticação e gerenciamento de usuários do Nexus PMS.

## 📋 O que foi implementado

### 1. **Sistema de Autenticação**
- ✅ Tela de Login
- ✅ Context de Autenticação (AuthContext)
- ✅ Hook useAuth para uso em componentes
- ✅ Proteção de rotas
- ✅ Persistência de sessão

### 2. **Gerenciamento de Usuários**
- ✅ Tela de Cadastro de Usuários (apenas admin)
- ✅ Tabela de perfis de usuários
- ✅ Sistema de permissões (admin/usuário)
- ✅ Menu de usuário com opções de logout e criar usuário

### 3. **Segurança**
- ✅ Rotas protegidas com ProtectedRoute
- ✅ Rotas apenas para admin com AdminRoute
- ✅ RLS (Row Level Security) configurado

---

## 🚀 Passos de Configuração

### Passo 1: Executar Script SQL

1. Acesse seu projeto no **[Supabase Dashboard](https://app.supabase.com)**
2. Vá para **SQL Editor**
3. Clique em **New Query**
4. Copie todo o conteúdo do arquivo `SQL_USER_PROFILES.sql`
5. Cole no SQL Editor do Supabase
6. Clique em **Run**

Este script irá:
- Criar a tabela `user_profiles`
- Configurar RLS (Row Level Security)
- Criar triggers para validar permissões

---

### Passo 2: Criar Primeiro Usuário Admin (Manualmente)

Como não há usuários ainda, você precisa criar o primeiro admin manualmente:

1. Acesse o **Supabase Dashboard**
2. Vá para **Authentication** → **Users**
3. Clique em **Add User**
4. Preencha:
   - Email: sua@email.com
   - Password: senha_forte
   - Confirme tudo
5. Clique em **Create User**

Agora, vá para **SQL Editor** e execute:

```sql
INSERT INTO user_profiles (id, email, full_name, is_admin)
SELECT id, email, 'Nome Completo' FROM auth.users
WHERE email = 'sua@email.com'
  AND NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.users.id);
```

---

### Passo 3: (Opcional) Criar Edge Function para Criar Usuários

Se você quiser permitir que a tela de cadastro funcione completamente, implemente uma Edge Function:

1. Instale Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Crie uma função:
   ```bash
   supabase functions new create-user
   ```

3. Cole o código de `supabase/functions/create-user/index.ts` no arquivo criado

4. Deploy:
   ```bash
   supabase functions deploy create-user
   ```

5. Configure no `.env.local`:
   ```
   VITE_SUPABASE_FUNCTION_URL=https://seu-projeto.supabase.co/functions/v1
   ```

---

## 📱 Como Usar

### Login
- Acesse `http://localhost:5173/login`
- Use email e senha de um usuário criado
- Após login, você será redirecionado para o Dashboard

### Criar Novo Usuário (Admin Only)
- Como admin, clique no seu nome de usuário (canto superior direito)
- Clique em "➕ Criar Usuário"
- Ou acesse diretamente `http://localhost:5173/users/new`
- Preencha os dados e clique em "Criar Usuário"

### Logout
- Clique no seu nome de usuário (canto superior direito)
- Clique em "🚪 Sair"

---

## 🔑 Variáveis de Ambiente

O arquivo `.env` já deve conter:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

Se você implementar a Edge Function, adicione também:

```
VITE_SUPABASE_FUNCTION_URL=https://seu-projeto.supabase.co/functions/v1
```

---

## 📂 Estrutura de Arquivos

```
src/
├── contexts/
│   └── AuthContext.jsx          # Context de autenticação
├── hooks/
│   └── useAuth.js               # Hook para acessar contexto
├── components/
│   ├── ProtectedRoute.jsx        # Componente de proteção de rotas
│   └── Layout.jsx                # Layout com menu de usuário
├── pages/
│   ├── Login.jsx                 # Tela de login
│   └── RegisterUser.jsx           # Tela de cadastro (admin only)
└── lib/
    └── supabase.js               # Configuração Supabase
```

---

## 🔐 Permissões e RLS

### Tabela: user_profiles

| Ação | Usuário | Permissão |
|------|---------|-----------|
| Ver perfil próprio | Qualquer | ✅ Sim |
| Ver outros perfis | Admin | ✅ Sim |
| Ver outros perfis | Usuário | ❌ Não |
| Editar perfil próprio | Qualquer | ✅ Sim |
| Editar outros perfis | Admin | ❌ (implementar) |
| Criar usuário | Admin | ✅ Sim |
| Deletar usuário | Admin | ✅ Sim |

---

## 🐛 Troubleshooting

### "useAuth deve ser usado dentro de AuthProvider"
- Certifique-se de que `main.jsx` está envolvendo o App com `<AuthProvider>`

### Login funciona mas não acessa páginas
- Verifique se o `user_profiles` foi criado corretamente
- Execute novamente o script SQL_USER_PROFILES.sql

### "VITE_SUPABASE_URL não está definido"
- Verifique o arquivo `.env`
- Certifique-se de que as variáveis estão corretas

### Não consigo criar usuário como admin
- Implemente a Edge Function `create-user` no Supabase
- Ou use `supabase.auth.admin.createUser()` do lado do servidor

---

## 📚 Documentação Útil

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [React Router Docs](https://reactrouter.com/)

---

## ✅ Checklist Final

- [ ] Script SQL executado com sucesso
- [ ] Primeiro usuário admin criado
- [ ] Login funcionando
- [ ] Redirecionamento para /login funcionando
- [ ] Menu de usuário mostrando nome correto
- [ ] Logout funcionando
- [ ] Rota /users/new protegida e mostrando erro para não-admin

Pronto! Seu sistema de autenticação está ativo! 🎉
