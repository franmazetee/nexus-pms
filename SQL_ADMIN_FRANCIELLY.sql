-- =============================================
-- Concede acesso total (admin) para francielly.mazete@gmail.com
-- Executar no Supabase SQL Editor
-- =============================================

UPDATE user_profiles
SET
  role     = 'admin',
  is_admin = true,
  status   = 'ativo',
  updated_at = now()
WHERE email = 'francielly.mazete@gmail.com';

-- Confirmar resultado:
SELECT id, email, full_name, role, is_admin, status
FROM user_profiles
WHERE email = 'francielly.mazete@gmail.com';
