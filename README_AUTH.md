# 🔐 Sistema de Autenticação - Nexus PMS

## ✅ O que foi implementado

- ✅ **Tela de Login** - Autenticação com email e senha
- ✅ **Tela de Cadastro de Usuários** - Apenas administrador pode criar (protegida)
- ✅ **Contexto de Autenticação** - AuthContext + useAuth hook
- ✅ **Proteção de Rotas** - ProtectedRoute para usuários autenticados
- ✅ **Menu de Usuário** - Com opções de criar usuário e logout
- ✅ **Persistência de Sessão** - Usuário permanece logado ao recarregar página
- ✅ **Sistema de Permissões** - Admin e usuários regulares

---

## 🚀 Como Configurar (5 passos)

### 1️⃣ Executar Script SQL

1. Abra [Supabase Dashboard](https://app.supabase.com)
2. Vá para **SQL Editor** → **New Query**
3. Copie todo conteúdo de `SQL_USER_PROFILES.sql`
4. Cole e clique em **Run**

### 2️⃣ Criar Primeiro Usuário Admin

1. No Supabase: **Authentication** → **Users** → **Add User**
2. Preencha email e senha
3. Execute este SQL na página anterior:

```sql
INSERT INTO user_profiles (id, email, full_name, is_admin)
SELECT id, email, 'Seu Nome' FROM auth.users
WHERE email = 'seu@email.com'
AND NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.users.id);
```

### 3️⃣ Testar Login

1. Inicie o projeto: `npm run dev`
2. Acesse `http://localhost:5173/login`
3. Digite email e senha do admin criado
4. Você será redirecionado para o Dashboard

### 4️⃣ Criar Novos Usuários

Como admin, clique no seu nome ➜ **"➕ Criar Usuário"**

### 5️⃣ (Opcional) Configurar Edge Function

Se quiser que o botão de criar usuário funcione completamente:

```bash
supabase functions new create-user
# Cole o código de: supabase/functions/create-user/index.ts
supabase functions deploy create-user
```

---

## 📂 Arquivos Criados/Modificados

### Novos Arquivos
```
src/
├── contexts/AuthContext.jsx       # Context de autenticação
├── hooks/useAuth.js               # Hook para usar autenticação
├── components/ProtectedRoute.jsx   # Rotas protegidas
├── pages/Login.jsx                 # Tela de login
└── pages/RegisterUser.jsx          # Cadastro de usuários (admin)

SQL_USER_PROFILES.sql              # Script para criar tabelas
SETUP_AUTH.md                       # Documentação detalhada
```

### Arquivos Modificados
```
src/
├── App.jsx                         # Rotas protegidas
├── main.jsx                        # AuthProvider envolvendo app
└── components/Layout.jsx           # Menu de usuário + logout
```

---

## 🎮 Como Usar

### Fluxo de Login
```
/login → Autentica → / (Dashboard)
```

### Criar Usuário (Admin)
```
Menu superior direito → Seu nome → ➕ Criar Usuário
```

### Logout
```
Menu superior direito → Seu nome → 🚪 Sair
```

---

## 🔑 Variáveis de Ambiente

Já devem estar no `.env`:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

---

## ⚠️ Importante

1. **RLS está ativado** - Apenas admins podem criar/deletar usuários
2. **Primeira execução** - Você precisa criar o admin manualmente no Supabase
3. **Edge Function** - Opcional, mas recomendada para produção
4. **Permissões** - Verifique `is_admin` antes de exibir opções sensíveis

---

## 📞 Próximas Melhorias Sugeridas

- [ ] Recuperação de senha (reset password)
- [ ] Editar perfil do usuário
- [ ] Autenticação com Google/GitHub
- [ ] 2FA (Two-Factor Authentication)
- [ ] Auditoria de login (log de acessos)
- [ ] Bloqueio de conta após tentativas falhas

---

## 🆘 Troubleshooting

| Problema | Solução |
|---------|---------|
| Login não funciona | Verifique se SQL foi executado e usuário criado |
| Não consigo fazer logout | Verifique console (devtools) por erros |
| Botão criar usuário disabled | Implemente Edge Function do Supabase |
| Usuários veem tela de admin | Verifique `is_admin` no `user_profiles` |

---

**Desenvolvido para Nexus PMS | 2024-2026**
