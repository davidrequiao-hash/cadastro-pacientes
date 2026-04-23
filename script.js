import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://iwxfgyagoksrurwcdstr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGZneWFnb2tzcnVyd2Nkc3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTU5NTgsImV4cCI6MjA5MjUzMTk1OH0.KQPsiw4LPMEj6kYs-OArNRqoCfGdsCZNGXv4OF2FC1Q'
);

document.getElementById('formPaciente').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const celular = document.getElementById('celular').value;
  const email = document.getElementById('email').value;

  const { error } = await supabase
    .from('pacientes')
    .insert([{ nome, celular, email }]);

  if (error) {
    alert("Erro ao cadastrar");
    console.log(error);
  } else {
    alert("Paciente cadastrado com sucesso!");
  }
});