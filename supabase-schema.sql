-- ================================================
-- NEXUS PMS — Schema Completo do Banco de Dados
-- Cole este SQL no Supabase: SQL Editor → New Query
-- ================================================

-- PERMISSOES (RLS) — rode isto primeiro se os dados nao estiverem salvando
-- Desabilita Row Level Security em todas as tabelas do projeto
alter table if exists projects          disable row level security;
alter table if exists change_requests   disable row level security;
alter table if exists version_logs      disable row level security;
alter table if exists tasks             disable row level security;
alter table if exists deployment_steps  disable row level security;
alter table if exists documentation     disable row level security;
alter table if exists internal_messages disable row level security;
alter table if exists clients           disable row level security;
alter table if exists team_members      disable row level security;
alter table if exists client_leads      disable row level security;
alter table if exists proposals         disable row level security;
alter table if exists contracts         disable row level security;

-- ================================================

-- PROJETOS
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  client text not null,
  status text not null default 'levantamento',
  version text not null default 'v0.1.0',
  progress int not null default 0,
  owner text,
  priority text not null default 'média',
  description text,
  stack text,
  start_date date,
  go_live_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- SOLICITAÇÕES DE MUDANÇA (CRs)
create table if not exists change_requests (
  id uuid default gen_random_uuid() primary key,
  cr_number text unique not null,
  project_id uuid references projects(id) on delete cascade,
  system_name text not null,
  type text not null default 'personalização',
  description text not null,
  priority text not null default 'média',
  assigned_to text,
  status text not null default 'pendente',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- LOG DE VERSÕES
create table if not exists version_logs (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade,
  system_name text not null,
  version text not null,
  type text not null default 'patch',
  changes_count int default 0,
  responsible text,
  notes text,
  released_at date default current_date,
  created_at timestamptz default now()
);

-- TAREFAS
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade,
  cr_id uuid references change_requests(id) on delete set null,
  title text not null,
  description text,
  assigned_to text,
  status text not null default 'pendente',
  priority text not null default 'média',
  due_date date,
  hours_estimated numeric(6,2),
  hours_spent numeric(6,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ETAPAS DE IMPLANTAÇÃO
create table if not exists deployment_steps (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade,
  step_number int not null,
  title text not null,
  description text,
  responsible text,
  status text not null default 'pendente',
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- DOCUMENTAÇÃO
create table if not exists documentation (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade,
  type text not null default 'manual',
  title text not null,
  content text,
  generated_by_ai boolean default false,
  version text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- COMUNICAÇÃO INTERNA (ERP)
create table if not exists internal_messages (
  id uuid default gen_random_uuid() primary key,
  from_user text not null,
  to_user text,
  subject text,
  body text not null,
  project_id uuid references projects(id) on delete set null,
  read boolean default false,
  created_at timestamptz default now()
);

-- CLIENTES / COMERCIAL
create table if not exists clients (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  contact_name text,
  email text,
  phone text,
  status text default 'ativo',
  contract_value numeric(12,2),
  contract_start date,
  contract_end date,
  notes text,
  created_at timestamptz default now()
);

-- EQUIPE / FUNCIONARIOS
create table if not exists team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  role text,
  department text,
  phone text,
  status text not null default 'ativo',
  type text not null default 'funcionario',
  hire_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PRE-CADASTROS / LEADS (VISITAS TECNICAS + PIPELINE COMERCIAL)
create table if not exists client_leads (
  id uuid default gen_random_uuid() primary key,
  company_name text not null,
  contact_name text,
  email text,
  phone text,
  stage text not null default 'lead',
  value numeric(12,2) default 0,
  visit_date date,
  visit_status text not null default 'agendada',
  interest text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PROPOSTAS COMERCIAIS
create table if not exists proposals (
  id uuid default gen_random_uuid() primary key,
  title text,
  client text,
  value numeric(12,2) default 0,
  status text not null default 'rascunho',
  validity_date date,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CONTRATOS & SLA
create table if not exists contracts (
  id uuid default gen_random_uuid() primary key,
  title text,
  client text,
  value numeric(12,2) default 0,
  status text not null default 'pendente',
  start_date date,
  end_date date,
  sla_hours int default 8,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ================================================
-- DADOS DE EXEMPLO (opcional, para testar)
-- ================================================

insert into team_members (name, email, role, department, phone, status, type, hire_date, notes) values
('Carlos Menezes', 'carlos@nexus.com.br', 'Desenvolvedor Senior', 'Desenvolvimento', '11987654321', 'ativo', 'funcionario', '2020-03-10', 'Expert em sistemas ERP'),
('Ana Regina da Silva', 'ana@nexus.com.br', 'Arquiteta de Solução', 'Consultoria', '11981234567', 'ativo', 'funcionario', '2019-07-15', 'Especialista em digitalização'),
('Pedro Santos Oliveira', 'pedro@nexus.com.br', 'Gerente de Projetos', 'PMO', '21999887766', 'ativo', 'funcionario', '2018-01-22', 'PMP Certificado'),
('Mariana Krawczyk', 'mariana@nexus.com.br', 'Analista QA', 'Qualidade', '1938765432', 'ativo', 'funcionario', '2021-05-03', 'Testes automatizados'),
('Diego Alves', 'diego.alves@nexus.com.br', 'Especialista Suporte', 'Suporte', '2133334444', 'ativo', 'contratado', '2023-02-01', 'Suporte 24/7')
ON CONFLICT DO NOTHING;

insert into projects (name, client, status, version, progress, owner, priority, description) values
('ERP Indústria Metalúrgica', 'MetalTech SA', 'implantação', 'v3.2.1', 78, 'Carlos M.', 'alta', 'ERP completo para gestão industrial'),
('CRM Rede de Farmácias', 'FarmaPlus', 'desenvolvimento', 'v1.4.0', 45, 'Ana R.', 'alta', 'CRM com módulo de prescrições'),
('Portal RH Corporativo', 'GrupoAlfa', 'homologação', 'v2.0.0', 92, 'Pedro S.', 'média', 'Portal de gestão de colaboradores'),
('PDV Mobile Varejo', 'ShopFácil', 'levantamento', 'v0.1.0', 12, 'Mariana K.', 'baixa', 'PDV para dispositivos móveis')
ON CONFLICT DO NOTHING;

insert into change_requests (cr_number, system_name, type, description, priority, assigned_to, status) values
('CR-2024-089', 'ERP MetalTech', 'personalização', 'Alterar layout do botão Confirmar Pedido para destaque vermelho', 'baixa', 'Ana R.', 'pendente'),
('CR-2024-088', 'CRM FarmaPlus', 'funcionalidade', 'Novo campo Prescritor no cadastro de vendas', 'alta', 'Carlos M.', 'em_andamento'),
('CR-2024-087', 'Portal RH GrupoAlfa', 'correção', 'Cálculo incorreto de horas extras no relatório mensal', 'crítica', 'Pedro S.', 'concluído')
ON CONFLICT (cr_number) DO NOTHING;

insert into version_logs (system_name, version, type, changes_count, responsible, notes) values
('ERP MetalTech', 'v3.2.1', 'patch', 8, 'Carlos M.', 'Correção módulo fiscal SPED'),
('Portal RH GrupoAlfa', 'v2.0.0', 'major', 47, 'Pedro S.', 'Migração completa para novo motor de cálculo'),
('CRM FarmaPlus', 'v1.4.0', 'minor', 15, 'Ana R.', 'Novos relatórios de performance')
ON CONFLICT DO NOTHING;

insert into client_leads (company_name, contact_name, email, phone, stage, visit_date, visit_status, interest, notes) values
('TechEdu Solutions', 'Ricardo Martins', 'ricardo@teched.com', '11987654321', 'lead', '2026-03-20', 'agendada', 'Plataforma LMS', 'Visitou feira de educação'),
('Construtora Horizonte', 'Fernanda Costa', 'fernanda@horizonte.br', '11981234567', 'lead', null, 'realizada', 'ERP Construção', 'Muito interessado em BIM'),
('Farmácia GenéricaPlus', 'Marcelo Silva', 'marcelo@generica.com.br', '81999887766', 'perdido', null, 'cancelada', 'Gestão de Estoque', 'Cliente optou por concorrente')
ON CONFLICT DO NOTHING;

insert into proposals (title, client, value, status, description) values
('Automação PDV', 'RetailMax Ltda', 45000, 'enviada', 'Projeto de automação de PDV'),
('ERP Logística', 'LogHubBrasil', 120000, 'enviada', 'ERP Logística - Descontos em discussão'),
('Prontuário Eletrônico', 'VenturaMed Saúde', 35000, 'enviada', 'Prontuário Eletrônico - Agendamento próxima semana')
ON CONFLICT DO NOTHING;

insert into contracts (title, client, value, status, start_date, end_date, description) values
('Contrato PDV', 'MegaStore Varejo', 245000, 'ativo', '2025-01-15', '2028-01-14', 'Sistema PDV - Renovação automática'),
('ERP Agrícola', 'AgroTech Inovação', 89000, 'ativo', '2025-06-01', '2026-05-31', 'ERP Agrícola - Satisfação máxima'),
('Suporte Clínicas', 'Saúde Plus Clínicas', 156000, 'encerrado', '2022-03-01', '2025-02-28', 'Suporte finalizado conforme contrato')
ON CONFLICT DO NOTHING;
