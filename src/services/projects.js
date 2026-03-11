import { supabase } from '../lib/supabase.js'

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createProject(fields) {
  const { error } = await supabase.from('projects').insert(fields)
  if (error) throw error
}

export async function updateProject(id, fields) {
  const { error } = await supabase
    .from('projects')
    .update({ ...fields, updated_at: new Date() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}
