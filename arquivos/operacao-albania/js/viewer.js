const authGate=document.getElementById('authGate'),authStart=document.getElementById('authStart'),authLog=document.getElementById('authLog'),authFinger=document.getElementById('authFinger'),authFrame=document.getElementById('authFingerFrame'),authProgress=document.getElementById('authProgress'),authMini=document.getElementById('authMini'),accessStamp=document.getElementById('accessStamp'),authState=document.getElementById('authState'),authPercent=document.getElementById('authPercent'),authStep=document.getElementById('authStep'),authConfidence=document.getElementById('authConfidence'),authMatch=document.getElementById('authMatch'); const AUTH_ASSETS={idle:'../../assets/fingerprint-ordem.png',granted:'../../assets/auth-granted-ordem.png',denied:'../../assets/auth-denied-ordem.png'};Object.values(AUTH_ASSETS).forEach(src=>{const i=new Image();i.src=src}); let authBusy=false;
const OPERATION_DATA=window.OrdoActiveOperationData||window.OrdoOperationAlbaniaData||{};
const SFX_CONFIG=OPERATION_DATA.audio||{};
const sfxBank={};
function getSfx(name){
  const cfg=SFX_CONFIG[name];
  if(!cfg||typeof Audio==='undefined')return null;
  if(!sfxBank[name]){
    const audio=new Audio(cfg.src);
    audio.preload='auto';
    audio.volume=cfg.volume;
    audio.loop=!!cfg.loop;
    sfxBank[name]=audio;
  }
  return sfxBank[name];
}
function playSfx(name,{volume=1,rate=1,loop=false,restart=true}={}){
  if(muted)return false;
  if(name!=='ambient')startAmbient();
  const base=getSfx(name); if(!base)return false;
  const cfg=SFX_CONFIG[name]||{};
  try{
    const audio=(loop||cfg.loop)?base:base.cloneNode(true);
    audio.volume=Math.max(0,Math.min(1,(cfg.volume??.45)*volume));
    audio.playbackRate=rate;
    audio.loop=!!(loop||cfg.loop);
    if(restart)audio.currentTime=0;
    const result=audio.play();
    if(result&&result.catch)result.catch(()=>{});
    return true;
  }catch(_){return false;}
}
let ambientStarted=false;
function startAmbient(){
  if(muted)return;
  const audio=getSfx('ambient'); if(!audio)return;
  try{
    audio.loop=true;
    audio.volume=SFX_CONFIG.ambient.volume;
    const result=audio.play();
    if(result&&result.then)result.then(()=>{ambientStarted=true}).catch(()=>{ambientStarted=false});
    else ambientStarted=true;
  }catch(_){ambientStarted=false;}
}
function pauseAmbient(){
  const audio=sfxBank.ambient; if(!audio)return;
  try{audio.pause()}catch(_){}
}
function stopSfx(name){
  const audio=sfxBank[name]; if(!audio)return;
  try{audio.pause();audio.currentTime=0}catch(_){}
}
function uvSound(on){
  if(on){
    playSfx('uvSwitch',{rate:1.03,volume:.9});
    playSfx('uvHum',{loop:true,restart:false});
  }else{
    playSfx('uvSwitch',{rate:.82,volume:.68});
    stopSfx('uvHum');
  }
}
function successSound(){if(!playSfx('authSuccess',{volume:1}))authTone(820,.18,'sine',.04)}
function errorSound(){if(!playSfx('error',{volume:.88}))tone(180,.07,'sawtooth',.025)}

function authTone(freq=280,dur=.06,type='sine',vol=.032){if(muted)return;try{window.__authAudio=window.__authAudio||new (window.AudioContext||window.webkitAudioContext)();const o=window.__authAudio.createOscillator(),g=window.__authAudio.createGain();o.type=type;o.frequency.value=freq;g.gain.value=vol;o.connect(g);g.connect(window.__authAudio.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,window.__authAudio.currentTime+dur);o.stop(window.__authAudio.currentTime+dur)}catch(e){}}
function unlockDossier(){document.body.classList.add('access-granted');authGate.classList.add('unlocking');authTone(520,.08,'triangle',.035);setTimeout(()=>authTone(760,.12,'sine',.042),90);setTimeout(()=>authTone(980,.16,'sine',.034),210);setTimeout(()=>{document.body.classList.remove('auth-locked');authGate.classList.add('hide');if(typeof showUi==='function')showUi(true);setTimeout(()=>{if(!isMobileUI)document.body.classList.add('ui-hidden')},1700)},360);setTimeout(()=>authGate.remove(),980);setTimeout(()=>document.body.classList.remove('access-granted'),900)}
function setAuthLines(lines){authLog.textContent='';(lines||[]).forEach(x=>appendAuthLog(x.text,x.cls||''))}
function appendAuthLog(text,cls=''){const line=document.createElement('div');if(cls)line.className=cls;line.textContent=text;authLog.appendChild(line)}
function setAuthTelemetry(percent,step,confidence,match,state){authProgress.querySelector('span').style.width=percent+'%';authPercent.textContent=percent+'%';authStep.textContent=step;authConfidence.textContent=confidence;authMatch.textContent=match;authState.textContent=state}
function popFinger(){authFinger.style.animation='none';authFinger.offsetHeight;authFinger.style.animation='resultPop .56s cubic-bezier(.2,.82,.22,1) both'}
function setFingerMode(mode='idle'){authFrame.classList.remove('ready','scanning','ok','denied','result');if(mode==='idle'){authFrame.classList.add('ready');authFinger.src=AUTH_ASSETS.idle}else if(mode==='scanning'){authFrame.classList.add('scanning');authFinger.src=AUTH_ASSETS.idle}else if(mode==='granted'){authFrame.classList.add('ok','result');authFinger.src=AUTH_ASSETS.granted;popFinger()}else if(mode==='denied'){authFrame.classList.add('denied','result');authFinger.src=AUTH_ASSETS.denied;popFinger()}}
function setStamp(kind='granted'){accessStamp.classList.remove('show','denied');if(kind==='denied'){accessStamp.textContent='Acesso negado';accessStamp.classList.add('denied')}else{accessStamp.textContent='Acesso concedido'}accessStamp.classList.add('show')}
function finishAuth(result='granted'){authFrame.classList.remove('scanning');if(result==='denied'){authProgress.classList.remove('ok');authProgress.classList.add('denied');setFingerMode('denied');authMini.textContent='Credencial rejeitada';authStart.disabled=false;authStart.textContent='Tentar novamente';setStamp('denied');errorSound();authBusy=false;return}authProgress.classList.remove('denied');authProgress.classList.add('ok');setFingerMode('granted');authMini.textContent='Credencial aceita · preparando arquivo';authStart.textContent='Acesso concedido';setStamp('granted');successSound();sessionPatch({authAt:Date.now()});addTechLog('biometria concedida para '+(OP_META.code||'arquivo ativo'),'ok');authGate.classList.add('unlocking');setTimeout(()=>{startCinematicLoad().then(()=>unlockDossier()).catch(()=>unlockDossier())},760)}
function runAuth(result='granted'){if(authBusy)return;startAmbient();authBusy=true;authStart.disabled=true;authStart.textContent='Verificando...';setFingerMode('scanning');authProgress.classList.remove('ok','denied');setAuthTelemetry(0,'Preparando leitura','--','--','Leitura em preparação');authMini.textContent='Coletando impressão digital';accessStamp.classList.remove('show','denied');authTone(130,.08,'sawtooth',.03);const steps=result==='denied'?[
  {text:'inicializando protocolo seguro',percent:11,step:'Canal seguro aberto',confidence:'10%',match:'--',state:'Inicializando'},
  {text:'coletando impressão digital do operador',percent:28,step:'Digital capturada',confidence:'39%',match:'Traço parcial',state:'Capturando amostra'},
  {text:'comparando padrão biométrico com credencial temporária',percent:46,step:'Comparando com credencial',confidence:'61%',match:'63.2%',state:'Comparando padrões'},
  {text:'divergência encontrada no padrão biométrico',percent:69,step:'Compatibilidade insuficiente',confidence:'74%',match:'48.6%',state:'Credencial rejeitada'},
  {text:'ACESSO NEGADO',percent:100,step:'Autorização recusada',confidence:'Falha',match:'Negado',state:'Acesso negado'}
]:[
  {text:'inicializando protocolo seguro',percent:10,step:'Canal seguro aberto',confidence:'12%',match:'--',state:'Inicializando'},
  {text:'capturando relevo completo da impressão',percent:27,step:'Mapa de sulcos capturado',confidence:'36%',match:'Traço parcial',state:'Capturando amostra'},
  {text:'varrendo microdetalhes e pontos característicos',percent:49,step:'Minúcias em análise',confidence:'68%',match:'72.4%',state:'Processando leitura'},
  {text:'comparando assinatura biométrica com a credencial operacional',percent:71,step:'Compatibilidade em validação',confidence:'87%',match:'91.8%',state:'Comparando padrões'},
  {text:'confirmando autorização delta e removendo lacre operacional',percent:90,step:'Lacre operacional liberado',confidence:'97%',match:'98.9%',state:'Liberando arquivo'},
  {text:'ACESSO CONCEDIDO',percent:100,step:'Arquivo liberado',confidence:'99.8%',match:'Confirmado',state:'Acesso concedido',cls:'ok'}
];setAuthLines([]);steps.forEach((item,i)=>setTimeout(()=>{setAuthTelemetry(item.percent,item.step,item.confidence,item.match,item.state);appendAuthLog(item.text,item.cls||'');authTone(215+i*60,.048,'triangle',.03);if(i===steps.length-1)finishAuth(result)},280+i*440))}
window.__ordoAuthDenied=()=>runAuth('denied');
authStart.addEventListener('click',runAuth);authFrame.addEventListener('click',runAuth);authFrame.addEventListener('touchend',e=>{e.preventDefault();runAuth()},{passive:false});authFrame.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();runAuth()}});

const pages=OPERATION_DATA.pages||[['01-capa.webp','Capa']];
const trans=OPERATION_DATA.transcriptions||pages.map(p=>[p[1], 'Transcrição indisponível.']);

const pageCaptions=OPERATION_DATA.pageCaptions||pages.map(p=>({k:'Arquivo central',t:p[1],m:'Documento operacional'}));
function decodeB64(value){if(!value)return '';try{const bin=atob(value);const bytes=Uint8Array.from(bin,ch=>ch.charCodeAt(0));return new TextDecoder('utf-8').decode(bytes)}catch(_){return String(value||'')}}
function normalizeHiddenLayers(source){const out={};Object.keys(source||{}).forEach(key=>{out[key]=(source[key]||[]).map(note=>Object.assign({},note,{t:note.t||decodeB64(note.s||note.t64)}))});return out}
const hiddenNotes=normalizeHiddenLayers(OPERATION_DATA.hiddenLayers||OPERATION_DATA.layers||{});
const uvCanvas=document.getElementById('uvCanvas'),uvLayer=document.getElementById('uvLayer'),uvFlash=document.getElementById('uvFlash'),uvBtn=document.getElementById('uvBtn'),uvChip=document.getElementById('uvChip');
const MAX_ZOOM=6;
const OP_META=OPERATION_DATA.meta||{};
const STORAGE_PREFIX='ordo_'+String(OP_META.id||'operation').replace(/[^a-z0-9_-]+/gi,'_');
const SESSION_KEY=STORAGE_PREFIX+'_session_v37';
const FINDINGS_KEY=STORAGE_PREFIX+'_findings_v37';
const LOG_KEY=STORAGE_PREFIX+'_logs_v37';
const AUTH_TTL_MS=12*60*60*1000;
function readJSONStore(key,fallback){try{const raw=safeStoreGet(key);return raw?JSON.parse(raw):fallback}catch(_){return fallback}}
function writeJSONStore(key,value){try{safeStoreSet(key,JSON.stringify(value))}catch(_){}}
function totalHiddenCount(){return Object.values(hiddenNotes||{}).reduce((sum,items)=>sum+(Array.isArray(items)?items.length:0),0)}
let sessionState=readJSONStore(SESSION_KEY,{});
let discoveredFindings=readJSONStore(FINDINGS_KEY,{});
let technicalLogs=readJSONStore(LOG_KEY,[]);
function sessionPatch(patch){sessionState=Object.assign({},sessionState||{},patch,{updatedAt:Date.now()});writeJSONStore(SESSION_KEY,sessionState)}
function clampPageIndex(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(pages.length-1,Math.round(n))):0}
function clockStamp(){const d=new Date();return d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}
function pageLabel(pageIndex=i){const page=pages[pageIndex]||['','Página'];return 'P'+String(pageIndex+1).padStart(2,'0')+' · '+page[1]}
function addTechLog(text,type='info'){
  const entry={time:clockStamp(),type,text:String(text||'evento registrado')};
  technicalLogs.push(entry);
  if(technicalLogs.length>72)technicalLogs=technicalLogs.slice(-72);
  writeJSONStore(LOG_KEY,technicalLogs);
  renderLogs();
}
function renderLogs(){
  const list=document.getElementById('technicalLogs'),summary=document.getElementById('logsSummary');
  if(!list)return;
  list.textContent='';
  if(summary)summary.textContent=(technicalLogs.length||0)+' evento(s) registrados nesta sessão local.';
  if(!technicalLogs.length){const empty=document.createElement('div');empty.className='log-empty';empty.textContent='Nenhum evento catalogado ainda.';list.appendChild(empty);return;}
  technicalLogs.slice().reverse().forEach(entry=>{const row=document.createElement('div');row.className='log-line '+(entry.type||'info');const time=document.createElement('time');time.textContent=entry.time||'--:--:--';const span=document.createElement('span');span.textContent=entry.text||'';row.append(time,span);list.appendChild(row);});
}
function findingKey(pageIndex,noteIndex){return pageIndex+':'+noteIndex}
function sortedFindings(){return Object.values(discoveredFindings||{}).sort((a,b)=>(a.page-b.page)||(a.note-b.note))}
function renderFindings(){
  const list=document.getElementById('findingsList'),summary=document.getElementById('findingsSummary');
  if(!list)return;
  const items=sortedFindings(),total=totalHiddenCount();
  list.textContent='';
  if(summary)summary.textContent=items.length+' de '+total+' fragmento(s) UV catalogados.';
  if(!items.length){const empty=document.createElement('div');empty.className='finding-empty';empty.textContent='Nenhum fragmento UV catalogado. Ative a luz UV e examine as páginas.';list.appendChild(empty);updateEndCard();return;}
  items.forEach(item=>{const card=document.createElement('article');card.className='finding-card';const btn=document.createElement('button');btn.type='button';btn.dataset.page=String(item.page);const meta=document.createElement('div');meta.className='finding-meta';meta.textContent=pageLabel(item.page);const body=document.createElement('div');body.className='finding-text';body.textContent=item.text||'Fragmento sem leitura.';btn.append(meta,body);btn.onclick=()=>{setPage(item.page,item.page>i?1:-1);closeMenus();showSystemToast('Página do achado aberta: '+pageLabel(item.page));};card.appendChild(btn);list.appendChild(card);});
  updateEndCard();
}
function markFinding(pageIndex,note,noteIndex){
  const key=findingKey(pageIndex,noteIndex);
  if(discoveredFindings[key])return false;
  discoveredFindings[key]={page:pageIndex,note:noteIndex,text:String(note.t||'Fragmento ilegível'),foundAt:Date.now(),label:pageLabel(pageIndex)};
  writeJSONStore(FINDINGS_KEY,discoveredFindings);
  renderFindings();
  addTechLog('fragmento UV catalogado em '+pageLabel(pageIndex),'uv');
  showSystemToast('Fragmento UV catalogado · '+pageLabel(pageIndex));
  playSfx('uvSwitch',{volume:.38,rate:1.18});
  return true;
}
function scanUVDiscoveriesAt(x,y){
  const notes=hiddenNotes[i]||[];
  if(!notes.length||uvAwaitMoveAfterPage)return;
  const mode=getUVMode(),quality=getUVQuality();
  notes.forEach((note,idx)=>{
    if(discoveredFindings[findingKey(i,idx)])return;
    const nx=uvCW*(Number(note.x)||50)/100,ny=uvCH*(Number(note.y)||50)/100;
    const dist=Math.hypot(nx-x,ny-y);
    const threshold=((note.c==='mark'?118:104)*mode.reach*quality.reach)/Math.max(.90,zoom*.35);
    if(dist<threshold)markFinding(i,note,idx);
  });
}
function updateEndCard(){
  const card=document.getElementById('endCard'),bodyEl=document.getElementById('endCardBody');
  if(!card||!bodyEl)return;
  const found=sortedFindings().length,total=totalHiddenCount();
  bodyEl.innerHTML='<span>Arquivo encerrado. Integridade parcialmente recomposta.</span><div class="end-metrics"><div class="end-metric"><small>Fragmentos UV</small><strong>'+found+' / '+total+'</strong></div><div class="end-metric"><small>Última página</small><strong>'+String(i+1).padStart(2,'0')+'</strong></div></div><span>'+(found<total?'Ainda existem anomalias não catalogadas.':'Todas as anomalias UV conhecidas foram catalogadas.')+'</span>';
  card.classList.toggle('show',i===pages.length-1);
}
function revealCurrentPageFindings(){
  (hiddenNotes[i]||[]).forEach((note,idx)=>markFinding(i,note,idx));
  renderFindings();
}
function jumpNextFindingPage(){
  const pagesWithFindings=[...new Set(sortedFindings().map(item=>item.page))].sort((a,b)=>a-b);
  if(!pagesWithFindings.length){showSystemToast('Nenhum achado catalogado ainda');return;}
  const next=pagesWithFindings.find(page=>page>i)??pagesWithFindings[0];
  setPage(next,next>i?1:-1);
  closeMenus();
}
function clearFindingsData(){discoveredFindings={};writeJSONStore(FINDINGS_KEY,discoveredFindings);renderFindings();addTechLog('achados UV limpos pelo operador','warn');showSystemToast('Achados UV limpos')}
function clearLogsData(){technicalLogs=[];writeJSONStore(LOG_KEY,technicalLogs);renderLogs();showSystemToast('Logs limpos')}
function resetSessionData(){sessionState={};discoveredFindings={};technicalLogs=[];writeJSONStore(SESSION_KEY,sessionState);writeJSONStore(FINDINGS_KEY,discoveredFindings);writeJSONStore(LOG_KEY,technicalLogs);renderFindings();renderLogs();showSystemToast('Sessão local resetada');setTimeout(()=>location.reload(),460)}
function refreshMasterDiag(){const diag=document.getElementById('masterDiag');if(!diag)return;diag.textContent=[OP_META.code||'OP sem código',OP_META.title||'Operação', 'Página atual: '+pageLabel(i), 'Zoom: '+Math.round(zoom*100)+'%', 'UV: '+(uvOn?'ligada · '+getUVMode().title:'desligada'), 'Achados: '+sortedFindings().length+'/'+totalHiddenCount(), 'Logs: '+technicalLogs.length, 'Áudio: '+(muted?'desligado':'ligado')].join('\n')}
function toggleMaster(force){const overlay=document.getElementById('masterOverlay');if(!overlay)return;const show=typeof force==='boolean'?force:!overlay.classList.contains('show');overlay.classList.toggle('show',show);overlay.setAttribute('aria-hidden',show?'false':'true');if(show){refreshMasterDiag();showUi(true);const input=document.getElementById('masterPageInput');if(input){input.max=String(pages.length);input.value=String(i+1)}}}
function maybeRestoreAuthSession(){
  const authAt=Number(sessionState&&sessionState.authAt)||0;
  if(!authAt||Date.now()-authAt>AUTH_TTL_MS)return;
  document.body.classList.add('session-restored');
  setTimeout(()=>{
    if(!document.body.classList.contains('auth-locked')||authBusy)return;
    authBusy=true;
    setFingerMode('granted');
    setAuthTelemetry(100,'Sessão restaurada','99.8%','Confirmado','Acesso restaurado');
    setAuthLines([{text:'sessão biométrica anterior localizada',cls:'ok'},{text:'credencial temporária restaurada',cls:'ok'},{text:'reabrindo consulta local',cls:'ok'}]);
    authMini.textContent='Sessão anterior restaurada';
    authStart.textContent='Acesso restaurado';
    setStamp('granted');
    addTechLog('sessão biométrica anterior restaurada','ok');
    startCinematicLoad().then(()=>unlockDossier()).catch(()=>unlockDossier());
  },520);
}
function initSessionControls(){
  const byId=id=>document.getElementById(id);
  byId('openFindings')?.addEventListener('click',()=>openDrawer('findingsDrawer'));
  byId('openLogs')?.addEventListener('click',()=>openDrawer('logsDrawer'));
  byId('endOpenFindings')?.addEventListener('click',()=>openDrawer('findingsDrawer'));
  byId('endOpenLogs')?.addEventListener('click',()=>openDrawer('logsDrawer'));
  byId('clearFindings')?.addEventListener('click',clearFindingsData);
  byId('jumpNextFinding')?.addEventListener('click',jumpNextFindingPage);
  byId('clearLogs')?.addEventListener('click',clearLogsData);
  byId('copyLogs')?.addEventListener('click',()=>{const text=technicalLogs.map(l=>'['+(l.time||'--:--:--')+'] '+l.text).join('\n');navigator.clipboard?.writeText(text).then(()=>showSystemToast('Logs copiados')).catch(()=>showSystemToast('Não foi possível copiar os logs'))});
  byId('masterClose')?.addEventListener('click',()=>toggleMaster(false));
  byId('masterUnlock')?.addEventListener('click',()=>{sessionPatch({authAt:Date.now()});startCinematicLoad().then(()=>unlockDossier()).catch(()=>unlockDossier());toggleMaster(false);addTechLog('liberação manual pelo protocolo mestre','warn')});
  byId('masterToggleUV')?.addEventListener('click',()=>{toggleUV();refreshMasterDiag()});
  byId('masterPageFirst')?.addEventListener('click',()=>{setPage(0,-1);refreshMasterDiag()});
  byId('masterPageLast')?.addEventListener('click',()=>{setPage(pages.length-1,1);refreshMasterDiag()});
  byId('masterRevealFindings')?.addEventListener('click',()=>{revealCurrentPageFindings();refreshMasterDiag()});
  byId('masterResetSession')?.addEventListener('click',resetSessionData);
  byId('masterGoPage')?.addEventListener('click',()=>{const n=clampPageIndex((Number(byId('masterPageInput')?.value)||1)-1);setPage(n,n>i?1:-1);refreshMasterDiag()});
  document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='o'){e.preventDefault();toggleMaster()}if(e.key==='Escape')toggleMaster(false)});
  renderFindings();renderLogs();updateEndCard();
}
function initViewerState(){
  if(Number.isFinite(Number(sessionState.bg))){bg=Math.max(0,Math.min(bgs.length-1,Number(sessionState.bg)));document.documentElement.style.setProperty('--desk',`url('backgrounds/${bgs[bg]}')`)}
  setUVQuality(pickInitialUVQuality());
  applyUVMode(sessionState.uvMode&&UV_MODES[sessionState.uvMode]?sessionState.uvMode:'cinematografica');
  const restoredPage=clampPageIndex(sessionState.page??0);
  zoom=Number(sessionState.zoom)||1;
  setPage(restoredPage,0);
  preload();
  if(!isMobileUI){setTimeout(()=>body.classList.add('ui-hidden'),900)}
  addTechLog('visualizador inicializado em '+pageLabel(restoredPage),'ok');
  initSessionControls();
  maybeRestoreAuthSession();
}

const UV_MODES={discreta:{title:'Discreta',radius:0.95,whole:.76,char:.84,noise:.06,glow:.70,reach:.94,ambient:.88,box:.84,ink:.84,bloom:.78},equilibrada:{title:'Equilibrada',radius:1,whole:1,char:1,noise:.11,glow:1,reach:1,ambient:1,box:1,ink:1,bloom:1},pericial:{title:'Pericial',radius:1.03,whole:.90,char:1.04,noise:.05,glow:.82,reach:1.05,ambient:.94,box:.92,ink:.92,bloom:.86},cinematografica:{title:'Cinemática',radius:1.12,whole:1.06,char:1.08,noise:.13,glow:1.14,reach:1.1,ambient:1.04,box:1.04,ink:1.08,bloom:1.16}};
const UV_QUALITY_PROFILES={low:{label:'eco',dprCap:1.18,resBoost:.74,noiseMul:.0,glowMul:.72,wholeMul:.92,charMul:.94,distress:0,beam:.84,smoothing:'medium',tail:0,reach:.94},medium:{label:'balanceada',dprCap:1.62,resBoost:.88,noiseMul:.48,glowMul:.88,wholeMul:.98,charMul:.98,distress:.55,beam:.94,smoothing:'high',tail:1,reach:.98},high:{label:'alta',dprCap:2.08,resBoost:1,noiseMul:1,glowMul:1,wholeMul:1.03,charMul:1.03,distress:1,beam:1,smoothing:'high',tail:1,reach:1}};
let uvMode='cinematografica';
let uvQuality='high',uvAdaptive=true,uvFrameTimes=[],uvLastPaintTs=0,uvQualityCooldown=0;
let uvOn=false,uvRAF=0,uvLastX=0,uvLastY=0,uvCtx=null,uvDpr=1,uvCW=0,uvCH=0,uvNoise=null,uvNoisePattern=null,uvAwaitMoveAfterPage=false;
function getUVMode(){return UV_MODES[uvMode]||UV_MODES.equilibrada}
function getUVQuality(){return UV_QUALITY_PROFILES[uvQuality]||UV_QUALITY_PROFILES.high}
function pickInitialUVQuality(){const mem=navigator.deviceMemory||4;const cores=navigator.hardwareConcurrency||4;return (mem<=4||cores<=4)?'medium':'high'}
function setUVQuality(level){if(!UV_QUALITY_PROFILES[level]||uvQuality===level)return;uvQuality=level;resizeUVCanvas(true);updateUVChip()}
function updateUVChip(){uvChip.innerHTML=uvOn?`Luz UV forense ativa · ${getUVMode().title} <small>· perfil ${getUVQuality().label}</small>`:'Luz UV desligada'}
function applyUVMode(mode){if(!UV_MODES[mode])return;uvMode=mode;sessionPatch({uvMode:mode});document.querySelectorAll('[data-uv-mode]').forEach(btn=>btn.classList.toggle('active',btn.dataset.uvMode===mode));updateUVChip();if(uvOn&&!uvRAF)uvRAF=requestAnimationFrame(paintUV)}
function renderUV(){resizeUVCanvas(true)}
function updateUVPerfMode(){document.body.classList.toggle('uv-lite',uvOn&&(zoom>2.8||uvQuality==='low'))}
function clearUVCanvas(){
  if(!uvCtx||!uvCW||!uvCH)return;
  uvCtx.setTransform(uvDpr,0,0,uvDpr,0,0);
  uvCtx.clearRect(0,0,uvCW,uvCH);
}
function holdUVUntilMove(){
  if(!uvOn)return;
  uvAwaitMoveAfterPage=true;
  resizeUVCanvas(true);
  clearUVCanvas();
  if(uvFlash)uvFlash.style.transform='translate3d(-999px,-999px,0)';
}
function updateUVAdaptiveQuality(ts=0){if(!uvAdaptive||!uvOn||!ts)return; if(uvLastPaintTs){const dt=ts-uvLastPaintTs;if(dt>5&&dt<80){uvFrameTimes.push(dt); if(uvFrameTimes.length>24)uvFrameTimes.shift();}} uvLastPaintTs=ts; if(uvFrameTimes.length<12||ts<uvQualityCooldown)return; const avg=uvFrameTimes.reduce((a,b)=>a+b,0)/uvFrameTimes.length; if(avg>30&&uvQuality==='high'){setUVQuality('medium');uvQualityCooldown=ts+1400;} else if(avg>38&&uvQuality==='medium'){setUVQuality('low');uvQualityCooldown=ts+1800;} else if(avg<15&&uvQuality==='low'){setUVQuality('medium');uvQualityCooldown=ts+2200;} else if(avg<12.6&&uvQuality==='medium'){setUVQuality('high');uvQualityCooldown=ts+2400;}}
function makeUVNoise(){
  const c=document.createElement('canvas');c.width=96;c.height=96;
  const cx=c.getContext('2d',{alpha:true});
  const imgData=cx.createImageData(c.width,c.height),data=imgData.data;
  for(let p=0;p<data.length;p+=4){
    const v=190+Math.random()*65;
    data[p]=210;data[p+1]=205;data[p+2]=255;data[p+3]=Math.random()<.22?Math.floor(v*.18):0;
  }
  cx.putImageData(imgData,0,0);
  return c;
}
function resizeUVCanvas(force=false){
  if(!uvCanvas||!img)return;
  const w=Math.max(1,Math.round(img.clientWidth||wrap.clientWidth||1));
  const h=Math.max(1,Math.round(img.clientHeight||wrap.clientHeight||1));
  const baseDpr=window.devicePixelRatio||1;
  const quality=getUVQuality();
  const boost=(zoom<=1.2?1.04:(zoom<=2.4?1.2:(zoom<=4?1.42:1.58)))*quality.resBoost;
  const nextDpr=Math.max(1.05,Math.min(quality.dprCap,baseDpr*boost));
  if(!force&&uvCW===w&&uvCH===h&&Math.abs(uvDpr-nextDpr)<.01)return;
  uvCW=w;uvCH=h;uvDpr=nextDpr;
  uvCanvas.style.width=w+'px';uvCanvas.style.height=h+'px';
  uvCanvas.width=Math.max(1,Math.round(w*uvDpr));uvCanvas.height=Math.max(1,Math.round(h*uvDpr));
  uvCtx=uvCanvas.getContext('2d',{alpha:true,desynchronized:true});
  if(uvCtx){
    uvCtx.setTransform(uvDpr,0,0,uvDpr,0,0);
    uvCtx.imageSmoothingEnabled=true;
    uvCtx.imageSmoothingQuality=quality.smoothing;
  }
  if(!uvNoise){uvNoise=makeUVNoise();uvNoisePattern=uvCtx&&uvCtx.createPattern(uvNoise,'repeat')}
}
function uvLocalPoint(clientX,clientY){
  const r=wrap.getBoundingClientRect();
  return{x:(clientX-r.left)/Math.max(1,r.width)*uvCW,y:(clientY-r.top)/Math.max(1,r.height)*uvCH};
}
function getUVLayout(note,font,base,lineH){
  if(!uvCtx)return {lines:[],chars:[],maxWidth:0};
  const key=[font,base.toFixed(2),lineH.toFixed(2),note.t||'',note.c||''].join('|');
  if(note._uvLayout&&note._uvLayout.key===key)return note._uvLayout;
  const lines=String(note.t||'').split('\n');
  const tracking=note.c==='mark'?Math.max(.6,base*.045):Math.max(.8,base*.06);
  const widths=[];
  uvCtx.save();
  uvCtx.font=font;
  lines.forEach(line=>{
    let width=0;
    for(let i=0;i<line.length;i++){
      width+=uvCtx.measureText(line[i]).width;
      if(i<line.length-1)width+=tracking;
    }
    widths.push(width);
  });
  const chars=[];
  const startY=-(lines.length-1)*lineH/2;
  lines.forEach((line,row)=>{
    let cursor=-widths[row]/2;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      const w=uvCtx.measureText(ch).width;
      chars.push({ch,x:cursor+w/2,y:startY+row*lineH,w,row});
      cursor+=w+tracking;
    }
  });
  uvCtx.restore();
  note._uvLayout={key,lines,chars,maxWidth:Math.max(0,...widths),tracking};
  return note._uvLayout;
}
function drawUVText(note,x,y){
  if(!uvCtx||!uvCW||!uvCH)return;
  const nx=uvCW*(Number(note.x)||50)/100,ny=uvCH*(Number(note.y)||50)/100;
  const dist=Math.hypot(nx-x,ny-y);
  const mode=getUVMode();
  const quality=getUVQuality();
  const reach=((note.c==='mark'?230:190)*mode.reach*quality.reach)/Math.max(.85,zoom*.55);
  const raw=Math.max(0,1-dist/reach);
  if(raw<=.015)return;
  const noteAlpha=Math.pow(raw,1.5);
  const base=note.c==='mark'?Math.max(18,Math.min(34,uvCW*.034)):Math.max(10,Math.min(18,uvCW*.018));
  const lineH=base*1.22;
  const angle=(Number(note.r)||0)*Math.PI/180;
  const cos=Math.cos(angle),sin=Math.sin(angle);
  const dxSpot=x-nx,dySpot=y-ny;
  const localSpotX=dxSpot*cos+dySpot*sin;
  const localSpotY=-dxSpot*sin+dySpot*cos;
  const font=(note.c==='mark'?`700 ${base}px Georgia, 'Times New Roman', serif`:`700 ${base}px monospace`);
  const layout=getUVLayout(note,font,base,lineH);
  uvCtx.save();
  uvCtx.translate(nx,ny);uvCtx.rotate(angle);
  uvCtx.textAlign='center';uvCtx.textBaseline='middle';uvCtx.font=font;
  if(note.c==='redacted'){
    const boxW=Math.min(uvCW*.58,Math.max(base*8,layout.maxWidth+base*1.6));
    const boxH=layout.lines.length*lineH+base*.8;
    uvCtx.globalAlpha=Math.min(.92,.10+noteAlpha*.32*mode.box);
    uvCtx.fillStyle=`rgba(48,31,82,${.08+noteAlpha*.12*mode.box})`;
    uvCtx.strokeStyle=`rgba(228,217,255,${.16+noteAlpha*.18*mode.box})`;
    uvCtx.lineWidth=1;
    uvCtx.fillRect(-boxW/2,-boxH/2,boxW,boxH);
    uvCtx.strokeRect(-boxW/2,-boxH/2,boxW,boxH);
  }
  const wholeAlpha=Math.min(.36,(.03+noteAlpha*.20)*mode.whole*quality.wholeMul);
  const startY=-(layout.lines.length-1)*lineH/2;
  uvCtx.globalAlpha=wholeAlpha;
  uvCtx.shadowColor='rgba(214,198,255,.46)';
  uvCtx.shadowBlur=2.2+noteAlpha*4.8*mode.glow*quality.glowMul;
  uvCtx.fillStyle=note.c==='mark'?`rgba(245,240,255,${.18+wholeAlpha*.82})`:`rgba(240,235,255,${.16+wholeAlpha*.84})`;
  layout.lines.forEach((line,row)=>uvCtx.fillText(line,0,startY+row*lineH));
  if(quality.distress){
    uvCtx.globalCompositeOperation='screen';
    layout.lines.forEach((line,row)=>{
      const seed=Math.sin((row+1)*19.37+nx*.011+ny*.007);
      const jitterX=seed*.28;
      const jitterY=Math.cos((row+1)*11.17+nx*.009)*.22;
      uvCtx.globalAlpha=(.035+noteAlpha*.085)*mode.ink*quality.distress;
      uvCtx.shadowBlur=1.2+noteAlpha*2.8*mode.bloom*quality.glowMul;
      uvCtx.fillStyle='rgba(210,198,255,.78)';
      uvCtx.fillText(line,jitterX,startY+row*lineH+jitterY);
    });
    uvCtx.globalCompositeOperation='source-over';
  }
  const charReach=((note.c==='mark'?150:128)*mode.reach*quality.reach)/Math.max(.94,zoom*.28);
  const ambient=(.065+noteAlpha*.12)*mode.ambient;
  layout.chars.forEach((glyph,index)=>{
    if(!glyph.ch.trim())return;
    const d=Math.hypot(glyph.x-localSpotX,glyph.y-localSpotY);
    const local=Math.max(0,1-d/charReach);
    if(local<=.008&&noteAlpha<.10)return;
    const seed=Math.abs(Math.sin((glyph.x+7.13)*(glyph.y+3.71)+(index+1)*1.618));
    const ink=(.84+seed*.18)*mode.ink;
    const tail=quality.tail?Math.max(0,1-(Math.abs(glyph.x-localSpotX)/(charReach*1.5)))*.08:0;
    const charAlpha=Math.min(.985,((ambient+Math.pow(local,1.62)*(.86*noteAlpha+.28)+tail)*mode.char*quality.charMul*ink));
    uvCtx.globalAlpha=charAlpha;
    uvCtx.shadowColor='rgba(222,207,255,.82)';
    uvCtx.shadowBlur=2.2+charAlpha*10.5*mode.glow*quality.glowMul;
    uvCtx.fillStyle=note.c==='mark'?`rgba(250,246,255,${.24+charAlpha*.74})`:`rgba(246,241,255,${.20+charAlpha*.78})`;
    uvCtx.fillText(glyph.ch,glyph.x,glyph.y);
  });
  uvCtx.restore();
}
function paintUV(ts){
  uvRAF=0;
  if(!uvOn||!uvCanvas)return;
  updateUVAdaptiveQuality(ts||performance.now());
  resizeUVCanvas();
  const ctx=uvCtx;if(!ctx)return;
  const mode=getUVMode();
  const quality=getUVQuality();
  ctx.setTransform(uvDpr,0,0,uvDpr,0,0);
  ctx.clearRect(0,0,uvCW,uvCH);
  if(uvAwaitMoveAfterPage){
    if(uvFlash)uvFlash.style.transform='translate3d(-999px,-999px,0)';
    return;
  }
  const p=uvLocalPoint(uvLastX,uvLastY),x=p.x,y=p.y;
  scanUVDiscoveriesAt(x,y);
  const screenRadius=(zoom>3?154:174)*mode.radius*quality.beam;
  const r=Math.max(38,screenRadius/Math.max(.78,zoom));
  ctx.save();
  ctx.globalCompositeOperation='source-over';
  let g=ctx.createRadialGradient(x,y,0,x,y,r*1.45);
  g.addColorStop(0,`rgba(255,255,255,${.21*mode.glow*quality.glowMul})`);
  g.addColorStop(.10,`rgba(224,242,255,${.16*mode.glow*quality.glowMul})`);
  g.addColorStop(.24,`rgba(169,145,255,${.18*mode.glow*quality.glowMul})`);
  g.addColorStop(.46,`rgba(87,58,204,${.11*mode.glow*quality.glowMul})`);
  g.addColorStop(.72,`rgba(33,23,88,${.04*mode.glow*quality.glowMul})`);
  g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*1.45,0,Math.PI*2);ctx.fill();
  ctx.save();
  ctx.translate(x,y);ctx.rotate(-.34);ctx.scale(1.16,.90);
  let beam=ctx.createRadialGradient(0,0,0,0,0,r*1.18);
  beam.addColorStop(0,`rgba(255,255,255,${.14*mode.bloom*quality.glowMul})`);
  beam.addColorStop(.45,`rgba(182,167,255,${.11*mode.bloom*quality.glowMul})`);
  beam.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=beam;ctx.beginPath();ctx.arc(0,0,r*1.12,0,Math.PI*2);ctx.fill();
  ctx.restore();
  let core=ctx.createRadialGradient(x-r*.22,y-r*.20,0,x,y,r*.62);
  core.addColorStop(0,`rgba(255,255,255,${.20*mode.glow*quality.glowMul})`);
  core.addColorStop(.38,`rgba(211,230,255,${.13*mode.glow*quality.glowMul})`);
  core.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=core;ctx.beginPath();ctx.arc(x,y,r*.68,0,Math.PI*2);ctx.fill();
  if(uvNoisePattern&&zoom<3.35&&quality.noiseMul>0){
    ctx.save();ctx.globalAlpha=mode.noise*quality.noiseMul;ctx.fillStyle=uvNoisePattern;ctx.beginPath();ctx.arc(x,y,r*1.12,0,Math.PI*2);ctx.clip();ctx.fillRect(x-r*1.2,y-r*1.2,r*2.4,r*2.4);ctx.restore();
  }
  ctx.globalAlpha=.12*mode.glow*quality.glowMul;ctx.strokeStyle='rgba(239,242,255,.42)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,r*.42,0,Math.PI*2);ctx.stroke();
  ctx.restore();
  (hiddenNotes[i]||[]).forEach(note=>drawUVText(note,x,y));
  uvFlash.style.transform=`translate3d(${uvLastX}px,${uvLastY}px,0) translate3d(-50%,-50%,0)`;
}
function setUVAt(clientX,clientY){
  if(!uvOn||!uvCanvas)return;
  if(uvAwaitMoveAfterPage){
    uvAwaitMoveAfterPage=false;
    uvFrameTimes=[];uvLastPaintTs=0;
  }else if(Math.abs(clientX-uvLastX)<1.25&&Math.abs(clientY-uvLastY)<1.25)return;
  uvLastX=clientX;uvLastY=clientY;
  if(!uvRAF)uvRAF=requestAnimationFrame(paintUV);
}
function toggleUV(force){
  uvOn=typeof force==='boolean'?force:!uvOn;
  uvAwaitMoveAfterPage=false;
  if(uvOn){uvFrameTimes=[];uvLastPaintTs=0;}
  document.body.classList.toggle('uv-on',uvOn);
  uvBtn.textContent='Luz UV: '+(uvOn?'ligada':'desligada');
  updateUVChip();
  renderUV();updateUVPerfMode();
  if(uvOn){
    const r=wrap.getBoundingClientRect();uvLastX=r.left+r.width*.52;uvLastY=r.top+r.height*.48;
    if(!uvRAF)uvRAF=requestAnimationFrame(paintUV);
    uvSound(true);
  }else{
    if(uvCtx)uvCtx.clearRect(0,0,uvCW,uvCH);
    document.body.classList.remove('uv-lite');
    uvSound(false);
  }
  sessionPatch({uvOn,uvMode});
  addTechLog('luz UV '+(uvOn?'ativada':'desativada')+' em '+pageLabel(i),uvOn?'uv':'info');
  showUi();
}
function safeStoreGet(key){try{return localStorage.getItem(key)}catch(_){return null}}
function safeStoreSet(key,value){try{localStorage.setItem(key,value)}catch(_){}}
let i=0,zoom=1,tx=0,ty=0,timer=null,bg=0,muted=safeStoreGet('ordo_audio_muted')==='1',turnLock=false,lastTap=0; const bgs=OPERATION_DATA.backgrounds||['mesa.webp','madeira.webp','couro.webp'];
const body=document.body,img=document.getElementById('pageImg'),wrap=document.getElementById('pageWrap'),stage=document.getElementById('stage'),count=document.getElementById('count'),progress=document.getElementById('progress'),dots=document.getElementById('dots'),topbar=document.getElementById('topbar'),turnOverlay=document.getElementById('turnOverlay'),pageCaption=document.getElementById('pageCaption'),cinemaFlash=document.getElementById('cinemaFlash');const isMobileUI=window.matchMedia("(max-width: 760px), (pointer: coarse)").matches,topRevealZone=document.getElementById("topRevealZone");if(isMobileUI){body.classList.add("mobile-ui");body.classList.remove("ui-hidden")}img.decoding='async';img.fetchPriority='high';img.addEventListener('load',()=>{body.classList.remove('asset-error');img.classList.remove('image-missing');resizeUVCanvas(true);if(uvOn&&!uvRAF)uvRAF=requestAnimationFrame(paintUV)});img.addEventListener('error',()=>{body.classList.add('asset-error');img.classList.add('image-missing');showSystemToast('Página não encontrada: '+(pages[i]&&pages[i][0]?pages[i][0]:'arquivo desconhecido'));});window.addEventListener('resize',()=>{resizeUVCanvas(true);if(uvOn&&!uvRAF)uvRAF=requestAnimationFrame(paintUV)},{passive:true});
let audioCtx; function tone(freq=420,dur=.05,type='sine',vol=.035){if(muted)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)(); const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.type=type;o.frequency.value=freq;g.gain.value=vol;o.connect(g);g.connect(audioCtx.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);o.stop(audioCtx.currentTime+dur);}catch(e){}}
function clickSound(){if(!playSfx('click',{volume:1}))tone(360,.045,'triangle',.025)} function pageSound(){if(!playSfx('page',{volume:1})){tone(150,.035,'sawtooth',.018);setTimeout(()=>tone(230,.055,'triangle',.018),45)}}
const preloadedImages=new Set();
function preloadImage(src){if(preloadedImages.has(src))return;preloadedImages.add(src);const im=new Image();im.decoding='async';im.src=src;if(im.decode)im.decode().catch(()=>{});}
function loadAssetImage(src){return new Promise(resolve=>{const im=new Image();im.decoding='async';im.onload=()=>{preloadedImages.add(src);resolve({src,ok:true})};im.onerror=()=>resolve({src,ok:false});im.src=src;if(im.decode)im.decode().then(()=>{preloadedImages.add(src);resolve({src,ok:true})}).catch(()=>{});});}
const loaderEls={panel:document.getElementById('cinematicLoader'),title:document.getElementById('loaderTitle'),subtitle:document.getElementById('loaderSubtitle'),bar:document.getElementById('loaderBar'),percent:document.getElementById('loaderPercent'),count:document.getElementById('loaderCount'),log:document.getElementById('loaderLog')};
let cinematicLoaded=false;
function loaderLogLine(text,cls=''){if(!loaderEls.log)return;const line=document.createElement('div');if(cls)line.className=cls;line.textContent=text;loaderEls.log.appendChild(line);loaderEls.log.scrollTop=loaderEls.log.scrollHeight;}
function setLoaderProgress(done,total,label){const pct=total?Math.round(done/total*100):100;if(loaderEls.bar)loaderEls.bar.style.width=pct+'%';if(loaderEls.percent)loaderEls.percent.textContent=pct+'%';if(loaderEls.count)loaderEls.count.textContent=done+'/'+total+' ativos';if(label)loaderLogLine(label);}
function operationAssetList(){const list=[];pages.forEach(p=>list.push({src:'images/'+p[0],label:'página '+String(list.length+1).padStart(2,'0')+' indexada'}));(bgs||[]).forEach(bg=>list.push({src:'backgrounds/'+bg,label:'fundo '+bg.replace(/\..+$/,'')+' preparado'}));['../../assets/ordo-mark-parchment.png','../../assets/ordo-logo-parchment.png','../../assets/auth-granted-ordem.png'].forEach(src=>list.push({src,label:'selo operacional validado'}));return list;}
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
async function startCinematicLoad(){if(cinematicLoaded)return;if(!loaderEls.panel){cinematicLoaded=true;preload();return;}cinematicLoaded=true;const cfg=OPERATION_DATA.loader||{};loaderEls.panel.classList.add('show');loaderEls.panel.setAttribute('aria-hidden','false');if(loaderEls.title)loaderEls.title.textContent=cfg.title||'Indexação do dossiê';if(loaderEls.subtitle)loaderEls.subtitle.textContent=cfg.subtitle||'Preparando pacote visual em alta resolução';if(loaderEls.log)loaderEls.log.textContent='';const steps=cfg.steps||['validando lacre operacional','indexando páginas do dossiê','liberando consulta local'];steps.forEach((step,idx)=>setTimeout(()=>loaderLogLine(step),idx*160));const assets=operationAssetList();let done=0;setLoaderProgress(0,assets.length,'fila de ativos montada');const started=performance.now();for(const item of assets){const result=await loadAssetImage(item.src);done+=1;setLoaderProgress(done,assets.length,(result.ok?'✓ ':'! ')+item.label);}
const min=Number(cfg.minimumMs)||1200;const elapsed=performance.now()-started;if(elapsed<min)await sleep(min-elapsed);loaderLogLine('consulta liberada','ok');setLoaderProgress(assets.length,assets.length);await sleep(260);loaderEls.panel.classList.add('complete');await sleep(360);loaderEls.panel.classList.remove('show');loaderEls.panel.setAttribute('aria-hidden','true');}
function preloadAll(){return startCinematicLoad()}
function setPage(n,dir=0){
  if(turnLock)return;
  turnLock=true;
  const previous=i;
  i=(n+pages.length)%pages.length;
  body.classList.add('page-flipping');
  wrap.classList.remove('turn-left','turn-right');
  wrap.classList.add(dir<0?'turn-left':'turn-right');
  img.style.setProperty('--turn-x',(dir<0?'-22px':'22px'));
  img.style.setProperty('--turn-rot',(dir<0?'-3deg':'3deg'));
  img.classList.add('turning');
  pageSound();
  setTimeout(()=>{
    img.src='images/'+pages[i][0];
    img.alt='Página '+(i+1)+' do dossiê: '+pages[i][1];
    count.textContent=(i+1)+' / '+pages.length;
    progress.style.width=((i+1)/pages.length*100)+'%';
    [...dots.children].forEach((d,k)=>d.classList.toggle('active',k===i));
    [...document.querySelectorAll('.index-item')].forEach((el,k)=>el.classList.toggle('active',k===i));
    renderTrans();renderCaption();renderUV();
    if(uvOn)holdUVUntilMove();
    resetTransform(false);
    updateEndCard();
    sessionPatch({page:i,zoom,bg,uvMode});
    if(previous!==i)addTechLog('página aberta: '+pageLabel(i),'info');
    preload();showUi();refreshMasterDiag();
  },130);
  setTimeout(()=>{img.classList.remove('turning');wrap.classList.remove('turn-left','turn-right');body.classList.remove('page-flipping');turnLock=false},320)
}
function preload(){[i,i+1,i-1].forEach(n=>{let p=pages[(n+pages.length)%pages.length][0];preloadImage('images/'+p);});}
function escapeHTML(value){return String(value??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;', '"':'&quot;'}[ch]));}
function showSystemToast(message){const toast=document.getElementById('systemToast');if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(showSystemToast._timer);showSystemToast._timer=setTimeout(()=>toast.classList.remove('show'),3600);}
function renderTrans(){const [t,b]=trans[i]||[pages[i]?.[1]||'Página','Transcrição indisponível.']; const count=(hiddenNotes[i]&&hiddenNotes[i].length)||0; const extra=count?`<li>Camada pericial associada a esta página: ${count} ocorrência(s).</li>`:`<li>Nenhuma camada pericial vinculada a esta página.</li>`; document.getElementById('transcription').innerHTML=`<div class="trans-title">Página ${String(i+1).padStart(2,'0')} — ${escapeHTML(t)}</div><div class="trans-body"><p>${escapeHTML(b)}</p><ul><li>Documento apresentado em modo diegético de leitura.</li>${extra}<li>A imagem original continua sendo o documento principal.</li></ul></div>`}
function renderCaption(){if(!pageCaption)return;const c=pageCaptions[i]||{k:'Arquivo central',t:pages[i][1],m:'Documento operacional'};pageCaption.classList.remove('show');pageCaption.innerHTML=`<div class="caption-kicker">${escapeHTML(c.k)}</div><div class="caption-title">${String(i+1).padStart(2,'0')} · ${escapeHTML(c.t)}</div><div class="caption-meta">${escapeHTML(c.m)}</div>`;setTimeout(()=>pageCaption.classList.add('show'),40)}
function resetTransform(resetZoom=true){if(resetZoom){zoom=1;document.getElementById('zoomRange').value=1}tx=0;ty=0;applyTransform()}
function fitTransform(){zoom=.75;document.getElementById('zoomRange').value=zoom;tx=0;ty=0;applyTransform()}
function constrainPan(){const stageRect=stage.getBoundingClientRect();const wrapRect=img.getBoundingClientRect();const naturalW=Math.max(1,wrapRect.width/Math.max(.45,zoom));const naturalH=Math.max(1,wrapRect.height/Math.max(.45,zoom));const scaledW=naturalW*zoom,scaledH=naturalH*zoom;const bufferX=Math.min(220,stageRect.width*.18),bufferY=Math.min(180,stageRect.height*.16);const maxX=Math.max(bufferX,(scaledW-stageRect.width)/2+bufferX);const maxY=Math.max(bufferY,(scaledH-stageRect.height)/2+bufferY);tx=Math.max(-maxX,Math.min(maxX,tx));ty=Math.max(-maxY,Math.min(maxY,ty));}
function applyTransform(){zoom=Math.max(.45,Math.min(MAX_ZOOM,zoom));constrainPan();wrap.style.transform=`translate3d(${tx}px,${ty}px,0) scale(${zoom})`;document.getElementById('zoomRange').value=zoom;sessionPatch({zoom});updateUVPerfMode();resizeUVCanvas();if(uvOn&&!uvRAF)uvRAF=requestAnimationFrame(paintUV);}
function showUi(force=false){if(body.classList.contains('auth-locked'))return;if(isMobileUI){body.classList.remove('ui-hidden');clearTimeout(timer);return}if(!force&&!body.classList.contains('menu-open'))return;body.classList.remove('ui-hidden');clearTimeout(timer);if(!body.classList.contains('menu-open'))timer=setTimeout(()=>body.classList.add('ui-hidden'),2200)}
function openDrawer(id){closeMenus();document.getElementById(id).classList.add('open');body.classList.add('menu-open');showUi(true);clickSound()}
function closeMenus(){document.querySelectorAll('.drawer.open,.popover.open').forEach(e=>e.classList.remove('open'));body.classList.remove('menu-open')}
function openPop(id){const el=document.getElementById(id);const open=el.classList.contains('open');closeMenus();if(!open){el.classList.add('open');body.classList.add('menu-open')}showUi(true);clickSound()}
function download(){const a=document.createElement('a');a.href=img.src;a.download=pages[i][0];a.click();clickSound()}
pages.forEach((p,k)=>{const d=document.createElement('div');d.className='dot'+(k?'':' active');dots.appendChild(d);const btn=document.createElement('button');btn.className='index-item'+(k?'':' active');btn.innerHTML=`<span class="num">${String(k+1).padStart(2,'0')}</span><span>${p[1]}</span>`;btn.onclick=()=>{setPage(k,k>i?1:-1);closeMenus()};document.getElementById('indexList').appendChild(btn);});
['prev','sidePrev'].forEach(id=>document.getElementById(id).onclick=()=>setPage(i-1,-1));['next','sideNext'].forEach(id=>document.getElementById(id).onclick=()=>setPage(i+1,1));
document.getElementById('openIndex').onclick=()=>openDrawer('indexDrawer');document.getElementById('openText').onclick=()=>openDrawer('textDrawer');document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>{closeMenus();clickSound()});document.getElementById('zoomBtn').onclick=()=>openPop('zoomPop');document.getElementById('moreBtn').onclick=()=>openPop('morePop');document.getElementById('uvBtn').onclick=()=>{toggleUV();closeMenus()};document.querySelectorAll('[data-uv-mode]').forEach(btn=>btn.onclick=()=>{applyUVMode(btn.dataset.uvMode);clickSound()});
document.getElementById('fullBtn').onclick=()=>{clickSound();document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()};document.getElementById('resetView').onclick=()=>{resetTransform();closeMenus();clickSound()};document.getElementById('centerFromText').onclick=()=>resetTransform(false);document.getElementById('fitView').onclick=()=>{fitTransform();closeMenus();clickSound()};document.getElementById('hideUiNow').onclick=()=>{closeMenus();body.classList.add('ui-hidden')};document.getElementById('downloadPage').onclick=download;document.getElementById('downloadPage2').onclick=download;
document.getElementById('audioBtn').textContent='Áudio: '+(muted?'desligado':'ligado');document.getElementById('audioBtn').onclick=()=>{muted=!muted;safeStoreSet('ordo_audio_muted',muted?'1':'0');document.getElementById('audioBtn').textContent='Áudio: '+(muted?'desligado':'ligado');if(muted){stopSfx('uvHum');pauseAmbient();showSystemToast('Áudio desligado')}else{clickSound();startAmbient();if(uvOn)playSfx('uvHum',{loop:true,restart:false});showSystemToast('Áudio ligado')}};document.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>{zoom=+b.dataset.zoom;applyTransform();clickSound()});document.getElementById('zoomRange').oninput=e=>{zoom=+e.target.value;applyTransform()};document.getElementById('bgBtn').onclick=()=>{bg=(bg+1)%bgs.length;document.documentElement.style.setProperty('--desk',`url('backgrounds/${bgs[bg]}')`);sessionPatch({bg});addTechLog('fundo alterado para '+bgs[bg],'info');clickSound()};

function isMobileView(){return window.matchMedia('(pointer: coarse)').matches||window.innerWidth<=760}
function isUiTarget(target){return !!(target&&target.closest('.topbar,.drawer,.popover,.side-hit,.end-card,.auth-gate,.master-overlay,.master-panel,.close,.more-item,.index-item,.navbtn,.textbtn,.auth-btn,.auth-back,input,button,a,label'))}
const activePointers=new Map();
let dragState=null,pinchState=null,lastPinchAt=0,mobileTap={time:0,x:0,y:0};
let touchDrag=null,touchPinch=null;
function clampZoom(v){return Math.max(.45,Math.min(MAX_ZOOM,v))}
function pointInStage(clientX,clientY){const r=stage.getBoundingClientRect();return{x:clientX-r.left-r.width/2,y:clientY-r.top-r.height/2}}
function getPinch(){const pts=[...activePointers.values()];const a=pts[0],b=pts[1];const cx=(a.x+b.x)/2,cy=(a.y+b.y)/2;return{dist:Math.hypot(b.x-a.x,b.y-a.y)||1,mid:pointInStage(cx,cy),clientX:cx,clientY:cy}}
function initPinchFromPoints(a,b){const cx=(a.clientX+b.clientX)/2,cy=(a.clientY+b.clientY)/2;const mid=pointInStage(cx,cy);touchPinch={dist:Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY)||1,zoom,docX:(mid.x-tx)/zoom,docY:(mid.y-ty)/zoom};wrap.classList.add('dragging');if(uvOn)setUVAt(cx,cy)}
function updateTouchPinch(a,b){if(!touchPinch)return;const cx=(a.clientX+b.clientX)/2,cy=(a.clientY+b.clientY)/2;const mid=pointInStage(cx,cy);const dist=Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY)||1;zoom=clampZoom(touchPinch.zoom*(dist/touchPinch.dist));tx=mid.x-touchPinch.docX*zoom;ty=mid.y-touchPinch.docY*zoom;applyTransform();if(uvOn)setUVAt(cx,cy);showUi()}
function beginTouchDrag(t){if(!t)return;touchDrag={id:t.identifier,sx:t.clientX,sy:t.clientY,stx:tx,sty:ty,lastX:t.clientX,lastY:t.clientY,moved:false,mode:(uvOn?'uv':'drag')};wrap.classList.add('dragging');if(uvOn)setUVAt(t.clientX,t.clientY)}
function resetTouchGesture(){touchDrag=null;touchPinch=null;wrap.classList.remove('dragging')}
function startPinch(){if(activePointers.size<2)return;const p=getPinch();pinchState={dist:p.dist,zoom,docX:(p.mid.x-tx)/zoom,docY:(p.mid.y-ty)/zoom};wrap.classList.add('dragging');if(uvOn)setUVAt(p.clientX,p.clientY)}
function updatePinch(){if(!pinchState||activePointers.size<2)return;const p=getPinch();zoom=clampZoom(pinchState.zoom*(p.dist/pinchState.dist));tx=p.mid.x-pinchState.docX*zoom;ty=p.mid.y-pinchState.docY*zoom;applyTransform();if(uvOn)setUVAt(p.clientX,p.clientY);showUi()}
function rememberPointer(e){activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY})}
function clearPointer(e){activePointers.delete(e.pointerId)}
wrap.addEventListener('pointerdown',e=>{
  if(e.pointerType==='touch')return;
  if(e.pointerType==='mouse'&&e.button!==0&&e.button!==1)return;
  if(e.pointerType==='mouse'&&e.button===1)e.preventDefault();
  if(isUiTarget(e.target))return;
  if(e.pointerType==='pen')e.preventDefault();
  rememberPointer(e);
  try{wrap.setPointerCapture(e.pointerId)}catch(_){}
  if(activePointers.size===1){
    dragState={id:e.pointerId,button:e.button,sx:e.clientX,sy:e.clientY,stx:tx,sty:ty,swipeX:e.clientX,swipeY:e.clientY,wasPinching:false};
  }else if(activePointers.size===2){
    if(dragState)dragState.wasPinching=true;
    startPinch();
  }
  wrap.classList.add('dragging');
  showUi();
},{passive:false});
wrap.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch')return;
  if(!activePointers.has(e.pointerId))return;
  if(e.pointerType==='pen')e.preventDefault();
  rememberPointer(e);
  if(activePointers.size>=2){updatePinch();return;}
  if(uvOn)setUVAt(e.clientX,e.clientY);
  if(!dragState||dragState.id!==e.pointerId)return;
  const dx=e.clientX-dragState.sx,dy=e.clientY-dragState.sy;
  tx=dragState.stx+dx;ty=dragState.sty+dy;applyTransform()
  showUi();
},{passive:false});
function finishPointer(e){
  if(e.pointerType==='touch')return;
  if(!activePointers.has(e.pointerId))return;
  const wasPinching=!!pinchState||activePointers.size>1||(dragState&&dragState.wasPinching);
  clearPointer(e);
  if(activePointers.size<2&&pinchState){pinchState=null;lastPinchAt=Date.now()}
  if(activePointers.size===1){
    const p=[...activePointers.entries()][0];
    dragState={id:p[0],sx:p[1].x,sy:p[1].y,stx:tx,sty:ty,swipeX:p[1].x,swipeY:p[1].y,wasPinching:wasPinching};
    return;
  }
  wrap.classList.remove('dragging');
  if(!dragState)return;
  const dx=e.clientX-dragState.swipeX;
  // Mouse drag agora sempre move o documento; troca de página fica nos botões/setas.
  
  dragState=null;
}
wrap.addEventListener('auxclick',e=>{if(e.button===1){e.preventDefault();e.stopPropagation()}},{passive:false});
stage.addEventListener('auxclick',e=>{if(e.button===1){e.preventDefault();e.stopPropagation()}},{passive:false});
wrap.addEventListener('pointerup',finishPointer);
wrap.addEventListener('pointercancel',finishPointer);
stage.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')setUVAt(e.clientX,e.clientY)});
stage.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')setUVAt(e.clientX,e.clientY)});
window.addEventListener('mousemove',e=>{if(uvOn)setUVAt(e.clientX,e.clientY)},{passive:true});
stage.addEventListener('touchstart',e=>{
  if(!isMobileView()||isUiTarget(e.target))return;
  showUi();
  if(e.touches.length>=2){
    const [a,b]=e.touches;
    initPinchFromPoints(a,b);
    touchDrag&& (touchDrag.moved=true);
    e.preventDefault();
    return;
  }
  beginTouchDrag(e.touches[0]);
  e.preventDefault();
},{passive:false});
stage.addEventListener('touchmove',e=>{
  if(!isMobileView())return;
  if(e.touches.length>=2){
    const [a,b]=e.touches;
    if(!touchPinch)initPinchFromPoints(a,b);
    updateTouchPinch(a,b);
    e.preventDefault();
    return;
  }
  if(!e.touches.length)return;
  const t=e.touches[0];
  if(touchPinch){touchPinch=null;lastPinchAt=Date.now();beginTouchDrag(t)}
  if(!touchDrag)beginTouchDrag(t);
  touchDrag.lastX=t.clientX;touchDrag.lastY=t.clientY;
  const dx=t.clientX-touchDrag.sx,dy=t.clientY-touchDrag.sy;
  if(Math.abs(dx)>8||Math.abs(dy)>8)touchDrag.moved=true;
  if(touchDrag.mode==='uv'){
    setUVAt(t.clientX,t.clientY);
    e.preventDefault();
    return;
  }
  if(zoom>1.02){tx=touchDrag.stx+dx;ty=touchDrag.sty+dy;applyTransform()}
  showUi();
  e.preventDefault();
},{passive:false});
stage.addEventListener('touchend',e=>{
  if(!isMobileView())return;
  if(touchPinch&&e.touches.length<2){touchPinch=null;lastPinchAt=Date.now()}
  if(e.touches.length>=2){
    const [a,b]=e.touches;
    if(!touchPinch)initPinchFromPoints(a,b);
    return;
  }
  if(e.touches.length===1){beginTouchDrag(e.touches[0]);return;}
  const t=e.changedTouches[0]||{clientX:touchDrag?touchDrag.lastX:0,clientY:touchDrag?touchDrag.lastY:0};
  const current=touchDrag;
  resetTouchGesture();
  if(!current)return;
  const dx=t.clientX-current.sx,dy=t.clientY-current.sy;
  const moved=current.moved||Math.abs(dx)>10||Math.abs(dy)>10;
  if(Date.now()-lastPinchAt<420){mobileTap={time:0,x:0,y:0};e.preventDefault();return;}
  if(!moved){
    const now=Date.now();
    const d=Math.hypot(t.clientX-mobileTap.x,t.clientY-mobileTap.y);
    if(now-mobileTap.time<330&&d<48){
      const next=t.clientX>window.innerWidth/2;
      setPage(i+(next?1:-1),next?1:-1);
      mobileTap={time:0,x:0,y:0};
      e.preventDefault();
      return;
    }
    mobileTap={time:now,x:t.clientX,y:t.clientY};
    e.preventDefault();
    return;
  }
  mobileTap={time:0,x:0,y:0};
  if(current.mode==='drag'&&zoom<=1.02&&Math.abs(dx)>64&&Math.abs(dy)<86){
    setPage(i+(dx<0?1:-1),dx<0?1:-1);
    e.preventDefault();
  }
},{passive:false});
stage.addEventListener('touchcancel',()=>{lastPinchAt=Date.now();mobileTap={time:0,x:0,y:0};resetTouchGesture()},{passive:false});
stage.addEventListener('wheel',e=>{e.preventDefault();showUi();const factor=e.deltaY<0?1.12:.90;const next=clampZoom(zoom*factor);if(Math.abs(next-zoom)<0.0001)return;zoom=next;applyTransform()},{passive:false});
wrap.addEventListener('dblclick',()=>{if(isMobileView())return;const now=zoom<1.3?2.4:1;zoom=now;tx=0;ty=0;applyTransform();clickSound()});
if(topRevealZone){topRevealZone.addEventListener('mouseenter',()=>showUi(true));topRevealZone.addEventListener('mousemove',()=>showUi(true));}window.addEventListener('keydown',e=>{if(e.key==='ArrowRight')setPage(i+1,1);if(e.key==='ArrowLeft')setPage(i-1,-1);if(e.key==='Escape')closeMenus();if(e.key.toLowerCase()==='i')openDrawer('indexDrawer');if(e.key==='+'||e.key==='='){zoom*=1.12;applyTransform()}if(e.key==='-'){zoom*=.9;applyTransform()}if(e.key==='0')resetTransform()});document.addEventListener('click',e=>{if(!e.target.closest('.topbar,.drawer,.popover,.side-hit,.end-card')){closeMenus();if(isMobileUI)showUi(true)}});topbar.addEventListener('mouseenter',()=>showUi(true));topbar.addEventListener('focusin',()=>showUi(true));initViewerState();
