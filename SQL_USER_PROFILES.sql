-- ================================================
-- TABELA DE PERFIS DE USUÁRIOS
-- Execute este SQL no Supabase: SQL Editor → New Query
-- ================================================

-- PERFIS DE USUÁRIOS
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  is_admin boolean default false,
  status text default 'ativo',
  phone text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Habilitar RLS (Row Level Security) na tabela user_profiles
alter table user_profiles enable row level security;

-- Política: Qualquer usuário autenticado pode ler seu próprio perfil
create policy "Usuários podem ver seu próprio perfil"
  on user_profiles for select
  using (auth.uid() = id);

-- Política: Apenas admin pode ler perfil de outros usuários
create policy "Admin pode ver todos os perfis"
  on user_profiles for select
  using (
    (select is_admin from user_profiles where id = auth.uid()) = true
  );

-- Política: Usuários podem atualizar seu próprio perfil
create policy "Usuários podem atualizar seu próprio perfil"
  on user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Política: Apenas admin pode criar novos usuários
create policy "Admin pode criar usuários"
  on user_profiles for insert
  with check (
    (select is_admin from user_profiles where id = auth.uid()) = true
  );

-- Política: Apenas admin pode deletar usuários
create policy "Admin pode deletar usuários"
  on user_profiles for delete
  using (
    (select is_admin from user_profiles where id = auth.uid()) = true
  );

-- Trigger para atualizar updated_at automaticamente
create or replace function update_user_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger user_profiles_updated_at_trigger
  before update on user_profiles
  for each row
  execute function update_user_profiles_updated_at();

-- ================================================
-- IMPORTANTE: Para criar novos usuários via API,
-- você precisa usar uma Edge Function que tenha
-- acesso à service_role key. O código JavaScript
-- fornecido não pode criar usuários diretamente
-- pois o cliente não tem permissão para isso.
-- ================================================
