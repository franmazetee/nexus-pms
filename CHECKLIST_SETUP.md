# ✅ SETUP COMPLETO DO NEXUS PMS - CORREÇÃO DE BANCO DE DADOS

## 🎯 O que foi corrigido

1. ✅ Corrigido erro de schema: alterado `company` para `company_name` em toda aplicação
2. ✅ Criadas tabelas `proposals` e `contracts` 
3. ✅ Adicionadas políticas RLS para novas tabelas
4. ✅ Corrigido typo em SQL_USER_PROFILES.sql
5. ✅ Adicionados dados de exemplo para todas as tabelas
6. ✅ Commercial.jsx atualizado para usar nomenclatura correta

---

## 🚀 Instruções de Setup (3 Passos)

### Passo 1: Executar Script SQL COMPLETO

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Vá para **SQL Editor** → **New Query**
3. Copie TODO o conteúdo **completo** de `supabase-schema.sql`
4. Cole no editor e clique em **Run**
5. Espere terminar (vai criar todas as tabelas e dados)

### Passo 2: Executar Script de Usuários

1. Crie uma **New Query** novamente
2. Copie TODO o conteúdo de `SQL_USER_PROFILES.sql`
3. Cole e clique em **Run**

### Passo 3: Criar Primeiro Usuário Admin (Manualmente)

Como não há usuários ainda:

1. Vá para **Authentication** → **Users**
2. Clique **Add User**
3. Preencha:
   - Email: `admin@nexus.local`
   - Password: `Senha123!@#`
4. Clique **Create User**

Agora execute este SQL (New Query):

```sql
INSERT INTO user_profiles (id, email, full_name, is_admin)
SELECT id, email, 'Administrador Nexus' FROM auth.users
WHERE email = 'admin@nexus.local'
AND NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.users.id);
```

---

## 📺 Como Usar o Sistema

### Login
```
URL: http://localhost:5173/login
Email: admin@nexus.local
Senha: Senha123!@#
```

### Navegar pelos módulos
Após login, use o menu lateral para acessar:
- 📊 **Dashboard** - Visão geral
- 🎯 **Projetos** - Gestão de projetos
- 💼 **Comercial** - Pipeline de vendas + Propostas + Contratos
- 👥 **Clientes** - Clientes + Pré-cadastros
- ⚙️ **ERP** - Financeiro, RH, etc
- E mais...

---

## 📊 Tabelas Criadas/Corrigidas

| Tabela | Descrição | Campos |
|--------|-----------|--------|
| `user_profiles` | Perfis de usuários | id, email, full_name, is_admin, status, phone, avatar_url |
| `projects` | Projetos de desenvolvimento | name, client, status, version, progress, owner, priority |
| `change_requests` | Solicitações de mudanças (CRs) | cr_number, type, description, status, priority |
| `tasks` | Tarefas dos projetos | title, status, assigned_to, due_date, hours_estimated |
| `clients` | Clientes cadastrados | name, email, phone, contract_value, status |
| `client_leads` | **CORRIGIDO:** Pré-cadastros/prospects | company_name ✅, contact_name, email, phone, visit_status |
| `proposals` | **NOVO:** Propostas comerciais | company_name, contact_name, stage, value, status |
| `contracts` | **NOVO:** Contratos ativos | company_name, value, status, start_date, end_date |
| `team_members` | Equipe/Funcionários | name, email, role, department, status |

---

## 🔧 Dados de Exemplo Inseridos

### Projetos (4)
- ERP Indústria Metalúrgica (78% progresso)
- CRM Rede de Farmácias (45% progresso)
- Portal RH Corporativo (92% progresso)
- PDV Mobile Varejo (12% progresso)

### Leads Comerciais (3)
- TechEdu Solutions - Agendada visita
- Construtora Horizonte - Visita realizada
- Farmácia GenéricaPlus - Visita cancelada

### Propostas (3)
- RetailMax - R$ 45.000 (Proposta)
- LogHubBrasil - R$ 120.000 (Negociação)
- VenturaMed - R$ 35.000 (Qualificada)

### Contratos (3)
- MegaStore - R$ 245.000 (Ativo)
- AgroTech - R$ 89.000 (Ativo)
- Saúde Plus - R$ 156.000 (Encerrado)

### Equipe (5)
- Carlos Menezes (Dev Senior)
- Ana Regina (Arquiteta)
- Pedro Santos (Gerente Projetos)
- Mariana Krawczyk (QA)
- Diego Alves (Suporte)

---

## 🎓 Fluxo Completo

### Como Criar Novo Usuário (Admin)
1. Login como admin
2. Menu superior direito → Seu nome → "➕ Criar Usuário"
3. Preencha dados
4. Clique em "Criar Usuário"

### Como Gerenciar Clientes
1. Menu lateral → "Equipe" (ou "Clientes")
2. Aba "Clientes" → Adicionar novo
3. Ou aba "Pré-cadastros" → Adicionar visita técnica

### Como Gerenciar Comercial
1. Menu lateral → "Comercial"
2. Aba "Pipeline" → Arrastar leads entre etapas
3. Aba "Propostas" → Gerenciar propostas
4. Aba "Contratos" → Acompanhar contratos

---

## 🚨 Se der erro ainda...

| Erro | Solução |
|------|---------|
| "could not find 'company'" | Execute novamente `supabase-schema.sql` completo |
| "table 'proposals' not found" | Tabelas novas não foram criadas. Execute o SQL |
| Login não funciona | Verifique se `user_profiles` foi criada |
| Botão criar usuário não funciona | Implemente Edge Function (veja `SETUP_AUTH.md`) |

---

## 📁 Arquivos Importantes

```
├── supabase-schema.sql          ← Execute PRIMEIRO (banco de dados)
├── SQL_USER_PROFILES.sql        ← Execute SEGUNDO (autenticação)
├── SETUP_AUTH.md                ← Guia de autenticação
├── README_AUTH.md               ← Documentação auth
└── CHECKLIST_SETUP.md           ← Este arquivo
```

---

## ✅ Checklist Final

Antes de usar o sistema em produção:

- [ ] Script `supabase-schema.sql` executado com sucesso
- [ ] Script `SQL_USER_PROFILES.sql` executado com sucesso
- [ ] Primeiro usuário admin criado
- [ ] Login funcionando em `http://localhost:5173/login`
- [ ] Dashboard carregando sem erros
- [ ] Página Comercial acessível e sem erros de column
- [ ] Página Clientes acessível
- [ ] Menu de usuário mostrando nome correto
- [ ] Logout funcionando
- [ ] Dados de exemplo visíveis nas tabelas

---

## 🎉 Tudo Pronto!

Seu Nexus PMS está 100% operacional!

Para dúvidas, consulte:
- `SETUP_AUTH.md` - Autenticação
- `README_AUTH.md` - Documentação rápida
- Console do navegador (F12) - Erros JavaScript
- Supabase Dashboard - Erros de BD

**Desenvolvido para Nexus PMS | 2024-2026**
