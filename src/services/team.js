import { supabase } from '../lib/supabase.js'

export async function getTeamMembers() {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('name')
  if (error) throw error
  return data || []
}

export async function createTeamMember(fields) {
  const { error } = await supabase.from('team_members').insert(fields)
  if (error) throw error
}

export async function updateTeamMember(id, fields) {
  const { error } = await supabase
    .from('team_members')
    .update({ ...fields, updated_at: new Date() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteTeamMember(id) {
  const { error } = await supabase.from('team_members').delete().eq('id', id)
  if (error) throw error
}
