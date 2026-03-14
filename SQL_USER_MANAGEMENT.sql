-- ================================================
-- NEXUS PMS — Gestão de Usuários e Permissões
-- Execute no Supabase: SQL Editor → New Query
-- ================================================

-- 1. Adicionar coluna role na user_profiles (se não existir)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'visualizador';

-- 2. Definir admin como role padrão para quem já é is_admin = true
UPDATE user_profiles SET role = 'admin' WHERE is_admin = true;

-- 3. Desabilitar RLS para simplificar acesso interno
--    (o controle de acesso já é feito no frontend via AdminRoute/RoleRoute)
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 4. Dropar políticas antigas que podem conflitar
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON user_profiles;
DROP POLICY IF EXISTS "Admin pode ver todos os perfis" ON user_profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON user_profiles;
DROP POLICY IF EXISTS "Admin pode criar usuários" ON user_profiles;
DROP POLICY IF EXISTS "Admin pode deletar usuários" ON user_profiles;

-- ================================================
-- Papéis disponíveis:
--   admin        → acesso total ao sistema
--   gerente      → projetos, comercial, equipe, clientes
--   desenvolvedor → projetos, tarefas, versões, mudanças
--   visualizador → somente leitura (dashboard, projetos)
-- ================================================
