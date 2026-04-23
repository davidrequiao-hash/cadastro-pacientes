import { createClient } from 'https://jspm.dev/@supabase/supabase-js'

const supabaseUrl = 'https://iwxfgyagoksrurwcdstr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGZneWFnb2tzcnVyd2Nkc3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTU5NTgsImV4cCI6MjA5MjUzMTk1OH0.KQPsiw4LPMEj6kYs-OArNRqoCfGdsCZNGXv4OF2FC1Q'
const supabase = createClient(supabaseUrl, supabaseKey)

const form = document.getElementById('formPaciente')
const listaDiv = document.getElementById('listaPacientes')
const btnSalvar = document.getElementById('btnSalvar')
const btnCancelar = document.getElementById('btnCancelar')

// Carregar lista
async function carregarPacientes() {
    listaDiv.innerHTML = 'Carregando...'
    const { data, error } = await supabase.from('pacientes').select('*').order('id', { ascending: false })
    if (error) return listaDiv.innerHTML = 'Erro ao carregar.'
    
    listaDiv.innerHTML = ''
    data.forEach(p => {
        const div = document.createElement('div')
        div.innerHTML = `
            <p><strong>${p.nome}</strong> - ${p.celular}</p>
            <button onclick="prepararEdicao(${p.id}, '${p.nome}', '${p.celular}', '${p.email}')">Editar</button>
            <button onclick="deletarPaciente(${p.id})" style="color:red">Deletar</button>
            <hr>
        `
        listaDiv.appendChild(div)
    })
}

// Salvar (Novo ou Editar)
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const id = document.getElementById('pacienteId').value
    const dados = {
        nome: document.getElementById('nome').value,
        celular: document.getElementById('celular').value,
        email: document.getElementById('email').value
    }

    if (id) {
        await supabase.from('pacientes').update(dados).eq('id', id)
    } else {
        await supabase.from('pacientes').insert([dados])
    }

    form.reset()
    document.getElementById('pacienteId').value = ''
    btnSalvar.innerText = 'Cadastrar'
    btnCancelar.style.display = 'none'
    carregarPacientes()
})

// Funções globais para os botões funcionarem
window.deletarPaciente = async (id) => {
    if (confirm('Excluir?')) {
        await supabase.from('pacientes').delete().eq('id', id)
        carregarPacientes()
    }
}

window.prepararEdicao = (id, nome, celular, email) => {
    document.getElementById('pacienteId').value = id
    document.getElementById('nome').value = nome
    document.getElementById('celular').value = celular
    document.getElementById('email').value = email
    btnSalvar.innerText = 'Salvar Alterações'
    btnCancelar.style.display = 'inline'
}

btnCancelar.onclick = () => {
    form.reset()
    document.getElementById('pacienteId').value = ''
    btnSalvar.innerText = 'Cadastrar'
    btnCancelar.style.display = 'none'
}

carregarPacientes()