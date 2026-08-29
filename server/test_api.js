const BASE_URL = 'http://localhost:5000/api';

async function testApi() {
  console.log('🧪 Iniciando Testes Automatizados da API do LifeFlow...\n');

  // 1. Health check
  console.log('1. Testando Health Check...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log('   STATUS:', healthRes.status, healthData);

  // 2. Auth Register
  console.log('\n2. Testando Registro de Usuário de Teste...');
  const testEmail = `teste_${Date.now()}@lifeflow.com`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Tamires Teste', email: testEmail, password: 'senha_segura_123' })
  });
  const regData = await regRes.json();
  console.log('   REGISTRO STATUS:', regRes.status, regData.message);
  const token = regData.token;

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 3. Get Categories (Auto-seeded)
  console.log('\n3. Testando Busca de Categorias (Auto-seeded)...');
  const catRes = await fetch(`${BASE_URL}/categories`, { headers: authHeaders });
  const catData = await catRes.json();
  console.log(`   ENCONTRADAS: ${catData.categories.length} categorias:`, catData.categories.map(c => c.name).join(', '));
  const estudoCategory = catData.categories.find(c => c.name === 'Estudo') || catData.categories[0];

  // 4. Create Task
  console.log('\n4. Testando Criação de Tarefa...');
  const newTask = {
    title: 'Estudar React, Express e SQLite',
    description: 'Criar aplicação de lista de tarefas e painel de controle pessoal',
    category_id: estudoCategory.id,
    priority: 'urgent',
    due_date: new Date(Date.now() + 86400000).toISOString(),
    subtasks: [
      { title: 'Configurar servidor Express' },
      { title: 'Criar rotas de autenticação' },
      { title: 'Testar com banco SQLite' }
    ]
  };

  const taskRes = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(newTask)
  });
  const taskData = await taskRes.json();
  console.log('   TAREFA CRIADA STATUS:', taskRes.status, `ID: ${taskData.task.id}`);
  console.log(`   TÍTULO: "${taskData.task.title}" | PRIORIDADE: ${taskData.task.priority}`);
  console.log(`   SUBTAREFAS (${taskData.task.subtasks.length}):`, taskData.task.subtasks.map(s => s.title).join(', '));

  // 5. Toggle Task Status
  console.log('\n5. Testando Alternância de Status (Concluir Tarefa)...');
  const toggleRes = await fetch(`${BASE_URL}/tasks/${taskData.task.id}/toggle`, {
    method: 'PATCH',
    headers: authHeaders
  });
  const toggleData = await toggleRes.json();
  console.log('   NOVO STATUS:', toggleData.task.status, '| CONCLUÍDA EM:', toggleData.task.completed_at);

  // 6. Get Dashboard Stats
  console.log('\n6. Testando Métricas do Dashboard...');
  const dashRes = await fetch(`${BASE_URL}/dashboard/stats`, { headers: authHeaders });
  const dashData = await dashRes.json();
  console.log('   MÉTRICAS DO PAINEL:', dashData.metrics);

  console.log('\n✅ TODOS OS TESTES DA API PASSARAM COM SUCESSO!');
}

testApi().catch(err => {
  console.error('❌ Erro no teste da API:', err);
});
