-- =============================================
-- Adiciona coluna due_date em change_requests
-- Executar no Supabase SQL Editor
-- =============================================

ALTER TABLE change_requests
  ADD COLUMN IF NOT EXISTS due_date DATE;
