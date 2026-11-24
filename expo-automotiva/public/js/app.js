const API = '/api';
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let selectedCategory = 'Todos';

async function request(url, options = {}) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.erro || 'Não foi possível concluir a solicitação.');
  return data;
}

async function loadVehicles(category = 'Todos') {
  const grid = document.getElementById('vehiclesGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="col-12 text-center muted">Carregando...</div>';
  try {
    const vehicles = await request(`${API}/veiculos${category !== 'Todos' ? `?categoria=${encodeURIComponent(category)}` : ''}`);
    if (!vehicles.length) { grid.innerHTML = '<div class="col-12 empty-state">Nenhum veículo cadastrado nesta categoria.</div>'; return; }
    grid.innerHTML = vehicles.map(v => `<div class="col-sm-6 col-lg-3"><article class="vehicle-card"><img src="${escapeHTML(v.imagem || '/assets/hero-expo.jpg')}" alt="${escapeHTML(v.nome)}" loading="lazy" onerror="this.src='/assets/hero-expo.jpg'"><div class="vehicle-card-body"><span class="vehicle-category">${escapeHTML(v.categoria)}${v.destaque ? ' • DESTAQUE' : ''}</span><h3>${escapeHTML(v.nome)}</h3><p>${escapeHTML(v.descricao)}</p><p class="mt-2 small">${escapeHTML(v.marca)} ${escapeHTML(v.modelo)}${v.ano ? ` • ${escapeHTML(v.ano)}` : ''}</p></div></article></div>`).join('');
  } catch (error) { grid.innerHTML = `<div class="col-12 empty-state">${escapeHTML(error.message)}<br>Verifique se o servidor e o MySQL estão em execução.</div>`; }
}

async function loadAttractions() {
  const grid = document.getElementById('attractionsGrid');
  if (!grid) return;
  try {
    const items = await request(`${API}/atracoes`);
    grid.innerHTML = items.length ? items.map(item => `<div class="col-sm-6 col-lg-3"><article class="info-panel h-100 p-3">${item.imagem ? `<img src="${escapeHTML(item.imagem)}" alt="${escapeHTML(item.nome)}" loading="lazy" style="width:100%;height:125px;object-fit:cover;border-radius:7px;margin-bottom:14px">` : ''}<span class="vehicle-category">${escapeHTML(item.tipo)}</span><h3 class="mt-2 mb-2">${escapeHTML(item.nome)}</h3><p class="mb-1">${escapeHTML(item.descricao)}</p><small class="muted">Local: ${escapeHTML(item.local)}</small></article></div>`).join('') : '<div class="col-12 muted">Nenhuma atração cadastrada.</div>';
  } catch (error) { grid.innerHTML = `<div class="col-12 muted">${escapeHTML(error.message)}</div>`; }
}

async function loadSchedule(date = '2026-11-15') {
  const body = document.getElementById('scheduleBody');
  if (!body) return;
  body.innerHTML = '<tr><td colspan="4" class="text-center muted">Carregando...</td></tr>';
  try {
    const rows = await request(`${API}/programacao${date ? `?data=${date}` : ''}`);
    body.innerHTML = rows.length ? rows.map(item => {
      const time = String(item.horario_inicio).slice(0,5) + (item.horario_fim ? ` – ${String(item.horario_fim).slice(0,5)}` : '');
      const dateText = item.data_evento ? new Date(`${item.data_evento}T12:00:00`).toLocaleDateString('pt-BR') : '';
      return `<tr><td>${escapeHTML(time)}<div class="small muted">${escapeHTML(dateText)}</div></td><td><b>${escapeHTML(item.titulo)}</b></td><td>${escapeHTML(item.descricao)}</td><td>${escapeHTML(item.local)}</td></tr>`;
    }).join('') : '<tr><td colspan="4" class="text-center muted">Não há atividades cadastradas para este dia.</td></tr>';
  } catch (error) { body.innerHTML = `<tr><td colspan="4" class="text-center">${escapeHTML(error.message)}</td></tr>`; }
}

async function loadVehicleOptions() {
  const select = document.getElementById('veiculo_id');
  if (!select) return;
  try {
    const vehicles = await request(`${API}/veiculos`);
    select.innerHTML = '<option value="">Selecione se já estiver cadastrado</option>' + vehicles.map(v => `<option value="${v.id}">${escapeHTML(v.nome)} — ${escapeHTML(v.categoria)}</option>`).join('');
  } catch (_) { /* O campo continua opcional caso a API esteja indisponível. */ }
}

document.addEventListener('DOMContentLoaded', () => {
  loadVehicles(); loadAttractions(); loadSchedule(); loadVehicleOptions();
  document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    button.classList.add('active'); selectedCategory = button.dataset.category; loadVehicles(selectedCategory);
  }));
  document.querySelectorAll('.day-btn').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
    button.classList.add('active'); loadSchedule(button.dataset.date);
  }));
  const type = document.getElementById('tipo_inscricao');
  const vehicleField = document.getElementById('vehicleField');
  type?.addEventListener('change', () => { vehicleField.hidden = type.value !== 'Expositor'; });
  document.getElementById('registrationForm')?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget, feedback = document.getElementById('formFeedback'), submit = document.getElementById('submitRegistration');
    feedback.textContent = ''; feedback.className = 'form-feedback'; submit.disabled = true; submit.textContent = 'Enviando...';
    const payload = {
      nome: form.nome.value, email: form.email.value, telefone: form.telefone.value,
      tipo_inscricao: form.tipo_inscricao.value,
      veiculo_id: form.veiculo_id.value ? Number(form.veiculo_id.value) : null,
      mensagem: form.mensagem.value, aceite_privacidade: document.getElementById('privacidade').checked
    };
    try {
      const result = await request(`${API}/inscricoes`, { method: 'POST', body: JSON.stringify(payload) });
      feedback.classList.add('success'); feedback.textContent = `${result.mensagem} Seu protocolo é #${result.protocolo}.`;
      form.reset(); vehicleField.hidden = true;
    } catch (error) { feedback.classList.add('error'); feedback.textContent = error.message; }
    finally { submit.disabled = false; submit.textContent = 'Enviar inscrição →'; }
  });
});
