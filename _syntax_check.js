

const authGate=document.getElementById('authGate'),authStart=document.getElementById('authStart'),authLog=document.getElementById('authLog'),authFinger=document.getElementById('authFinger'),authFrame=document.getElementById('authFingerFrame'),authProgress=document.getElementById('authProgress'),authMini=document.getElementById('authMini'),accessStamp=document.getElementById('accessStamp'),authState=document.getElementById('authState'),authPercent=document.getElementById('authPercent'),authStep=document.getElementById('authStep'),authConfidence=document.getElementById('authConfidence'),authMatch=document.getElementById('authMatch'); let authBusy=false;
function authTone(freq=280,dur=.06,type='sine',vol=.032){try{window.__authAudio=window.__authAudio||new (window.AudioContext||window.webkitAudioContext)();const o=window.__authAudio.createOscillator(),g=window.__authAudio.createGain();o.type=type;o.frequency.value=freq;g.gain.value=vol;o.connect(g);g.connect(window.__authAudio.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,window.__authAudio.currentTime+dur);o.stop(window.__authAudio.currentTime+dur)}catch(e){}}
function unlockDossier(){document.body.classList.add('access-granted');authGate.classList.add('unlocking');authTone(520,.08,'triangle',.035);setTimeout(()=>authTone(760,.12,'sine',.042),90);setTimeout(()=>authTone(980,.16,'sine',.034),210);setTimeout(()=>{document.body.classList.remove('auth-locked');authGate.classList.add('hide');if(typeof showUi==='function')showUi()},360);setTimeout(()=>authGate.remove(),980);setTimeout(()=>document.body.classList.remove('access-granted'),900)}
function setAuthLines(lines){authLog.innerHTML=lines.map(x=>`<div class="${x.cls||''}">${x.text}</div>`).join('')}
function setAuthTelemetry(percent,step,confidence,match,state){authProgress.querySelector('span').style.width=percent+'%';authPercent.textContent=percent+'%';authStep.textContent=step;authConfidence.textContent=confidence;authMatch.textContent=match;authState.textContent=state}
function runAuth(){if(authBusy)return;authBusy=true;authStart.disabled=true;authStart.textContent='Verificando...';authFrame.classList.remove('ready','ok');authFrame.classList.add('scanning');authFinger.src='../../assets/fingerprint.svg';authProgress.classList.remove('ok');setAuthTelemetry(0,'Preparando leitura','--','--','Leitura em preparação');authMini.textContent='Coletando impressão digital';accessStamp.classList.remove('show');authTone(130,.08,'sawtooth',.03);const steps=[
  {text:'inicializando protocolo seguro',percent:12,step:'Canal seguro aberto',confidence:'12%',match:'--',state:'Inicializando'},
  {text:'coletando impressão digital do operador',percent:29,step:'Digital capturada',confidence:'41%',match:'Traço parcial',state:'Capturando amostra'},
  {text:'comparando padrão biométrico com credencial temporária',percent:47,step:'Comparando com credencial',confidence:'67%',match:'72.4%',state:'Comparando padrões'},
  {text:'validando nível delta para OP-2025-ALB-017',percent:68,step:'Privilégio Delta em análise',confidence:'82%',match:'88.9%',state:'Validando acesso'},
  {text:'removendo lacre operacional',percent:86,step:'Lacre operacional removido',confidence:'96%',match:'98.7%',state:'Liberando arquivo'},
  {text:'ACESSO CONCEDIDO',percent:100,step:'Arquivo liberado',confidence:'99.8%',match:'Confirmado',state:'Acesso concedido',cls:'ok'}
];setAuthLines([]);steps.forEach((item,i)=>setTimeout(()=>{setAuthTelemetry(item.percent,item.step,item.confidence,item.match,item.state);authLog.innerHTML+=`<div class="${item.cls||''}">${item.text}</div>`;authTone(230+i*55,.045,'triangle',.03);if(i===steps.length-1){authFrame.classList.remove('scanning');authFrame.classList.add('ok');authProgress.classList.add('ok');authFinger.src='../../assets/fingerprint-ok.svg';authMini.textContent='Arquivo liberado';authStart.textContent='Acesso concedido';accessStamp.classList.add('show');authGate.classList.add('unlocking');setTimeout(unlockDossier,1200)}},320+i*420))}
authStart.addEventListener('click',runAuth);authFrame.addEventListener('click',runAuth);authFrame.addEventListener('touchend',e=>{e.preventDefault();runAuth()},{passive:false});authFrame.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();runAuth()}});

const pages=[['01-capa.webp','Capa'],['02-dados-missao.webp','Dados da missão'],['03-origem-contexto.webp','Origem e contexto'],['04-area-operacao.webp','Área de operação'],['05-lena-vasic.webp','Agente Lena Vasic'],['06-orest-krum.webp','Agente Orest Krum'],['07-danilo-ferre.webp','Agente Danilo Ferre'],['08-objetivos.webp','Objetivos'],['09-diretrizes.webp','Diretrizes'],['10-observacoes-finais.webp','Observações finais']];
const trans=[['Capa','Relatório de missão OP-2025-ALB-017. Documento restrito, nível Delta.'],['Dados da missão','Resumo inicial da operação, nível de acesso e identificação do arquivo consultado.'],['Origem e contexto','Informações de contexto operacional e origem do caso.'],['Área de operação','Referências geográficas e área de atuação relacionada à Operação Albânia.'],['Agente Lena Vasic','Registro de agente com campo visual reservado para fotografia futura.'],['Agente Orest Krum','Registro de agente com campo visual reservado para fotografia futura.'],['Agente Danilo Ferre','Registro de agente com campo visual reservado para fotografia futura.'],['Objetivos','Lista de objetivos operacionais e prioridades do arquivo.'],['Diretrizes','Condutas, restrições e recomendações para operadores credenciados.'],['Observações finais','Fechamento do dossiê inicial antes do início da operação.']];

const pageCaptions=[
  {k:'Dossiê lacrado',t:'Capa operacional',m:'OP-2025-ALB-017 · nível delta · inspeção recomendada'},
  {k:'Controle de missão',t:'Dados da missão',m:'Credencial temporária · rota de consulta registrada'},
  {k:'Anomalia documental',t:'Origem e contexto',m:'Histórico com divergência sutil · verificar luz UV'},
  {k:'Teatro de operação',t:'Área de operação',m:'Zona marcada · dados geográficos incompletos'},
  {k:'Registro de agente',t:'Lena Vasic',m:'Vínculo sensível · resposta nominal detectada'},
  {k:'Registro de agente',t:'Orest Krum',m:'Falha de rastreio · campo de memória incompleto'},
  {k:'Registro de agente',t:'Danilo Ferre',m:'Contato secundário · observação em tinta fria'},
  {k:'Prioridades',t:'Objetivos',m:'Objetivo principal preservado · objetivos ocultos parciais'},
  {k:'Conduta operacional',t:'Diretrizes',m:'Regras de engajamento · ruído na cadeia de comando'},
  {k:'Fechamento',t:'Observações finais',m:'O relatório termina · a operação começa'}
];
const uvSecrets={"0":[{"x":48,"y":16,"r":-2,"w":"34%","t":"LACRE APLICADO\nAPÓS O INCIDENTE","c":"redacted"},{"x":62,"y":72,"r":-9,"w":"24%","size":"clamp(.92rem,1.55vw,1.4rem)","t":"ALPHA-3\nNÃO RETORNOU","c":"mark"},{"x":40,"y":86,"r":4,"w":"32%","t":"VERIFICAR MEMÓRIA\nDA EQUIPE"},{"x":26,"y":36,"r":8,"w":"20%","t":"ABERTO\nANTES DO LACRE","c":"mark"}],"1":[{"x":54,"y":23,"r":-4,"w":"36%","t":"HORA DE EXTRAÇÃO\nNÃO CONFERE","c":"redacted"},{"x":74,"y":77,"r":6,"w":"24%","t":"ASSINATURA\nSUPRIMIDA"},{"x":31,"y":70,"r":-7,"w":"26%","t":"DELTA FOI\nRECLASSIFICADO","c":"mark"}],"2":[{"x":52,"y":20,"r":-3,"w":"34%","t":"A ORIGEM FOI ALTERADA\nNO REGISTRO","c":"redacted"},{"x":71,"y":58,"r":8,"w":"28%","t":"NÃO CONFIE\nNA PRIMEIRA VERSÃO"},{"x":35,"y":45,"r":-11,"w":"22%","t":"ARQUIVO\nREESCRITO","c":"mark"}],"3":[{"x":44,"y":32,"r":5,"w":"30%","t":"PONTO DE ENTRADA\nNÃO MAPEADO","c":"redacted"},{"x":68,"y":68,"r":-6,"w":"25%","t":"RÁDIO FALHA\nÀS 03:17"},{"x":28,"y":78,"r":8,"w":"22%","t":"NÃO CRUZAR\nA LINHA FRIA","c":"mark"}],"4":[{"x":58,"y":34,"r":-6,"w":"30%","t":"O SINAL RESPONDEU\nAO NOME LENA"},{"x":39,"y":73,"r":5,"w":"34%","t":"MARCA NÃO VISÍVEL\nA OLHO NU","c":"redacted"},{"x":70,"y":82,"r":-9,"w":"24%","t":"ELA OUVIU\nPRIMEIRO","c":"mark"}],"5":[{"x":47,"y":30,"r":4,"w":"32%","t":"OREST VIU A PORTA\nANTES DO RESTO","c":"redacted"},{"x":66,"y":64,"r":-5,"w":"24%","t":"RELÓGIO PAROU\nNO MESMO MINUTO"},{"x":31,"y":84,"r":7,"w":"22%","t":"NÃO FOI\nACIDENTE","c":"mark"}],"6":[{"x":52,"y":36,"r":-8,"w":"32%","t":"DANILO TRANSMITIU\nSEM ABRIR O RÁDIO","c":"redacted"},{"x":70,"y":72,"r":6,"w":"26%","t":"A VOZ NÃO ERA\nDA EQUIPE"},{"x":35,"y":68,"r":-4,"w":"20%","t":"ECO\nHUMANO","c":"mark"}],"7":[{"x":50,"y":23,"r":-2,"w":"36%","t":"OBJETIVO REAL\nREMOVIDO DO DOSSIÊ","c":"redacted"},{"x":72,"y":55,"r":8,"w":"24%","t":"NÃO RECUPERAR\nO ARTEFATO"},{"x":28,"y":78,"r":-7,"w":"24%","t":"APENAS\nOBSERVAR","c":"mark"}],"8":[{"x":53,"y":28,"r":5,"w":"36%","t":"DIRETRIZ ORIGINAL:\nABORTAR SE HOUVER CANTO","c":"redacted"},{"x":69,"y":75,"r":-5,"w":"24%","t":"NÃO RESPONDA\nPELO NOME"},{"x":34,"y":62,"r":7,"w":"24%","t":"O PROTOCOLO\nMENTE","c":"mark"}],"9":[{"x":50,"y":35,"r":0,"w":"42%","t":"A OPERAÇÃO COMEÇA\nQUANDO O RELATÓRIO TERMINA","c":"redacted"},{"x":68,"y":72,"r":-8,"w":"22%","t":"SIGA A LUZ FRIA"},{"x":29,"y":74,"r":7,"w":"22%","t":"SE LER ISTO,\nNÃO VÁ SOZINHO","c":"mark"}]};
const uvCanvas=document.getElementById('uvCanvas'),uvLayer=document.getElementById('uvLayer'),uvFlash=document.getElementById('uvFlash'),uvBtn=document.getElementById('uvBtn'),uvChip=document.getElementById('uvChip');
const MAX_ZOOM=6;
const UV_MODES={discreta:{title:'Discreta',radius:0.95,whole:.76,char:.84,noise:.06,glow:.70,reach:.94,ambient:.88,box:.84,ink:.84,bloom:.78},equilibrada:{title:'Equilibrada',radius:1,whole:1,char:1,noise:.11,glow:1,reach:1,ambient:1,box:1,ink:1,bloom:1},pericial:{title:'Pericial',radius:1.03,whole:.90,char:1.04,noise:.05,glow:.82,reach:1.05,ambient:.94,box:.92,ink:.92,bloom:.86},cinematografica:{title:'Cinemática',radius:1.12,whole:1.06,char:1.08,noise:.13,glow:1.14,reach:1.1,ambient:1.04,box:1.04,ink:1.08,bloom:1.16}};
const UV_QUALITY_PROFILES={low:{label:'eco',dprCap:1.18,resBoost:.74,noiseMul:.0,glowMul:.72,wholeMul:.92,charMul:.94,distress:0,beam:.84,smoothing:'medium',tail:0,reach:.94},medium:{label:'balanceada',dprCap:1.62,resBoost:.88,noiseMul:.48,glowMul:.88,wholeMul:.98,charMul:.98,distress:.55,beam:.94,smoothing:'high',tail:1,reach:.98},high:{label:'alta',dprCap:2.08,resBoost:1,noiseMul:1,glowMul:1,wholeMul:1.03,charMul:1.03,distress:1,beam:1,smoothing:'high',tail:1,reach:1}};
let uvMode='cinematografica';
let uvQuality='high',uvAdaptive=true,uvFrameTimes=[],uvLastPaintTs=0,uvQualityCooldown=0;
let uvOn=false,uvRAF=0,uvLastX=0,uvLastY=0,uvCtx=null,uvDpr=1,uvCW=0,uvCH=0,uvNoise=null,uvNoisePattern=null;
function getUVMode(){return UV_MODES[uvMode]||UV_MODES.equilibrada}
function getUVQuality(){return UV_QUALITY_PROFILES[uvQuality]||UV_QUALITY_PROFILES.high}
function pickInitialUVQuality(){const mem=navigator.deviceMemory||4;const cores=navigator.hardwareConcurrency||4;return (mem<=4||cores<=4)?'medium':'high'}
function setUVQuality(level){if(!UV_QUALITY_PROFILES[level]||uvQuality===level)return;uvQuality=level;resizeUVCanvas(true);updateUVChip()}
function updateUVChip(){uvChip.innerHTML=uvOn?`Luz UV forense ativa · ${getUVMode().title} <small>· perfil ${getUVQuality().label}</small>`:'Luz UV desligada'}
function applyUVMode(mode){if(!UV_MODES[mode])return;uvMode=mode;document.querySelectorAll('[data-uv-mode]').forEach(btn=>btn.classList.toggle('active',btn.dataset.uvMode===mode));updateUVChip();if(uvOn&&!uvRAF)uvRAF=requestAnimationFrame(paintUV)}
function renderUV(){resizeUVCanvas(true)}
function updateUVPerfMode(){document.body.classList.toggle('uv-lite',uvOn&&(zoom>2.8||uvQuality==='low'))}
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
  const p=uvLocalPoint(uvLastX,uvLastY),x=p.x,y=p.y;
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
  (uvSecrets[i]||[]).forEach(note=>drawUVText(note,x,y));
  uvFlash.style.transform=`translate3d(${uvLastX}px,${uvLastY}px,0) translate3d(-50%,-50%,0)`;
}
function setUVAt(clientX,clientY){
  if(!uvOn||!uvCanvas)return;
  if(Math.abs(clientX-uvLastX)<1.25&&Math.abs(clientY-uvLastY)<1.25)return;
  uvLastX=clientX;uvLastY=clientY;
  if(!uvRAF)uvRAF=requestAnimationFrame(paintUV);
}
function toggleUV(force){
  uvOn=typeof force==='boolean'?force:!uvOn;
  if(uvOn){uvFrameTimes=[];uvLastPaintTs=0;}
  document.body.classList.toggle('uv-on',uvOn);
  uvBtn.textContent='Luz UV: '+(uvOn?'ligada':'desligada');
  updateUVChip();
  renderUV();updateUVPerfMode();
  if(uvOn){
    const r=wrap.getBoundingClientRect();uvLastX=r.left+r.width*.52;uvLastY=r.top+r.height*.48;
    if(!uvRAF)uvRAF=requestAnimationFrame(paintUV);
    tone(720,.06,'sine',.025);
  }else{
    if(uvCtx)uvCtx.clearRect(0,0,uvCW,uvCH);
    document.body.classList.remove('uv-lite');
    tone(240,.05,'triangle',.018);
  }
  showUi();
}
let i=0,zoom=1,tx=0,ty=0,timer=null,bg=0,muted=false,turnLock=false,lastTap=0; const bgs=['mesa.webp','madeira.webp','couro.webp'];
const body=document.body,img=document.getElementById('pageImg'),wrap=document.getElementById('pageWrap'),stage=document.getElementById('stage'),count=document.getElementById('count'),progress=document.getElementById('progress'),dots=document.getElementById('dots'),topbar=document.getElementById('topbar'),turnOverlay=document.getElementById('turnOverlay'),pageCaption=document.getElementById('pageCaption'),cinemaFlash=document.getElementById('cinemaFlash');img.decoding='async';img.fetchPriority='high';img.addEventListener('load',()=>{resizeUVCanvas(true);if(uvOn&&!uvRAF)uvRAF=requestAnimationFrame(paintUV)});window.addEventListener('resize',()=>{resizeUVCanvas(true);if(uvOn&&!uvRAF)uvRAF=requestAnimationFrame(paintUV)},{passive:true});
let audioCtx; function tone(freq=420,dur=.05,type='sine',vol=.035){if(muted)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)(); const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.type=type;o.frequency.value=freq;g.gain.value=vol;o.connect(g);g.connect(audioCtx.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);o.stop(audioCtx.currentTime+dur);}catch(e){}}
function clickSound(){tone(360,.045,'triangle',.025)} function pageSound(){tone(150,.035,'sawtooth',.018);setTimeout(()=>tone(230,.055,'triangle',.018),45)}
function preloadAll(){const warm=()=>pages.forEach((p,idx)=>setTimeout(()=>{const im=new Image();im.decoding='async';im.src='images/'+p[0]},idx*40)); if('requestIdleCallback' in window)requestIdleCallback(warm,{timeout:1200}); else setTimeout(warm,420)}
function setPage(n,dir=0){if(turnLock)return;turnLock=true;i=(n+pages.length)%pages.length; body.classList.add('page-flipping'); wrap.classList.remove('turn-left','turn-right'); wrap.classList.add(dir<0?'turn-left':'turn-right'); img.style.setProperty('--turn-x',(dir<0?'-22px':'22px')); img.style.setProperty('--turn-rot',(dir<0?'-3deg':'3deg')); img.classList.add('turning'); pageSound(); setTimeout(()=>{img.src='images/'+pages[i][0]; img.alt='Página '+(i+1)+' do dossiê: '+pages[i][1]; count.textContent=(i+1)+' / '+pages.length; progress.style.width=((i+1)/pages.length*100)+'%'; [...dots.children].forEach((d,k)=>d.classList.toggle('active',k===i)); [...document.querySelectorAll('.index-item')].forEach((el,k)=>el.classList.toggle('active',k===i)); renderTrans(); renderCaption(); renderUV(); document.getElementById('endCard').classList.toggle('show',i===pages.length-1); resetTransform(false); preload(); showUi();},130); setTimeout(()=>{img.classList.remove('turning');wrap.classList.remove('turn-left','turn-right');body.classList.remove('page-flipping');turnLock=false},320)}
function preload(){[i+1,i-1].forEach(n=>{let p=pages[(n+pages.length)%pages.length][0];let im=new Image();im.decoding='async';im.src='images/'+p;});}
function renderTrans(){const [t,b]=trans[i]; const extra=(uvSecrets[i]&&uvSecrets[i].length)?`<li>Registro UV associado a esta página: ${uvSecrets[i].length} ocorrência(s).</li>`:`<li>Nenhum registro UV vinculado a esta página.</li>`; document.getElementById('transcription').innerHTML=`<div class="trans-title">Página ${String(i+1).padStart(2,'0')} — ${t}</div><div class="trans-body"><p>${b}</p><ul><li>Documento apresentado em modo diegético de leitura.</li>${extra}<li>A imagem original continua sendo o documento principal.</li></ul></div>`}
function renderCaption(){if(!pageCaption)return;const c=pageCaptions[i]||{k:'Arquivo central',t:pages[i][1],m:'Documento operacional'};pageCaption.classList.remove('show');pageCaption.innerHTML=`<div class="caption-kicker">${c.k}</div><div class="caption-title">${String(i+1).padStart(2,'0')} · ${c.t}</div><div class="caption-meta">${c.m}</div>`;setTimeout(()=>pageCaption.classList.add('show'),40)}
function resetTransform(resetZoom=true){if(resetZoom){zoom=1;document.getElementById('zoomRange').value=1}tx=0;ty=0;applyTransform()}
function fitTransform(){zoom=.75;document.getElementById('zoomRange').value=zoom;tx=0;ty=0;applyTransform()}
function constrainPan(){const stageRect=stage.getBoundingClientRect();const wrapRect=img.getBoundingClientRect();const naturalW=Math.max(1,wrapRect.width/Math.max(.45,zoom));const naturalH=Math.max(1,wrapRect.height/Math.max(.45,zoom));const scaledW=naturalW*zoom,scaledH=naturalH*zoom;const bufferX=Math.min(220,stageRect.width*.18),bufferY=Math.min(180,stageRect.height*.16);const maxX=Math.max(bufferX,(scaledW-stageRect.width)/2+bufferX);const maxY=Math.max(bufferY,(scaledH-stageRect.height)/2+bufferY);tx=Math.max(-maxX,Math.min(maxX,tx));ty=Math.max(-maxY,Math.min(maxY,ty));}
function applyTransform(){zoom=Math.max(.45,Math.min(MAX_ZOOM,zoom));constrainPan();wrap.style.transform=`translate3d(${tx}px,${ty}px,0) scale(${zoom})`;document.getElementById('zoomRange').value=zoom;updateUVPerfMode();resizeUVCanvas();if(uvOn&&!uvRAF)uvRAF=requestAnimationFrame(paintUV);}
function showUi(){body.classList.remove('ui-hidden');clearTimeout(timer);if(!body.classList.contains('menu-open'))timer=setTimeout(()=>body.classList.add('ui-hidden'),3300)}
function openDrawer(id){closeMenus();document.getElementById(id).classList.add('open');body.classList.add('menu-open');showUi();clickSound()}
function closeMenus(){document.querySelectorAll('.drawer.open,.popover.open').forEach(e=>e.classList.remove('open'));body.classList.remove('menu-open')}
function openPop(id){const el=document.getElementById(id);const open=el.classList.contains('open');closeMenus();if(!open){el.classList.add('open');body.classList.add('menu-open')}showUi();clickSound()}
function download(){const a=document.createElement('a');a.href=img.src;a.download=pages[i][0];a.click();clickSound()}
pages.forEach((p,k)=>{const d=document.createElement('div');d.className='dot'+(k?'':' active');dots.appendChild(d);const btn=document.createElement('button');btn.className='index-item'+(k?'':' active');btn.innerHTML=`<span class="num">${String(k+1).padStart(2,'0')}</span><span>${p[1]}</span>`;btn.onclick=()=>{setPage(k,k>i?1:-1);closeMenus()};document.getElementById('indexList').appendChild(btn);});
['prev','sidePrev'].forEach(id=>document.getElementById(id).onclick=()=>setPage(i-1,-1));['next','sideNext'].forEach(id=>document.getElementById(id).onclick=()=>setPage(i+1,1));
document.getElementById('openIndex').onclick=()=>openDrawer('indexDrawer');document.getElementById('openText').onclick=()=>openDrawer('textDrawer');document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>{closeMenus();clickSound()});document.getElementById('zoomBtn').onclick=()=>openPop('zoomPop');document.getElementById('moreBtn').onclick=()=>openPop('morePop');document.getElementById('uvBtn').onclick=()=>{toggleUV();closeMenus()};document.querySelectorAll('[data-uv-mode]').forEach(btn=>btn.onclick=()=>{applyUVMode(btn.dataset.uvMode);clickSound()});
document.getElementById('fullBtn').onclick=()=>{clickSound();document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()};document.getElementById('resetView').onclick=()=>{resetTransform();closeMenus();clickSound()};document.getElementById('centerFromText').onclick=()=>resetTransform(false);document.getElementById('fitView').onclick=()=>{fitTransform();closeMenus();clickSound()};document.getElementById('hideUiNow').onclick=()=>{closeMenus();body.classList.add('ui-hidden')};document.getElementById('downloadPage').onclick=download;document.getElementById('downloadPage2').onclick=download;
document.getElementById('audioBtn').onclick=()=>{muted=!muted;document.getElementById('audioBtn').textContent='Áudio: '+(muted?'desligado':'ligado');if(!muted)tone(520,.08,'triangle',.035)};document.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>{zoom=+b.dataset.zoom;applyTransform();clickSound()});document.getElementById('zoomRange').oninput=e=>{zoom=+e.target.value;applyTransform()};document.getElementById('bgBtn').onclick=()=>{bg=(bg+1)%bgs.length;document.documentElement.style.setProperty('--desk',`url('backgrounds/${bgs[bg]}')`);clickSound()};

function isMobileView(){return window.matchMedia('(pointer: coarse)').matches||window.innerWidth<=760}
function isUiTarget(target){return !!(target&&target.closest('.topbar,.drawer,.popover,.side-hit,.end-card,.auth-gate,.close,.more-item,.index-item,.navbtn,.textbtn,.auth-btn,.auth-back,input,button,a,label'))}
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
  if(false&&dragState.button!==1&&!wasPinching&&zoom<=.95&&Math.abs(dx)>70)setPage(i+(dx<0?1:-1),dx<0?1:-1);
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
window.addEventListener('mousemove',showUi);window.addEventListener('keydown',e=>{if(e.key==='ArrowRight')setPage(i+1,1);if(e.key==='ArrowLeft')setPage(i-1,-1);if(e.key==='Escape')closeMenus();if(e.key.toLowerCase()==='i')openDrawer('indexDrawer');if(e.key==='+'||e.key==='='){zoom*=1.12;applyTransform()}if(e.key==='-'){zoom*=.9;applyTransform()}if(e.key==='0')resetTransform()});document.addEventListener('click',e=>{if(!e.target.closest('.topbar,.drawer,.popover,.side-hit,.end-card')){closeMenus();showUi()}});topbar.addEventListener('mouseenter',showUi);setUVQuality(pickInitialUVQuality());applyUVMode('cinematografica');setPage(0,0);preloadAll();
