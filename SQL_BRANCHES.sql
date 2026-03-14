-- =============================================
-- TABELA: branches (Filiais da empresa)
-- Executar no Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS branches (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT        NOT NULL,
  cnpj          TEXT,
  razao_social  TEXT,
  nome_fantasia TEXT,
  email         TEXT,
  phone         TEXT,
  cep           TEXT,
  logradouro    TEXT,
  numero        TEXT,
  complemento   TEXT,
  bairro        TEXT,
  cidade        TEXT,
  estado        TEXT,
  status        TEXT        DEFAULT 'ativo',
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Desabilitar RLS (padrão do projeto)
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;
