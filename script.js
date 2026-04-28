import { createClient } from 'https://jspm.dev/@supabase/supabase-js'

const supabaseUrl = 'https://iwxfgyagoksrurwcdstr.supabase.co'
const supabaseKey = 'SUA_KEY_AQUI'
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
        listaDiv.innerHTML = 'Erro ao carregar.'
        console.log(error)
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

// 🔹 Deletar
window.deletarPaciente = async (id) => {
    if (confirm('Excluir?')) {
        await supabase.from('pacientes').delete().eq('id', id)
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

// 🔹 Cancelar edição
btnCancelar.onclick = () => {
    form.reset()
    document.getElementById('pacienteId').value = ''
    btnSalvar.innerText = 'Cadastrar'
    btnCancelar.style.display = 'none'
}

// 🔹 Inicializar
carregarPacientes()