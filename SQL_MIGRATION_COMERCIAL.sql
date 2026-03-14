-- ================================================
-- NEXUS PMS — Migração: Corrigir tabelas Comercial
-- Cole este SQL no Supabase: SQL Editor → New Query
-- ================================================

-- 1. client_leads: adicionar colunas que faltam
ALTER TABLE client_leads ADD COLUMN IF NOT EXISTS stage text NOT NULL DEFAULT 'lead';
ALTER TABLE client_leads ADD COLUMN IF NOT EXISTS value numeric(12,2) DEFAULT 0;

-- 2. proposals: a tabela existente tem colunas erradas (company_name, stage, etc.)
--    Recriar com o schema correto para o módulo Comercial
DROP TABLE IF EXISTS proposals CASCADE;
CREATE TABLE proposals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  client text,
  value numeric(12,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'rascunho',
  validity_date date,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE proposals DISABLE ROW LEVEL SECURITY;

-- 3. contracts: a tabela existente tem colunas erradas (company_name, sem sla_hours, etc.)
--    Recriar com o schema correto para o módulo Comercial
DROP TABLE IF EXISTS contracts CASCADE;
CREATE TABLE contracts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  client text,
  value numeric(12,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'pendente',
  start_date date,
  end_date date,
  sla_hours int DEFAULT 8,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE contracts DISABLE ROW LEVEL SECURITY;

-- Reabilitar RLS para client_leads (já existia)
ALTER TABLE client_leads DISABLE ROW LEVEL SECURITY;

-- ================================================
-- DADOS DE EXEMPLO (opcional, para testar)
-- ================================================

INSERT INTO proposals (title, client, value, status, description) VALUES
('Automação PDV', 'RetailMax Ltda', 45000, 'enviada', 'Projeto de automação de PDV'),
('ERP Logística', 'LogHubBrasil', 120000, 'enviada', 'ERP Logística - Descontos em discussão'),
('Prontuário Eletrônico', 'VenturaMed Saúde', 35000, 'enviada', 'Prontuário Eletrônico - Agendamento próxima semana')
ON CONFLICT DO NOTHING;

INSERT INTO contracts (title, client, value, status, start_date, end_date, description) VALUES
('Contrato PDV', 'MegaStore Varejo', 245000, 'ativo', '2025-01-15', '2028-01-14', 'Sistema PDV - Renovação automática'),
('ERP Agrícola', 'AgroTech Inovação', 89000, 'ativo', '2025-06-01', '2026-05-31', 'ERP Agrícola - Satisfação máxima'),
('Suporte Clínicas', 'Saúde Plus Clínicas', 156000, 'encerrado', '2022-03-01', '2025-02-28', 'Suporte finalizado conforme contrato')
ON CONFLICT DO NOTHING;
