import { supabase } from '../lib/supabase.js'

// Propostas
export async function getProposals() {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createProposal(fields) {
  const { error } = await supabase.from('proposals').insert(fields)
  if (error) throw error
}

export async function updateProposal(id, fields) {
  const { error } = await supabase.from('proposals').update(fields).eq('id', id)
  if (error) throw error
}

export async function deleteProposal(id) {
  const { error } = await supabase.from('proposals').delete().eq('id', id)
  if (error) throw error
}

// Contratos
export async function getContracts() {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createContract(fields) {
  const { error } = await supabase.from('contracts').insert(fields)
  if (error) throw error
}

export async function updateContract(id, fields) {
  const { error } = await supabase.from('contracts').update(fields).eq('id', id)
  if (error) throw error
}

export async function deleteContract(id) {
  const { error } = await supabase.from('contracts').delete().eq('id', id)
  if (error) throw error
}
