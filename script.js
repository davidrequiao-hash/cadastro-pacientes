import { createClient } from 'https://jspm.dev/@supabase/supabase-js'

const supabaseUrl = 'https://iwxfgyagoksrurwcdstr.supabase.co'

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGZneWFnb2tzcnVyd2Nkc3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTU5NTgsImV4cCI6MjA5MjUzMTk1OH0.KQPsiw4LPMEj6kYs-OArNRqoCfGdsCZNGXv4OF2FC1Q'

const supabase = createClient(supabaseUrl, supabaseKey)

const form = document.getElementById('formPaciente')
const listaDiv = document.getElementById('listaPacientes')
const btnSalvar = document.getElementById('btnSalvar')
const btnCancelar = document.getElementById('btnCancelar')

// 🔹 Carregar pacientes
async function carregarPacientes() {
    listaDiv.innerHTML = 'Carregando...'

    const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .order('id', { ascending: false })

    if (error) {
        console.error("ERRO AO BUSCAR:", error)
        listaDiv.innerHTML = 'Erro ao carregar.'
        return
    }

    if (!data || data.length === 0) {
        listaDiv.innerHTML = 'Nenhum paciente cadastrado.'
        return
    }

    listaDiv.innerHTML = ''

    data.forEach(p => {
        const div = document.createElement('div')
        div.className = 'paciente-card'

        div.innerHTML = `
            <div>
                <strong>${p.nome}</strong>
                <p>📞 ${p.celular}</p>
            </div>

            <div style="margin-top:10px;">
                <button onclick="prepararEdicao(${p.id}, '${p.nome}', '${p.celular}')">Editar</button>
                <button onclick="deletarPaciente(${p.id})" style="color:red; margin-left:10px;">Deletar</button>
            </div>
            <hr>
        `

        listaDiv.appendChild(div)
    })
}

// 🔹 Salvar (novo ou editar)
form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const id = document.getElementById('pacienteId').value

    const dados = {
        nome: document.getElementById('nome').value,
        celular: document.getElementById('celular').value
    }

    let error

    if (id) {
        const res = await supabase.from('pacientes').update(dados).eq('id', id)
        error = res.error
    } else {
        const res = await supabase.from('pacientes').insert([dados])
        error = res.error
    }

    if (error) {
        console.error("ERRO AO SALVAR:", error)
        alert("Erro ao salvar!")
        return
    }

    form.reset()
    document.getElementById('pacienteId').value = ''
    btnSalvar.innerText = 'Cadastrar'
    btnCancelar.style.display = 'none'

    carregarPacientes()
})

// 🔹 Deletar
window.deletarPaciente = async (id) => {
    if (confirm('Excluir?')) {
        const { error } = await supabase.from('pacientes').delete().eq('id', id)

        if (error) {
            console.error("ERRO AO DELETAR:", error)
            alert("Erro ao deletar!")
            return
        }

        carregarPacientes()
    }
}

// 🔹 Editar
window.prepararEdicao = (id, nome, celular) => {
    document.getElementById('pacienteId').value = id
    document.getElementById('nome').value = nome
    document.getElementById('celular').value = celular
    btnSalvar.innerText = 'Salvar Alterações'
    btnCancelar.style.display = 'inline'
}

// 🔹 Cancelar
btnCancelar.onclick = () => {
    form.reset()
    document.getElementById('pacienteId').value = ''
    btnSalvar.innerText = 'Cadastrar'
    btnCancelar.style.display = 'none'
}

// 🔹 Inicializar
carregarPacientes()