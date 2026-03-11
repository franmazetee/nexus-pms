# 🚀 NEXUS PMS — Guia de Deploy Completo
## Do zero ao sistema rodando na internet em ~30 minutos

---

## PRÉ-REQUISITOS

- [ ] Node.js instalado → https://nodejs.org (versão 18 ou superior)
- [ ] Conta GitHub → https://github.com (gratuito)
- [ ] Conta Supabase → https://supabase.com (gratuito)
- [ ] Conta Vercel → https://vercel.com (gratuito)

---

## PASSO 1 — Configurar o Banco de Dados (Supabase)

1. Acesse **https://supabase.com** e crie sua conta
2. Clique em **"New Project"**
3. Preencha:
   - **Name:** nexus-pms
   - **Database Password:** crie uma senha forte (anote!)
   - **Region:** South America (São Paulo)
4. Aguarde ~2 minutos até o projeto ser criado

5. No menu lateral, clique em **"SQL Editor"**
6. Clique em **"New Query"**
7. Abra o arquivo `supabase-schema.sql` desta pasta
8. **Copie todo o conteúdo** e cole no editor do Supabase
9. Clique em **"Run"** (botão verde)
   - Você verá "Success. No rows returned" — está correto!

10. Para pegar suas credenciais:
    - Clique em **Settings** (ícone de engrenagem) → **API**
    - Copie o **Project URL** e a **anon public key**

---

## PASSO 2 — Configurar o Projeto Localmente

Abra o **Terminal** (Windows: PowerShell ou CMD) e execute:

```bash
# 1. Entre na pasta do projeto
cd nexus-pms

# 2. Instale as dependências
npm install

# 3. Copie o arquivo de configuração
cp .env.example .env
```

Abra o arquivo `.env` em qualquer editor de texto e substitua:
```
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANONIMA_AQUI
```
Pelos valores que você copiou no Passo 1.

---

## PASSO 3 — Testar Localmente

```bash
npm run dev
```

Acesse **http://localhost:5173** no navegador.

✅ Se aparecer o NEXUS com dados — está funcionando!

---

## PASSO 4 — Publicar no GitHub

```bash
# Inicializar repositório Git
git init
git add .
git commit -m "feat: NEXUS PMS inicial"

# Criar repositório no GitHub:
# 1. Acesse github.com → clique no "+" → "New repository"
# 2. Nome: nexus-pms
# 3. Deixe PRIVADO (recomendado)
# 4. Clique "Create repository"
# 5. Copie os comandos que o GitHub mostrar, tipo:

git remote add origin https://github.com/SEU_USUARIO/nexus-pms.git
git branch -M main
git push -u origin main
```

---

## PASSO 5 — Deploy na Vercel (site online)

1. Acesse **https://vercel.com** e crie sua conta (pode usar o GitHub)
2. Clique em **"Add New Project"**
3. Clique em **"Import"** no repositório `nexus-pms`
4. Em **"Environment Variables"**, adicione:
   - `VITE_SUPABASE_URL` → seu valor
   - `VITE_SUPABASE_ANON_KEY` → seu valor
5. Clique em **"Deploy"**
6. Aguarde ~2 minutos

🎉 **Pronto!** Você receberá um link tipo `nexus-pms.vercel.app`

---

## ACESSO E USO

| Recurso | URL |
|---------|-----|
| Sistema online | https://nexus-pms.vercel.app |
| Banco de dados | https://supabase.com/dashboard |
| Código fonte | https://github.com/SEU_USUARIO/nexus-pms |

---

## MÓDULOS FUNCIONAIS

| Módulo | Status | Banco de dados |
|--------|--------|----------------|
| Dashboard | ✅ Completo | Lê projetos, CRs e versões |
| Projetos | ✅ Completo | CRUD completo |
| Mudanças (CR) | ✅ Completo | CRUD + workflow de status |
| Versões | ✅ Completo | CRUD + timeline |
| Tarefas | ✅ Completo | Kanban board |
| Comercial | 🔨 Em breve | — |
| Docs IA | 🔨 Em breve | — |
| ERP | 🔨 Em breve | — |

---

## ATUALIZAÇÕES FUTURAS

Qualquer mudança no código:
```bash
git add .
git commit -m "feat: descrição da mudança"
git push
```
A Vercel faz o redeploy **automático** em ~1 minuto.

---

## SUPORTE E PROBLEMAS

**Erro "supabaseUrl is required"**
→ O arquivo `.env` não está configurado. Verifique o Passo 2.

**Tabelas não aparecem no Supabase**
→ Rode o SQL do arquivo `supabase-schema.sql` novamente.

**Site não abre na Vercel**
→ Verifique se as variáveis de ambiente foram adicionadas no Passo 5.
