import { supabase } from '../lib/supabase.js'

export async function getClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createClient(fields) {
  const { error } = await supabase.from('clients').insert(fields)
  if (error) throw error
}

export async function updateClient(id, fields) {
  const { error } = await supabase.from('clients').update(fields).eq('id', id)
  if (error) throw error
}

export async function deleteClient(id) {
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) throw error
}

export async function getClientLeads() {
  const { data, error } = await supabase
    .from('client_leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createClientLead(fields) {
  const { error } = await supabase.from('client_leads').insert(fields)
  if (error) throw error
}

export async function updateClientLead(id, fields) {
  const { error } = await supabase
    .from('client_leads')
    .update({ ...fields, updated_at: new Date() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteClientLead(id) {
  const { error } = await supabase.from('client_leads').delete().eq('id', id)
  if (error) throw error
}
