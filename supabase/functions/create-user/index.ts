import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL")
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { email, password, fullName, isAdmin } = await req.json()

    // Validação básica
    if (!email || !password || !fullName) {
      return new Response(
        JSON.stringify({ error: "Email, senha e nome completo são obrigatórios" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Criar usuário com autenticação
    const { data: { user }, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createUserError) {
      throw new Error(createUserError.message)
    }

    // Criar perfil do usuário
    const { data, error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        is_admin: isAdmin || false,
        created_at: new Date(),
      })
      .select()

    if (profileError) {
      throw new Error(profileError.message)
    }

    return new Response(
      JSON.stringify({
        message: "Usuário criado com sucesso",
        user: { id: user.id, email: user.email },
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    )
  }
})

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}
