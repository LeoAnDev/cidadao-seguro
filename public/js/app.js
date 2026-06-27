const API_URL = '/api';

// Helper for XSS protection
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Input Masking
function maskCPF(value) {
    if (!value) return '';
    let v = String(value).replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
}

function maskPhone(value) {
    if (!value) return '';
    let v = String(value).replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    return v;
}

document.addEventListener('input', (e) => {
    if (e.target.name === 'cpf') {
        e.target.value = maskCPF(e.target.value);
    } else if (e.target.name === 'telefone') {
        e.target.value = maskPhone(e.target.value);
    }
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// Define icon based on loaded theme
if (themeToggle && htmlEl.getAttribute('data-theme') === 'dark') {
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'light' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    });
}
// Sidebar Toggle
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const mobileToggle = document.getElementById('mobile-toggle');

if (sidebar && sidebarToggle) {
    if (localStorage.getItem('sidebar') === 'collapsed' && window.innerWidth > 768) {
        sidebar.classList.add('collapsed');
    }
    
    sidebarToggle.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('mobile-open');
        } else {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebar', sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded');
        }
    });
}

if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.add('mobile-open');
    });
}

// Modals
const formModal = document.getElementById('form-modal');
const viewModal = document.getElementById('view-modal');
const closeBtns = document.querySelectorAll('.close-modal');

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if(formModal) formModal.classList.remove('active');
        if(viewModal) viewModal.classList.remove('active');
    });
});

// Page Initialization
const currentPage = document.body.dataset.page;
const pageSpinner = document.getElementById('page-spinner');

function hideSpinner() {
    if (pageSpinner) {
        pageSpinner.classList.add('hidden');
    }
}

// Navigation transition
document.querySelectorAll('a.nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('javascript')) {
            e.preventDefault();
            if (pageSpinner) pageSpinner.classList.remove('hidden');
            setTimeout(() => {
                window.location.href = href;
            }, 250); // slight delay for smooth transition
        }
    });
});

if (currentPage === 'dashboard') {
    fetchCounts();
} else if (currentPage && currentPage !== '404') {
    loadData(currentPage);
    setupNewButton(currentPage);
} else {
    hideSpinner(); // hide immediately for 404
}

// Data Loading
async function loadData(entity) {
    try {
        const res = await fetch(`${API_URL}/${entity}s`);
        const data = await res.json();
        renderTable(entity, data);
    } catch (err) {
        console.error('Error loading data:', err);
    } finally {
        hideSpinner();
    }
}

async function fetchCounts() {
    try {
        const resC = await fetch(`${API_URL}/cidadaos`);
        const resA = await fetch(`${API_URL}/agentes`);
        const resO = await fetch(`${API_URL}/ocorrencias`);

        const dataC = await resC.json();
        const dataA = await resA.json();
        const dataO = await resO.json();

        document.getElementById('count-cidadaos').textContent = dataC.length || 0;
        document.getElementById('count-agentes').textContent = dataA.length || 0;
        document.getElementById('count-ocorrencias').textContent = dataO.length || 0;
    } catch (e) {
        console.error(e);
    } finally {
        hideSpinner();
    }
}

function renderTable(entity, data) {
    const tbody = document.getElementById(`table-${entity}`);
    if (!tbody) return;
    tbody.innerHTML = '';
    
    // Store data in window to easily retrieve for Edit/View
    window[`${entity}Data`] = data;

    data.forEach(item => {
        const tr = document.createElement('tr');
        let idField = `id_${entity}`;

        let cols = '';
        if (entity === 'cidadao') {
            cols = `
                <td>${escapeHTML(item[idField])}</td>
                <td>${escapeHTML(item.nome)}</td>
                <td>${escapeHTML(maskCPF(item.cpf))}</td>
                <td>${escapeHTML(item.email)}</td>
            `;
        } else if (entity === 'agente') {
            cols = `
                <td>${escapeHTML(item[idField])}</td>
                <td>${escapeHTML(item.nome)}</td>
                <td>${escapeHTML(item.matricula)}</td>
                <td>${escapeHTML(item.cargo)}</td>
            `;
        } else if (entity === 'bairro') {
            cols = `
                <td>${escapeHTML(item[idField])}</td>
                <td>${escapeHTML(item.nome_bairro)}</td>
                <td>${escapeHTML(item.zona)}</td>
                <td>${escapeHTML(item.populacao_estimada)}</td>
            `;
        } else if (entity === 'ocorrencia') {
            cols = `
                <td>${escapeHTML(item[idField])}</td>
                <td>${escapeHTML(new Date(item.data_hora).toLocaleString('pt-BR'))}</td>
                <td>${escapeHTML(item.nome_cidadao || 'N/A')}</td>
                <td>${escapeHTML(item.nome_agente || 'N/A')}</td>
                <td>${escapeHTML(item.nome_bairro || 'N/A')}</td>
                <td>${escapeHTML(item.tipo_ocorrencia)}</td>
                <td>${escapeHTML(item.status)}</td>
            `;
        }

        tr.innerHTML = cols + `
            <td>
                <button class="btn btn-sm btn-action btn-view" onclick="viewRecord('${entity}', ${item[idField]})" title="Visualizar"><i class="fa-solid fa-eye"></i></button>
                <button class="btn btn-sm btn-action btn-edit" onclick="editRecord('${entity}', ${item[idField]})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-sm btn-action btn-delete" onclick="deleteRecord('${entity}', ${item[idField]})" title="Excluir"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Form Management
function setupNewButton(entity) {
    const btnNew = document.querySelector('.btn-new');
    if (btnNew) {
        btnNew.addEventListener('click', async () => {
            document.getElementById('form-title').textContent = 'Novo Registro';
            const form = document.getElementById('dynamic-form');
            form.reset();
            document.getElementById('edit-id').value = '';
            
            const formFields = document.getElementById('form-fields');
            formFields.innerHTML = await getFormFields(entity);
            formModal.classList.add('active');
        });
    }
}

window.editRecord = async function(entity, id) {
    const data = window[`${entity}Data`].find(i => i[`id_${entity}`] == id);
    if (!data) return;

    document.getElementById('form-title').textContent = 'Editar Registro';
    const formFields = document.getElementById('form-fields');
    formFields.innerHTML = await getFormFields(entity);
    
    document.getElementById('edit-id').value = id;
    
    // Populate form
    const form = document.getElementById('dynamic-form');
    Object.keys(data).forEach(key => {
        const input = form.elements[key];
        if (input) {
            if (input.type === 'datetime-local' && data[key]) {
                const d = new Date(data[key]);
                d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                input.value = d.toISOString().slice(0,16);
            } else if (input.type === 'date' && data[key]) {
                input.value = data[key].split('T')[0];
            } else {
                input.value = data[key];
            }
        }
    });

    formModal.classList.add('active');
}

window.viewRecord = function(entity, id) {
    const data = window[`${entity}Data`].find(i => i[`id_${entity}`] == id);
    if (!data) return;

    const viewContent = document.getElementById('view-content');
    let html = '';
    
    const ignoreFields = ['id_cidadao', 'id_agente', 'id_bairro'];

    Object.entries(data).forEach(([key, value]) => {
        if (entity === 'ocorrencia' && ignoreFields.includes(key)) return;

        let displayVal = value !== null && value !== undefined ? value : 'N/A';
        if (key.includes('data') && value) {
            displayVal = new Date(value).toLocaleString('pt-BR');
        } else if (key === 'cpf' && displayVal !== 'N/A') {
            displayVal = maskCPF(displayVal);
        } else if (key === 'telefone' && displayVal !== 'N/A') {
            displayVal = maskPhone(displayVal);
        }
        
        let fieldClass = "field";
        if (displayVal.toString().length > 50 || key === 'descricao' || key === 'observacoes') fieldClass += " full";
        html += `<div class="${fieldClass}"><strong>${escapeHTML(key.replace(/_/g, ' '))}</strong> <span>${escapeHTML(displayVal)}</span></div>`;
    });
    
    viewContent.innerHTML = html;
    viewModal.classList.add('active');
}

const dynamicForm = document.getElementById('dynamic-form');
if (dynamicForm) {
    dynamicForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;
        delete data.id;

        // Converter strings vazias para null (evita erros no MySQL com DATETIME/DATE vazios)
        for (let key in data) {
            if (data[key] === "") {
                data[key] = null;
            }
        }

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${currentPage}s/${id}` : `${API_URL}/${currentPage}s`;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let errorMsg = errorData.error || errorData.message || 'Erro interno no servidor.';
                
                // Traduzir erros do banco de dados (Duplicate entry)
                if (errorMsg.includes('Duplicate entry')) {
                    if (errorMsg.includes('cpf')) {
                        errorMsg = 'Este CPF já está cadastrado no sistema.';
                    } else if (errorMsg.includes('email')) {
                        errorMsg = 'Este E-mail já está em uso por outro cadastro.';
                    } else if (errorMsg.includes('matricula')) {
                        errorMsg = 'Esta Matrícula já está cadastrada.';
                    } else {
                        errorMsg = 'Já existe um registro com esse dado (informação duplicada).';
                    }
                }
                
                throw new Error(errorMsg);
            }

            alert(id ? 'Registro atualizado com sucesso!' : 'Registro salvo com sucesso!');
            e.target.reset();
            formModal.classList.remove('active');
            loadData(currentPage);
        } catch (err) {
            alert(`Erro ao salvar: ${err.message}`);
        }
    });
}

window.deleteRecord = async function(entity, id) {
    if (confirm('Tem certeza que deseja excluir?')) {
        try {
            const response = await fetch(`${API_URL}/${entity}s/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || 'Erro ao excluir.');
            }
            alert('Registro excluído com sucesso!');
            loadData(entity);
        } catch (err) {
            alert(`Erro ao excluir: ${err.message}`);
        }
    }
}

async function getFormFields(entity) {
    if (entity === 'cidadao') {
        return `
            <div class="form-group"><label>Nome <span class="required-asterisk">*</span></label><input type="text" name="nome" class="form-control" required></div>
            <div class="form-row">
                <div class="form-group"><label>CPF <span class="required-asterisk">*</span></label><input type="text" name="cpf" class="form-control" required></div>
                <div class="form-group"><label>Data Nascimento</label><input type="date" name="data_nascimento" class="form-control"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Email</label><input type="email" name="email" class="form-control"></div>
                <div class="form-group"><label>Telefone</label><input type="text" name="telefone" class="form-control"></div>
            </div>
            <div class="form-group"><label>Endereço</label><input type="text" name="endereco" class="form-control"></div>
        `;
    }
    if (entity === 'agente') {
        return `
            <div class="form-group"><label>Nome <span class="required-asterisk">*</span></label><input type="text" name="nome" class="form-control" required></div>
            <div class="form-row">
                <div class="form-group"><label>CPF <span class="required-asterisk">*</span></label><input type="text" name="cpf" class="form-control" required></div>
                <div class="form-group"><label>Matrícula <span class="required-asterisk">*</span></label><input type="text" name="matricula" class="form-control" required></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Email</label><input type="email" name="email" class="form-control"></div>
                <div class="form-group"><label>Telefone</label><input type="text" name="telefone" class="form-control"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Cargo</label><input type="text" name="cargo" class="form-control"></div>
                <div class="form-group"><label>Turno</label><input type="text" name="turno" class="form-control"></div>
            </div>
        `;
    }
    if (entity === 'bairro') {
        return `
            <div class="form-group"><label>Nome do Bairro <span class="required-asterisk">*</span></label><input type="text" name="nome_bairro" class="form-control" required></div>
            <div class="form-row">
                <div class="form-group">
                    <label>Zona</label>
                    <select name="zona" class="form-control">
                        <option value="Norte">Norte</option>
                        <option value="Sul">Sul</option>
                        <option value="Leste">Leste</option>
                        <option value="Oeste">Oeste</option>
                        <option value="Central">Central</option>
                    </select>
                </div>
                <div class="form-group"><label>População Estimada</label><input type="number" name="populacao_estimada" class="form-control"></div>
            </div>
            <div class="form-group"><label>Observações</label><textarea name="observacoes" class="form-control" rows="3"></textarea></div>
        `;
    }
    if (entity === 'ocorrencia') {
        let cidadaos = [], agentes = [], bairros = [];
        try {
            const [resC, resA, resB] = await Promise.all([
                fetch('/api/cidadaos'), fetch('/api/agentes'), fetch('/api/bairros')
            ]);
            cidadaos = await resC.json();
            agentes = await resA.json();
            bairros = await resB.json();
        } catch(e) { console.error('Erro ao carregar dados relacionais', e); }

        const cidadaosOptions = cidadaos.map(c => `<option value="${c.id_cidadao}">${escapeHTML(c.nome)}</option>`).join('');
        const agentesOptions = agentes.map(a => `<option value="${a.id_agente}">${escapeHTML(a.nome)}</option>`).join('');
        const bairrosOptions = bairros.map(b => `<option value="${b.id_bairro}">${escapeHTML(b.nome_bairro)}</option>`).join('');

        return `
            <div class="form-row">
                <div class="form-group">
                    <label>Cidadão <span class="required-asterisk">*</span></label>
                    <select name="id_cidadao" class="form-control" required>
                        <option value="">Selecione...</option>
                        ${cidadaosOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Agente <span class="required-asterisk">*</span></label>
                    <select name="id_agente" class="form-control" required>
                        <option value="">Selecione...</option>
                        ${agentesOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Bairro <span class="required-asterisk">*</span></label>
                    <select name="id_bairro" class="form-control" required>
                        <option value="">Selecione...</option>
                        ${bairrosOptions}
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Tipo de Ocorrência <span class="required-asterisk">*</span></label><input type="text" name="tipo_ocorrencia" class="form-control" required></div>
                <div class="form-group"><label>Status</label>
                    <select name="status" class="form-control">
                        <option value="Aberta">Aberta</option>
                        <option value="Em atendimento">Em atendimento</option>
                        <option value="Encerrada">Encerrada</option>
                    </select>
                </div>
            </div>
            <div class="form-group"><label>Data/Hora <span class="required-asterisk">*</span></label><input type="datetime-local" name="data_hora" class="form-control" required></div>
            <div class="form-group"><label>Descrição</label><textarea name="descricao" class="form-control" rows="3"></textarea></div>
        `;
    }
}
