import { createIcons, Waves, FolderOpen, Save, FileCode2, Box, Cylinder, Circle, Orbit, Scan, Radio, MoveRight, Activity, Copy, Trash2, Maximize, PencilRuler, Play, Square, Settings2, Undo2, Redo2, GitCommitHorizontal, CircleDot, Shapes, ChartNoAxesCombined, Terminal, Download, RefreshCw } from 'lucide';
const icons={Waves,FolderOpen,Save,FileCode2,Box,Cylinder,Circle,Orbit,Scan,Radio,MoveRight,Activity,Copy,Trash2,Maximize,PencilRuler,Play,Square,Settings2,Undo2,Redo2,GitCommitHorizontal,CircleDot,Shapes,ChartNoAxesCombined,Terminal,Download,RefreshCw};
import { Views, drawField, drawPlot } from './views.js';
import './style.css';
import { setupFspInspector } from './fsp.js';
import { setupNativeFsp } from './fsp_native.js';
import { setupGds, setupGdsExport } from './gds.js';
import { setupSourceTools, temporalControls, updateTemporalField, polarizationControls, planeControls, configureOneWayPlane } from './sources.js';
import { setupMaterials } from './materials.js';
import { meshControls, setupMesh } from './mesh.js';
import { setupCapabilities } from './capabilities.js';
import { setupInverseDesign } from './inverse_design.js';
import { runControls } from './run_control.js';
import { geometryDefaults,geometryControls,rotationControls,setupGeometryEditor } from './geometry.js';
import { setupMonitorTools, spectralControls, fieldMonitorControls } from './monitor_tools.js';
import { setupBoundaryTools } from './boundary_tools.js';
import { openModeNetwork } from './mode_network_tools.js';
import { openPropagation } from './propagation_tools.js';

// Preserve existing browser projects and design setups across the product rename.
try {
 for(const oldKey of Object.keys(localStorage)){
  if(!oldKey.startsWith('photonweave.'))continue;
  const newKey='torchfdtd.'+oldKey.slice('photonweave.'.length);
  if(localStorage.getItem(newKey)===null)localStorage.setItem(newKey,localStorage.getItem(oldKey));
 }
} catch { /* The ordinary save action reports unavailable browser storage. */ }

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=n=>`<i data-lucide="${n}"></i>`;
const state={project:null,selected:'fdtd',multi:[],clipboard:null,mode:'layout',snap:true,history:[],future:[],job:null,results:null,frame:0,tab:'geometry',bottom:'messages',dirty:false,planHash:null,maxRevision:0};
let views,health,pollTimer,playTimer,stats;
const messages=[];

$('#app').innerHTML=`
<header><div class="brand"><span class="brand-mark">${icon('waves')}</span><strong>TorchFDTD</strong><span class="product">Workbench</span></div><div class="project-title" id="project-title"></div><div class="connection" id="connection"><span class="dot"></span>Connecting to solver…</div></header>
<nav class="menubar"><button data-action="new">File</button><button data-action="undo">Edit</button><button data-action="fit">View</button><button data-action="materials">Materials</button><button data-action="region">Simulation</button><button data-action="inverse-design">Inverse design</button><button data-action="mode-ports">Mode ports</button><button data-action="capabilities">Supported combinations</button><button data-action="flux-results">Flux results</button><button data-action="help">Help</button><span class="version">DEVELOPMENT</span></nav>
<div class="ribbon-tabs"><button class="active" data-ribbon="design">Design</button><button data-ribbon="simulation">FDTD</button><button data-ribbon="view">View</button><span class="ribbon-note">Geometry and wavelength in µm</span></div>
<div class="ribbon">
 <div class="tool-group"><div class="tool-row"><button class="tool" data-action="open">${icon('folder-open')}<span>Open</span></button><button class="tool" data-action="save">${icon('save')}<span>Save</span></button><button class="tool" data-action="fsp">${icon('folder-open')}<span>FSP inspect</span></button><button class="tool editable" data-action="fsp-native">${icon('folder-open')}<span>FSP → GPU</span></button><button class="tool editable" data-action="gds">${icon('folder-open')}<span>GDS</span></button><button class="tool" data-action="python">${icon('file-code-2')}<span>Python</span></button><button class="tool" data-action="export-gds">${icon('download')}<span>Export GDS</span></button></div><label>Project</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool editable" data-add="rectangle">${icon('box')}<span>Rectangle</span></button><button class="tool editable" data-add="circle">${icon('cylinder')}<span>Circle</span></button><button class="tool editable" data-add="ring">${icon('circle')}<span>Ring</span></button><button class="tool editable" data-add="sphere">${icon('orbit')}<span>Sphere</span></button><button class="tool editable" data-add="polygon">${icon('shapes')}<span>Polygon</span></button></div><label>Structures</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool" data-action="region">${icon('scan')}<span>FDTD region</span></button><button class="tool editable" data-add="point">${icon('radio')}<span>Dipole</span></button><button class="tool editable" data-add="plane">${icon('move-right')}<span>Sheet source</span></button><button class="tool editable" data-add="tfsf">${icon('scan')}<span>TFSF box</span></button><button class="tool editable" data-add="monitor">${icon('activity')}<span>Time monitor</span></button><button class="tool editable" data-add="field">${icon('activity')}<span>DFT / Flux</span></button></div><label>Simulation objects</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool editable" data-action="duplicate">${icon('copy')}<span>Duplicate</span></button><button class="tool editable" data-action="copy">${icon('copy')}<span>Copy</span></button><button class="tool editable" data-action="paste">${icon('copy')}<span>Paste</span></button><button class="tool editable" data-action="delete">${icon('trash-2')}<span>Delete</span></button><button class="tool" data-action="fit">${icon('maximize')}<span>Fit view</span></button></div><label>Edit & view</label></div>
 <div class="tool-group run-tools"><div class="tool-row"><button class="tool" id="layout-button" data-action="layout">${icon('pencil-ruler')}<span>Layout</span></button><button class="tool run" id="run-button" data-action="run">${icon('play')}<span>Run</span></button><button class="tool stop" id="stop-button" data-action="stop" disabled>${icon('square')}<span>Stop</span></button></div><label>Run simulation</label></div>
</div>
<main>
 <aside class="left-panel"><div class="panel-heading">Objects Tree <span id="object-count"></span></div><div class="tree-tools"><button data-action="region" title="Edit selected object">${icon('settings-2')}</button><button data-action="undo" title="Undo (Ctrl+Z)">${icon('undo-2')}</button><button data-action="redo" title="Redo (Ctrl+Y)">${icon('redo-2')}</button><label><input type="checkbox" id="snap" checked> Snap</label></div><div id="tree"></div><div class="panel-heading results-heading">Results View</div><div id="stale-banner" class="stale-banner" role="status" hidden></div><div id="results-tree" class="results-tree"><div class="muted empty-hint">Select Run to calculate fields<br>and monitor signals.</div></div><div class="left-footer"><span class="eyebrow">EXAMPLE PROJECTS</span><button data-example="waveguide">${icon('git-commit-horizontal')}SiN waveguide<span>2D</span></button><button data-example="scatterer">${icon('circle-dot')}Cylinder scattering<span>2D</span></button><button data-example="3d">${icon('orbit')}Dielectric sphere<span>3D</span></button><button data-example="pmc">${icon('box')}PMC cavity<span>3D</span></button></div></aside>
 <section class="workspace"><div class="workspace-tabs"><button class="active" data-tab="geometry">${icon('shapes')} Layout editor</button><button data-tab="fields">${icon('chart-no-axes-combined')} Field visualizer</button><span class="mode-badge" id="mode-badge">LAYOUT</span></div><div id="viewports" class="viewports"></div><div id="field-view" hidden><div class="field-tools"><strong id="field-label">Ez · XY plane</strong><span id="frame-label">No data</span><button data-action="playback" title="Animate stored frames">${icon('play')}</button><input type="range" id="frame-slider" min="0" max="0" value="0"><button data-action="download">${icon('download')} NPZ</button></div><canvas id="field-canvas"></canvas><div class="plot-title"><strong>Point monitor</strong><select id="plot-monitor" aria-label="Plot monitor"></select><select id="plot-axis" aria-label="Spectrum axis" hidden><option value="frequency">Frequency</option><option value="wavelength">Wavelength</option></select><button data-plot="time" class="active">Time signal</button><button data-plot="spectrum">Field spectrum</button><button data-action="csv">${icon('download')} CSV</button></div><canvas id="monitor-canvas"></canvas></div>
 <section class="bottom-panel"><div class="bottom-tabs"><button class="active" data-bottom="messages">${icon('terminal')} Simulation log <span id="log-count"></span></button><button data-bottom="python">${icon('file-code-2')} Python script</button><div class="bottom-actions"><button data-action="export-python">Export .py</button></div></div><div id="messages" role="log"></div><textarea id="python-editor" spellcheck="false" readonly hidden aria-label="Generated Python script"></textarea></section></section>
 <aside class="right-panel"><div class="panel-heading">Object properties <span id="property-type"></span></div><div id="properties"></div><div class="mesh-card"><div><span class="eyebrow">SIMULATION SUMMARY</span><button data-action="validate" title="Validate mesh and geometry">${icon('refresh-cw')}</button></div><div id="mesh-summary">Validating project…</div></div></aside>
</main>
<footer><span id="status-text"><span class="dot"></span>Ready</span><span id="footer-grid"></span><div class="progress-track"><div id="progress-bar"></div></div><span id="progress-label"></span><span id="footer-device">Solver connecting</span></footer>
<input id="file-input" type="file" accept=".json,.fsp" hidden><dialog id="dialog"><div id="dialog-content"></div></dialog><div id="toast" role="alert" hidden></div>`;

function refreshIcons(){createIcons({icons,attrs:{'stroke-width':1.65}});}
function log(text,kind='info'){messages.push({text,kind,time:new Date().toLocaleTimeString('en-GB')});$('#messages').innerHTML=messages.slice(-100).map(m=>`<div class="log ${m.kind}"><time>${m.time}</time><span>${esc(m.text)}</span></div>`).join('');$('#messages').scrollTop=$('#messages').scrollHeight;$('#log-count').textContent=messages.length;}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;setTimeout(()=>$('#toast').hidden=true,5000);}
async function api(path,body){const r=await fetch('/api'+path,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok){let data;try{data=await r.json();}catch{throw Error(`Server returned ${r.status}`);}throw Error(Array.isArray(data.detail)?data.detail.map(e=>e.loc.join('.')+': '+e.msg).join('\n'):data.detail||`Server returned ${r.status}`);}return r.headers.get('content-type')?.includes('json')?r.json():r.text();}
function selected(){return [...state.project.structures,...state.project.sources,...state.project.monitors].find(o=>o.id===state.selected);}
function category(id){return state.project.structures.some(o=>o.id===id)?'structures':state.project.sources.some(o=>o.id===id)?'sources':'monitors';}
function remember(){state.history.push(JSON.stringify(state.project));if(state.history.length>80)state.history.shift();state.future=[];}
function persist(){
 // Every committed edit advances the edit counter past any revision seen in this session (undo restores older snapshots); the content hash is unknown until /api/validate returns it.
 state.dirty=true;state.maxRevision=Math.max(state.maxRevision,state.project.revision||0)+1;state.project.revision=state.maxRevision;state.project.content_sha256=null;
 if(!store()){toast('Browser storage is full. Use Save to keep this project before closing or reloading.');log('Automatic browser save failed. Export this project with Save to retain the current settings.','warning');}
}
function change(id,patch,commit=true){Object.assign([...state.project.structures,...state.project.sources,...state.project.monitors].find(o=>o.id===id)||{},patch);if(commit){persist();renderProperties();renderTree();validate();}}
function selection(){return state.multi.length?state.multi:state.selected==='fdtd'?[]:[state.selected];}
function select(id,extend=false){
 if(extend&&id!=='fdtd'){const ids=new Set(selection());ids.has(id)?ids.delete(id):ids.add(id);state.multi=[...ids];state.selected=state.multi.at(-1)||'fdtd';}
 else{state.multi=id==='fdtd'?[]:[id];state.selected=id;}
 renderTree();renderProperties();views?.render();
}
function selectMany(ids){state.multi=ids.length>1?[...ids]:[];state.selected=ids.at(-1)||'fdtd';renderTree();renderProperties();views?.render();}
function markStale(){
 const stale=!!state.results&&(state.planHash===null||state.results.plan_hash!==state.planHash);
 $('#stale-banner').hidden=!stale;$('#stale-banner').textContent=stale?`Stale results: the project changed since run revision ${state.results.revision??'?'} (plan hash differs). Run again for current results.`:'';
 $('#results-tree').classList.toggle('stale',stale);$('#field-view').classList.toggle('stale',stale);
 if(state.tab==='fields')renderResults();
}
function store(){try{localStorage.setItem('torchfdtd.project.v1',JSON.stringify(state.project));return true;}catch{return false;}}
function setMode(mode){state.mode=mode;$('#mode-badge').textContent=mode.toUpperCase();$('#mode-badge').className='mode-badge '+mode;$$('.editable').forEach(b=>b.disabled=mode!=='layout');$('#run-button').disabled=mode!=='layout';$('#stop-button').disabled=mode!=='running';$('#layout-button').disabled=mode==='running';$$('[data-example]').forEach(b=>b.disabled=mode==='running');renderProperties();views?.render();}
function renderTree(){
 const p=state.project;$('#project-title').innerHTML=esc(p.name)+(p.revision?` <small class="revision">rev ${p.revision}</small>`:'');$('#object-count').textContent=p.structures.length+p.sources.length+p.monitors.length+1;
 const chosen=new Set(selection()),row=(o,symbol,cls='')=>`<button class="tree-row ${chosen.has(o.id)?'selected':''} ${cls}" data-select="${esc(o.id)}"><span class="tree-icon">${icon(symbol)}</span><span>${esc(o.name)}</span>${o.enabled===false?'<small>off</small>':''}</button>`;
 const item=(o,symbol,cls='')=>`<div class="tree-item">${row(o,symbol,cls)}<button class="row-delete editable" data-action="delete-object" data-id="${esc(o.id)}" aria-label="Delete ${esc(o.name)}" title="Delete ${esc(o.name)}" ${state.mode!=='layout'?'disabled':''}>${icon('trash-2')}</button></div>`;
 $('#tree').innerHTML=`<div class="tree-root">${icon('folder-open')} model</div>${row({id:'fdtd',name:'FDTD'},'scan','region-row')}<div class="tree-group">Structures <span>${p.structures.length}</span></div>${p.structures.map(o=>item(o,{rectangle:'box',circle:'cylinder',ring:'circle',sphere:'orbit',polygon:'shapes'}[o.kind])).join('')}<div class="tree-group">Sources <span>${p.sources.length}</span></div>${p.sources.map(o=>item(o,'radio','source-row')).join('')}<div class="tree-group">Monitors <span>${p.monitors.length}</span></div>${p.monitors.map(o=>item(o,'activity','monitor-row')).join('')}`;refreshIcons();
}
function numeric(label,path,value,unit='',options={}){return `<label class="property-row"><span>${label}</span><div><input aria-label="${label}" data-path="${path}" data-scale="${options.scale||1}" ${options.reciprocal?`data-reciprocal="${options.reciprocal}"`:''} type="number" value="${Number(value.toPrecision?.(12)??value)}" step="${options.step||'any'}" ${options.min!==undefined?`min="${options.min}"`:''}><small>${unit}</small></div></label>`;}
function dropdown(label,path,value,options){return `<label class="property-row"><span>${label}</span><select aria-label="${label}" data-path="${path}">${options.map(o=>{const [v,n]=Array.isArray(o)?o:[o,o];return `<option value="${esc(v)}" ${v===value?'selected':''}>${esc(n)}</option>`;}).join('')}</select></label>`;}
function section(name,body){return `<section class="property-section"><h3>${name}</h3>${body}</section>`;}
const modeLabels={resident:'Resident',streamed_host:'Streamed through host memory',streamed_disk:'Streamed through disk',tiled:'Tiled (approximate)'};
const gib=v=>v==null?'?':v>=2**30?(v/2**30).toFixed(2)+' GiB':(v/2**20).toFixed(1)+' MiB';
function executionStatus(e){
 if(!e)return 'Resolving execution mode…';
 const prefix=e.requested==='auto'?'Auto → ':'';
 const rungs=e.auto?.rungs?.length?`<span class="auto-rungs">${e.auto.rungs.map(g=>`${g.chosen?'✔':'✘'} ${esc(g.tier==='streamed_host'?'DRAM banks':g.tier==='tiled'?'approximate tiles':g.tier)}: ${esc(g.reason)}`).join('<br>')}</span>`:'';
 if(!e.mode)return `<span class="warning error">${esc(prefix+(e.error||'no execution mode fits'))}</span>${rungs}`;
 const warnings=(e.warnings||[]).map(w=>`<span class="warning">${esc(w)}</span>`).join('');
 return `<b>${esc(prefix+modeLabels[e.mode])}</b> on ${e.backend==='cuda'?'GPU':'CPU'}${rungs?` · chosen tier ${esc(modeLabels[e.mode])}`:` · ${esc(e.reason||'')}`}${e.mode==='streamed_disk'?` · scratch ${esc(e.scratch_directory)}`:''}${rungs}${warnings}`;
}
// The server's admission from /api/health: 'fixed' applies its size limits (server_limits), 'memory' admits by the estimate.
const cellLimit=()=>health?.admission==='fixed'?health.server_limits.resident_cells:null;
function admissionRow(){
 if(!health?.admission)return '';
 const memory=health.admission==='memory';
 return `<div class="static-row" id="admission" title="${memory?'Started with torchfdtd serve --memory-admission: scenes are admitted by the memory estimate, as on the Python API':'The server applies fixed size limits to every request; torchfdtd serve --memory-admission admits by the memory estimate instead'}">admission <b>${memory?'memory estimate':`fixed server limits (${cellLimit().toLocaleString('en-US')} resident cells)`}</b></div>`;
}
function tiledControls(r){
 if(r.execution_mode!=='tiled')return '';
 const t=r.tiling,plan=stats?.execution?.tiled?.plan,s=plan?.suggestion;
 return `<div class="tiled-panel">`+numeric('tile size','tiling.size_um',t.size_um,'\u00b5m',{min:.001})+numeric('tile overlap','tiling.overlap_um',t.overlap_um,'\u00b5m',{min:.001})+numeric('max diffraction angle','tiling.max_angle_deg',t.max_angle_deg,'\u00b0',{min:0,max:89})+`<div class="static-row">suggested overlap <b id="tiled-suggestion">${s?`${s.overlap_um.toPrecision(3)} \u00b5m = ${s.spread_um.toPrecision(3)} spread + ${s.absorber_um.toPrecision(3)} absorber`:'validate to compute'}</b></div><label class="enabled-row"><input type="checkbox" aria-label="Propagate to a focal plane" data-tiled-propagate ${t.propagation_um!=null?'checked':''}> Propagate to a focal plane</label>`+(t.propagation_um!=null?numeric('propagation distance','tiling.propagation_um',t.propagation_um,'\u00b5m',{min:0}):'')+`<p class="property-help">Approximate overlapping tiles for planar devices that fit no memory tier: one soft sheet source spanning the device (tick \u201cextend through PML\u201d on the sheet), CPML on every face and exactly one frequency plane, the output plane. Each tile misses the scatterers beyond its overlap, so read the mismatch indicator of the finished run and compare overlaps; the suggested overlap is distance \u00d7 tan(angle) plus the absorber. The optional focal plane is an angular-spectrum propagation of the stitched plane. Point, one-way and TFSF sources, Bloch phases and graded meshes are rejected; the tiled adjoint is Python only. See docs/TILED_STITCHING.md.</p></div>`;
}
const C0=299792458;
function periodSteps(project,dtFs){
 // Optical period of the shortest enabled source wavelength in time steps.
 const wavelengths=(project?.sources||[]).filter(s=>s.enabled!==false).map(s=>{const t=s.use_global_source&&project.global_source?project.global_source:s;return ['wavelength','frequency'].includes(t.time_definition)?t.wavelength_start:t.wavelength;}).filter(v=>v>0);
 return wavelengths.length&&dtFs?Math.min(...wavelengths)*1e-6/C0/(dtFs*1e-15):null;
}
function snapshotStatus(s){
 if(!s||s.frames_per_period==null)return '';
 const note=s.effective_interval>s.interval?` (one frame every ${s.effective_interval} steps: at most 100 frames are stored)`:'';
 return `<div class="static-row">frames per optical period <b id="snapshot-rate">${s.frames_per_period.toFixed(1)}</b></div>`+(s.aliased?`<p class="warning" id="snapshot-warning">Stored frames alias the carrier: ${s.frames_per_period.toFixed(1)} frames per optical period${note}; the playback will look like backward motion. Store a frame at least every ${Math.max(1,Math.floor(s.period_steps/4))} steps.</p>`:`<p class="property-help">${s.frames_per_period.toFixed(1)} stored frames per optical period of the shortest source wavelength (${s.period_steps.toFixed(1)} steps)${note}; four or more keep the playback direction faithful.</p>`);
}
function executionSummary(e){
 if(!e?.mode)return '';
 const p=e.policy,m=e.reservation;
 let text=esc(modeLabels[e.mode]||e.mode);
 if(e.mode==='resident')text+=` · estimate ${gib(e.resident?.estimated_bytes)}`;
 if(p)text+=` · slab ${p.slab_width} × depth ${p.temporal_depth} · ${p.state_storage==='disk'?'file banks':'DRAM banks'} · ${p.tile_device==='cuda'?'GPU tiles':'CPU tiles'}`;
 if(m)text+=`<br>host ${gib(m.host_reservation_bytes)}${p?.tile_device==='cuda'?` · GPU ${gib(m.gpu_reservation_bytes)}`:''}${m.disk_reservation_bytes?` · disk ${gib(m.disk_reservation_bytes)}`:''}`;
 if(e.mode==='streamed_disk')text+=`<br>scratch ${esc(e.scratch_directory)}`;
 if(e.report?.forward_seconds!=null)text+=`<br>${e.report.forward_seconds.toFixed(2)} s streamed forward`;
 if(e.mode==='tiled'&&e.tiled?.plan){const t=e.tiled.plan,i=e.indicator,fmt=v=>v==null?'n/a':v.toFixed(3);text+=` · ${t.tiles} tiles (${t.counts.join(' × ')}) of ${t.tile_um.toPrecision(3)} µm · overlap ${t.overlap_um.toPrecision(3)} µm${t.propagation?` · focal plane +${t.propagation.distance_um} µm`:''}`;
  if(i)text+=`<br><b class="indicator">max mismatch ${fmt(i.max_mismatch_center)}</b> (centre) · ${fmt(i.max_mismatch)} (full band)`;
  if(e.report?.pairs?.length)text+=`<table class="mismatch-table"><thead><tr><th>pair</th><th>axis</th><th>mismatch</th><th>centre</th></tr></thead><tbody>${e.report.pairs.map(q=>`<tr><td>${esc(q.tiles[0].replace('tile-',''))} | ${esc(q.tiles[1].replace('tile-',''))}</td><td>${esc(q.axis)}</td><td>${fmt(q.mismatch)}</td><td>${fmt(q.mismatch_center)}</td></tr>`).join('')}</tbody></table><p class="mismatch-note">Neighbour disagreement inside the shared overlap: the error indicator of an approximate method, not the error against the whole device.</p>`;}
 return '<br>'+text;
}
function renderProperties(){
 if(!state.project)return;const p=state.project,o=selected(),r=p.region;$('#property-type').textContent=state.multi.length>1?'selection':o?o.kind||'monitor':'solver';
 let html='';
 if(state.multi.length>1){
 const items=state.multi.map(id=>[...p.structures,...p.sources,...p.monitors].find(x=>x.id===id)).filter(Boolean);
 html=`<div class="object-title">${icon('copy')}<div><strong>${items.length} objects selected</strong><small>Ctrl+click adds to or removes from the selection</small></div></div>`+section('Selection',`<ul class="multi-list">${items.map(x=>`<li>${esc(x.name)} <small>${esc(x.kind||'monitor')}</small></li>`).join('')}</ul><div class="dialog-buttons"><button data-action="duplicate">Duplicate all</button><button data-action="copy">Copy</button><button data-action="delete">Delete all</button></div><p class="property-help">Duplicate, Copy (Ctrl+C), Paste (Ctrl+V) and Delete act on every selected object. Select one object to edit its properties.</p>`);
 $('#properties').innerHTML=`<fieldset ${state.mode!=='layout'?'disabled':''}>${html}</fieldset>`;refreshIcons();return;
 }
 if(!o){
 html=`<div class="object-title">${icon('scan')}<div><strong>FDTD</strong><small>Simulation region</small></div></div>`;
 r.tiling??={size_um:20,overlap_um:2,max_angle_deg:45,propagation_um:null,allow_approximate:false};
 const gpuOn=r.backend==='cuda'||(r.backend==='auto'&&!!health?.cuda),gpuNote=!health?.cuda?'No CUDA device reported by the solver':health.cupy?'CUDA with fused Yee / CPML and plane DFT kernels':'CUDA with PyTorch kernels. Install the cuda-kernels extra for fused kernels.';
 html+=section('General',`<label class="enabled-row switch-row" title="${esc(gpuNote)}"><input type="checkbox" aria-label="GPU" data-gpu-switch ${gpuOn?'checked':''} ${health?.cuda?'':'disabled'}> GPU <small>${esc(health?.cuda?(health.cupy?'fused CUDA kernels':'PyTorch CUDA kernels'):'no CUDA device')}</small></label>`+dropdown('dimension','dimension',r.dimension,[['2d','2D (XY)'],['3d','3D']])+dropdown('memory','execution_mode',r.execution_mode||'auto',[['auto','Auto (recommended)'],['resident','Resident (GPU or CPU memory)'],['streamed_host','Streamed through host memory (DRAM)'],['streamed_disk','Streamed through disk (slow, opt-in)'],['tiled','Tiled (approximate, large devices)']])+`<label class="enabled-row consent-row" title="Lets Auto fall back to the approximate overlapping tiles for a planar device when neither resident nor DRAM-streamed execution fits"><input type="checkbox" aria-label="Allow approximate tiling" data-path="tiling.allow_approximate" ${r.tiling?.allow_approximate?'checked':''}> Allow approximate tiling in Auto</label><div class="execution-status" id="execution-status">${executionStatus(stats?.execution)}</div>${admissionRow()}<p class="property-help">Auto runs resident when the estimate fits 75% of free GPU memory (80% of host memory on CPU)${cellLimit()?` and at most ${cellLimit()/1e6} million cells`:''}; otherwise it streams x slabs through DRAM field banks; otherwise, only with the consent above and for a planar device, it runs the approximate tiles; otherwise it refuses. Streamed through disk is never chosen automatically: it is an explicit opt-in that ran 1.9 to 2.4 times slower than DRAM banks in the records. Streamed jobs are forward only: point monitors, frequency planes and one field snapshot at the final step, no live frames, no decay shutoff, no dispersive, TFSF, subpixel or PMC scenes. Expect streaming to run several times slower than resident. See docs/EXECUTION_MODES.md.</p>`+tiledControls(r)+`<div class="advanced-execution ${state.advancedExecution?'open':''}"><button type="button" class="advanced-toggle" data-advanced-toggle aria-expanded="${!!state.advancedExecution}">Advanced execution</button><div class="advanced-body" ${state.advancedExecution?'':'inert'}>`+dropdown('resource','backend',r.backend,[['auto','GPU if available'],['cuda','GPU · CUDA'],['cpu','CPU']])+dropdown('precision','precision',r.precision,['float32','float64'])+dropdown('CUDA kernel','cuda_kernel',r.cuda_kernel||'auto',[['auto','Automatic (fused with CuPy)'],['torch','PyTorch reference'],['fused','Fused Yee / CPML (experimental)']])+dropdown('Frequency monitor kernel','cuda_monitor_kernel',r.cuda_monitor_kernel||'auto',[['auto','Automatic (fused with CuPy)'],['torch','PyTorch reference'],['fused','Shared CUDA plane DFT (experimental)']])+`<p class="property-help">The GPU switch sets these together: on selects CUDA with fused kernels when CuPy is installed, off selects CPU. Streamed GPU tiles always use the fused kernels.</p></div></div>`);
 html+=section('Geometry',r.size.map((v,i)=>numeric('xyz'[i]+' span','size.'+i,v,'µm',{min:.01})).join(''));
 html+=section('Mesh settings',meshControls(r,numeric,dropdown,esc));
 html+=section('Boundary conditions',numeric('PML layers','pml_cells',r.pml_cells,'cells',{step:1,min:3})+['x','y',...(r.dimension==='3d'?['z']:[])].map((axis,i)=>{
 const faces=['min','max'].map(side=>{const key=axis+'_'+side,b=r.boundaries[key];return dropdown(axis+' '+side+' bc','boundaries.'+key+'.kind',b.kind,[['pml','PML'],['periodic','Periodic'],['bloch','Bloch'],['pec','PEC'],['antisymmetric','Anti-symmetric (PEC)'],['pmc','PMC'],['symmetric','Symmetric (PMC)']])+(b.kind==='pml'?`<details class="boundary-options"><summary>${axis} ${side} PML settings</summary>${numeric(axis+' '+side+' layers','boundaries.'+key+'.layers',b.layers??r.pml_cells,'cells',{step:1,min:3})}<label class="enabled-row"><input type="checkbox" data-boundary-default="${key}" ${b.layers===null?'checked':''}> Use default layers</label>${numeric('sigma scale','boundaries.'+key+'.sigma_scale',b.sigma_scale)}${numeric('kappa','boundaries.'+key+'.kappa',b.kappa)}${numeric('alpha','boundaries.'+key+'.alpha',b.alpha)}${numeric('polynomial','boundaries.'+key+'.polynomial',b.polynomial)}${numeric('alpha polynomial','boundaries.'+key+'.alpha_polynomial',b.alpha_polynomial)}</details>`:'');}).join('');
 return faces+(r.boundaries[axis+'_min'].kind==='bloch'?numeric('Bloch phase '+axis,'bloch_phase.'+i,r.bloch_phase[i],'rad'):'');
 }).join('')+numeric('background index','background_index',r.background_index,'',{min:1})+`<button data-action="boundary-editor">Edit six faces together</button><p class="property-help">Cyclic boundaries are paired. Bloch phase is the phase gained over one positive unit-cell translation. PMC and magnetic symmetry support PEC/PMC walls or restricted endpoint CPML with point sources/monitors. Use the six-face editor for the supported CPML profile.</p>`);
 html+=section('Simulation time',numeric('dt stability factor','courant_factor',r.courant_factor??.99,'',{min:.01})+numeric('time steps','steps',r.steps,'',{step:1,min:10})+numeric('snapshot every','snapshot_interval',r.snapshot_interval,'steps',{step:1,min:1})+`<div id="snapshot-status">${snapshotStatus(stats?.snapshot)}</div>`);
 html+=section('Termination and diagnostics',runControls(r,numeric));
 html+=section('Field output',dropdown('component','field',r.field,['Ex','Ey','Ez','Hx','Hy','Hz'])+dropdown('plane normal','slice_axis',r.slice_axis,r.dimension==='2d'?['z']:['x','y','z'])+numeric('plane position','slice_position',r.slice_position,'µm')+dropdown('field display','complex_display',r.complex_display,[['real','Real'],['imag','Imaginary'],['magnitude','Magnitude'],['phase','Phase (rad)']]));
 }else{
 const cat=category(o.id),isStructure=cat==='structures',isSource=cat==='sources';
 html=`<div class="object-title">${icon(isStructure?'box':isSource?'radio':'activity')}<div><strong>${esc(o.name)}</strong><small>${isStructure?o.kind:isSource?o.kind+' source':o.kind==='field'?'Frequency / flux monitor':'Point time monitor'}</small></div></div><label class="property-row name-row"><span>name</span><input aria-label="name" data-path="name" value="${esc(o.name)}"></label><label class="enabled-row"><input type="checkbox" data-path="enabled" ${o.enabled?'checked':''}> Enabled in simulation</label><div class="object-actions"><button data-action="duplicate-object" data-id="${esc(o.id)}" aria-label="Duplicate ${esc(o.name)}">${icon('copy')} Duplicate</button><button class="danger" data-action="delete-object" data-id="${esc(o.id)}" aria-label="Delete ${esc(o.name)}">${icon('trash-2')} Delete</button></div>`;
 const spanAxes=o.kind==='field'?[0,1,2].filter(i=>i!=='xyz'.indexOf(o.normal)&&(r.dimension==='3d'||i<2)):o.kind==='tfsf'?[0,1,2].filter(i=>r.dimension==='3d'||i<2):o.kind==='rectangle'||o.kind==='plane'?[0,1,2]:['circle','ring','polygon'].includes(o.kind)?[2]:[];
 html+=section('Geometry',o.center.map((v,i)=>numeric('xyz'[i],'center.'+i,v,'µm')).join('')+spanAxes.map(i=>numeric('xyz'[i]+' span','size.'+i,o.size[i],'µm',{min:isStructure?.001:0})).join('')+(['circle','sphere','ring'].includes(o.kind)?numeric('radius','radius',o.radius,'µm',{min:.001}):'')+(o.kind==='ring'?numeric('inner radius','inner_radius',o.inner_radius,'µm',{min:0}):'')+(isStructure?geometryControls(o,numeric):''));
 if(isStructure){html+=section('Material',dropdown('material','material',o.material,p.materials.map(m=>m.name))+`<div class="static-row">refractive index <b>${(p.materials.find(m=>m.name===o.material)?.model||'dielectric')==='dielectric'?p.materials.find(m=>m.name===o.material)?.index:'dispersive'}</b></div>`+numeric('mesh order','mesh_order',o.mesh_order,'',{step:1,min:1})+`<p class="property-help">Lower order takes priority in overlaps. Open Materials to edit dielectric, Drude or Lorentz parameters and inspect n/k.</p>`);html+=section('Rotation',rotationControls(o,numeric,dropdown));}
 if(isStructure){const index=p.structures.findIndex(s=>s.id===o.id);html+=section('Structure order',`<button data-action="structure-earlier" ${index===0?'disabled':''}>Move earlier in tree</button><button data-action="structure-later" ${index===p.structures.length-1?'disabled':''}>Move later in tree</button><p class="property-help">When mesh orders are equal, the later structure takes priority in overlaps.</p>`);}
 if(isSource){
 o.time_definition??='cycles';o.pulse_length??=20e-15;o.pulse_offset??=50e-15;o.phase??=0;
 const s=o.use_global_source?p.global_source:o;
 html+=section('Source settings',planeControls(o,r,numeric,dropdown)+polarizationControls(o,numeric,dropdown)+`<label class="enabled-row"><input type="checkbox" data-path="use_global_source" ${o.use_global_source?'checked':''} ${!p.global_source?'disabled':''}> Use global source settings</label><button data-action="global-source">Edit global source settings</button>${!p.global_source?'<p class="property-help">Imported global settings are unavailable. Configure them before enabling inheritance.</p>':''}`+(s?`<fieldset ${o.use_global_source?'disabled':''}>`+temporalControls(s,numeric,dropdown)+`<button data-action="source-signal">Load / edit time signal</button></fieldset>`:'')+numeric('phase','phase',o.phase,'deg')+numeric('amplitude','amplitude',o.amplitude,'',{min:.001})+`<button data-action="source-preview">Preview time signal / spectrum</button><p class="property-help">${o.kind==='tfsf'?'Closed box with six-face E/H corrections and a live incident Yee line. Source preview shows the incident field at the entry face.':o.injection==='oneway'?'Normal-incidence discrete E/H plane with an eight-cell incident-line delay. Amplitude scales the incident-line soft drive. Source preview includes both corrections.':o.kind==='plane'?'Bidirectional E/H sheet. Bloch axes apply the unit-cell phase across the sheet.':'Reduced electric or magnetic point excitation. Magnetic sources use the H half-step time. Vector orientation may excite both 2D polarizations.'}</p>`);
 }
 if(!isStructure&&!isSource){
 o.spectrum??={sampling:'fft',wavelength_start:1.3,wavelength_stop:1.8,frequency_points:101,apodization:'hann',apodization_center:20e-15,apodization_time_width:10e-15};const s=o.use_global_monitor?p.global_monitor:o.spectrum,inheritApo=o.use_global_monitor&&o.inherit_apodization!==false,a=inheritApo?s:o.spectrum;
 html+=section('Monitor settings',(o.kind==='field'?fieldMonitorControls(o,r,numeric,dropdown):dropdown('component','component',o.component,['Ex','Ey','Ez','Hx','Hy','Hz'])+`<p class="property-help">Records one Yee field component at every time step. DFT downsampling affects spectral processing only.</p>`)+numeric('DFT time downsample','time_downsample',o.time_downsample||1,'',{min:1,step:1})+`<label class="enabled-row"><input type="checkbox" data-path="use_global_monitor" ${o.use_global_monitor?'checked':''}> Use global monitor settings</label>${o.use_global_monitor?`<label class="enabled-row"><input type="checkbox" data-path="inherit_apodization" ${inheritApo?'checked':''}> Inherit global apodization</label>`:''}<button data-action="global-monitor">Edit global monitor settings</button>`);
 html+=section('Frequency / wavelength',`<fieldset ${o.use_global_monitor?'disabled':''}>`+spectralControls(s,numeric,dropdown,{plane:o.kind==='field'})+`</fieldset><p class="property-help">DFT values are unnormalized field integrals. Power ratios require a matching air reference.</p>`);
 html+=section('Apodization',`<fieldset ${inheritApo?'disabled':''}>`+dropdown('apodization','spectrum.apodization',a.apodization,[['none','None'],['start','Start'],['end','End'],['full','Full'],...(o.kind==='field'?[]:[['hann','Hann (legacy FFT)']])])+(['start','end','full'].includes(a.apodization)?numeric('apodization center','spectrum.apodization_center',a.apodization_center*1e15,'fs',{min:0,scale:1e-15})+numeric('apodization time width','spectrum.apodization_time_width',a.apodization_time_width*1e15,'fs',{min:.001,scale:1e-15})+`<p class="property-help">Width is the intensity FWHM of the Gaussian window. Apodized spectra are not normalized transmission or absolute intensity.</p>`:'')+'</fieldset>');
 }
 }
 $('#properties').innerHTML=`<fieldset ${state.mode!=='layout'?'disabled':''}>${html}</fieldset>`;refreshIcons();bindBoundaryDefaults();
 $('#properties').querySelectorAll('[data-path]').forEach(input=>input.addEventListener('change',()=>{
  if(state.mode!=='layout')return;if(input.type==='number'&&!acceptNumber(input))return;remember();const obj=selected()||p.region,parts=input.dataset.path.split('.');if(parts[0]==='downsample_xyz'&&!obj.downsample_xyz)obj.downsample_xyz=[obj.downsample||1,obj.downsample||1,obj.downsample||1];let target=obj;for(const part of parts.slice(0,-1))target=target[part];
  const value=input.type==='checkbox'?input.checked:input.type==='number'?(input.dataset.reciprocal?Number(input.dataset.reciprocal)/Number(input.value):Number(input.value)*Number(input.dataset.scale||1)):input.value;
  if(parts.length===1&&p.sources.includes(obj))updateTemporalField(obj,parts[0],value);else target[parts.at(-1)]=value;
  if(obj===r&&parts[0]==='mesh_type'&&value==='graded'){r.material_sampling='yee';r.mesh_max=Math.max(r.mesh_max,r.mesh);}
  if(obj===r&&parts[0]==='interface_method'&&value==='subpixel')r.material_sampling='yee';
  if(obj===r&&parts[0]==='mesh_type'&&value!=='explicit')r.mesh_coordinates=null;
  if(p.sources.includes(obj)&&['injection','normal'].includes(parts[0]))configureOneWayPlane(obj,r,{boundaries:true});
  if(obj.kind==='field'&&parts[0]==='normal'){const old=obj.size.indexOf(0),axis='xyz'.indexOf(value);if(old!==axis){obj.size[old]=Math.min(1,r.size[old]/2);obj.size[axis]=0;}}
  if(parts.join('.')==='spectrum.sampling'&&value==='custom'&&!obj.spectrum.custom_frequencies_hz?.length)obj.spectrum.custom_frequencies_hz=[200e12];
  if(parts.join('.')==='spectrum.sampling'&&input.value!=='fft'&&obj.spectrum.apodization==='hann')obj.spectrum.apodization='none';
  if(parts.join('.')==='spectrum.sampling'&&value==='fft')obj.spectrum.use_source_limits=false;
  if(obj===r&&parts[0]==='boundaries'&&parts[2]==='kind'){const [axis,side]=parts[1].split('_');const kind=input.value,other=axis+'_'+(side==='min'?'max':'min');if(['periodic','bloch'].includes(kind)||['periodic','bloch'].includes(r.boundaries[other].kind))r.boundaries[other].kind=kind;if(kind!=='bloch')r.bloch_phase['xyz'.indexOf(axis)]=0;}
  if(obj===r&&parts[0]==='dimension'&&r.dimension==='2d'){r.slice_axis='z';r.slice_position=0;r.bloch_phase[2]=0;r.boundaries.z_min.kind='pml';r.boundaries.z_max.kind='pml';p.sources.forEach(s=>s.center[2]=0);p.monitors.forEach(s=>{s.center[2]=0;if(s.kind==='field'&&s.normal==='z'){s.normal='x';s.size[0]=0;s.size[2]=1;}});}
  if(obj===r&&parts[0]==='dimension'&&r.mesh_type==='explicit'){r.mesh_type='uniform';r.mesh_coordinates=null;}
  if(obj===r&&['size','mesh','dimension'].includes(parts[0]))p.sources.forEach(s=>configureOneWayPlane(s,r));
  persist();renderTree();views.render();renderProperties();validate();
 }));
 $('#properties').querySelectorAll('[data-record-family]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();const key=input.dataset.recordFamily,defaults=key==='record_fields'?['Ex','Ey','Ez','Hx','Hy','Hz']:['x','y','z'],chosen=new Set(o[key]??defaults);if(input.checked)chosen.add(input.value);else chosen.delete(input.value);o[key]=defaults.filter(c=>chosen.has(c));persist();renderProperties();validate();});
 $('#properties').querySelectorAll('[data-source-vector]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();o.theta=input.checked?(o.component[1]==='z'?0:90):null;o.phi=o.component[1]==='y'?90:0;persist();renderProperties();views.render();validate();});
 $('#properties').querySelectorAll('[data-source-family]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();o.component=input.value+o.component[1];persist();renderProperties();views.render();validate();});
 $('#properties').querySelectorAll('[data-frequency-table]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();o.spectrum.custom_frequencies_hz=input.value.trim().split(/[\s,;]+/).filter(Boolean).map(v=>Number(v)*1e12);persist();validate();});
 $('#properties').querySelectorAll('[data-run-field-limit]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();r.run_control.field_limit=input.checked?1e6:null;persist();renderProperties();validate();});
 $('#properties').querySelectorAll('[data-gpu-switch]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();const fused=input.checked&&!!health?.cupy;r.backend=input.checked?'cuda':'cpu';r.cuda_kernel=fused?'fused':'torch';r.cuda_monitor_kernel=fused?'fused':'torch';persist();renderProperties();validate();});
 $('#properties').querySelectorAll('[data-tiled-propagate]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();r.tiling.propagation_um=input.checked?10:null;persist();renderProperties();validate();});
 $('#properties').querySelectorAll('[data-advanced-toggle]').forEach(button=>button.onclick=()=>{state.advancedExecution=!state.advancedExecution;const box=button.closest('.advanced-execution');box.classList.toggle('open',state.advancedExecution);button.setAttribute('aria-expanded',String(state.advancedExecution));box.querySelector('.advanced-body').toggleAttribute('inert',!state.advancedExecution);});
 $('#properties').querySelectorAll('[data-axis-steps]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();r.mesh_steps=input.checked?[r.mesh,r.mesh,r.mesh]:null;if(input.checked)r.material_sampling='yee';persist();renderProperties();views.render();validate();});
 $('#properties').querySelectorAll('[data-fixed-dt]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();r.time_step_override=input.checked?(stats?.dt_fs??.01)*.5e-15:null;persist();renderProperties();validate();});
}
function acceptNumber(input){
 // A non-finite, empty or out-of-range value is refused before it reaches the project; the row shows why and the model keeps its value.
 const value=input.dataset.reciprocal?Number(input.dataset.reciprocal)/Number(input.value):Number(input.value)*Number(input.dataset.scale||1);
 const label=input.getAttribute('aria-label'),unit=input.parentElement.querySelector('small:not(.field-error)')?.textContent||'';
 const min=input.min===''?null:Number(input.min),max=input.max===''?null:Number(input.max);
 let reason=null;
 if(input.validity.badInput||input.value.trim()===''||!Number.isFinite(Number(input.value))||!Number.isFinite(value))reason=`${label} must be a finite number${unit?' in '+unit:''}.`;
 else if(min!==null&&Number(input.value)<min)reason=`${label} must be at least ${min}${unit?' '+unit:''}.`;
 else if(max!==null&&Number(input.value)>max)reason=`${label} must be at most ${max}${unit?' '+unit:''}.`;
 const row=input.closest('.property-row');row?.querySelector('.field-error')?.remove();input.removeAttribute('aria-invalid');
 if(!reason)return true;
 input.setAttribute('aria-invalid','true');const note=document.createElement('small');note.className='field-error';note.textContent=reason;row?.append(note);
 toast(reason+' The previous value is kept.');log('Rejected input: '+reason,'warning');return false;
}
function bindBoundaryDefaults(){
 $$('[data-boundary-default]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();const r=state.project.region;r.boundaries[input.dataset.boundaryDefault].layers=input.checked?null:r.pml_cells;persist();renderProperties();views.render();validate();});
}
async function validate(){try{const sent=state.project,revision=sent.revision;stats=await api('/validate',sent);if(state.project===sent&&state.project.revision===revision){state.project.content_sha256=stats.content_sha256;store();}state.planHash=stats.plan_hash;markStale();$('#mesh-summary').innerHTML=`<strong>${stats.shape.join(' × ')}</strong><span>${stats.cells.toLocaleString()} cells · ~${Number(stats.estimated_memory_mb).toFixed(1)} MB</span>${stats.mesh_type==='graded'?`<span>${stats.cell_reduction_percent.toFixed(1)}% fewer cells than uniform</span>`:''}<span>Δt ${stats.dt_fs.toFixed(4)} fs · ${stats.duration_fs.toFixed(1)} fs total</span>${stats.warnings.map(w=>`<p class="warning">${esc(w)}</p>`).join('')}`;$('#footer-grid').textContent=stats.shape.join(' × ')+' cells';const status=$('#execution-status');if(status)status.innerHTML=executionStatus(stats.execution);const snapshot=$('#snapshot-status');if(snapshot)snapshot.innerHTML=snapshotStatus(stats.snapshot);const suggestion=$('#tiled-suggestion'),s=stats.execution?.tiled?.plan?.suggestion;if(suggestion&&s)suggestion.textContent=`${s.overlap_um.toPrecision(3)} \u00b5m = ${s.spread_um.toPrecision(3)} spread + ${s.absorber_um.toPrecision(3)} absorber`;return true;}catch(e){state.planHash=null;markStale();$('#mesh-summary').innerHTML=`<p class="warning error">${esc(e.message)}</p>`;return false;}}
function add(kind){if(state.mode!=='layout'||!state.project||!views)return;remember();const id=crypto.randomUUID(),base={id,name:kind+'_'+(state.project.structures.length+state.project.sources.length+state.project.monitors.length+1),center:[0,0,0],enabled:true};
 if(['rectangle','circle','ring','sphere','polygon'].includes(kind))state.project.structures.push(geometryDefaults({...base,kind,size:[1,1,.5],radius:.5,inner_radius:.3,rotation:0,material:state.project.materials.find(m=>m.name.startsWith('SiN'))?.name||state.project.materials[0].name,mesh_order:2}));
 else if(kind==='field')state.project.monitors.push({...base,kind:'field',component:'Ez',normal:'x',size:[0,Math.min(1,state.project.region.size[1]/3),state.project.import_provenance&&state.project.region.dimension==='2d'?1:Math.min(1,state.project.region.size[2]/3)],downsample:1,use_global_monitor:false,spectrum:{sampling:'frequency',wavelength_start:1.3,wavelength_stop:1.8,frequency_points:41,apodization:'none',apodization_center:20e-15,apodization_time_width:10e-15}});
 else if(kind==='monitor')state.project.monitors.push({...base,component:'Ez',...(state.project.import_provenance?{spectrum:{sampling:'fft',apodization:'none'}}:{})});
 else if(kind==='tfsf'){
  const r=state.project.region,active=r.dimension==='2d'?2:3;
  const size=r.size.map((v,a)=>a>=active?0:Math.max(3*r.mesh,Math.min(2,v-2*(Math.max(r.boundaries['xyz'[a]+'_min'].layers??r.pml_cells,r.boundaries['xyz'[a]+'_max'].layers??r.pml_cells)+3)*r.mesh)));
  state.project.sources.push({...base,kind,injection:'oneway',normal:'x',direction:'+',size,component:'Ez',wavelength:1.55,amplitude:1,pulse:'gaussian',pulse_cycles:3,incident_pml_cells:96});
 }
 else state.project.sources.push({...base,kind,size:[0,1,0],component:'Ez',wavelength:1.55,amplitude:1,pulse:'gaussian',pulse_cycles:3});
 const source=state.project.sources.find(s=>s.id===id);
 if(source&&state.project.import_provenance)Object.assign(source,{time_definition:'standard',pulse_length:20e-15,pulse_offset:50e-15});
 persist();select(id);validate();log('Added '+base.name+'. Drag in a viewport or edit its properties.');
}
function download(text,name,type='application/json'){const u=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
function setTab(tab){state.tab=tab;$$('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));$('#viewports').hidden=tab!=='geometry';$('#field-view').hidden=tab!=='fields';if(tab==='geometry')views.render();else renderResults();}
function setBottom(tab){state.bottom=tab;$$('[data-bottom]').forEach(b=>b.classList.toggle('active',b.dataset.bottom===tab));$('#messages').hidden=tab!=='messages';$('#python-editor').hidden=tab!=='python';if(tab==='python')api('/python',state.project).then(code=>$('#python-editor').value=code).catch(e=>toast(e.message));}
function renderResults(){const r=state.project.region,axis='xyz'.indexOf(r.slice_axis);let dims=(state.results?.summary?.actual_size_um||r.size).filter((_,i)=>i!==axis);const result=state.results,frame=result?.frames[state.frame]||state.liveFrame,tiled=result?.summary?.execution?.frames?.[state.frame];
 const stale=$('#field-view').classList.contains('stale');$('#field-label').textContent=(stale?'STALE · ':'')+(tiled?`${tiled.label} · ${tiled.axes.join('').toUpperCase()} plane`:r.field+' · '+r.complex_display+' · '+['YZ','XZ','XY'][axis]+' plane');let alias='';if(result&&result.frame_steps?.length>1&&result.summary?.dt_fs){const interval=result.frame_steps[1]-result.frame_steps[0],period=result.summary.snapshot?.period_steps??periodSteps(state.project,result.summary.dt_fs);if(period&&period/interval<4)alias=` · aliased: ${(period/interval).toFixed(1)} frames per optical period, motion may look reversed`;}
 $('#frame-label').textContent=(tiled?tiled.plane+' plane':result?(result.frames.length?'Step '+result.frame_steps[state.frame]:'No field snapshot'):'Live field')+alias;if(tiled)dims=tiled.span_um;$('#frame-slider').max=Math.max(0,(result?.frames.length||1)-1);$('#frame-slider').value=state.frame;
 const monitors=state.monitors||[];if(!monitors.some(m=>m.id===state.plotMonitor))state.plotMonitor=monitors[0]?.id;
 $('#plot-monitor').innerHTML=monitors.map(m=>`<option value="${esc(m.id)}" ${m.id===state.plotMonitor?'selected':''}>${esc(m.name)} · ${m.component}</option>`).join('');
 $('#plot-axis').hidden=!state.spectrum;
 drawField($('#field-canvas'),frame,dims,tiled?tiled.label:r.field+' '+r.complex_display,r.complex_display==='phase'?Math.PI:result?.max,tiled?'|E|², reduced':r.complex_display==='phase'?'rad':'reduced field');drawPlot($('#monitor-canvas'),monitors.filter(m=>m.id===state.plotMonitor),state.spectrum,$('#plot-axis').value==='wavelength');
}
async function run(){
 if(state.mode!=='layout')return;if(!await validate()){toast('Fix the highlighted project settings before running.');return;}
 if(stats.execution?.error){toast(stats.execution.error);log(stats.execution.error,'error');return;}
 try{state.results=null;state.monitors=null;state.liveFrame=null;const job=await api('/jobs',state.project);state.job=job.id;localStorage.setItem('torchfdtd.activeJob',job.id);setMode('running');setTab('fields');log('Submitted '+state.project.name+' · '+state.project.region.backend+' · '+state.project.region.precision+(stats.execution?.mode?' · '+modeLabels[stats.execution.mode]:''));stats.warnings.forEach(w=>log(w,'warning'));(stats.execution?.warnings||[]).forEach(w=>log(w,'warning'));poll();}catch(e){log(e.message,'error');toast(e.message);}
}
async function poll(){
 try{const job=await api('/jobs/'+state.job),progress=job.progress;const pct=Math.round(100*progress.step/progress.total);$('#progress-bar').style.width=pct+'%';$('#progress-label').textContent=pct+'%';$('#status-text').textContent=job.status==='queued'?'Queued on solver':job.status==='running'?(progress.blocks?`Streaming block ${progress.block} / ${progress.blocks} · tile ${progress.tile} / ${progress.tiles}`:progress.tiles?`Tile ${progress.tile} / ${progress.tiles} · step ${progress.step%(progress.total/progress.tiles)||progress.total/progress.tiles}`:'Calculating fields…'):job.status;state.liveFrame=progress.frame;
 if(state.tab==='fields')renderResults();
 if(['completed','cancelled','failed'].includes(job.status)){
  if(job.status==='failed'){localStorage.removeItem('torchfdtd.activeJob');setMode('analysis');log(job.error,'error');toast(job.error);return;}
  $('#status-text').textContent='Calculation complete · loading field results…';
  const result=await api('/jobs/'+state.job+'/fields');let max=1e-20;result.frames.forEach(f=>f.forEach(row=>row.forEach(v=>max=Math.max(max,Math.abs(v)))));result.max=max;result.plan_hash=job.plan_hash;result.revision=job.revision;state.results=result;state.frame=Math.max(0,result.frames.length-1);state.monitors=job.monitors;
  localStorage.removeItem('torchfdtd.activeJob');setMode('analysis');$('#status-text').textContent=job.status;
  $('#results-tree').innerHTML=`<button data-tab="fields">${icon('chart-no-axes-combined')} ${job.execution?.mode==='tiled'?'Stitched plane |E|²':esc(state.project.region.field)+' field snapshots'}</button>${job.monitors.map(m=>`<button data-tab="fields">${icon('activity')} ${esc(m.name)} · ${m.component}</button>`).join('')}${job.flux_monitors?.length?`<button data-action="propagation">${icon('chart-no-axes-combined')} Angular spectrum</button>`:''}<div class="run-summary"><b>${job.summary.seconds.toFixed(2)} s</b> solver loop<br>${job.summary.backend.toUpperCase()}${job.summary.cuda_graph?' · CUDA graph':''}${job.summary.cuda_kernel==='fused'?' · fused Yee / CPML':''}${job.summary.cuda_monitor_kernel==='fused'?' · shared plane DFT':''}<br>${job.summary.mcells_per_second.toFixed(1)} Mcells/s<br>${job.summary.gpu?esc(job.summary.gpu):'CPU'}<br>${job.summary.auto_shutoff?'Decay threshold reached':job.summary.cancelled?'Cancelled':'Step limit reached'}<br>${job.summary.steps} / ${job.summary.requested_steps??job.summary.steps} steps${executionSummary(job.execution)}</div>`;
  refreshIcons();markStale();renderResults();log(`${job.status}: ${job.summary.steps} steps in ${job.summary.seconds.toFixed(3)} s, ${job.summary.mcells_per_second.toFixed(1)} Mcells/s. Setup ${job.summary.setup_seconds.toFixed(2)} s.`+(job.execution?.mode?` Execution: ${modeLabels[job.execution.mode]}${job.execution.policy?` (slab ${job.execution.policy.slab_width} × depth ${job.execution.policy.temporal_depth}, ${job.execution.policy.state_storage} banks)`:''}.`:''));job.summary.warnings.forEach(w=>log(w,'warning'));return;
 }
 pollTimer=setTimeout(poll,400);
 }catch(e){log('Connection lost: '+e.message+'. Retrying the same job…','warning');pollTimer=setTimeout(poll,2000);}
}
function showDialog(html){$('#dialog-content').innerHTML=html+'<div class="dialog-actions"><button data-close>Close</button></div>';$('#dialog').showModal();refreshIcons();}
function materials(){materialTools.open();}
const fspInspector=setupFspInspector({esc,toast,log});
const nativeFsp=setupNativeFsp({esc,toast,log,getProject:()=>state.project,loadProject:async project=>{
 if(state.mode==='running')throw Error('Wait for the active simulation to finish before opening a scene.');
 const validated=await api('/validate',project);remember();state.project=validated.project;state.selected='fdtd';
 state.results=null;state.monitors=null;state.liveFrame=null;state.job=null;
 $('#results-tree').innerHTML='<div class="muted empty-hint">Run to calculate the imported scene.</div>';
 persist();setMode('layout');setTab('geometry');renderTree();views.fit();await validate();
 log('Opened independently converted FSP scene. Conversion differences are retained with the project.');
}});
const gdsExport=setupGdsExport({esc,toast,log,api,getProject:()=>state.project,download});
const gdsTools=setupGds({esc,toast,log,getProject:()=>state.project,loadProject:async project=>{
 if(state.mode!=='layout')throw Error('Switch to Layout before importing geometry.');
 const validated=await api('/validate',project);remember();state.project=validated.project;state.selected='fdtd';
 state.results=null;state.monitors=null;state.liveFrame=null;state.job=null;
 $('#results-tree').innerHTML='<div class="muted empty-hint">Run to calculate the imported scene.</div>';
 persist();setMode('layout');setTab('geometry');renderTree();views.fit();await validate();
}});
const materialTools=setupMaterials({state,api,esc,toast,commit:project=>{if(state.mode!=='layout')throw Error('Switch to Layout before editing.');remember();state.project=project;persist();renderProperties();renderTree();views.render();validate();}});
const meshTools=setupMesh({state,api,esc,commit:project=>{if(state.mode!=='layout')throw Error('Switch to Layout before editing.');remember();state.project=project;persist();renderProperties();views.render();validate();}});
const sourceTools=setupSourceTools({state,api,esc,toast,commit:project=>{if(state.mode!=='layout')throw Error('Switch to Layout before editing.');remember();state.project=project;persist();renderProperties();renderTree();views.render();validate();}});
const geometryTools=setupGeometryEditor({state,api,esc,commit:project=>{if(state.mode!=='layout')throw Error('Switch to Layout before editing.');remember();state.project=project;persist();renderProperties();renderTree();views.render();validate();}});
const capabilityTools=setupCapabilities({api,esc});
const inverseDesign=setupInverseDesign({esc});
const monitorTools=setupMonitorTools({state,api,esc,toast,numeric,dropdown,commit:project=>{if(state.mode!=='layout')throw Error('Switch to Layout before editing.');remember();state.project=project;persist();renderProperties();renderTree();views.render();validate();}});
const boundaryTools=setupBoundaryTools({state,api,esc,commit:project=>{if(state.mode!=='layout')throw Error('Switch to Layout before editing.');remember();state.project=project;persist();renderProperties();renderTree();views.render();validate();}});
const actions={
 'boundary-editor':()=>boundaryTools.open(),
 'gds':()=>{if(state.mode==='layout')gdsTools.open();},
 'geometry-vertices':()=>geometryTools.open(state.selected),
 'capabilities':()=>capabilityTools.open(),
 'inverse-design':()=>inverseDesign.open(),
 'global-monitor':()=>monitorTools.globals(),
 'flux-results':()=>monitorTools.flux(),
 'propagation':()=>openPropagation({state,api,esc,toast}),
 'mesh-preview':()=>meshTools.open(),
 'mesh-freeze':()=>meshTools.freeze(),
 'mesh-nodes':()=>meshTools.editNodes(),
 'mesh-add':()=>meshTools.add(),
 'mesh-remove':button=>meshTools.remove(Number(button.dataset.index)),
 'global-source':()=>sourceTools.globals(),
 'source-signal':()=>sourceTools.signal(state.selected),
 'source-preview':()=>sourceTools.preview(state.selected),
 fsp:()=>fspInspector.open(),
 'fsp-native':()=>{if(state.mode==='layout')nativeFsp.open();},
 new:()=>{if(state.mode==='running')return;showDialog('<h2>Project files</h2><p>Save your current project before opening another design.</p><div class="dialog-buttons"><button data-action="save">Save current project</button><button data-action="open">Open project (.json)</button><button data-action="blank">New empty project</button></div>');},
 blank:async()=>{if(state.mode==='running')return;remember();const p=await api('/examples/waveguide');p.name='Untitled';p.structures=[];p.sources=[];p.monitors=[];state.project=p;state.selected='fdtd';state.results=null;state.monitors=null;state.liveFrame=null;persist();setMode('layout');setTab('geometry');renderTree();validate();$('#dialog').close();},
 save:async()=>{if(state.mode==='layout')await validate();download(JSON.stringify(state.project,null,2),state.project.name.replace(/[^a-z0-9]/gi,'_')+'.json');state.dirty=false;log(`Project saved as JSON (revision ${state.project.revision||0}${state.project.content_sha256?', content hash '+state.project.content_sha256.slice(0,12):', content hash unavailable'}). Load the same file from Python with Project.load().`);},
 'export-gds':()=>gdsExport.open(),
 open:()=>{if(state.mode!=='running')$('#file-input').click();},
 region:()=>select('fdtd'),fit:()=>views.fit(),materials,
 undo:()=>{if(state.mode!=='layout'||!state.history.length)return;state.future.push(JSON.stringify(state.project));state.project=JSON.parse(state.history.pop());persist();select('fdtd');validate();},
 redo:()=>{if(state.mode!=='layout'||!state.future.length)return;state.history.push(JSON.stringify(state.project));state.project=JSON.parse(state.future.pop());persist();select('fdtd');validate();},
 delete:()=>deleteObjects(selection()),
 'delete-object':button=>deleteObjects([button.dataset.id]),
 'duplicate-object':button=>{if(state.mode!=='layout')return;const source=[...state.project.structures,...state.project.sources,...state.project.monitors].find(o=>o.id===button.dataset.id);if(!source)return;remember();const copies=placeCopies([structuredClone(source)]);persist();selectMany(copies.map(o=>o.id));validate();},
 duplicate:()=>{if(state.mode!=='layout'||!selection().length)return;remember();const copies=placeCopies(selection().map(id=>structuredClone([...state.project.structures,...state.project.sources,...state.project.monitors].find(o=>o.id===id))));persist();selectMany(copies.map(o=>o.id));validate();},
 copy:()=>{if(!selection().length)return;const items=selection().map(id=>structuredClone([...state.project.structures,...state.project.sources,...state.project.monitors].find(o=>o.id===id)));state.clipboard=JSON.stringify(items);log(`Copied ${items.length} object${items.length===1?'':'s'}.`);toast(`Copied ${items.length} object${items.length===1?'':'s'}. Paste with Ctrl+V.`);},
 paste:()=>{if(state.mode!=='layout'||!state.clipboard)return;remember();const copies=placeCopies(JSON.parse(state.clipboard));persist();selectMany(copies.map(o=>o.id));validate();log(`Pasted ${copies.length} object${copies.length===1?'':'s'}.`);},
 'structure-earlier':()=>moveStructure(-1),
 'structure-later':()=>moveStructure(1),
 layout:()=>{if(state.mode==='running')return;state.liveFrame=null;setMode('layout');setTab('geometry');log('Layout mode. The results of the last run stay visible and are marked stale as soon as the project plan differs from that run.');},
 run,stop:async()=>{if(state.job){await api('/jobs/'+state.job+'/cancel',{});log('Stop requested. Waiting for the current time step to finish.');}},validate,
 python:()=>setBottom('python'),'export-python':async()=>{download(await api('/python',state.project),'simulation.py','text/x-python');},
 'mode-ports':()=>openModeNetwork(state.project,{toast}),
 download:()=>{if(!state.results){toast('Run the simulation first.');return;}if(!$('#stale-banner').hidden)log('Downloading the results of run revision '+(state.results.revision??'?')+'; the project has changed since that run.','warning');window.location.href='/api/jobs/'+state.job+'/download';},
 csv:()=>{if(state.results)window.location.href='/api/jobs/'+state.job+(state.spectrum?'/spectra.csv':'/monitors.csv');else toast('Run the simulation first.');},
 playback:()=>{if(playTimer){clearInterval(playTimer);playTimer=null;return;}if(!state.results?.frames.length)return;playTimer=setInterval(()=>{if(!state.results){clearInterval(playTimer);playTimer=null;return;}state.frame=(state.frame+1)%state.results.frames.length;renderResults();},80);},
 'add-material':()=>{remember();state.project.materials.push({name:'Custom dielectric '+state.project.materials.length,index:1.5,color:'#60bdaa'});persist();$('#dialog').close();materials();},
 help:()=>showDialog(`<h2>From Lumerical to TorchFDTD</h2><p>The workbench follows the familiar Objects Tree, CAD views, FDTD region and Layout / Analysis workflow.</p><ol><li>Add a Rectangle, Circle, Ring or Sphere from the Design ribbon.</li><li>Select an object in the tree or any viewport. Drag to move. Edit x, y, z, spans, material and mesh order in Object properties.</li><li>Select FDTD to set dimension, mesh, PML and simulation time steps.</li><li>Add a dipole or bidirectional sheet source and point time monitors.</li><li>Run on the connected solver. Inspect field snapshots, time traces and field spectra.</li><li>Switch to Layout to edit, or export JSON, Python and NPZ results.</li></ol><p><b>Shortcuts:</b> Ctrl+S save · Ctrl+O open · Ctrl+D duplicate · Delete remove · Ctrl+Z undo · Ctrl+Y redo · F fit.</p><p>This is an independent open-source workbench. The FSP inspector reads and edits .fsp settings through an installed, licensed Lumerical API. FSP → GPU independently imports a verified subset of layout settings and displays unsupported settings and numerical differences. Arbitrary FSP execution and .lsf execution remain unimplemented. See Supported combinations for the supported physics and execution modes. PMC cavities currently use point electric sources and point monitors. General material, port and boundary combinations remain under development.</p>`),
};
function placeCopies(items){
 // Copies keep their category, get fresh ids, a _copy suffix and a 0.2 um x offset, so pasted objects never collide with their originals.
 const kinds={rectangle:'structures',circle:'structures',ring:'structures',sphere:'structures',polygon:'structures',point:'sources',plane:'sources',tfsf:'sources',field:'monitors'};
 return items.map(o=>{o.id=crypto.randomUUID();o.name+='_copy';o.center[0]+=.2;state.project[kinds[o.kind]||'monitors'].push(o);return o;});
}
function deleteObjects(ids){
 if(state.mode!=='layout')return;const all=[...state.project.structures,...state.project.sources,...state.project.monitors],names=ids.map(id=>all.find(o=>o.id===id)?.name).filter(Boolean);if(!names.length)return;
 remember();const chosen=new Set(ids);for(const cat of ['structures','sources','monitors'])state.project[cat]=state.project[cat].filter(o=>!chosen.has(o.id));persist();select('fdtd');validate();log(names.length===1?`Deleted ${names[0]}. Undo (Ctrl+Z) restores it.`:`Deleted ${names.length} objects.`);
}
function moveStructure(delta){
 if(state.mode!=='layout')return;
 const list=state.project.structures,index=list.findIndex(s=>s.id===state.selected),next=index+delta;
 if(index<0||next<0||next>=list.length)return;
 remember();[list[index],list[next]]=[list[next],list[index]];persist();select(state.selected);validate();
}
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b||b.disabled||!state.project||!views)return;try{
 if(b.dataset.action)await actions[b.dataset.action]?.(b);
 if(b.dataset.add)add(b.dataset.add);
 if(b.dataset.select)select(b.dataset.select,e.ctrlKey||e.metaKey);
 if(b.dataset.tab)setTab(b.dataset.tab);
 if(b.dataset.bottom)setBottom(b.dataset.bottom);
 if(b.dataset.plot){state.spectrum=b.dataset.plot==='spectrum';$$('[data-plot]').forEach(a=>a.classList.toggle('active',a===b));renderResults();}
 if(b.dataset.example){if(state.mode==='running')return;remember();state.project=await api('/examples/'+b.dataset.example);state.results=null;state.monitors=null;state.liveFrame=null;state.selected='fdtd';persist();setMode('layout');setTab('geometry');renderTree();views.fit();validate();log('Opened example: '+state.project.name);}
 if(b.dataset.ribbon){$$('[data-ribbon]').forEach(a=>a.classList.toggle('active',a===b));if(b.dataset.ribbon==='simulation')select('fdtd');if(b.dataset.ribbon==='view')views.fit();}
 if(b.hasAttribute('data-close'))$('#dialog').close();
 }catch(error){toast(error.message);log(error.message,'error');}});
$('#file-input').onchange=async e=>{const file=e.target.files[0];if(!file)return;if(file.name.toLowerCase().endsWith('.fsp')){e.target.value='';$('#dialog').close();await fspInspector.openFile(file);return;}try{const p=JSON.parse(await file.text()),v=await api('/validate',p);remember();state.project=v.project;state.selected='fdtd';state.results=null;state.monitors=null;state.liveFrame=null;persist();setMode('layout');setTab('geometry');renderTree();views.fit();validate();$('#dialog').close();log('Opened '+file.name);}catch(error){toast(error.message);}e.target.value='';};
$('#snap').onchange=e=>state.snap=e.target.checked;
$('#frame-slider').oninput=e=>{state.frame=Number(e.target.value);renderResults();};
document.addEventListener('keydown',e=>{if(!state.project||!views||document.querySelector('dialog[open]'))return;if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;const key=e.key.toLowerCase();if(e.ctrlKey&&['s','o','d','z','y','c','v'].includes(key)){e.preventDefault();actions[{s:'save',o:'open',d:'duplicate',z:'undo',y:'redo',c:'copy',v:'paste'}[key]]();}else if(e.key==='Delete')actions.delete();else if(key==='f')views.fit();});
$('#plot-monitor').onchange=e=>{state.plotMonitor=e.target.value;renderResults();};
$('#plot-axis').onchange=()=>renderResults();
window.addEventListener('resize',()=>{if(state.tab==='fields')renderResults();});
async function init(){
 try{health=await api('/health');$('.version').textContent='DEVELOPMENT'+(health.version?' · '+health.version:'');$('#connection').innerHTML=`<span class="dot"></span>${health.cuda?esc(health.gpu):'CPU solver'} <small>${esc(health.hostname)}</small>`;$('#footer-device').textContent=health.cuda?'CUDA · '+health.gpu_memory_gb+' GB':'CPU';
 const saved=localStorage.getItem('torchfdtd.project.v1');let recovered=null;try{if(saved){recovered=await api('/validate',JSON.parse(saved));state.project=recovered.project;}else state.project=await api('/examples/waveguide');}catch{state.project=await api('/examples/waveguide');}
 state.maxRevision=state.project.revision||0;
 views=new Views($('#viewports'),state,select,change,remember);renderTree();setMode('layout');views.fit();await validate();log('Connected to '+health.hostname+' · '+health.engine+'.');
 if(recovered){log(`Recovered the autosaved project "${state.project.name}" at revision ${state.project.revision||0} from browser storage.`);if(recovered.stored_content_sha256_matches===false)log('The autosaved project content does not match its stored content hash; it was changed outside the workbench.','warning');}log('Select an object to edit. Add structures, configure FDTD and Run. Python and JSON use the same project model.');
 const active=localStorage.getItem('torchfdtd.activeJob');if(active){try{const job=await api('/jobs/'+active);state.project=job.project;state.job=active;setMode('running');renderTree();setTab('fields');poll();}catch{localStorage.removeItem('torchfdtd.activeJob');}}
 }catch(e){$('#connection').textContent='Solver unavailable';log(e.message,'error');toast('Cannot connect to the solver. Start torchfdtd serve and reload.');}
 refreshIcons();
}
$$('.editable').forEach(b=>b.disabled=true);$('#run-button').disabled=true;
init();
