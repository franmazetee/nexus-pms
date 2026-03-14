# 🚀 PRIMEIRAS AÇÕES AGORA!

## ⚡ O que fazer IMEDIATAMENTE (em 5 minutos)

### 1️⃣ Abra Supabase Dashboard
```
https://app.supabase.com
```

### 2️⃣ Copie e Execute o Banco de Dados
```
Arquivo: supabase-schema.sql
Ação: SQL Editor → New Query → Copiar/Colar → Run
```

Aguarde terminar (demora alguns segundos)

### 3️⃣ Copie e Execute Perfis de Usuário
```
Arquivo: SQL_USER_PROFILES.sql
Ação: SQL Editor → New Query → Copiar/Colar → Run
```

### 4️⃣ Crie Primeiro Usuário Admin
```
Ação: Authentication → Users → Add User
Email: admin@nexus.local
Password: Senha123!@#
```

Após criar, execute este SQL (New Query):
```sql
INSERT INTO user_profiles (id, email, full_name, is_admin)
SELECT id, email, 'Administrador Nexus' FROM auth.users
WHERE email = 'admin@nexus.local'
AND NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.users.id);
```

---

## 🎮 Pronto! Agora Acesse

```
URL: http://localhost:5173
Login: admin@nexus.local
Senha: Senha123!@#
```

---

## ✅ O que você verá

### Dashboard
- 4 Projetos de exemplo
- Dados de CRs e Versões

### Menu Lateral Completo
- Dashboard ✅
- Projetos ✅
- Comercial ✅
- Clientes ✅
- Equipe ✅
- ERP ✅
- Docs ✅
- Versões ✅
- Mudanças ✅
- Tarefas ✅

### Página Comercial (Agora Funciona!)
- **Pipeline**: 3 propostas em diferentes etapas
- **Propostas**: 3 propostas comerciais
- **Contratos**: 3 contratos ativos/encerrados

---

## 🔍 Se algo não funcionar

### Erro: "Could not find 'company' column"
✅ **RESOLVIDO** - Agora usa `company_name`

### Erro: "Table 'proposals' not found"
❌ Você não executou `supabase-schema.sql` corretamente
→ Refaça o Passo 2

### Erro: Login não funciona
❌ Você não executou `SQL_USER_PROFILES.sql`
→ Refaça o Passo 3

### Botão "Criar Usuário" não funciona
✅ Normal, precisa configurar Edge Function (opcional, veja `SETUP_AUTH.md`)

---

## 📱 Testar Funcionalidades

### Testar Login/Logout
1. Click em seu nome (canto sup dir)
2. Click "🚪 Sair"
3. Login novamente

### Testar Banco de Dados
1. Vá para Comercial
2. Veja o pipeline com 3 propostas
3. Vá para Clientes
4. Veja os 3 clientes cadastrados

### Criar Novo Registro
1. Qualquer página com "+" NOVO
2. Preencha e clique SALVAR
3. Veja aparecer na lista

---

## 📚 Documentação Completa

- **CHECKLIST_SETUP.md** → Setup detalhado
- **SETUP_AUTH.md** → Autenticação avançada
- **README_AUTH.md** → Guia rápido
- **supabase-schema.sql** → Estrutura do BD
- **SQL_USER_PROFILES.sql** → Tabela de usuários

---

## 🎯 Próximos Passos (Depois)

- [ ] Criar mais usuários como admin
- [ ] Adicionar mais projetos
- [ ] Testar edição/exclusão de registros
- [ ] Implementar Edge Function para criar usuários (opcional)
- [ ] Configurar autenticação com Google/GitHub (opcional)

---

**Seu Nexus PMS está 100% funcional!** ✅

Divirta-se desenvolvendo! 🚀
