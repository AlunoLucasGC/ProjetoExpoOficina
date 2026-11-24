let token = '', resource = 'inscricoes';
const createBox = document.getElementById('adminCreate'), createForm = document.getElementById('createForm');
const head = document.getElementById('adminHead'), body = document.getElementById('adminBody'), feedback = document.getElementById('adminFeedback');
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const columns = {inscricoes:['ID','Nome','E-mail','Telefone','Tipo','Veículo','Status','Ações'],veiculos:['ID','Nome','Categoria','Marca/modelo','Ano','Ações'],atracoes:['ID','Nome','Tipo','Local','Ações'],programacao:['ID','Atividade','Data','Horário','Local','Ações']};
function renderCreateForm(){
  if(!createBox || !createForm) return;
  const schemas={
    veiculos:[['nome','Nome','text',true],['marca','Marca','text',true],['modelo','Modelo','text',true],['ano','Ano','number',false],['categoria','Categoria','select',true,['Antigos','Esportivos','Modificados','Motocicletas']],['descricao','Descrição','textarea',true],['imagem','Caminho da imagem','text',false],['destaque','Destaque','checkbox',false]],
    atracoes:[['nome','Nome','text',true],['tipo','Tipo','text',true],['local','Local','text',true],['descricao','Descrição','textarea',true],['imagem','Caminho da imagem','text',false]],
    programacao:[['titulo','Título da atividade','text',true],['descricao','Descrição','textarea',true],['data_evento','Data','date',true],['horario_inicio','Horário de início','time',true],['horario_fim','Horário de término','time',false],['local','Local','text',true]]
  };
  const fields=schemas[resource]; createBox.hidden=!fields;
  if(!fields)return;
  createForm.innerHTML=fields.map(([name,label,type,required,options])=>{
    let control=type==='textarea'?`<textarea class="form-control" name="${name}" ${required?'required':''}></textarea>`:type==='select'?`<select class="form-select" name="${name}" required>${options.map(o=>`<option>${o}</option>`).join('')}</select>`:type==='checkbox'?`<input class="form-check-input" type="checkbox" name="${name}">`:`<input class="form-control" type="${type}" name="${name}" ${required?'required':''}>`;
    return `<div class="col-md-6"><label class="form-label">${label}</label>${control}</div>`;
  }).join('')+'<div class="col-12"><button class="btn btn-red" type="submit">Cadastrar</button></div>';
}
async function load(){if(!token){feedback.textContent='Informe o token para acessar o painel.';return;}renderCreateForm();head.innerHTML=`<tr>${columns[resource].map(x=>`<th>${x}</th>`).join('')}</tr>`;body.innerHTML='<tr><td colspan="8">Carregando...</td></tr>';try{const r=await fetch(`/api/admin/${resource}`,{headers:{'x-admin-token':token}});const data=await r.json();if(!r.ok)throw Error(data.erro||'Falha ao carregar.');body.innerHTML=data.length?data.map(row=>{let cells=resource==='inscricoes'?[row.id,row.nome,row.email,row.telefone,row.tipo_inscricao,row.veiculo||'—',row.status,`<button class="filter-btn" data-status="${row.id}" data-next="${row.status==='Confirmada'?'Recebida':'Confirmada'}">${row.status==='Confirmada'?'Reabrir':'Confirmar'}</button>`]:resource==='veiculos'?[row.id,row.nome,row.categoria,`${row.marca} ${row.modelo}`,row.ano||'—',`<button class="filter-btn" data-delete="${row.id}">Excluir</button>`]:resource==='atracoes'?[row.id,row.nome,row.tipo,row.local,`<button class="filter-btn" data-delete="${row.id}">Excluir</button>`]:[row.id,row.titulo,new Date(`${row.data_evento}T12:00:00`).toLocaleDateString('pt-BR'),String(row.horario_inicio).slice(0,5),row.local,`<button class="filter-btn" data-delete="${row.id}">Excluir</button>`];return `<tr>${cells.map((c,i)=>`<td>${i===cells.length-1?c:esc(c)}</td>`).join('')}</tr>`}).join(''):'<tr><td colspan="8">Nenhum registro encontrado.</td></tr>';feedback.textContent='Dados carregados.';}catch(e){body.innerHTML=`<tr><td colspan="8">${esc(e.message)}</td></tr>`;feedback.textContent=e.message;}}
document.getElementById('saveToken').addEventListener('click',()=>{token=document.getElementById('adminToken').value.trim();load();});document.querySelectorAll('[data-resource]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-resource]').forEach(x=>x.classList.remove('active'));b.classList.add('active');resource=b.dataset.resource;load();}));
body.addEventListener('click',async e=>{const status=e.target.closest('[data-status]');const del=e.target.closest('[data-delete]');if(!status&&!del)return;const id=(status||del).dataset.status||(status||del).dataset.delete;try{const url=status?`/api/admin/inscricoes/${id}/status`:`/api/admin/${resource}/${id}`;const response=await fetch(url,{method:status?'PATCH':'DELETE',headers:{'Content-Type':'application/json','x-admin-token':token},...(status?{body:JSON.stringify({status:status.dataset.next})}:{})});const data=await response.json();if(!response.ok)throw Error(data.erro);feedback.textContent=data.mensagem;load();}catch(err){feedback.textContent=err.message;}});

createForm?.addEventListener('submit',async event=>{
  event.preventDefault(); if(!token||!['veiculos','atracoes','programacao'].includes(resource))return;
  const payload={}; for(const [key,value] of new FormData(createForm).entries()) payload[key]=value;
  const checkbox=createForm.querySelector('input[type=checkbox][name=destaque]'); if(checkbox)payload.destaque=checkbox.checked;
  if(payload.ano)payload.ano=Number(payload.ano);
  try{const r=await fetch(`/api/admin/${resource}`,{method:'POST',headers:{'Content-Type':'application/json','x-admin-token':token},body:JSON.stringify(payload)});const data=await r.json();if(!r.ok)throw Error(data.erro);feedback.textContent=`${data.mensagem} ID ${data.id}.`;createForm.reset();load();}catch(e){feedback.textContent=e.message;}
});
