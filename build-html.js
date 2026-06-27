const fs = require('fs');
const path = require('path');

const sidebar = `
        <aside class="sidebar no-print" id="sidebar">
            <div class="sidebar-header">
                <h2><img src="/img/logo.png" alt="Logo" class="sidebar-logo"> <span class="sidebar-text">Cidadão Seguro</span></h2>
                <button id="sidebar-toggle" class="btn-icon sidebar-toggle-btn"><i class="fa-solid fa-bars"></i></button>
            </div>
            <nav class="sidebar-nav">
                <a href="/" class="nav-item {dashboard_active}"><i class="fa-solid fa-chart-pie" style="color: #3b82f6;"></i> <span class="sidebar-text">Início</span></a>
                <a href="/cidadaos" class="nav-item {cidadaos_active}"><i class="fa-solid fa-users" style="color: #10b981;"></i> <span class="sidebar-text">Cidadãos</span></a>
                <a href="/agentes" class="nav-item {agentes_active}"><i class="fa-solid fa-user-shield" style="color: #8b5cf6;"></i> <span class="sidebar-text">Agentes</span></a>
                <a href="/bairros" class="nav-item {bairros_active}"><i class="fa-solid fa-map-location-dot" style="color: #f59e0b;"></i> <span class="sidebar-text">Bairros</span></a>
                <a href="/ocorrencias" class="nav-item {ocorrencias_active}"><i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i> <span class="sidebar-text">Ocorrências</span></a>
            </nav>
        </aside>
`;

const topbar = `
            <header class="topbar no-print">
                <div class="topbar-title">
                    <button id="mobile-toggle" class="btn-icon mobile-only"><i class="fa-solid fa-bars"></i></button>
                    <h1 id="page-title">{title}</h1>
                </div>
                <div class="topbar-actions">
                    <button id="theme-toggle" class="btn-icon">
                        <i class="fa-solid fa-moon"></i>
                    </button>
                    <div class="user-profile">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="Admin">
                        <span>Admin</span>
                    </div>
                </div>
            </header>
`;

const modals = `
    <!-- Form Modal -->
    <div id="form-modal" class="modal no-print">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="form-title">Formulário</h2>
                <button class="btn-icon close-modal"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form id="dynamic-form" class="admin-form">
                <input type="hidden" id="edit-id" name="id">
                <div id="form-fields"></div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary close-modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- View Modal (for Printing) -->
    <div id="view-modal" class="modal view-mode">
        <div class="modal-content printable">
            <div class="modal-header no-print">
                <h2>Visualizar Registro</h2>
                <div>
                    <button class="btn btn-primary btn-sm" onclick="window.print()"><i class="fa-solid fa-print"></i> Imprimir</button>
                    <button class="btn-icon close-modal"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </div>
            <div id="view-content" class="view-body">
                <!-- Content injected via JS -->
            </div>
            <div class="form-actions no-print">
                <button type="button" class="btn btn-secondary close-modal">Fechar</button>
            </div>
        </div>
    </div>
`;

function generateHTML(pageId, title, content) {
    let currentSidebar = sidebar
        .replace('{dashboard_active}', pageId === 'dashboard' ? 'active' : '')
        .replace('{cidadaos_active}', pageId === 'cidadao' ? 'active' : '')
        .replace('{agentes_active}', pageId === 'agente' ? 'active' : '')
        .replace('{bairros_active}', pageId === 'bairro' ? 'active' : '')
        .replace('{ocorrencias_active}', pageId === 'ocorrencia' ? 'active' : '');

    return `<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cidadão Seguro - ${title}</title>
    <link rel="icon" type="image/png" href="/img/logo.png">
    <link rel="stylesheet" href="/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script>
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    </script>
</head>
<body data-page="${pageId}">
    <div class="dashboard-container">
${currentSidebar}
        <main class="main-content">
${topbar.replace('{title}', title)}
            <div id="page-spinner" class="page-spinner">
                <div class="spinner-circle"></div>
            </div>
            <div class="content-wrapper">
${content}
            </div>
            <footer class="admin-footer no-print">
                <p>&copy; 2026 Cidadão Seguro. Todos os direitos reservados.</p>
            </footer>
        </main>
    </div>
${pageId !== 'dashboard' ? modals : ''}
    <script src="/js/app.js"></script>
</body>
</html>`;
}

const pages = {
    'index': {
        id: 'dashboard',
        title: 'Painel de Controle',
        content: `
                <section class="content-section active">
                    <div class="dashboard-cards">
                        <div class="card stat-card">
                            <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
                            <div class="stat-info">
                                <h3>Cidadãos</h3>
                                <p id="count-cidadaos">0</p>
                            </div>
                        </div>
                        <div class="card stat-card">
                            <div class="stat-icon"><i class="fa-solid fa-user-shield"></i></div>
                            <div class="stat-info">
                                <h3>Agentes</h3>
                                <p id="count-agentes">0</p>
                            </div>
                        </div>
                        <div class="card stat-card">
                            <div class="stat-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                            <div class="stat-info">
                                <h3>Ocorrências</h3>
                                <p id="count-ocorrencias">0</p>
                            </div>
                        </div>
                    </div>
                </section>
        `
    },
    'cidadaos': {
        id: 'cidadao',
        title: 'Cidadãos',
        content: `
                <section class="content-section active">
                    <div class="section-header">
                        <h2>Gerenciar Cidadãos</h2>
                        <button class="btn btn-primary btn-new"><i class="fa-solid fa-plus"></i> Novo Cidadão</button>
                    </div>
                    <div class="card table-card">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>Email</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="table-cidadao"></tbody>
                        </table>
                    </div>
                </section>
        `
    },
    'agentes': {
        id: 'agente',
        title: 'Agentes',
        content: `
                <section class="content-section active">
                    <div class="section-header">
                        <h2>Gerenciar Agentes</h2>
                        <button class="btn btn-primary btn-new"><i class="fa-solid fa-plus"></i> Novo Agente</button>
                    </div>
                    <div class="card table-card">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Matrícula</th>
                                    <th>Cargo</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="table-agente"></tbody>
                        </table>
                    </div>
                </section>
        `
    },
    'bairros': {
        id: 'bairro',
        title: 'Bairros',
        content: `
                <section class="content-section active">
                    <div class="section-header">
                        <h2>Gerenciar Bairros</h2>
                        <button class="btn btn-primary btn-new"><i class="fa-solid fa-plus"></i> Novo Bairro</button>
                    </div>
                    <div class="card table-card">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Zona</th>
                                    <th>População</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="table-bairro"></tbody>
                        </table>
                    </div>
                </section>
        `
    },
    'ocorrencias': {
        id: 'ocorrencia',
        title: 'Ocorrências',
        content: `
                <section class="content-section active">
                    <div class="section-header">
                        <h2>Gerenciar Ocorrências</h2>
                        <button class="btn btn-primary btn-new"><i class="fa-solid fa-plus"></i> Nova Ocorrência</button>
                    </div>
                    <div class="card table-card">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Data</th>
                                    <th>Cidadão (Solicitante)</th>
                                    <th>Agente</th>
                                    <th>Bairro</th>
                                    <th>Tipo</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="table-ocorrencia"></tbody>
                        </table>
                    </div>
                </section>
        `
    }
};

for (const [filename, info] of Object.entries(pages)) {
    const html = generateHTML(info.id, info.title, info.content);
    fs.writeFileSync(path.join(__dirname, 'public', filename + '.html'), html);
    console.log('Created ' + filename + '.html');
}

// Generate 404 Page
const html404 = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh; text-align: center;">
        <i class="fa-solid fa-compass" style="font-size: 5rem; color: var(--primary-color); margin-bottom: 24px;"></i>
        <h2 style="font-size: 2rem; color: var(--text-main); margin-bottom: 12px;">Puxa, parece que você se perdeu!</h2>
        <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 32px; max-width: 500px;">
            A página que você está tentando acessar não existe ou foi movida. Mas não se preocupe, o sistema de segurança está intacto!
        </p>
        <a href="/" class="btn btn-primary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-house"></i> Voltar ao Painel Principal
        </a>
    </div>
`;
fs.writeFileSync(path.join(__dirname, 'public', '404.html'), generateHTML('404', 'Página não encontrada', html404));
console.log('Created 404.html');
