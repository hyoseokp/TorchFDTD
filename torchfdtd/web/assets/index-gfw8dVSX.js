(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ic=(n,e,t=[])=>{const i=document.createElementNS("http://www.w3.org/2000/svg",n);return Object.keys(e).forEach(s=>{i.setAttribute(s,String(e[s]))}),t.length&&t.forEach(s=>{const a=Ic(...s);i.appendChild(a)}),i};var Bd=([n,e,t])=>Ic(n,e,t);/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $d=n=>Array.from(n.attributes).reduce((e,t)=>(e[t.name]=t.value,e),{}),Hd=n=>typeof n=="string"?n:!n||!n.class?"":n.class&&typeof n.class=="string"?n.class.split(" "):n.class&&Array.isArray(n.class)?n.class:"",Gd=n=>n.flatMap(Hd).map(t=>t.trim()).filter(Boolean).filter((t,i,s)=>s.indexOf(t)===i).join(" "),Vd=n=>n.replace(/(\w)(\w*)(_|-|\s*)/g,(e,t,i)=>t.toUpperCase()+i.toLowerCase()),il=(n,{nameAttr:e,icons:t,attrs:i})=>{var g;const s=n.getAttribute(e);if(s==null)return;const a=Vd(s),r=t[a];if(!r)return console.warn(`${n.outerHTML} icon name was not found in the provided icons object.`);const o=$d(n),[l,c,d]=r,u={...c,"data-lucide":s,...i,...o},h=Gd(["lucide",`lucide-${s}`,o,i]);h&&Object.assign(u,{class:h});const m=Bd([l,u,d]);return(g=n.parentNode)==null?void 0:g.replaceChild(m,n)};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gt={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wd=["svg",gt,[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jd=["svg",gt,[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"}],["path",{d:"m3.3 7 8.7 5 8.7-5"}],["path",{d:"M12 22V12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qd=["svg",gt,[["path",{d:"M12 16v5"}],["path",{d:"M16 14v7"}],["path",{d:"M20 10v11"}],["path",{d:"m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"}],["path",{d:"M4 18v3"}],["path",{d:"M8 14v7"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xd=["svg",gt,[["circle",{cx:"12",cy:"12",r:"10"}],["circle",{cx:"12",cy:"12",r:"1"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yd=["svg",gt,[["circle",{cx:"12",cy:"12",r:"10"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zd=["svg",gt,[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jd=["svg",gt,[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3"}],["path",{d:"M3 5v14a9 3 0 0 0 18 0V5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kd=["svg",gt,[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["polyline",{points:"7 10 12 15 17 10"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qd=["svg",gt,[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{d:"m5 12-3 3 3 3"}],["path",{d:"m9 18 3-3-3-3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eu=["svg",gt,[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tu=["svg",gt,[["circle",{cx:"12",cy:"12",r:"3"}],["line",{x1:"3",x2:"9",y1:"12",y2:"12"}],["line",{x1:"15",x2:"21",y1:"12",y2:"12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nu=["svg",gt,[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iu=["svg",gt,[["path",{d:"M18 8L22 12L18 16"}],["path",{d:"M2 12H22"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const su=["svg",gt,[["circle",{cx:"12",cy:"12",r:"3"}],["circle",{cx:"19",cy:"5",r:"2"}],["circle",{cx:"5",cy:"19",r:"2"}],["path",{d:"M10.4 21.9a10 10 0 0 0 9.941-15.416"}],["path",{d:"M13.5 2.1a10 10 0 0 0-9.841 15.416"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const au=["svg",gt,[["path",{d:"M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"}],["path",{d:"m8 6 2-2"}],["path",{d:"m18 16 2-2"}],["path",{d:"m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"}],["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}],["path",{d:"m15 5 4 4"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ru=["svg",gt,[["polygon",{points:"6 3 20 12 6 21 6 3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ou=["svg",gt,[["path",{d:"M4.9 19.1C1 15.2 1 8.8 4.9 4.9"}],["path",{d:"M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"}],["circle",{cx:"12",cy:"12",r:"2"}],["path",{d:"M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"}],["path",{d:"M19.1 4.9C23 8.8 23 15.1 19.1 19"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lu=["svg",gt,[["path",{d:"m15 14 5-5-5-5"}],["path",{d:"M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cu=["svg",gt,[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{d:"M21 3v5h-5"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{d:"M8 16H3v5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const du=["svg",gt,[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uu=["svg",gt,[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hu=["svg",gt,[["path",{d:"M20 7h-9"}],["path",{d:"M14 17H5"}],["circle",{cx:"17",cy:"17",r:"3"}],["circle",{cx:"7",cy:"7",r:"3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pu=["svg",gt,[["path",{d:"M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"}],["rect",{x:"3",y:"14",width:"7",height:"7",rx:"1"}],["circle",{cx:"17.5",cy:"17.5",r:"3.5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fu=["svg",gt,[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mu=["svg",gt,[["polyline",{points:"4 17 10 11 4 5"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gu=["svg",gt,[["path",{d:"M3 6h18"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _u=["svg",gt,[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vu=["svg",gt,[["path",{d:"M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}],["path",{d:"M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}],["path",{d:"M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xu=({icons:n={},nameAttr:e="data-lucide",attrs:t={}}={})=>{if(!Object.values(n).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof document>"u")throw new Error("`createIcons()` only works in a browser environment.");const i=document.querySelectorAll(`[${e}]`);if(Array.from(i).forEach(s=>il(s,{nameAttr:e,icons:n,attrs:t})),e==="data-lucide"){const s=document.querySelectorAll("[icon-name]");s.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(s).forEach(a=>il(a,{nameAttr:"icon-name",icons:n,attrs:t})))}};/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Uo="180",Wi={ROTATE:0,DOLLY:1,PAN:2},$i={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},yu=0,sl=1,bu=2,Uc=1,Su=2,Fn=3,ei=0,Qt=1,mn=2,Kn=0,ji=1,al=2,rl=3,ol=4,Mu=5,mi=100,Eu=101,wu=102,Tu=103,Au=104,Cu=200,Ru=201,Pu=202,Lu=203,Fr=204,Or=205,Du=206,Iu=207,Uu=208,Nu=209,Fu=210,Ou=211,zu=212,ku=213,Bu=214,zr=0,kr=1,Br=2,Xi=3,$r=4,Hr=5,Gr=6,Vr=7,Nc=0,$u=1,Hu=2,Qn=0,Gu=1,Vu=2,Wu=3,ju=4,qu=5,Xu=6,Yu=7,Fc=300,Yi=301,Zi=302,Wr=303,jr=304,Oa=306,qr=1e3,xi=1001,Xr=1002,_n=1003,Zu=1004,Hs=1005,Mn=1006,Wa=1007,yi=1008,Tn=1009,Oc=1010,zc=1011,As=1012,No=1013,bi=1014,zn=1015,Fs=1016,Fo=1017,Oo=1018,Cs=1020,kc=35902,Bc=35899,$c=1021,Hc=1022,gn=1023,Rs=1026,Ps=1027,Gc=1028,zo=1029,Vc=1030,ko=1031,Bo=1033,Sa=33776,Ma=33777,Ea=33778,wa=33779,Yr=35840,Zr=35841,Jr=35842,Kr=35843,Qr=36196,eo=37492,to=37496,no=37808,io=37809,so=37810,ao=37811,ro=37812,oo=37813,lo=37814,co=37815,uo=37816,ho=37817,po=37818,fo=37819,mo=37820,go=37821,_o=36492,vo=36494,xo=36495,yo=36283,bo=36284,So=36285,Mo=36286,Ju=3200,Ku=3201,Wc=0,Qu=1,Jn="",cn="srgb",Ji="srgb-linear",Ra="linear",pt="srgb",Ti=7680,ll=519,eh=512,th=513,nh=514,jc=515,ih=516,sh=517,ah=518,rh=519,cl=35044,dl="300 es",En=2e3,Pa=2001;class Ei{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const Gt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ss=Math.PI/180,Eo=180/Math.PI;function is(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Gt[n&255]+Gt[n>>8&255]+Gt[n>>16&255]+Gt[n>>24&255]+"-"+Gt[e&255]+Gt[e>>8&255]+"-"+Gt[e>>16&15|64]+Gt[e>>24&255]+"-"+Gt[t&63|128]+Gt[t>>8&255]+"-"+Gt[t>>16&255]+Gt[t>>24&255]+Gt[i&255]+Gt[i>>8&255]+Gt[i>>16&255]+Gt[i>>24&255]).toLowerCase()}function Ye(n,e,t){return Math.max(e,Math.min(t,n))}function oh(n,e){return(n%e+e)%e}function ja(n,e,t){return(1-t)*n+t*e}function os(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Jt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const lh={DEG2RAD:Ss};class ae{constructor(e=0,t=0){ae.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ye(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*i-r*s+e.x,this.y=a*s+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ht{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,a,r,o){let l=i[s+0],c=i[s+1],d=i[s+2],u=i[s+3];const h=a[r+0],m=a[r+1],g=a[r+2],_=a[r+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u;return}if(o===1){e[t+0]=h,e[t+1]=m,e[t+2]=g,e[t+3]=_;return}if(u!==_||l!==h||c!==m||d!==g){let p=1-o;const f=l*h+c*m+d*g+u*_,w=f>=0?1:-1,E=1-f*f;if(E>Number.EPSILON){const T=Math.sqrt(E),S=Math.atan2(T,f*w);p=Math.sin(p*S)/T,o=Math.sin(o*S)/T}const y=o*w;if(l=l*p+h*y,c=c*p+m*y,d=d*p+g*y,u=u*p+_*y,p===1-o){const T=1/Math.sqrt(l*l+c*c+d*d+u*u);l*=T,c*=T,d*=T,u*=T}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,a,r){const o=i[s],l=i[s+1],c=i[s+2],d=i[s+3],u=a[r],h=a[r+1],m=a[r+2],g=a[r+3];return e[t]=o*g+d*u+l*m-c*h,e[t+1]=l*g+d*h+c*u-o*m,e[t+2]=c*g+d*m+o*h-l*u,e[t+3]=d*g-o*u-l*h-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,l=Math.sin,c=o(i/2),d=o(s/2),u=o(a/2),h=l(i/2),m=l(s/2),g=l(a/2);switch(r){case"XYZ":this._x=h*d*u+c*m*g,this._y=c*m*u-h*d*g,this._z=c*d*g+h*m*u,this._w=c*d*u-h*m*g;break;case"YXZ":this._x=h*d*u+c*m*g,this._y=c*m*u-h*d*g,this._z=c*d*g-h*m*u,this._w=c*d*u+h*m*g;break;case"ZXY":this._x=h*d*u-c*m*g,this._y=c*m*u+h*d*g,this._z=c*d*g+h*m*u,this._w=c*d*u-h*m*g;break;case"ZYX":this._x=h*d*u-c*m*g,this._y=c*m*u+h*d*g,this._z=c*d*g-h*m*u,this._w=c*d*u+h*m*g;break;case"YZX":this._x=h*d*u+c*m*g,this._y=c*m*u+h*d*g,this._z=c*d*g-h*m*u,this._w=c*d*u-h*m*g;break;case"XZY":this._x=h*d*u-c*m*g,this._y=c*m*u-h*d*g,this._z=c*d*g+h*m*u,this._w=c*d*u+h*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],a=t[8],r=t[1],o=t[5],l=t[9],c=t[2],d=t[6],u=t[10],h=i+o+u;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(d-l)*m,this._y=(a-c)*m,this._z=(r-s)*m}else if(i>o&&i>u){const m=2*Math.sqrt(1+i-o-u);this._w=(d-l)/m,this._x=.25*m,this._y=(s+r)/m,this._z=(a+c)/m}else if(o>u){const m=2*Math.sqrt(1+o-i-u);this._w=(a-c)/m,this._x=(s+r)/m,this._y=.25*m,this._z=(l+d)/m}else{const m=2*Math.sqrt(1+u-i-o);this._w=(r-s)/m,this._x=(a+c)/m,this._y=(l+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ye(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,a=e._z,r=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+r*o+s*c-a*l,this._y=s*d+r*l+a*o-i*c,this._z=a*d+r*c+i*l-s*o,this._w=r*d-i*o-s*l-a*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,s=this._y,a=this._z,r=this._w;let o=r*e._w+i*e._x+s*e._y+a*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=r,this._x=i,this._y=s,this._z=a,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*r+t*this._w,this._x=m*i+t*this._x,this._y=m*s+t*this._y,this._z=m*a+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,o),u=Math.sin((1-t)*d)/c,h=Math.sin(t*d)/c;return this._w=r*u+this._w*h,this._x=i*u+this._x*h,this._y=s*u+this._y*h,this._z=a*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(e=0,t=0,i=0){U.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ul.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ul.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*s,this.y=a[1]*t+a[4]*i+a[7]*s,this.z=a[2]*t+a[5]*i+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,a=e.x,r=e.y,o=e.z,l=e.w,c=2*(r*s-o*i),d=2*(o*t-a*s),u=2*(a*i-r*t);return this.x=t+l*c+r*u-o*d,this.y=i+l*d+o*c-a*u,this.z=s+l*u+a*d-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s,this.y=a[1]*t+a[5]*i+a[9]*s,this.z=a[2]*t+a[6]*i+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,a=e.z,r=t.x,o=t.y,l=t.z;return this.x=s*l-a*o,this.y=a*r-i*l,this.z=i*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return qa.copy(this).projectOnVector(e),this.sub(qa)}reflect(e){return this.sub(qa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ye(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const qa=new U,ul=new Ht;class qe{constructor(e,t,i,s,a,r,o,l,c){qe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,l,c)}set(e,t,i,s,a,r,o,l,c){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=a,d[5]=l,d[6]=i,d[7]=r,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],d=i[4],u=i[7],h=i[2],m=i[5],g=i[8],_=s[0],p=s[3],f=s[6],w=s[1],E=s[4],y=s[7],T=s[2],S=s[5],M=s[8];return a[0]=r*_+o*w+l*T,a[3]=r*p+o*E+l*S,a[6]=r*f+o*y+l*M,a[1]=c*_+d*w+u*T,a[4]=c*p+d*E+u*S,a[7]=c*f+d*y+u*M,a[2]=h*_+m*w+g*T,a[5]=h*p+m*E+g*S,a[8]=h*f+m*y+g*M,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*r*d-t*o*c-i*a*d+i*o*l+s*a*c-s*r*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=d*r-o*c,h=o*l-d*a,m=c*a-r*l,g=t*u+i*h+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=u*_,e[1]=(s*c-d*i)*_,e[2]=(o*i-s*r)*_,e[3]=h*_,e[4]=(d*t-s*l)*_,e[5]=(s*a-o*t)*_,e[6]=m*_,e[7]=(i*l-c*t)*_,e[8]=(r*t-i*a)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,a,r,o){const l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*r+c*o)+r+e,-s*c,s*l,-s*(-c*r+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Xa.makeScale(e,t)),this}rotate(e){return this.premultiply(Xa.makeRotation(-e)),this}translate(e,t){return this.premultiply(Xa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Xa=new qe;function qc(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function La(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function ch(){const n=La("canvas");return n.style.display="block",n}const hl={};function Ls(n){n in hl||(hl[n]=!0,console.warn(n))}function dh(n,e,t){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}const pl=new qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fl=new qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function uh(){const n={enabled:!0,workingColorSpace:Ji,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===pt&&(s.r=kn(s.r),s.g=kn(s.g),s.b=kn(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===pt&&(s.r=qi(s.r),s.g=qi(s.g),s.b=qi(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Jn?Ra:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return Ls("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return Ls("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Ji]:{primaries:e,whitePoint:i,transfer:Ra,toXYZ:pl,fromXYZ:fl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:cn},outputColorSpaceConfig:{drawingBufferColorSpace:cn}},[cn]:{primaries:e,whitePoint:i,transfer:pt,toXYZ:pl,fromXYZ:fl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:cn}}}),n}const rt=uh();function kn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function qi(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ai;class hh{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ai===void 0&&(Ai=La("canvas")),Ai.width=e.width,Ai.height=e.height;const s=Ai.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Ai}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=La("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=kn(a[r]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(kn(t[i]/255)*255):t[i]=kn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let ph=0;class $o{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ph++}),this.uuid=is(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Ya(s[r].image)):a.push(Ya(s[r]))}else a=Ya(s);i.url=a}return t||(e.images[this.uuid]=i),i}}function Ya(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?hh.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let fh=0;const Za=new U;class en extends Ei{constructor(e=en.DEFAULT_IMAGE,t=en.DEFAULT_MAPPING,i=xi,s=xi,a=Mn,r=yi,o=gn,l=Tn,c=en.DEFAULT_ANISOTROPY,d=Jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:fh++}),this.uuid=is(),this.name="",this.source=new $o(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ae(0,0),this.repeat=new ae(1,1),this.center=new ae(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Za).x}get height(){return this.source.getSize(Za).y}get depth(){return this.source.getSize(Za).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Fc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case qr:e.x=e.x-Math.floor(e.x);break;case xi:e.x=e.x<0?0:1;break;case Xr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case qr:e.y=e.y-Math.floor(e.y);break;case xi:e.y=e.y<0?0:1;break;case Xr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}en.DEFAULT_IMAGE=null;en.DEFAULT_MAPPING=Fc;en.DEFAULT_ANISOTROPY=1;class Rt{constructor(e=0,t=0,i=0,s=1){Rt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*i+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,a;const l=e.elements,c=l[0],d=l[4],u=l[8],h=l[1],m=l[5],g=l[9],_=l[2],p=l[6],f=l[10];if(Math.abs(d-h)<.01&&Math.abs(u-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(c+1)/2,y=(m+1)/2,T=(f+1)/2,S=(d+h)/4,M=(u+_)/4,b=(g+p)/4;return E>y&&E>T?E<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(E),s=S/i,a=M/i):y>T?y<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(y),i=S/s,a=b/s):T<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(T),i=M/a,s=b/a),this.set(i,s,a,t),this}let w=Math.sqrt((p-g)*(p-g)+(u-_)*(u-_)+(h-d)*(h-d));return Math.abs(w)<.001&&(w=1),this.x=(p-g)/w,this.y=(u-_)/w,this.z=(h-d)/w,this.w=Math.acos((c+m+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this.w=Ye(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this.w=Ye(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class mh extends Ei{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Rt(0,0,e,t),this.scissorTest=!1,this.viewport=new Rt(0,0,e,t);const s={width:e,height:t,depth:i.depth},a=new en(s);this.textures=[];const r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Mn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new $o(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Si extends mh{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Xc extends en{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=_n,this.minFilter=_n,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class gh extends en{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=_n,this.minFilter=_n,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Os{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(hn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(hn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=hn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,hn):hn.fromBufferAttribute(a,r),hn.applyMatrix4(e.matrixWorld),this.expandByPoint(hn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Gs.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Gs.copy(i.boundingBox)),Gs.applyMatrix4(e.matrixWorld),this.union(Gs)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,hn),hn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ls),Vs.subVectors(this.max,ls),Ci.subVectors(e.a,ls),Ri.subVectors(e.b,ls),Pi.subVectors(e.c,ls),Hn.subVectors(Ri,Ci),Gn.subVectors(Pi,Ri),ai.subVectors(Ci,Pi);let t=[0,-Hn.z,Hn.y,0,-Gn.z,Gn.y,0,-ai.z,ai.y,Hn.z,0,-Hn.x,Gn.z,0,-Gn.x,ai.z,0,-ai.x,-Hn.y,Hn.x,0,-Gn.y,Gn.x,0,-ai.y,ai.x,0];return!Ja(t,Ci,Ri,Pi,Vs)||(t=[1,0,0,0,1,0,0,0,1],!Ja(t,Ci,Ri,Pi,Vs))?!1:(Ws.crossVectors(Hn,Gn),t=[Ws.x,Ws.y,Ws.z],Ja(t,Ci,Ri,Pi,Vs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,hn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(hn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Pn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Pn=[new U,new U,new U,new U,new U,new U,new U,new U],hn=new U,Gs=new Os,Ci=new U,Ri=new U,Pi=new U,Hn=new U,Gn=new U,ai=new U,ls=new U,Vs=new U,Ws=new U,ri=new U;function Ja(n,e,t,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){ri.fromArray(n,a);const o=s.x*Math.abs(ri.x)+s.y*Math.abs(ri.y)+s.z*Math.abs(ri.z),l=e.dot(ri),c=t.dot(ri),d=i.dot(ri);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const _h=new Os,cs=new U,Ka=new U;class za{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):_h.setFromPoints(e).getCenter(i);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;cs.subVectors(e,this.center);const t=cs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(cs,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ka.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(cs.copy(e.center).add(Ka)),this.expandByPoint(cs.copy(e.center).sub(Ka))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Ln=new U,Qa=new U,js=new U,Vn=new U,er=new U,qs=new U,tr=new U;class ka{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ln)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ln.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ln.copy(this.origin).addScaledVector(this.direction,t),Ln.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Qa.copy(e).add(t).multiplyScalar(.5),js.copy(t).sub(e).normalize(),Vn.copy(this.origin).sub(Qa);const a=e.distanceTo(t)*.5,r=-this.direction.dot(js),o=Vn.dot(this.direction),l=-Vn.dot(js),c=Vn.lengthSq(),d=Math.abs(1-r*r);let u,h,m,g;if(d>0)if(u=r*l-o,h=r*o-l,g=a*d,u>=0)if(h>=-g)if(h<=g){const _=1/d;u*=_,h*=_,m=u*(u+r*h+2*o)+h*(r*u+h+2*l)+c}else h=a,u=Math.max(0,-(r*h+o)),m=-u*u+h*(h+2*l)+c;else h=-a,u=Math.max(0,-(r*h+o)),m=-u*u+h*(h+2*l)+c;else h<=-g?(u=Math.max(0,-(-r*a+o)),h=u>0?-a:Math.min(Math.max(-a,-l),a),m=-u*u+h*(h+2*l)+c):h<=g?(u=0,h=Math.min(Math.max(-a,-l),a),m=h*(h+2*l)+c):(u=Math.max(0,-(r*a+o)),h=u>0?a:Math.min(Math.max(-a,-l),a),m=-u*u+h*(h+2*l)+c);else h=r>0?-a:a,u=Math.max(0,-(r*h+o)),m=-u*u+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Qa).addScaledVector(js,h),m}intersectSphere(e,t){Ln.subVectors(e.center,this.origin);const i=Ln.dot(this.direction),s=Ln.dot(Ln)-i*i,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,a,r,o,l;const c=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),d>=0?(a=(e.min.y-h.y)*d,r=(e.max.y-h.y)*d):(a=(e.max.y-h.y)*d,r=(e.min.y-h.y)*d),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),u>=0?(o=(e.min.z-h.z)*u,l=(e.max.z-h.z)*u):(o=(e.max.z-h.z)*u,l=(e.min.z-h.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Ln)!==null}intersectTriangle(e,t,i,s,a){er.subVectors(t,e),qs.subVectors(i,e),tr.crossVectors(er,qs);let r=this.direction.dot(tr),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;Vn.subVectors(this.origin,e);const l=o*this.direction.dot(qs.crossVectors(Vn,qs));if(l<0)return null;const c=o*this.direction.dot(er.cross(Vn));if(c<0||l+c>r)return null;const d=-o*Vn.dot(tr);return d<0?null:this.at(d/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class mt{constructor(e,t,i,s,a,r,o,l,c,d,u,h,m,g,_,p){mt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,l,c,d,u,h,m,g,_,p)}set(e,t,i,s,a,r,o,l,c,d,u,h,m,g,_,p){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=a,f[5]=r,f[9]=o,f[13]=l,f[2]=c,f[6]=d,f[10]=u,f[14]=h,f[3]=m,f[7]=g,f[11]=_,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new mt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/Li.setFromMatrixColumn(e,0).length(),a=1/Li.setFromMatrixColumn(e,1).length(),r=1/Li.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,a=e.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),d=Math.cos(a),u=Math.sin(a);if(e.order==="XYZ"){const h=r*d,m=r*u,g=o*d,_=o*u;t[0]=l*d,t[4]=-l*u,t[8]=c,t[1]=m+g*c,t[5]=h-_*c,t[9]=-o*l,t[2]=_-h*c,t[6]=g+m*c,t[10]=r*l}else if(e.order==="YXZ"){const h=l*d,m=l*u,g=c*d,_=c*u;t[0]=h+_*o,t[4]=g*o-m,t[8]=r*c,t[1]=r*u,t[5]=r*d,t[9]=-o,t[2]=m*o-g,t[6]=_+h*o,t[10]=r*l}else if(e.order==="ZXY"){const h=l*d,m=l*u,g=c*d,_=c*u;t[0]=h-_*o,t[4]=-r*u,t[8]=g+m*o,t[1]=m+g*o,t[5]=r*d,t[9]=_-h*o,t[2]=-r*c,t[6]=o,t[10]=r*l}else if(e.order==="ZYX"){const h=r*d,m=r*u,g=o*d,_=o*u;t[0]=l*d,t[4]=g*c-m,t[8]=h*c+_,t[1]=l*u,t[5]=_*c+h,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=r*l}else if(e.order==="YZX"){const h=r*l,m=r*c,g=o*l,_=o*c;t[0]=l*d,t[4]=_-h*u,t[8]=g*u+m,t[1]=u,t[5]=r*d,t[9]=-o*d,t[2]=-c*d,t[6]=m*u+g,t[10]=h-_*u}else if(e.order==="XZY"){const h=r*l,m=r*c,g=o*l,_=o*c;t[0]=l*d,t[4]=-u,t[8]=c*d,t[1]=h*u+_,t[5]=r*d,t[9]=m*u-g,t[2]=g*u-m,t[6]=o*d,t[10]=_*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(vh,e,xh)}lookAt(e,t,i){const s=this.elements;return sn.subVectors(e,t),sn.lengthSq()===0&&(sn.z=1),sn.normalize(),Wn.crossVectors(i,sn),Wn.lengthSq()===0&&(Math.abs(i.z)===1?sn.x+=1e-4:sn.z+=1e-4,sn.normalize(),Wn.crossVectors(i,sn)),Wn.normalize(),Xs.crossVectors(sn,Wn),s[0]=Wn.x,s[4]=Xs.x,s[8]=sn.x,s[1]=Wn.y,s[5]=Xs.y,s[9]=sn.y,s[2]=Wn.z,s[6]=Xs.z,s[10]=sn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],d=i[1],u=i[5],h=i[9],m=i[13],g=i[2],_=i[6],p=i[10],f=i[14],w=i[3],E=i[7],y=i[11],T=i[15],S=s[0],M=s[4],b=s[8],x=s[12],v=s[1],A=s[5],I=s[9],P=s[13],O=s[2],N=s[6],z=s[10],B=s[14],H=s[3],Y=s[7],de=s[11],ge=s[15];return a[0]=r*S+o*v+l*O+c*H,a[4]=r*M+o*A+l*N+c*Y,a[8]=r*b+o*I+l*z+c*de,a[12]=r*x+o*P+l*B+c*ge,a[1]=d*S+u*v+h*O+m*H,a[5]=d*M+u*A+h*N+m*Y,a[9]=d*b+u*I+h*z+m*de,a[13]=d*x+u*P+h*B+m*ge,a[2]=g*S+_*v+p*O+f*H,a[6]=g*M+_*A+p*N+f*Y,a[10]=g*b+_*I+p*z+f*de,a[14]=g*x+_*P+p*B+f*ge,a[3]=w*S+E*v+y*O+T*H,a[7]=w*M+E*A+y*N+T*Y,a[11]=w*b+E*I+y*z+T*de,a[15]=w*x+E*P+y*B+T*ge,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],a=e[12],r=e[1],o=e[5],l=e[9],c=e[13],d=e[2],u=e[6],h=e[10],m=e[14],g=e[3],_=e[7],p=e[11],f=e[15];return g*(+a*l*u-s*c*u-a*o*h+i*c*h+s*o*m-i*l*m)+_*(+t*l*m-t*c*h+a*r*h-s*r*m+s*c*d-a*l*d)+p*(+t*c*u-t*o*m-a*r*u+i*r*m+a*o*d-i*c*d)+f*(-s*o*d-t*l*u+t*o*h+s*r*u-i*r*h+i*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=e[9],h=e[10],m=e[11],g=e[12],_=e[13],p=e[14],f=e[15],w=u*p*c-_*h*c+_*l*m-o*p*m-u*l*f+o*h*f,E=g*h*c-d*p*c-g*l*m+r*p*m+d*l*f-r*h*f,y=d*_*c-g*u*c+g*o*m-r*_*m-d*o*f+r*u*f,T=g*u*l-d*_*l-g*o*h+r*_*h+d*o*p-r*u*p,S=t*w+i*E+s*y+a*T;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const M=1/S;return e[0]=w*M,e[1]=(_*h*a-u*p*a-_*s*m+i*p*m+u*s*f-i*h*f)*M,e[2]=(o*p*a-_*l*a+_*s*c-i*p*c-o*s*f+i*l*f)*M,e[3]=(u*l*a-o*h*a-u*s*c+i*h*c+o*s*m-i*l*m)*M,e[4]=E*M,e[5]=(d*p*a-g*h*a+g*s*m-t*p*m-d*s*f+t*h*f)*M,e[6]=(g*l*a-r*p*a-g*s*c+t*p*c+r*s*f-t*l*f)*M,e[7]=(r*h*a-d*l*a+d*s*c-t*h*c-r*s*m+t*l*m)*M,e[8]=y*M,e[9]=(g*u*a-d*_*a-g*i*m+t*_*m+d*i*f-t*u*f)*M,e[10]=(r*_*a-g*o*a+g*i*c-t*_*c-r*i*f+t*o*f)*M,e[11]=(d*o*a-r*u*a-d*i*c+t*u*c+r*i*m-t*o*m)*M,e[12]=T*M,e[13]=(d*_*s-g*u*s+g*i*h-t*_*h-d*i*p+t*u*p)*M,e[14]=(g*o*s-r*_*s-g*i*l+t*_*l+r*i*p-t*o*p)*M,e[15]=(r*u*s-d*o*s+d*i*l-t*u*l-r*i*h+t*o*h)*M,this}scale(e){const t=this.elements,i=e.x,s=e.y,a=e.z;return t[0]*=i,t[4]*=s,t[8]*=a,t[1]*=i,t[5]*=s,t[9]*=a,t[2]*=i,t[6]*=s,t[10]*=a,t[3]*=i,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),a=1-i,r=e.x,o=e.y,l=e.z,c=a*r,d=a*o;return this.set(c*r+i,c*o-s*l,c*l+s*o,0,c*o+s*l,d*o+i,d*l-s*r,0,c*l-s*o,d*l+s*r,a*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,a,r){return this.set(1,i,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,a=t._x,r=t._y,o=t._z,l=t._w,c=a+a,d=r+r,u=o+o,h=a*c,m=a*d,g=a*u,_=r*d,p=r*u,f=o*u,w=l*c,E=l*d,y=l*u,T=i.x,S=i.y,M=i.z;return s[0]=(1-(_+f))*T,s[1]=(m+y)*T,s[2]=(g-E)*T,s[3]=0,s[4]=(m-y)*S,s[5]=(1-(h+f))*S,s[6]=(p+w)*S,s[7]=0,s[8]=(g+E)*M,s[9]=(p-w)*M,s[10]=(1-(h+_))*M,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let a=Li.set(s[0],s[1],s[2]).length();const r=Li.set(s[4],s[5],s[6]).length(),o=Li.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),e.x=s[12],e.y=s[13],e.z=s[14],pn.copy(this);const c=1/a,d=1/r,u=1/o;return pn.elements[0]*=c,pn.elements[1]*=c,pn.elements[2]*=c,pn.elements[4]*=d,pn.elements[5]*=d,pn.elements[6]*=d,pn.elements[8]*=u,pn.elements[9]*=u,pn.elements[10]*=u,t.setFromRotationMatrix(pn),i.x=a,i.y=r,i.z=o,this}makePerspective(e,t,i,s,a,r,o=En,l=!1){const c=this.elements,d=2*a/(t-e),u=2*a/(i-s),h=(t+e)/(t-e),m=(i+s)/(i-s);let g,_;if(l)g=a/(r-a),_=r*a/(r-a);else if(o===En)g=-(r+a)/(r-a),_=-2*r*a/(r-a);else if(o===Pa)g=-r/(r-a),_=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,a,r,o=En,l=!1){const c=this.elements,d=2/(t-e),u=2/(i-s),h=-(t+e)/(t-e),m=-(i+s)/(i-s);let g,_;if(l)g=1/(r-a),_=r/(r-a);else if(o===En)g=-2/(r-a),_=-(r+a)/(r-a);else if(o===Pa)g=-1/(r-a),_=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=u,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Li=new U,pn=new mt,vh=new U(0,0,0),xh=new U(1,1,1),Wn=new U,Xs=new U,sn=new U,ml=new mt,gl=new Ht;class vn{constructor(e=0,t=0,i=0,s=vn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],d=s[9],u=s[2],h=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Ye(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ye(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(Ye(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-Ye(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(Ye(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Ye(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-d,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return ml.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ml,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return gl.setFromEuler(this),this.setFromQuaternion(gl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}vn.DEFAULT_ORDER="XYZ";class Ho{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let yh=0;const _l=new U,Di=new Ht,Dn=new mt,Ys=new U,ds=new U,bh=new U,Sh=new Ht,vl=new U(1,0,0),xl=new U(0,1,0),yl=new U(0,0,1),bl={type:"added"},Mh={type:"removed"},Ii={type:"childadded",child:null},nr={type:"childremoved",child:null};class Dt extends Ei{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:yh++}),this.uuid=is(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Dt.DEFAULT_UP.clone();const e=new U,t=new vn,i=new Ht,s=new U(1,1,1);function a(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new mt},normalMatrix:{value:new qe}}),this.matrix=new mt,this.matrixWorld=new mt,this.matrixAutoUpdate=Dt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ho,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Di.setFromAxisAngle(e,t),this.quaternion.multiply(Di),this}rotateOnWorldAxis(e,t){return Di.setFromAxisAngle(e,t),this.quaternion.premultiply(Di),this}rotateX(e){return this.rotateOnAxis(vl,e)}rotateY(e){return this.rotateOnAxis(xl,e)}rotateZ(e){return this.rotateOnAxis(yl,e)}translateOnAxis(e,t){return _l.copy(e).applyQuaternion(this.quaternion),this.position.add(_l.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(vl,e)}translateY(e){return this.translateOnAxis(xl,e)}translateZ(e){return this.translateOnAxis(yl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Dn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ys.copy(e):Ys.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),ds.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dn.lookAt(ds,Ys,this.up):Dn.lookAt(Ys,ds,this.up),this.quaternion.setFromRotationMatrix(Dn),s&&(Dn.extractRotation(s.matrixWorld),Di.setFromRotationMatrix(Dn),this.quaternion.premultiply(Di.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(bl),Ii.child=e,this.dispatchEvent(Ii),Ii.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Mh),nr.child=e,this.dispatchEvent(nr),nr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(bl),Ii.child=e,this.dispatchEvent(Ii),Ii.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ds,e,bh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ds,Sh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const u=l[c];a(e.shapes,u)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(e.materials,this.material[l]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(a(e.animations,l))}}if(t){const o=r(e.geometries),l=r(e.materials),c=r(e.textures),d=r(e.images),u=r(e.shapes),h=r(e.skeletons),m=r(e.animations),g=r(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),m.length>0&&(i.animations=m),g.length>0&&(i.nodes=g)}return i.object=s,i;function r(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Dt.DEFAULT_UP=new U(0,1,0);Dt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const fn=new U,In=new U,ir=new U,Un=new U,Ui=new U,Ni=new U,Sl=new U,sr=new U,ar=new U,rr=new U,or=new Rt,lr=new Rt,cr=new Rt;class un{constructor(e=new U,t=new U,i=new U){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),fn.subVectors(e,t),s.cross(fn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,i,s,a){fn.subVectors(s,t),In.subVectors(i,t),ir.subVectors(e,t);const r=fn.dot(fn),o=fn.dot(In),l=fn.dot(ir),c=In.dot(In),d=In.dot(ir),u=r*c-o*o;if(u===0)return a.set(0,0,0),null;const h=1/u,m=(c*l-o*d)*h,g=(r*d-o*l)*h;return a.set(1-m-g,g,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Un)===null?!1:Un.x>=0&&Un.y>=0&&Un.x+Un.y<=1}static getInterpolation(e,t,i,s,a,r,o,l){return this.getBarycoord(e,t,i,s,Un)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Un.x),l.addScaledVector(r,Un.y),l.addScaledVector(o,Un.z),l)}static getInterpolatedAttribute(e,t,i,s,a,r){return or.setScalar(0),lr.setScalar(0),cr.setScalar(0),or.fromBufferAttribute(e,t),lr.fromBufferAttribute(e,i),cr.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(or,a.x),r.addScaledVector(lr,a.y),r.addScaledVector(cr,a.z),r}static isFrontFacing(e,t,i,s){return fn.subVectors(i,t),In.subVectors(e,t),fn.cross(In).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return fn.subVectors(this.c,this.b),In.subVectors(this.a,this.b),fn.cross(In).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return un.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return un.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,a){return un.getInterpolation(e,this.a,this.b,this.c,t,i,s,a)}containsPoint(e){return un.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return un.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,a=this.c;let r,o;Ui.subVectors(s,i),Ni.subVectors(a,i),sr.subVectors(e,i);const l=Ui.dot(sr),c=Ni.dot(sr);if(l<=0&&c<=0)return t.copy(i);ar.subVectors(e,s);const d=Ui.dot(ar),u=Ni.dot(ar);if(d>=0&&u<=d)return t.copy(s);const h=l*u-d*c;if(h<=0&&l>=0&&d<=0)return r=l/(l-d),t.copy(i).addScaledVector(Ui,r);rr.subVectors(e,a);const m=Ui.dot(rr),g=Ni.dot(rr);if(g>=0&&m<=g)return t.copy(a);const _=m*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(Ni,o);const p=d*g-m*u;if(p<=0&&u-d>=0&&m-g>=0)return Sl.subVectors(a,s),o=(u-d)/(u-d+(m-g)),t.copy(s).addScaledVector(Sl,o);const f=1/(p+_+h);return r=_*f,o=h*f,t.copy(i).addScaledVector(Ui,r).addScaledVector(Ni,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Yc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jn={h:0,s:0,l:0},Zs={h:0,s:0,l:0};function dr(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Je{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=cn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,rt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=rt.workingColorSpace){return this.r=e,this.g=t,this.b=i,rt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=rt.workingColorSpace){if(e=oh(e,1),t=Ye(t,0,1),i=Ye(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,r=2*i-a;this.r=dr(r,a,e+1/3),this.g=dr(r,a,e),this.b=dr(r,a,e-1/3)}return rt.colorSpaceToWorking(this,s),this}setStyle(e,t=cn){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=cn){const i=Yc[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=kn(e.r),this.g=kn(e.g),this.b=kn(e.b),this}copyLinearToSRGB(e){return this.r=qi(e.r),this.g=qi(e.g),this.b=qi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=cn){return rt.workingToColorSpace(Vt.copy(this),e),Math.round(Ye(Vt.r*255,0,255))*65536+Math.round(Ye(Vt.g*255,0,255))*256+Math.round(Ye(Vt.b*255,0,255))}getHexString(e=cn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=rt.workingColorSpace){rt.workingToColorSpace(Vt.copy(this),t);const i=Vt.r,s=Vt.g,a=Vt.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let l,c;const d=(o+r)/2;if(o===r)l=0,c=0;else{const u=r-o;switch(c=d<=.5?u/(r+o):u/(2-r-o),r){case i:l=(s-a)/u+(s<a?6:0);break;case s:l=(a-i)/u+2;break;case a:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=rt.workingColorSpace){return rt.workingToColorSpace(Vt.copy(this),t),e.r=Vt.r,e.g=Vt.g,e.b=Vt.b,e}getStyle(e=cn){rt.workingToColorSpace(Vt.copy(this),e);const t=Vt.r,i=Vt.g,s=Vt.b;return e!==cn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(jn),this.setHSL(jn.h+e,jn.s+t,jn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(jn),e.getHSL(Zs);const i=ja(jn.h,Zs.h,t),s=ja(jn.s,Zs.s,t),a=ja(jn.l,Zs.l,t);return this.setHSL(i,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*s,this.g=a[1]*t+a[4]*i+a[7]*s,this.b=a[2]*t+a[5]*i+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Vt=new Je;Je.NAMES=Yc;let Eh=0;class ss extends Ei{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Eh++}),this.uuid=is(),this.name="",this.type="Material",this.blending=ji,this.side=ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fr,this.blendDst=Or,this.blendEquation=mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Je(0,0,0),this.blendAlpha=0,this.depthFunc=Xi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ll,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ti,this.stencilZFail=Ti,this.stencilZPass=Ti,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ji&&(i.blending=this.blending),this.side!==ei&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Fr&&(i.blendSrc=this.blendSrc),this.blendDst!==Or&&(i.blendDst=this.blendDst),this.blendEquation!==mi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Xi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ll&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ti&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ti&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ti&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const l=a[o];delete l.metadata,r.push(l)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ba extends ss{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.combine=Nc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const It=new U,Js=new ae;let wh=0;class wn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:wh++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=cl,this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Js.fromBufferAttribute(this,t),Js.applyMatrix3(e),this.setXY(t,Js.x,Js.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)It.fromBufferAttribute(this,t),It.applyMatrix3(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)It.fromBufferAttribute(this,t),It.applyMatrix4(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)It.fromBufferAttribute(this,t),It.applyNormalMatrix(e),this.setXYZ(t,It.x,It.y,It.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)It.fromBufferAttribute(this,t),It.transformDirection(e),this.setXYZ(t,It.x,It.y,It.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=os(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Jt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=os(t,this.array)),t}setX(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=os(t,this.array)),t}setY(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=os(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=os(t,this.array)),t}setW(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Jt(t,this.array),i=Jt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Jt(t,this.array),i=Jt(i,this.array),s=Jt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e*=this.itemSize,this.normalized&&(t=Jt(t,this.array),i=Jt(i,this.array),s=Jt(s,this.array),a=Jt(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==cl&&(e.usage=this.usage),e}}class Zc extends wn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Jc extends wn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ut extends wn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Th=0;const ln=new mt,ur=new Dt,Fi=new U,an=new Os,us=new Os,zt=new U;class Bt extends Ei{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Th++}),this.uuid=is(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(qc(e)?Jc:Zc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new qe().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ln.makeRotationFromQuaternion(e),this.applyMatrix4(ln),this}rotateX(e){return ln.makeRotationX(e),this.applyMatrix4(ln),this}rotateY(e){return ln.makeRotationY(e),this.applyMatrix4(ln),this}rotateZ(e){return ln.makeRotationZ(e),this.applyMatrix4(ln),this}translate(e,t,i){return ln.makeTranslation(e,t,i),this.applyMatrix4(ln),this}scale(e,t,i){return ln.makeScale(e,t,i),this.applyMatrix4(ln),this}lookAt(e){return ur.lookAt(e),ur.updateMatrix(),this.applyMatrix4(ur.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fi).negate(),this.translate(Fi.x,Fi.y,Fi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ut(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Os);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const a=t[i];an.setFromBufferAttribute(a),this.morphTargetsRelative?(zt.addVectors(this.boundingBox.min,an.min),this.boundingBox.expandByPoint(zt),zt.addVectors(this.boundingBox.max,an.max),this.boundingBox.expandByPoint(zt)):(this.boundingBox.expandByPoint(an.min),this.boundingBox.expandByPoint(an.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new za);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){const i=this.boundingSphere.center;if(an.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];us.setFromBufferAttribute(o),this.morphTargetsRelative?(zt.addVectors(an.min,us.min),an.expandByPoint(zt),zt.addVectors(an.max,us.max),an.expandByPoint(zt)):(an.expandByPoint(us.min),an.expandByPoint(us.max))}an.getCenter(i);let s=0;for(let a=0,r=e.count;a<r;a++)zt.fromBufferAttribute(e,a),s=Math.max(s,i.distanceToSquared(zt));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)zt.fromBufferAttribute(o,c),l&&(Fi.fromBufferAttribute(e,c),zt.add(Fi)),s=Math.max(s,i.distanceToSquared(zt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new wn(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],l=[];for(let b=0;b<i.count;b++)o[b]=new U,l[b]=new U;const c=new U,d=new U,u=new U,h=new ae,m=new ae,g=new ae,_=new U,p=new U;function f(b,x,v){c.fromBufferAttribute(i,b),d.fromBufferAttribute(i,x),u.fromBufferAttribute(i,v),h.fromBufferAttribute(a,b),m.fromBufferAttribute(a,x),g.fromBufferAttribute(a,v),d.sub(c),u.sub(c),m.sub(h),g.sub(h);const A=1/(m.x*g.y-g.x*m.y);isFinite(A)&&(_.copy(d).multiplyScalar(g.y).addScaledVector(u,-m.y).multiplyScalar(A),p.copy(u).multiplyScalar(m.x).addScaledVector(d,-g.x).multiplyScalar(A),o[b].add(_),o[x].add(_),o[v].add(_),l[b].add(p),l[x].add(p),l[v].add(p))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let b=0,x=w.length;b<x;++b){const v=w[b],A=v.start,I=v.count;for(let P=A,O=A+I;P<O;P+=3)f(e.getX(P+0),e.getX(P+1),e.getX(P+2))}const E=new U,y=new U,T=new U,S=new U;function M(b){T.fromBufferAttribute(s,b),S.copy(T);const x=o[b];E.copy(x),E.sub(T.multiplyScalar(T.dot(x))).normalize(),y.crossVectors(S,x);const A=y.dot(l[b])<0?-1:1;r.setXYZW(b,E.x,E.y,E.z,A)}for(let b=0,x=w.length;b<x;++b){const v=w[b],A=v.start,I=v.count;for(let P=A,O=A+I;P<O;P+=3)M(e.getX(P+0)),M(e.getX(P+1)),M(e.getX(P+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new wn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,m=i.count;h<m;h++)i.setXYZ(h,0,0,0);const s=new U,a=new U,r=new U,o=new U,l=new U,c=new U,d=new U,u=new U;if(e)for(let h=0,m=e.count;h<m;h+=3){const g=e.getX(h+0),_=e.getX(h+1),p=e.getX(h+2);s.fromBufferAttribute(t,g),a.fromBufferAttribute(t,_),r.fromBufferAttribute(t,p),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,p),o.add(d),l.add(d),c.add(d),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let h=0,m=t.count;h<m;h+=3)s.fromBufferAttribute(t,h+0),a.fromBufferAttribute(t,h+1),r.fromBufferAttribute(t,h+2),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)zt.fromBufferAttribute(e,t),zt.normalize(),e.setXYZ(t,zt.x,zt.y,zt.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,u=o.normalized,h=new c.constructor(l.length*d);let m=0,g=0;for(let _=0,p=l.length;_<p;_++){o.isInterleavedBufferAttribute?m=l[_]*o.data.stride+o.offset:m=l[_]*d;for(let f=0;f<d;f++)h[g++]=c[m++]}return new wn(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Bt,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let d=0,u=c.length;d<u;d++){const h=c[d],m=e(h,i);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,l=r.length;o<l;o++){const c=r[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let u=0,h=c.length;u<h;u++){const m=c[u];d.push(m.toJSON(e.data))}d.length>0&&(s[l]=d,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const d=s[c];this.setAttribute(c,d.clone(t))}const a=e.morphAttributes;for(const c in a){const d=[],u=a[c];for(let h=0,m=u.length;h<m;h++)d.push(u[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let c=0,d=r.length;c<d;c++){const u=r[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ml=new mt,oi=new ka,Ks=new za,El=new U,Qs=new U,ea=new U,ta=new U,hr=new U,na=new U,wl=new U,ia=new U;class be extends Dt{constructor(e=new Bt,t=new Ba){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){na.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const d=o[l],u=a[l];d!==0&&(hr.fromBufferAttribute(u,e),r?na.addScaledVector(hr,d):na.addScaledVector(hr.sub(t),d))}t.add(na)}return t}raycast(e,t){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ks.copy(i.boundingSphere),Ks.applyMatrix4(a),oi.copy(e.ray).recast(e.near),!(Ks.containsPoint(oi.origin)===!1&&(oi.intersectSphere(Ks,El)===null||oi.origin.distanceToSquared(El)>(e.far-e.near)**2))&&(Ml.copy(a).invert(),oi.copy(e.ray).applyMatrix4(Ml),!(i.boundingBox!==null&&oi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,oi)))}_computeIntersections(e,t,i){let s;const a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,d=a.attributes.uv1,u=a.attributes.normal,h=a.groups,m=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,_=h.length;g<_;g++){const p=h[g],f=r[p.materialIndex],w=Math.max(p.start,m.start),E=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let y=w,T=E;y<T;y+=3){const S=o.getX(y),M=o.getX(y+1),b=o.getX(y+2);s=sa(this,f,e,i,c,d,u,S,M,b),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);for(let p=g,f=_;p<f;p+=3){const w=o.getX(p),E=o.getX(p+1),y=o.getX(p+2);s=sa(this,r,e,i,c,d,u,w,E,y),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let g=0,_=h.length;g<_;g++){const p=h[g],f=r[p.materialIndex],w=Math.max(p.start,m.start),E=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let y=w,T=E;y<T;y+=3){const S=y,M=y+1,b=y+2;s=sa(this,f,e,i,c,d,u,S,M,b),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let p=g,f=_;p<f;p+=3){const w=p,E=p+1,y=p+2;s=sa(this,r,e,i,c,d,u,w,E,y),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function Ah(n,e,t,i,s,a,r,o){let l;if(e.side===Qt?l=i.intersectTriangle(r,a,s,!0,o):l=i.intersectTriangle(s,a,r,e.side===ei,o),l===null)return null;ia.copy(o),ia.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(ia);return c<t.near||c>t.far?null:{distance:c,point:ia.clone(),object:n}}function sa(n,e,t,i,s,a,r,o,l,c){n.getVertexPosition(o,Qs),n.getVertexPosition(l,ea),n.getVertexPosition(c,ta);const d=Ah(n,e,t,i,Qs,ea,ta,wl);if(d){const u=new U;un.getBarycoord(wl,Qs,ea,ta,u),s&&(d.uv=un.getInterpolatedAttribute(s,o,l,c,u,new ae)),a&&(d.uv1=un.getInterpolatedAttribute(a,o,l,c,u,new ae)),r&&(d.normal=un.getInterpolatedAttribute(r,o,l,c,u,new U),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new U,materialIndex:0};un.getNormal(Qs,ea,ta,h.normal),d.face=h,d.barycoord=u}return d}class Tt extends Bt{constructor(e=1,t=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const l=[],c=[],d=[],u=[];let h=0,m=0;g("z","y","x",-1,-1,i,t,e,r,a,0),g("z","y","x",1,-1,i,t,-e,r,a,1),g("x","z","y",1,1,e,i,t,s,r,2),g("x","z","y",1,-1,e,i,-t,s,r,3),g("x","y","z",1,-1,e,t,i,s,a,4),g("x","y","z",-1,-1,e,t,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new ut(c,3)),this.setAttribute("normal",new ut(d,3)),this.setAttribute("uv",new ut(u,2));function g(_,p,f,w,E,y,T,S,M,b,x){const v=y/M,A=T/b,I=y/2,P=T/2,O=S/2,N=M+1,z=b+1;let B=0,H=0;const Y=new U;for(let de=0;de<z;de++){const ge=de*A-P;for(let Ue=0;Ue<N;Ue++){const He=Ue*v-I;Y[_]=He*w,Y[p]=ge*E,Y[f]=O,c.push(Y.x,Y.y,Y.z),Y[_]=0,Y[p]=0,Y[f]=S>0?1:-1,d.push(Y.x,Y.y,Y.z),u.push(Ue/M),u.push(1-de/b),B+=1}}for(let de=0;de<b;de++)for(let ge=0;ge<M;ge++){const Ue=h+ge+N*de,He=h+ge+N*(de+1),We=h+(ge+1)+N*(de+1),it=h+(ge+1)+N*de;l.push(Ue,He,it),l.push(He,We,it),H+=6}o.addGroup(m,H,x),m+=H,h+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Tt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ki(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Yt(n){const e={};for(let t=0;t<n.length;t++){const i=Ki(n[t]);for(const s in i)e[s]=i[s]}return e}function Ch(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Kc(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:rt.workingColorSpace}const Rh={clone:Ki,merge:Yt};var Ph=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Lh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ti extends ss{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ph,this.fragmentShader=Lh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ki(e.uniforms),this.uniformsGroups=Ch(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Qc extends Dt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new mt,this.projectionMatrix=new mt,this.projectionMatrixInverse=new mt,this.coordinateSystem=En,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const qn=new U,Tl=new ae,Al=new ae;class dn extends Qc{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Eo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ss*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Eo*2*Math.atan(Math.tan(Ss*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(qn.x,qn.y).multiplyScalar(-e/qn.z),qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(qn.x,qn.y).multiplyScalar(-e/qn.z)}getViewSize(e,t){return this.getViewBounds(e,Tl,Al),t.subVectors(Al,Tl)}setViewOffset(e,t,i,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ss*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,t-=r.offsetY*i/c,s*=r.width/l,i*=r.height/c}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Oi=-90,zi=1;class Dh extends Dt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new dn(Oi,zi,e,t);s.layers=this.layers,this.add(s);const a=new dn(Oi,zi,e,t);a.layers=this.layers,this.add(a);const r=new dn(Oi,zi,e,t);r.layers=this.layers,this.add(r);const o=new dn(Oi,zi,e,t);o.layers=this.layers,this.add(o);const l=new dn(Oi,zi,e,t);l.layers=this.layers,this.add(l);const c=new dn(Oi,zi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,a,r,o,l]=t;for(const c of t)this.remove(c);if(e===En)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Pa)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,l,c,d]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,a),e.setRenderTarget(i,1,s),e.render(t,r),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,d),e.setRenderTarget(u,h,m),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class ed extends en{constructor(e=[],t=Yi,i,s,a,r,o,l,c,d){super(e,t,i,s,a,r,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Ih extends Si{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new ed(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Tt(5,5,5),a=new ti({name:"CubemapFromEquirect",uniforms:Ki(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Qt,blending:Kn});a.uniforms.tEquirect.value=t;const r=new be(s,a),o=t.minFilter;return t.minFilter===yi&&(t.minFilter=Mn),new Dh(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,s);e.setRenderTarget(a)}}class gs extends Dt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Uh={type:"move"};class pr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new gs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new gs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new gs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,a=null,r=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){r=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,i),f=this._getHandJoint(c,_);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const d=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=d.position.distanceTo(u.position),m=.02,g=.005;c.inputState.pinching&&h>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Uh)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new gs;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Nh extends Dt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new vn,this.environmentIntensity=1,this.environmentRotation=new vn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const fr=new U,Fh=new U,Oh=new qe;class Zn{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=fr.subVectors(i,t).cross(Fh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(fr),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Oh.getNormalMatrix(e),s=this.coplanarPoint(fr).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const li=new za,zh=new ae(.5,.5),aa=new U;class Go{constructor(e=new Zn,t=new Zn,i=new Zn,s=new Zn,a=new Zn,r=new Zn){this.planes=[e,t,i,s,a,r]}set(e,t,i,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=En,i=!1){const s=this.planes,a=e.elements,r=a[0],o=a[1],l=a[2],c=a[3],d=a[4],u=a[5],h=a[6],m=a[7],g=a[8],_=a[9],p=a[10],f=a[11],w=a[12],E=a[13],y=a[14],T=a[15];if(s[0].setComponents(c-r,m-d,f-g,T-w).normalize(),s[1].setComponents(c+r,m+d,f+g,T+w).normalize(),s[2].setComponents(c+o,m+u,f+_,T+E).normalize(),s[3].setComponents(c-o,m-u,f-_,T-E).normalize(),i)s[4].setComponents(l,h,p,y).normalize(),s[5].setComponents(c-l,m-h,f-p,T-y).normalize();else if(s[4].setComponents(c-l,m-h,f-p,T-y).normalize(),t===En)s[5].setComponents(c+l,m+h,f+p,T+y).normalize();else if(t===Pa)s[5].setComponents(l,h,p,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(li)}intersectsSprite(e){li.center.set(0,0,0);const t=zh.distanceTo(e.center);return li.radius=.7071067811865476+t,li.applyMatrix4(e.matrixWorld),this.intersectsSphere(li)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(aa.x=s.normal.x>0?e.max.x:e.min.x,aa.y=s.normal.y>0?e.max.y:e.min.y,aa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(aa)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Qi extends ss{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Je(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Da=new U,Ia=new U,Cl=new mt,hs=new ka,ra=new za,mr=new U,Rl=new U;class On extends Dt{constructor(e=new Bt,t=new Qi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,a=t.count;s<a;s++)Da.fromBufferAttribute(t,s-1),Ia.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Da.distanceTo(Ia);e.setAttribute("lineDistance",new ut(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,a=e.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ra.copy(i.boundingSphere),ra.applyMatrix4(s),ra.radius+=a,e.ray.intersectsSphere(ra)===!1)return;Cl.copy(s).invert(),hs.copy(e.ray).applyMatrix4(Cl);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const m=Math.max(0,r.start),g=Math.min(d.count,r.start+r.count);for(let _=m,p=g-1;_<p;_+=c){const f=d.getX(_),w=d.getX(_+1),E=oa(this,e,hs,l,f,w,_);E&&t.push(E)}if(this.isLineLoop){const _=d.getX(g-1),p=d.getX(m),f=oa(this,e,hs,l,_,p,g-1);f&&t.push(f)}}else{const m=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let _=m,p=g-1;_<p;_+=c){const f=oa(this,e,hs,l,_,_+1,_);f&&t.push(f)}if(this.isLineLoop){const _=oa(this,e,hs,l,g-1,m,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function oa(n,e,t,i,s,a,r){const o=n.geometry.attributes.position;if(Da.fromBufferAttribute(o,s),Ia.fromBufferAttribute(o,a),t.distanceSqToSegment(Da,Ia,mr,Rl)>i)return;mr.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(mr);if(!(c<e.near||c>e.far))return{distance:c,point:Rl.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const Pl=new U,Ll=new U;class Ua extends On{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,a=t.count;s<a;s+=2)Pl.fromBufferAttribute(t,s),Ll.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Pl.distanceTo(Ll);e.setAttribute("lineDistance",new ut(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class td extends en{constructor(e,t,i=bi,s,a,r,o=_n,l=_n,c,d=Rs,u=1){if(d!==Rs&&d!==Ps)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:u};super(h,s,a,r,o,l,d,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new $o(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class nd extends en{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class $t extends Bt{constructor(e=1,t=1,i=1,s=32,a=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),a=Math.floor(a);const d=[],u=[],h=[],m=[];let g=0;const _=[],p=i/2;let f=0;w(),r===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(d),this.setAttribute("position",new ut(u,3)),this.setAttribute("normal",new ut(h,3)),this.setAttribute("uv",new ut(m,2));function w(){const y=new U,T=new U;let S=0;const M=(t-e)/i;for(let b=0;b<=a;b++){const x=[],v=b/a,A=v*(t-e)+e;for(let I=0;I<=s;I++){const P=I/s,O=P*l+o,N=Math.sin(O),z=Math.cos(O);T.x=A*N,T.y=-v*i+p,T.z=A*z,u.push(T.x,T.y,T.z),y.set(N,M,z).normalize(),h.push(y.x,y.y,y.z),m.push(P,1-v),x.push(g++)}_.push(x)}for(let b=0;b<s;b++)for(let x=0;x<a;x++){const v=_[x][b],A=_[x+1][b],I=_[x+1][b+1],P=_[x][b+1];(e>0||x!==0)&&(d.push(v,A,P),S+=3),(t>0||x!==a-1)&&(d.push(A,I,P),S+=3)}c.addGroup(f,S,0),f+=S}function E(y){const T=g,S=new ae,M=new U;let b=0;const x=y===!0?e:t,v=y===!0?1:-1;for(let I=1;I<=s;I++)u.push(0,p*v,0),h.push(0,v,0),m.push(.5,.5),g++;const A=g;for(let I=0;I<=s;I++){const O=I/s*l+o,N=Math.cos(O),z=Math.sin(O);M.x=x*z,M.y=p*v,M.z=x*N,u.push(M.x,M.y,M.z),h.push(0,v,0),S.x=N*.5+.5,S.y=z*.5*v+.5,m.push(S.x,S.y),g++}for(let I=0;I<s;I++){const P=T+I,O=A+I;y===!0?d.push(O,O+1,P):d.push(O+1,O,P),b+=3}c.addGroup(f,b,y===!0?1:2),f+=b}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $t(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Vo extends Bt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const a=[],r=[];o(s),c(i),d(),this.setAttribute("position",new ut(a,3)),this.setAttribute("normal",new ut(a.slice(),3)),this.setAttribute("uv",new ut(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(w){const E=new U,y=new U,T=new U;for(let S=0;S<t.length;S+=3)m(t[S+0],E),m(t[S+1],y),m(t[S+2],T),l(E,y,T,w)}function l(w,E,y,T){const S=T+1,M=[];for(let b=0;b<=S;b++){M[b]=[];const x=w.clone().lerp(y,b/S),v=E.clone().lerp(y,b/S),A=S-b;for(let I=0;I<=A;I++)I===0&&b===S?M[b][I]=x:M[b][I]=x.clone().lerp(v,I/A)}for(let b=0;b<S;b++)for(let x=0;x<2*(S-b)-1;x++){const v=Math.floor(x/2);x%2===0?(h(M[b][v+1]),h(M[b+1][v]),h(M[b][v])):(h(M[b][v+1]),h(M[b+1][v+1]),h(M[b+1][v]))}}function c(w){const E=new U;for(let y=0;y<a.length;y+=3)E.x=a[y+0],E.y=a[y+1],E.z=a[y+2],E.normalize().multiplyScalar(w),a[y+0]=E.x,a[y+1]=E.y,a[y+2]=E.z}function d(){const w=new U;for(let E=0;E<a.length;E+=3){w.x=a[E+0],w.y=a[E+1],w.z=a[E+2];const y=p(w)/2/Math.PI+.5,T=f(w)/Math.PI+.5;r.push(y,1-T)}g(),u()}function u(){for(let w=0;w<r.length;w+=6){const E=r[w+0],y=r[w+2],T=r[w+4],S=Math.max(E,y,T),M=Math.min(E,y,T);S>.9&&M<.1&&(E<.2&&(r[w+0]+=1),y<.2&&(r[w+2]+=1),T<.2&&(r[w+4]+=1))}}function h(w){a.push(w.x,w.y,w.z)}function m(w,E){const y=w*3;E.x=e[y+0],E.y=e[y+1],E.z=e[y+2]}function g(){const w=new U,E=new U,y=new U,T=new U,S=new ae,M=new ae,b=new ae;for(let x=0,v=0;x<a.length;x+=9,v+=6){w.set(a[x+0],a[x+1],a[x+2]),E.set(a[x+3],a[x+4],a[x+5]),y.set(a[x+6],a[x+7],a[x+8]),S.set(r[v+0],r[v+1]),M.set(r[v+2],r[v+3]),b.set(r[v+4],r[v+5]),T.copy(w).add(E).add(y).divideScalar(3);const A=p(T);_(S,v+0,w,A),_(M,v+2,E,A),_(b,v+4,y,A)}}function _(w,E,y,T){T<0&&w.x===1&&(r[E]=w.x-1),y.x===0&&y.z===0&&(r[E]=T/2/Math.PI+.5)}function p(w){return Math.atan2(w.z,-w.x)}function f(w){return Math.atan2(-w.y,Math.sqrt(w.x*w.x+w.z*w.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vo(e.vertices,e.indices,e.radius,e.details)}}const la=new U,ca=new U,gr=new U,da=new un;class wo extends Bt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const s=Math.pow(10,4),a=Math.cos(Ss*t),r=e.getIndex(),o=e.getAttribute("position"),l=r?r.count:o.count,c=[0,0,0],d=["a","b","c"],u=new Array(3),h={},m=[];for(let g=0;g<l;g+=3){r?(c[0]=r.getX(g),c[1]=r.getX(g+1),c[2]=r.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:_,b:p,c:f}=da;if(_.fromBufferAttribute(o,c[0]),p.fromBufferAttribute(o,c[1]),f.fromBufferAttribute(o,c[2]),da.getNormal(gr),u[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,u[1]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,u[2]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let w=0;w<3;w++){const E=(w+1)%3,y=u[w],T=u[E],S=da[d[w]],M=da[d[E]],b=`${y}_${T}`,x=`${T}_${y}`;x in h&&h[x]?(gr.dot(h[x].normal)<=a&&(m.push(S.x,S.y,S.z),m.push(M.x,M.y,M.z)),h[x]=null):b in h||(h[b]={index0:c[w],index1:c[E],normal:gr.clone()})}}for(const g in h)if(h[g]){const{index0:_,index1:p}=h[g];la.fromBufferAttribute(o,_),ca.fromBufferAttribute(o,p),m.push(la.x,la.y,la.z),m.push(ca.x,ca.y,ca.z)}this.setAttribute("position",new ut(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Cn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),a=0;t.push(0);for(let r=1;r<=e;r++)i=this.getPoint(r/e),a+=i.distanceTo(s),t.push(a),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const a=i.length;let r;t?r=t:r=e*i[a-1];let o=0,l=a-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=i[s]-r,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===r)return s/(a-1);const d=i[s],h=i[s+1]-d,m=(r-d)/h;return(s+m)/(a-1)}getTangent(e,t){let s=e-1e-4,a=e+1e-4;s<0&&(s=0),a>1&&(a=1);const r=this.getPoint(s),o=this.getPoint(a),l=t||(r.isVector2?new ae:new U);return l.copy(o).sub(r).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new U,s=[],a=[],r=[],o=new U,l=new mt;for(let m=0;m<=e;m++){const g=m/e;s[m]=this.getTangentAt(g,new U)}a[0]=new U,r[0]=new U;let c=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),h=Math.abs(s[0].z);d<=c&&(c=d,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),h<=c&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],o),r[0].crossVectors(s[0],a[0]);for(let m=1;m<=e;m++){if(a[m]=a[m-1].clone(),r[m]=r[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Ye(s[m-1].dot(s[m]),-1,1));a[m].applyMatrix4(l.makeRotationAxis(o,g))}r[m].crossVectors(s[m],a[m])}if(t===!0){let m=Math.acos(Ye(a[0].dot(a[e]),-1,1));m/=e,s[0].dot(o.crossVectors(a[0],a[e]))>0&&(m=-m);for(let g=1;g<=e;g++)a[g].applyMatrix4(l.makeRotationAxis(s[g],m*g)),r[g].crossVectors(s[g],a[g])}return{tangents:s,normals:a,binormals:r}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Wo extends Cn{constructor(e=0,t=0,i=1,s=1,a=0,r=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=r,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new ae){const i=t,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const r=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(r?a=0:a=s),this.aClockwise===!0&&!r&&(a===s?a=-s:a=a-s);const o=this.aStartAngle+e*a;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=l-this.aX,m=c-this.aY;l=h*d-m*u+this.aX,c=h*u+m*d+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class kh extends Wo{constructor(e,t,i,s,a,r){super(e,t,i,i,s,a,r),this.isArcCurve=!0,this.type="ArcCurve"}}function jo(){let n=0,e=0,t=0,i=0;function s(a,r,o,l){n=a,e=o,t=-3*a+3*r-2*o-l,i=2*a-2*r+o+l}return{initCatmullRom:function(a,r,o,l,c){s(r,o,c*(o-a),c*(l-r))},initNonuniformCatmullRom:function(a,r,o,l,c,d,u){let h=(r-a)/c-(o-a)/(c+d)+(o-r)/d,m=(o-r)/d-(l-r)/(d+u)+(l-o)/u;h*=d,m*=d,s(r,o,h,m)},calc:function(a){const r=a*a,o=r*a;return n+e*a+t*r+i*o}}}const ua=new U,_r=new jo,vr=new jo,xr=new jo;class Bh extends Cn{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new U){const i=t,s=this.points,a=s.length,r=(a-(this.closed?0:1))*e;let o=Math.floor(r),l=r-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/a)+1)*a:l===0&&o===a-1&&(o=a-2,l=1);let c,d;this.closed||o>0?c=s[(o-1)%a]:(ua.subVectors(s[0],s[1]).add(s[0]),c=ua);const u=s[o%a],h=s[(o+1)%a];if(this.closed||o+2<a?d=s[(o+2)%a]:(ua.subVectors(s[a-1],s[a-2]).add(s[a-1]),d=ua),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),m),_=Math.pow(u.distanceToSquared(h),m),p=Math.pow(h.distanceToSquared(d),m);_<1e-4&&(_=1),g<1e-4&&(g=_),p<1e-4&&(p=_),_r.initNonuniformCatmullRom(c.x,u.x,h.x,d.x,g,_,p),vr.initNonuniformCatmullRom(c.y,u.y,h.y,d.y,g,_,p),xr.initNonuniformCatmullRom(c.z,u.z,h.z,d.z,g,_,p)}else this.curveType==="catmullrom"&&(_r.initCatmullRom(c.x,u.x,h.x,d.x,this.tension),vr.initCatmullRom(c.y,u.y,h.y,d.y,this.tension),xr.initCatmullRom(c.z,u.z,h.z,d.z,this.tension));return i.set(_r.calc(l),vr.calc(l),xr.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new U().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Dl(n,e,t,i,s){const a=(i-e)*.5,r=(s-t)*.5,o=n*n,l=n*o;return(2*t-2*i+a+r)*l+(-3*t+3*i-2*a-r)*o+a*n+t}function $h(n,e){const t=1-n;return t*t*e}function Hh(n,e){return 2*(1-n)*n*e}function Gh(n,e){return n*n*e}function Ms(n,e,t,i){return $h(n,e)+Hh(n,t)+Gh(n,i)}function Vh(n,e){const t=1-n;return t*t*t*e}function Wh(n,e){const t=1-n;return 3*t*t*n*e}function jh(n,e){return 3*(1-n)*n*n*e}function qh(n,e){return n*n*n*e}function Es(n,e,t,i,s){return Vh(n,e)+Wh(n,t)+jh(n,i)+qh(n,s)}class id extends Cn{constructor(e=new ae,t=new ae,i=new ae,s=new ae){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new ae){const i=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(Es(e,s.x,a.x,r.x,o.x),Es(e,s.y,a.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Xh extends Cn{constructor(e=new U,t=new U,i=new U,s=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new U){const i=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(Es(e,s.x,a.x,r.x,o.x),Es(e,s.y,a.y,r.y,o.y),Es(e,s.z,a.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class sd extends Cn{constructor(e=new ae,t=new ae){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ae){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ae){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Yh extends Cn{constructor(e=new U,t=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new U){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new U){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ad extends Cn{constructor(e=new ae,t=new ae,i=new ae){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new ae){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(Ms(e,s.x,a.x,r.x),Ms(e,s.y,a.y,r.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Zh extends Cn{constructor(e=new U,t=new U,i=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new U){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(Ms(e,s.x,a.x,r.x),Ms(e,s.y,a.y,r.y),Ms(e,s.z,a.z,r.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class rd extends Cn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ae){const i=t,s=this.points,a=(s.length-1)*e,r=Math.floor(a),o=a-r,l=s[r===0?r:r-1],c=s[r],d=s[r>s.length-2?s.length-1:r+1],u=s[r>s.length-3?s.length-1:r+2];return i.set(Dl(o,l.x,c.x,d.x,u.x),Dl(o,l.y,c.y,d.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new ae().fromArray(s))}return this}}var To=Object.freeze({__proto__:null,ArcCurve:kh,CatmullRomCurve3:Bh,CubicBezierCurve:id,CubicBezierCurve3:Xh,EllipseCurve:Wo,LineCurve:sd,LineCurve3:Yh,QuadraticBezierCurve:ad,QuadraticBezierCurve3:Zh,SplineCurve:rd});class Jh extends Cn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new To[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const r=s[a]-i,o=this.curves[a],l=o.getLength(),c=l===0?0:1-r/l;return o.getPointAt(c,t)}a++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const r=a[s],o=r.isEllipseCurve?e*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?e*r.points.length:e,l=r.getPoints(o);for(let c=0;c<l.length;c++){const d=l[c];i&&i.equals(d)||(t.push(d),i=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new To[s.type]().fromJSON(s))}return this}}class Na extends Jh{constructor(e){super(),this.type="Path",this.currentPoint=new ae,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new sd(this.currentPoint.clone(),new ae(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const a=new ad(this.currentPoint.clone(),new ae(e,t),new ae(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,a,r){const o=new id(this.currentPoint.clone(),new ae(e,t),new ae(i,s),new ae(a,r));return this.curves.push(o),this.currentPoint.set(a,r),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new rd(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,a,r){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,s,a,r),this}absarc(e,t,i,s,a,r){return this.absellipse(e,t,i,i,s,a,r),this}ellipse(e,t,i,s,a,r,o,l){const c=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+c,t+d,i,s,a,r,o,l),this}absellipse(e,t,i,s,a,r,o,l){const c=new Wo(e,t,i,s,a,r,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const d=c.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Ta extends Na{constructor(e){super(e),this.uuid=is(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new Na().fromJSON(s))}return this}}function Kh(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let a=od(n,0,s,t,!0);const r=[];if(!a||a.next===a.prev)return r;let o,l,c;if(i&&(a=ip(n,e,a,t)),n.length>80*t){o=1/0,l=1/0;let d=-1/0,u=-1/0;for(let h=t;h<s;h+=t){const m=n[h],g=n[h+1];m<o&&(o=m),g<l&&(l=g),m>d&&(d=m),g>u&&(u=g)}c=Math.max(d-o,u-l),c=c!==0?32767/c:0}return Ds(a,r,t,o,l,c,0),r}function od(n,e,t,i,s){let a;if(s===fp(n,e,t,i)>0)for(let r=e;r<t;r+=i)a=Il(r/i|0,n[r],n[r+1],a);else for(let r=t-i;r>=e;r-=i)a=Il(r/i|0,n[r],n[r+1],a);return a&&es(a,a.next)&&(Us(a),a=a.next),a}function Mi(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(es(t,t.next)||At(t.prev,t,t.next)===0)){if(Us(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Ds(n,e,t,i,s,a,r){if(!n)return;!r&&a&&lp(n,i,s,a);let o=n;for(;n.prev!==n.next;){const l=n.prev,c=n.next;if(a?ep(n,i,s,a):Qh(n)){e.push(l.i,n.i,c.i),Us(n),n=c.next,o=c.next;continue}if(n=c,n===o){r?r===1?(n=tp(Mi(n),e),Ds(n,e,t,i,s,a,2)):r===2&&np(n,e,t,i,s,a):Ds(Mi(n),e,t,i,s,a,1);break}}}function Qh(n){const e=n.prev,t=n,i=n.next;if(At(e,t,i)>=0)return!1;const s=e.x,a=t.x,r=i.x,o=e.y,l=t.y,c=i.y,d=Math.min(s,a,r),u=Math.min(o,l,c),h=Math.max(s,a,r),m=Math.max(o,l,c);let g=i.next;for(;g!==e;){if(g.x>=d&&g.x<=h&&g.y>=u&&g.y<=m&&_s(s,o,a,l,r,c,g.x,g.y)&&At(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function ep(n,e,t,i){const s=n.prev,a=n,r=n.next;if(At(s,a,r)>=0)return!1;const o=s.x,l=a.x,c=r.x,d=s.y,u=a.y,h=r.y,m=Math.min(o,l,c),g=Math.min(d,u,h),_=Math.max(o,l,c),p=Math.max(d,u,h),f=Ao(m,g,e,t,i),w=Ao(_,p,e,t,i);let E=n.prevZ,y=n.nextZ;for(;E&&E.z>=f&&y&&y.z<=w;){if(E.x>=m&&E.x<=_&&E.y>=g&&E.y<=p&&E!==s&&E!==r&&_s(o,d,l,u,c,h,E.x,E.y)&&At(E.prev,E,E.next)>=0||(E=E.prevZ,y.x>=m&&y.x<=_&&y.y>=g&&y.y<=p&&y!==s&&y!==r&&_s(o,d,l,u,c,h,y.x,y.y)&&At(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;E&&E.z>=f;){if(E.x>=m&&E.x<=_&&E.y>=g&&E.y<=p&&E!==s&&E!==r&&_s(o,d,l,u,c,h,E.x,E.y)&&At(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;y&&y.z<=w;){if(y.x>=m&&y.x<=_&&y.y>=g&&y.y<=p&&y!==s&&y!==r&&_s(o,d,l,u,c,h,y.x,y.y)&&At(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function tp(n,e){let t=n;do{const i=t.prev,s=t.next.next;!es(i,s)&&cd(i,t,t.next,s)&&Is(i,s)&&Is(s,i)&&(e.push(i.i,t.i,s.i),Us(t),Us(t.next),t=n=s),t=t.next}while(t!==n);return Mi(t)}function np(n,e,t,i,s,a){let r=n;do{let o=r.next.next;for(;o!==r.prev;){if(r.i!==o.i&&up(r,o)){let l=dd(r,o);r=Mi(r,r.next),l=Mi(l,l.next),Ds(r,e,t,i,s,a,0),Ds(l,e,t,i,s,a,0);return}o=o.next}r=r.next}while(r!==n)}function ip(n,e,t,i){const s=[];for(let a=0,r=e.length;a<r;a++){const o=e[a]*i,l=a<r-1?e[a+1]*i:n.length,c=od(n,o,l,i,!1);c===c.next&&(c.steiner=!0),s.push(dp(c))}s.sort(sp);for(let a=0;a<s.length;a++)t=ap(s[a],t);return t}function sp(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function ap(n,e){const t=rp(n,e);if(!t)return e;const i=dd(t,n);return Mi(i,i.next),Mi(t,t.next)}function rp(n,e){let t=e;const i=n.x,s=n.y;let a=-1/0,r;if(es(n,t))return t;do{if(es(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=i&&u>a&&(a=u,r=t.x<t.next.x?t:t.next,u===i))return r}t=t.next}while(t!==e);if(!r)return null;const o=r,l=r.x,c=r.y;let d=1/0;t=r;do{if(i>=t.x&&t.x>=l&&i!==t.x&&ld(s<c?i:a,s,l,c,s<c?a:i,s,t.x,t.y)){const u=Math.abs(s-t.y)/(i-t.x);Is(t,n)&&(u<d||u===d&&(t.x>r.x||t.x===r.x&&op(r,t)))&&(r=t,d=u)}t=t.next}while(t!==o);return r}function op(n,e){return At(n.prev,n,e.prev)<0&&At(e.next,n,n.next)<0}function lp(n,e,t,i){let s=n;do s.z===0&&(s.z=Ao(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,cp(s)}function cp(n){let e,t=1;do{let i=n,s;n=null;let a=null;for(e=0;i;){e++;let r=i,o=0;for(let c=0;c<t&&(o++,r=r.nextZ,!!r);c++);let l=t;for(;o>0||l>0&&r;)o!==0&&(l===0||!r||i.z<=r.z)?(s=i,i=i.nextZ,o--):(s=r,r=r.nextZ,l--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;i=r}a.nextZ=null,t*=2}while(e>1);return n}function Ao(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function dp(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function ld(n,e,t,i,s,a,r,o){return(s-r)*(e-o)>=(n-r)*(a-o)&&(n-r)*(i-o)>=(t-r)*(e-o)&&(t-r)*(a-o)>=(s-r)*(i-o)}function _s(n,e,t,i,s,a,r,o){return!(n===r&&e===o)&&ld(n,e,t,i,s,a,r,o)}function up(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!hp(n,e)&&(Is(n,e)&&Is(e,n)&&pp(n,e)&&(At(n.prev,n,e.prev)||At(n,e.prev,e))||es(n,e)&&At(n.prev,n,n.next)>0&&At(e.prev,e,e.next)>0)}function At(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function es(n,e){return n.x===e.x&&n.y===e.y}function cd(n,e,t,i){const s=pa(At(n,e,t)),a=pa(At(n,e,i)),r=pa(At(t,i,n)),o=pa(At(t,i,e));return!!(s!==a&&r!==o||s===0&&ha(n,t,e)||a===0&&ha(n,i,e)||r===0&&ha(t,n,i)||o===0&&ha(t,e,i))}function ha(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function pa(n){return n>0?1:n<0?-1:0}function hp(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&cd(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Is(n,e){return At(n.prev,n,n.next)<0?At(n,e,n.next)>=0&&At(n,n.prev,e)>=0:At(n,e,n.prev)<0||At(n,n.next,e)<0}function pp(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,a=(n.y+e.y)/2;do t.y>a!=t.next.y>a&&t.next.y!==t.y&&s<(t.next.x-t.x)*(a-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function dd(n,e){const t=Co(n.i,n.x,n.y),i=Co(e.i,e.x,e.y),s=n.next,a=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,a.next=i,i.prev=a,i}function Il(n,e,t,i){const s=Co(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Us(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Co(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function fp(n,e,t,i){let s=0;for(let a=e,r=t-i;a<t;a+=i)s+=(n[r]-n[a])*(n[a+1]+n[r+1]),r=a;return s}class mp{static triangulate(e,t,i=2){return Kh(e,t,i)}}class Hi{static area(e){const t=e.length;let i=0;for(let s=t-1,a=0;a<t;s=a++)i+=e[s].x*e[a].y-e[a].x*e[s].y;return i*.5}static isClockWise(e){return Hi.area(e)<0}static triangulateShape(e,t){const i=[],s=[],a=[];Ul(e),Nl(i,e);let r=e.length;t.forEach(Ul);for(let l=0;l<t.length;l++)s.push(r),r+=t[l].length,Nl(i,t[l]);const o=mp.triangulate(i,s);for(let l=0;l<o.length;l+=3)a.push(o.slice(l,l+3));return a}}function Ul(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Nl(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class qo extends Bt{constructor(e=new Ta([new ae(.5,.5),new ae(-.5,.5),new ae(-.5,-.5),new ae(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,s=[],a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];r(c)}this.setAttribute("position",new ut(s,3)),this.setAttribute("uv",new ut(a,2)),this.computeVertexNormals();function r(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,d=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let h=t.bevelEnabled!==void 0?t.bevelEnabled:!0,m=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:m-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3;const f=t.extrudePath,w=t.UVGenerator!==void 0?t.UVGenerator:gp;let E,y=!1,T,S,M,b;f&&(E=f.getSpacedPoints(d),y=!0,h=!1,T=f.computeFrenetFrames(d,!1),S=new U,M=new U,b=new U),h||(p=0,m=0,g=0,_=0);const x=o.extractPoints(c);let v=x.shape;const A=x.holes;if(!Hi.isClockWise(v)){v=v.reverse();for(let ne=0,Q=A.length;ne<Q;ne++){const K=A[ne];Hi.isClockWise(K)&&(A[ne]=K.reverse())}}function P(ne){const K=10000000000000001e-36;let J=ne[0];for(let pe=1;pe<=ne.length;pe++){const se=pe%ne.length,fe=ne[se],Ge=fe.x-J.x,$e=fe.y-J.y,L=Ge*Ge+$e*$e,C=Math.max(Math.abs(fe.x),Math.abs(fe.y),Math.abs(J.x),Math.abs(J.y)),V=K*C*C;if(L<=V){ne.splice(se,1),pe--;continue}J=fe}}P(v),A.forEach(P);const O=A.length,N=v;for(let ne=0;ne<O;ne++){const Q=A[ne];v=v.concat(Q)}function z(ne,Q,K){return Q||console.error("THREE.ExtrudeGeometry: vec does not exist"),ne.clone().addScaledVector(Q,K)}const B=v.length;function H(ne,Q,K){let J,pe,se;const fe=ne.x-Q.x,Ge=ne.y-Q.y,$e=K.x-ne.x,L=K.y-ne.y,C=fe*fe+Ge*Ge,V=fe*L-Ge*$e;if(Math.abs(V)>Number.EPSILON){const q=Math.sqrt(C),te=Math.sqrt($e*$e+L*L),X=Q.x-Ge/q,Pe=Q.y+fe/q,ue=K.x-L/te,Ae=K.y+$e/te,Ce=((ue-X)*L-(Ae-Pe)*$e)/(fe*L-Ge*$e);J=X+fe*Ce-ne.x,pe=Pe+Ge*Ce-ne.y;const re=J*J+pe*pe;if(re<=2)return new ae(J,pe);se=Math.sqrt(re/2)}else{let q=!1;fe>Number.EPSILON?$e>Number.EPSILON&&(q=!0):fe<-Number.EPSILON?$e<-Number.EPSILON&&(q=!0):Math.sign(Ge)===Math.sign(L)&&(q=!0),q?(J=-Ge,pe=fe,se=Math.sqrt(C)):(J=fe,pe=Ge,se=Math.sqrt(C/2))}return new ae(J/se,pe/se)}const Y=[];for(let ne=0,Q=N.length,K=Q-1,J=ne+1;ne<Q;ne++,K++,J++)K===Q&&(K=0),J===Q&&(J=0),Y[ne]=H(N[ne],N[K],N[J]);const de=[];let ge,Ue=Y.concat();for(let ne=0,Q=O;ne<Q;ne++){const K=A[ne];ge=[];for(let J=0,pe=K.length,se=pe-1,fe=J+1;J<pe;J++,se++,fe++)se===pe&&(se=0),fe===pe&&(fe=0),ge[J]=H(K[J],K[se],K[fe]);de.push(ge),Ue=Ue.concat(ge)}let He;if(p===0)He=Hi.triangulateShape(N,A);else{const ne=[],Q=[];for(let K=0;K<p;K++){const J=K/p,pe=m*Math.cos(J*Math.PI/2),se=g*Math.sin(J*Math.PI/2)+_;for(let fe=0,Ge=N.length;fe<Ge;fe++){const $e=z(N[fe],Y[fe],se);De($e.x,$e.y,-pe),J===0&&ne.push($e)}for(let fe=0,Ge=O;fe<Ge;fe++){const $e=A[fe];ge=de[fe];const L=[];for(let C=0,V=$e.length;C<V;C++){const q=z($e[C],ge[C],se);De(q.x,q.y,-pe),J===0&&L.push(q)}J===0&&Q.push(L)}}He=Hi.triangulateShape(ne,Q)}const We=He.length,it=g+_;for(let ne=0;ne<B;ne++){const Q=h?z(v[ne],Ue[ne],it):v[ne];y?(M.copy(T.normals[0]).multiplyScalar(Q.x),S.copy(T.binormals[0]).multiplyScalar(Q.y),b.copy(E[0]).add(M).add(S),De(b.x,b.y,b.z)):De(Q.x,Q.y,0)}for(let ne=1;ne<=d;ne++)for(let Q=0;Q<B;Q++){const K=h?z(v[Q],Ue[Q],it):v[Q];y?(M.copy(T.normals[ne]).multiplyScalar(K.x),S.copy(T.binormals[ne]).multiplyScalar(K.y),b.copy(E[ne]).add(M).add(S),De(b.x,b.y,b.z)):De(K.x,K.y,u/d*ne)}for(let ne=p-1;ne>=0;ne--){const Q=ne/p,K=m*Math.cos(Q*Math.PI/2),J=g*Math.sin(Q*Math.PI/2)+_;for(let pe=0,se=N.length;pe<se;pe++){const fe=z(N[pe],Y[pe],J);De(fe.x,fe.y,u+K)}for(let pe=0,se=A.length;pe<se;pe++){const fe=A[pe];ge=de[pe];for(let Ge=0,$e=fe.length;Ge<$e;Ge++){const L=z(fe[Ge],ge[Ge],J);y?De(L.x,L.y+E[d-1].y,E[d-1].x+K):De(L.x,L.y,u+K)}}}Z(),ie();function Z(){const ne=s.length/3;if(h){let Q=0,K=B*Q;for(let J=0;J<We;J++){const pe=He[J];Te(pe[2]+K,pe[1]+K,pe[0]+K)}Q=d+p*2,K=B*Q;for(let J=0;J<We;J++){const pe=He[J];Te(pe[0]+K,pe[1]+K,pe[2]+K)}}else{for(let Q=0;Q<We;Q++){const K=He[Q];Te(K[2],K[1],K[0])}for(let Q=0;Q<We;Q++){const K=He[Q];Te(K[0]+B*d,K[1]+B*d,K[2]+B*d)}}i.addGroup(ne,s.length/3-ne,0)}function ie(){const ne=s.length/3;let Q=0;Me(N,Q),Q+=N.length;for(let K=0,J=A.length;K<J;K++){const pe=A[K];Me(pe,Q),Q+=pe.length}i.addGroup(ne,s.length/3-ne,1)}function Me(ne,Q){let K=ne.length;for(;--K>=0;){const J=K;let pe=K-1;pe<0&&(pe=ne.length-1);for(let se=0,fe=d+p*2;se<fe;se++){const Ge=B*se,$e=B*(se+1),L=Q+J+Ge,C=Q+pe+Ge,V=Q+pe+$e,q=Q+J+$e;Ke(L,C,V,q)}}}function De(ne,Q,K){l.push(ne),l.push(Q),l.push(K)}function Te(ne,Q,K){xt(ne),xt(Q),xt(K);const J=s.length/3,pe=w.generateTopUV(i,s,J-3,J-2,J-1);F(pe[0]),F(pe[1]),F(pe[2])}function Ke(ne,Q,K,J){xt(ne),xt(Q),xt(J),xt(Q),xt(K),xt(J);const pe=s.length/3,se=w.generateSideWallUV(i,s,pe-6,pe-3,pe-2,pe-1);F(se[0]),F(se[1]),F(se[3]),F(se[1]),F(se[2]),F(se[3])}function xt(ne){s.push(l[ne*3+0]),s.push(l[ne*3+1]),s.push(l[ne*3+2])}function F(ne){a.push(ne.x),a.push(ne.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return _p(t,i,e)}static fromJSON(e,t){const i=[];for(let a=0,r=e.shapes.length;a<r;a++){const o=t[e.shapes[a]];i.push(o)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new To[s.type]().fromJSON(s)),new qo(i,e.options)}}const gp={generateTopUV:function(n,e,t,i,s){const a=e[t*3],r=e[t*3+1],o=e[i*3],l=e[i*3+1],c=e[s*3],d=e[s*3+1];return[new ae(a,r),new ae(o,l),new ae(c,d)]},generateSideWallUV:function(n,e,t,i,s,a){const r=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[i*3],d=e[i*3+1],u=e[i*3+2],h=e[s*3],m=e[s*3+1],g=e[s*3+2],_=e[a*3],p=e[a*3+1],f=e[a*3+2];return Math.abs(o-d)<Math.abs(r-c)?[new ae(r,1-l),new ae(c,1-u),new ae(h,1-g),new ae(_,1-f)]:[new ae(o,1-l),new ae(d,1-u),new ae(m,1-g),new ae(p,1-f)]}};function _p(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const a=n[i];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Gi extends Vo{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Gi(e.radius,e.detail)}}class zs extends Bt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,d=l+1,u=e/o,h=t/l,m=[],g=[],_=[],p=[];for(let f=0;f<d;f++){const w=f*h-r;for(let E=0;E<c;E++){const y=E*u-a;g.push(y,-w,0),_.push(0,0,1),p.push(E/o),p.push(1-f/l)}}for(let f=0;f<l;f++)for(let w=0;w<o;w++){const E=w+c*f,y=w+c*(f+1),T=w+1+c*(f+1),S=w+1+c*f;m.push(E,y,S),m.push(y,T,S)}this.setIndex(m),this.setAttribute("position",new ut(g,3)),this.setAttribute("normal",new ut(_,3)),this.setAttribute("uv",new ut(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zs(e.width,e.height,e.widthSegments,e.heightSegments)}}class ks extends Bt{constructor(e=1,t=32,i=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(r+o,Math.PI);let c=0;const d=[],u=new U,h=new U,m=[],g=[],_=[],p=[];for(let f=0;f<=i;f++){const w=[],E=f/i;let y=0;f===0&&r===0?y=.5/t:f===i&&l===Math.PI&&(y=-.5/t);for(let T=0;T<=t;T++){const S=T/t;u.x=-e*Math.cos(s+S*a)*Math.sin(r+E*o),u.y=e*Math.cos(r+E*o),u.z=e*Math.sin(s+S*a)*Math.sin(r+E*o),g.push(u.x,u.y,u.z),h.copy(u).normalize(),_.push(h.x,h.y,h.z),p.push(S+y,1-E),w.push(c++)}d.push(w)}for(let f=0;f<i;f++)for(let w=0;w<t;w++){const E=d[f][w+1],y=d[f][w],T=d[f+1][w],S=d[f+1][w+1];(f!==0||r>0)&&m.push(E,y,S),(f!==i-1||l<Math.PI)&&m.push(y,T,S)}this.setIndex(m),this.setAttribute("position",new ut(g,3)),this.setAttribute("normal",new ut(_,3)),this.setAttribute("uv",new ut(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ks(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class gi extends Bt{constructor(e=1,t=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const r=[],o=[],l=[],c=[],d=new U,u=new U,h=new U;for(let m=0;m<=i;m++)for(let g=0;g<=s;g++){const _=g/s*a,p=m/i*Math.PI*2;u.x=(e+t*Math.cos(p))*Math.cos(_),u.y=(e+t*Math.cos(p))*Math.sin(_),u.z=t*Math.sin(p),o.push(u.x,u.y,u.z),d.x=e*Math.cos(_),d.y=e*Math.sin(_),h.subVectors(u,d).normalize(),l.push(h.x,h.y,h.z),c.push(g/s),c.push(m/i)}for(let m=1;m<=i;m++)for(let g=1;g<=s;g++){const _=(s+1)*m+g-1,p=(s+1)*(m-1)+g-1,f=(s+1)*(m-1)+g,w=(s+1)*m+g;r.push(_,p,w),r.push(p,f,w)}this.setIndex(r),this.setAttribute("position",new ut(o,3)),this.setAttribute("normal",new ut(l,3)),this.setAttribute("uv",new ut(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gi(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class vp extends ss{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Je(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Je(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Wc,this.normalScale=new ae(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class xp extends ss{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ju,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class yp extends ss{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class ud extends Dt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Je(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class bp extends ud{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Je(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const yr=new mt,Fl=new U,Ol=new U;class Sp{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ae(512,512),this.mapType=Tn,this.map=null,this.mapPass=null,this.matrix=new mt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Go,this._frameExtents=new ae(1,1),this._viewportCount=1,this._viewports=[new Rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Fl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Fl),Ol.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ol),t.updateMatrixWorld(),yr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yr,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(yr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class hd extends Qc{constructor(e=-1,t=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-e,r=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Mp extends Sp{constructor(){super(new hd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ep extends ud{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.target=new Dt,this.shadow=new Mp}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class wp extends dn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const zl=new mt;class pd{constructor(e,t,i=0,s=1/0){this.ray=new ka(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Ho,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return zl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(zl),this}intersectObject(e,t=!0,i=[]){return Ro(e,this,i,t),i.sort(kl),i}intersectObjects(e,t=!0,i=[]){for(let s=0,a=e.length;s<a;s++)Ro(e[s],this,i,t);return i.sort(kl),i}}function kl(n,e){return n.distance-e.distance}function Ro(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let r=0,o=a.length;r<o;r++)Ro(a[r],e,t,!0)}}class Bl{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ye(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Ye(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Tp extends Ua{constructor(e=10,t=10,i=4473924,s=8947848){i=new Je(i),s=new Je(s);const a=t/2,r=e/t,o=e/2,l=[],c=[];for(let h=0,m=0,g=-o;h<=t;h++,g+=r){l.push(-o,0,g,o,0,g),l.push(g,0,-o,g,0,o);const _=h===a?i:s;_.toArray(c,m),m+=3,_.toArray(c,m),m+=3,_.toArray(c,m),m+=3,_.toArray(c,m),m+=3}const d=new Bt;d.setAttribute("position",new ut(l,3)),d.setAttribute("color",new ut(c,3));const u=new Qi({vertexColors:!0,toneMapped:!1});super(d,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class Ap extends Ua{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Bt;s.setAttribute("position",new ut(t,3)),s.setAttribute("color",new ut(i,3));const a=new Qi({vertexColors:!0,toneMapped:!1});super(s,a),this.type="AxesHelper"}setColors(e,t,i){const s=new Je,a=this.geometry.attributes.color.array;return s.set(e),s.toArray(a,0),s.toArray(a,3),s.set(t),s.toArray(a,6),s.toArray(a,9),s.set(i),s.toArray(a,12),s.toArray(a,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class fd extends Ei{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function $l(n,e,t,i){const s=Cp(i);switch(t){case $c:return n*e;case Gc:return n*e/s.components*s.byteLength;case zo:return n*e/s.components*s.byteLength;case Vc:return n*e*2/s.components*s.byteLength;case ko:return n*e*2/s.components*s.byteLength;case Hc:return n*e*3/s.components*s.byteLength;case gn:return n*e*4/s.components*s.byteLength;case Bo:return n*e*4/s.components*s.byteLength;case Sa:case Ma:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ea:case wa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Zr:case Kr:return Math.max(n,16)*Math.max(e,8)/4;case Yr:case Jr:return Math.max(n,8)*Math.max(e,8)/2;case Qr:case eo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case to:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case no:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case io:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case so:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case ao:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case ro:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case oo:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case lo:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case co:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case uo:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case ho:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case po:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case fo:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case mo:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case go:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case _o:case vo:case xo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case yo:case bo:return Math.ceil(n/4)*Math.ceil(e/4)*8;case So:case Mo:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Cp(n){switch(n){case Tn:case Oc:return{byteLength:1,components:1};case As:case zc:case Fs:return{byteLength:2,components:1};case Fo:case Oo:return{byteLength:2,components:4};case bi:case No:case zn:return{byteLength:4,components:1};case kc:case Bc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Uo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Uo);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function md(){let n=null,e=!1,t=null,i=null;function s(a,r){t(a,r),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function Rp(n){const e=new WeakMap;function t(o,l){const c=o.array,d=o.usage,u=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,d),o.onUploadCallback();let m;if(c instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=n.SHORT;else if(c instanceof Uint32Array)m=n.UNSIGNED_INT;else if(c instanceof Int32Array)m=n.INT;else if(c instanceof Int8Array)m=n.BYTE;else if(c instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const d=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,d);else{u.sort((m,g)=>m.start-g.start);let h=0;for(let m=1;m<u.length;m++){const g=u[h],_=u[m];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,u[h]=_)}u.length=h+1;for(let m=0,g=u.length;m<g;m++){const _=u[m];n.bufferSubData(c,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}var Pp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Lp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Dp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ip=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Up=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Np=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Fp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Op=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,zp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,kp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Bp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$p=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Hp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Gp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Vp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Wp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,jp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Xp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Yp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Zp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Jp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Kp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Qp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,ef=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,tf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,nf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,sf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,af=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,rf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,of="gl_FragColor = linearToOutputTexel( gl_FragColor );",lf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,cf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,df=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,uf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,hf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,pf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,ff=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,mf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,gf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,_f=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,vf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,xf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,yf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,bf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Sf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Mf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ef=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,wf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Tf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Af=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Cf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Rf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Pf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Lf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Df=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,If=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Uf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Nf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ff=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Of=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,zf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,kf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Bf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$f=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Gf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Vf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Wf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,qf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Yf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Zf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Qf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,em=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,nm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,im=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,am=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,rm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,om=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,dm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,um=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,hm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,pm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,fm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,mm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,gm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,_m=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,vm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,xm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,ym=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,bm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Sm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Mm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Em=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,wm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Tm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Am=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Cm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Rm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Pm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Lm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Im=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Um=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Om=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,zm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,km=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Bm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,$m=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Gm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Vm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Wm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ym=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Jm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Km=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,eg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,tg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ng=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ig=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,ag=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,og=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,lg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,cg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:Pp,alphahash_pars_fragment:Lp,alphamap_fragment:Dp,alphamap_pars_fragment:Ip,alphatest_fragment:Up,alphatest_pars_fragment:Np,aomap_fragment:Fp,aomap_pars_fragment:Op,batching_pars_vertex:zp,batching_vertex:kp,begin_vertex:Bp,beginnormal_vertex:$p,bsdfs:Hp,iridescence_fragment:Gp,bumpmap_pars_fragment:Vp,clipping_planes_fragment:Wp,clipping_planes_pars_fragment:jp,clipping_planes_pars_vertex:qp,clipping_planes_vertex:Xp,color_fragment:Yp,color_pars_fragment:Zp,color_pars_vertex:Jp,color_vertex:Kp,common:Qp,cube_uv_reflection_fragment:ef,defaultnormal_vertex:tf,displacementmap_pars_vertex:nf,displacementmap_vertex:sf,emissivemap_fragment:af,emissivemap_pars_fragment:rf,colorspace_fragment:of,colorspace_pars_fragment:lf,envmap_fragment:cf,envmap_common_pars_fragment:df,envmap_pars_fragment:uf,envmap_pars_vertex:hf,envmap_physical_pars_fragment:Mf,envmap_vertex:pf,fog_vertex:ff,fog_pars_vertex:mf,fog_fragment:gf,fog_pars_fragment:_f,gradientmap_pars_fragment:vf,lightmap_pars_fragment:xf,lights_lambert_fragment:yf,lights_lambert_pars_fragment:bf,lights_pars_begin:Sf,lights_toon_fragment:Ef,lights_toon_pars_fragment:wf,lights_phong_fragment:Tf,lights_phong_pars_fragment:Af,lights_physical_fragment:Cf,lights_physical_pars_fragment:Rf,lights_fragment_begin:Pf,lights_fragment_maps:Lf,lights_fragment_end:Df,logdepthbuf_fragment:If,logdepthbuf_pars_fragment:Uf,logdepthbuf_pars_vertex:Nf,logdepthbuf_vertex:Ff,map_fragment:Of,map_pars_fragment:zf,map_particle_fragment:kf,map_particle_pars_fragment:Bf,metalnessmap_fragment:$f,metalnessmap_pars_fragment:Hf,morphinstance_vertex:Gf,morphcolor_vertex:Vf,morphnormal_vertex:Wf,morphtarget_pars_vertex:jf,morphtarget_vertex:qf,normal_fragment_begin:Xf,normal_fragment_maps:Yf,normal_pars_fragment:Zf,normal_pars_vertex:Jf,normal_vertex:Kf,normalmap_pars_fragment:Qf,clearcoat_normal_fragment_begin:em,clearcoat_normal_fragment_maps:tm,clearcoat_pars_fragment:nm,iridescence_pars_fragment:im,opaque_fragment:sm,packing:am,premultiplied_alpha_fragment:rm,project_vertex:om,dithering_fragment:lm,dithering_pars_fragment:cm,roughnessmap_fragment:dm,roughnessmap_pars_fragment:um,shadowmap_pars_fragment:hm,shadowmap_pars_vertex:pm,shadowmap_vertex:fm,shadowmask_pars_fragment:mm,skinbase_vertex:gm,skinning_pars_vertex:_m,skinning_vertex:vm,skinnormal_vertex:xm,specularmap_fragment:ym,specularmap_pars_fragment:bm,tonemapping_fragment:Sm,tonemapping_pars_fragment:Mm,transmission_fragment:Em,transmission_pars_fragment:wm,uv_pars_fragment:Tm,uv_pars_vertex:Am,uv_vertex:Cm,worldpos_vertex:Rm,background_vert:Pm,background_frag:Lm,backgroundCube_vert:Dm,backgroundCube_frag:Im,cube_vert:Um,cube_frag:Nm,depth_vert:Fm,depth_frag:Om,distanceRGBA_vert:zm,distanceRGBA_frag:km,equirect_vert:Bm,equirect_frag:$m,linedashed_vert:Hm,linedashed_frag:Gm,meshbasic_vert:Vm,meshbasic_frag:Wm,meshlambert_vert:jm,meshlambert_frag:qm,meshmatcap_vert:Xm,meshmatcap_frag:Ym,meshnormal_vert:Zm,meshnormal_frag:Jm,meshphong_vert:Km,meshphong_frag:Qm,meshphysical_vert:eg,meshphysical_frag:tg,meshtoon_vert:ng,meshtoon_frag:ig,points_vert:sg,points_frag:ag,shadow_vert:rg,shadow_frag:og,sprite_vert:lg,sprite_frag:cg},_e={common:{diffuse:{value:new Je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new ae(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new Je(16777215)},opacity:{value:1},center:{value:new ae(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},Sn={basic:{uniforms:Yt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Yt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Je(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Yt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Je(0)},specular:{value:new Je(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Yt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new Je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Yt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new Je(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Yt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Yt([_e.points,_e.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Yt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Yt([_e.common,_e.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Yt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Yt([_e.sprite,_e.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:Yt([_e.common,_e.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:Yt([_e.lights,_e.fog,{color:{value:new Je(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};Sn.physical={uniforms:Yt([Sn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new ae(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new Je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new ae},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new Je(0)},specularColor:{value:new Je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new ae},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const fa={r:0,b:0,g:0},ci=new vn,dg=new mt;function ug(n,e,t,i,s,a,r){const o=new Je(0);let l=a===!0?0:1,c,d,u=null,h=0,m=null;function g(E){let y=E.isScene===!0?E.background:null;return y&&y.isTexture&&(y=(E.backgroundBlurriness>0?t:e).get(y)),y}function _(E){let y=!1;const T=g(E);T===null?f(o,l):T&&T.isColor&&(f(T,1),y=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function p(E,y){const T=g(y);T&&(T.isCubeTexture||T.mapping===Oa)?(d===void 0&&(d=new be(new Tt(1,1,1),new ti({name:"BackgroundCubeMaterial",uniforms:Ki(Sn.backgroundCube.uniforms),vertexShader:Sn.backgroundCube.vertexShader,fragmentShader:Sn.backgroundCube.fragmentShader,side:Qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(S,M,b){this.matrixWorld.copyPosition(b.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),ci.copy(y.backgroundRotation),ci.x*=-1,ci.y*=-1,ci.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(ci.y*=-1,ci.z*=-1),d.material.uniforms.envMap.value=T,d.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(dg.makeRotationFromEuler(ci)),d.material.toneMapped=rt.getTransfer(T.colorSpace)!==pt,(u!==T||h!==T.version||m!==n.toneMapping)&&(d.material.needsUpdate=!0,u=T,h=T.version,m=n.toneMapping),d.layers.enableAll(),E.unshift(d,d.geometry,d.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new be(new zs(2,2),new ti({name:"BackgroundMaterial",uniforms:Ki(Sn.background.uniforms),vertexShader:Sn.background.vertexShader,fragmentShader:Sn.background.fragmentShader,side:ei,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=rt.getTransfer(T.colorSpace)!==pt,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||h!==T.version||m!==n.toneMapping)&&(c.material.needsUpdate=!0,u=T,h=T.version,m=n.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function f(E,y){E.getRGB(fa,Kc(n)),i.buffers.color.setClear(fa.r,fa.g,fa.b,y,r)}function w(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(E,y=1){o.set(E),l=y,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,f(o,l)},render:_,addToRenderList:p,dispose:w}}function hg(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let a=s,r=!1;function o(v,A,I,P,O){let N=!1;const z=u(P,I,A);a!==z&&(a=z,c(a.object)),N=m(v,P,I,O),N&&g(v,P,I,O),O!==null&&e.update(O,n.ELEMENT_ARRAY_BUFFER),(N||r)&&(r=!1,y(v,A,I,P),O!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return n.createVertexArray()}function c(v){return n.bindVertexArray(v)}function d(v){return n.deleteVertexArray(v)}function u(v,A,I){const P=I.wireframe===!0;let O=i[v.id];O===void 0&&(O={},i[v.id]=O);let N=O[A.id];N===void 0&&(N={},O[A.id]=N);let z=N[P];return z===void 0&&(z=h(l()),N[P]=z),z}function h(v){const A=[],I=[],P=[];for(let O=0;O<t;O++)A[O]=0,I[O]=0,P[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:I,attributeDivisors:P,object:v,attributes:{},index:null}}function m(v,A,I,P){const O=a.attributes,N=A.attributes;let z=0;const B=I.getAttributes();for(const H in B)if(B[H].location>=0){const de=O[H];let ge=N[H];if(ge===void 0&&(H==="instanceMatrix"&&v.instanceMatrix&&(ge=v.instanceMatrix),H==="instanceColor"&&v.instanceColor&&(ge=v.instanceColor)),de===void 0||de.attribute!==ge||ge&&de.data!==ge.data)return!0;z++}return a.attributesNum!==z||a.index!==P}function g(v,A,I,P){const O={},N=A.attributes;let z=0;const B=I.getAttributes();for(const H in B)if(B[H].location>=0){let de=N[H];de===void 0&&(H==="instanceMatrix"&&v.instanceMatrix&&(de=v.instanceMatrix),H==="instanceColor"&&v.instanceColor&&(de=v.instanceColor));const ge={};ge.attribute=de,de&&de.data&&(ge.data=de.data),O[H]=ge,z++}a.attributes=O,a.attributesNum=z,a.index=P}function _(){const v=a.newAttributes;for(let A=0,I=v.length;A<I;A++)v[A]=0}function p(v){f(v,0)}function f(v,A){const I=a.newAttributes,P=a.enabledAttributes,O=a.attributeDivisors;I[v]=1,P[v]===0&&(n.enableVertexAttribArray(v),P[v]=1),O[v]!==A&&(n.vertexAttribDivisor(v,A),O[v]=A)}function w(){const v=a.newAttributes,A=a.enabledAttributes;for(let I=0,P=A.length;I<P;I++)A[I]!==v[I]&&(n.disableVertexAttribArray(I),A[I]=0)}function E(v,A,I,P,O,N,z){z===!0?n.vertexAttribIPointer(v,A,I,O,N):n.vertexAttribPointer(v,A,I,P,O,N)}function y(v,A,I,P){_();const O=P.attributes,N=I.getAttributes(),z=A.defaultAttributeValues;for(const B in N){const H=N[B];if(H.location>=0){let Y=O[B];if(Y===void 0&&(B==="instanceMatrix"&&v.instanceMatrix&&(Y=v.instanceMatrix),B==="instanceColor"&&v.instanceColor&&(Y=v.instanceColor)),Y!==void 0){const de=Y.normalized,ge=Y.itemSize,Ue=e.get(Y);if(Ue===void 0)continue;const He=Ue.buffer,We=Ue.type,it=Ue.bytesPerElement,Z=We===n.INT||We===n.UNSIGNED_INT||Y.gpuType===No;if(Y.isInterleavedBufferAttribute){const ie=Y.data,Me=ie.stride,De=Y.offset;if(ie.isInstancedInterleavedBuffer){for(let Te=0;Te<H.locationSize;Te++)f(H.location+Te,ie.meshPerAttribute);v.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Te=0;Te<H.locationSize;Te++)p(H.location+Te);n.bindBuffer(n.ARRAY_BUFFER,He);for(let Te=0;Te<H.locationSize;Te++)E(H.location+Te,ge/H.locationSize,We,de,Me*it,(De+ge/H.locationSize*Te)*it,Z)}else{if(Y.isInstancedBufferAttribute){for(let ie=0;ie<H.locationSize;ie++)f(H.location+ie,Y.meshPerAttribute);v.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let ie=0;ie<H.locationSize;ie++)p(H.location+ie);n.bindBuffer(n.ARRAY_BUFFER,He);for(let ie=0;ie<H.locationSize;ie++)E(H.location+ie,ge/H.locationSize,We,de,ge*it,ge/H.locationSize*ie*it,Z)}}else if(z!==void 0){const de=z[B];if(de!==void 0)switch(de.length){case 2:n.vertexAttrib2fv(H.location,de);break;case 3:n.vertexAttrib3fv(H.location,de);break;case 4:n.vertexAttrib4fv(H.location,de);break;default:n.vertexAttrib1fv(H.location,de)}}}}w()}function T(){b();for(const v in i){const A=i[v];for(const I in A){const P=A[I];for(const O in P)d(P[O].object),delete P[O];delete A[I]}delete i[v]}}function S(v){if(i[v.id]===void 0)return;const A=i[v.id];for(const I in A){const P=A[I];for(const O in P)d(P[O].object),delete P[O];delete A[I]}delete i[v.id]}function M(v){for(const A in i){const I=i[A];if(I[v.id]===void 0)continue;const P=I[v.id];for(const O in P)d(P[O].object),delete P[O];delete I[v.id]}}function b(){x(),r=!0,a!==s&&(a=s,c(a.object))}function x(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:b,resetDefaultState:x,dispose:T,releaseStatesOfGeometry:S,releaseStatesOfProgram:M,initAttributes:_,enableAttribute:p,disableUnusedAttributes:w}}function pg(n,e,t){let i;function s(c){i=c}function a(c,d){n.drawArrays(i,c,d),t.update(d,i,1)}function r(c,d,u){u!==0&&(n.drawArraysInstanced(i,c,d,u),t.update(d,i,u))}function o(c,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,u);let m=0;for(let g=0;g<u;g++)m+=d[g];t.update(m,i,1)}function l(c,d,u,h){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<c.length;g++)r(c[g],d[g],h[g]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,d,0,h,0,u);let g=0;for(let _=0;_<u;_++)g+=d[_]*h[_];t.update(g,i,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function fg(n,e,t,i){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const M=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(M.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(M){return!(M!==gn&&i.convert(M)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(M){const b=M===Fs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(M!==Tn&&i.convert(M)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&M!==zn&&!b)}function l(M){if(M==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";M="mediump"}return M==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const u=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),w=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),E=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:h,maxTextures:m,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:p,maxAttributes:f,maxVertexUniforms:w,maxVaryings:E,maxFragmentUniforms:y,vertexTextures:T,maxSamples:S}}function mg(n){const e=this;let t=null,i=0,s=!1,a=!1;const r=new Zn,o=new qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const m=u.length!==0||h||i!==0||s;return s=h,i=u.length,m},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,h){t=d(u,h,0)},this.setState=function(u,h,m){const g=u.clippingPlanes,_=u.clipIntersection,p=u.clipShadows,f=n.get(u);if(!s||g===null||g.length===0||a&&!p)a?d(null):c();else{const w=a?0:i,E=w*4;let y=f.clippingState||null;l.value=y,y=d(g,h,E,m);for(let T=0;T!==E;++T)y[T]=t[T];f.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=w}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(u,h,m,g){const _=u!==null?u.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const f=m+_*4,w=h.matrixWorldInverse;o.getNormalMatrix(w),(p===null||p.length<f)&&(p=new Float32Array(f));for(let E=0,y=m;E!==_;++E,y+=4)r.copy(u[E]).applyMatrix4(w,o),r.normal.toArray(p,y),p[y+3]=r.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}function gg(n){let e=new WeakMap;function t(r,o){return o===Wr?r.mapping=Yi:o===jr&&(r.mapping=Zi),r}function i(r){if(r&&r.isTexture){const o=r.mapping;if(o===Wr||o===jr)if(e.has(r)){const l=e.get(r).texture;return t(l,r.mapping)}else{const l=r.image;if(l&&l.height>0){const c=new Ih(l.height);return c.fromEquirectangularTexture(n,r),e.set(r,c),r.addEventListener("dispose",s),t(c.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function a(){e=new WeakMap}return{get:i,dispose:a}}const Vi=4,Hl=[.125,.215,.35,.446,.526,.582],_i=20,br=new hd,Gl=new Je;let Sr=null,Mr=0,Er=0,wr=!1;const pi=(1+Math.sqrt(5))/2,ki=1/pi,Vl=[new U(-pi,ki,0),new U(pi,ki,0),new U(-ki,0,pi),new U(ki,0,pi),new U(0,pi,-ki),new U(0,pi,ki),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)],_g=new U;class Wl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,a={}){const{size:r=256,position:o=_g}=a;Sr=this._renderer.getRenderTarget(),Mr=this._renderer.getActiveCubeFace(),Er=this._renderer.getActiveMipmapLevel(),wr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ql(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Sr,Mr,Er),this._renderer.xr.enabled=wr,e.scissorTest=!1,ma(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Yi||e.mapping===Zi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Sr=this._renderer.getRenderTarget(),Mr=this._renderer.getActiveCubeFace(),Er=this._renderer.getActiveMipmapLevel(),wr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Mn,minFilter:Mn,generateMipmaps:!1,type:Fs,format:gn,colorSpace:Ji,depthBuffer:!1},s=jl(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=jl(e,t,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=vg(a)),this._blurMaterial=xg(a,e,t)}return s}_compileMaterial(e){const t=new be(this._lodPlanes[0],e);this._renderer.compile(t,br)}_sceneToCubeUV(e,t,i,s,a){const l=new dn(90,1,t,i),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,m=u.toneMapping;u.getClearColor(Gl),u.toneMapping=Qn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const _=new Ba({name:"PMREM.Background",side:Qt,depthWrite:!1,depthTest:!1}),p=new be(new Tt,_);let f=!1;const w=e.background;w?w.isColor&&(_.color.copy(w),e.background=null,f=!0):(_.color.copy(Gl),f=!0);for(let E=0;E<6;E++){const y=E%3;y===0?(l.up.set(0,c[E],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+d[E],a.y,a.z)):y===1?(l.up.set(0,0,c[E]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+d[E],a.z)):(l.up.set(0,c[E],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+d[E]));const T=this._cubeSize;ma(s,y*T,E>2?T:0,T,T),u.setRenderTarget(s),f&&u.render(p,l),u.render(e,l)}p.geometry.dispose(),p.material.dispose(),u.toneMapping=m,u.autoClear=h,e.background=w}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Yi||e.mapping===Zi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ql());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new be(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=e;const l=this._cubeSize;ma(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(r,br)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=Vl[(s-a-1)%Vl.length];this._blur(e,a-1,a,r,o)}t.autoClear=i}_blur(e,t,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,s,"latitudinal",a),this._halfBlur(r,e,i,i,s,"longitudinal",a)}_halfBlur(e,t,i,s,a,r,o){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new be(this._lodPlanes[s],c),h=c.uniforms,m=this._sizeLods[i]-1,g=isFinite(a)?Math.PI/(2*m):2*Math.PI/(2*_i-1),_=a/g,p=isFinite(a)?1+Math.floor(d*_):_i;p>_i&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${_i}`);const f=[];let w=0;for(let M=0;M<_i;++M){const b=M/_,x=Math.exp(-b*b/2);f.push(x),M===0?w+=x:M<p&&(w+=2*x)}for(let M=0;M<f.length;M++)f[M]=f[M]/w;h.envMap.value=e.texture,h.samples.value=p,h.weights.value=f,h.latitudinal.value=r==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:E}=this;h.dTheta.value=g,h.mipInt.value=E-i;const y=this._sizeLods[s],T=3*y*(s>E-Vi?s-E+Vi:0),S=4*(this._cubeSize-y);ma(t,T,S,3*y,2*y),l.setRenderTarget(t),l.render(u,br)}}function vg(n){const e=[],t=[],i=[];let s=n;const a=n-Vi+1+Hl.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);t.push(o);let l=1/o;r>n-Vi?l=Hl[r-n+Vi-1]:r===0&&(l=0),i.push(l);const c=1/(o-2),d=-c,u=1+c,h=[d,d,u,d,u,u,d,d,u,u,d,u],m=6,g=6,_=3,p=2,f=1,w=new Float32Array(_*g*m),E=new Float32Array(p*g*m),y=new Float32Array(f*g*m);for(let S=0;S<m;S++){const M=S%3*2/3-1,b=S>2?0:-1,x=[M,b,0,M+2/3,b,0,M+2/3,b+1,0,M,b,0,M+2/3,b+1,0,M,b+1,0];w.set(x,_*g*S),E.set(h,p*g*S);const v=[S,S,S,S,S,S];y.set(v,f*g*S)}const T=new Bt;T.setAttribute("position",new wn(w,_)),T.setAttribute("uv",new wn(E,p)),T.setAttribute("faceIndex",new wn(y,f)),e.push(T),s>Vi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function jl(n,e,t){const i=new Si(n,e,t);return i.texture.mapping=Oa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ma(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function xg(n,e,t){const i=new Float32Array(_i),s=new U(0,1,0);return new ti({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function ql(){return new ti({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Xl(){return new ti({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Xo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function yg(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Wr||l===jr,d=l===Yi||l===Zi;if(c||d){let u=e.get(o);const h=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return t===null&&(t=new Wl(n)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const m=o.image;return c&&m&&m.height>0||d&&m&&s(m)?(t===null&&(t=new Wl(n)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",a),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function a(o){const l=o.target;l.removeEventListener("dispose",a);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function r(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:r}}function bg(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Ls("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Sg(n,e,t,i){const s={},a=new WeakMap;function r(u){const h=u.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",r),delete s[h.id];const m=a.get(h);m&&(e.remove(m),a.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(u,h){return s[h.id]===!0||(h.addEventListener("dispose",r),s[h.id]=!0,t.memory.geometries++),h}function l(u){const h=u.attributes;for(const m in h)e.update(h[m],n.ARRAY_BUFFER)}function c(u){const h=[],m=u.index,g=u.attributes.position;let _=0;if(m!==null){const w=m.array;_=m.version;for(let E=0,y=w.length;E<y;E+=3){const T=w[E+0],S=w[E+1],M=w[E+2];h.push(T,S,S,M,M,T)}}else if(g!==void 0){const w=g.array;_=g.version;for(let E=0,y=w.length/3-1;E<y;E+=3){const T=E+0,S=E+1,M=E+2;h.push(T,S,S,M,M,T)}}else return;const p=new(qc(h)?Jc:Zc)(h,1);p.version=_;const f=a.get(u);f&&e.remove(f),a.set(u,p)}function d(u){const h=a.get(u);if(h){const m=u.index;m!==null&&h.version<m.version&&c(u)}else c(u);return a.get(u)}return{get:o,update:l,getWireframeAttribute:d}}function Mg(n,e,t){let i;function s(h){i=h}let a,r;function o(h){a=h.type,r=h.bytesPerElement}function l(h,m){n.drawElements(i,m,a,h*r),t.update(m,i,1)}function c(h,m,g){g!==0&&(n.drawElementsInstanced(i,m,a,h*r,g),t.update(m,i,g))}function d(h,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,a,h,0,g);let p=0;for(let f=0;f<g;f++)p+=m[f];t.update(p,i,1)}function u(h,m,g,_){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<h.length;f++)c(h[f]/r,m[f],_[f]);else{p.multiDrawElementsInstancedWEBGL(i,m,0,a,h,0,_,0,g);let f=0;for(let w=0;w<g;w++)f+=m[w]*_[w];t.update(f,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function Eg(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(t.calls++,r){case n.TRIANGLES:t.triangles+=o*(a/3);break;case n.LINES:t.lines+=o*(a/2);break;case n.LINE_STRIP:t.lines+=o*(a-1);break;case n.LINE_LOOP:t.lines+=o*a;break;case n.POINTS:t.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function wg(n,e,t){const i=new WeakMap,s=new Rt;function a(r,o,l){const c=r.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let h=i.get(o);if(h===void 0||h.count!==u){let v=function(){b.dispose(),i.delete(o),o.removeEventListener("dispose",v)};var m=v;h!==void 0&&h.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],w=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let y=0;g===!0&&(y=1),_===!0&&(y=2),p===!0&&(y=3);let T=o.attributes.position.count*y,S=1;T>e.maxTextureSize&&(S=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const M=new Float32Array(T*S*4*u),b=new Xc(M,T,S,u);b.type=zn,b.needsUpdate=!0;const x=y*4;for(let A=0;A<u;A++){const I=f[A],P=w[A],O=E[A],N=T*S*4*A;for(let z=0;z<I.count;z++){const B=z*x;g===!0&&(s.fromBufferAttribute(I,z),M[N+B+0]=s.x,M[N+B+1]=s.y,M[N+B+2]=s.z,M[N+B+3]=0),_===!0&&(s.fromBufferAttribute(P,z),M[N+B+4]=s.x,M[N+B+5]=s.y,M[N+B+6]=s.z,M[N+B+7]=0),p===!0&&(s.fromBufferAttribute(O,z),M[N+B+8]=s.x,M[N+B+9]=s.y,M[N+B+10]=s.z,M[N+B+11]=O.itemSize===4?s.w:1)}}h={count:u,texture:b,size:new ae(T,S)},i.set(o,h),o.addEventListener("dispose",v)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",r.morphTexture,t);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:a}}function Tg(n,e,t,i){let s=new WeakMap;function a(l){const c=i.render.frame,d=l.geometry,u=e.get(l,d);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;s.get(h)!==c&&(h.update(),s.set(h,c))}return u}function r(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:a,dispose:r}}const gd=new en,Yl=new td(1,1),_d=new Xc,vd=new gh,xd=new ed,Zl=[],Jl=[],Kl=new Float32Array(16),Ql=new Float32Array(9),ec=new Float32Array(4);function as(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let a=Zl[s];if(a===void 0&&(a=new Float32Array(s),Zl[s]=a),e!==0){i.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,n[r].toArray(a,o)}return a}function Ft(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ot(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function $a(n,e){let t=Jl[e];t===void 0&&(t=new Int32Array(e),Jl[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Ag(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Cg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;n.uniform2fv(this.addr,e),Ot(t,e)}}function Rg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ft(t,e))return;n.uniform3fv(this.addr,e),Ot(t,e)}}function Pg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;n.uniform4fv(this.addr,e),Ot(t,e)}}function Lg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ft(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ot(t,e)}else{if(Ft(t,i))return;ec.set(i),n.uniformMatrix2fv(this.addr,!1,ec),Ot(t,i)}}function Dg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ft(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ot(t,e)}else{if(Ft(t,i))return;Ql.set(i),n.uniformMatrix3fv(this.addr,!1,Ql),Ot(t,i)}}function Ig(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ft(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ot(t,e)}else{if(Ft(t,i))return;Kl.set(i),n.uniformMatrix4fv(this.addr,!1,Kl),Ot(t,i)}}function Ug(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Ng(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;n.uniform2iv(this.addr,e),Ot(t,e)}}function Fg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;n.uniform3iv(this.addr,e),Ot(t,e)}}function Og(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;n.uniform4iv(this.addr,e),Ot(t,e)}}function zg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function kg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;n.uniform2uiv(this.addr,e),Ot(t,e)}}function Bg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;n.uniform3uiv(this.addr,e),Ot(t,e)}}function $g(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;n.uniform4uiv(this.addr,e),Ot(t,e)}}function Hg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Yl.compareFunction=jc,a=Yl):a=gd,t.setTexture2D(e||a,s)}function Gg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||vd,s)}function Vg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||xd,s)}function Wg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||_d,s)}function jg(n){switch(n){case 5126:return Ag;case 35664:return Cg;case 35665:return Rg;case 35666:return Pg;case 35674:return Lg;case 35675:return Dg;case 35676:return Ig;case 5124:case 35670:return Ug;case 35667:case 35671:return Ng;case 35668:case 35672:return Fg;case 35669:case 35673:return Og;case 5125:return zg;case 36294:return kg;case 36295:return Bg;case 36296:return $g;case 35678:case 36198:case 36298:case 36306:case 35682:return Hg;case 35679:case 36299:case 36307:return Gg;case 35680:case 36300:case 36308:case 36293:return Vg;case 36289:case 36303:case 36311:case 36292:return Wg}}function qg(n,e){n.uniform1fv(this.addr,e)}function Xg(n,e){const t=as(e,this.size,2);n.uniform2fv(this.addr,t)}function Yg(n,e){const t=as(e,this.size,3);n.uniform3fv(this.addr,t)}function Zg(n,e){const t=as(e,this.size,4);n.uniform4fv(this.addr,t)}function Jg(n,e){const t=as(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Kg(n,e){const t=as(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Qg(n,e){const t=as(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function e_(n,e){n.uniform1iv(this.addr,e)}function t_(n,e){n.uniform2iv(this.addr,e)}function n_(n,e){n.uniform3iv(this.addr,e)}function i_(n,e){n.uniform4iv(this.addr,e)}function s_(n,e){n.uniform1uiv(this.addr,e)}function a_(n,e){n.uniform2uiv(this.addr,e)}function r_(n,e){n.uniform3uiv(this.addr,e)}function o_(n,e){n.uniform4uiv(this.addr,e)}function l_(n,e,t){const i=this.cache,s=e.length,a=$a(t,s);Ft(i,a)||(n.uniform1iv(this.addr,a),Ot(i,a));for(let r=0;r!==s;++r)t.setTexture2D(e[r]||gd,a[r])}function c_(n,e,t){const i=this.cache,s=e.length,a=$a(t,s);Ft(i,a)||(n.uniform1iv(this.addr,a),Ot(i,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||vd,a[r])}function d_(n,e,t){const i=this.cache,s=e.length,a=$a(t,s);Ft(i,a)||(n.uniform1iv(this.addr,a),Ot(i,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||xd,a[r])}function u_(n,e,t){const i=this.cache,s=e.length,a=$a(t,s);Ft(i,a)||(n.uniform1iv(this.addr,a),Ot(i,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||_d,a[r])}function h_(n){switch(n){case 5126:return qg;case 35664:return Xg;case 35665:return Yg;case 35666:return Zg;case 35674:return Jg;case 35675:return Kg;case 35676:return Qg;case 5124:case 35670:return e_;case 35667:case 35671:return t_;case 35668:case 35672:return n_;case 35669:case 35673:return i_;case 5125:return s_;case 36294:return a_;case 36295:return r_;case 36296:return o_;case 35678:case 36198:case 36298:case 36306:case 35682:return l_;case 35679:case 36299:case 36307:return c_;case 35680:case 36300:case 36308:case 36293:return d_;case 36289:case 36303:case 36311:case 36292:return u_}}class p_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=jg(t.type)}}class f_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=h_(t.type)}}class m_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],i)}}}const Tr=/(\w+)(\])?(\[|\.)?/g;function tc(n,e){n.seq.push(e),n.map[e.id]=e}function g_(n,e,t){const i=n.name,s=i.length;for(Tr.lastIndex=0;;){const a=Tr.exec(i),r=Tr.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){tc(t,c===void 0?new p_(o,n,e):new f_(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new m_(o),tc(t,u)),t=u}}}class Aa{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=e.getActiveUniform(t,s),r=e.getUniformLocation(t,a.name);g_(a,r,this)}}setValue(e,t,i,s){const a=this.map[t];a!==void 0&&a.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&i.push(r)}return i}}function nc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const __=37297;let v_=0;function x_(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const ic=new qe;function y_(n){rt._getMatrix(ic,rt.workingColorSpace,n);const e=`mat3( ${ic.elements.map(t=>t.toFixed(4))} )`;switch(rt.getTransfer(n)){case Ra:return[e,"LinearTransferOETF"];case pt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function sc(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+x_(n.getShaderSource(e),o)}else return a}function b_(n,e){const t=y_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function S_(n,e){let t;switch(e){case Gu:t="Linear";break;case Vu:t="Reinhard";break;case Wu:t="Cineon";break;case ju:t="ACESFilmic";break;case Xu:t="AgX";break;case Yu:t="Neutral";break;case qu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ga=new U;function M_(){rt.getLuminanceCoefficients(ga);const n=ga.x.toFixed(4),e=ga.y.toFixed(4),t=ga.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function E_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vs).join(`
`)}function w_(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function T_(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(e,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:n.getAttribLocation(e,r),locationSize:o}}return t}function vs(n){return n!==""}function ac(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function rc(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const A_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Po(n){return n.replace(A_,R_)}const C_=new Map;function R_(n,e){let t=Xe[e];if(t===void 0){const i=C_.get(e);if(i!==void 0)t=Xe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Po(t)}const P_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function oc(n){return n.replace(P_,L_)}function L_(n,e,t,i){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function lc(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function D_(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Uc?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Su?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Fn&&(e="SHADOWMAP_TYPE_VSM"),e}function I_(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Yi:case Zi:e="ENVMAP_TYPE_CUBE";break;case Oa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function U_(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Zi:e="ENVMAP_MODE_REFRACTION";break}return e}function N_(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Nc:e="ENVMAP_BLENDING_MULTIPLY";break;case $u:e="ENVMAP_BLENDING_MIX";break;case Hu:e="ENVMAP_BLENDING_ADD";break}return e}function F_(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function O_(n,e,t,i){const s=n.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const l=D_(t),c=I_(t),d=U_(t),u=N_(t),h=F_(t),m=E_(t),g=w_(a),_=s.createProgram();let p,f,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(vs).join(`
`),p.length>0&&(p+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(vs).join(`
`),f.length>0&&(f+=`
`)):(p=[lc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vs).join(`
`),f=[lc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Qn?"#define TONE_MAPPING":"",t.toneMapping!==Qn?Xe.tonemapping_pars_fragment:"",t.toneMapping!==Qn?S_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,b_("linearToOutputTexel",t.outputColorSpace),M_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(vs).join(`
`)),r=Po(r),r=ac(r,t),r=rc(r,t),o=Po(o),o=ac(o,t),o=rc(o,t),r=oc(r),o=oc(o),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,f=["#define varying in",t.glslVersion===dl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===dl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const E=w+p+r,y=w+f+o,T=nc(s,s.VERTEX_SHADER,E),S=nc(s,s.FRAGMENT_SHADER,y);s.attachShader(_,T),s.attachShader(_,S),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function M(A){if(n.debug.checkShaderErrors){const I=s.getProgramInfoLog(_)||"",P=s.getShaderInfoLog(T)||"",O=s.getShaderInfoLog(S)||"",N=I.trim(),z=P.trim(),B=O.trim();let H=!0,Y=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(H=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,T,S);else{const de=sc(s,T,"vertex"),ge=sc(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+N+`
`+de+`
`+ge)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(z===""||B==="")&&(Y=!1);Y&&(A.diagnostics={runnable:H,programLog:N,vertexShader:{log:z,prefix:p},fragmentShader:{log:B,prefix:f}})}s.deleteShader(T),s.deleteShader(S),b=new Aa(s,_),x=T_(s,_)}let b;this.getUniforms=function(){return b===void 0&&M(this),b};let x;this.getAttributes=function(){return x===void 0&&M(this),x};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(_,__)),v},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=v_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=S,this}let z_=0;class k_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new B_(e),t.set(e,i)),i}}class B_{constructor(e){this.id=z_++,this.code=e,this.usedTimes=0}}function $_(n,e,t,i,s,a,r){const o=new Ho,l=new k_,c=new Set,d=[],u=s.logarithmicDepthBuffer,h=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(x){return c.add(x),x===0?"uv":`uv${x}`}function p(x,v,A,I,P){const O=I.fog,N=P.geometry,z=x.isMeshStandardMaterial?I.environment:null,B=(x.isMeshStandardMaterial?t:e).get(x.envMap||z),H=B&&B.mapping===Oa?B.image.height:null,Y=g[x.type];x.precision!==null&&(m=s.getMaxPrecision(x.precision),m!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",m,"instead."));const de=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,ge=de!==void 0?de.length:0;let Ue=0;N.morphAttributes.position!==void 0&&(Ue=1),N.morphAttributes.normal!==void 0&&(Ue=2),N.morphAttributes.color!==void 0&&(Ue=3);let He,We,it,Z;if(Y){const ct=Sn[Y];He=ct.vertexShader,We=ct.fragmentShader}else He=x.vertexShader,We=x.fragmentShader,l.update(x),it=l.getVertexShaderID(x),Z=l.getFragmentShaderID(x);const ie=n.getRenderTarget(),Me=n.state.buffers.depth.getReversed(),De=P.isInstancedMesh===!0,Te=P.isBatchedMesh===!0,Ke=!!x.map,xt=!!x.matcap,F=!!B,ne=!!x.aoMap,Q=!!x.lightMap,K=!!x.bumpMap,J=!!x.normalMap,pe=!!x.displacementMap,se=!!x.emissiveMap,fe=!!x.metalnessMap,Ge=!!x.roughnessMap,$e=x.anisotropy>0,L=x.clearcoat>0,C=x.dispersion>0,V=x.iridescence>0,q=x.sheen>0,te=x.transmission>0,X=$e&&!!x.anisotropyMap,Pe=L&&!!x.clearcoatMap,ue=L&&!!x.clearcoatNormalMap,Ae=L&&!!x.clearcoatRoughnessMap,Ce=V&&!!x.iridescenceMap,re=V&&!!x.iridescenceThicknessMap,ye=q&&!!x.sheenColorMap,ke=q&&!!x.sheenRoughnessMap,Le=!!x.specularMap,ve=!!x.specularColorMap,je=!!x.specularIntensityMap,k=te&&!!x.transmissionMap,ce=te&&!!x.thicknessMap,me=!!x.gradientMap,Ee=!!x.alphaMap,oe=x.alphaTest>0,ee=!!x.alphaHash,Re=!!x.extensions;let Ve=Qn;x.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(Ve=n.toneMapping);const yt={shaderID:Y,shaderType:x.type,shaderName:x.name,vertexShader:He,fragmentShader:We,defines:x.defines,customVertexShaderID:it,customFragmentShaderID:Z,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:m,batching:Te,batchingColor:Te&&P._colorsTexture!==null,instancing:De,instancingColor:De&&P.instanceColor!==null,instancingMorph:De&&P.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:ie===null?n.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:Ji,alphaToCoverage:!!x.alphaToCoverage,map:Ke,matcap:xt,envMap:F,envMapMode:F&&B.mapping,envMapCubeUVHeight:H,aoMap:ne,lightMap:Q,bumpMap:K,normalMap:J,displacementMap:h&&pe,emissiveMap:se,normalMapObjectSpace:J&&x.normalMapType===Qu,normalMapTangentSpace:J&&x.normalMapType===Wc,metalnessMap:fe,roughnessMap:Ge,anisotropy:$e,anisotropyMap:X,clearcoat:L,clearcoatMap:Pe,clearcoatNormalMap:ue,clearcoatRoughnessMap:Ae,dispersion:C,iridescence:V,iridescenceMap:Ce,iridescenceThicknessMap:re,sheen:q,sheenColorMap:ye,sheenRoughnessMap:ke,specularMap:Le,specularColorMap:ve,specularIntensityMap:je,transmission:te,transmissionMap:k,thicknessMap:ce,gradientMap:me,opaque:x.transparent===!1&&x.blending===ji&&x.alphaToCoverage===!1,alphaMap:Ee,alphaTest:oe,alphaHash:ee,combine:x.combine,mapUv:Ke&&_(x.map.channel),aoMapUv:ne&&_(x.aoMap.channel),lightMapUv:Q&&_(x.lightMap.channel),bumpMapUv:K&&_(x.bumpMap.channel),normalMapUv:J&&_(x.normalMap.channel),displacementMapUv:pe&&_(x.displacementMap.channel),emissiveMapUv:se&&_(x.emissiveMap.channel),metalnessMapUv:fe&&_(x.metalnessMap.channel),roughnessMapUv:Ge&&_(x.roughnessMap.channel),anisotropyMapUv:X&&_(x.anisotropyMap.channel),clearcoatMapUv:Pe&&_(x.clearcoatMap.channel),clearcoatNormalMapUv:ue&&_(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ae&&_(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&_(x.iridescenceMap.channel),iridescenceThicknessMapUv:re&&_(x.iridescenceThicknessMap.channel),sheenColorMapUv:ye&&_(x.sheenColorMap.channel),sheenRoughnessMapUv:ke&&_(x.sheenRoughnessMap.channel),specularMapUv:Le&&_(x.specularMap.channel),specularColorMapUv:ve&&_(x.specularColorMap.channel),specularIntensityMapUv:je&&_(x.specularIntensityMap.channel),transmissionMapUv:k&&_(x.transmissionMap.channel),thicknessMapUv:ce&&_(x.thicknessMap.channel),alphaMapUv:Ee&&_(x.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(J||$e),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!N.attributes.uv&&(Ke||Ee),fog:!!O,useFog:x.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Me,skinning:P.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:ge,morphTextureStride:Ue,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&A.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ve,decodeVideoTexture:Ke&&x.map.isVideoTexture===!0&&rt.getTransfer(x.map.colorSpace)===pt,decodeVideoTextureEmissive:se&&x.emissiveMap.isVideoTexture===!0&&rt.getTransfer(x.emissiveMap.colorSpace)===pt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===mn,flipSided:x.side===Qt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Re&&x.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Re&&x.extensions.multiDraw===!0||Te)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return yt.vertexUv1s=c.has(1),yt.vertexUv2s=c.has(2),yt.vertexUv3s=c.has(3),c.clear(),yt}function f(x){const v=[];if(x.shaderID?v.push(x.shaderID):(v.push(x.customVertexShaderID),v.push(x.customFragmentShaderID)),x.defines!==void 0)for(const A in x.defines)v.push(A),v.push(x.defines[A]);return x.isRawShaderMaterial===!1&&(w(v,x),E(v,x),v.push(n.outputColorSpace)),v.push(x.customProgramCacheKey),v.join()}function w(x,v){x.push(v.precision),x.push(v.outputColorSpace),x.push(v.envMapMode),x.push(v.envMapCubeUVHeight),x.push(v.mapUv),x.push(v.alphaMapUv),x.push(v.lightMapUv),x.push(v.aoMapUv),x.push(v.bumpMapUv),x.push(v.normalMapUv),x.push(v.displacementMapUv),x.push(v.emissiveMapUv),x.push(v.metalnessMapUv),x.push(v.roughnessMapUv),x.push(v.anisotropyMapUv),x.push(v.clearcoatMapUv),x.push(v.clearcoatNormalMapUv),x.push(v.clearcoatRoughnessMapUv),x.push(v.iridescenceMapUv),x.push(v.iridescenceThicknessMapUv),x.push(v.sheenColorMapUv),x.push(v.sheenRoughnessMapUv),x.push(v.specularMapUv),x.push(v.specularColorMapUv),x.push(v.specularIntensityMapUv),x.push(v.transmissionMapUv),x.push(v.thicknessMapUv),x.push(v.combine),x.push(v.fogExp2),x.push(v.sizeAttenuation),x.push(v.morphTargetsCount),x.push(v.morphAttributeCount),x.push(v.numDirLights),x.push(v.numPointLights),x.push(v.numSpotLights),x.push(v.numSpotLightMaps),x.push(v.numHemiLights),x.push(v.numRectAreaLights),x.push(v.numDirLightShadows),x.push(v.numPointLightShadows),x.push(v.numSpotLightShadows),x.push(v.numSpotLightShadowsWithMaps),x.push(v.numLightProbes),x.push(v.shadowMapType),x.push(v.toneMapping),x.push(v.numClippingPlanes),x.push(v.numClipIntersection),x.push(v.depthPacking)}function E(x,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),v.gradientMap&&o.enable(22),x.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reversedDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),x.push(o.mask)}function y(x){const v=g[x.type];let A;if(v){const I=Sn[v];A=Rh.clone(I.uniforms)}else A=x.uniforms;return A}function T(x,v){let A;for(let I=0,P=d.length;I<P;I++){const O=d[I];if(O.cacheKey===v){A=O,++A.usedTimes;break}}return A===void 0&&(A=new O_(n,v,x,a),d.push(A)),A}function S(x){if(--x.usedTimes===0){const v=d.indexOf(x);d[v]=d[d.length-1],d.pop(),x.destroy()}}function M(x){l.remove(x)}function b(){l.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:y,acquireProgram:T,releaseProgram:S,releaseShaderCache:M,programs:d,dispose:b}}function H_(){let n=new WeakMap;function e(r){return n.has(r)}function t(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,l){n.get(r)[o]=l}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:a}}function G_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function cc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function dc(){const n=[];let e=0;const t=[],i=[],s=[];function a(){e=0,t.length=0,i.length=0,s.length=0}function r(u,h,m,g,_,p){let f=n[e];return f===void 0?(f={id:u.id,object:u,geometry:h,material:m,groupOrder:g,renderOrder:u.renderOrder,z:_,group:p},n[e]=f):(f.id=u.id,f.object=u,f.geometry=h,f.material=m,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=p),e++,f}function o(u,h,m,g,_,p){const f=r(u,h,m,g,_,p);m.transmission>0?i.push(f):m.transparent===!0?s.push(f):t.push(f)}function l(u,h,m,g,_,p){const f=r(u,h,m,g,_,p);m.transmission>0?i.unshift(f):m.transparent===!0?s.unshift(f):t.unshift(f)}function c(u,h){t.length>1&&t.sort(u||G_),i.length>1&&i.sort(h||cc),s.length>1&&s.sort(h||cc)}function d(){for(let u=e,h=n.length;u<h;u++){const m=n[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:a,push:o,unshift:l,finish:d,sort:c}}function V_(){let n=new WeakMap;function e(i,s){const a=n.get(i);let r;return a===void 0?(r=new dc,n.set(i,[r])):s>=a.length?(r=new dc,a.push(r)):r=a[s],r}function t(){n=new WeakMap}return{get:e,dispose:t}}function W_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new U,color:new Je};break;case"SpotLight":t={position:new U,direction:new U,color:new Je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new U,color:new Je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new U,skyColor:new Je,groundColor:new Je};break;case"RectAreaLight":t={color:new Je,position:new U,halfWidth:new U,halfHeight:new U};break}return n[e.id]=t,t}}}function j_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let q_=0;function X_(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Y_(n){const e=new W_,t=j_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new U);const s=new U,a=new mt,r=new mt;function o(c){let d=0,u=0,h=0;for(let x=0;x<9;x++)i.probe[x].set(0,0,0);let m=0,g=0,_=0,p=0,f=0,w=0,E=0,y=0,T=0,S=0,M=0;c.sort(X_);for(let x=0,v=c.length;x<v;x++){const A=c[x],I=A.color,P=A.intensity,O=A.distance,N=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)d+=I.r*P,u+=I.g*P,h+=I.b*P;else if(A.isLightProbe){for(let z=0;z<9;z++)i.probe[z].addScaledVector(A.sh.coefficients[z],P);M++}else if(A.isDirectionalLight){const z=e.get(A);if(z.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const B=A.shadow,H=t.get(A);H.shadowIntensity=B.intensity,H.shadowBias=B.bias,H.shadowNormalBias=B.normalBias,H.shadowRadius=B.radius,H.shadowMapSize=B.mapSize,i.directionalShadow[m]=H,i.directionalShadowMap[m]=N,i.directionalShadowMatrix[m]=A.shadow.matrix,w++}i.directional[m]=z,m++}else if(A.isSpotLight){const z=e.get(A);z.position.setFromMatrixPosition(A.matrixWorld),z.color.copy(I).multiplyScalar(P),z.distance=O,z.coneCos=Math.cos(A.angle),z.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),z.decay=A.decay,i.spot[_]=z;const B=A.shadow;if(A.map&&(i.spotLightMap[T]=A.map,T++,B.updateMatrices(A),A.castShadow&&S++),i.spotLightMatrix[_]=B.matrix,A.castShadow){const H=t.get(A);H.shadowIntensity=B.intensity,H.shadowBias=B.bias,H.shadowNormalBias=B.normalBias,H.shadowRadius=B.radius,H.shadowMapSize=B.mapSize,i.spotShadow[_]=H,i.spotShadowMap[_]=N,y++}_++}else if(A.isRectAreaLight){const z=e.get(A);z.color.copy(I).multiplyScalar(P),z.halfWidth.set(A.width*.5,0,0),z.halfHeight.set(0,A.height*.5,0),i.rectArea[p]=z,p++}else if(A.isPointLight){const z=e.get(A);if(z.color.copy(A.color).multiplyScalar(A.intensity),z.distance=A.distance,z.decay=A.decay,A.castShadow){const B=A.shadow,H=t.get(A);H.shadowIntensity=B.intensity,H.shadowBias=B.bias,H.shadowNormalBias=B.normalBias,H.shadowRadius=B.radius,H.shadowMapSize=B.mapSize,H.shadowCameraNear=B.camera.near,H.shadowCameraFar=B.camera.far,i.pointShadow[g]=H,i.pointShadowMap[g]=N,i.pointShadowMatrix[g]=A.shadow.matrix,E++}i.point[g]=z,g++}else if(A.isHemisphereLight){const z=e.get(A);z.skyColor.copy(A.color).multiplyScalar(P),z.groundColor.copy(A.groundColor).multiplyScalar(P),i.hemi[f]=z,f++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=_e.LTC_FLOAT_1,i.rectAreaLTC2=_e.LTC_FLOAT_2):(i.rectAreaLTC1=_e.LTC_HALF_1,i.rectAreaLTC2=_e.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=h;const b=i.hash;(b.directionalLength!==m||b.pointLength!==g||b.spotLength!==_||b.rectAreaLength!==p||b.hemiLength!==f||b.numDirectionalShadows!==w||b.numPointShadows!==E||b.numSpotShadows!==y||b.numSpotMaps!==T||b.numLightProbes!==M)&&(i.directional.length=m,i.spot.length=_,i.rectArea.length=p,i.point.length=g,i.hemi.length=f,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.pointShadow.length=E,i.pointShadowMap.length=E,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=w,i.pointShadowMatrix.length=E,i.spotLightMatrix.length=y+T-S,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=M,b.directionalLength=m,b.pointLength=g,b.spotLength=_,b.rectAreaLength=p,b.hemiLength=f,b.numDirectionalShadows=w,b.numPointShadows=E,b.numSpotShadows=y,b.numSpotMaps=T,b.numLightProbes=M,i.version=q_++)}function l(c,d){let u=0,h=0,m=0,g=0,_=0;const p=d.matrixWorldInverse;for(let f=0,w=c.length;f<w;f++){const E=c[f];if(E.isDirectionalLight){const y=i.directional[u];y.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(p),u++}else if(E.isSpotLight){const y=i.spot[m];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(p),m++}else if(E.isRectAreaLight){const y=i.rectArea[g];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(p),r.identity(),a.copy(E.matrixWorld),a.premultiply(p),r.extractRotation(a),y.halfWidth.set(E.width*.5,0,0),y.halfHeight.set(0,E.height*.5,0),y.halfWidth.applyMatrix4(r),y.halfHeight.applyMatrix4(r),g++}else if(E.isPointLight){const y=i.point[h];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(p),h++}else if(E.isHemisphereLight){const y=i.hemi[_];y.direction.setFromMatrixPosition(E.matrixWorld),y.direction.transformDirection(p),_++}}}return{setup:o,setupView:l,state:i}}function uc(n){const e=new Y_(n),t=[],i=[];function s(d){c.camera=d,t.length=0,i.length=0}function a(d){t.push(d)}function r(d){i.push(d)}function o(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:a,pushShadow:r}}function Z_(n){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new uc(n),e.set(s,[o])):a>=r.length?(o=new uc(n),r.push(o)):o=r[a],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const J_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,K_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Q_(n,e,t){let i=new Go;const s=new ae,a=new ae,r=new Rt,o=new xp({depthPacking:Ku}),l=new yp,c={},d=t.maxTextureSize,u={[ei]:Qt,[Qt]:ei,[mn]:mn},h=new ti({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ae},radius:{value:4}},vertexShader:J_,fragmentShader:K_}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const g=new Bt;g.setAttribute("position",new wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new be(g,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Uc;let f=this.type;this.render=function(S,M,b){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||S.length===0)return;const x=n.getRenderTarget(),v=n.getActiveCubeFace(),A=n.getActiveMipmapLevel(),I=n.state;I.setBlending(Kn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const P=f!==Fn&&this.type===Fn,O=f===Fn&&this.type!==Fn;for(let N=0,z=S.length;N<z;N++){const B=S[N],H=B.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",B,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const Y=H.getFrameExtents();if(s.multiply(Y),a.copy(H.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(a.x=Math.floor(d/Y.x),s.x=a.x*Y.x,H.mapSize.x=a.x),s.y>d&&(a.y=Math.floor(d/Y.y),s.y=a.y*Y.y,H.mapSize.y=a.y)),H.map===null||P===!0||O===!0){const ge=this.type!==Fn?{minFilter:_n,magFilter:_n}:{};H.map!==null&&H.map.dispose(),H.map=new Si(s.x,s.y,ge),H.map.texture.name=B.name+".shadowMap",H.camera.updateProjectionMatrix()}n.setRenderTarget(H.map),n.clear();const de=H.getViewportCount();for(let ge=0;ge<de;ge++){const Ue=H.getViewport(ge);r.set(a.x*Ue.x,a.y*Ue.y,a.x*Ue.z,a.y*Ue.w),I.viewport(r),H.updateMatrices(B,ge),i=H.getFrustum(),y(M,b,H.camera,B,this.type)}H.isPointLightShadow!==!0&&this.type===Fn&&w(H,b),H.needsUpdate=!1}f=this.type,p.needsUpdate=!1,n.setRenderTarget(x,v,A)};function w(S,M){const b=e.update(_);h.defines.VSM_SAMPLES!==S.blurSamples&&(h.defines.VSM_SAMPLES=S.blurSamples,m.defines.VSM_SAMPLES=S.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Si(s.x,s.y)),h.uniforms.shadow_pass.value=S.map.texture,h.uniforms.resolution.value=S.mapSize,h.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(M,null,b,h,_,null),m.uniforms.shadow_pass.value=S.mapPass.texture,m.uniforms.resolution.value=S.mapSize,m.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(M,null,b,m,_,null)}function E(S,M,b,x){let v=null;const A=b.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(A!==void 0)v=A;else if(v=b.isPointLight===!0?l:o,n.localClippingEnabled&&M.clipShadows===!0&&Array.isArray(M.clippingPlanes)&&M.clippingPlanes.length!==0||M.displacementMap&&M.displacementScale!==0||M.alphaMap&&M.alphaTest>0||M.map&&M.alphaTest>0||M.alphaToCoverage===!0){const I=v.uuid,P=M.uuid;let O=c[I];O===void 0&&(O={},c[I]=O);let N=O[P];N===void 0&&(N=v.clone(),O[P]=N,M.addEventListener("dispose",T)),v=N}if(v.visible=M.visible,v.wireframe=M.wireframe,x===Fn?v.side=M.shadowSide!==null?M.shadowSide:M.side:v.side=M.shadowSide!==null?M.shadowSide:u[M.side],v.alphaMap=M.alphaMap,v.alphaTest=M.alphaToCoverage===!0?.5:M.alphaTest,v.map=M.map,v.clipShadows=M.clipShadows,v.clippingPlanes=M.clippingPlanes,v.clipIntersection=M.clipIntersection,v.displacementMap=M.displacementMap,v.displacementScale=M.displacementScale,v.displacementBias=M.displacementBias,v.wireframeLinewidth=M.wireframeLinewidth,v.linewidth=M.linewidth,b.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const I=n.properties.get(v);I.light=b}return v}function y(S,M,b,x,v){if(S.visible===!1)return;if(S.layers.test(M.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&v===Fn)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,S.matrixWorld);const P=e.update(S),O=S.material;if(Array.isArray(O)){const N=P.groups;for(let z=0,B=N.length;z<B;z++){const H=N[z],Y=O[H.materialIndex];if(Y&&Y.visible){const de=E(S,Y,x,v);S.onBeforeShadow(n,S,M,b,P,de,H),n.renderBufferDirect(b,null,P,de,S,H),S.onAfterShadow(n,S,M,b,P,de,H)}}}else if(O.visible){const N=E(S,O,x,v);S.onBeforeShadow(n,S,M,b,P,N,null),n.renderBufferDirect(b,null,P,N,S,null),S.onAfterShadow(n,S,M,b,P,N,null)}}const I=S.children;for(let P=0,O=I.length;P<O;P++)y(I[P],M,b,x,v)}function T(S){S.target.removeEventListener("dispose",T);for(const b in c){const x=c[b],v=S.target.uuid;v in x&&(x[v].dispose(),delete x[v])}}}const ev={[zr]:kr,[Br]:Gr,[$r]:Vr,[Xi]:Hr,[kr]:zr,[Gr]:Br,[Vr]:$r,[Hr]:Xi};function tv(n,e){function t(){let k=!1;const ce=new Rt;let me=null;const Ee=new Rt(0,0,0,0);return{setMask:function(oe){me!==oe&&!k&&(n.colorMask(oe,oe,oe,oe),me=oe)},setLocked:function(oe){k=oe},setClear:function(oe,ee,Re,Ve,yt){yt===!0&&(oe*=Ve,ee*=Ve,Re*=Ve),ce.set(oe,ee,Re,Ve),Ee.equals(ce)===!1&&(n.clearColor(oe,ee,Re,Ve),Ee.copy(ce))},reset:function(){k=!1,me=null,Ee.set(-1,0,0,0)}}}function i(){let k=!1,ce=!1,me=null,Ee=null,oe=null;return{setReversed:function(ee){if(ce!==ee){const Re=e.get("EXT_clip_control");ee?Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.ZERO_TO_ONE_EXT):Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.NEGATIVE_ONE_TO_ONE_EXT),ce=ee;const Ve=oe;oe=null,this.setClear(Ve)}},getReversed:function(){return ce},setTest:function(ee){ee?ie(n.DEPTH_TEST):Me(n.DEPTH_TEST)},setMask:function(ee){me!==ee&&!k&&(n.depthMask(ee),me=ee)},setFunc:function(ee){if(ce&&(ee=ev[ee]),Ee!==ee){switch(ee){case zr:n.depthFunc(n.NEVER);break;case kr:n.depthFunc(n.ALWAYS);break;case Br:n.depthFunc(n.LESS);break;case Xi:n.depthFunc(n.LEQUAL);break;case $r:n.depthFunc(n.EQUAL);break;case Hr:n.depthFunc(n.GEQUAL);break;case Gr:n.depthFunc(n.GREATER);break;case Vr:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ee=ee}},setLocked:function(ee){k=ee},setClear:function(ee){oe!==ee&&(ce&&(ee=1-ee),n.clearDepth(ee),oe=ee)},reset:function(){k=!1,me=null,Ee=null,oe=null,ce=!1}}}function s(){let k=!1,ce=null,me=null,Ee=null,oe=null,ee=null,Re=null,Ve=null,yt=null;return{setTest:function(ct){k||(ct?ie(n.STENCIL_TEST):Me(n.STENCIL_TEST))},setMask:function(ct){ce!==ct&&!k&&(n.stencilMask(ct),ce=ct)},setFunc:function(ct,Rn,yn){(me!==ct||Ee!==Rn||oe!==yn)&&(n.stencilFunc(ct,Rn,yn),me=ct,Ee=Rn,oe=yn)},setOp:function(ct,Rn,yn){(ee!==ct||Re!==Rn||Ve!==yn)&&(n.stencilOp(ct,Rn,yn),ee=ct,Re=Rn,Ve=yn)},setLocked:function(ct){k=ct},setClear:function(ct){yt!==ct&&(n.clearStencil(ct),yt=ct)},reset:function(){k=!1,ce=null,me=null,Ee=null,oe=null,ee=null,Re=null,Ve=null,yt=null}}}const a=new t,r=new i,o=new s,l=new WeakMap,c=new WeakMap;let d={},u={},h=new WeakMap,m=[],g=null,_=!1,p=null,f=null,w=null,E=null,y=null,T=null,S=null,M=new Je(0,0,0),b=0,x=!1,v=null,A=null,I=null,P=null,O=null;const N=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,B=0;const H=n.getParameter(n.VERSION);H.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(H)[1]),z=B>=1):H.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),z=B>=2);let Y=null,de={};const ge=n.getParameter(n.SCISSOR_BOX),Ue=n.getParameter(n.VIEWPORT),He=new Rt().fromArray(ge),We=new Rt().fromArray(Ue);function it(k,ce,me,Ee){const oe=new Uint8Array(4),ee=n.createTexture();n.bindTexture(k,ee),n.texParameteri(k,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(k,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Re=0;Re<me;Re++)k===n.TEXTURE_3D||k===n.TEXTURE_2D_ARRAY?n.texImage3D(ce,0,n.RGBA,1,1,Ee,0,n.RGBA,n.UNSIGNED_BYTE,oe):n.texImage2D(ce+Re,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,oe);return ee}const Z={};Z[n.TEXTURE_2D]=it(n.TEXTURE_2D,n.TEXTURE_2D,1),Z[n.TEXTURE_CUBE_MAP]=it(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[n.TEXTURE_2D_ARRAY]=it(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Z[n.TEXTURE_3D]=it(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),ie(n.DEPTH_TEST),r.setFunc(Xi),K(!1),J(sl),ie(n.CULL_FACE),ne(Kn);function ie(k){d[k]!==!0&&(n.enable(k),d[k]=!0)}function Me(k){d[k]!==!1&&(n.disable(k),d[k]=!1)}function De(k,ce){return u[k]!==ce?(n.bindFramebuffer(k,ce),u[k]=ce,k===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ce),k===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ce),!0):!1}function Te(k,ce){let me=m,Ee=!1;if(k){me=h.get(ce),me===void 0&&(me=[],h.set(ce,me));const oe=k.textures;if(me.length!==oe.length||me[0]!==n.COLOR_ATTACHMENT0){for(let ee=0,Re=oe.length;ee<Re;ee++)me[ee]=n.COLOR_ATTACHMENT0+ee;me.length=oe.length,Ee=!0}}else me[0]!==n.BACK&&(me[0]=n.BACK,Ee=!0);Ee&&n.drawBuffers(me)}function Ke(k){return g!==k?(n.useProgram(k),g=k,!0):!1}const xt={[mi]:n.FUNC_ADD,[Eu]:n.FUNC_SUBTRACT,[wu]:n.FUNC_REVERSE_SUBTRACT};xt[Tu]=n.MIN,xt[Au]=n.MAX;const F={[Cu]:n.ZERO,[Ru]:n.ONE,[Pu]:n.SRC_COLOR,[Fr]:n.SRC_ALPHA,[Fu]:n.SRC_ALPHA_SATURATE,[Uu]:n.DST_COLOR,[Du]:n.DST_ALPHA,[Lu]:n.ONE_MINUS_SRC_COLOR,[Or]:n.ONE_MINUS_SRC_ALPHA,[Nu]:n.ONE_MINUS_DST_COLOR,[Iu]:n.ONE_MINUS_DST_ALPHA,[Ou]:n.CONSTANT_COLOR,[zu]:n.ONE_MINUS_CONSTANT_COLOR,[ku]:n.CONSTANT_ALPHA,[Bu]:n.ONE_MINUS_CONSTANT_ALPHA};function ne(k,ce,me,Ee,oe,ee,Re,Ve,yt,ct){if(k===Kn){_===!0&&(Me(n.BLEND),_=!1);return}if(_===!1&&(ie(n.BLEND),_=!0),k!==Mu){if(k!==p||ct!==x){if((f!==mi||y!==mi)&&(n.blendEquation(n.FUNC_ADD),f=mi,y=mi),ct)switch(k){case ji:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case al:n.blendFunc(n.ONE,n.ONE);break;case rl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ol:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case ji:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case al:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case rl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ol:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}w=null,E=null,T=null,S=null,M.set(0,0,0),b=0,p=k,x=ct}return}oe=oe||ce,ee=ee||me,Re=Re||Ee,(ce!==f||oe!==y)&&(n.blendEquationSeparate(xt[ce],xt[oe]),f=ce,y=oe),(me!==w||Ee!==E||ee!==T||Re!==S)&&(n.blendFuncSeparate(F[me],F[Ee],F[ee],F[Re]),w=me,E=Ee,T=ee,S=Re),(Ve.equals(M)===!1||yt!==b)&&(n.blendColor(Ve.r,Ve.g,Ve.b,yt),M.copy(Ve),b=yt),p=k,x=!1}function Q(k,ce){k.side===mn?Me(n.CULL_FACE):ie(n.CULL_FACE);let me=k.side===Qt;ce&&(me=!me),K(me),k.blending===ji&&k.transparent===!1?ne(Kn):ne(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),r.setFunc(k.depthFunc),r.setTest(k.depthTest),r.setMask(k.depthWrite),a.setMask(k.colorWrite);const Ee=k.stencilWrite;o.setTest(Ee),Ee&&(o.setMask(k.stencilWriteMask),o.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),o.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),se(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?ie(n.SAMPLE_ALPHA_TO_COVERAGE):Me(n.SAMPLE_ALPHA_TO_COVERAGE)}function K(k){v!==k&&(k?n.frontFace(n.CW):n.frontFace(n.CCW),v=k)}function J(k){k!==yu?(ie(n.CULL_FACE),k!==A&&(k===sl?n.cullFace(n.BACK):k===bu?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Me(n.CULL_FACE),A=k}function pe(k){k!==I&&(z&&n.lineWidth(k),I=k)}function se(k,ce,me){k?(ie(n.POLYGON_OFFSET_FILL),(P!==ce||O!==me)&&(n.polygonOffset(ce,me),P=ce,O=me)):Me(n.POLYGON_OFFSET_FILL)}function fe(k){k?ie(n.SCISSOR_TEST):Me(n.SCISSOR_TEST)}function Ge(k){k===void 0&&(k=n.TEXTURE0+N-1),Y!==k&&(n.activeTexture(k),Y=k)}function $e(k,ce,me){me===void 0&&(Y===null?me=n.TEXTURE0+N-1:me=Y);let Ee=de[me];Ee===void 0&&(Ee={type:void 0,texture:void 0},de[me]=Ee),(Ee.type!==k||Ee.texture!==ce)&&(Y!==me&&(n.activeTexture(me),Y=me),n.bindTexture(k,ce||Z[k]),Ee.type=k,Ee.texture=ce)}function L(){const k=de[Y];k!==void 0&&k.type!==void 0&&(n.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function C(){try{n.compressedTexImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function V(){try{n.compressedTexImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function q(){try{n.texSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function te(){try{n.texSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function X(){try{n.compressedTexSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Pe(){try{n.compressedTexSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ue(){try{n.texStorage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ae(){try{n.texStorage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ce(){try{n.texImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function re(){try{n.texImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ye(k){He.equals(k)===!1&&(n.scissor(k.x,k.y,k.z,k.w),He.copy(k))}function ke(k){We.equals(k)===!1&&(n.viewport(k.x,k.y,k.z,k.w),We.copy(k))}function Le(k,ce){let me=c.get(ce);me===void 0&&(me=new WeakMap,c.set(ce,me));let Ee=me.get(k);Ee===void 0&&(Ee=n.getUniformBlockIndex(ce,k.name),me.set(k,Ee))}function ve(k,ce){const Ee=c.get(ce).get(k);l.get(ce)!==Ee&&(n.uniformBlockBinding(ce,Ee,k.__bindingPointIndex),l.set(ce,Ee))}function je(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},Y=null,de={},u={},h=new WeakMap,m=[],g=null,_=!1,p=null,f=null,w=null,E=null,y=null,T=null,S=null,M=new Je(0,0,0),b=0,x=!1,v=null,A=null,I=null,P=null,O=null,He.set(0,0,n.canvas.width,n.canvas.height),We.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:ie,disable:Me,bindFramebuffer:De,drawBuffers:Te,useProgram:Ke,setBlending:ne,setMaterial:Q,setFlipSided:K,setCullFace:J,setLineWidth:pe,setPolygonOffset:se,setScissorTest:fe,activeTexture:Ge,bindTexture:$e,unbindTexture:L,compressedTexImage2D:C,compressedTexImage3D:V,texImage2D:Ce,texImage3D:re,updateUBOMapping:Le,uniformBlockBinding:ve,texStorage2D:ue,texStorage3D:Ae,texSubImage2D:q,texSubImage3D:te,compressedTexSubImage2D:X,compressedTexSubImage3D:Pe,scissor:ye,viewport:ke,reset:je}}function nv(n,e,t,i,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ae,d=new WeakMap;let u;const h=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(L,C){return m?new OffscreenCanvas(L,C):La("canvas")}function _(L,C,V){let q=1;const te=$e(L);if((te.width>V||te.height>V)&&(q=V/Math.max(te.width,te.height)),q<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const X=Math.floor(q*te.width),Pe=Math.floor(q*te.height);u===void 0&&(u=g(X,Pe));const ue=C?g(X,Pe):u;return ue.width=X,ue.height=Pe,ue.getContext("2d").drawImage(L,0,0,X,Pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+X+"x"+Pe+")."),ue}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),L;return L}function p(L){return L.generateMipmaps}function f(L){n.generateMipmap(L)}function w(L){return L.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?n.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function E(L,C,V,q,te=!1){if(L!==null){if(n[L]!==void 0)return n[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let X=C;if(C===n.RED&&(V===n.FLOAT&&(X=n.R32F),V===n.HALF_FLOAT&&(X=n.R16F),V===n.UNSIGNED_BYTE&&(X=n.R8)),C===n.RED_INTEGER&&(V===n.UNSIGNED_BYTE&&(X=n.R8UI),V===n.UNSIGNED_SHORT&&(X=n.R16UI),V===n.UNSIGNED_INT&&(X=n.R32UI),V===n.BYTE&&(X=n.R8I),V===n.SHORT&&(X=n.R16I),V===n.INT&&(X=n.R32I)),C===n.RG&&(V===n.FLOAT&&(X=n.RG32F),V===n.HALF_FLOAT&&(X=n.RG16F),V===n.UNSIGNED_BYTE&&(X=n.RG8)),C===n.RG_INTEGER&&(V===n.UNSIGNED_BYTE&&(X=n.RG8UI),V===n.UNSIGNED_SHORT&&(X=n.RG16UI),V===n.UNSIGNED_INT&&(X=n.RG32UI),V===n.BYTE&&(X=n.RG8I),V===n.SHORT&&(X=n.RG16I),V===n.INT&&(X=n.RG32I)),C===n.RGB_INTEGER&&(V===n.UNSIGNED_BYTE&&(X=n.RGB8UI),V===n.UNSIGNED_SHORT&&(X=n.RGB16UI),V===n.UNSIGNED_INT&&(X=n.RGB32UI),V===n.BYTE&&(X=n.RGB8I),V===n.SHORT&&(X=n.RGB16I),V===n.INT&&(X=n.RGB32I)),C===n.RGBA_INTEGER&&(V===n.UNSIGNED_BYTE&&(X=n.RGBA8UI),V===n.UNSIGNED_SHORT&&(X=n.RGBA16UI),V===n.UNSIGNED_INT&&(X=n.RGBA32UI),V===n.BYTE&&(X=n.RGBA8I),V===n.SHORT&&(X=n.RGBA16I),V===n.INT&&(X=n.RGBA32I)),C===n.RGB&&(V===n.UNSIGNED_INT_5_9_9_9_REV&&(X=n.RGB9_E5),V===n.UNSIGNED_INT_10F_11F_11F_REV&&(X=n.R11F_G11F_B10F)),C===n.RGBA){const Pe=te?Ra:rt.getTransfer(q);V===n.FLOAT&&(X=n.RGBA32F),V===n.HALF_FLOAT&&(X=n.RGBA16F),V===n.UNSIGNED_BYTE&&(X=Pe===pt?n.SRGB8_ALPHA8:n.RGBA8),V===n.UNSIGNED_SHORT_4_4_4_4&&(X=n.RGBA4),V===n.UNSIGNED_SHORT_5_5_5_1&&(X=n.RGB5_A1)}return(X===n.R16F||X===n.R32F||X===n.RG16F||X===n.RG32F||X===n.RGBA16F||X===n.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function y(L,C){let V;return L?C===null||C===bi||C===Cs?V=n.DEPTH24_STENCIL8:C===zn?V=n.DEPTH32F_STENCIL8:C===As&&(V=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===bi||C===Cs?V=n.DEPTH_COMPONENT24:C===zn?V=n.DEPTH_COMPONENT32F:C===As&&(V=n.DEPTH_COMPONENT16),V}function T(L,C){return p(L)===!0||L.isFramebufferTexture&&L.minFilter!==_n&&L.minFilter!==Mn?Math.log2(Math.max(C.width,C.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?C.mipmaps.length:1}function S(L){const C=L.target;C.removeEventListener("dispose",S),b(C),C.isVideoTexture&&d.delete(C)}function M(L){const C=L.target;C.removeEventListener("dispose",M),v(C)}function b(L){const C=i.get(L);if(C.__webglInit===void 0)return;const V=L.source,q=h.get(V);if(q){const te=q[C.__cacheKey];te.usedTimes--,te.usedTimes===0&&x(L),Object.keys(q).length===0&&h.delete(V)}i.remove(L)}function x(L){const C=i.get(L);n.deleteTexture(C.__webglTexture);const V=L.source,q=h.get(V);delete q[C.__cacheKey],r.memory.textures--}function v(L){const C=i.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),i.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(C.__webglFramebuffer[q]))for(let te=0;te<C.__webglFramebuffer[q].length;te++)n.deleteFramebuffer(C.__webglFramebuffer[q][te]);else n.deleteFramebuffer(C.__webglFramebuffer[q]);C.__webglDepthbuffer&&n.deleteRenderbuffer(C.__webglDepthbuffer[q])}else{if(Array.isArray(C.__webglFramebuffer))for(let q=0;q<C.__webglFramebuffer.length;q++)n.deleteFramebuffer(C.__webglFramebuffer[q]);else n.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&n.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&n.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let q=0;q<C.__webglColorRenderbuffer.length;q++)C.__webglColorRenderbuffer[q]&&n.deleteRenderbuffer(C.__webglColorRenderbuffer[q]);C.__webglDepthRenderbuffer&&n.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const V=L.textures;for(let q=0,te=V.length;q<te;q++){const X=i.get(V[q]);X.__webglTexture&&(n.deleteTexture(X.__webglTexture),r.memory.textures--),i.remove(V[q])}i.remove(L)}let A=0;function I(){A=0}function P(){const L=A;return L>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),A+=1,L}function O(L){const C=[];return C.push(L.wrapS),C.push(L.wrapT),C.push(L.wrapR||0),C.push(L.magFilter),C.push(L.minFilter),C.push(L.anisotropy),C.push(L.internalFormat),C.push(L.format),C.push(L.type),C.push(L.generateMipmaps),C.push(L.premultiplyAlpha),C.push(L.flipY),C.push(L.unpackAlignment),C.push(L.colorSpace),C.join()}function N(L,C){const V=i.get(L);if(L.isVideoTexture&&fe(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&V.__version!==L.version){const q=L.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(V,L,C);return}}else L.isExternalTexture&&(V.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,V.__webglTexture,n.TEXTURE0+C)}function z(L,C){const V=i.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&V.__version!==L.version){Z(V,L,C);return}t.bindTexture(n.TEXTURE_2D_ARRAY,V.__webglTexture,n.TEXTURE0+C)}function B(L,C){const V=i.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&V.__version!==L.version){Z(V,L,C);return}t.bindTexture(n.TEXTURE_3D,V.__webglTexture,n.TEXTURE0+C)}function H(L,C){const V=i.get(L);if(L.version>0&&V.__version!==L.version){ie(V,L,C);return}t.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture,n.TEXTURE0+C)}const Y={[qr]:n.REPEAT,[xi]:n.CLAMP_TO_EDGE,[Xr]:n.MIRRORED_REPEAT},de={[_n]:n.NEAREST,[Zu]:n.NEAREST_MIPMAP_NEAREST,[Hs]:n.NEAREST_MIPMAP_LINEAR,[Mn]:n.LINEAR,[Wa]:n.LINEAR_MIPMAP_NEAREST,[yi]:n.LINEAR_MIPMAP_LINEAR},ge={[eh]:n.NEVER,[rh]:n.ALWAYS,[th]:n.LESS,[jc]:n.LEQUAL,[nh]:n.EQUAL,[ah]:n.GEQUAL,[ih]:n.GREATER,[sh]:n.NOTEQUAL};function Ue(L,C){if(C.type===zn&&e.has("OES_texture_float_linear")===!1&&(C.magFilter===Mn||C.magFilter===Wa||C.magFilter===Hs||C.magFilter===yi||C.minFilter===Mn||C.minFilter===Wa||C.minFilter===Hs||C.minFilter===yi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(L,n.TEXTURE_WRAP_S,Y[C.wrapS]),n.texParameteri(L,n.TEXTURE_WRAP_T,Y[C.wrapT]),(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)&&n.texParameteri(L,n.TEXTURE_WRAP_R,Y[C.wrapR]),n.texParameteri(L,n.TEXTURE_MAG_FILTER,de[C.magFilter]),n.texParameteri(L,n.TEXTURE_MIN_FILTER,de[C.minFilter]),C.compareFunction&&(n.texParameteri(L,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(L,n.TEXTURE_COMPARE_FUNC,ge[C.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===_n||C.minFilter!==Hs&&C.minFilter!==yi||C.type===zn&&e.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||i.get(C).__currentAnisotropy){const V=e.get("EXT_texture_filter_anisotropic");n.texParameterf(L,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,s.getMaxAnisotropy())),i.get(C).__currentAnisotropy=C.anisotropy}}}function He(L,C){let V=!1;L.__webglInit===void 0&&(L.__webglInit=!0,C.addEventListener("dispose",S));const q=C.source;let te=h.get(q);te===void 0&&(te={},h.set(q,te));const X=O(C);if(X!==L.__cacheKey){te[X]===void 0&&(te[X]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,V=!0),te[X].usedTimes++;const Pe=te[L.__cacheKey];Pe!==void 0&&(te[L.__cacheKey].usedTimes--,Pe.usedTimes===0&&x(C)),L.__cacheKey=X,L.__webglTexture=te[X].texture}return V}function We(L,C,V){return Math.floor(Math.floor(L/V)/C)}function it(L,C,V,q){const X=L.updateRanges;if(X.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,C.width,C.height,V,q,C.data);else{X.sort((re,ye)=>re.start-ye.start);let Pe=0;for(let re=1;re<X.length;re++){const ye=X[Pe],ke=X[re],Le=ye.start+ye.count,ve=We(ke.start,C.width,4),je=We(ye.start,C.width,4);ke.start<=Le+1&&ve===je&&We(ke.start+ke.count-1,C.width,4)===ve?ye.count=Math.max(ye.count,ke.start+ke.count-ye.start):(++Pe,X[Pe]=ke)}X.length=Pe+1;const ue=n.getParameter(n.UNPACK_ROW_LENGTH),Ae=n.getParameter(n.UNPACK_SKIP_PIXELS),Ce=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,C.width);for(let re=0,ye=X.length;re<ye;re++){const ke=X[re],Le=Math.floor(ke.start/4),ve=Math.ceil(ke.count/4),je=Le%C.width,k=Math.floor(Le/C.width),ce=ve,me=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,je),n.pixelStorei(n.UNPACK_SKIP_ROWS,k),t.texSubImage2D(n.TEXTURE_2D,0,je,k,ce,me,V,q,C.data)}L.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ue),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ae),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ce)}}function Z(L,C,V){let q=n.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(q=n.TEXTURE_2D_ARRAY),C.isData3DTexture&&(q=n.TEXTURE_3D);const te=He(L,C),X=C.source;t.bindTexture(q,L.__webglTexture,n.TEXTURE0+V);const Pe=i.get(X);if(X.version!==Pe.__version||te===!0){t.activeTexture(n.TEXTURE0+V);const ue=rt.getPrimaries(rt.workingColorSpace),Ae=C.colorSpace===Jn?null:rt.getPrimaries(C.colorSpace),Ce=C.colorSpace===Jn||ue===Ae?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,C.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,C.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);let re=_(C.image,!1,s.maxTextureSize);re=Ge(C,re);const ye=a.convert(C.format,C.colorSpace),ke=a.convert(C.type);let Le=E(C.internalFormat,ye,ke,C.colorSpace,C.isVideoTexture);Ue(q,C);let ve;const je=C.mipmaps,k=C.isVideoTexture!==!0,ce=Pe.__version===void 0||te===!0,me=X.dataReady,Ee=T(C,re);if(C.isDepthTexture)Le=y(C.format===Ps,C.type),ce&&(k?t.texStorage2D(n.TEXTURE_2D,1,Le,re.width,re.height):t.texImage2D(n.TEXTURE_2D,0,Le,re.width,re.height,0,ye,ke,null));else if(C.isDataTexture)if(je.length>0){k&&ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,je[0].width,je[0].height);for(let oe=0,ee=je.length;oe<ee;oe++)ve=je[oe],k?me&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,ve.width,ve.height,ye,ke,ve.data):t.texImage2D(n.TEXTURE_2D,oe,Le,ve.width,ve.height,0,ye,ke,ve.data);C.generateMipmaps=!1}else k?(ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,re.width,re.height),me&&it(C,re,ye,ke)):t.texImage2D(n.TEXTURE_2D,0,Le,re.width,re.height,0,ye,ke,re.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){k&&ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ee,Le,je[0].width,je[0].height,re.depth);for(let oe=0,ee=je.length;oe<ee;oe++)if(ve=je[oe],C.format!==gn)if(ye!==null)if(k){if(me)if(C.layerUpdates.size>0){const Re=$l(ve.width,ve.height,C.format,C.type);for(const Ve of C.layerUpdates){const yt=ve.data.subarray(Ve*Re/ve.data.BYTES_PER_ELEMENT,(Ve+1)*Re/ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,Ve,ve.width,ve.height,1,ye,yt)}C.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,ve.width,ve.height,re.depth,ye,ve.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,oe,Le,ve.width,ve.height,re.depth,0,ve.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else k?me&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,ve.width,ve.height,re.depth,ye,ke,ve.data):t.texImage3D(n.TEXTURE_2D_ARRAY,oe,Le,ve.width,ve.height,re.depth,0,ye,ke,ve.data)}else{k&&ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,je[0].width,je[0].height);for(let oe=0,ee=je.length;oe<ee;oe++)ve=je[oe],C.format!==gn?ye!==null?k?me&&t.compressedTexSubImage2D(n.TEXTURE_2D,oe,0,0,ve.width,ve.height,ye,ve.data):t.compressedTexImage2D(n.TEXTURE_2D,oe,Le,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):k?me&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,ve.width,ve.height,ye,ke,ve.data):t.texImage2D(n.TEXTURE_2D,oe,Le,ve.width,ve.height,0,ye,ke,ve.data)}else if(C.isDataArrayTexture)if(k){if(ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ee,Le,re.width,re.height,re.depth),me)if(C.layerUpdates.size>0){const oe=$l(re.width,re.height,C.format,C.type);for(const ee of C.layerUpdates){const Re=re.data.subarray(ee*oe/re.data.BYTES_PER_ELEMENT,(ee+1)*oe/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ee,re.width,re.height,1,ye,ke,Re)}C.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,ye,ke,re.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Le,re.width,re.height,re.depth,0,ye,ke,re.data);else if(C.isData3DTexture)k?(ce&&t.texStorage3D(n.TEXTURE_3D,Ee,Le,re.width,re.height,re.depth),me&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,ye,ke,re.data)):t.texImage3D(n.TEXTURE_3D,0,Le,re.width,re.height,re.depth,0,ye,ke,re.data);else if(C.isFramebufferTexture){if(ce)if(k)t.texStorage2D(n.TEXTURE_2D,Ee,Le,re.width,re.height);else{let oe=re.width,ee=re.height;for(let Re=0;Re<Ee;Re++)t.texImage2D(n.TEXTURE_2D,Re,Le,oe,ee,0,ye,ke,null),oe>>=1,ee>>=1}}else if(je.length>0){if(k&&ce){const oe=$e(je[0]);t.texStorage2D(n.TEXTURE_2D,Ee,Le,oe.width,oe.height)}for(let oe=0,ee=je.length;oe<ee;oe++)ve=je[oe],k?me&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,ye,ke,ve):t.texImage2D(n.TEXTURE_2D,oe,Le,ye,ke,ve);C.generateMipmaps=!1}else if(k){if(ce){const oe=$e(re);t.texStorage2D(n.TEXTURE_2D,Ee,Le,oe.width,oe.height)}me&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ye,ke,re)}else t.texImage2D(n.TEXTURE_2D,0,Le,ye,ke,re);p(C)&&f(q),Pe.__version=X.version,C.onUpdate&&C.onUpdate(C)}L.__version=C.version}function ie(L,C,V){if(C.image.length!==6)return;const q=He(L,C),te=C.source;t.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+V);const X=i.get(te);if(te.version!==X.__version||q===!0){t.activeTexture(n.TEXTURE0+V);const Pe=rt.getPrimaries(rt.workingColorSpace),ue=C.colorSpace===Jn?null:rt.getPrimaries(C.colorSpace),Ae=C.colorSpace===Jn||Pe===ue?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,C.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,C.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);const Ce=C.isCompressedTexture||C.image[0].isCompressedTexture,re=C.image[0]&&C.image[0].isDataTexture,ye=[];for(let ee=0;ee<6;ee++)!Ce&&!re?ye[ee]=_(C.image[ee],!0,s.maxCubemapSize):ye[ee]=re?C.image[ee].image:C.image[ee],ye[ee]=Ge(C,ye[ee]);const ke=ye[0],Le=a.convert(C.format,C.colorSpace),ve=a.convert(C.type),je=E(C.internalFormat,Le,ve,C.colorSpace),k=C.isVideoTexture!==!0,ce=X.__version===void 0||q===!0,me=te.dataReady;let Ee=T(C,ke);Ue(n.TEXTURE_CUBE_MAP,C);let oe;if(Ce){k&&ce&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ee,je,ke.width,ke.height);for(let ee=0;ee<6;ee++){oe=ye[ee].mipmaps;for(let Re=0;Re<oe.length;Re++){const Ve=oe[Re];C.format!==gn?Le!==null?k?me&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re,0,0,Ve.width,Ve.height,Le,Ve.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re,je,Ve.width,Ve.height,0,Ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re,0,0,Ve.width,Ve.height,Le,ve,Ve.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re,je,Ve.width,Ve.height,0,Le,ve,Ve.data)}}}else{if(oe=C.mipmaps,k&&ce){oe.length>0&&Ee++;const ee=$e(ye[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ee,je,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(re){k?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,ye[ee].width,ye[ee].height,Le,ve,ye[ee].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,je,ye[ee].width,ye[ee].height,0,Le,ve,ye[ee].data);for(let Re=0;Re<oe.length;Re++){const yt=oe[Re].image[ee].image;k?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re+1,0,0,yt.width,yt.height,Le,ve,yt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re+1,je,yt.width,yt.height,0,Le,ve,yt.data)}}else{k?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Le,ve,ye[ee]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,je,Le,ve,ye[ee]);for(let Re=0;Re<oe.length;Re++){const Ve=oe[Re];k?me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re+1,0,0,Le,ve,Ve.image[ee]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re+1,je,Le,ve,Ve.image[ee])}}}p(C)&&f(n.TEXTURE_CUBE_MAP),X.__version=te.version,C.onUpdate&&C.onUpdate(C)}L.__version=C.version}function Me(L,C,V,q,te,X){const Pe=a.convert(V.format,V.colorSpace),ue=a.convert(V.type),Ae=E(V.internalFormat,Pe,ue,V.colorSpace),Ce=i.get(C),re=i.get(V);if(re.__renderTarget=C,!Ce.__hasExternalTextures){const ye=Math.max(1,C.width>>X),ke=Math.max(1,C.height>>X);te===n.TEXTURE_3D||te===n.TEXTURE_2D_ARRAY?t.texImage3D(te,X,Ae,ye,ke,C.depth,0,Pe,ue,null):t.texImage2D(te,X,Ae,ye,ke,0,Pe,ue,null)}t.bindFramebuffer(n.FRAMEBUFFER,L),se(C)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,q,te,re.__webglTexture,0,pe(C)):(te===n.TEXTURE_2D||te>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,q,te,re.__webglTexture,X),t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(L,C,V){if(n.bindRenderbuffer(n.RENDERBUFFER,L),C.depthBuffer){const q=C.depthTexture,te=q&&q.isDepthTexture?q.type:null,X=y(C.stencilBuffer,te),Pe=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ue=pe(C);se(C)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ue,X,C.width,C.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,ue,X,C.width,C.height):n.renderbufferStorage(n.RENDERBUFFER,X,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Pe,n.RENDERBUFFER,L)}else{const q=C.textures;for(let te=0;te<q.length;te++){const X=q[te],Pe=a.convert(X.format,X.colorSpace),ue=a.convert(X.type),Ae=E(X.internalFormat,Pe,ue,X.colorSpace),Ce=pe(C);V&&se(C)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ce,Ae,C.width,C.height):se(C)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ce,Ae,C.width,C.height):n.renderbufferStorage(n.RENDERBUFFER,Ae,C.width,C.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Te(L,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,L),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=i.get(C.depthTexture);q.__renderTarget=C,(!q.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),N(C.depthTexture,0);const te=q.__webglTexture,X=pe(C);if(C.depthTexture.format===Rs)se(C)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,te,0,X):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,te,0);else if(C.depthTexture.format===Ps)se(C)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,te,0,X):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function Ke(L){const C=i.get(L),V=L.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==L.depthTexture){const q=L.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),q){const te=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,q.removeEventListener("dispose",te)};q.addEventListener("dispose",te),C.__depthDisposeCallback=te}C.__boundDepthTexture=q}if(L.depthTexture&&!C.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");const q=L.texture.mipmaps;q&&q.length>0?Te(C.__webglFramebuffer[0],L):Te(C.__webglFramebuffer,L)}else if(V){C.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(n.FRAMEBUFFER,C.__webglFramebuffer[q]),C.__webglDepthbuffer[q]===void 0)C.__webglDepthbuffer[q]=n.createRenderbuffer(),De(C.__webglDepthbuffer[q],L,!1);else{const te=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,X=C.__webglDepthbuffer[q];n.bindRenderbuffer(n.RENDERBUFFER,X),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,X)}}else{const q=L.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(n.FRAMEBUFFER,C.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=n.createRenderbuffer(),De(C.__webglDepthbuffer,L,!1);else{const te=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,X=C.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,X),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,X)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function xt(L,C,V){const q=i.get(L);C!==void 0&&Me(q.__webglFramebuffer,L,L.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),V!==void 0&&Ke(L)}function F(L){const C=L.texture,V=i.get(L),q=i.get(C);L.addEventListener("dispose",M);const te=L.textures,X=L.isWebGLCubeRenderTarget===!0,Pe=te.length>1;if(Pe||(q.__webglTexture===void 0&&(q.__webglTexture=n.createTexture()),q.__version=C.version,r.memory.textures++),X){V.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)if(C.mipmaps&&C.mipmaps.length>0){V.__webglFramebuffer[ue]=[];for(let Ae=0;Ae<C.mipmaps.length;Ae++)V.__webglFramebuffer[ue][Ae]=n.createFramebuffer()}else V.__webglFramebuffer[ue]=n.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){V.__webglFramebuffer=[];for(let ue=0;ue<C.mipmaps.length;ue++)V.__webglFramebuffer[ue]=n.createFramebuffer()}else V.__webglFramebuffer=n.createFramebuffer();if(Pe)for(let ue=0,Ae=te.length;ue<Ae;ue++){const Ce=i.get(te[ue]);Ce.__webglTexture===void 0&&(Ce.__webglTexture=n.createTexture(),r.memory.textures++)}if(L.samples>0&&se(L)===!1){V.__webglMultisampledFramebuffer=n.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ue=0;ue<te.length;ue++){const Ae=te[ue];V.__webglColorRenderbuffer[ue]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,V.__webglColorRenderbuffer[ue]);const Ce=a.convert(Ae.format,Ae.colorSpace),re=a.convert(Ae.type),ye=E(Ae.internalFormat,Ce,re,Ae.colorSpace,L.isXRRenderTarget===!0),ke=pe(L);n.renderbufferStorageMultisample(n.RENDERBUFFER,ke,ye,L.width,L.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.RENDERBUFFER,V.__webglColorRenderbuffer[ue])}n.bindRenderbuffer(n.RENDERBUFFER,null),L.depthBuffer&&(V.__webglDepthRenderbuffer=n.createRenderbuffer(),De(V.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(X){t.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),Ue(n.TEXTURE_CUBE_MAP,C);for(let ue=0;ue<6;ue++)if(C.mipmaps&&C.mipmaps.length>0)for(let Ae=0;Ae<C.mipmaps.length;Ae++)Me(V.__webglFramebuffer[ue][Ae],L,C,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Ae);else Me(V.__webglFramebuffer[ue],L,C,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0);p(C)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Pe){for(let ue=0,Ae=te.length;ue<Ae;ue++){const Ce=te[ue],re=i.get(Ce);let ye=n.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ye=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ye,re.__webglTexture),Ue(ye,Ce),Me(V.__webglFramebuffer,L,Ce,n.COLOR_ATTACHMENT0+ue,ye,0),p(Ce)&&f(ye)}t.unbindTexture()}else{let ue=n.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ue=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ue,q.__webglTexture),Ue(ue,C),C.mipmaps&&C.mipmaps.length>0)for(let Ae=0;Ae<C.mipmaps.length;Ae++)Me(V.__webglFramebuffer[Ae],L,C,n.COLOR_ATTACHMENT0,ue,Ae);else Me(V.__webglFramebuffer,L,C,n.COLOR_ATTACHMENT0,ue,0);p(C)&&f(ue),t.unbindTexture()}L.depthBuffer&&Ke(L)}function ne(L){const C=L.textures;for(let V=0,q=C.length;V<q;V++){const te=C[V];if(p(te)){const X=w(L),Pe=i.get(te).__webglTexture;t.bindTexture(X,Pe),f(X),t.unbindTexture()}}}const Q=[],K=[];function J(L){if(L.samples>0){if(se(L)===!1){const C=L.textures,V=L.width,q=L.height;let te=n.COLOR_BUFFER_BIT;const X=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Pe=i.get(L),ue=C.length>1;if(ue)for(let Ce=0;Ce<C.length;Ce++)t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer);const Ae=L.texture.mipmaps;Ae&&Ae.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer);for(let Ce=0;Ce<C.length;Ce++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(te|=n.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(te|=n.STENCIL_BUFFER_BIT)),ue){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Pe.__webglColorRenderbuffer[Ce]);const re=i.get(C[Ce]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,re,0)}n.blitFramebuffer(0,0,V,q,0,0,V,q,te,n.NEAREST),l===!0&&(Q.length=0,K.length=0,Q.push(n.COLOR_ATTACHMENT0+Ce),L.depthBuffer&&L.resolveDepthBuffer===!1&&(Q.push(X),K.push(X),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,K)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Q))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ue)for(let Ce=0;Ce<C.length;Ce++){t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,Pe.__webglColorRenderbuffer[Ce]);const re=i.get(C[Ce]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,re,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&l){const C=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[C])}}}function pe(L){return Math.min(s.maxSamples,L.samples)}function se(L){const C=i.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function fe(L){const C=r.render.frame;d.get(L)!==C&&(d.set(L,C),L.update())}function Ge(L,C){const V=L.colorSpace,q=L.format,te=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||V!==Ji&&V!==Jn&&(rt.getTransfer(V)===pt?(q!==gn||te!==Tn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),C}function $e(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(c.width=L.naturalWidth||L.width,c.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(c.width=L.displayWidth,c.height=L.displayHeight):(c.width=L.width,c.height=L.height),c}this.allocateTextureUnit=P,this.resetTextureUnits=I,this.setTexture2D=N,this.setTexture2DArray=z,this.setTexture3D=B,this.setTextureCube=H,this.rebindTextures=xt,this.setupRenderTarget=F,this.updateRenderTargetMipmap=ne,this.updateMultisampleRenderTarget=J,this.setupDepthRenderbuffer=Ke,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=se}function iv(n,e){function t(i,s=Jn){let a;const r=rt.getTransfer(s);if(i===Tn)return n.UNSIGNED_BYTE;if(i===Fo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Oo)return n.UNSIGNED_SHORT_5_5_5_1;if(i===kc)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Bc)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Oc)return n.BYTE;if(i===zc)return n.SHORT;if(i===As)return n.UNSIGNED_SHORT;if(i===No)return n.INT;if(i===bi)return n.UNSIGNED_INT;if(i===zn)return n.FLOAT;if(i===Fs)return n.HALF_FLOAT;if(i===$c)return n.ALPHA;if(i===Hc)return n.RGB;if(i===gn)return n.RGBA;if(i===Rs)return n.DEPTH_COMPONENT;if(i===Ps)return n.DEPTH_STENCIL;if(i===Gc)return n.RED;if(i===zo)return n.RED_INTEGER;if(i===Vc)return n.RG;if(i===ko)return n.RG_INTEGER;if(i===Bo)return n.RGBA_INTEGER;if(i===Sa||i===Ma||i===Ea||i===wa)if(r===pt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Sa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ma)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ea)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===wa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Sa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ma)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ea)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===wa)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Yr||i===Zr||i===Jr||i===Kr)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===Yr)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Zr)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Jr)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Kr)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Qr||i===eo||i===to)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===Qr||i===eo)return r===pt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===to)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===no||i===io||i===so||i===ao||i===ro||i===oo||i===lo||i===co||i===uo||i===ho||i===po||i===fo||i===mo||i===go)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===no)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===io)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===so)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ao)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ro)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===oo)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===lo)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===co)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===uo)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ho)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===po)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===fo)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===mo)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===go)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===_o||i===vo||i===xo)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===_o)return r===pt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===vo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===xo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===yo||i===bo||i===So||i===Mo)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===yo)return a.COMPRESSED_RED_RGTC1_EXT;if(i===bo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===So)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Mo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Cs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const sv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,av=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class rv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new nd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new ti({vertexShader:sv,fragmentShader:av,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new be(new zs(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class ov extends Ei{constructor(e,t){super();const i=this;let s=null,a=1,r=null,o="local-floor",l=1,c=null,d=null,u=null,h=null,m=null,g=null;const _=typeof XRWebGLBinding<"u",p=new rv,f={},w=t.getContextAttributes();let E=null,y=null;const T=[],S=[],M=new ae;let b=null;const x=new dn;x.viewport=new Rt;const v=new dn;v.viewport=new Rt;const A=[x,v],I=new wp;let P=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ie=T[Z];return ie===void 0&&(ie=new pr,T[Z]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(Z){let ie=T[Z];return ie===void 0&&(ie=new pr,T[Z]=ie),ie.getGripSpace()},this.getHand=function(Z){let ie=T[Z];return ie===void 0&&(ie=new pr,T[Z]=ie),ie.getHandSpace()};function N(Z){const ie=S.indexOf(Z.inputSource);if(ie===-1)return;const Me=T[ie];Me!==void 0&&(Me.update(Z.inputSource,Z.frame,c||r),Me.dispatchEvent({type:Z.type,data:Z.inputSource}))}function z(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",B);for(let Z=0;Z<T.length;Z++){const ie=S[Z];ie!==null&&(S[Z]=null,T[Z].disconnect(ie))}P=null,O=null,p.reset();for(const Z in f)delete f[Z];e.setRenderTarget(E),m=null,h=null,u=null,s=null,y=null,it.stop(),i.isPresenting=!1,e.setPixelRatio(b),e.setSize(M.width,M.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){a=Z,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",z),s.addEventListener("inputsourceschange",B),w.xrCompatible!==!0&&await t.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(M),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Me=null,De=null,Te=null;w.depth&&(Te=w.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Me=w.stencil?Ps:Rs,De=w.stencil?Cs:bi);const Ke={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:a};u=this.getBinding(),h=u.createProjectionLayer(Ke),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),y=new Si(h.textureWidth,h.textureHeight,{format:gn,type:Tn,depthTexture:new td(h.textureWidth,h.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,Me),stencilBuffer:w.stencil,colorSpace:e.outputColorSpace,samples:w.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const Me={antialias:w.antialias,alpha:!0,depth:w.depth,stencil:w.stencil,framebufferScaleFactor:a};m=new XRWebGLLayer(s,t,Me),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),y=new Si(m.framebufferWidth,m.framebufferHeight,{format:gn,type:Tn,colorSpace:e.outputColorSpace,stencilBuffer:w.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),it.setContext(s),it.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function B(Z){for(let ie=0;ie<Z.removed.length;ie++){const Me=Z.removed[ie],De=S.indexOf(Me);De>=0&&(S[De]=null,T[De].disconnect(Me))}for(let ie=0;ie<Z.added.length;ie++){const Me=Z.added[ie];let De=S.indexOf(Me);if(De===-1){for(let Ke=0;Ke<T.length;Ke++)if(Ke>=S.length){S.push(Me),De=Ke;break}else if(S[Ke]===null){S[Ke]=Me,De=Ke;break}if(De===-1)break}const Te=T[De];Te&&Te.connect(Me)}}const H=new U,Y=new U;function de(Z,ie,Me){H.setFromMatrixPosition(ie.matrixWorld),Y.setFromMatrixPosition(Me.matrixWorld);const De=H.distanceTo(Y),Te=ie.projectionMatrix.elements,Ke=Me.projectionMatrix.elements,xt=Te[14]/(Te[10]-1),F=Te[14]/(Te[10]+1),ne=(Te[9]+1)/Te[5],Q=(Te[9]-1)/Te[5],K=(Te[8]-1)/Te[0],J=(Ke[8]+1)/Ke[0],pe=xt*K,se=xt*J,fe=De/(-K+J),Ge=fe*-K;if(ie.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Ge),Z.translateZ(fe),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Te[10]===-1)Z.projectionMatrix.copy(ie.projectionMatrix),Z.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const $e=xt+fe,L=F+fe,C=pe-Ge,V=se+(De-Ge),q=ne*F/L*$e,te=Q*F/L*$e;Z.projectionMatrix.makePerspective(C,V,q,te,$e,L),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ge(Z,ie){ie===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ie.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let ie=Z.near,Me=Z.far;p.texture!==null&&(p.depthNear>0&&(ie=p.depthNear),p.depthFar>0&&(Me=p.depthFar)),I.near=v.near=x.near=ie,I.far=v.far=x.far=Me,(P!==I.near||O!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),P=I.near,O=I.far),I.layers.mask=Z.layers.mask|6,x.layers.mask=I.layers.mask&3,v.layers.mask=I.layers.mask&5;const De=Z.parent,Te=I.cameras;ge(I,De);for(let Ke=0;Ke<Te.length;Ke++)ge(Te[Ke],De);Te.length===2?de(I,x,v):I.projectionMatrix.copy(x.projectionMatrix),Ue(Z,I,De)};function Ue(Z,ie,Me){Me===null?Z.matrix.copy(ie.matrixWorld):(Z.matrix.copy(Me.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ie.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ie.projectionMatrix),Z.projectionMatrixInverse.copy(ie.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Eo*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(h===null&&m===null))return l},this.setFoveation=function(Z){l=Z,h!==null&&(h.fixedFoveation=Z),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Z)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(I)},this.getCameraTexture=function(Z){return f[Z]};let He=null;function We(Z,ie){if(d=ie.getViewerPose(c||r),g=ie,d!==null){const Me=d.views;m!==null&&(e.setRenderTargetFramebuffer(y,m.framebuffer),e.setRenderTarget(y));let De=!1;Me.length!==I.cameras.length&&(I.cameras.length=0,De=!0);for(let F=0;F<Me.length;F++){const ne=Me[F];let Q=null;if(m!==null)Q=m.getViewport(ne);else{const J=u.getViewSubImage(h,ne);Q=J.viewport,F===0&&(e.setRenderTargetTextures(y,J.colorTexture,J.depthStencilTexture),e.setRenderTarget(y))}let K=A[F];K===void 0&&(K=new dn,K.layers.enable(F),K.viewport=new Rt,A[F]=K),K.matrix.fromArray(ne.transform.matrix),K.matrix.decompose(K.position,K.quaternion,K.scale),K.projectionMatrix.fromArray(ne.projectionMatrix),K.projectionMatrixInverse.copy(K.projectionMatrix).invert(),K.viewport.set(Q.x,Q.y,Q.width,Q.height),F===0&&(I.matrix.copy(K.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),De===!0&&I.cameras.push(K)}const Te=s.enabledFeatures;if(Te&&Te.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=i.getBinding();const F=u.getDepthInformation(Me[0]);F&&F.isValid&&F.texture&&p.init(F,s.renderState)}if(Te&&Te.includes("camera-access")&&_){e.state.unbindTexture(),u=i.getBinding();for(let F=0;F<Me.length;F++){const ne=Me[F].camera;if(ne){let Q=f[ne];Q||(Q=new nd,f[ne]=Q);const K=u.getCameraImage(ne);Q.sourceTexture=K}}}}for(let Me=0;Me<T.length;Me++){const De=S[Me],Te=T[Me];De!==null&&Te!==void 0&&Te.update(De,ie,c||r)}He&&He(Z,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),g=null}const it=new md;it.setAnimationLoop(We),this.setAnimationLoop=function(Z){He=Z},this.dispose=function(){}}}const di=new vn,lv=new mt;function cv(n,e){function t(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function i(p,f){f.color.getRGB(p.fogColor.value,Kc(n)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function s(p,f,w,E,y){f.isMeshBasicMaterial||f.isMeshLambertMaterial?a(p,f):f.isMeshToonMaterial?(a(p,f),u(p,f)):f.isMeshPhongMaterial?(a(p,f),d(p,f)):f.isMeshStandardMaterial?(a(p,f),h(p,f),f.isMeshPhysicalMaterial&&m(p,f,y)):f.isMeshMatcapMaterial?(a(p,f),g(p,f)):f.isMeshDepthMaterial?a(p,f):f.isMeshDistanceMaterial?(a(p,f),_(p,f)):f.isMeshNormalMaterial?a(p,f):f.isLineBasicMaterial?(r(p,f),f.isLineDashedMaterial&&o(p,f)):f.isPointsMaterial?l(p,f,w,E):f.isSpriteMaterial?c(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function a(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,t(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===Qt&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,t(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===Qt&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,t(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,t(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const w=e.get(f),E=w.envMap,y=w.envMapRotation;E&&(p.envMap.value=E,di.copy(y),di.x*=-1,di.y*=-1,di.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(di.y*=-1,di.z*=-1),p.envMapRotation.value.setFromMatrix4(lv.makeRotationFromEuler(di)),p.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap&&(p.lightMap.value=f.lightMap,p.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,p.lightMapTransform)),f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,p.aoMapTransform))}function r(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform))}function o(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function l(p,f,w,E){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*w,p.scale.value=E*.5,f.map&&(p.map.value=f.map,t(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function c(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function d(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function u(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function h(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,p.roughnessMapTransform)),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,w){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Qt&&p.clearcoatNormalScale.value.negate())),f.dispersion>0&&(p.dispersion.value=f.dispersion),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=w.texture,p.transmissionSamplerSize.value.set(w.width,w.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,f){f.matcap&&(p.matcap.value=f.matcap)}function _(p,f){const w=e.get(f).light;p.referencePosition.value.setFromMatrixPosition(w.matrixWorld),p.nearDistance.value=w.shadow.camera.near,p.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function dv(n,e,t,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(w,E){const y=E.program;i.uniformBlockBinding(w,y)}function c(w,E){let y=s[w.id];y===void 0&&(g(w),y=d(w),s[w.id]=y,w.addEventListener("dispose",p));const T=E.program;i.updateUBOMapping(w,T);const S=e.render.frame;a[w.id]!==S&&(h(w),a[w.id]=S)}function d(w){const E=u();w.__bindingPointIndex=E;const y=n.createBuffer(),T=w.__size,S=w.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,T,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,E,y),y}function u(){for(let w=0;w<o;w++)if(r.indexOf(w)===-1)return r.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(w){const E=s[w.id],y=w.uniforms,T=w.__cache;n.bindBuffer(n.UNIFORM_BUFFER,E);for(let S=0,M=y.length;S<M;S++){const b=Array.isArray(y[S])?y[S]:[y[S]];for(let x=0,v=b.length;x<v;x++){const A=b[x];if(m(A,S,x,T)===!0){const I=A.__offset,P=Array.isArray(A.value)?A.value:[A.value];let O=0;for(let N=0;N<P.length;N++){const z=P[N],B=_(z);typeof z=="number"||typeof z=="boolean"?(A.__data[0]=z,n.bufferSubData(n.UNIFORM_BUFFER,I+O,A.__data)):z.isMatrix3?(A.__data[0]=z.elements[0],A.__data[1]=z.elements[1],A.__data[2]=z.elements[2],A.__data[3]=0,A.__data[4]=z.elements[3],A.__data[5]=z.elements[4],A.__data[6]=z.elements[5],A.__data[7]=0,A.__data[8]=z.elements[6],A.__data[9]=z.elements[7],A.__data[10]=z.elements[8],A.__data[11]=0):(z.toArray(A.__data,O),O+=B.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,A.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(w,E,y,T){const S=w.value,M=E+"_"+y;if(T[M]===void 0)return typeof S=="number"||typeof S=="boolean"?T[M]=S:T[M]=S.clone(),!0;{const b=T[M];if(typeof S=="number"||typeof S=="boolean"){if(b!==S)return T[M]=S,!0}else if(b.equals(S)===!1)return b.copy(S),!0}return!1}function g(w){const E=w.uniforms;let y=0;const T=16;for(let M=0,b=E.length;M<b;M++){const x=Array.isArray(E[M])?E[M]:[E[M]];for(let v=0,A=x.length;v<A;v++){const I=x[v],P=Array.isArray(I.value)?I.value:[I.value];for(let O=0,N=P.length;O<N;O++){const z=P[O],B=_(z),H=y%T,Y=H%B.boundary,de=H+Y;y+=Y,de!==0&&T-de<B.storage&&(y+=T-de),I.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=y,y+=B.storage}}}const S=y%T;return S>0&&(y+=T-S),w.__size=y,w.__cache={},this}function _(w){const E={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(E.boundary=4,E.storage=4):w.isVector2?(E.boundary=8,E.storage=8):w.isVector3||w.isColor?(E.boundary=16,E.storage=12):w.isVector4?(E.boundary=16,E.storage=16):w.isMatrix3?(E.boundary=48,E.storage=48):w.isMatrix4?(E.boundary=64,E.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),E}function p(w){const E=w.target;E.removeEventListener("dispose",p);const y=r.indexOf(E.__bindingPointIndex);r.splice(y,1),n.deleteBuffer(s[E.id]),delete s[E.id],delete a[E.id]}function f(){for(const w in s)n.deleteBuffer(s[w]);r=[],s={},a={}}return{bind:l,update:c,dispose:f}}class uv{constructor(e={}){const{canvas:t=ch(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=r;const g=new Uint32Array(4),_=new Int32Array(4);let p=null,f=null;const w=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Qn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let T=!1;this._outputColorSpace=cn;let S=0,M=0,b=null,x=-1,v=null;const A=new Rt,I=new Rt;let P=null;const O=new Je(0);let N=0,z=t.width,B=t.height,H=1,Y=null,de=null;const ge=new Rt(0,0,z,B),Ue=new Rt(0,0,z,B);let He=!1;const We=new Go;let it=!1,Z=!1;const ie=new mt,Me=new U,De=new Rt,Te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ke=!1;function xt(){return b===null?H:1}let F=i;function ne(R,$){return t.getContext(R,$)}try{const R={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Uo}`),t.addEventListener("webglcontextlost",me,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",oe,!1),F===null){const $="webgl2";if(F=ne($,R),F===null)throw ne($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let Q,K,J,pe,se,fe,Ge,$e,L,C,V,q,te,X,Pe,ue,Ae,Ce,re,ye,ke,Le,ve,je;function k(){Q=new bg(F),Q.init(),Le=new iv(F,Q),K=new fg(F,Q,e,Le),J=new tv(F,Q),K.reversedDepthBuffer&&h&&J.buffers.depth.setReversed(!0),pe=new Eg(F),se=new H_,fe=new nv(F,Q,J,se,K,Le,pe),Ge=new gg(y),$e=new yg(y),L=new Rp(F),ve=new hg(F,L),C=new Sg(F,L,pe,ve),V=new Tg(F,C,L,pe),re=new wg(F,K,fe),ue=new mg(se),q=new $_(y,Ge,$e,Q,K,ve,ue),te=new cv(y,se),X=new V_,Pe=new Z_(Q),Ce=new ug(y,Ge,$e,J,V,m,l),Ae=new Q_(y,V,K),je=new dv(F,pe,K,J),ye=new pg(F,Q,pe),ke=new Mg(F,Q,pe),pe.programs=q.programs,y.capabilities=K,y.extensions=Q,y.properties=se,y.renderLists=X,y.shadowMap=Ae,y.state=J,y.info=pe}k();const ce=new ov(y,F);this.xr=ce,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const R=Q.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=Q.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(R){R!==void 0&&(H=R,this.setSize(z,B,!1))},this.getSize=function(R){return R.set(z,B)},this.setSize=function(R,$,W=!0){if(ce.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=R,B=$,t.width=Math.floor(R*H),t.height=Math.floor($*H),W===!0&&(t.style.width=R+"px",t.style.height=$+"px"),this.setViewport(0,0,R,$)},this.getDrawingBufferSize=function(R){return R.set(z*H,B*H).floor()},this.setDrawingBufferSize=function(R,$,W){z=R,B=$,H=W,t.width=Math.floor(R*W),t.height=Math.floor($*W),this.setViewport(0,0,R,$)},this.getCurrentViewport=function(R){return R.copy(A)},this.getViewport=function(R){return R.copy(ge)},this.setViewport=function(R,$,W,j){R.isVector4?ge.set(R.x,R.y,R.z,R.w):ge.set(R,$,W,j),J.viewport(A.copy(ge).multiplyScalar(H).round())},this.getScissor=function(R){return R.copy(Ue)},this.setScissor=function(R,$,W,j){R.isVector4?Ue.set(R.x,R.y,R.z,R.w):Ue.set(R,$,W,j),J.scissor(I.copy(Ue).multiplyScalar(H).round())},this.getScissorTest=function(){return He},this.setScissorTest=function(R){J.setScissorTest(He=R)},this.setOpaqueSort=function(R){Y=R},this.setTransparentSort=function(R){de=R},this.getClearColor=function(R){return R.copy(Ce.getClearColor())},this.setClearColor=function(){Ce.setClearColor(...arguments)},this.getClearAlpha=function(){return Ce.getClearAlpha()},this.setClearAlpha=function(){Ce.setClearAlpha(...arguments)},this.clear=function(R=!0,$=!0,W=!0){let j=0;if(R){let G=!1;if(b!==null){const le=b.texture.format;G=le===Bo||le===ko||le===zo}if(G){const le=b.texture.type,xe=le===Tn||le===bi||le===As||le===Cs||le===Fo||le===Oo,we=Ce.getClearColor(),Se=Ce.getClearAlpha(),ze=we.r,Be=we.g,Ne=we.b;xe?(g[0]=ze,g[1]=Be,g[2]=Ne,g[3]=Se,F.clearBufferuiv(F.COLOR,0,g)):(_[0]=ze,_[1]=Be,_[2]=Ne,_[3]=Se,F.clearBufferiv(F.COLOR,0,_))}else j|=F.COLOR_BUFFER_BIT}$&&(j|=F.DEPTH_BUFFER_BIT),W&&(j|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",me,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",oe,!1),Ce.dispose(),X.dispose(),Pe.dispose(),se.dispose(),Ge.dispose(),$e.dispose(),V.dispose(),ve.dispose(),je.dispose(),q.dispose(),ce.dispose(),ce.removeEventListener("sessionstart",yn),ce.removeEventListener("sessionend",Jo),ii.stop()};function me(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function Ee(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const R=pe.autoReset,$=Ae.enabled,W=Ae.autoUpdate,j=Ae.needsUpdate,G=Ae.type;k(),pe.autoReset=R,Ae.enabled=$,Ae.autoUpdate=W,Ae.needsUpdate=j,Ae.type=G}function oe(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function ee(R){const $=R.target;$.removeEventListener("dispose",ee),Re($)}function Re(R){Ve(R),se.remove(R)}function Ve(R){const $=se.get(R).programs;$!==void 0&&($.forEach(function(W){q.releaseProgram(W)}),R.isShaderMaterial&&q.releaseShaderCache(R))}this.renderBufferDirect=function(R,$,W,j,G,le){$===null&&($=Te);const xe=G.isMesh&&G.matrixWorld.determinant()<0,we=Ud(R,$,W,j,G);J.setMaterial(j,xe);let Se=W.index,ze=1;if(j.wireframe===!0){if(Se=C.getWireframeAttribute(W),Se===void 0)return;ze=2}const Be=W.drawRange,Ne=W.attributes.position;let Qe=Be.start*ze,ht=(Be.start+Be.count)*ze;le!==null&&(Qe=Math.max(Qe,le.start*ze),ht=Math.min(ht,(le.start+le.count)*ze)),Se!==null?(Qe=Math.max(Qe,0),ht=Math.min(ht,Se.count)):Ne!=null&&(Qe=Math.max(Qe,0),ht=Math.min(ht,Ne.count));const Ct=ht-Qe;if(Ct<0||Ct===1/0)return;ve.setup(G,j,we,W,Se);let St,_t=ye;if(Se!==null&&(St=L.get(Se),_t=ke,_t.setIndex(St)),G.isMesh)j.wireframe===!0?(J.setLineWidth(j.wireframeLinewidth*xt()),_t.setMode(F.LINES)):_t.setMode(F.TRIANGLES);else if(G.isLine){let Oe=j.linewidth;Oe===void 0&&(Oe=1),J.setLineWidth(Oe*xt()),G.isLineSegments?_t.setMode(F.LINES):G.isLineLoop?_t.setMode(F.LINE_LOOP):_t.setMode(F.LINE_STRIP)}else G.isPoints?_t.setMode(F.POINTS):G.isSprite&&_t.setMode(F.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)Ls("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),_t.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(Q.get("WEBGL_multi_draw"))_t.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Oe=G._multiDrawStarts,Et=G._multiDrawCounts,at=G._multiDrawCount,tn=Se?L.get(Se).bytesPerElement:1,wi=se.get(j).currentProgram.getUniforms();for(let nn=0;nn<at;nn++)wi.setValue(F,"_gl_DrawID",nn),_t.render(Oe[nn]/tn,Et[nn])}else if(G.isInstancedMesh)_t.renderInstances(Qe,Ct,G.count);else if(W.isInstancedBufferGeometry){const Oe=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Et=Math.min(W.instanceCount,Oe);_t.renderInstances(Qe,Ct,Et)}else _t.render(Qe,Ct)};function yt(R,$,W){R.transparent===!0&&R.side===mn&&R.forceSinglePass===!1?(R.side=Qt,R.needsUpdate=!0,$s(R,$,W),R.side=ei,R.needsUpdate=!0,$s(R,$,W),R.side=mn):$s(R,$,W)}this.compile=function(R,$,W=null){W===null&&(W=R),f=Pe.get(W),f.init($),E.push(f),W.traverseVisible(function(G){G.isLight&&G.layers.test($.layers)&&(f.pushLight(G),G.castShadow&&f.pushShadow(G))}),R!==W&&R.traverseVisible(function(G){G.isLight&&G.layers.test($.layers)&&(f.pushLight(G),G.castShadow&&f.pushShadow(G))}),f.setupLights();const j=new Set;return R.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const le=G.material;if(le)if(Array.isArray(le))for(let xe=0;xe<le.length;xe++){const we=le[xe];yt(we,W,G),j.add(we)}else yt(le,W,G),j.add(le)}),f=E.pop(),j},this.compileAsync=function(R,$,W=null){const j=this.compile(R,$,W);return new Promise(G=>{function le(){if(j.forEach(function(xe){se.get(xe).currentProgram.isReady()&&j.delete(xe)}),j.size===0){G(R);return}setTimeout(le,10)}Q.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let ct=null;function Rn(R){ct&&ct(R)}function yn(){ii.stop()}function Jo(){ii.start()}const ii=new md;ii.setAnimationLoop(Rn),typeof self<"u"&&ii.setContext(self),this.setAnimationLoop=function(R){ct=R,ce.setAnimationLoop(R),R===null?ii.stop():ii.start()},ce.addEventListener("sessionstart",yn),ce.addEventListener("sessionend",Jo),this.render=function(R,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),ce.enabled===!0&&ce.isPresenting===!0&&(ce.cameraAutoUpdate===!0&&ce.updateCamera($),$=ce.getCamera()),R.isScene===!0&&R.onBeforeRender(y,R,$,b),f=Pe.get(R,E.length),f.init($),E.push(f),ie.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),We.setFromProjectionMatrix(ie,En,$.reversedDepth),Z=this.localClippingEnabled,it=ue.init(this.clippingPlanes,Z),p=X.get(R,w.length),p.init(),w.push(p),ce.enabled===!0&&ce.isPresenting===!0){const le=y.xr.getDepthSensingMesh();le!==null&&Ga(le,$,-1/0,y.sortObjects)}Ga(R,$,0,y.sortObjects),p.finish(),y.sortObjects===!0&&p.sort(Y,de),Ke=ce.enabled===!1||ce.isPresenting===!1||ce.hasDepthSensing()===!1,Ke&&Ce.addToRenderList(p,R),this.info.render.frame++,it===!0&&ue.beginShadows();const W=f.state.shadowsArray;Ae.render(W,R,$),it===!0&&ue.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=p.opaque,G=p.transmissive;if(f.setupLights(),$.isArrayCamera){const le=$.cameras;if(G.length>0)for(let xe=0,we=le.length;xe<we;xe++){const Se=le[xe];Qo(j,G,R,Se)}Ke&&Ce.render(R);for(let xe=0,we=le.length;xe<we;xe++){const Se=le[xe];Ko(p,R,Se,Se.viewport)}}else G.length>0&&Qo(j,G,R,$),Ke&&Ce.render(R),Ko(p,R,$);b!==null&&M===0&&(fe.updateMultisampleRenderTarget(b),fe.updateRenderTargetMipmap(b)),R.isScene===!0&&R.onAfterRender(y,R,$),ve.resetDefaultState(),x=-1,v=null,E.pop(),E.length>0?(f=E[E.length-1],it===!0&&ue.setGlobalState(y.clippingPlanes,f.state.camera)):f=null,w.pop(),w.length>0?p=w[w.length-1]:p=null};function Ga(R,$,W,j){if(R.visible===!1)return;if(R.layers.test($.layers)){if(R.isGroup)W=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update($);else if(R.isLight)f.pushLight(R),R.castShadow&&f.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||We.intersectsSprite(R)){j&&De.setFromMatrixPosition(R.matrixWorld).applyMatrix4(ie);const xe=V.update(R),we=R.material;we.visible&&p.push(R,xe,we,W,De.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||We.intersectsObject(R))){const xe=V.update(R),we=R.material;if(j&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),De.copy(R.boundingSphere.center)):(xe.boundingSphere===null&&xe.computeBoundingSphere(),De.copy(xe.boundingSphere.center)),De.applyMatrix4(R.matrixWorld).applyMatrix4(ie)),Array.isArray(we)){const Se=xe.groups;for(let ze=0,Be=Se.length;ze<Be;ze++){const Ne=Se[ze],Qe=we[Ne.materialIndex];Qe&&Qe.visible&&p.push(R,xe,Qe,W,De.z,Ne)}}else we.visible&&p.push(R,xe,we,W,De.z,null)}}const le=R.children;for(let xe=0,we=le.length;xe<we;xe++)Ga(le[xe],$,W,j)}function Ko(R,$,W,j){const G=R.opaque,le=R.transmissive,xe=R.transparent;f.setupLightsView(W),it===!0&&ue.setGlobalState(y.clippingPlanes,W),j&&J.viewport(A.copy(j)),G.length>0&&Bs(G,$,W),le.length>0&&Bs(le,$,W),xe.length>0&&Bs(xe,$,W),J.buffers.depth.setTest(!0),J.buffers.depth.setMask(!0),J.buffers.color.setMask(!0),J.setPolygonOffset(!1)}function Qo(R,$,W,j){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[j.id]===void 0&&(f.state.transmissionRenderTarget[j.id]=new Si(1,1,{generateMipmaps:!0,type:Q.has("EXT_color_buffer_half_float")||Q.has("EXT_color_buffer_float")?Fs:Tn,minFilter:yi,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:rt.workingColorSpace}));const le=f.state.transmissionRenderTarget[j.id],xe=j.viewport||A;le.setSize(xe.z*y.transmissionResolutionScale,xe.w*y.transmissionResolutionScale);const we=y.getRenderTarget(),Se=y.getActiveCubeFace(),ze=y.getActiveMipmapLevel();y.setRenderTarget(le),y.getClearColor(O),N=y.getClearAlpha(),N<1&&y.setClearColor(16777215,.5),y.clear(),Ke&&Ce.render(W);const Be=y.toneMapping;y.toneMapping=Qn;const Ne=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),f.setupLightsView(j),it===!0&&ue.setGlobalState(y.clippingPlanes,j),Bs(R,W,j),fe.updateMultisampleRenderTarget(le),fe.updateRenderTargetMipmap(le),Q.has("WEBGL_multisampled_render_to_texture")===!1){let Qe=!1;for(let ht=0,Ct=$.length;ht<Ct;ht++){const St=$[ht],_t=St.object,Oe=St.geometry,Et=St.material,at=St.group;if(Et.side===mn&&_t.layers.test(j.layers)){const tn=Et.side;Et.side=Qt,Et.needsUpdate=!0,el(_t,W,j,Oe,Et,at),Et.side=tn,Et.needsUpdate=!0,Qe=!0}}Qe===!0&&(fe.updateMultisampleRenderTarget(le),fe.updateRenderTargetMipmap(le))}y.setRenderTarget(we,Se,ze),y.setClearColor(O,N),Ne!==void 0&&(j.viewport=Ne),y.toneMapping=Be}function Bs(R,$,W){const j=$.isScene===!0?$.overrideMaterial:null;for(let G=0,le=R.length;G<le;G++){const xe=R[G],we=xe.object,Se=xe.geometry,ze=xe.group;let Be=xe.material;Be.allowOverride===!0&&j!==null&&(Be=j),we.layers.test(W.layers)&&el(we,$,W,Se,Be,ze)}}function el(R,$,W,j,G,le){R.onBeforeRender(y,$,W,j,G,le),R.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),G.onBeforeRender(y,$,W,j,R,le),G.transparent===!0&&G.side===mn&&G.forceSinglePass===!1?(G.side=Qt,G.needsUpdate=!0,y.renderBufferDirect(W,$,j,G,R,le),G.side=ei,G.needsUpdate=!0,y.renderBufferDirect(W,$,j,G,R,le),G.side=mn):y.renderBufferDirect(W,$,j,G,R,le),R.onAfterRender(y,$,W,j,G,le)}function $s(R,$,W){$.isScene!==!0&&($=Te);const j=se.get(R),G=f.state.lights,le=f.state.shadowsArray,xe=G.state.version,we=q.getParameters(R,G.state,le,$,W),Se=q.getProgramCacheKey(we);let ze=j.programs;j.environment=R.isMeshStandardMaterial?$.environment:null,j.fog=$.fog,j.envMap=(R.isMeshStandardMaterial?$e:Ge).get(R.envMap||j.environment),j.envMapRotation=j.environment!==null&&R.envMap===null?$.environmentRotation:R.envMapRotation,ze===void 0&&(R.addEventListener("dispose",ee),ze=new Map,j.programs=ze);let Be=ze.get(Se);if(Be!==void 0){if(j.currentProgram===Be&&j.lightsStateVersion===xe)return nl(R,we),Be}else we.uniforms=q.getUniforms(R),R.onBeforeCompile(we,y),Be=q.acquireProgram(we,Se),ze.set(Se,Be),j.uniforms=we.uniforms;const Ne=j.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ne.clippingPlanes=ue.uniform),nl(R,we),j.needsLights=Fd(R),j.lightsStateVersion=xe,j.needsLights&&(Ne.ambientLightColor.value=G.state.ambient,Ne.lightProbe.value=G.state.probe,Ne.directionalLights.value=G.state.directional,Ne.directionalLightShadows.value=G.state.directionalShadow,Ne.spotLights.value=G.state.spot,Ne.spotLightShadows.value=G.state.spotShadow,Ne.rectAreaLights.value=G.state.rectArea,Ne.ltc_1.value=G.state.rectAreaLTC1,Ne.ltc_2.value=G.state.rectAreaLTC2,Ne.pointLights.value=G.state.point,Ne.pointLightShadows.value=G.state.pointShadow,Ne.hemisphereLights.value=G.state.hemi,Ne.directionalShadowMap.value=G.state.directionalShadowMap,Ne.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ne.spotShadowMap.value=G.state.spotShadowMap,Ne.spotLightMatrix.value=G.state.spotLightMatrix,Ne.spotLightMap.value=G.state.spotLightMap,Ne.pointShadowMap.value=G.state.pointShadowMap,Ne.pointShadowMatrix.value=G.state.pointShadowMatrix),j.currentProgram=Be,j.uniformsList=null,Be}function tl(R){if(R.uniformsList===null){const $=R.currentProgram.getUniforms();R.uniformsList=Aa.seqWithValue($.seq,R.uniforms)}return R.uniformsList}function nl(R,$){const W=se.get(R);W.outputColorSpace=$.outputColorSpace,W.batching=$.batching,W.batchingColor=$.batchingColor,W.instancing=$.instancing,W.instancingColor=$.instancingColor,W.instancingMorph=$.instancingMorph,W.skinning=$.skinning,W.morphTargets=$.morphTargets,W.morphNormals=$.morphNormals,W.morphColors=$.morphColors,W.morphTargetsCount=$.morphTargetsCount,W.numClippingPlanes=$.numClippingPlanes,W.numIntersection=$.numClipIntersection,W.vertexAlphas=$.vertexAlphas,W.vertexTangents=$.vertexTangents,W.toneMapping=$.toneMapping}function Ud(R,$,W,j,G){$.isScene!==!0&&($=Te),fe.resetTextureUnits();const le=$.fog,xe=j.isMeshStandardMaterial?$.environment:null,we=b===null?y.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:Ji,Se=(j.isMeshStandardMaterial?$e:Ge).get(j.envMap||xe),ze=j.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Be=!!W.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Ne=!!W.morphAttributes.position,Qe=!!W.morphAttributes.normal,ht=!!W.morphAttributes.color;let Ct=Qn;j.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(Ct=y.toneMapping);const St=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,_t=St!==void 0?St.length:0,Oe=se.get(j),Et=f.state.lights;if(it===!0&&(Z===!0||R!==v)){const Xt=R===v&&j.id===x;ue.setState(j,R,Xt)}let at=!1;j.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==Et.state.version||Oe.outputColorSpace!==we||G.isBatchedMesh&&Oe.batching===!1||!G.isBatchedMesh&&Oe.batching===!0||G.isBatchedMesh&&Oe.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Oe.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Oe.instancing===!1||!G.isInstancedMesh&&Oe.instancing===!0||G.isSkinnedMesh&&Oe.skinning===!1||!G.isSkinnedMesh&&Oe.skinning===!0||G.isInstancedMesh&&Oe.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Oe.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Oe.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Oe.instancingMorph===!1&&G.morphTexture!==null||Oe.envMap!==Se||j.fog===!0&&Oe.fog!==le||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==ue.numPlanes||Oe.numIntersection!==ue.numIntersection)||Oe.vertexAlphas!==ze||Oe.vertexTangents!==Be||Oe.morphTargets!==Ne||Oe.morphNormals!==Qe||Oe.morphColors!==ht||Oe.toneMapping!==Ct||Oe.morphTargetsCount!==_t)&&(at=!0):(at=!0,Oe.__version=j.version);let tn=Oe.currentProgram;at===!0&&(tn=$s(j,$,G));let wi=!1,nn=!1,rs=!1;const wt=tn.getUniforms(),rn=Oe.uniforms;if(J.useProgram(tn.program)&&(wi=!0,nn=!0,rs=!0),j.id!==x&&(x=j.id,nn=!0),wi||v!==R){J.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),wt.setValue(F,"projectionMatrix",R.projectionMatrix),wt.setValue(F,"viewMatrix",R.matrixWorldInverse);const Zt=wt.map.cameraPosition;Zt!==void 0&&Zt.setValue(F,Me.setFromMatrixPosition(R.matrixWorld)),K.logarithmicDepthBuffer&&wt.setValue(F,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&wt.setValue(F,"isOrthographic",R.isOrthographicCamera===!0),v!==R&&(v=R,nn=!0,rs=!0)}if(G.isSkinnedMesh){wt.setOptional(F,G,"bindMatrix"),wt.setOptional(F,G,"bindMatrixInverse");const Xt=G.skeleton;Xt&&(Xt.boneTexture===null&&Xt.computeBoneTexture(),wt.setValue(F,"boneTexture",Xt.boneTexture,fe))}G.isBatchedMesh&&(wt.setOptional(F,G,"batchingTexture"),wt.setValue(F,"batchingTexture",G._matricesTexture,fe),wt.setOptional(F,G,"batchingIdTexture"),wt.setValue(F,"batchingIdTexture",G._indirectTexture,fe),wt.setOptional(F,G,"batchingColorTexture"),G._colorsTexture!==null&&wt.setValue(F,"batchingColorTexture",G._colorsTexture,fe));const on=W.morphAttributes;if((on.position!==void 0||on.normal!==void 0||on.color!==void 0)&&re.update(G,W,tn),(nn||Oe.receiveShadow!==G.receiveShadow)&&(Oe.receiveShadow=G.receiveShadow,wt.setValue(F,"receiveShadow",G.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(rn.envMap.value=Se,rn.flipEnvMap.value=Se.isCubeTexture&&Se.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&$.environment!==null&&(rn.envMapIntensity.value=$.environmentIntensity),nn&&(wt.setValue(F,"toneMappingExposure",y.toneMappingExposure),Oe.needsLights&&Nd(rn,rs),le&&j.fog===!0&&te.refreshFogUniforms(rn,le),te.refreshMaterialUniforms(rn,j,H,B,f.state.transmissionRenderTarget[R.id]),Aa.upload(F,tl(Oe),rn,fe)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(Aa.upload(F,tl(Oe),rn,fe),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&wt.setValue(F,"center",G.center),wt.setValue(F,"modelViewMatrix",G.modelViewMatrix),wt.setValue(F,"normalMatrix",G.normalMatrix),wt.setValue(F,"modelMatrix",G.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const Xt=j.uniformsGroups;for(let Zt=0,Va=Xt.length;Zt<Va;Zt++){const si=Xt[Zt];je.update(si,tn),je.bind(si,tn)}}return tn}function Nd(R,$){R.ambientLightColor.needsUpdate=$,R.lightProbe.needsUpdate=$,R.directionalLights.needsUpdate=$,R.directionalLightShadows.needsUpdate=$,R.pointLights.needsUpdate=$,R.pointLightShadows.needsUpdate=$,R.spotLights.needsUpdate=$,R.spotLightShadows.needsUpdate=$,R.rectAreaLights.needsUpdate=$,R.hemisphereLights.needsUpdate=$}function Fd(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(R,$,W){const j=se.get(R);j.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,j.__autoAllocateDepthBuffer===!1&&(j.__useRenderToTexture=!1),se.get(R.texture).__webglTexture=$,se.get(R.depthTexture).__webglTexture=j.__autoAllocateDepthBuffer?void 0:W,j.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,$){const W=se.get(R);W.__webglFramebuffer=$,W.__useDefaultFramebuffer=$===void 0};const Od=F.createFramebuffer();this.setRenderTarget=function(R,$=0,W=0){b=R,S=$,M=W;let j=!0,G=null,le=!1,xe=!1;if(R){const Se=se.get(R);if(Se.__useDefaultFramebuffer!==void 0)J.bindFramebuffer(F.FRAMEBUFFER,null),j=!1;else if(Se.__webglFramebuffer===void 0)fe.setupRenderTarget(R);else if(Se.__hasExternalTextures)fe.rebindTextures(R,se.get(R.texture).__webglTexture,se.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const Ne=R.depthTexture;if(Se.__boundDepthTexture!==Ne){if(Ne!==null&&se.has(Ne)&&(R.width!==Ne.image.width||R.height!==Ne.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");fe.setupDepthRenderbuffer(R)}}const ze=R.texture;(ze.isData3DTexture||ze.isDataArrayTexture||ze.isCompressedArrayTexture)&&(xe=!0);const Be=se.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Be[$])?G=Be[$][W]:G=Be[$],le=!0):R.samples>0&&fe.useMultisampledRTT(R)===!1?G=se.get(R).__webglMultisampledFramebuffer:Array.isArray(Be)?G=Be[W]:G=Be,A.copy(R.viewport),I.copy(R.scissor),P=R.scissorTest}else A.copy(ge).multiplyScalar(H).floor(),I.copy(Ue).multiplyScalar(H).floor(),P=He;if(W!==0&&(G=Od),J.bindFramebuffer(F.FRAMEBUFFER,G)&&j&&J.drawBuffers(R,G),J.viewport(A),J.scissor(I),J.setScissorTest(P),le){const Se=se.get(R.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+$,Se.__webglTexture,W)}else if(xe){const Se=$;for(let ze=0;ze<R.textures.length;ze++){const Be=se.get(R.textures[ze]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+ze,Be.__webglTexture,W,Se)}}else if(R!==null&&W!==0){const Se=se.get(R.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Se.__webglTexture,W)}x=-1},this.readRenderTargetPixels=function(R,$,W,j,G,le,xe,we=0){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=se.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&xe!==void 0&&(Se=Se[xe]),Se){J.bindFramebuffer(F.FRAMEBUFFER,Se);try{const ze=R.textures[we],Be=ze.format,Ne=ze.type;if(!K.textureFormatReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!K.textureTypeReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=R.width-j&&W>=0&&W<=R.height-G&&(R.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+we),F.readPixels($,W,j,G,Le.convert(Be),Le.convert(Ne),le))}finally{const ze=b!==null?se.get(b).__webglFramebuffer:null;J.bindFramebuffer(F.FRAMEBUFFER,ze)}}},this.readRenderTargetPixelsAsync=async function(R,$,W,j,G,le,xe,we=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=se.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&xe!==void 0&&(Se=Se[xe]),Se)if($>=0&&$<=R.width-j&&W>=0&&W<=R.height-G){J.bindFramebuffer(F.FRAMEBUFFER,Se);const ze=R.textures[we],Be=ze.format,Ne=ze.type;if(!K.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!K.textureTypeReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Qe=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Qe),F.bufferData(F.PIXEL_PACK_BUFFER,le.byteLength,F.STREAM_READ),R.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+we),F.readPixels($,W,j,G,Le.convert(Be),Le.convert(Ne),0);const ht=b!==null?se.get(b).__webglFramebuffer:null;J.bindFramebuffer(F.FRAMEBUFFER,ht);const Ct=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await dh(F,Ct,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Qe),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,le),F.deleteBuffer(Qe),F.deleteSync(Ct),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,$=null,W=0){const j=Math.pow(2,-W),G=Math.floor(R.image.width*j),le=Math.floor(R.image.height*j),xe=$!==null?$.x:0,we=$!==null?$.y:0;fe.setTexture2D(R,0),F.copyTexSubImage2D(F.TEXTURE_2D,W,0,0,xe,we,G,le),J.unbindTexture()};const zd=F.createFramebuffer(),kd=F.createFramebuffer();this.copyTextureToTexture=function(R,$,W=null,j=null,G=0,le=null){le===null&&(G!==0?(Ls("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),le=G,G=0):le=0);let xe,we,Se,ze,Be,Ne,Qe,ht,Ct;const St=R.isCompressedTexture?R.mipmaps[le]:R.image;if(W!==null)xe=W.max.x-W.min.x,we=W.max.y-W.min.y,Se=W.isBox3?W.max.z-W.min.z:1,ze=W.min.x,Be=W.min.y,Ne=W.isBox3?W.min.z:0;else{const on=Math.pow(2,-G);xe=Math.floor(St.width*on),we=Math.floor(St.height*on),R.isDataArrayTexture?Se=St.depth:R.isData3DTexture?Se=Math.floor(St.depth*on):Se=1,ze=0,Be=0,Ne=0}j!==null?(Qe=j.x,ht=j.y,Ct=j.z):(Qe=0,ht=0,Ct=0);const _t=Le.convert($.format),Oe=Le.convert($.type);let Et;$.isData3DTexture?(fe.setTexture3D($,0),Et=F.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(fe.setTexture2DArray($,0),Et=F.TEXTURE_2D_ARRAY):(fe.setTexture2D($,0),Et=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,$.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,$.unpackAlignment);const at=F.getParameter(F.UNPACK_ROW_LENGTH),tn=F.getParameter(F.UNPACK_IMAGE_HEIGHT),wi=F.getParameter(F.UNPACK_SKIP_PIXELS),nn=F.getParameter(F.UNPACK_SKIP_ROWS),rs=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,St.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,St.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,ze),F.pixelStorei(F.UNPACK_SKIP_ROWS,Be),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Ne);const wt=R.isDataArrayTexture||R.isData3DTexture,rn=$.isDataArrayTexture||$.isData3DTexture;if(R.isDepthTexture){const on=se.get(R),Xt=se.get($),Zt=se.get(on.__renderTarget),Va=se.get(Xt.__renderTarget);J.bindFramebuffer(F.READ_FRAMEBUFFER,Zt.__webglFramebuffer),J.bindFramebuffer(F.DRAW_FRAMEBUFFER,Va.__webglFramebuffer);for(let si=0;si<Se;si++)wt&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,se.get(R).__webglTexture,G,Ne+si),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,se.get($).__webglTexture,le,Ct+si)),F.blitFramebuffer(ze,Be,xe,we,Qe,ht,xe,we,F.DEPTH_BUFFER_BIT,F.NEAREST);J.bindFramebuffer(F.READ_FRAMEBUFFER,null),J.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(G!==0||R.isRenderTargetTexture||se.has(R)){const on=se.get(R),Xt=se.get($);J.bindFramebuffer(F.READ_FRAMEBUFFER,zd),J.bindFramebuffer(F.DRAW_FRAMEBUFFER,kd);for(let Zt=0;Zt<Se;Zt++)wt?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,on.__webglTexture,G,Ne+Zt):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,on.__webglTexture,G),rn?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Xt.__webglTexture,le,Ct+Zt):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Xt.__webglTexture,le),G!==0?F.blitFramebuffer(ze,Be,xe,we,Qe,ht,xe,we,F.COLOR_BUFFER_BIT,F.NEAREST):rn?F.copyTexSubImage3D(Et,le,Qe,ht,Ct+Zt,ze,Be,xe,we):F.copyTexSubImage2D(Et,le,Qe,ht,ze,Be,xe,we);J.bindFramebuffer(F.READ_FRAMEBUFFER,null),J.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else rn?R.isDataTexture||R.isData3DTexture?F.texSubImage3D(Et,le,Qe,ht,Ct,xe,we,Se,_t,Oe,St.data):$.isCompressedArrayTexture?F.compressedTexSubImage3D(Et,le,Qe,ht,Ct,xe,we,Se,_t,St.data):F.texSubImage3D(Et,le,Qe,ht,Ct,xe,we,Se,_t,Oe,St):R.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,le,Qe,ht,xe,we,_t,Oe,St.data):R.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,le,Qe,ht,St.width,St.height,_t,St.data):F.texSubImage2D(F.TEXTURE_2D,le,Qe,ht,xe,we,_t,Oe,St);F.pixelStorei(F.UNPACK_ROW_LENGTH,at),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,tn),F.pixelStorei(F.UNPACK_SKIP_PIXELS,wi),F.pixelStorei(F.UNPACK_SKIP_ROWS,nn),F.pixelStorei(F.UNPACK_SKIP_IMAGES,rs),le===0&&$.generateMipmaps&&F.generateMipmap(Et),J.unbindTexture()},this.initRenderTarget=function(R){se.get(R).__webglFramebuffer===void 0&&fe.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?fe.setTextureCube(R,0):R.isData3DTexture?fe.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?fe.setTexture2DArray(R,0):fe.setTexture2D(R,0),J.unbindTexture()},this.resetState=function(){S=0,M=0,b=null,J.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=rt._getDrawingBufferColorSpace(e),t.unpackColorSpace=rt._getUnpackColorSpace()}}const hc={type:"change"},Yo={type:"start"},yd={type:"end"},_a=new ka,pc=new Zn,hv=Math.cos(70*lh.DEG2RAD),Nt=new U,Kt=2*Math.PI,ft={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Ar=1e-6;class pv extends fd{constructor(e,t=null){super(e,t),this.state=ft.NONE,this.target=new U,this.cursor=new U,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Wi.ROTATE,MIDDLE:Wi.DOLLY,RIGHT:Wi.PAN},this.touches={ONE:$i.ROTATE,TWO:$i.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new U,this._lastQuaternion=new Ht,this._lastTargetPosition=new U,this._quat=new Ht().setFromUnitVectors(e.up,new U(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Bl,this._sphericalDelta=new Bl,this._scale=1,this._panOffset=new U,this._rotateStart=new ae,this._rotateEnd=new ae,this._rotateDelta=new ae,this._panStart=new ae,this._panEnd=new ae,this._panDelta=new ae,this._dollyStart=new ae,this._dollyEnd=new ae,this._dollyDelta=new ae,this._dollyDirection=new U,this._mouse=new ae,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=mv.bind(this),this._onPointerDown=fv.bind(this),this._onPointerUp=gv.bind(this),this._onContextMenu=Mv.bind(this),this._onMouseWheel=xv.bind(this),this._onKeyDown=yv.bind(this),this._onTouchStart=bv.bind(this),this._onTouchMove=Sv.bind(this),this._onMouseDown=_v.bind(this),this._onMouseMove=vv.bind(this),this._interceptControlDown=Ev.bind(this),this._interceptControlUp=wv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(hc),this.update(),this.state=ft.NONE}update(e=null){const t=this.object.position;Nt.copy(t).sub(this.target),Nt.applyQuaternion(this._quat),this._spherical.setFromVector3(Nt),this.autoRotate&&this.state===ft.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Kt:i>Math.PI&&(i-=Kt),s<-Math.PI?s+=Kt:s>Math.PI&&(s-=Kt),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let a=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const r=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),a=r!=this._spherical.radius}if(Nt.setFromSpherical(this._spherical),Nt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Nt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let r=null;if(this.object.isPerspectiveCamera){const o=Nt.length();r=this._clampDistance(o*this._scale);const l=o-r;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),a=!!l}else if(this.object.isOrthographicCamera){const o=new U(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),a=l!==this.object.zoom;const c=new U(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),r=Nt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;r!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(r).add(this.object.position):(_a.origin.copy(this.object.position),_a.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(_a.direction))<hv?this.object.lookAt(this.target):(pc.setFromNormalAndCoplanarPoint(this.object.up,this.target),_a.intersectPlane(pc,this.target))))}else if(this.object.isOrthographicCamera){const r=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),r!==this.object.zoom&&(this.object.updateProjectionMatrix(),a=!0)}return this._scale=1,this._performCursorZoom=!1,a||this._lastPosition.distanceToSquared(this.object.position)>Ar||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Ar||this._lastTargetPosition.distanceToSquared(this.target)>Ar?(this.dispatchEvent(hc),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Kt/60*this.autoRotateSpeed*e:Kt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Nt.setFromMatrixColumn(t,0),Nt.multiplyScalar(-e),this._panOffset.add(Nt)}_panUp(e,t){this.screenSpacePanning===!0?Nt.setFromMatrixColumn(t,1):(Nt.setFromMatrixColumn(t,0),Nt.crossVectors(this.object.up,Nt)),Nt.multiplyScalar(e),this._panOffset.add(Nt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Nt.copy(s).sub(this.target);let a=Nt.length();a*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*a/i.clientHeight,this.object.matrix),this._panUp(2*t*a/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,a=t-i.top,r=i.width,o=i.height;this._mouse.x=s/r*2-1,this._mouse.y=-(a/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Kt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Kt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Kt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Kt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Kt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Kt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,a=Math.sqrt(i*i+s*s);this._dollyStart.set(0,a)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),a=.5*(e.pageY+i.y);this._rotateEnd.set(s,a)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Kt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Kt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,a=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,a),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const r=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(r,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ae,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function fv(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function mv(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function gv(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(yd),this.state=ft.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function _v(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Wi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=ft.DOLLY;break;case Wi.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ft.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ft.ROTATE}break;case Wi.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ft.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ft.PAN}break;default:this.state=ft.NONE}this.state!==ft.NONE&&this.dispatchEvent(Yo)}function vv(n){switch(this.state){case ft.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case ft.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case ft.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function xv(n){this.enabled===!1||this.enableZoom===!1||this.state!==ft.NONE||(n.preventDefault(),this.dispatchEvent(Yo),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(yd))}function yv(n){this.enabled!==!1&&this._handleKeyDown(n)}function bv(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case $i.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=ft.TOUCH_ROTATE;break;case $i.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=ft.TOUCH_PAN;break;default:this.state=ft.NONE}break;case 2:switch(this.touches.TWO){case $i.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=ft.TOUCH_DOLLY_PAN;break;case $i.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=ft.TOUCH_DOLLY_ROTATE;break;default:this.state=ft.NONE}break;default:this.state=ft.NONE}this.state!==ft.NONE&&this.dispatchEvent(Yo)}function Sv(n){switch(this._trackPointer(n),this.state){case ft.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case ft.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case ft.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case ft.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=ft.NONE}}function Mv(n){this.enabled!==!1&&n.preventDefault()}function Ev(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function wv(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const ui=new pd,jt=new U,Xn=new U,Mt=new Ht,fc={X:new U(1,0,0),Y:new U(0,1,0),Z:new U(0,0,1)},Cr={type:"change"},mc={type:"mouseDown",mode:null},gc={type:"mouseUp",mode:null},_c={type:"objectChange"};class Tv extends fd{constructor(e,t=null){super(void 0,t);const i=new Dv(this);this._root=i;const s=new Iv;this._gizmo=s,i.add(s);const a=new Uv;this._plane=a,i.add(a);const r=this;function o(E,y){let T=y;Object.defineProperty(r,E,{get:function(){return T!==void 0?T:y},set:function(S){T!==S&&(T=S,a[E]=S,s[E]=S,r.dispatchEvent({type:E+"-changed",value:S}),r.dispatchEvent(Cr))}}),r[E]=y,a[E]=y,s[E]=y}o("camera",e),o("object",void 0),o("enabled",!0),o("axis",null),o("mode","translate"),o("translationSnap",null),o("rotationSnap",null),o("scaleSnap",null),o("space","world"),o("size",1),o("dragging",!1),o("showX",!0),o("showY",!0),o("showZ",!0),o("minX",-1/0),o("maxX",1/0),o("minY",-1/0),o("maxY",1/0),o("minZ",-1/0),o("maxZ",1/0);const l=new U,c=new U,d=new Ht,u=new Ht,h=new U,m=new Ht,g=new U,_=new U,p=new U,f=0,w=new U;o("worldPosition",l),o("worldPositionStart",c),o("worldQuaternion",d),o("worldQuaternionStart",u),o("cameraPosition",h),o("cameraQuaternion",m),o("pointStart",g),o("pointEnd",_),o("rotationAxis",p),o("rotationAngle",f),o("eye",w),this._offset=new U,this._startNorm=new U,this._endNorm=new U,this._cameraScale=new U,this._parentPosition=new U,this._parentQuaternion=new Ht,this._parentQuaternionInv=new Ht,this._parentScale=new U,this._worldScaleStart=new U,this._worldQuaternionInv=new Ht,this._worldScale=new U,this._positionStart=new U,this._quaternionStart=new Ht,this._scaleStart=new U,this._getPointer=Av.bind(this),this._onPointerDown=Rv.bind(this),this._onPointerHover=Cv.bind(this),this._onPointerMove=Pv.bind(this),this._onPointerUp=Lv.bind(this),t!==null&&this.connect(t)}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="auto"}getHelper(){return this._root}pointerHover(e){if(this.object===void 0||this.dragging===!0)return;e!==null&&ui.setFromCamera(e,this.camera);const t=Rr(this._gizmo.picker[this.mode],ui);t?this.axis=t.object.name:this.axis=null}pointerDown(e){if(!(this.object===void 0||this.dragging===!0||e!=null&&e.button!==0)&&this.axis!==null){e!==null&&ui.setFromCamera(e,this.camera);const t=Rr(this._plane,ui,!0);t&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(t.point).sub(this.worldPositionStart)),this.dragging=!0,mc.mode=this.mode,this.dispatchEvent(mc)}}pointerMove(e){const t=this.axis,i=this.mode,s=this.object;let a=this.space;if(i==="scale"?a="local":(t==="E"||t==="XYZE"||t==="XYZ")&&(a="world"),s===void 0||t===null||this.dragging===!1||e!==null&&e.button!==-1)return;e!==null&&ui.setFromCamera(e,this.camera);const r=Rr(this._plane,ui,!0);if(r){if(this.pointEnd.copy(r.point).sub(this.worldPositionStart),i==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),a==="local"&&t!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),t.indexOf("X")===-1&&(this._offset.x=0),t.indexOf("Y")===-1&&(this._offset.y=0),t.indexOf("Z")===-1&&(this._offset.z=0),a==="local"&&t!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),s.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(a==="local"&&(s.position.applyQuaternion(Mt.copy(this._quaternionStart).invert()),t.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.position.applyQuaternion(this._quaternionStart)),a==="world"&&(s.parent&&s.position.add(jt.setFromMatrixPosition(s.parent.matrixWorld)),t.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.parent&&s.position.sub(jt.setFromMatrixPosition(s.parent.matrixWorld)))),s.position.x=Math.max(this.minX,Math.min(this.maxX,s.position.x)),s.position.y=Math.max(this.minY,Math.min(this.maxY,s.position.y)),s.position.z=Math.max(this.minZ,Math.min(this.maxZ,s.position.z));else if(i==="scale"){if(t.search("XYZ")!==-1){let o=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(o*=-1),Xn.set(o,o,o)}else jt.copy(this.pointStart),Xn.copy(this.pointEnd),jt.applyQuaternion(this._worldQuaternionInv),Xn.applyQuaternion(this._worldQuaternionInv),Xn.divide(jt),t.search("X")===-1&&(Xn.x=1),t.search("Y")===-1&&(Xn.y=1),t.search("Z")===-1&&(Xn.z=1);s.scale.copy(this._scaleStart).multiply(Xn),this.scaleSnap&&(t.search("X")!==-1&&(s.scale.x=Math.round(s.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Y")!==-1&&(s.scale.y=Math.round(s.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Z")!==-1&&(s.scale.z=Math.round(s.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(i==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);const o=20/this.worldPosition.distanceTo(jt.setFromMatrixPosition(this.camera.matrixWorld));let l=!1;t==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(jt.copy(this.rotationAxis).cross(this.eye))*o):(t==="X"||t==="Y"||t==="Z")&&(this.rotationAxis.copy(fc[t]),jt.copy(fc[t]),a==="local"&&jt.applyQuaternion(this.worldQuaternion),jt.cross(this.eye),jt.length()===0?l=!0:this.rotationAngle=this._offset.dot(jt.normalize())*o),(t==="E"||l)&&(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),a==="local"&&t!=="E"&&t!=="XYZE"?(s.quaternion.copy(this._quaternionStart),s.quaternion.multiply(Mt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),s.quaternion.copy(Mt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),s.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(Cr),this.dispatchEvent(_c)}}pointerUp(e){e!==null&&e.button!==0||(this.dragging&&this.axis!==null&&(gc.mode=this.mode,this.dispatchEvent(gc)),this.dragging=!1,this.axis=null)}dispose(){this.disconnect(),this._root.dispose()}attach(e){return this.object=e,this._root.visible=!0,this}detach(){return this.object=void 0,this.axis=null,this._root.visible=!1,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(Cr),this.dispatchEvent(_c),this.pointStart.copy(this.pointEnd))}getRaycaster(){return ui}getMode(){return this.mode}setMode(e){this.mode=e}setTranslationSnap(e){this.translationSnap=e}setRotationSnap(e){this.rotationSnap=e}setScaleSnap(e){this.scaleSnap=e}setSize(e){this.size=e}setSpace(e){this.space=e}setColors(e,t,i,s){const a=this._gizmo.materialLib;a.xAxis.color.set(e),a.yAxis.color.set(t),a.zAxis.color.set(i),a.active.color.set(s),a.xAxisTransparent.color.set(e),a.yAxisTransparent.color.set(t),a.zAxisTransparent.color.set(i),a.activeTransparent.color.set(s),a.xAxis._color&&a.xAxis._color.set(e),a.yAxis._color&&a.yAxis._color.set(t),a.zAxis._color&&a.zAxis._color.set(i),a.active._color&&a.active._color.set(s),a.xAxisTransparent._color&&a.xAxisTransparent._color.set(e),a.yAxisTransparent._color&&a.yAxisTransparent._color.set(t),a.zAxisTransparent._color&&a.zAxisTransparent._color.set(i),a.activeTransparent._color&&a.activeTransparent._color.set(s)}}function Av(n){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:n.button};{const e=this.domElement.getBoundingClientRect();return{x:(n.clientX-e.left)/e.width*2-1,y:-(n.clientY-e.top)/e.height*2+1,button:n.button}}}function Cv(n){if(this.enabled)switch(n.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(n));break}}function Rv(n){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(n)),this.pointerDown(this._getPointer(n)))}function Pv(n){this.enabled&&this.pointerMove(this._getPointer(n))}function Lv(n){this.enabled&&(this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(n)))}function Rr(n,e,t){const i=e.intersectObject(n,!0);for(let s=0;s<i.length;s++)if(i[s].object.visible||t)return i[s];return!1}const va=new vn,vt=new U(0,1,0),vc=new U(0,0,0),xc=new mt,xa=new Ht,Ca=new Ht,bn=new U,yc=new mt,xs=new U(1,0,0),fi=new U(0,1,0),ys=new U(0,0,1),ya=new U,ps=new U,fs=new U;class Dv extends Dt{constructor(e){super(),this.isTransformControlsRoot=!0,this.controls=e,this.visible=!1}updateMatrixWorld(e){const t=this.controls;t.object!==void 0&&(t.object.updateMatrixWorld(),t.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):t.object.parent.matrixWorld.decompose(t._parentPosition,t._parentQuaternion,t._parentScale),t.object.matrixWorld.decompose(t.worldPosition,t.worldQuaternion,t._worldScale),t._parentQuaternionInv.copy(t._parentQuaternion).invert(),t._worldQuaternionInv.copy(t.worldQuaternion).invert()),t.camera.updateMatrixWorld(),t.camera.matrixWorld.decompose(t.cameraPosition,t.cameraQuaternion,t._cameraScale),t.camera.isOrthographicCamera?t.camera.getWorldDirection(t.eye).negate():t.eye.copy(t.cameraPosition).sub(t.worldPosition).normalize(),super.updateMatrixWorld(e)}dispose(){this.traverse(function(e){e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})}}class Iv extends Dt{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";const e=new Ba({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),t=new Qi({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),i=e.clone();i.opacity=.15;const s=t.clone();s.opacity=.5;const a=e.clone();a.color.setHex(16711680);const r=e.clone();r.color.setHex(65280);const o=e.clone();o.color.setHex(255);const l=e.clone();l.color.setHex(16711680),l.opacity=.5;const c=e.clone();c.color.setHex(65280),c.opacity=.5;const d=e.clone();d.color.setHex(255),d.opacity=.5;const u=e.clone();u.opacity=.25;const h=e.clone();h.color.setHex(16776960),h.opacity=.25;const m=e.clone();m.color.setHex(16776960);const g=e.clone();g.color.setHex(7895160),this.materialLib={xAxis:a,yAxis:r,zAxis:o,active:m,xAxisTransparent:l,yAxisTransparent:c,zAxisTransparent:d,activeTransparent:h};const _=new $t(0,.04,.1,12);_.translate(0,.05,0);const p=new Tt(.08,.08,.08);p.translate(0,.04,0);const f=new Bt;f.setAttribute("position",new ut([0,0,0,1,0,0],3));const w=new $t(.0075,.0075,.5,3);w.translate(0,.25,0);function E(N,z){const B=new gi(N,.0075,3,64,z*Math.PI*2);return B.rotateY(Math.PI/2),B.rotateX(Math.PI/2),B}function y(){const N=new Bt;return N.setAttribute("position",new ut([0,0,0,1,1,1],3)),N}const T={X:[[new be(_,a),[.5,0,0],[0,0,-Math.PI/2]],[new be(_,a),[-.5,0,0],[0,0,Math.PI/2]],[new be(w,a),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new be(_,r),[0,.5,0]],[new be(_,r),[0,-.5,0],[Math.PI,0,0]],[new be(w,r)]],Z:[[new be(_,o),[0,0,.5],[Math.PI/2,0,0]],[new be(_,o),[0,0,-.5],[-Math.PI/2,0,0]],[new be(w,o),null,[Math.PI/2,0,0]]],XYZ:[[new be(new Gi(.1,0),u),[0,0,0]]],XY:[[new be(new Tt(.15,.15,.01),d),[.15,.15,0]]],YZ:[[new be(new Tt(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new be(new Tt(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]]},S={X:[[new be(new $t(.2,0,.6,4),i),[.3,0,0],[0,0,-Math.PI/2]],[new be(new $t(.2,0,.6,4),i),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new be(new $t(.2,0,.6,4),i),[0,.3,0]],[new be(new $t(.2,0,.6,4),i),[0,-.3,0],[0,0,Math.PI]]],Z:[[new be(new $t(.2,0,.6,4),i),[0,0,.3],[Math.PI/2,0,0]],[new be(new $t(.2,0,.6,4),i),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new be(new Gi(.2,0),i)]],XY:[[new be(new Tt(.2,.2,.01),i),[.15,.15,0]]],YZ:[[new be(new Tt(.2,.2,.01),i),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new be(new Tt(.2,.2,.01),i),[.15,0,.15],[-Math.PI/2,0,0]]]},M={START:[[new be(new Gi(.01,2),s),null,null,null,"helper"]],END:[[new be(new Gi(.01,2),s),null,null,null,"helper"]],DELTA:[[new On(y(),s),null,null,null,"helper"]],X:[[new On(f,s),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new On(f,s),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new On(f,s),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},b={XYZE:[[new be(E(.5,1),g),null,[0,Math.PI/2,0]]],X:[[new be(E(.5,.5),a)]],Y:[[new be(E(.5,.5),r),null,[0,0,-Math.PI/2]]],Z:[[new be(E(.5,.5),o),null,[0,Math.PI/2,0]]],E:[[new be(E(.75,1),h),null,[0,Math.PI/2,0]]]},x={AXIS:[[new On(f,s),[-1e3,0,0],null,[1e6,1,1],"helper"]]},v={XYZE:[[new be(new ks(.25,10,8),i)]],X:[[new be(new gi(.5,.1,4,24),i),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new be(new gi(.5,.1,4,24),i),[0,0,0],[Math.PI/2,0,0]]],Z:[[new be(new gi(.5,.1,4,24),i),[0,0,0],[0,0,-Math.PI/2]]],E:[[new be(new gi(.75,.1,2,24),i)]]},A={X:[[new be(p,a),[.5,0,0],[0,0,-Math.PI/2]],[new be(w,a),[0,0,0],[0,0,-Math.PI/2]],[new be(p,a),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new be(p,r),[0,.5,0]],[new be(w,r)],[new be(p,r),[0,-.5,0],[0,0,Math.PI]]],Z:[[new be(p,o),[0,0,.5],[Math.PI/2,0,0]],[new be(w,o),[0,0,0],[Math.PI/2,0,0]],[new be(p,o),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new be(new Tt(.15,.15,.01),d),[.15,.15,0]]],YZ:[[new be(new Tt(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new be(new Tt(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new be(new Tt(.1,.1,.1),u)]]},I={X:[[new be(new $t(.2,0,.6,4),i),[.3,0,0],[0,0,-Math.PI/2]],[new be(new $t(.2,0,.6,4),i),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new be(new $t(.2,0,.6,4),i),[0,.3,0]],[new be(new $t(.2,0,.6,4),i),[0,-.3,0],[0,0,Math.PI]]],Z:[[new be(new $t(.2,0,.6,4),i),[0,0,.3],[Math.PI/2,0,0]],[new be(new $t(.2,0,.6,4),i),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new be(new Tt(.2,.2,.01),i),[.15,.15,0]]],YZ:[[new be(new Tt(.2,.2,.01),i),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new be(new Tt(.2,.2,.01),i),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new be(new Tt(.2,.2,.2),i),[0,0,0]]]},P={X:[[new On(f,s),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new On(f,s),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new On(f,s),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function O(N){const z=new Dt;for(const B in N)for(let H=N[B].length;H--;){const Y=N[B][H][0].clone(),de=N[B][H][1],ge=N[B][H][2],Ue=N[B][H][3],He=N[B][H][4];Y.name=B,Y.tag=He,de&&Y.position.set(de[0],de[1],de[2]),ge&&Y.rotation.set(ge[0],ge[1],ge[2]),Ue&&Y.scale.set(Ue[0],Ue[1],Ue[2]),Y.updateMatrix();const We=Y.geometry.clone();We.applyMatrix4(Y.matrix),Y.geometry=We,Y.renderOrder=1/0,Y.position.set(0,0,0),Y.rotation.set(0,0,0),Y.scale.set(1,1,1),z.add(Y)}return z}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=O(T)),this.add(this.gizmo.rotate=O(b)),this.add(this.gizmo.scale=O(A)),this.add(this.picker.translate=O(S)),this.add(this.picker.rotate=O(v)),this.add(this.picker.scale=O(I)),this.add(this.helper.translate=O(M)),this.add(this.helper.rotate=O(x)),this.add(this.helper.scale=O(P)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(e){const i=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:Ca;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let s=[];s=s.concat(this.picker[this.mode].children),s=s.concat(this.gizmo[this.mode].children),s=s.concat(this.helper[this.mode].children);for(let a=0;a<s.length;a++){const r=s[a];r.visible=!0,r.rotation.set(0,0,0),r.position.copy(this.worldPosition);let o;if(this.camera.isOrthographicCamera?o=(this.camera.top-this.camera.bottom)/this.camera.zoom:o=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),r.scale.set(1,1,1).multiplyScalar(o*this.size/4),r.tag==="helper"){r.visible=!1,r.name==="AXIS"?(r.visible=!!this.axis,this.axis==="X"&&(Mt.setFromEuler(va.set(0,0,0)),r.quaternion.copy(i).multiply(Mt),Math.abs(vt.copy(xs).applyQuaternion(i).dot(this.eye))>.9&&(r.visible=!1)),this.axis==="Y"&&(Mt.setFromEuler(va.set(0,0,Math.PI/2)),r.quaternion.copy(i).multiply(Mt),Math.abs(vt.copy(fi).applyQuaternion(i).dot(this.eye))>.9&&(r.visible=!1)),this.axis==="Z"&&(Mt.setFromEuler(va.set(0,Math.PI/2,0)),r.quaternion.copy(i).multiply(Mt),Math.abs(vt.copy(ys).applyQuaternion(i).dot(this.eye))>.9&&(r.visible=!1)),this.axis==="XYZE"&&(Mt.setFromEuler(va.set(0,Math.PI/2,0)),vt.copy(this.rotationAxis),r.quaternion.setFromRotationMatrix(xc.lookAt(vc,vt,fi)),r.quaternion.multiply(Mt),r.visible=this.dragging),this.axis==="E"&&(r.visible=!1)):r.name==="START"?(r.position.copy(this.worldPositionStart),r.visible=this.dragging):r.name==="END"?(r.position.copy(this.worldPosition),r.visible=this.dragging):r.name==="DELTA"?(r.position.copy(this.worldPositionStart),r.quaternion.copy(this.worldQuaternionStart),jt.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),jt.applyQuaternion(this.worldQuaternionStart.clone().invert()),r.scale.copy(jt),r.visible=this.dragging):(r.quaternion.copy(i),this.dragging?r.position.copy(this.worldPositionStart):r.position.copy(this.worldPosition),this.axis&&(r.visible=this.axis.search(r.name)!==-1));continue}r.quaternion.copy(i),this.mode==="translate"||this.mode==="scale"?(r.name==="X"&&Math.abs(vt.copy(xs).applyQuaternion(i).dot(this.eye))>.99&&(r.scale.set(1e-10,1e-10,1e-10),r.visible=!1),r.name==="Y"&&Math.abs(vt.copy(fi).applyQuaternion(i).dot(this.eye))>.99&&(r.scale.set(1e-10,1e-10,1e-10),r.visible=!1),r.name==="Z"&&Math.abs(vt.copy(ys).applyQuaternion(i).dot(this.eye))>.99&&(r.scale.set(1e-10,1e-10,1e-10),r.visible=!1),r.name==="XY"&&Math.abs(vt.copy(ys).applyQuaternion(i).dot(this.eye))<.2&&(r.scale.set(1e-10,1e-10,1e-10),r.visible=!1),r.name==="YZ"&&Math.abs(vt.copy(xs).applyQuaternion(i).dot(this.eye))<.2&&(r.scale.set(1e-10,1e-10,1e-10),r.visible=!1),r.name==="XZ"&&Math.abs(vt.copy(fi).applyQuaternion(i).dot(this.eye))<.2&&(r.scale.set(1e-10,1e-10,1e-10),r.visible=!1)):this.mode==="rotate"&&(xa.copy(i),vt.copy(this.eye).applyQuaternion(Mt.copy(i).invert()),r.name.search("E")!==-1&&r.quaternion.setFromRotationMatrix(xc.lookAt(this.eye,vc,fi)),r.name==="X"&&(Mt.setFromAxisAngle(xs,Math.atan2(-vt.y,vt.z)),Mt.multiplyQuaternions(xa,Mt),r.quaternion.copy(Mt)),r.name==="Y"&&(Mt.setFromAxisAngle(fi,Math.atan2(vt.x,vt.z)),Mt.multiplyQuaternions(xa,Mt),r.quaternion.copy(Mt)),r.name==="Z"&&(Mt.setFromAxisAngle(ys,Math.atan2(vt.y,vt.x)),Mt.multiplyQuaternions(xa,Mt),r.quaternion.copy(Mt))),r.visible=r.visible&&(r.name.indexOf("X")===-1||this.showX),r.visible=r.visible&&(r.name.indexOf("Y")===-1||this.showY),r.visible=r.visible&&(r.name.indexOf("Z")===-1||this.showZ),r.visible=r.visible&&(r.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),r.material._color=r.material._color||r.material.color.clone(),r.material._opacity=r.material._opacity||r.material.opacity,r.material.color.copy(r.material._color),r.material.opacity=r.material._opacity,this.enabled&&this.axis&&(r.name===this.axis?(r.material.color.copy(this.materialLib.active.color),r.material.opacity=1):this.axis.split("").some(function(l){return r.name===l})&&(r.material.color.copy(this.materialLib.active.color),r.material.opacity=1))}super.updateMatrixWorld(e)}}class Uv extends be{constructor(){super(new zs(1e5,1e5,2,2),new Ba({visible:!1,wireframe:!0,side:mn,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(e){let t=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(t="local"),ya.copy(xs).applyQuaternion(t==="local"?this.worldQuaternion:Ca),ps.copy(fi).applyQuaternion(t==="local"?this.worldQuaternion:Ca),fs.copy(ys).applyQuaternion(t==="local"?this.worldQuaternion:Ca),vt.copy(ps),this.mode){case"translate":case"scale":switch(this.axis){case"X":vt.copy(this.eye).cross(ya),bn.copy(ya).cross(vt);break;case"Y":vt.copy(this.eye).cross(ps),bn.copy(ps).cross(vt);break;case"Z":vt.copy(this.eye).cross(fs),bn.copy(fs).cross(vt);break;case"XY":bn.copy(fs);break;case"YZ":bn.copy(ya);break;case"XZ":vt.copy(fs),bn.copy(ps);break;case"XYZ":case"E":bn.set(0,0,0);break}break;case"rotate":default:bn.set(0,0,0)}bn.length()===0?this.quaternion.copy(this.cameraQuaternion):(yc.lookAt(jt.set(0,0,0),bn,vt),this.quaternion.setFromRotationMatrix(yc)),super.updateMatrixWorld(e)}}function bc(n,e,t){var s,a;if(n.dimension==="2d"&&e===2)return 0;if(n.mesh_type==="explicit"&&((s=n.mesh_coordinates)!=null&&s[e])){const r=n.mesh_coordinates[e];let o=0,l=r.length-1;for(;l-o>1;){const c=o+l>>1;r[c]<t?o=c:l=c}return Math.abs(r[o]-t)<=Math.abs(r[l]-t)?r[o]:r[l]}const i=((a=n.mesh_steps)==null?void 0:a[e])??n.mesh;return Math.round(t/i)*i}function Nv(n,e,t){var r,o,l;if(n.dimension==="2d"&&e===2)return 0;const i=(r=n.boundaries)==null?void 0:r["xyz"[e]+"_"+t];if(i&&i.kind!=="pml")return 0;const s=(i==null?void 0:i.layers)??n.pml_cells,a=(o=n.mesh_coordinates)==null?void 0:o[e];return n.mesh_type==="explicit"&&a?t==="min"?a[s]-a[0]:a.at(-1)-a.at(-s-1):s*(((l=n.mesh_steps)==null?void 0:l[e])??n.mesh)}function Fv(n,e,t,i){n.mesh_type??(n.mesh_type="uniform"),n.material_sampling??(n.material_sampling="cell"),n.interface_method??(n.interface_method="staircase"),n.subpixel_quadrature??(n.subpixel_quadrature=8),n.mesh_max??(n.mesh_max=.15),n.mesh_grading??(n.mesh_grading=1.25),n.mesh_ppw??(n.mesh_ppw=24),n.mesh_auto_refine??(n.mesh_auto_refine=!0),n.mesh_refinements??(n.mesh_refinements=[]);const s=n.mesh_type==="graded",a=n.mesh_type==="explicit",r=!!n.mesh_steps;return t("mesh type","mesh_type",n.mesh_type,[["uniform","Uniform"],["graded","Graded · local refinement"],...a?[["explicit","Explicit node arrays"]]:[]])+(a?'<p class="property-help">Frozen node arrays. Geometry edits keep these nodes. Edit the arrays or select a generated mesh to change the grid.</p>':`<label class="enabled-row"><input type="checkbox" data-axis-steps ${r?"checked":""}> Independent axis spacing</label>`+(r?n.mesh_steps.map((o,l)=>e("d"+"xyz"[l],`mesh_steps.${l}`,o,"µm",{min:.001})).join(""):e(s?"fine mesh step":"dx = dy = dz","mesh",n.mesh,"µm",{min:.001})))+t("interface method","interface_method",n.interface_method,[["staircase","Staircase"],["subpixel","Subpixel · experimental dielectric"]])+t("interface sampling","material_sampling",n.material_sampling,s||a||r||n.interface_method==="subpixel"?[["yee","Yee component locations"]]:[["cell","Cell centers (legacy)"],["yee","Yee component locations"]])+(n.interface_method==="subpixel"?e("face quadrature order","subpixel_quadrature",n.subpixel_quadrature,"",{min:2,max:32,step:1})+'<p class="property-help">Lossless dielectrics and constant spacing on each axis only. Compare quadrature orders and mesh refinement. Curved-interface accuracy is under validation, especially at high index contrast.</p>':"")+`<label class="enabled-row"><input type="checkbox" data-fixed-dt ${n.time_step_override?"checked":""}> Set a smaller fixed time step</label>`+(n.time_step_override?e("time step","time_step_override",n.time_step_override*1e15,"fs",{min:1e-6,scale:1e-15}):"")+(s?e("maximum step","mesh_max",n.mesh_max,"µm",{min:n.mesh})+e("grading factor","mesh_grading",n.mesh_grading,"",{min:1.05})+e("background cells / λ","mesh_ppw",n.mesh_ppw,"",{min:6})+`<label class="enabled-row"><input type="checkbox" data-path="mesh_auto_refine" ${n.mesh_auto_refine?"checked":""}> Refine structures, sources and monitors</label><p class="property-help">Fine spacing is retained in refinement regions and PML. The wavelength setting caps the background step. The timestep stays fixed by the fine spacing.</p>`+n.mesh_refinements.map((o,l)=>`<details class="boundary-options"><summary>${i(o.name)}</summary><label class="enabled-row"><input type="checkbox" data-path="mesh_refinements.${l}.enabled" ${o.enabled?"checked":""}> Enabled</label>${o.center.map((c,d)=>e("xyz"[d],`mesh_refinements.${l}.center.${d}`,c,"µm")).join("")}${o.size.map((c,d)=>e("xyz"[d]+" span",`mesh_refinements.${l}.size.${d}`,c,"µm",{min:.001})).join("")}<button data-action="mesh-remove" data-index="${l}">Remove refinement</button></details>`).join("")+'<button data-action="mesh-add">+ Add refinement region</button><button data-action="mesh-freeze">Freeze automatic refinements</button>':"")+`<button data-action="mesh-nodes">Edit explicit node arrays</button><button data-action="mesh-preview">Preview simulation mesh</button><p class="property-help">Yee sampling places materials at each electric field component. ${n.interface_method==="subpixel"?"Subpixel also couples neighboring components across interfaces. The permittivity image shows only the reciprocal diagonal of that operator.":"Staircase interfaces follow the grid."} Test mesh convergence for the required accuracy.</p>`}function Ov({state:n,api:e,esc:t,commit:i}){const s=document.createElement("dialog");s.className="mesh-dialog",document.body.append(s);let a,r="xy";const o=c=>s.querySelector(c);function l(){const c=o("canvas"),d=c.getContext("2d");c.width=1e3,c.height=600;const[u,h]=[...r].map(M=>"xyz".indexOf(M)),m=a.nodes_um,g=m[u],_=m[h],p=g.at(-1)-g[0],f=_.at(-1)-_[0],w=Math.min(880/p,480/f),E=(1e3-p*w)/2,y=(600-f*w)/2,T=M=>E+(M-g[0])*w,S=M=>y+(_.at(-1)-M)*w;d.fillStyle="#101c2b",d.fillRect(0,0,1e3,600);for(const M of a.refinements)d.fillStyle="rgba(71,191,169,.13)",d.fillRect(T(M.center[u]-M.size[u]/2),S(M.center[h]+M.size[h]/2),M.size[u]*w,M.size[h]*w);d.save(),d.beginPath(),d.rect(E,y,p*w,f*w),d.clip(),d.strokeStyle="#7087a56e",d.lineWidth=.7,d.beginPath();for(const M of g)d.moveTo(T(M),y),d.lineTo(T(M),y+f*w);for(const M of _)d.moveTo(E,S(M)),d.lineTo(E+p*w,S(M));d.stroke();for(const M of a.structures)d.strokeStyle="#ecb86a",d.lineWidth=2,d.strokeRect(T(M.center[u]-M.size[u]/2),S(M.center[h]+M.size[h]/2),M.size[u]*w,M.size[h]*w);d.restore(),d.fillStyle="#d9e7f5",d.font="15px system-ui",d.textAlign="center",d.fillText(`${r[0]} (µm) · ${g[0].toPrecision(4)} … ${g.at(-1).toPrecision(4)}`,500,585),d.save(),d.translate(20,300),d.rotate(-Math.PI/2),d.fillText(`${r[1]} (µm) · ${_[0].toPrecision(4)} … ${_.at(-1).toPrecision(4)}`,0,0),d.restore()}return{async open(){a=await e("/mesh/preview",n.project);const c=a.summary;s.innerHTML=`<div class="fsp-heading"><h2>Simulation mesh</h2><button data-dismiss>Close</button></div><div class="mesh-metrics"><strong>${c.shape.join(" × ")} cells</strong><span>${c.cell_reduction_percent.toFixed(1)}% fewer cells than uniform</span><span>~${c.estimated_memory_mb} MB · Δt ${c.dt_fs.toFixed(4)} fs</span></div><label>Projection <select aria-label="Mesh projection">${(n.project.region.dimension==="2d"?["xy"]:["xy","xz","yz"]).map(d=>`<option>${d}</option>`).join("")}</select></label><canvas aria-label="Simulation mesh grid"></canvas><p>Gold: structure bounds. Green: refinement bounds projected onto this view. Grid lines show actual cell boundaries${a.preview_decimated?" (preview decimated to 1,000 lines per axis)":""}. Refinements extend across coordinate planes.</p><p>Step range: ${c.axis_min_step_um.map((d,u)=>`${"xyz"[u]} ${d.toPrecision(4)}–${c.axis_max_step_um[u].toPrecision(4)} µm`).join(" · ")}. Largest adjacent ratio: ${c.max_adjacent_ratio.toFixed(3)}.</p>`,r="xy",o("[data-dismiss]").onclick=()=>s.close(),o("select").onchange=d=>{r=d.target.value,l()},s.showModal(),l()},async freeze(){const c=await e("/mesh/freeze",n.project);i(c)},async editNodes(){const{nodes_um:c}=await e("/mesh/coordinates",n.project);s.innerHTML='<div class="fsp-heading"><h2>Explicit mesh nodes</h2><button data-dismiss>Close</button></div><p>Coordinates in µm. Each axis must increase strictly and be centered on zero. Array endpoints set the domain spans. In 2D, z needs exactly two endpoints. Changing geometry will keep this grid.</p>'+c.map((d,u)=>`<label>${"xyz"[u]} nodes (µm)<textarea aria-label="${"xyz"[u]} mesh nodes" data-node-axis="${u}" rows="5" style="width:100%">${d.join(", ")}</textarea></label>`).join("")+'<p data-node-error role="alert"></p><button data-apply-nodes>Apply node arrays</button>',o("[data-dismiss]").onclick=()=>s.close(),o("[data-apply-nodes]").onclick=async()=>{try{const d=[...s.querySelectorAll("[data-node-axis]")].map(m=>m.value.trim().split(/[\s,]+/).filter(Boolean).map(Number));if(d.some(m=>m.length<2||m.some(g=>!Number.isFinite(g))))throw Error("Enter at least two finite numbers for each axis.");const u=structuredClone(n.project);Object.assign(u.region,{mesh_type:"explicit",mesh_steps:null,mesh_coordinates:d,size:d.map(m=>m.at(-1)-m[0]),material_sampling:"yee",mesh_auto_refine:!1});const h=await e("/validate",u);i(h.project),s.close()}catch(d){o("[data-node-error]").textContent=d.message}},s.showModal()},add(){const c=structuredClone(n.project);c.region.mesh_refinements.push({name:`Refinement ${c.region.mesh_refinements.length+1}`,center:[0,0,0],size:[1,1,1],enabled:!0}),i(c)},remove(c){const d=structuredClone(n.project);d.region.mesh_refinements.splice(c,1),i(d)}}}function Ha(n){return n.rotation??(n.rotation=0),n.rotation_axes??(n.rotation_axes=["z","x","y"]),n.rotation_angles??(n.rotation_angles=[0,0,0]),n.make_ellipsoid??(n.make_ellipsoid=!1),n.radius_2??(n.radius_2=.5),n.radius_3??(n.radius_3=.5),n.inner_radius_2??(n.inner_radius_2=.3),n.theta_start??(n.theta_start=0),n.theta_stop??(n.theta_stop=360),n.vertices??(n.vertices=[[-.5,-.5],[.5,-.5],[0,.5]]),n.holes??(n.holes=[]),n}function zv(n){const e=new mt().makeRotationZ((n.rotation||0)*Math.PI/180);return(n.rotation_axes||["z","x","y"]).forEach((t,i)=>{var a;if(t==="none")return;const s=new U;s.setComponent("xyz".indexOf(t),1),e.premultiply(new mt().makeRotationAxis(s,(((a=n.rotation_angles)==null?void 0:a[i])||0)*Math.PI/180))}),e}function kv(n){const e=n.radius,t=n.make_ellipsoid?n.radius_2:e,i=n.make_ellipsoid?n.radius_3:e;if(n.kind==="rectangle")return new Tt(...n.size);if(n.kind==="sphere")return new ks(1,48,32).scale(e,t,i);if(n.kind==="circle")return new $t(1,1,n.size[2],96).rotateX(Math.PI/2).scale(e,t,1);let s;if(n.kind==="polygon"){s=new Ta(n.vertices.map(a=>new ae(...a)));for(const a of n.holes||[])s.holes.push(new Na(a.map(r=>new ae(...r))))}else if(n.kind==="ring"){const a=(n.theta_stop??360)-(n.theta_start??0),r=(a%360+360)%360||360,o=r===360,l=Math.max(3,Math.ceil(96*r/360)),c=(h,m)=>Array.from({length:o?l:l+1},(g,_)=>{const p=((n.theta_start??0)+r*_/l)*Math.PI/180,f=Math.cos(p),w=Math.sin(p),E=1/Math.sqrt((f/h)**2+(w/m)**2);return new ae(E*f,E*w)}),d=c(e,t),u=n.inner_radius>0?c(n.inner_radius,n.make_ellipsoid?n.inner_radius_2:n.inner_radius):[];o?(s=new Ta(d),u.length&&s.holes.push(new Na(u.reverse()))):s=new Ta([...d,...u.length?u.reverse():[new ae(0,0)]])}if(!s)throw Error("Unsupported CAD solid: "+n.kind);return new qo(s,{depth:n.size[2],steps:1,bevelEnabled:!1}).translate(0,0,-n.size[2]/2)}const hi=new Map;function bd(n){Ha(n);const e=JSON.stringify([n.kind,n.size,n.radius,n.inner_radius,n.make_ellipsoid,n.radius_2,n.radius_3,n.inner_radius_2,n.theta_start,n.theta_stop,n.vertices,n.holes,n.rotation,n.rotation_axes,n.rotation_angles]);if(hi.has(e))return hi.get(e);const t=kv(n).applyMatrix4(zv(n)),i=t.index?t.toNonIndexed():t.clone(),s=new wo(t,20),a={geometry:t,points:Array.from(i.attributes.position.array),edges:Array.from(s.attributes.position.array),projections:{}};if(i.dispose(),s.dispose(),hi.set(e,a),hi.size>128){const r=hi.keys().next().value;hi.get(r).geometry.dispose(),hi.delete(r)}return a}function Bv(n){return bd(n).geometry.clone()}function Sd(n,e){const t=bd(n),i=e.join("");if(t.projections[i])return t.projections[i];const s=[],a=[];let r=1/0,o=-1/0;for(let l=0;l<t.points.length;l+=9){const c=[0,3,6].map(u=>[t.points[l+u+e[0]],t.points[l+u+e[1]]]),d=(c[1][0]-c[0][0])*(c[2][1]-c[0][1])-(c[1][1]-c[0][1])*(c[2][0]-c[0][0]);if(!(Math.abs(d)<1e-18)){d<0&&([c[1],c[2]]=[c[2],c[1]]),s.push(c);for(const u of c)r=Math.min(r,u[1]),o=Math.max(o,u[1])}}for(let l=0;l<t.edges.length;l+=6)a.push([0,3].map(c=>[t.edges[l+c+e[0]],t.edges[l+c+e[1]]]));return t.projections[i]={triangles:s,edges:a,low:r,high:o}}function $v(n,e,t,i){const s=[e[0]-n.center[t[0]],e[1]-n.center[t[1]]],a=Sd(n,t);return a.triangles.some(r=>r.every((o,l)=>{const c=r[(l+1)%3];return(c[0]-o[0])*(s[1]-o[1])-(c[1]-o[1])*(s[0]-o[0])>=-1e-12}))?!0:a.edges.some(([r,o])=>{const l=o[0]-r[0],c=o[1]-r[1],d=l*l+c*c,u=d?Math.max(0,Math.min(1,((s[0]-r[0])*l+(s[1]-r[1])*c)/d)):0;return Math.hypot(s[0]-r[0]-u*l,s[1]-r[1]-u*c)<=i})}function Hv(n,e){Ha(n);let t="";return["circle","sphere","ring"].includes(n.kind)&&(t+=`<label class="enabled-row"><input type="checkbox" data-path="make_ellipsoid" ${n.make_ellipsoid?"checked":""}> Elliptical radii</label>`,n.make_ellipsoid&&(t+=e("radius 2","radius_2",n.radius_2,"µm",{min:.001})+(n.kind==="sphere"?e("radius 3","radius_3",n.radius_3,"µm",{min:.001}):"")+(n.kind==="ring"?e("inner radius 2","inner_radius_2",n.inner_radius_2,"µm",{min:0}):""))),n.kind==="ring"&&(t+=e("theta start","theta_start",n.theta_start,"deg")+e("theta stop","theta_stop",n.theta_stop,"deg")+'<p class="property-help">Counterclockwise arc in the local XY plane, wrapping through 360°. Angles are polar angles even for elliptical rings.</p>'),n.kind==="polygon"&&(t+=`<button data-action="geometry-vertices">Edit polygon vertices</button><p class="property-help">${n.vertices.length} local XY vertices${n.holes.length?` and ${n.holes.length} hole contour${n.holes.length>1?"s":""}`:""}, extruded along local z. Holes are simple contours strictly inside the outer contour.</p>`),t}function Gv(n,e,t){return Ha(n),e("z rotation","rotation",n.rotation,"deg")+n.rotation_axes.map((i,s)=>t(["first","second","third"][s]+" axis",`rotation_axes.${s}`,i,["none","x","y","z"])+e("rotation "+(s+1),`rotation_angles.${s}`,n.rotation_angles[s],"deg")).join("")+'<p class="property-help">Right-handed rotations about fixed world axes. Apply the legacy z angle, then rotations 1, 2 and 3 about the object center. CAD views show projections. A 2D calculation samples z = 0.</p>'}function Vv({state:n,api:e,esc:t,commit:i}){const s=document.createElement("dialog");return s.className="geometry-dialog",document.body.append(s),{open(a){const r=n.project.structures.find(l=>l.id===a);if(!r||r.kind!=="polygon")return;const o=l=>l.map(c=>c.join(", ")).join(`
`);s.innerHTML=`<div class="fsp-heading"><h2>Polygon vertices</h2><button data-dismiss>Close</button></div><p>Local x, y pairs in µm, one pair per line. Clockwise or counterclockwise. Do not repeat the first vertex. A blank line starts a hole contour, which must lie strictly inside the outer contour.</p><textarea aria-label="Polygon vertices" rows="12" style="width:100%;font-family:monospace">${t([r.vertices,...r.holes||[]].map(o).join(`

`))}</textarea><p role="alert"></p><button data-apply>Apply vertices</button>`,s.querySelector("[data-dismiss]").onclick=()=>s.close(),s.querySelector("[data-apply]").onclick=async()=>{try{const l=s.querySelector("textarea").value.split(/\r?\n[ \t]*(?:\r?\n[ \t]*)+/).map(m=>m.trim()).filter(Boolean);if(!l.length)throw Error("Enter at least three vertex rows.");const[c,...d]=l.map(m=>m.split(/\r?\n/).map(g=>g.trim().split(/[\s,]+/).map(Number)));if([c,...d].some(m=>m.some(g=>g.length!==2||g.some(_=>!Number.isFinite(_)))))throw Error("Each row needs two finite numbers.");const u=structuredClone(n.project);Object.assign(u.structures.find(m=>m.id===a),{vertices:c,holes:d});const h=await e("/validate",u);i(h.project),s.close()}catch(l){s.querySelector('[role="alert"]').textContent=l.message}},s.showModal()}}}const Nn={region:"#d2a129",source:"#d44955",monitor:"#e3a72c",selected:"#187be7"};class Wv{constructor(e,t,i,s,a){this.state=t,this.select=i,this.change=s,this.edited=a,this.zoom={xy:1,xz:1,yz:1},this.canvases={},e.innerHTML=["xy","perspective","xz","yz"].map(r=>`<div class="viewport ${r}" data-view="${r}"><div class="view-label">${r==="perspective"?"Perspective":r.toUpperCase()+" plane"}<span>${r==="perspective"?"Orbit · left drag / Pan · right drag":"Select · drag to move / scroll to zoom"}</span></div>${r!=="perspective"?"<canvas></canvas>":'<div class="three-view"></div>'}</div>`).join("");for(const[r,o]of Object.entries({xy:[0,1],xz:[0,2],yz:[1,2]})){const l=e.querySelector(`.${r} canvas`);this.canvases[r]={canvas:l,axes:o},l.addEventListener("wheel",c=>{c.preventDefault(),this.zoom[r]=Math.max(.5,Math.min(8,this.zoom[r]*Math.exp(-c.deltaY*.001))),this.draw2d(r)},{passive:!1}),l.addEventListener("pointerdown",c=>this.down(c,r)),l.addEventListener("pointermove",c=>this.move(c,r)),l.addEventListener("pointerup",c=>this.up(c,r)),l.addEventListener("dblclick",()=>{var c;return(c=document.querySelector("#properties input"))==null?void 0:c.focus()})}this.initThree(e.querySelector(".three-view")),this.resizeObserver=new ResizeObserver(()=>this.render()),this.resizeObserver.observe(e)}objects(){const e=this.state.project;return[...e.structures.map(t=>({...t,category:"structure"})),...e.sources.map(t=>({...t,category:"source"})),...e.monitors.map(t=>({...t,category:"monitor"}))]}bounds(e){return e.kind==="sphere"?[e.radius*2,e.radius*2,e.radius*2]:["circle","ring"].includes(e.kind)?[e.radius*2,e.radius*2,e.size[2]]:e.size||[.12,.12,.12]}metrics(e){const{canvas:t,axes:i}=this.canvases[e],s=t.getBoundingClientRect(),a=this.state.project.region.size;return{w:s.width,h:s.height,scale:Math.min((s.width-65)/a[i[0]],(s.height-50)/a[i[1]])*.84*this.zoom[e],axes:i}}world(e,t){const{canvas:i}=this.canvases[t],s=i.getBoundingClientRect(),a=this.metrics(t);return[(e.clientX-s.left-a.w/2)/a.scale,-(e.clientY-s.top-a.h/2)/a.scale]}hit(e,t,i,s){if(e.category==="structure")return $v(e,t,i,s);const a=this.bounds(e);let r=t[0]-e.center[i[0]],o=t[1]-e.center[i[1]];if(i[0]===0&&i[1]===1&&e.category==="structure"){if(["circle","sphere","ring"].includes(e.kind)){const c=Math.hypot(r,o);return c<=e.radius+s&&(e.kind!=="ring"||c>=e.inner_radius-s)}const l=(e.rotation||0)*Math.PI/180;[r,o]=[Math.cos(l)*r+Math.sin(l)*o,-Math.sin(l)*r+Math.cos(l)*o]}return Math.abs(r)<=Math.max(a[i[0]]/2,s)&&Math.abs(o)<=Math.max(a[i[1]]/2,s)}down(e,t){if(e.button!==0)return;const i=this.metrics(t),s=this.world(e,t),r=this.objects().filter(l=>l.enabled).reverse().find(l=>this.hit(l,s,i.axes,7/i.scale)),o=e.ctrlKey||e.metaKey;this.select((r==null?void 0:r.id)||"fdtd",o),r&&!o&&this.state.mode==="layout"&&(this.drag={id:r.id,start:s,center:[...r.center],axes:i.axes,name:t,moved:!1},e.target.setPointerCapture(e.pointerId))}move(e,t){if(!this.drag||this.drag.name!==t)return;const i=this.world(e,t),s=this.drag,a=this.state.project,r=[...s.center];s.axes.forEach((o,l)=>{if(o===2&&a.region.dimension==="2d")return;const c=s.center[o]+i[l]-s.start[l];r[o]=this.state.snap?bc(a.region,o,c):c}),!(!s.moved&&Math.hypot(i[0]-s.start[0],i[1]-s.start[1])<.02)&&(s.moved||this.edited(),s.moved=!0,this.change(s.id,{center:r},!1),this.render())}up(){var e;(e=this.drag)!=null&&e.moved&&this.change(this.drag.id,{},!0),this.drag=null}draw2d(e){var M;const{canvas:t,axes:i}=this.canvases[e],s=this.metrics(e),a=this.state.project;if(s.w<1||s.h<1)return;const r=window.devicePixelRatio||1;t.width=s.w*r,t.height=s.h*r;const o=t.getContext("2d");o.scale(r,r),o.fillStyle="#fafbfd",o.fillRect(0,0,s.w,s.h);const l=b=>s.w/2+b*s.scale,c=b=>s.h/2-b*s.scale,d=45/s.scale,u=10**Math.floor(Math.log10(d)),h=[1,2,5,10].find(b=>b*u>=d)*u,m=Math.max(0,-Math.floor(Math.log10(h)));o.font="10px ui-monospace, monospace",o.textAlign="center";for(let b=0;b<2;b++){const x=(b===0?s.w:s.h)/s.scale;for(let v=Math.ceil(-x/2/h)*h;v<=x/2;v+=h){const A=b===0?l(v):c(v);o.strokeStyle=Math.abs(v)<1e-7?"#bac8d8":"#e6ebf2",o.lineWidth=1,o.beginPath(),b===0?(o.moveTo(A,0),o.lineTo(A,s.h),o.fillStyle="#8b98a9",o.fillText(v.toFixed(m),A,s.h-9)):(o.moveTo(0,A),o.lineTo(s.w,A),o.fillStyle="#8b98a9",o.fillText(v.toFixed(m),18,A-4)),o.stroke()}}const g=a.region.size[i[0]]*s.scale,_=a.region.size[i[1]]*s.scale,p=s.w/2-g/2,f=s.h/2-_/2;o.fillStyle="#f0c85612",o.fillRect(p,f,g,_),o.strokeStyle=Nn.region,o.setLineDash([6,4]),o.strokeRect(p,f,g,_),o.setLineDash([]);const w=(b,x)=>Nv(a.region,b,x)*s.scale,E=w(i[0],"min"),y=w(i[0],"max"),T=w(i[1],"min"),S=w(i[1],"max");o.fillStyle="#d8ae3d12",o.fillRect(p,f,g,S),o.fillRect(p,f+_-T,g,T),o.fillRect(p,f,E,_),o.fillRect(p+g-y,f,y,_);for(const b of this.objects()){if(!b.enabled)continue;const x=this.bounds(b),v=l(b.center[i[0]]),A=c(b.center[i[1]]),I=Math.max(x[i[0]]*s.scale,3),P=Math.max(x[i[1]]*s.scale,3),O=b.id===this.state.selected||((M=this.state.multi)==null?void 0:M.includes(b.id)),N=a.materials.find(z=>z.name===b.material);if(o.save(),o.translate(v,A),o.strokeStyle=O?Nn.selected:b.category==="source"?Nn.source:b.category==="monitor"?Nn.monitor:(N==null?void 0:N.color)||"#69a1e8",o.lineWidth=O?2:1.5,o.fillStyle=b.kind==="tfsf"?"#3ba89710":b.category==="structure"?((N==null?void 0:N.color)||"#69a1e8")+"55":"#ffffff88",o.beginPath(),b.kind==="tfsf"&&o.setLineDash([5,3]),b.category==="structure"){const z=Sd(b,i);for(const B of z.triangles){o.moveTo(B[0][0]*s.scale,-B[0][1]*s.scale);for(const H of B.slice(1))o.lineTo(H[0]*s.scale,-H[1]*s.scale);o.closePath()}o.fill(),o.beginPath();for(const[B,H]of z.edges)o.moveTo(B[0]*s.scale,-B[1]*s.scale),o.lineTo(H[0]*s.scale,-H[1]*s.scale);o.stroke(),O&&(o.fillStyle=Nn.selected,o.font="11px Inter,Segoe UI,sans-serif",o.fillText(b.name,0,-z.high*s.scale-9))}else if(b.category==="monitor"&&b.kind!=="field")o.moveTo(-7,0),o.lineTo(7,0),o.moveTo(0,-7),o.lineTo(0,7),o.stroke(),o.beginPath(),o.arc(0,0,4,0,2*Math.PI),o.stroke();else if(b.category==="source"&&b.kind==="point")o.arc(0,0,5,0,2*Math.PI),o.fillStyle=Nn.source,o.fill(),o.stroke();else if(e==="xy"&&["circle","ring"].includes(b.kind)||b.kind==="sphere"?(o.ellipse(0,0,I/2,P/2,0,0,Math.PI*2),b.kind==="ring"&&o.ellipse(0,0,b.inner_radius*s.scale,b.inner_radius*s.scale,0,0,Math.PI*2,!0)):o.rect(-I/2,-P/2,I,P),o.fill("evenodd"),o.stroke(),b.category==="source"&&b.kind==="plane"){const z=b.size.findIndex((Y,de)=>Y===0&&(a.region.dimension==="3d"||de<2)),B=b.injection==="oneway"?b.normal||"x":z>=0?"xyz"[z]:b.normal||"x",H="xyz".indexOf(B);if(i.includes(H)){const Y=i[0]===H,de=b.injection==="oneway"?[b.direction==="-"?-1:1]:[1,-1];o.lineWidth=1.5,o.fillStyle=o.strokeStyle;for(const ge of de){const Ue=Y?ge:0,He=Y?0:-ge,We=16;o.beginPath(),o.moveTo(0,0),o.lineTo(Ue*We,He*We),o.stroke(),o.beginPath(),o.moveTo(Ue*We,He*We),o.lineTo(Ue*(We-6)+He*4,He*(We-6)-Ue*4),o.lineTo(Ue*(We-6)-He*4,He*(We-6)+Ue*4),o.closePath(),o.fill()}}}O&&b.category!=="structure"&&(o.fillStyle="#187be7",o.font="11px Inter,Segoe UI,sans-serif",o.fillText(b.name,0,-P/2-9)),o.restore()}o.fillStyle="#617187",o.textAlign="right",o.font="10px Segoe UI",o.fillText(`${"xyz"[i[0]]} / ${"xyz"[i[1]]} (µm)`,s.w-10,s.h-9),a.region.dimension==="2d"&&e!=="xy"&&(o.fillStyle="#8591a2",o.textAlign="left",o.fillText("2D: simulation at z = 0",10,18))}initThree(e){this.host=e,this.scene=new Nh,this.scene.background=new Je("#f3f6fa"),this.camera=new dn(40,1,.01,1e3),this.camera.up.set(0,0,1),this.camera.position.set(10,-12,10),this.renderer=new uv({antialias:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),e.appendChild(this.renderer.domElement),this.orbit=new pv(this.camera,this.renderer.domElement),this.orbit.enableDamping=!0,this.scene.add(new bp(16777215,10728907,2.5));const t=new Ep(16777215,2);t.position.set(5,-3,8),this.scene.add(t),this.scene.add(new Ap(1.5)),this.group=new gs,this.scene.add(this.group),this.transform=new Tv(this.camera,this.renderer.domElement),this.scene.add(this.transform.getHelper()),this.transform.addEventListener("dragging-changed",a=>{this.orbit.enabled=!a.value,a.value?this.edited():this.transform.object&&this.change(this.transform.object.userData.id,{},!0)}),this.transform.addEventListener("objectChange",()=>{const a=this.transform.object;if(!a)return;let r=a.position.toArray();this.state.snap&&(r=r.map((o,l)=>bc(this.state.project.region,l,o))),this.change(a.userData.id,{center:r},!1);for(const o of Object.keys(this.canvases))this.draw2d(o)});let i;this.renderer.domElement.addEventListener("pointerdown",a=>{i=[a.clientX,a.clientY]}),this.renderer.domElement.addEventListener("pointerup",a=>{if(!i||Math.hypot(a.clientX-i[0],a.clientY-i[1])>4||this.transform.axis)return;const r=e.getBoundingClientRect(),o=new pd;o.setFromCamera(new ae((a.clientX-r.left)/r.width*2-1,-(a.clientY-r.top)/r.height*2+1),this.camera);const l=o.intersectObjects(this.group.children,!0).find(c=>c.object.userData.id);l&&this.select(l.object.userData.id)});const s=()=>{requestAnimationFrame(s),this.orbit.update(),this.renderer.render(this.scene,this.camera)};s()}renderThree(){var r,o;if(this.transform.dragging)return;this.transform.detach(),this.group.traverse(l=>{var c;if((c=l.geometry)==null||c.dispose(),l.material)for(const d of Array.isArray(l.material)?l.material:[l.material])d.dispose()}),this.group.clear();const e=this.state.project,t=new Ua(new wo(new Tt(...e.region.size)),new Qi({color:Nn.region}));this.group.add(t);const i=new Tp(Math.max(...e.region.size)*1.4,20,"#b7c5d5","#dfe6ee");i.rotateX(Math.PI/2),i.position.z=-e.region.size[2]/2,this.group.add(i);for(const l of this.objects()){if(!l.enabled)continue;let c;l.category==="structure"?c=Bv(l):l.category==="monitor"&&l.kind!=="field"||l.kind==="point"?c=new ks(.07,12,8):c=new Tt(...(l.size||[.1,.1,.1]).map(h=>Math.max(h,.02)));const d=l.category==="source"?Nn.source:l.category==="monitor"?Nn.monitor:((r=e.materials.find(h=>h.name===l.material))==null?void 0:r.color)||"#69a1e8",u=new be(c,new vp({color:d,transparent:!0,opacity:l.kind==="tfsf"?.08:l.category==="structure"?.66:.9,roughness:.5,metalness:.08,side:mn}));u.position.fromArray(l.center),u.userData.id=l.id,u.add(new Ua(new wo(c),new Qi({color:l.id===this.state.selected||(o=this.state.multi)!=null&&o.includes(l.id)?"#147be7":d,transparent:!0,opacity:.7}))),this.group.add(u),l.id===this.state.selected&&this.state.mode==="layout"&&(this.transform.attach(u),this.transform.showZ=e.region.dimension!=="2d",this.transform.setTranslationSnap(this.state.snap&&!e.region.mesh_steps&&e.region.mesh_type!=="explicit"?e.region.mesh:null))}const{width:s,height:a}=this.host.getBoundingClientRect();s>0&&a>0&&(this.camera.aspect=s/a,this.camera.updateProjectionMatrix(),this.renderer.setSize(s,a))}fit(){this.zoom={xy:1,xz:1,yz:1};const e=Math.max(...this.state.project.region.size);this.camera.position.set(e*1.15,-e*1.4,e*1.05),this.orbit.target.set(0,0,0),this.render()}render(){for(const e of Object.keys(this.canvases))this.draw2d(e);this.renderThree()}}function jv(n,e,t,i,s=null,a="reduced field"){const r=n.getBoundingClientRect(),o=devicePixelRatio||1;n.width=r.width*o,n.height=r.height*o;const l=n.getContext("2d");if(l.scale(o,o),l.fillStyle="#f8fafc",l.fillRect(0,0,r.width,r.height),!(e!=null&&e.length)){l.fillStyle="#718196",l.font="14px Segoe UI",l.textAlign="center",l.fillText("Run a simulation to visualize the field",r.width/2,r.height/2);return}const c=e.length,d=e[0].length,u=document.createElement("canvas");u.width=c,u.height=d;const h=u.getContext("2d"),m=h.createImageData(c,d);let g=s||Math.max(...e.flat().map(Math.abs),1e-20);for(let y=0;y<c;y++)for(let T=0;T<d;T++){const S=Math.max(-1,Math.min(1,e[y][T]/g)),M=((d-1-T)*c+y)*4;m.data[M]=S>0?250:Math.round(246+S*210),m.data[M+1]=Math.round(248-Math.abs(S)*184),m.data[M+2]=S<0?250:Math.round(248-S*207),m.data[M+3]=255}h.putImageData(m,0,0);const _=Math.min((r.width-110)/t[0],(r.height-80)/t[1]),p=t[0]*_,f=t[1]*_,w=(r.width-p)/2,E=(r.height-f)/2;l.imageSmoothingEnabled=!1,l.drawImage(u,w,E,p,f),l.strokeStyle="#c4cfdb",l.strokeRect(w,E,p,f),l.fillStyle="#607086",l.font="11px ui-monospace,monospace",l.textAlign="center",l.fillText(`${-t[0]/2}`,w,E+f+18),l.fillText("0",w+p/2,E+f+18),l.fillText(`${t[0]/2} µm`,w+p,E+f+18),l.textAlign="right",l.fillText(`${t[1]/2}`,w-8,E+8),l.fillText(`${-t[1]/2}`,w-8,E+f),l.textAlign="left",l.fillText(`${i} · ±${g.toExponential(2)} (${a})`,w,E-13)}function ts(n,e,t=!1,i=!1){const s=n.getBoundingClientRect(),a=devicePixelRatio||1;n.width=s.width*a,n.height=s.height*a;const r=n.getContext("2d");if(r.scale(a,a),r.clearRect(0,0,s.width,s.height),!(e!=null&&e.length)){r.fillStyle="#8491a2",r.font="12px Segoe UI",r.fillText("Point monitor signals appear after a run.",30,35);return}const o=y=>t?i?y.wavelength_um:y.frequency_thz:y.time_fs,l=s.width-75,c=s.height-48,d=55,u=15,h=e.flatMap(y=>t?y.spectrum:y.signal),m=e.flatMap(o),g=h.reduce((y,T)=>Number.isFinite(T)?Math.max(y,Math.abs(T)):y,0)||1,_=t?m.reduce((y,T)=>Math.min(y,T),1/0):0,p=m.reduce((y,T)=>Math.max(y,T),_+1e-6),f=t&&!e.some(y=>y.signed)?0:-g;r.strokeStyle="#e0e6ed",r.font="10px monospace",r.fillStyle="#738197";for(let y=0;y<=4;y++){const T=u+y*c/4;r.beginPath(),r.moveTo(d,T),r.lineTo(d+l,T),r.stroke(),r.fillText((g-(g-f)*y/4).toExponential(1),2,T+3),r.fillText((_+(p-_)*y/4).toFixed(i&&t?2:0),d+l*y/4-7,u+c+17)}e.forEach((y,T)=>{const S=o(y),M=t?y.spectrum:y.signal;r.strokeStyle=["#237ddd","#e39127","#875adb","#22a184"][T%4],r.beginPath();let b=!1;S.forEach((x,v)=>{if(!Number.isFinite(M[v])){b=!1;return}const A=d+(x-_)/(p-_)*l,I=u+(g-M[v])/(g-f)*c;b?r.lineTo(A,I):r.moveTo(A,I),b=!0}),r.stroke(),S.length===1&&(r.beginPath(),r.arc(d,u+(g-M[0])/(g-f)*c,3,0,2*Math.PI),r.fillStyle=r.strokeStyle,r.fill()),r.fillStyle=r.strokeStyle,r.fillText(y.name,d+10+T*120,12),!t&&y.window&&(r.strokeStyle="#24a79b",r.setLineDash([3,3]),r.beginPath(),S.forEach((x,v)=>{const A=d+(x-_)/(p-_)*l,I=u+(1-y.window[v])*c/2;v?r.lineTo(A,I):r.moveTo(A,I)}),r.stroke(),r.setLineDash([]))});const w=e[0],E=w.spectrum_settings;r.fillStyle="#728296",r.textAlign="right",r.fillText(t?w.spectrum_label||`${i?"Wavelength (µm)":"Frequency (THz)"} · ${(E==null?void 0:E.apodization)||"hann"} · |${(E==null?void 0:E.sampling)==="fft"?"FFT":"DFT"}| (${w.spectrum_units||"reduced field"})`:w.time_label||`Time (fs) · real field${w.window?"; dashed: window (0–1)":""}`,s.width-20,s.height-3)}function qv({esc:n,toast:e,log:t}){const i=document.createElement("dialog");i.id="fsp-dialog",document.body.append(i);const s=document.createElement("input");s.type="file",s.accept=".fsp",s.hidden=!0,document.body.append(s);let a=null,r="",o=!1,l="",c=new Map;async function d(y,T){const S=await fetch("/api/fsp"+y,T),M=await S.json();if(!S.ok)throw Error(typeof M.detail=="string"?M.detail:JSON.stringify(M.detail));return M}function u(){if(!(a!=null&&a.inspection))return[];const y=a.inspection;return[...y.objects.map(T=>({...T,editable:!0})),...Object.entries(y.globals).map(([T,S])=>({id:"Global "+T,...S})),...Object.entries(y.referenced_materials).map(([T,S])=>({id:"Material: "+T,...S}))]}function h(){return u().find(y=>y.id===r)}function m(y,T){return JSON.stringify([y,T])}function g(y){i.querySelector("#fsp-status").textContent=y}function _(){const y=a==null?void 0:a.inspection;i.innerHTML=`<div class="fsp-heading"><div><h2>FSP project inspector</h2><span>${n((a==null?void 0:a.filename)||"Open a Lumerical project")}</span></div><button data-fsp="close" aria-label="Close FSP inspector">Close</button></div>
   <p class="fsp-notice">Installed Lumerical bridge · <strong>Native GPU execution unavailable</strong><br>Original settings are retained. Values below use Lumerical SI units: metres, seconds and Hz. Edited exports clear saved simulation results.</p>
   <div class="fsp-toolbar"><button data-fsp="open" ${o?"disabled":""}>Open .fsp</button><button data-fsp="original" ${!y||o?"disabled":""}>Download original .fsp</button><button data-fsp="archive" ${!y||o?"disabled":""}>Preservation archive</button><button data-fsp="export" ${!c.size||o?"disabled":""}>Save edited .fsp <span id="fsp-patch-count">(${c.size})</span></button></div>
   <div id="fsp-status" role="status">${o?"Reading with Lumerical…":y?`${y.objects.length} objects · Lumerical ${n(y.bridge.vendor_version)} · ${c.size} pending edits`:"Select an FSP file. The GPU workstation reads it in a separate Lumerical session."}</div>
   <div class="fsp-body"><div id="fsp-tree">${u().map(T=>`<button data-fsp-object="${n(T.id)}" class="${r===T.id?"active":""}"><span>${n(T.id)}</span><small>${n(T.properties.type||"Settings")}</small></button>`).join("")}</div><section class="fsp-details"><input id="fsp-filter" placeholder="Filter properties (e.g. wavelength, pml, apodization)" aria-label="Filter FSP properties" value="${n(l)}"><div id="fsp-properties"></div></section></div>
   ${y?`<details class="fsp-diagnostics"><summary>Native compatibility: ${y.native_execution.issues.length} unresolved items</summary><ul>${y.native_execution.issues.map(T=>`<li><b>${n(T.object_id||"Project")}</b>: ${n(T.message)}</li>`).join("")}${y.read_diagnostics.map(T=>`<li>${n(T.object_id)}: ${n(T.message)}</li>`).join("")}</ul></details>`:""}`,p(),i.querySelector("#fsp-filter").oninput=T=>{l=T.target.value,p()}}function p(){const y=h(),T=i.querySelector("#fsp-properties");if(!y){T.innerHTML="<p>Select an object to inspect its complete property list.</p>";return}const S=Object.entries(y.properties).filter(([M])=>M.toLowerCase().includes(l.toLowerCase()));T.innerHTML=`<h3>${n(y.id)}</h3>${S.map(([M,b])=>{const x=c.get(m(y.id,M)),v=x?x.value:b,A=y.editable&&!["name","type","script","setup script","analysis script"].includes(M)&&["number","string","boolean"].includes(typeof v)&&!String(v).includes(`
`)&&String(v).length<2e3,I=typeof v=="object"?JSON.stringify(v,null,2):String(v);return`<label class="fsp-property ${x?"modified":""}"><span>${n(M)}</span>${A?`<input data-fsp-property="${n(M)}" aria-label="FSP ${n(M)}" type="${typeof v=="number"?"number":typeof v=="boolean"?"checkbox":"text"}" step="any" ${typeof v=="boolean"?v?"checked":"":`value="${n(I)}"`} ${o?"disabled":""}>`:`<pre>${n(I)}</pre>`}</label>`}).join("")}${Object.entries(y.read_errors||{}).map(([M,b])=>`<p class="error">${n(M)}: ${n(b)}</p>`).join("")}`,T.querySelectorAll("[data-fsp-property]").forEach(M=>M.onchange=()=>{const b=M.dataset.fspProperty,x=M.type==="number"?Number(M.value):M.type==="checkbox"?M.checked:M.value;if(M.type==="number"&&(!M.value||!Number.isFinite(x))){e("Enter a finite number."),p();return}x===y.properties[b]?c.delete(m(y.id,b)):c.set(m(y.id,b),{object_id:y.id,property:b,value:x}),M.closest("label").classList.toggle("modified",c.has(m(y.id,b))),i.querySelector("#fsp-patch-count").textContent=`(${c.size})`,i.querySelector('[data-fsp="export"]').disabled=!c.size||o,g(`${c.size} pending edits. Save edited .fsp verifies each saved value in Lumerical.`)})}async function f(y){for(;;){const T=await d("/"+y);if(g(T.status==="queued"?"Waiting for Lumerical bridge…":"Reading and verifying project settings…"),T.status==="failed")throw Error(T.error);if(T.status==="ready")return T;await new Promise(S=>setTimeout(S,700))}}function w(y){const T=document.createElement("a");T.href="/api/fsp/"+a.id+"/"+y,T.download="",T.click()}async function E(y){var T,S;if(!o){o=!0,c.clear(),l="",r="",a=null,_(),i.open||i.showModal();try{g("Uploading "+y.name+"…");const M=await d("/import",{method:"POST",headers:{"Content-Type":"application/octet-stream","X-Filename":encodeURIComponent(y.name)},body:y});a=await f(M.id),r=((T=a.inspection.objects.find(b=>b.properties.type==="FDTD"))==null?void 0:T.id)||((S=a.inspection.objects[0])==null?void 0:S.id),t("Inspected "+y.name+" through Lumerical. Native GPU execution of this FSP remains unavailable.")}catch(M){e(M.message),t("FSP: "+M.message,"error")}finally{o=!1,_()}}}return s.onchange=()=>{const y=s.files[0];s.value="",y&&E(y)},i.addEventListener("click",async y=>{const T=y.target.closest("button");if(!T||T.disabled)return;if(T.dataset.fspObject){r=T.dataset.fspObject,_();return}const S=T.dataset.fsp;if(S==="close"){i.close();return}if(S==="open"){s.click();return}if(S==="original"){w("download");return}if(S==="archive"){w("archive");return}if(S==="export"){o=!0,_();try{const M=await d("/"+a.id+"/export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({patches:[...c.values()]})}),b=await f(M.id),x=document.createElement("a");x.href="/api/fsp/"+b.id+"/download",x.download="",x.click(),c.clear(),a=b,t("Saved "+b.filename+" and verified "+b.export_verification.patches.length+" property edits by reopening in Lumerical.")}catch(M){e(M.message),t("FSP export failed: "+M.message,"error")}finally{o=!1,_()}}}),{openFile:E,open(){_(),i.open||i.showModal()}}}function Xv({esc:n,toast:e,log:t,loadProject:i,getProject:s}){const a=document.createElement("dialog");a.id="fsp-native-dialog",document.body.append(a);const r=document.createElement("input");r.type="file",r.accept=".fsp",r.id="fsp-native-input",r.hidden=!0,document.body.append(r);let o=null,l=null,c=!1,d="";function u(){var y,T,S,M;const _=o==null?void 0:o.conversion,p=_==null?void 0:_.project,f=s(),w=[...(f==null?void 0:f.structures)||[],...(f==null?void 0:f.sources)||[],...(f==null?void 0:f.monitors)||[]],E=b=>{const x=w.find(v=>b.startsWith(v.id+"."));return x?x.name+": "+b.slice(x.id.length+1):b};a.innerHTML=`<div class="fsp-heading"><div><h2>Import FSP for GPU</h2><span>${n((o==null?void 0:o.filename)||"Independent scene import")}</span></div><button data-native="close">Close</button></div>
   <p>Reads supported layout settings without Lumerical. The original FSP is retained. A converted scene uses the native solver and its documented numerical definitions.</p>
   <div class="fsp-toolbar"><button data-native="open" ${c?"disabled":""}>Choose .fsp</button><button data-native="load" ${!p||c?"disabled":""}>Open converted scene</button>${_?'<button data-native="original">Download original .fsp</button><button data-native="report">Conversion report</button>':""}<button data-native="export" ${!p||c?"disabled":""}>Export current scene</button></div>
   <p id="fsp-native-status" role="status">${c?"Processing FSP settings…":d?n(d):l?"Scene export verified · download below":_?p?"Ready to open · review calculation differences below":"Cannot run this FSP yet · unsupported settings below":"Choose an FSP file to check and convert."}</p>
   ${l?`<p><button data-native="edited">Download edited .fsp</button> <button data-native="write-report">Scene export report</button></p>${l.export_verification.native_only_settings.length?`<details><summary>Native JSON retains additional settings</summary><ul>${l.export_verification.native_only_settings.map(b=>`<li>${n(E(b))}</li>`).join("")}</ul></details>`:""}`:""}
   ${(y=l==null?void 0:l.export_verification.structure_list)!=null&&y.changed?`<p data-native-structure-export>Structure list saved: ${l.export_verification.structure_list.added.length} added · ${l.export_verification.structure_list.removed.length} removed · ${l.export_verification.structure_list.output_order.length} total. Native order and material priority verified. Reimport the edited file to use its updated object IDs. New object records have not been verified in external readers.</p>`:""}
   ${(T=l==null?void 0:l.export_verification.source_list)!=null&&T.changed?`<p data-native-source-export>Source list saved: ${l.export_verification.source_list.added.length} added · ${l.export_verification.source_list.removed.length} removed · ${l.export_verification.source_list.output_order.length} total. Native waveforms and order verified.</p>`:""}
   ${(S=l==null?void 0:l.export_verification.monitor_list)!=null&&S.changed?`<p data-native-monitor-export>Monitor list saved: ${l.export_verification.monitor_list.added.length} added · ${l.export_verification.monitor_list.removed.length} removed · ${l.export_verification.monitor_list.output_order.length} outputs. ${l.export_verification.monitor_list.splits.length} component records separated. Native sampling and output order verified. Reimport the edited file before further FSP edits. External reader acceptance is unverified.</p>`:""}
   ${(M=l==null?void 0:l.export_verification.mesh_export)!=null&&M.nodes_changed?`<p data-native-mesh-export>Mesh updated: ${l.export_verification.mesh_export.shape_before.join(" × ")} → ${l.export_verification.mesh_export.shape_after.join(" × ")} cells. Native reimport verified. External remeshing has not been verified.</p>`:""}
   ${p?'<p class="property-help">Exports mapped primitive, electric source and monitor additions, deletions, duplicates and order, source pulses, monitor spectra, duration, PML/Periodic settings and uniform mesh spacing/spans. New sources need explicit or ranged pulse settings. New time monitors need FFT with no apodization. Uniform isotropic export requires Cell centers sampling, and independent unequal axis spacing requires Yee sampling. Edited graded/explicit meshes and groups are not exported yet. Save native JSON to retain every native option and inheritance link.</p>':""}
   ${p?`<p>Original import: <b>${p.region.dimension.toUpperCase()}</b> · ${p.structures.length} structures · ${p.sources.length} sources · ${p.monitors.length} monitors · ${p.region.steps} steps</p>`:""}
   ${_?`<div class="native-issues">${_.issues.map(b=>`<p class="${b.severity==="error"?"error":"warning"}"><b>${n(b.object_id)}</b><br>${n(b.message)}</p>`).join("")}</div><p class="property-help">Coordinate origin in the source FSP: ${_.origin_m.map(b=>(b*1e6).toPrecision(5)).join(", ")} µm. Differences and source fingerprint remain in the saved native project.</p>`:""}`}async function h(_,p){const f=await fetch("/api/fsp"+_,p),w=await f.json();if(!f.ok)throw Error(w.detail||"FSP conversion failed");return w}async function m(_){for(;;){const p=await h("/"+_);if(p.status==="failed")throw Error(p.error);if(p.status==="ready")return p;await new Promise(f=>setTimeout(f,400))}}async function g(_){if(!c){o=null,l=null,d="",c=!0,u(),a.open||a.showModal();try{const p=await h("/native-import",{method:"POST",headers:{"Content-Type":"application/octet-stream","X-Filename":encodeURIComponent(_.name)},body:_});o=await m(p.id),t(_.name+": "+(o.conversion.project?"native scene conversion ready.":"native execution blocked by unsupported settings."),o.conversion.project?"info":"warning")}catch(p){d=p.message,e(d),t("FSP conversion: "+d,"error")}finally{c=!1,u()}}}return r.onchange=()=>{const _=r.files[0];r.value="",_&&g(_)},a.onclick=async _=>{var f,w;const p=(f=_.target.closest("[data-native]"))==null?void 0:f.dataset.native;if(p==="close"&&a.close(),p==="open"&&r.click(),p==="load"&&(o!=null&&o.conversion.project))try{await i(o.conversion.project),a.close()}catch(E){e(E.message)}if(p==="original"||p==="report"){const E=document.createElement("a");E.href="/api/fsp/"+o.id+(p==="original"?"/download":"/conversion"),E.download="",E.click()}if(p==="edited"||p==="write-report"){const E=document.createElement("a");E.href="/api/fsp/"+l.id+(p==="edited"?"/download":"/write-report"),E.download="",E.click()}if(p==="export"&&!c){c=!0,d="",l=null,u();try{const E=await h("/"+o.id+"/native-scene-export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s())});l=await m(E.id),t("Independent scene export verified."+((w=l.export_verification.mesh_export)!=null&&w.nodes_changed?" Mesh nodes updated.":""))}catch(E){d=E.message,e(d),t("FSP scene export: "+d,"error")}finally{c=!1,u()}}},{open(){u(),a.open||a.showModal()},openFile:g}}function Yv({esc:n,toast:e,log:t,getProject:i,loadProject:s}){const a=document.createElement("dialog");a.id="gds-dialog",a.className="gds-dialog",document.body.append(a);let r=null,o=null,l=null,c=!1;async function d(p,f){const w=await fetch("/api/gds/"+p,f),E=await w.json();if(!w.ok)throw Error(typeof E.detail=="string"?E.detail:JSON.stringify(E.detail));return E}function u(){return JSON.stringify([...a.querySelectorAll("input,select,textarea")].map(p=>[p.value,p.checked]))}function h(){o=null,a.querySelector('[data-gds="apply"]').disabled=!0,a.querySelector('[data-gds="report"]').disabled=!0}function m(p){a.querySelector("#gds-status").textContent=p}function g(p,f){const w=URL.createObjectURL(new Blob([JSON.stringify(f,null,2)],{type:"application/json"})),E=document.createElement("a");E.href=w,E.download=p,E.click(),setTimeout(()=>URL.revokeObjectURL(w),1e3)}function _(){const p=[...new Set(((r==null?void 0:r.cells)||[]).flatMap(f=>f.geometry_pairs.map(w=>w.join("/"))))].sort();a.innerHTML=`<div class="fsp-heading"><h2>Import GDS geometry</h2><button data-gds="close">Close</button></div>
   <p>Select a cell and explicitly assign each included layer its physical Z bounds (µm) and an existing project material. No sources or fabrication materials are inferred.</p>
   <input id="gds-input" aria-label="GDS file" type="file" accept=".gds,.gdsii"><p id="gds-status" role="status">${r?n(r.filename):"Choose a GDSII file (maximum 32 MB)."}</p>
   ${r?`<label>Cell <select id="gds-cell">${r.cells.map(f=>`<option>${n(f.name)}</option>`).join("")}</select></label>
   <p>Pairs below include all library cells. Select pairs present in the selected cell hierarchy. Duplicate a row to extrude the same pair at multiple Z intervals. Etch by lists layer/datatype pairs, such as <code>2/0, 3/1</code>, whose polygons are subtracted from the row before extrusion; bridged hole contours import as polygon holes.</p>
   <table><thead><tr><th>Include</th><th>Layer / datatype</th><th>Z min (µm)</th><th>Z max (µm)</th><th>Material</th><th>Etch by</th><th></th></tr></thead><tbody id="gds-stack">${p.map(f=>`<tr data-pair="${f}"><td><input type="checkbox" aria-label="Include ${f}"></td><td>${f}</td><td><input size="8" type="number" step="any" aria-label="Z min ${f}"></td><td><input size="8" type="number" step="any" aria-label="Z max ${f}"></td><td><select aria-label="Material ${f}"><option value="">Select material</option>${i().materials.map(w=>`<option value="${n(w.name)}">${n(w.name)}</option>`).join("")}</select></td><td><input size="10" aria-label="Etch by ${f}" placeholder="none"></td><td><button data-gds="duplicate">Duplicate</button></td></tr>`).join("")}</tbody></table>
   <p><label>Unmapped geometry <select id="gds-unmapped"><option value="error">Reject (strict)</option><option value="report">Omit and record in report</option></select></label></p>
   <p><label><input id="gds-replace" type="checkbox"> Replace current structures (sources, monitors and materials stay in the project)</label></p>
   <details><summary>Optional TEXT port metadata contracts</summary><p>JSON array using layer, datatype (= TEXTTYPE), z_min, z_max, width_um and normal_xy. Metadata only, no source/detector integration. Available TEXT pairs: ${n(JSON.stringify([...new Set(r.cells.flatMap(f=>f.text_pairs.map(w=>w.join("/"))))]))}</p><textarea id="gds-ports" aria-label="Port contracts" rows="3" style="width:100%">[]</textarea></details>
   <button data-gds="preview">Preview conversion</button>`:""}
   <button data-gds="apply" disabled>Apply imported geometry</button><button data-gds="report" disabled>Download report</button><pre id="gds-report" style="max-height:240px;overflow:auto;white-space:pre-wrap"></pre>`,a.querySelector("#gds-input").onchange=async f=>{const w=f.target.files[0];if(!(!w||c)){c=!0,h(),m("Inspecting GDS…");try{r=await d("inspect",{method:"POST",headers:{"Content-Type":"application/octet-stream","X-Filename":encodeURIComponent(w.name)},body:w}),_()}catch(E){m(E.message)}finally{c=!1}}}}return a.addEventListener("input",p=>{p.target.id!=="gds-input"&&h()}),a.addEventListener("click",async p=>{var w;const f=(w=p.target.closest("[data-gds]"))==null?void 0:w.dataset.gds;if(!(!f||c)){if(f==="close"){a.close();return}if(f==="duplicate"){const E=p.target.closest("tr");E.after(E.cloneNode(!0)),h();return}if(f==="report"){g("gds-import-report.json",o.report);return}c=!0;try{if(f==="preview"){h();const E=[];for(const T of a.querySelectorAll("#gds-stack tr")){const S=T.querySelectorAll("input");if(!S[0].checked)continue;if(!S[1].value||!S[2].value||!T.querySelector("select").value)throw Error("Every included row needs explicit Z bounds and material.");const[M,b]=T.dataset.pair.split("/").map(Number),x=S[3].value.split(/[\s,]+/).filter(Boolean).map(v=>{const A=v.split("/").map(Number);if(A.length!==2||A.some(I=>!Number.isInteger(I)||I<0))throw Error(`Etch pairs must be layer/datatype, not "${v}".`);return A});E.push({layer:M,datatype:b,z_min:Number(S[1].value),z_max:Number(S[2].value),material:T.querySelector("select").value,...x.length?{etch_by:x}:{}})}l=JSON.stringify(i());const y=u();if(m("Converting and validating native geometry…"),o=await d(r.id+"/convert",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({project:JSON.parse(l),cell:a.querySelector("#gds-cell").value,layers:E,port_layers:JSON.parse(a.querySelector("#gds-ports").value),unmapped:a.querySelector("#gds-unmapped").value,replace_geometry:a.querySelector("#gds-replace").checked})}),y!==u())throw h(),Error("Import settings changed during conversion. Preview again.");a.querySelector("#gds-report").textContent=JSON.stringify(o.report,null,2),m("Ready to apply. Review the report and bounds; the FDTD region is unchanged."),a.querySelector('[data-gds="apply"]').disabled=!1,a.querySelector('[data-gds="report"]').disabled=!1}else if(f==="apply"){if(l!==JSON.stringify(i()))throw h(),Error("Project changed after preview. Preview again before applying.");await s(o.project),a.close(),t("Imported GDS native geometry. Port metadata is available in the separate conversion report."),e("GDS geometry imported")}}catch(E){m(E.message)}finally{c=!1}}}),{open(){r=null,o=null,_(),a.showModal()}}}function Zv({esc:n,toast:e,log:t,api:i,getProject:s,download:a}){const r=document.createElement("dialog");r.id="gds-export-dialog",r.className="gds-dialog",document.body.append(r);let o=!1;function l(){const c=s(),d=c.structures.filter(m=>m.enabled),u=d.filter(m=>["rectangle","polygon"].includes(m.kind)),h=d.filter(m=>!["rectangle","polygon"].includes(m.kind));r.innerHTML=`<div class="fsp-heading"><h2>Export GDS</h2><button data-gds-export="close">Close</button></div>
   <p>Writes the XY outline of every enabled rectangle and polygon to one GDSII cell. GDS holds no extrusion or material, so the Z bounds, materials and mesh orders are returned in a JSON sidecar next to the file. Sources, monitors and solver settings are not exported.</p>
   <label>Cell name <input id="gds-export-cell" aria-label="GDS cell name" value="TOP" maxlength="32"></label>
   <table class="gds-export-table"><thead><tr><th>Structure</th><th>Kind</th><th>Material</th><th>Layer</th><th>Datatype</th></tr></thead><tbody>${u.map((m,g)=>`<tr data-id="${n(m.id)}"><td>${n(m.name)}</td><td>${n(m.kind)}</td><td>${n(m.material)}</td><td><input type="number" min="0" max="65535" step="1" value="${g+1}" aria-label="Layer ${n(m.name)}"></td><td><input type="number" min="0" max="65535" step="1" value="0" aria-label="Datatype ${n(m.name)}"></td></tr>`).join("")}</tbody></table>
   ${h.length?`<p class="warning">Not exportable and must be disabled first: ${n(h.map(m=>m.name+" ("+m.kind+")").join(", "))}. GDS export supports rectangles and polygons only.</p>`:""}
   <p id="gds-export-status" role="status">${u.length?`${u.length} structure${u.length===1?"":"s"} ready.`:"No enabled rectangle or polygon to export."}</p>
   <button data-gds-export="run" ${u.length?"":"disabled"}>Export .gds and sidecar</button>`}return r.addEventListener("click",async c=>{var h;const d=(h=c.target.closest("[data-gds-export]"))==null?void 0:h.dataset.gdsExport;if(!d||o)return;if(d==="close"){r.close();return}o=!0;const u=r.querySelector("#gds-export-status");try{const m={};for(const w of r.querySelectorAll("tbody tr")){const[E,y]=[...w.querySelectorAll("input")].map(T=>Number(T.value));if(![E,y].every(T=>Number.isInteger(T)&&T>=0&&T<=65535))throw Error("Layer and datatype must be integers from 0 to 65535.");m[w.dataset.id]=[E,y]}const g=r.querySelector("#gds-export-cell").value.trim();u.textContent="Exporting…";const _=await i("/gds/export",{project:s(),layers:m,cell:g}),p=Uint8Array.from(atob(_.gds_base64),w=>w.charCodeAt(0)),f=s().name.replace(/[^a-z0-9]/gi,"_");a(p,f+".gds","application/octet-stream"),a(JSON.stringify(_.sidecar,null,2),f+".gds.json"),u.textContent=`Exported ${_.sidecar.structures} structure${_.sidecar.structures===1?"":"s"} (${_.bytes} bytes) with the layer stack sidecar.`,t(`Exported GDS cell ${g}: ${_.sidecar.structures} structures, ${_.bytes} bytes, sidecar ${f}.gds.json.`),e("GDS exported with its layer stack sidecar")}catch(m){u.textContent=m.message}finally{o=!1}}),{open(){l(),r.showModal()}}}const Md={wavelength:1.55,pulse:"gaussian",pulse_cycles:3,time_definition:"cycles",pulse_length:2e-14,pulse_offset:5e-14,signal:null,wavelength_start:1.3,wavelength_stop:1.8,optimize_for_short_pulse:!0,eliminate_discontinuities:!1,chirp_bandwidth_hz:1e14};function Jv(n,e,t){const i=n.theta!=null,s=n.injection==="oneway";return(i?s?'<p class="property-help">Electric polarization. Its magnetic partner is generated automatically.</p>':`<label class="property-row"><span>field type</span><select aria-label="field type" data-source-family><option value="E" ${n.component[0]==="E"?"selected":""}>Electric</option><option value="H" ${n.component[0]==="H"?"selected":""}>Magnetic</option></select></label>`:t("polarization","component",n.component,s?["Ex","Ey","Ez"].filter(r=>r[1]!==n.normal):["Ex","Ey","Ez","Hx","Hy","Hz"]))+`<label class="enabled-row"><input type="checkbox" data-source-vector ${i?"checked":""}> Use theta / phi orientation</label>`+(i?e("theta","theta",n.theta,"deg",{min:0,max:180})+e("phi","phi",n.phi??0,"deg")+'<p class="property-help">Theta is measured from +z. Phi turns from +x toward +y. The source has unit vector (sin θ cos φ, sin θ sin φ, cos θ).</p>':"")}function Kv(n,e,t,i){return n.kind==="tfsf"?i("propagation axis","normal",n.normal??"x",e.dimension==="2d"?["x","y"]:["x","y","z"])+i("direction","direction",n.direction??"+",[["+","Forward (+axis)"],["-","Backward (-axis)"]])+t("incident PML layers","incident_pml_cells",n.incident_pml_cells??96,"",{min:32,max:512,step:1})+'<p class="property-help">Normal-incidence TFSF box. Inside contains total fields and outside contains scattered fields. Keep the scatterer away from every face, with homogeneous background on the faces and PML on all active domain boundaries.</p>':n.kind!=="plane"?"":i("injection","injection",n.injection??"soft",[["soft","Soft sheet / bidirectional"],["oneway","One-way plane / normal incidence"]])+(n.injection!=="oneway"?`<label class="enabled-row"><input type="checkbox" data-path="extend_through_pml" ${n.extend_through_pml?"checked":""}> Extend sheet through PML (tiled runs)</label>`:"")+(n.injection==="oneway"?i("propagation axis","normal",n.normal??"x",e.dimension==="2d"?["x","y"]:["x","y","z"])+i("direction","direction",n.direction??"+",[["+","Forward (+axis)"],["-","Backward (-axis)"]])+t("incident PML layers","incident_pml_cells",n.incident_pml_cells??96,"",{min:32,max:512,step:1}):"")+'<p class="property-help">Selecting one-way fills the transverse cell, sets its boundaries to Periodic and the propagation boundaries to PML. Place its full plane in homogeneous background. This source does not select a waveguide mode or an oblique angle.</p>'}function Sc(n,e,{boundaries:t=!1}={}){if(n.kind==="tfsf"){e.dimension==="2d"&&n.normal==="z"&&(n.normal="x"),(n.component[0]!=="E"||n.component[1]===n.normal)&&(n.component=n.normal==="z"?"Ex":"Ez",n.theta=null,n.phi=0);return}if(n.injection!=="oneway")return;n.normal??(n.normal="x"),n.direction??(n.direction="+"),e.dimension==="2d"&&n.normal==="z"&&(n.normal="x");const i="xyz".indexOf(n.normal),s=e.dimension==="2d"?2:3;n.size=[0,0,0];for(let a=0;a<s;a++)if(a!==i&&(n.center[a]=0,n.size[a]=Math.ceil(e.size[a]/e.mesh-1e-12)*e.mesh),t){for(const r of["min","max"])e.boundaries["xyz"[a]+"_"+r].kind=a===i?"pml":"periodic";e.bloch_phase[a]=0}(n.component[0]!=="E"||n.component[1]===n.normal)&&(n.component="E"+(i===2?"x":"z"),n.theta=null,n.phi=0)}function Zo(n){const e=299792458/(n.wavelength_stop*1e-6),t=299792458/(n.wavelength_start*1e-6),i=(e+t)/2,s=(n.optimize_for_short_pulse?2:8)/(t+.01*e),a=s/(2*Math.sqrt(Math.log(2)));return{wavelength:299792458/i*1e6,length:s,offset:1.1*Math.sqrt(2*Math.log(1e4))*a,span:t-e,chirped:t-e>Math.sqrt(Math.log(2))/(Math.PI*a)}}function Ed(n,e,t){const i=["wavelength","frequency"].includes(n.time_definition),s=i?Zo(n):null;n[e]=t,e==="pulse"&&t==="broadband"&&!i&&(n.time_definition="wavelength",n.eliminate_discontinuities=!0),(e==="pulse"&&t!=="broadband"&&i||e==="time_definition"&&t==="standard"&&i)&&(n.time_definition="standard",n.wavelength=s.wavelength,n.pulse_length=s.length,n.pulse_offset=s.offset,n.chirp_bandwidth_hz=Math.max(s.span,1),e==="time_definition"&&!s.chirped&&(n.pulse="gaussian"))}function wd(n,e,t,i=""){for(const[l,c]of Object.entries(Md))n[l]??(n[l]=c);const s=n.pulse==="broadband",a=["wavelength","frequency"].includes(n.time_definition),r=(l,c)=>`<label class="enabled-row"><input type="checkbox" aria-label="${i}${l}" data-path="${c}" ${n[c]?"checked":""}> ${l}</label>`;let o=t("pulse","pulse",n.pulse,[["gaussian","Gaussian"],["broadband","Broadband / automatic range"],["continuous","Continuous wave"],...n.signal?[["sampled","User time signal"]]:[]]);if(n.pulse==="sampled")return e("wavelength","wavelength",n.wavelength,"µm",{min:.001})+o+`<p class="property-help">${n.signal.time_s.length.toLocaleString()} time/amplitude/phase samples. Time in seconds, phase in radians.</p>`;if(o+=t("time definition","time_definition",n.time_definition,s?[["wavelength","Wavelength range"],["frequency","Frequency range"],["standard","Time domain"]]:[["cycles","Pulse cycles"],["standard","Standard time domain"]]),a){n.time_definition==="wavelength"?o+=e("wavelength start","wavelength_start",n.wavelength_start,"µm",{min:.001})+e("wavelength stop","wavelength_stop",n.wavelength_stop,"µm",{min:.001}):o+=e("frequency start","wavelength_stop",299.792458/n.wavelength_stop,"THz",{min:.001,reciprocal:299.792458})+e("frequency stop","wavelength_start",299.792458/n.wavelength_start,"THz",{min:.001,reciprocal:299.792458});const l=Zo(n);o+=r("Optimize for short pulse","optimize_for_short_pulse")+`<p class="property-help" data-source-band-summary>${l.chirped?"Chirped":"Standard"} Gaussian · center ${l.wavelength.toFixed(5)} µm · power FWHM ${(l.length*1e15).toFixed(4)} fs · offset ${(l.offset*1e15).toFixed(4)} fs. The spectrum extends beyond the requested range.</p>`}else o+=e("wavelength","wavelength",n.wavelength,"µm",{min:.001}),o+=n.time_definition==="standard"?e("pulselength (power FWHM)","pulse_length",n.pulse_length*1e15,"fs",{min:.001,scale:1e-15})+(n.pulse!=="continuous"?e("offset","pulse_offset",n.pulse_offset*1e15,"fs",{min:0,scale:1e-15}):""):e("pulse width","pulse_cycles",n.pulse_cycles,"cycles",{min:1}),s&&(o+=e("chirp bandwidth","chirp_bandwidth_hz",n.chirp_bandwidth_hz*1e-12,"THz",{min:.001,scale:1e12}));return n.pulse!=="continuous"&&(o+=r("Eliminate discontinuities","eliminate_discontinuities")),o}function Qv(n,e="signal.csv"){var s;if(e.toLowerCase().endsWith(".json"))return JSON.parse(n);const t=n.replace(/^\uFEFF/,"").trim().split(/\r?\n/).filter(a=>a.trim());if(((s=t.shift())==null?void 0:s.trim())!=="time_s,amplitude,phase_rad")throw Error("CSV header must be time_s,amplitude,phase_rad. Use seconds and unwrapped radians.");const i={time_s:[],amplitude:[],phase_rad:[]};return t.forEach((a,r)=>{const o=a.split(",");if(o.length!==3||o.some(l=>!l.trim()||!Number.isFinite(Number(l))))throw Error(`Invalid numeric data on CSV row ${r+2}.`);Object.keys(i).forEach((l,c)=>i[l].push(Number(o[c])))}),i}function e0({state:n,api:e,esc:t,commit:i,toast:s}){const a=document.createElement("dialog");a.className="source-dialog",document.body.append(a);const r=S=>a.querySelector(S),o=()=>a.close(),l=S=>{a.innerHTML=S,a.showModal(),a.querySelectorAll("[data-source-close]").forEach(M=>M.onclick=o)},c=S=>{r('[role="alert"]').textContent=S.message},d=S=>{const M=["time_s,amplitude,phase_rad",...S.time_s.map((v,A)=>[v,S.amplitude[A],S.phase_rad[A]].join(","))].join(`
`),b=URL.createObjectURL(new Blob([M],{type:"text/csv"})),x=document.createElement("a");x.href=b,x.download="source-signal.csv",x.click(),setTimeout(()=>URL.revokeObjectURL(b),1e3)},u=S=>S?`${S.time_s.length.toLocaleString()} samples · ${(S.time_s[0]*1e15).toFixed(3)}–${(S.time_s.at(-1)*1e15).toFixed(3)} fs`:"No time signal loaded",h=S=>S?`<table><thead><tr><th>Time (fs)</th><th>Amplitude</th><th>Phase (rad)</th></tr></thead><tbody>${S.time_s.slice(0,6).map((M,b)=>`<tr><td>${(M*1e15).toPrecision(6)}</td><td>${S.amplitude[b].toPrecision(6)}</td><td>${S.phase_rad[b].toPrecision(6)}</td></tr>`).join("")}</tbody></table>`:"",m='<label class="signal-file">Load time signal (CSV or JSON)<input type="file" accept=".csv,.json" aria-label="Time signal file"></label><p class="property-help">CSV: time_s,amplitude,phase_rad. Time is in seconds; phase is unwrapped radians. JSON uses arrays with the same names. 2–100,000 strictly increasing times. Amplitude and phase are interpolated separately; injection is zero outside the table.</p>';async function g(S,M,b){if(S.size>16e6)throw Error("Time signal file exceeds 16 MB.");const x=Qv(await S.text(),S.name);return b.signal=x,b.pulse="sampled",["wavelength","frequency"].includes(b.time_definition)&&(b.time_definition="standard"),(await e("/validate",M)).project}async function _(S){if(n.mode!=="layout")return;let M=structuredClone(n.project),b=M.sources.find(v=>v.id===S);if(!b||b.use_global_source)throw Error("Edit the global source settings for an inherited signal.");l(`<h2>Time signal · ${t(b.name)}</h2>${m}<div class="signal-summary"></div><div class="signal-table"></div><p role="alert" class="error"></p><div class="dialog-actions"><button data-export>Download CSV</button><button data-source-close>Cancel</button><button data-apply class="primary">Apply time signal</button></div>`);const x=()=>{r(".signal-summary").textContent=u(b.signal),r(".signal-table").innerHTML=h(b.signal),r("[data-export]").disabled=!b.signal,r("[data-apply]").disabled=!b.signal};x(),r('[type="file"]').onchange=async v=>{const A=v.target.files[0];if(A)try{const I=structuredClone(M),P=I.sources.find(N=>N.id===S);M=await g(A,I,P),b=M.sources.find(N=>N.id===S),r('[role="alert"]').textContent="",x()}catch(I){c(I)}finally{r('[type="file"]').value=""}},r("[data-export]").onclick=()=>d(b.signal),r("[data-apply]").onclick=async()=>{try{b.pulse="sampled",["wavelength","frequency"].includes(b.time_definition)&&(b.time_definition="standard");const v=await e("/validate",M);i(v.project),o()}catch(v){c(v)}}}async function p(){if(n.mode!=="layout")return;let S=structuredClone(n.project);S.global_source??(S.global_source=structuredClone(Md));const M=(v,A,I,P="",O={})=>{const N={wavelength:"wavelength (µm)","pulselength (power FWHM)":"pulselength (fs)",offset:"offset (fs)","pulse width":"pulse cycles"}[v]||v;return`<label class="property-row"><span>${v}</span><input aria-label="global ${N}" data-path="${A}" type="number" step="any" data-scale="${O.scale||1}" ${O.reciprocal?`data-reciprocal="${O.reciprocal}"`:""} value="${I}"><small>${P}</small></label>`},b=(v,A,I,P)=>`<label class="property-row"><span>${v}</span><select aria-label="global ${v}" data-path="${A}">${P.map(([O,N])=>`<option value="${O}" ${O===I?"selected":""}>${N}</option>`).join("")}</select></label>`,x=()=>{const v=S.global_source;a.innerHTML=`<h2>Global source settings</h2><p>Shared temporal settings for sources with “Use global source settings” enabled. Each source keeps its own amplitude, phase and position.</p>${wd(v,M,b,"global ")}${m}<div class="signal-summary">${u(v.signal)}</div><p role="alert" class="error"></p><div class="dialog-actions"><button data-export ${v.signal?"":"disabled"}>Download signal CSV</button><button data-source-close>Cancel</button><button data-apply class="primary">Apply global settings</button></div>`,r("[data-source-close]").onclick=o,a.querySelectorAll("[data-path]").forEach(A=>A.onchange=()=>{const I=A.type==="checkbox"?A.checked:A.type==="number"?A.dataset.reciprocal?Number(A.dataset.reciprocal)/Number(A.value):Number(A.value)*Number(A.dataset.scale||1):A.value;if(Ed(v,A.dataset.path,I),A.type!=="number")x();else if(r("[data-source-band-summary]")){const P=Zo(v);r("[data-source-band-summary]").textContent=`${P.chirped?"Chirped":"Standard"} Gaussian · center ${P.wavelength.toFixed(5)} µm · power FWHM ${(P.length*1e15).toFixed(4)} fs · offset ${(P.offset*1e15).toFixed(4)} fs. The spectrum extends beyond the requested range.`}}),r('[type="file"]').onchange=async A=>{const I=A.target.files[0];if(I)try{const P=structuredClone(S);S=await g(I,P,P.global_source),x()}catch(P){c(P)}},r("[data-export]").onclick=()=>d(v.signal),r("[data-apply]").onclick=async()=>{try{const A=await e("/validate",S);i(A.project),o()}catch(A){c(A)}}};x(),a.showModal()}const f=S=>S.angle_deg==null?`${S.wavelength_um.toFixed(4)} µm: ${S.reason}`:`${S.wavelength_um.toFixed(4)} µm: ${S.angle_deg.toFixed(3)}°`;function w(S){return S.kind==="fixed_k_parallel"?`Fixed k∥ (Bloch phase): |k∥| = ${S.k_parallel_magnitude_rad_per_um.toPrecision(5)} rad/µm in the exterior index ${S.exterior_index}. ${S.statement} Angle across the band · ${Object.values(S.angle_deg).map(f).join(" · ")}.`:S.kind==="normal"?`Normal incidence: ${S.statement}`:S.statement}function E(S){return S.frequency_hz?`Effective bandwidth (${S.definition}): ${(S.frequency_hz[0]*1e-12).toFixed(2)}–${(S.frequency_hz[1]*1e-12).toFixed(2)} THz, ${S.wavelength_um[0].toFixed(4)}–${S.wavelength_um[1].toFixed(4)} µm, peak at ${S.center_wavelength_um.toFixed(4)} µm, resolution ${(S.frequency_resolution_hz*1e-12).toFixed(3)} THz${S.declared_wavelength_um?`; declared range ${S.declared_wavelength_um[0]}–${S.declared_wavelength_um[1]} µm`:""}.`:`Effective bandwidth: ${S.reason}.`}function y(S){return S.length?S.map(M=>{const b=Object.entries(M.phase_rad_by_axis||{}).map(([x,v])=>`${x}: ${v[0].toFixed(3)} → ${v.at(-1).toFixed(3)} rad over ${v.length} cells`).join(", ");return`${M.component} ${M.kind}: amplitude ${M.amplitude.toPrecision(4)} (weight ${M.weight.toPrecision(4)}), cells ${M.cells.map(([x,v])=>`[${x},${v})`).join("×")}; ${M.profile}${b?`; phase ${b}`:""}.`}).join(" "):"Spatial profile: disabled source, nothing is injected."}async function T(S,M=""){const b=structuredClone(n.project);l('<h2>Source time signal and spectrum</h2><p>Computing the injection at the current mesh time step…</p><p role="alert" class="error"></p><div class="dialog-actions"><button data-source-close>Close</button></div>');try{const x=await e("/sources/"+encodeURIComponent(S)+"/preview"+(M?`?incidence=${M}`:""),b);if(!a.open)return;const v=(x.spatial||[]).flatMap(P=>Object.entries(P.phase_rad_by_axis||{}).map(([O,N])=>({name:`${P.component} phase along ${O}`,frequency_thz:P.positions_um[O],wavelength_um:P.positions_um[O],spectrum:N,signed:!0,spectrum_label:`Position (µm) · Bloch phase on the source cells (rad, ${P.phase_reference})`})));a.innerHTML=`<h2>Source preview · ${t(x.name)}</h2><p>${x.inherited?"Global":"Local"} pulse settings · ${x.enabled?"Enabled":"Disabled: zero injection"} · Δt ${x.dt_fs.toFixed(5)} fs · ${x.signal.length.toLocaleString()} samples</p>${x.pulse_parameters?`<p>${x.pulse_parameters.chirped?"Chirped":"Unchirped"} carrier · center ${x.pulse_parameters.center_wavelength_um.toFixed(5)} µm · power FWHM ${(x.pulse_parameters.pulse_length_s*1e15).toFixed(4)} fs</p>`:""}<p data-preview-bandwidth>${t(E(x.bandwidth))}</p><p data-preview-polarization>Polarization: ${t(x.polarization.family)} vector (${x.polarization.vector.map(P=>P.toFixed(4)).join(", ")})${x.polarization.theta_deg!=null?` from θ ${x.polarization.theta_deg}°, φ ${x.polarization.phi_deg}°`:""}.</p><p data-preview-spatial>${t(y(x.spatial||[]))}</p><label class="property-row"><span>incidence definition</span><select aria-label="Incidence definition"><option value="" ${M?"":"selected"}>As realized</option><option value="fixed_k_parallel" ${M==="fixed_k_parallel"?"selected":""}>Fixed k∥ (Bloch phase)</option><option value="fixed_angle">Fixed angle (broadband)</option></select></label><p data-preview-incidence>${t(w(x.incidence))}</p><div class="source-plot-tabs"><button data-mode="time" class="active">Time signal</button><button data-mode="spectrum">Spectrum</button>${v.length?'<button data-mode="phase">Spatial phase</button>':""}<select aria-label="Source spectrum axis" hidden><option value="frequency">Frequency</option><option value="wavelength">Wavelength</option></select></div><canvas aria-label="Source waveform"></canvas><p>${t(x.note)}</p><p role="alert" class="error"></p><div class="dialog-actions"><button data-source-close>Close</button></div>`;let A="time";const I=()=>A==="phase"?ts(r("canvas"),v,!0,!1):ts(r("canvas"),[x],A==="spectrum",r('select[aria-label="Source spectrum axis"]').value==="wavelength");a.querySelectorAll("[data-mode]").forEach(P=>P.onclick=()=>{A=P.dataset.mode,r('select[aria-label="Source spectrum axis"]').hidden=A!=="spectrum",a.querySelectorAll("[data-mode]").forEach(O=>O.classList.toggle("active",O===P)),I()}),r('select[aria-label="Source spectrum axis"]').onchange=I,r("[data-source-close]").onclick=o,I(),r('select[aria-label="Incidence definition"]').onchange=async P=>{const O=P.target.value;if(O==="fixed_angle"){try{await e("/sources/"+encodeURIComponent(S)+"/preview?incidence=fixed_angle",b),c(Error("The server accepted a fixed-angle source; the registry has changed."))}catch(N){r("[data-preview-incidence]").textContent="Refused: "+N.message,c(N)}return}T(S,O)}}catch(x){a.open?c(x):s(x.message)}}return{signal:_,globals:p,preview:T}}function t0({host:n,material:e,editable:t,api:i,esc:s,begin:a,current:r,invalidate:o,timestep:l,use:c}){var p,f,w,E,y,T;const d=S=>n.querySelector(S),u=e.fit_band_um||[((p=e.samples)==null?void 0:p.wavelength_um[0])||"",((f=e.samples)==null?void 0:f.wavelength_um.at(-1))||""];n.innerHTML=`<details class="material-fit"><summary>Measured optical data · import and fit</summary>
 <p>Supply your own passive isotropic n/k or complex permittivity samples. The table and its reference are saved with the project.</p>
 <fieldset ${t?"":"disabled"}>
 <div class="fit-controls"><label>Columns <select aria-label="Optical data columns"><option value="nk">Wavelength, n, k</option><option value="epsilon">Wavelength, ε real, ε imaginary</option></select></label>
 <label>Wavelength unit <select aria-label="Optical wavelength unit"><option value="um">µm</option><option value="nm">nm</option><option value="m">m</option></select></label>
 <label>CSV / text file <input aria-label="Optical data file" type="file" accept=".csv,.txt,.tsv"></label></div>
 <textarea aria-label="Optical data table" rows="5" placeholder="wavelength_um,n,k&#10;1.0,1.50,0.01&#10;1.5,1.49,0.01&#10;2.0,1.48,0.01"></textarea>
 <label class="fit-reference">Data source / reference <input aria-label="Optical data reference" maxlength="200" value="${s(((w=e.provenance)==null?void 0:w.source)||((E=e.samples)==null?void 0:E.reference)||"")}" placeholder="Publication, database entry or measurement"></label>
 <label class="fit-reference">Licence / usage note <input aria-label="Optical data licence" maxlength="2000" value="${s(((y=e.provenance)==null?void 0:y.licence)||"")}" placeholder="Licence of the table or how it may be used"></label>
 <button data-import>Import data</button><span data-data-status>${e.samples?`${e.samples.wavelength_um.length} samples retained`:"No samples imported"}</span>
 <div class="fit-controls"><label>Fit start (µm) <input aria-label="Fit wavelength start" type="number" step="any" min="0" value="${u[0]}"></label>
 <label>Fit stop (µm) <input aria-label="Fit wavelength stop" type="number" step="any" min="0" value="${u[1]}"></label>
 <label>Maximum poles <input aria-label="Maximum fit poles" type="number" min="1" max="16" value="6"></label>
 <label>RMS tolerance <input aria-label="Fit tolerance" type="number" min="0" max="1" step="any" value="0.001"></label>
 <label>Response <select aria-label="Fit response"><option value="analytic">Continuous material</option><option value="ade">FDTD at current timestep</option></select></label>
 <label><input aria-label="Include Drude pole" type="checkbox" checked> Include Drude pole</label></div>
 <button data-fit ${e.samples?"":"disabled"}>Fit optical data</button> <button data-use-fit disabled>Use fitted material</button>
 </fieldset><p class="fit-status" role="status">Fit accuracy applies inside the sampled band. Device accuracy also requires time and mesh convergence.</p>
 <canvas aria-label="Measured and fitted optical response"></canvas></details>`;let h=null,m=((T=e.provenance)==null?void 0:T.file_name)||"";const g=S=>{d(".fit-status").textContent=S};function _(){h=null,d("[data-use-fit]").disabled=!0,o(),g("Inputs changed. Fit again to update the candidate.");const S=d("canvas");S.getContext("2d").clearRect(0,0,S.width,S.height)}return n.querySelectorAll("input,select,textarea").forEach(S=>S.oninput=_),n.querySelectorAll('textarea,[aria-label="Optical data columns"],[aria-label="Optical wavelength unit"],[aria-label="Optical data file"]').forEach(S=>S.addEventListener("input",()=>{d("[data-fit]").disabled=!0})),d('[aria-label="Optical data file"]').onchange=async S=>{const M=a(),b=S.target.files[0];if(b){if(b.size>2e6){g("Optical data file exceeds 2 MB.");return}try{const x=await b.text();if(!r(M))return;d("textarea").value=x,d('[aria-label="Optical data reference"]').value=b.name,m=b.name,_()}catch(x){r(M)&&g(x.message)}}},d("[data-import]").onclick=async()=>{const S=a();g("Reading optical samples…");try{const M={text:d("textarea").value,kind:d('[aria-label="Optical data columns"]').value,unit:d('[aria-label="Optical wavelength unit"]').value,reference:d('[aria-label="Optical data reference"]').value,source:d('[aria-label="Optical data reference"]').value,licence:d('[aria-label="Optical data licence"]').value,file_name:m},b=await i("/materials/data",M),x=await i("/materials/provenance",M);if(!r(S))return;e.samples=b,e.provenance=x,e.fit_band_um=null,e.fit_dt_s=null,h=null,d('[aria-label="Fit wavelength start"]').value=b.wavelength_um[0],d('[aria-label="Fit wavelength stop"]').value=b.wavelength_um.at(-1),d("[data-data-status]").textContent=`${b.wavelength_um.length} samples · ${b.wavelength_um[0]}–${b.wavelength_um.at(-1)} µm`,d("[data-fit]").disabled=!t,d("[data-use-fit]").disabled=!0,o(),g("Data imported. Fit to create simulation coefficients.")}catch(M){r(S)&&g(M.message)}},d("[data-fit]").onclick=async()=>{const S=a();h=null,d("[data-use-fit]").disabled=!0,g("Fitting passive oscillators…");try{const M={max_poles:Number(d('[aria-label="Maximum fit poles"]').value),tolerance:Number(d('[aria-label="Fit tolerance"]').value),wavelength_range_um:[Number(d('[aria-label="Fit wavelength start"]').value),Number(d('[aria-label="Fit wavelength stop"]').value)],include_drude:d('[aria-label="Include Drude pole"]').checked,target:d('[aria-label="Fit response"]').value},b=structuredClone(e.samples);if(b.reference=d('[aria-label="Optical data reference"]').value,M.dt_s=await l(),!r(S))return;const x=await i("/materials/fit",{data:b,options:M,name:e.name,color:e.color,provenance:e.provenance||null});if(!r(S))return;h=x;const v=x.report,A=v.target==="ade"?"numerical":"fitted";ts(d("canvas"),[["measured_n","n (data)"],["measured_k","k (data)"],[`${A}_n`,"n (fit)"],[`${A}_k`,"k (fit)"]].map(([I,P])=>({name:P,wavelength_um:v.wavelength_um,spectrum:v[I],spectrum_label:"Wavelength (µm) · measured and fitted n + i k"})),!0,!0),g(`${v.converged?"Tolerance met":"Tolerance NOT met"} · ${v.pole_count} poles · ${v.sample_count} samples · analytic RMS ${v.analytic.normalized_rms.toExponential(3)} · FDTD RMS ${v.ade.normalized_rms.toExponential(3)} at Δt ${(v.dt_s*1e15).toPrecision(5)} fs · ${v.seconds.toFixed(2)} s. ${v.converged?"Use fitted material, then Apply materials to save.":"Adjust the fit band or pole limit. Current coefficients have not changed."}`),d("[data-use-fit]").disabled=!t||!v.converged}catch(M){r(S)&&g(M.message)}},d("[data-use-fit]").onclick=()=>{h!=null&&h.report.converged&&c(h.material)},{invalidate(){h=null,d("[data-use-fit]").disabled=!0,g("Material parameters changed. Fit again to update the candidate.")}}}const Mc={model:"dielectric",index:1.5,color:"#60bdaa",epsilon_inf:1,plasma_rad_s:2e15,collision_rad_s:1e14,resonance_rad_s:2e15,linewidth_rad_s:1e14,delta_epsilon:1,poles:[],epsilon_tensor:[2.25,2.25,2.25,0,0,0]};function n0({state:n,api:e,esc:t,toast:i,commit:s}){const a=document.createElement("dialog");a.className="material-dialog",document.body.append(a);let r,o=0,l=0,c;a.onclose=()=>{l++};const d=T=>a.querySelector(T),u=(T,S,M="",b=0)=>`<label class="material-field"><span>${T}</span><input aria-label="${T}" data-material-field="${S}" type="${S==="name"?"text":S==="color"?"color":"number"}" value="${t(r.materials[o][S])}" ${S==="name"?'maxlength="100"':`min="${b}" step="any"`}><small>${M}</small></label>`,h=()=>({resonance_rad_s:2e15,strength_rad_s_squared:4e30,damping_rad_s:1e14});function m(T){return`<div class="pole-editor">${T.poles.map((S,M)=>`<details open class="boundary-options"><summary>Pole ${M+1}</summary>${[["Resonance","resonance_rad_s","rad/s",0],["Oscillator strength","strength_rad_s_squared","rad²/s²",1e-30],["Damping","damping_rad_s","rad/s",0]].map(([b,x,v,A])=>`<label class="material-field"><span>${b}</span><input aria-label="Pole ${M+1} ${b}" type="number" min="${A}" step="any" data-pole-index="${M}" data-pole-field="${x}" value="${t(S[x])}"><small>${v}</small></label>`).join("")}<button data-remove-pole="${M}" ${T.poles.length<2?"disabled":""}>Remove pole ${M+1}</button></details>`).join("")}<button data-add-pole ${T.poles.length>=16?"disabled":""}>+ Add pole</button><p>Set resonance to zero for a Drude pole. Strength must be positive and damping nonnegative. Measured optical samples can be fitted below.</p></div>`}function g(T){return`<div class="tensor-material-editor"><p>Real symmetric relative permittivity in the Cartesian x, y, z basis. Principal permittivities must be at least 1.</p>${["xx","yy","zz","xy","xz","yz"].map((S,M)=>`<label class="material-field"><span>ε${S}</span><input aria-label="Tensor epsilon ${S}" data-tensor-index="${M}" type="number" step="any" value="${t(T.epsilon_tensor[M])}"><small>relative</small></label>`).join("")}<p>Uniform 3D grid, resident FP32, point sources and monitors. Periodic/Bloch boundaries or PML with a fixed isotropic exterior. Geometry is sampled at common nodes.</p><button data-tensor-sampling>Use supported tensor sampling</button><p>This stages staircase geometry and Yee field sampling. Apply materials saves both changes.</p></div>`}function _(){return"Tensor material: six Cartesian coefficients are used directly. Scalar n / k and isotropic optical-data fitting do not apply."}function p(T){if(T.model==="tensor")return"";const S=T.provenance,M=T.fit_band_um,b=(A,I)=>`<div><span>${A}</span><span>${I}</span></div>`,x=S?b("Source",t(S.source))+b("Licence / usage",t(S.licence||"not stated"))+b("Raw SHA-256",`<code title="${t(S.raw_sha256)}">${t(S.raw_sha256.slice(0,16))}…</code>`)+b("File / columns",`${t(S.file_name||"pasted text")} · ${t(S.columns)} in ${t(S.wavelength_unit)}${S.imported?` · imported ${t(S.imported)}`:""}`):b("Source","No provenance recorded. Name the data source before importing a table."),v=M?`${M[0]}–${M[1]} µm${T.fit_dt_s?` · ADE-target fit at Δt ${(T.fit_dt_s*1e15).toPrecision(5)} fs`:""}`:T.samples?"Samples retained, not fitted: no accuracy statement.":"No fitted band: analytic coefficients only.";return`<details open class="material-provenance" data-provenance><summary>Provenance and fitted band</summary><div class="provenance-grid">${x}${b("Fitted band",v)}${b("Discretization n / k error","<span data-discretization>Select Plot n / k to evaluate at the current timestep.</span>")}${b("Simulation band","<span data-band-status>Checking the project sources…</span>")}</div></details>`}async function f(T){const S=d("[data-band-status]");if(S)try{const M=await e("/validate",r);if(!S.isConnected)return;const b=(M.warnings||[]).filter(x=>x.includes("fit band")&&x.includes(T.name));S.textContent=b.length?b.join(" "):T.fit_band_um?"Every enabled source band lies inside the fitted band.":"No fitted band to check against.",S.classList.toggle("band-warning",b.length>0)}catch(M){S.isConnected&&(S.textContent=M.message)}}function w(){l++;const T=r.materials[o];Object.entries(Mc).forEach(([S,M])=>T[S]??(T[S]=structuredClone(M))),a.innerHTML=`<div class="fsp-heading"><h2>Material database</h2><button data-dismiss>Close</button></div><p>Dielectric, full symmetric tensor, Drude, Lorentz and multiple passive poles.</p><div class="material-workspace"><aside><select size="8" aria-label="Material list">${r.materials.map((S,M)=>`<option value="${M}" ${M===o?"selected":""}>${t(S.name)}</option>`).join("")}</select><button data-add-material>+ Add material</button></aside><section><fieldset ${n.mode!=="layout"?"disabled":""}>${u("Material name","name")}${u("Display color","color")}<label class="material-field"><span>Material model</span><select aria-label="Material model" data-material-field="model">${[["dielectric","Dielectric"],["tensor","Symmetric dielectric tensor"],["drude","Plasma (Drude)"],["lorentz","Lorentz"],["multipole","Multiple Drude / Lorentz poles"]].map(([S,M])=>`<option value="${S}" ${T.model===S?"selected":""}>${M}</option>`).join("")}</select></label>${T.model==="tensor"?g(T):T.model==="dielectric"?u("Refractive index","index","",1):u("Permittivity (epsilon infinity)","epsilon_inf","",1)}${T.model==="drude"?u("Plasma resonance","plasma_rad_s","rad/s")+u("Plasma collision","collision_rad_s","rad/s"):T.model==="lorentz"?u("Lorentz permittivity","delta_epsilon")+u("Lorentz resonance","resonance_rad_s","rad/s")+u("Lorentz linewidth","linewidth_rad_s","rad/s"):T.model==="multipole"?m(T):""}</fieldset><p class="material-formula">${T.model==="tensor"?"ε = [[εxx, εxy, εxz], [εxy, εyy, εyz], [εxz, εyz, εzz]]":T.model==="dielectric"?"ε = n²":T.model==="drude"?"ε(ω) = ε∞ − ωp² / (ω² + i γ ω)":T.model==="multipole"?"ε(ω) = ε∞ + Σ Aⱼ / (ωⱼ² − ω² − i γⱼ ω)":"ε(ω) = ε∞ + Δε ω₀² / (ω₀² − ω² − 2 i δ ω)"}${T.model==="tensor"?"":"<br>Frequency parameters above are angular frequencies, in rad/s."}</p></section></div><div data-optical-fit></div>${p(T)}<div class="material-range"><label>Wavelength start (µm) <input aria-label="Material wavelength start" type="number" value="1.3" min="0.001" step=".01"></label><label>Wavelength stop (µm) <input aria-label="Material wavelength stop" type="number" value="1.8" min="0.001" step=".01"></label><button data-preview>Plot n / k</button></div><canvas></canvas><p class="material-status" role="status">Preview includes the current simulation timestep.</p><div class="dialog-actions"><button data-apply ${n.mode!=="layout"?"disabled":""}>Apply materials</button><button data-dismiss>Cancel</button></div>`,c=T.model==="tensor"?null:t0({host:d("[data-optical-fit]"),material:T,editable:n.mode==="layout",api:e,esc:t,begin:()=>++l,current:S=>S===l&&a.open,invalidate:E,timestep:async()=>(await e("/validate",r)).dt_fs*1e-15,use:S=>{r.materials[o]=S,w(),y()}}),d('[aria-label="Material list"]').onchange=S=>{o=+S.target.value,w()},d("[data-add-material]").disabled=n.mode!=="layout",d("[data-add-material]").onclick=()=>{let S=r.materials.length;for(;r.materials.some(M=>M.name===`Custom material ${S}`);)S++;r.materials.push({...structuredClone(Mc),name:`Custom material ${S}`}),o=r.materials.length-1,w()},a.querySelectorAll("[data-material-field]").forEach(S=>S.onchange=()=>{const M=S.dataset.materialField,b=T.name;if(M==="name"&&(!S.value.trim()||r.materials.some((x,v)=>v!==o&&x.name===S.value))){S.value=b,d(".material-status").textContent="Material names must be nonempty and unique.";return}T[M]=["name","model","color"].includes(M)?S.value:Number(S.value),M==="name"&&r.structures.forEach(x=>{x.material===b&&(x.material=T.name)}),M==="model"&&T.model==="multipole"&&!T.poles.length&&T.poles.push(h()),M==="model"||M==="name"?w():E()}),a.querySelectorAll(".material-range input").forEach(S=>S.onchange=E),a.querySelectorAll("[data-dismiss]").forEach(S=>S.onclick=()=>a.close()),d("[data-add-pole]")&&(d("[data-add-pole]").onclick=()=>{T.poles.length<16&&(T.poles.push(h()),w())}),a.querySelectorAll("[data-remove-pole]").forEach(S=>S.onclick=()=>{T.poles.splice(+S.dataset.removePole,1),w()}),a.querySelectorAll("[data-pole-field]").forEach(S=>S.onchange=()=>{T.poles[+S.dataset.poleIndex][S.dataset.poleField]=Number(S.value),E()}),a.querySelectorAll("[data-material-field],[data-pole-field]").forEach(S=>S.addEventListener("input",E)),a.querySelectorAll("[data-tensor-index]").forEach(S=>{S.onchange=()=>{T.epsilon_tensor[+S.dataset.tensorIndex]=Number(S.value),E()},S.addEventListener("input",E)}),d("[data-tensor-sampling]")&&(d("[data-tensor-sampling]").onclick=()=>{r.region.interface_method="staircase",r.region.material_sampling="yee",E(),d(".material-status").textContent="Staircase geometry and Yee field sampling staged. Apply materials to save."}),d("[data-preview]").disabled=T.model==="tensor",d(".material-range").hidden=T.model==="tensor",d(".material-range + canvas").hidden=T.model==="tensor",T.model==="tensor"&&(d(".material-status").textContent=_()),d("[data-preview]").onclick=y,f(T),d("[data-apply]").onclick=async()=>{try{const S=await e("/validate",r);s(S.project),a.close()}catch(S){d(".material-status").textContent=S.message,i(S.message)}}}function E(){l++,c==null||c.invalidate();const T=d(".material-range + canvas");T.getContext("2d").clearRect(0,0,T.width,T.height),d(".material-status").textContent=r.materials[o].model==="tensor"?_():"Parameters changed. Select Plot n / k to refresh."}async function y(){if(r.materials[o].model==="tensor"){d(".material-status").textContent=_();return}const T=++l;try{const S=Number(d('[aria-label="Material wavelength start"]').value),M=Number(d('[aria-label="Material wavelength stop"]').value),b=(await e("/validate",r)).dt_fs;if(T!==l)return;const x=await e(`/materials/preview?wavelength_start=${S}&wavelength_stop=${M}&dt_fs=${b}`,r.materials[o]);if(T!==l)return;ts(d(".material-range + canvas"),["n","k","numerical_n","numerical_k"].map((v,A)=>({name:["n (analytic)","k (analytic)","n (ADE)","k (ADE)"][A],wavelength_um:x.wavelength_um,spectrum:x[v],spectrum_label:"Wavelength (µm) · complex index n + i k"})),!0,!0),d("[data-discretization]")&&(d("[data-discretization]").textContent=x.discretization?`max |Δn| ${x.discretization.max_abs_n_error.toExponential(3)} at ${x.discretization.max_abs_n_error_at_um.toFixed(4)} µm, max |Δk| ${x.discretization.max_abs_k_error.toExponential(3)} at ${x.discretization.max_abs_k_error_at_um.toFixed(4)} µm on ${x.discretization.band_um[0]}–${x.discretization.band_um[1]} µm at Δt ${b.toPrecision(5)} fs (trapezoidal ADE against the fitted continuum).`:"Import and fit optical samples to evaluate the ADE error over the fitted band."),d(".material-status").textContent=`${x.wavelength_um.length} wavelengths · analytic response and ADE at Δt = ${b.toPrecision(5)} fs. Positive k means absorption.${x.samples?` Retained samples: analytic RMS ${x.samples.analytic.normalized_rms.toExponential(3)}, FDTD RMS ${x.samples.ade.normalized_rms.toExponential(3)}.`:""}`}catch(S){T===l&&(d(".material-status").textContent=S.message)}}return{open(){r=structuredClone(n.project),o=0,w(),a.showModal()}}}function i0({api:n,esc:e}){const t=document.createElement("dialog");t.className="capability-dialog",document.body.append(t);let i;const s=o=>t.querySelector(o);function a(){const o=i.combinations;if(!o)return"";const l=Object.keys(o.axes),c=d=>l.map(u=>`<option value="${u}" ${u===d?"selected":""}>${e(o.axis_labels[u])}</option>`).join("");return`<details class="capability-combinations" open><summary>Combination support: ${o.summary.admitted.toLocaleString()} of ${o.summary.total.toLocaleString()} axis combinations run (${o.summary.rules} rejection rules, ${o.summary.lanes} entry points)</summary><p>Every combination of dimension, mesh, material, boundaries, source, monitor, execution, precision and backend is one small scene executed through its entry point. A cell runs (✓) when at least one full combination with its two values runs; otherwise it names the rule that explains the pair, and its tooltip gives the code path and the exact message. Generated from torchfdtd/capabilities.py; the full tables are docs/CAPABILITIES.md.</p><div class="capability-filters"><label>Rows <select data-axis-a aria-label="Combination rows">${c(l[6])}</select></label><label>Columns <select data-axis-b aria-label="Combination columns">${c(l[3])}</select></label></div><div class="capability-table"><div class="combination-grid" data-combination-table></div></div></details>`}function r(){const o=i.combinations;if(!o)return;const l=Object.keys(o.axes);let c=s("[data-axis-a]").value,d=s("[data-axis-b]").value;const u=s("[data-combination-table]");if(c===d){u.style.gridTemplateColumns="auto",u.innerHTML="<div>Choose two different axes.</div>";return}l.indexOf(c)>l.indexOf(d)&&([c,d]=[d,c]);const h=o.pairs[c+"|"+d],m=Object.fromEntries(o.rules.map(p=>[p.name,p])),g=Object.fromEntries(o.lanes.map(p=>[p.name,p]));u.style.gridTemplateColumns=`repeat(${o.axes[d].length+1},max-content)`;let _=`<div class="combination-head">${e(o.axis_labels[c])} / ${e(o.axis_labels[d])}</div>${o.axes[d].map(p=>`<div class="combination-head">${e(o.value_labels[d][p])}</div>`).join("")}`;for(const p of o.axes[c]){_+=`<div class="combination-head">${e(o.value_labels[c][p])}</div>`;for(const f of o.axes[d]){const w=h[p+"|"+f];if(w.status==="admitted"){const E=Object.keys(w.lanes);_+=`<div class="combination-cell cap-status implemented" title="${e(E.map(y=>{var T;return y+": "+(((T=g[y])==null?void 0:T.code_path)||"")}).join(`
`))}">✓ ${w.admitted}/${w.total}</div>`}else{const E=w.reason||Object.keys(w.rules)[0],y=m[E]||{};_+=`<div class="combination-cell cap-status missing" title="${e((y.code_path||"")+`
`+(y.message||""))}">✗ ${e(E)}</div>`}}}u.innerHTML=_}return{async open(){i=await n("/capabilities"),t.innerHTML=`<div class="fsp-heading"><h2>Supported combinations</h2><button data-close-panel>Close</button></div>${a()}<p><a href="/api/capabilities" target="_blank">JSON</a></p>`,s("[data-close-panel]").onclick=()=>t.close();for(const o of["data-axis-a","data-axis-b"])s("["+o+"]")&&(s("["+o+"]").onchange=r);r(),t.showModal()}}}function s0({esc:n}){const e=document.createElement("dialog");e.className="inverse-design-dialog",document.body.append(e);const t=b=>e.querySelector(b),i="torchfdtd.periodicDesign.v1",s=i+".job";let a,r=localStorage.getItem(s),o,l=!1,c=null,d=!1,u=!1;async function h(b,x){var I;const v=await fetch("/api/"+b,x===void 0?{}:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(x)}),A=(I=v.headers.get("content-type"))!=null&&I.includes("json")?await v.json():await v.text();if(!v.ok)throw Error(typeof A.detail=="string"?A.detail:JSON.stringify(A.detail||A));return A}function m(){localStorage.setItem(i,JSON.stringify(a))}function g(b,x,v="application/json"){const A=URL.createObjectURL(new Blob([b],{type:v})),I=document.createElement("a");I.href=A,I.download=x,I.click(),setTimeout(()=>URL.revokeObjectURL(A),1e3)}function _(b){t("[data-design-status]").textContent=b.message}const p=(b,x,v,A="any")=>`<label>${b}<input aria-label="${b}" data-key="${x}" type="number" step="${A}" value="${n(v)}"></label>`,f=(b,x,v)=>`<label>${b}<select aria-label="${b}" data-key="${x}">${v.map(([A,I])=>`<option value="${A}" ${a[x]===A?"selected":""}>${I}</option>`).join("")}</select></label>`;function w(){var P;const b=d&&((P=c==null?void 0:c.progress)!=null&&P.density_preview)?c.progress.density_preview:a.initial_density,x=t("[data-density]"),v=x.getContext("2d"),A=b.length,I=b[0].length;v.clearRect(0,0,x.width,x.height);for(let O=0;O<A;O++)for(let N=0;N<I;N++){const z=Math.max(0,Math.min(1,Number(b[O][N])));v.fillStyle=`rgb(${Math.round(18+207*z)},${Math.round(39+190*z)},${Math.round(65+95*z)})`,v.fillRect(O*x.width/A,(I-1-N)*x.height/I,Math.ceil(x.width/A),Math.ceil(x.height/I))}t("[data-density-caption]").textContent=(d?"Latest evaluated density":"Initial density")+` · x: ${A}, y: ${I} · 0 background / 1 design material`}function E(b){l=b,e.querySelectorAll("fieldset").forEach(x=>x.disabled=b),t("[data-start-design]").disabled=b,t("[data-plan-design]").disabled=b,t("[data-stop-design]").disabled=!b,t("[data-load-design]").disabled=b,t("[data-use-seed]").disabled=b||!(c!=null&&c.summary)}function y(){e.innerHTML=`<div class="fsp-heading"><div><h2>Inverse design · periodic layer</h2><p>FP32 · Torch adjoint · automatic memory placement</p></div><button data-close-design>Close</button></div>
  <p class="design-scope">Optimize a continuous density layer at one wavelength. This setup is separate from the CAD scene. Fixed materials, periodic x/y boundaries and PML in z. Mesh convergence and fabrication constraints require separate validation.</p>
  <div class="design-grid"><section class="design-settings"><fieldset><legend>Structure & illumination</legend>
   ${p("Wavelength (µm)","wavelength_um",a.wavelength_um)}
   ${p("Period x (µm)","period_um.0",a.period_um[0])}${p("Period y (µm)","period_um.1",a.period_um[1])}
   ${p("Layer height (µm)","height_um",a.height_um)}${p("Detector offset (µm)","detector_offset_um",a.detector_offset_um)}
   ${p("Background index","background_index",a.background_index)}${p("Design index","design_index",a.design_index)}
   ${p("Incidence θ (degrees)","theta_deg",a.theta_deg)}${p("Azimuth φ (degrees)","phi_deg",a.phi_deg)}
   ${p("Mesh (µm)","mesh_um",a.mesh_um)}${p("Time steps","steps",a.steps,1)}${p("PML cells","pml_cells",a.pml_cells,1)}
  </fieldset><fieldset><legend>Objective & optimizer</legend><p>Maximize weighted quadrant power, averaged over two polarizations.</p>
   ${["R","G2","G1","B"].map((v,A)=>p(v+" weight","objective_weights."+A,a.objective_weights[A])).join("")}
   ${p("Adam updates","iterations",a.iterations,1)}${p("Learning rate","learning_rate",a.learning_rate)}
  </fieldset><fieldset><legend>Memory & execution</legend>
   ${f("Compute device","device",[["cpu","CPU"],["cuda","CUDA GPU"]])}
   ${f("Execution mode","execution",[["auto","Automatic"],["resident","Resident"],["recorded","Boundary-history adjoint"],["dram","DRAM streaming"],["file","File streaming"]])}
   ${p("GPU budget (GiB)","gpu_budget_gib",a.gpu_budget_gib)}${p("DRAM budget (GiB)","host_budget_gib",a.host_budget_gib)}
   ${a.execution==="recorded"?`
    ${f("Boundary history","recorded_trace_storage",[["cpu","CPU RAM"],["device","Compute device"]])}
    ${p("Transfer block (steps)","recorded_trace_chunk_steps",a.recorded_trace_chunk_steps,1)}
    ${p("Fixed collar (cells)","recorded_collar_cells",a.recorded_collar_cells,1)}
    <p data-recorded-scope>Reconstruct the lossless design interior from boundary history. Fields remain on the compute device. The layer and source must fit inside the fixed exterior collar. CUDA with CPU history uses asynchronous transfers.</p>
   `:`${p("Checkpoints","checkpoints",a.checkpoints,1)}${p("Maximum slab width","slab_width",a.slab_width,1)}${p("Temporal depth","temporal_depth",a.temporal_depth,1)}
    <details><summary>Optional file backing</summary><label>State directory<input aria-label="State directory" data-key="state_directory" value="${n(a.state_directory||"")}"></label>
    ${p("File budget (GiB)","disk_budget_gib",a.disk_budget_gib??"")}${p("Keep disk free (GiB)","disk_free_reserve_gib",a.disk_free_reserve_gib)}<p>Used only when explicitly configured. Default free-space reserve: 100 GiB.</p></details>`}
  </fieldset></section>
  <section class="design-density"><h3>Design region</h3><canvas data-density width="512" height="512" aria-label="Density editor"></canvas><p data-density-caption></p>
   <fieldset><legend>Initial density</legend><div class="design-density-tools"><label>x pixels<input aria-label="Density x pixels" data-nx type="number" value="${a.initial_density.length}" min="1" max="1024"></label><label>y pixels<input aria-label="Density y pixels" data-ny type="number" value="${a.initial_density[0].length}" min="1" max="1024"></label><label>Paint value<input aria-label="Density paint value" data-paint type="number" value="0.5" min="0" max="1" step="0.1"></label></div><button data-reset-density>Fill / resize initial density</button><button data-show-initial>Show initial density</button><p>Click or drag to paint. x increases right and y increases upward.</p></fieldset>
   <div class="design-file-tools"><button data-save-design>Save setup JSON</button><button data-load-design>Load setup JSON</button><button data-export-design>Export Python</button><input data-import-design type="file" accept=".json" hidden></div>
   <button data-use-seed disabled>Use evaluated result as new seed</button>
  </section>
  <section class="design-run"><h3>Execution plan</h3><button data-plan-design>Check memory</button><p data-plan-summary>No fields or trial simulations are run by the memory check.</p>
   <div class="design-run-buttons"><button data-start-design>Run inverse design</button><button data-stop-design disabled>Stop</button></div><p data-design-status role="status">Ready</p><p class="design-stop-note">Stop takes effect between solver calls. Closing this panel keeps the job running.</p>
   <h3>Evaluated objective</h3><table><thead><tr><th>Update</th><th>Score ↑</th><th>Gradient L2</th></tr></thead><tbody data-design-history></tbody></table><a data-design-download hidden>Download evaluated designs</a>
  </section></div>`,t("[data-close-design]").onclick=()=>e.close(),e.querySelectorAll("[data-key]").forEach(v=>v.onchange=()=>{const[A,I]=v.dataset.key.split(".");let P=v.type==="number"?v.value===""?null:Number(v.value):v.value;A==="state_directory"&&!P&&(P=null),I!==void 0?a[A][Number(I)]=P:a[A]=P,m(),d=!1,A==="execution"?y():w(),t("[data-plan-summary]").textContent="Settings changed. Check memory before running."}),t("[data-reset-density]").onclick=()=>{try{const v=Number(t("[data-nx]").value),A=Number(t("[data-ny]").value),I=Number(t("[data-paint]").value);if(!Number.isInteger(v)||!Number.isInteger(A)||v<1||A<1||v*A>1048576||I<0||I>1)throw Error("Use positive pixel counts and a density in [0,1].");a.initial_density=Array.from({length:v},()=>Array(A).fill(I)),m(),d=!1,w(),t("[data-plan-summary]").textContent="Settings changed. Check memory before running."}catch(v){_(v)}},t("[data-show-initial]").onclick=()=>{d=!1,w()};const b=t("[data-density]");function x(v){if(l||d)return;const A=b.getBoundingClientRect(),I=a.initial_density,P=Number(t("[data-paint]").value);if(!Number.isFinite(P)||P<0||P>1)return;const O=Math.min(I.length-1,Math.max(0,Math.floor((v.clientX-A.left)/A.width*I.length))),N=Math.min(I[0].length-1,Math.max(0,I[0].length-1-Math.floor((v.clientY-A.top)/A.height*I[0].length)));I[O][N]=P,w()}b.onpointerdown=v=>{u=!0,b.setPointerCapture(v.pointerId),x(v)},b.onpointermove=v=>{u&&x(v)},b.onpointerup=()=>{u=!1,m()},t("[data-plan-design]").onclick=async()=>{try{const v=await h("design/plan",a);T(v)}catch(v){_(v)}},t("[data-start-design]").onclick=async()=>{try{E(!0),c=null,r=(await h("design/jobs",a)).id,localStorage.setItem(s,r),await M()}catch(v){E(!1),_(v)}},t("[data-stop-design]").onclick=async()=>{try{await h("jobs/"+r+"/cancel",{}),t("[data-design-status]").textContent="Stop requested. Waiting for the current solver call."}catch(v){_(v)}},t("[data-save-design]").onclick=()=>g(JSON.stringify(a,null,2),"periodic-design.json"),t("[data-export-design]").onclick=async()=>{try{g(await h("design/python",a),"periodic_design.py","text/x-python")}catch(v){_(v)}},t("[data-load-design]").onclick=()=>t("[data-import-design]").click(),t("[data-import-design]").onchange=async v=>{try{const A=v.target.files[0];if(!A)return;const I=JSON.parse(await A.text());a=await h("design/config",I),m(),d=!1,c=null,r=null,localStorage.removeItem(s),y()}catch(A){_(A)}},t("[data-use-seed]").onclick=async()=>{try{const v=await h("design/jobs/"+r+"/download");if(!v.last_evaluated)throw Error("No evaluated density is available.");a={...v.config,initial_density:v.last_evaluated.density},m(),d=!1,c=null,r=null,localStorage.removeItem(s),y()}catch(v){_(v)}},w(),E(l),c&&S(c)}function T(b){var v;const x=((v=b.selection)==null?void 0:v.mode)||b.execution;t("[data-plan-summary]").textContent=`${b.device==="cuda"?"CUDA GPU":"CPU"} · ${x} · FP32
GPU ${(b.gpu_reservation_bytes/1024**3).toFixed(3)} GiB · DRAM ${(b.total_host_reservation_bytes/1024**3).toFixed(3)} GiB · file ${(b.disk_reservation_bytes/1024**3).toFixed(3)} GiB reserved. No calibration solves.`}function S(b){var I;c=b;const x=b.progress||{};E(["queued","running"].includes(b.status));const v=JSON.stringify(b.config)===JSON.stringify(a);t("[data-design-status]").textContent=b.error||`${l&&b.cancel_requested?"Stopping":b.status} · ${x.stage||"waiting"} · ${x.updates_completed||0} / ${((I=b.config)==null?void 0:I.iterations)||a.iterations} updates`,x.plan&&v?T(x.plan):v||(t("[data-plan-summary]").textContent="Settings differ from the displayed run. Check memory for this setup."),t("[data-design-history]").innerHTML=(x.history||[]).map(P=>`<tr><td>${P.update}</td><td>${P.objective.toPrecision(7)}</td><td>${P.gradient_l2===void 0?"—":P.gradient_l2.toExponential(3)}</td></tr>`).join(""),x.density_preview&&v&&(d=!0,w());const A=t("[data-design-download]");A.hidden=!b.summary,A.href="/api/design/jobs/"+r+"/download"}async function M(){clearTimeout(o);try{const b=await h("jobs/"+r);S(b),l&&e.open&&(o=setTimeout(M,1500))}catch(b){E(!1),_(b)}}return e.addEventListener("close",()=>clearTimeout(o)),{async open(){if(!a){const b=await h("design/defaults");try{const x=JSON.parse(localStorage.getItem(i));a=x?await h("design/config",x):b}catch{a=b}if(!localStorage.getItem(i)){const x=await h("health");a.device=x.cuda?"cuda":"cpu"}}y(),e.showModal(),r&&await M()}}}function a0(n,e){const t={auto_shutoff:!1,decay_threshold:1e-6,check_interval:50,consecutive_checks:3,min_steps:100,source_tail_amplitude:1e-8,after_source_s:0,divergence_check:!0,growth_limit:1e6,field_limit:null};n.run_control??(n.run_control={});const i=n.run_control;for(const[a,r]of Object.entries(t))i[a]===void 0&&(i[a]=r);const s=(a,r,o="",l={})=>e(a,"run_control."+r,i[r],o,l);return`<label class="enabled-row"><input aria-label="Automatic decay shutoff" type="checkbox" data-path="run_control.auto_shutoff" ${i.auto_shutoff?"checked":""}> Automatic decay shutoff</label>`+s("decay threshold","decay_threshold","",{min:1e-15})+s("check every","check_interval","steps",{min:1,step:1})+s("consecutive low checks","consecutive_checks","",{min:2,step:1})+s("minimum time steps","min_steps","",{min:10,step:1})+s("source tail cutoff","source_tail_amplitude","",{min:1e-15})+e("wait after source","run_control.after_source_s",i.after_source_s*1e15,"fs",{min:0,scale:1e-15})+`<label class="enabled-row"><input aria-label="Divergence checking" type="checkbox" data-path="run_control.divergence_check" ${i.divergence_check?"checked":""}> Divergence checking</label>`+s("post-source growth limit","growth_limit","",{min:1.01})+`<label class="enabled-row"><input aria-label="Absolute field limit" type="checkbox" data-run-field-limit ${i.field_limit!==null?"checked":""}> Absolute field limit</label>`+(i.field_limit!==null?s("maximum field magnitude","field_limit","",{min:1e-30}):"")+'<p class="property-help">Decay threshold and growth limit are ratios of the whole-domain state norm. Source tail cutoff is a relative envelope amplitude. Absolute field limits use reduced field units. All finite sources must finish before decay checks. Continuous sources disable automatic termination. Confirm spectra with a longer run.</p>'}async function r0({state:n,api:e,esc:t,toast:i}){const s=n.job;if(!s)throw Error("Complete a 3D run with a six-field frequency plane first.");const[a,r]=await Promise.all([e(`/jobs/${s}/diffraction-monitors`),e("/jobs")]);if(!a.length)throw Error("Add a full-cell frequency monitor and record all six E/H fields, then rerun.");const o=document.createElement("dialog");o.className="radiation-dialog monitor-dialog",o.style.width="min(1000px,92vw)",document.body.append(o);const l=h=>o.querySelector(h);o.innerHTML=`<div class="fsp-heading"><h2>Diffraction orders</h2><button data-close>Close</button></div>
 <p>Requires a complete periodic unit-cell plane with six collocated E/H fields in a homogeneous lossless isotropic medium outside PML. This is not an isolated-object far-field projection.</p>
 <label>Stored plane <select aria-label="Diffraction plane">${a.map(h=>`<option value="${t(h.id)}">${t(h.name)} (+${h.normal})</option>`).join("")}</select></label>
 <label>Frequency <select aria-label="Diffraction frequency"></select></label>
 <label>Exterior refractive index <input aria-label="Exterior refractive index" type="number" min="0.001" max="20" step="0.01" value="1"></label>
 <label>Integer orders (m,n per line)<textarea aria-label="Diffraction orders" rows="3">0,0</textarea></label>
 <label>Matched reference <select aria-label="Diffraction reference"><option value="">Raw directional powers only</option>${r.filter(h=>h.id!==s&&h.status==="completed").map(h=>`<option value="${t(h.id)}">${t(h.name)} (${t(h.id.slice(0,8))})</option>`).join("")}</select></label>
 <label><input type="checkbox" aria-label="Subtract incident diffraction fields"> Subtract matched incident fields before normalized power</label>
 <label><input type="checkbox" aria-label="Confirm diffraction exterior"> I confirm both planes are in the declared homogeneous, lossless isotropic exterior, outside PML.</label>
 <button data-calculate>Calculate diffraction</button><p role="status"></p><div data-results></div>`;let c=0;function d(){c++,l("[data-results]").innerHTML="",l('[role="status"]').textContent="",l("[data-calculate]").disabled=!1}function u(){const h=a.find(m=>m.id===l('[aria-label="Diffraction plane"]').value);l('[aria-label="Diffraction frequency"]').innerHTML=h.frequency_thz.map((m,g)=>`<option value="${g}">${m.toPrecision(7)} THz</option>`).join(""),l("[data-results]").innerHTML=""}l('[aria-label="Diffraction plane"]').onchange=u,u(),o.querySelectorAll("input,select,textarea").forEach(h=>{h.addEventListener("input",d),h.addEventListener("change",d)}),l("[data-close]").onclick=()=>o.close(),o.addEventListener("close",()=>{c++,o.remove()},{once:!0}),l("[data-calculate]").onclick=async()=>{const h=++c,m=l("[data-calculate]");m.disabled=!0,l("[data-results]").innerHTML="";try{const g=l('[aria-label="Diffraction orders"]').value.trim().split(/\n+/).map(w=>w.trim().split(/[\s,]+/).map(Number));if(!g.length||g.some(w=>w.length!==2||w.some(E=>!Number.isInteger(E))))throw Error("Enter one pair of integers per line, for example 0,0.");const _=l('[aria-label="Diffraction reference"]').value,p=await e(`/jobs/${s}/diffraction`,{monitor:l('[aria-label="Diffraction plane"]').value,frequency_index:Number(l('[aria-label="Diffraction frequency"]').value),orders:g,refractive_index:Number(l('[aria-label="Exterior refractive index"]').value),reference:_||null,subtract_incident:l('[aria-label="Subtract incident diffraction fields"]').checked,confirm_homogeneous_exterior:l('[aria-label="Confirm diffraction exterior"]').checked});if(h!==c)return;const f=w=>Number(w).toExponential(6);l('[role="status"]').textContent=`${p.frequency_thz.toPrecision(7)} THz; orders along ${p.transverse_axes.join(", ")}. ${p.normalized?"Reference-normalized efficiencies shown alongside raw directional powers.":"Raw directional powers only, not efficiencies."}`,l("[data-results]").innerHTML=`<table style="width:100%;text-align:left;border-spacing:8px"><thead><tr><th>Order</th><th>Type</th><th>+ normal raw power</th><th>- normal raw power</th>${p.normalized?"<th>Forward efficiency</th><th>Backward efficiency</th>":""}</tr></thead><tbody>${p.orders.map((w,E)=>`<tr><td>${w.join(", ")}</td><td>${p.propagating[E]?"Propagating":"Evanescent (zero real power)"}</td><td>${f(p.forward_power[E])}</td><td>${f(p.backward_power[E])}</td>${p.normalized?`<td>${f(p.forward_efficiency[E])}</td><td>${f(p.backward_efficiency[E])}</td>`:""}</tr>`).join("")}</tbody></table><p>Raw units: ${t(p.units)}. ${t(p.note)}${p.subtract_incident?" Normalized columns use incident-subtracted fields; raw columns retain total fields.":""}</p>`}catch(g){h===c&&(l('[role="status"]').textContent=g.message,i(g.message))}finally{h===c&&(m.disabled=!1)}},o.showModal()}const Pr=["x_min","x_max","y_min","y_max","z_min","z_max"],Ec={x_min:"X minimum",x_max:"X maximum",y_min:"Y minimum",y_max:"Y maximum",z_min:"Z minimum",z_max:"Z maximum"};function Lr(n,e,t="application/json"){const i=URL.createObjectURL(new Blob([typeof n=="string"?n:JSON.stringify(n,null,2)],{type:t})),s=document.createElement("a");s.href=i,s.download=e,s.click(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}async function o0({state:n,api:e,esc:t,toast:i}){const s=n.job;if(!s)throw Error("Complete a run with six closed-box frequency planes first.");const[a,r]=await Promise.all([e(`/jobs/${s}/farfield-monitors`),e("/jobs")]),o=a.monitors||[],l=document.createElement("dialog");l.className="farfield-dialog",document.body.append(l);const c=M=>l.querySelector(M);let d=0,u=!1,h=null;const m=(M,b,x)=>`<label>${t(M)}<input aria-label="${t(M)}" data-number="${b}" type="number" step="any" value="${x}"></label>`;l.innerHTML=`<header><div><h2>Closed-box far field</h2><p>Stored run: ${t(a.name||s)}</p></div><button data-close>Close</button></header>
 <p>Project radiation from six stored frequency planes. This performs CPU postprocessing only and does not run FDTD. Closing this window discards pending results but does not cancel server calculation.</p>
 <p data-scope>${a.isolated_pml?"All outer faces use PML.":"This run is not an isolated all-PML domain. The backend will reject unsupported boundaries."} ${t(a.note||"")}</p>
 <div class="farfield-grid"><fieldset><legend>Six closed-box faces</legend>${Pr.map(M=>`<label>${Ec[M]}<select aria-label="${Ec[M]} face" data-face="${M}"><option value="">Select stored plane</option>${o.filter(b=>b.normal===M[0]).map(b=>`<option value="${t(b.id)}">${t(b.name)} · ${t(b.position_um)} µm · ${b.points} points</option>`).join("")}</select></label>`).join("")}<button data-fill>Fill bounds from selected planes</button><p>Minimum faces retain native positive-axis fields. Outward signs are applied automatically.</p></fieldset>
 <fieldset><legend>Surface and exterior</legend>${["x","y","z"].map((M,b)=>m(`${M.toUpperCase()} lower bound (µm)`,`bounds.${b}.0`,-1)+m(`${M.toUpperCase()} upper bound (µm)`,`bounds.${b}.1`,1)).join("")}${m("Exterior refractive index","index",a.background_index||1)}<label>Stored frequency<select aria-label="Far-field frequency" data-frequency></select></label><p>Bounds must match all face extents and stay inside the PML-free region. No frequency interpolation.</p></fieldset>
 <fieldset><legend>Directions and phase</legend>${m("Theta start (degrees)","theta.start",0)+m("Theta stop (degrees)","theta.stop",180)+m("Theta samples","theta.count",19)+m("Phi start (degrees)","phi.start",0)+m("Phi stop (degrees, excluded)","phi.stop",360)+m("Phi samples","phi.count",36)}${["x","y","z"].map((M,b)=>m(`Phase origin ${M} (µm)`,`origin.${b}`,0)).join("")}<p>Theta starts at +z. Phi rotates from +x toward +y. Theta includes both endpoints, phi excludes its stop. Maximum 8192 directions.</p></fieldset>
 <fieldset><legend>Reference and physical scope</legend><label>Reference run<select aria-label="Far-field reference" data-reference><option value="">Total fields, no reference</option>${r.filter(M=>M.id!==s&&M.status==="completed").map(M=>`<option value="${t(M.id)}">${t(M.name)} (${t(M.id.slice(0,8))})</option>`).join("")}</select></label><label class="farfield-check"><input type="checkbox" data-subtract aria-label="Subtract matched incident fields"> Subtract matched complex E/H on all six faces</label><p>Reference runs must contain the same face IDs and matching source, mesh, duration and monitor settings. Subtraction produces scattered fields, not normalized efficiency.</p><label class="farfield-check"><input type="checkbox" data-confirm aria-label="Confirm homogeneous closed surface"> I confirm a closed surface in the declared homogeneous, lossless isotropic exterior, outside PML, enclosing the radiating objects. For total fields it encloses sources. For scattering the matched incident source does not cross a measurement face.</label></fieldset></div>
 <div class="farfield-actions"><button data-calculate>Calculate far field</button><button data-setup>Export setup JSON</button></div><p role="status">Choose all six faces and confirm the surface assumptions.</p><div data-results></div>`;const g=()=>Pr.map(M=>o.find(b=>b.id===c(`[data-face="${M}"]`).value));function _(){const M=c("[data-frequency]").value,b=g(),x=b.every(Boolean)&&b.every(v=>JSON.stringify(v.frequency_thz)===JSON.stringify(b[0].frequency_thz));c("[data-frequency]").innerHTML=x?b[0].frequency_thz.map((v,A)=>`<option value="${A}">${Number(v).toPrecision(7)} THz</option>`).join(""):'<option value="">Select six planes with identical frequency lists</option>',x&&Number(M)<b[0].frequency_thz.length&&(c("[data-frequency]").value=M||"0")}function p(){g().forEach((M,b)=>{M&&(c(`[data-number="bounds.${Math.floor(b/2)}.${b%2}"]`).value=M.position_um)})}for(const M of["x","y","z"]){const b=o.filter(x=>x.normal===M).sort((x,v)=>x.position_um-v.position_um);b.length===2&&b[0].position_um<b[1].position_um&&(c(`[data-face="${M}_min"]`).value=b[0].id,c(`[data-face="${M}_max"]`).value=b[1].id)}p(),_();function f(){d++,h=null,c("[data-results]").replaceChildren(),c('[role="status"]').textContent="Setup changed. Calculate when ready.",c("[data-calculate]").disabled=!1}l.querySelectorAll("input,select").forEach(M=>{M.addEventListener("input",f),M.addEventListener("change",()=>{f(),M.dataset.face&&_()})}),c("[data-fill]").onclick=()=>{p(),f()};function w(){const M=O=>{const N=c(`[data-number="${O}"]`).value;if(N.trim()===""||!Number.isFinite(Number(N)))throw Error("Enter finite numerical settings.");return Number(N)},b=Object.fromEntries(Pr.map(O=>[O,c(`[data-face="${O}"]`).value]));if(new Set(Object.values(b)).size!==6||Object.values(b).some(O=>!O))throw Error("Select six distinct stored planes.");const x=c("[data-frequency]").value;if(x==="")throw Error("All faces need identical stored frequency lists.");const v={start:M("theta.start"),stop:M("theta.stop"),count:M("theta.count")},A={start:M("phi.start"),stop:M("phi.stop"),count:M("phi.count")};if(![v.count,A.count].every(O=>Number.isInteger(O)&&O>=2)||v.count*A.count>8192)throw Error("Use at least two samples per angular axis and at most 8192 directions.");if(v.start<0||v.stop>180||v.stop<=v.start||A.start<0||A.stop>360||A.stop<=A.start)throw Error("Theta must increase within 0–180 degrees. Phi must increase within 0–360 degrees.");const I=c("[data-reference]").value||null,P=c("[data-subtract]").checked;if(!!I!==P)throw Error("Choose a matched reference and enable complex-field subtraction together.");return{version:1,faces:b,frequency_index:Number(x),bounds_um:[0,1,2].map(O=>[M(`bounds.${O}.0`),M(`bounds.${O}.1`)]),refractive_index:M("index"),phase_origin_um:[0,1,2].map(O=>M(`origin.${O}`)),theta_deg:v,phi_deg:A,reference:I,subtract_incident:P,confirm_homogeneous_closed_surface:c("[data-confirm]").checked}}function E(M){c('[role="status"]').textContent=M.message,i(M.message)}c("[data-setup]").onclick=()=>{try{Lr({job_id:s,request:w()},"farfield-setup.json")}catch(M){E(M)}},c("[data-calculate]").onclick=async()=>{const M=++d;h=null,c("[data-results]").replaceChildren();try{const b=w();if(!b.confirm_homogeneous_closed_surface)throw Error("Confirm the homogeneous closed-surface assumptions first.");c("[data-calculate]").disabled=!0,c('[role="status"]').textContent="Projecting stored fields on CPU…";const x=await e(`/jobs/${s}/farfield`,b);if(u||M!==d)return;h=x,y()}catch(b){!u&&M===d&&E(b)}finally{!u&&M===d&&(c("[data-calculate]").disabled=!1)}};function y(){c('[role="status"]').textContent=`${Number(h.frequency_thz).toPrecision(7)} THz · ${h.field_kind==="scattered"?"Scattered":"Total"} fields · ${h.directions.length} directions. ${h.zero_pattern?"Zero pattern. ":""}${h.note||""}`,c("[data-results]").innerHTML=`<h3>Angular radiation pattern</h3><p>Raw quantity: reduced spectral power per steradian (${t(h.intensity_units)}). This is not calibrated W/sr or an efficiency.</p><label>Display scale<select aria-label="Far-field display scale" data-scale><option value="relative">Relative intensity I / max(I)</option><option value="raw">Raw reduced spectral intensity</option></select></label><canvas data-heat width="800" height="370" aria-label="Far-field angular heatmap"></canvas><p data-range></p><div class="farfield-grid"><section><label>Theta cut at phi<select data-phi-cut aria-label="Theta cut at phi">${h.phi_deg.map((M,b)=>`<option value="${b}">${M}°</option>`).join("")}</select></label><canvas data-theta-canvas width="500" height="260" aria-label="Theta intensity cut"></canvas></section><section><label>Phi cut at theta<select data-theta-cut-select aria-label="Phi cut at theta">${h.theta_deg.map((M,b)=>`<option value="${b}">${M}°</option>`).join("")}</select></label><canvas data-phi-canvas width="500" height="260" aria-label="Phi intensity cut"></canvas></section></div><p>Complex amplitude is A in E(r) = A exp(ikr) / r, in ${t(h.amplitude_units)}. Phase origin: ${t(h.phase_origin_um.join(", "))} µm.</p><div class="farfield-actions"><button data-result-json>Export result JSON</button><button data-csv>Export direction CSV</button></div><details><summary>Result identity and admission</summary><p>Request digest: <code>${t(h.request_digest)}</code></p><pre>${t(JSON.stringify(h.report,null,2))}</pre></details>`,c("[data-scale]").onchange=T,c("[data-phi-cut]").onchange=T,c("[data-theta-cut-select]").onchange=T,c("[data-result-json]").onclick=()=>Lr(h,"farfield-result.json"),c("[data-csv]").onclick=()=>{const M=[["theta_deg","phi_deg","sx","sy","sz","intensity_reduced_EH_s2_m2_per_sr","relative_intensity","Ax_real","Ay_real","Az_real","Ax_imag","Ay_imag","Az_imag"]];h.theta_deg.forEach((b,x)=>h.phi_deg.forEach((v,A)=>{const I=x*h.phi_deg.length+A;M.push([b,v,...h.directions[I],h.intensity[x][A],h.relative_intensity[x][A],...h.electric_real[I],...h.electric_imag[I]])})),Lr(M.map(b=>b.join(",")).join(`
`)+`
`,"farfield-directions.csv","text/csv")},T()}function T(){const M=c("[data-scale]").value==="raw"?h.intensity:h.relative_intensity,b=Math.max(0,...M.flat()),x=M.length,v=M[0].length,A=c("[data-heat]"),I=A.getContext("2d");I.clearRect(0,0,A.width,A.height);const P=65,O=20,N=A.width-P-25,z=A.height-O-55;for(let B=0;B<x;B++)for(let H=0;H<v;H++){const Y=b>0?M[B][H]/b:0;I.fillStyle=`hsl(${240-240*Y} 85% ${25+30*Y}%)`,I.fillRect(P+H*N/v,O+B*z/x,N/v+1,z/x+1)}I.fillStyle="#26394c",I.font="14px sans-serif",I.fillText(`Phi (degrees): ${h.phi_deg[0]} to ${h.phi_deg.at(-1)}`,P,A.height-12),I.fillText(`Theta ${h.theta_deg[0]}°`,4,O+12),I.fillText(`${h.theta_deg.at(-1)}°`,18,O+z),c("[data-range]").textContent=`Color range: 0 to ${b.toExponential(6)} ${c("[data-scale]").value==="raw"?h.intensity_units:"(relative)"}.`,S(c("[data-theta-canvas]"),h.theta_deg,M.map(B=>B[Number(c("[data-phi-cut]").value)]),"Theta (degrees)"),S(c("[data-phi-canvas]"),h.phi_deg,M[Number(c("[data-theta-cut-select]").value)],"Phi (degrees)")}function S(M,b,x,v){const A=M.getContext("2d"),I=Math.max(0,...x),P=65,O=25,N=M.width-85,z=M.height-75;A.clearRect(0,0,M.width,M.height),A.strokeStyle="#bccbd7",A.strokeRect(P,O,N,z),A.beginPath(),A.strokeStyle="#146ba5",x.forEach((B,H)=>{const Y=P+(b[H]-b[0])/(b.at(-1)-b[0]||1)*N,de=O+z-(I?B/I:0)*z;H?A.lineTo(Y,de):A.moveTo(Y,de)}),A.stroke(),A.fillStyle="#26394c",A.font="12px sans-serif",A.fillText(I.toExponential(2),3,O+5),A.fillText("0",45,O+z),A.fillText(`${v}: ${b[0]} to ${b.at(-1)}`,P,M.height-12)}return c("[data-close]").onclick=()=>l.close(),l.addEventListener("close",()=>{u=!0,d++,h=null,l.remove()},{once:!0}),l.showModal(),l}async function Td({state:n,api:e,esc:t,toast:i}){const s=n.job;if(!s)throw Error("Complete a run with a frequency plane first.");const a=await e(`/jobs/${s}/propagation-monitors`),r=a.monitors||[];if(!r.length)throw Error("This run stored no frequency plane to propagate.");const o=document.createElement("dialog");o.className="propagation-dialog",document.body.append(o);const l=g=>o.querySelector(g);let c=0;const d=(g,_,p,f="any")=>`<label>${t(g)}<input aria-label="${t(g)}" data-key="${_}" type="number" step="${f}" value="${p}"></label>`;o.innerHTML=`<header><div><h2>Angular spectrum</h2><p>Stored run: ${t(a.name||s)} · ${t(a.device.toUpperCase())}${a.mode?` · ${t(a.mode)}`:""}</p></div><button data-close>Close</button></header>
 <p>Propagates a stored DFT plane through a homogeneous, lossless, source-free exterior with outgoing waves only, on the run's device. The recorded window is zero padded and the field beyond it is taken as zero. This is post-processing of stored fields, not FDTD. See docs/ANGULAR_SPECTRUM.md.</p>
 <div class="propagation-grid">
  <fieldset><legend>Plane and exterior</legend><label>Monitor<select aria-label="Propagation monitor" data-key="monitor">${r.map(g=>`<option value="${t(g.id)}">${t(g.name)} · +${g.normal} at ${Number(g.position_um).toPrecision(4)} µm</option>`).join("")}</select></label><label>Frequency<select aria-label="Propagation frequency" data-key="frequency_index"></select></label><label>Direction<select aria-label="Propagation direction" data-key="direction"><option value="auto">Auto (from the sources)</option><option value="+">Toward +normal</option><option value="-">Toward −normal</option></select></label>${d("Exterior index","index",a.background_index??1)}${d("Zero padding factor","pad",2,"1")}</fieldset>
  <fieldset><legend>Section</legend><label>Kind<select aria-label="Propagation kind" data-key="kind"></select></label>${d("Section offset (µm)","offset_um",0)}${d("Distance start (µm)","z_start_um",0)}${d("Distance stop (µm)","z_stop_um",10)}${d("Planes","planes",200,"1")}${d("Plane distance (µm)","distance_um",10)}</fieldset>
 </div>
 <div class="propagation-actions"><button data-calculate>Calculate</button><span data-plane-note></span></div><p role="status">Choose the plane, the exterior and the section, then calculate.</p><canvas data-map width="900" height="400"></canvas><div data-report></div>`;const u=()=>r.find(g=>g.id===l('[data-key="monitor"]').value);function h(){const g=u();l('[data-key="frequency_index"]').innerHTML=g.frequency_thz.map((p,f)=>`<option value="${f}">${Number(p).toPrecision(6)} THz · ${Number(g.wavelength_um[f]).toPrecision(4)} µm</option>`).join(""),l('[data-key="kind"]').innerHTML=g.transverse.map(p=>`<option value="section:${p}">Section ${p}${g.normal}</option>`).join("")+'<option value="plane">Plane parallel to the monitor</option>';const _=Object.values(g.spacing_um||{});l("[data-plane-note]").textContent=`${g.direction>0?"+":"−"}${g.normal} ${g.direction_note}; spacing ${_.map(p=>Number(p).toPrecision(3)).join(" × ")} µm; ${g.components.join(", ")}`}h(),l('[data-key="monitor"]').onchange=h,l("[data-close]").onclick=()=>{c++,o.close(),o.remove()},o.addEventListener("close",()=>o.remove());function m(){const g=f=>{const w=l(`[data-key="${f}"]`).value;if(w.trim()===""||!Number.isFinite(Number(w)))throw Error("Enter finite numerical settings.");return Number(w)},_=l('[data-key="kind"]').value,p={monitor:l('[data-key="monitor"]').value,frequency_index:Number(l('[data-key="frequency_index"]').value),direction:l('[data-key="direction"]').value,index:g("index"),pad:g("pad")};return _==="plane"?Object.assign(p,{kind:"plane",distance_um:g("distance_um")}):Object.assign(p,{kind:"section",axis:_.split(":")[1],offset_um:g("offset_um"),z_start_um:g("z_start_um"),z_stop_um:g("z_stop_um"),planes:g("planes")}),p}l("[data-calculate]").onclick=async()=>{const g=++c;l("[data-calculate]").disabled=!0,l('[role="status"]').textContent="Calculating on the server…";try{const _=m(),p=await e(`/jobs/${s}/propagate`,_);if(g!==c)return;l0(l("[data-map]"),p);const f=p.focus,w=p.spectrum,E=p.geometry,y=S=>S==null?"n/a":Number(S).toPrecision(4),T=p.kind==="section"?`Peak intensity ${y(f.peak_intensity)} at ${y(f.z_um)} µm from the plane (${E.axes[0]} = ${y(f.normal_um)} µm), ${E.axes[1]} = ${y(f.a_um)} µm; FWHM along ${E.axes[1]} ${y(f.fwhm_um)} µm.`:`Peak intensity ${y(f.peak_intensity)} on the plane ${y(f.z_um)} µm away (${p.geometry.axes[0]} = ${y(f.a_um)} µm, ${p.geometry.axes[1]} = ${y(f.b_um)} µm); FWHM along ${E.axes[0]} ${y(f.fwhm_um)} µm.`;l("[data-report]").innerHTML=`<p class="focus-report"><b>Focus.</b> ${t(T)}</p><p class="spectrum-report"><b>Spectrum.</b> Largest representable angle ${y(w.max_angle_deg)}°, evanescent fraction ${y(w.evanescent_fraction)}, spacing ${y(w.spacing_um)} µm, wavelength in the exterior ${y(w.wavelength_um)} µm, index ${y(w.index)}, pad ${w.pad} (padded ${w.padded_shape.join(" × ")}). Direction ${p.direction>0?"+":"−"}normal (${t(p.direction_note)}), ${t(p.device.toUpperCase())}, ${t(p.components.join(", "))}.</p>${w.aliasing?`<p class="aliasing-warning">${t(w.warning)}</p>`:""}`,l('[role="status"]').textContent=`${p.method} · ${(p.bytes/2**20).toFixed(1)} MiB of ${(p.budget_bytes/2**20).toFixed(0)} MiB budget`}catch(_){g===c&&(l('[role="status"]').textContent=_.message,i(_.message))}finally{g===c&&(l("[data-calculate]").disabled=!1)}},o.showModal()}function l0(n,e){var M;const t=n.getContext("2d"),i=n.width,s=n.height,a=e.geometry,r=e.image;t.fillStyle="#f8fafc",t.fillRect(0,0,i,s),t.font="12px ui-monospace,monospace",t.fillStyle="#607086";const o=r.length,l=((M=r[0])==null?void 0:M.length)||0;let c=0;for(const b of r)for(const x of b)c=Math.max(c,x);c=c||1;const d=70,u=24,h=i-24,m=s-40,g=h-d,_=m-u,p=e.kind==="section"?a.extent_um.a:a.extent_um.v,f=e.kind==="section"?a.extent_um.z:a.extent_um.u,w=e.kind==="section"?`${a.axes[1]} (µm)`:`${a.axes[1]} (µm)`,E=e.kind==="section"?"distance from the plane (µm)":`${a.axes[0]} (µm)`;if(l===1||o===1){const b=l===1?r.map(v=>v[0]):r[0],x=l===1?e.kind==="section"?a.z_um:a.u_um:e.kind==="section"?a.a_um:a.v_um;t.strokeStyle="#c4cfdb",t.strokeRect(d,u,g,_),t.strokeStyle="#1972cc",t.lineWidth=1.5,t.beginPath(),b.forEach((v,A)=>{const I=d+g*(x[A]-x[0])/(x[x.length-1]-x[0]||1),P=m-_*v/c;A?t.lineTo(I,P):t.moveTo(I,P)}),t.stroke(),t.lineWidth=1,t.fillStyle="#607086",t.textAlign="center",t.textAlign="left",t.fillText(`${Number(x[0]).toPrecision(4)}`,d,m+16),t.textAlign="right",t.fillText(`${Number(x[x.length-1]).toPrecision(4)} ${l===1?e.kind==="section"?"µm from the plane":a.axes[0]+" (µm)":w}`,h,m+16),t.textAlign="right",t.fillText(c.toExponential(2),d-6,u+10),t.fillText("0",d-6,m),t.textAlign="left",t.fillText(`|E|² (reduced) · ${e.kind}`,d,u-8);return}const y=document.createElement("canvas");y.width=l,y.height=o;const T=y.getContext("2d"),S=T.createImageData(l,o);for(let b=0;b<o;b++)for(let x=0;x<l;x++){const v=Math.min(1,r[b][x]/c),A=(b*l+x)*4;S.data[A]=Math.round(250-v*225),S.data[A+1]=Math.round(248-v*170),S.data[A+2]=Math.round(250-v*80),S.data[A+3]=255}T.putImageData(S,0,0),t.imageSmoothingEnabled=!1,t.save(),t.translate(d,m),t.scale(1,-1),t.drawImage(y,0,0,g,_),t.restore(),t.strokeStyle="#c4cfdb",t.strokeRect(d,u,g,_),t.fillStyle="#607086",t.textAlign="center",t.textAlign="left",t.fillText(`${Number(p[0]).toPrecision(4)}`,d,m+16),t.textAlign="right",t.fillText(`${Number(p[1]).toPrecision(4)} ${w}`,h,m+16),t.textAlign="right",t.fillText(`${Number(f[1]).toPrecision(4)}`,d-6,u+10),t.fillText(`${Number(f[0]).toPrecision(4)}`,d-6,m),t.textAlign="left",t.fillText(`${E} ↑ · |E|² up to ${c.toExponential(2)} (reduced)`,d,u-8)}function Ad(n,e,t,{plane:i=!1,prefix:s="spectrum."}={}){const a=n.sampling,r=[...i?[]:[["fft","FFT bins"]],["frequency","Uniform frequency"],["wavelength","Uniform wavelength"],["chebyshev","Chebyshev nodes"],["custom","Custom frequencies"]];return t("sample spacing",s+"sampling",a,r)+(a==="custom"?`<label class="monitor-custom">Frequencies (THz)<textarea data-frequency-table data-prefix="${s}" aria-label="Custom frequencies (THz)">${(n.custom_frequencies_hz||[]).map(o=>o*1e-12).join(`
`)}</textarea></label>`:a!=="fft"?`<label class="enabled-row"><input type="checkbox" data-path="${s}use_source_limits" ${n.use_source_limits?"checked":""}> Use source wavelength limits</label><fieldset ${n.use_source_limits?"disabled":""}>`+e("minimum wavelength",s+"wavelength_start",n.wavelength_start,"µm",{min:.001})+e("maximum wavelength",s+"wavelength_stop",n.wavelength_stop,"µm",{min:.001})+"</fieldset>"+e("frequency points",s+"frequency_points",n.frequency_points,"",{min:1,step:1})+(a==="chebyshev"?t("Chebyshev node rule",s+"chebyshev_nodes",n.chebyshev_nodes||"roots",[["roots","Roots (interior)"],["lobatto","Lobatto (include endpoints)"]])+`<label class="enabled-row"><input type="checkbox" data-path="${s}chebyshev_wavelength" ${n.chebyshev_wavelength?"checked":""}> Chebyshev nodes in wavelength</label>`:""):"")}function c0(n,e,t,i){const s=n.record_fields??["Ex","Ey","Ez","Hx","Hy","Hz"],a=n.record_poynting??["x","y","z"],r=n.downsample_xyz??[n.downsample||1,n.downsample||1,n.downsample||1],o=(l,c,d)=>c.map(u=>`<label class="enabled-row"><input type="checkbox" data-record-family="${l}" value="${u}" ${d.includes(u)?"checked":""}> Record ${l==="record_poynting"?"P"+u:u}</label>`).join("");return i("normal axis","normal",n.normal,e.dimension==="2d"?["x","y"]:["x","y","z"])+["x","y","z"].filter(l=>l!==n.normal&&(e.dimension==="3d"||l!=="z")).map(l=>t("downsample "+l,"downsample_xyz."+"xyz".indexOf(l),r["xyz".indexOf(l)],"",{min:1,max:32,step:1})).join("")+i("spatial interpolation","spatial_interpolation",n.spatial_interpolation||"specified",[["specified","Specified plane"],["nearest","Nearest normal mesh node"]])+i("DFT accumulation precision","dft_precision",n.dft_precision||"field",[["field","Match solver precision"],["float64","Double precision"]])+o("record_fields",["Ex","Ey","Ez","Hx","Hy","Hz"],s)+o("record_poynting",["x","y","z"],a)+`<label class="enabled-row"><input type="checkbox" data-path="record_flux" ${n.record_flux!==!1?"checked":""}> Record signed flux</label><p class="property-help">Only fields required by the selected outputs are accumulated. Flux alone requires four tangential E/H components. Incident subtraction also requires storing those fields.</p><button data-action="flux-results">Open flux results</button>`}function d0({state:n,api:e,esc:t,toast:i,commit:s,numeric:a,dropdown:r}){const o=document.createElement("dialog");o.className="monitor-dialog",document.body.append(o);const l=u=>o.querySelector(u);let c=0;function d(){o.querySelectorAll("[data-dismiss]").forEach(u=>u.onclick=()=>{c++,o.close()})}return{globals(){const u=structuredClone(n.project);u.global_monitor??(u.global_monitor={sampling:"frequency",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:101,apodization:"none",apodization_center:2e-14,apodization_time_width:1e-14,custom_frequencies_hz:[],chebyshev_wavelength:!1});function h(){const m=u.global_monitor;o.innerHTML=`<div class="fsp-heading"><h2>Global monitor settings</h2><button data-dismiss>Close</button></div><fieldset ${n.mode!=="layout"?"disabled":""}>${Ad(m,a,r,{plane:!0,prefix:""})}${r("apodization","apodization",m.apodization,["none","start","end","full"])}${a("apodization center","apodization_center",m.apodization_center*1e15,"fs",{scale:1e-15})}${a("apodization time width","apodization_time_width",m.apodization_time_width*1e15,"fs",{scale:1e-15})}<button data-apply>Apply monitor settings</button></fieldset><p class="monitor-status"></p>`,d(),o.querySelectorAll("[data-path]").forEach(_=>_.onchange=()=>{var p;m[_.dataset.path]=_.type==="checkbox"?_.checked:_.type==="number"?Number(_.value)*Number(_.dataset.scale||1):_.value,["sampling","use_source_limits"].includes(_.dataset.path)&&(m.sampling==="custom"&&!((p=m.custom_frequencies_hz)!=null&&p.length)&&(m.custom_frequencies_hz=[2e14]),h())});const g=l("[data-frequency-table]");g&&(g.onchange=()=>{m.custom_frequencies_hz=g.value.trim().split(/[\s,;]+/).filter(Boolean).map(_=>Number(_)*1e12)}),l("[data-apply]").onclick=async()=>{try{const _=await e("/validate",u);s(_.project),o.close()}catch(_){l(".monitor-status").textContent=_.message}}}h(),o.showModal()},async flux(){if(!n.job)throw Error("Run a project with a frequency monitor first.");const u=await e("/jobs/"+n.job),h=u.flux_monitors||[],m=await e("/jobs");o.innerHTML=`<div class="fsp-heading"><h2>Frequency fields / power flux</h2><button data-dismiss>Close</button></div><label>Monitor <select aria-label="Flux monitor">${h.map(_=>`<option value="${t(_.id)}">${t(_.name)} · +${_.normal}</option>`).join("")}</select></label><label>Reference run <select aria-label="Flux reference"><option value="">Raw signed flux</option>${m.filter(_=>_.id!==n.job&&_.flux_monitors.length).map(_=>`<option value="${_.id}">${t(_.name)} · ${_.id.slice(0,8)}</option>`).join("")}</select></label><label class="enabled-row"><input type="checkbox" aria-label="Subtract incident fields"> Subtract reference E/H before computing flux (reflection)</label><button data-plot-flux>Plot flux</button><button data-diffraction>Diffraction orders</button><button data-farfield>Closed-box far field</button><button data-propagate>Angular spectrum</button><a href="/api/jobs/${n.job}/flux.csv">Export raw flux CSV</a><canvas></canvas><p class="monitor-status"></p><p>Flux is signed along the positive monitor normal. A reflected wave can be negative. Reference normalization requires identical sources, mesh, duration and unapodized monitors. For an air reference, freeze graded refinements before removing structures, then run both scenes with the same monitor IDs. Absolute watt calibration is not provided.</p>`,d();async function g(){const _=++c;try{const p=h.find(y=>y.id===l('[aria-label="Flux monitor"]').value),f=l('[aria-label="Flux reference"]').value,w=l('[aria-label="Subtract incident fields"]').checked;let E={...p,spectrum:p.flux,signed:!0,spectrum_label:`Wavelength (µm) · signed flux (${p.units})`};if(f){const y=await e(`/jobs/${n.job}/normalize-flux?reference=${encodeURIComponent(f)}&monitor=${encodeURIComponent(p.id)}&subtract_incident=${w}`);if(_!==c)return;E={...p,...y,spectrum:y.ratio,signed:!0,spectrum_label:"Wavelength (µm) · signed normalized flux"};const T=[...new Set(y.reasons.filter(Boolean))];l(".monitor-status").textContent=`${y.valid.filter(Boolean).length}/${y.valid.length} frequencies above the reference threshold${T.length?` (invalid entries: ${T.join("; ")})`:""}. Reflection is negative for propagation opposite the positive normal.`}else l(".monitor-status").textContent=`${p.points} spatial samples · collocated E/H · ${p.flux.length} frequencies. Raw reduced flux is not normalized transmission.`;ts(l("canvas"),[E],!0,!0)}catch(p){_===c&&(l(".monitor-status").textContent=p.message,i(p.message))}}l("[data-diffraction]").onclick=async()=>{try{await r0({state:n,api:e,esc:t,toast:i}),o.close()}catch(_){i(_.message)}},l("[data-farfield]").onclick=async()=>{try{await o0({state:n,api:e,esc:t,toast:i}),o.close()}catch(_){i(_.message)}},l("[data-propagate]").onclick=async()=>{try{await Td({state:n,api:e,esc:t,toast:i}),o.close()}catch(_){i(_.message)}},l("[data-plot-flux]").onclick=g,l("[data-plot-flux]").disabled=!h.length,o.showModal(),h.length?await g():l(".monitor-status").textContent="No raw flux recorded. Diffraction orders can use a stored six-field plane."}}}function u0({state:n,api:e,esc:t,commit:i}){const s=document.createElement("dialog");s.className="boundary-dialog",document.body.append(s);const a=[["pml","PML"],["periodic","Periodic"],["bloch","Bloch"],["pec","PEC"],["antisymmetric","Anti-symmetric (PEC)"],["pmc","PMC"],["symmetric","Symmetric (PMC)"]],r=["x_min","x_max","y_min","y_max","z_min","z_max"];function o(){if(n.mode!=="layout")throw Error("Switch to Layout before editing boundaries.");const l=n.project,c=structuredClone(l);s.innerHTML=`<h2>Boundary conditions</h2><p>Apply the complete face configuration in one edit.</p><div class="dialog-buttons"><button data-boundary-preset="pmc">All PMC</button><button data-boundary-preset="pec">All PEC</button><button data-boundary-preset="pml">All PML</button></div>${r.map(u=>`<label class="property-row"><span>${t(u.replace("_"," "))}</span><select aria-label="${t(u.replace("_"," "))} boundary" data-face="${u}" ${u.startsWith("z_")&&c.region.dimension==="2d"?"disabled":""}>${a.map(([h,m])=>`<option value="${h}" ${c.region.boundaries[u].kind===h?"selected":""}>${m}</option>`).join("")}</select></label>`).join("")}<p class="property-help">PMC and magnetic symmetry support PEC/PMC walls and restricted endpoint CPML. Use real FP32, fixed Yee meshes, point electric sources and point E/H monitors. Mixed CPML additionally requires uniform equal-spacing axes and a fixed isotropic PML exterior. Periodic/Bloch mixing is unsupported. Active PML faces must have equal layers and sigma scale, kappa 1, alpha 0, polynomial 3 and alpha polynomial 0.</p><p class="property-help">Face selections change kinds only. The explicit profile button below also sets active PML parameters. Source, material and mesh settings are preserved. Bloch phases are cleared on axes changed away from Bloch.</p><button data-endpoint-profile>Set supported endpoint CPML profile</button><p class="property-help">Profile button: selected PML faces use default region layers, sigma scale 1, kappa 1, alpha 0, cubic grading. Endpoint target sampling differs from ordinary scalar-Yee PML. Keep sources/monitors outside PML and material in PML plus one cell equal to background.</p><p data-boundary-status role="status" aria-live="polite"></p><div class="dialog-actions"><button data-boundary-apply>Apply boundaries</button><button data-boundary-close>Cancel</button></div>`;const d=[...s.querySelectorAll("[data-face]")];s.querySelectorAll("[data-boundary-preset]").forEach(u=>u.onclick=()=>d.filter(h=>!h.disabled).forEach(h=>h.value=u.dataset.boundaryPreset)),s.querySelector("[data-endpoint-profile]").onclick=()=>{const u=d.filter(h=>!h.disabled&&h.value==="pml");u.forEach(h=>Object.assign(c.region.boundaries[h.dataset.face],{layers:null,sigma_scale:1,kappa:1,alpha:0,polynomial:3,alpha_polynomial:0})),s.querySelector("[data-boundary-status]").textContent=u.length?"Supported endpoint CPML profile staged for "+u.length+" selected PML faces. Apply to validate.":"Select at least one PML face first."},s.querySelector("[data-boundary-close]").onclick=()=>s.close(),s.querySelector("[data-boundary-apply]").onclick=async()=>{const u=[...s.querySelectorAll("button,select")],h=u.map(g=>g.disabled);u.forEach(g=>g.disabled=!0);const m=s.querySelector("[data-boundary-status]");m.textContent="Validating boundaries and project…";try{d.forEach(_=>c.region.boundaries[_.dataset.face].kind=_.value);for(const[_,p]of["x","y","z"].map((f,w)=>[f,w]))c.region.boundaries[_+"_min"].kind!=="bloch"&&c.region.boundaries[_+"_max"].kind!=="bloch"&&(c.region.bloch_phase[p]=0);const g=await e("/validate",c);if(n.project!==l||n.mode!=="layout")throw Error("The project changed. Close this dialog and open it again.");i(g.project),s.close()}catch(g){m.textContent=g.message}finally{u.forEach((g,_)=>g.disabled=h[_])}},s.showModal()}return{open:o}}const ws=n=>structuredClone(n),kt=n=>String(n??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),bs=1024**3,h0={validating:"Checking setup",preparing_modes:"Preparing port modes",admitting_material:"Checking material and memory limits",rasterizing:"Sampling project materials",calibration_and_forward:"Calibrating ports and solving fields",backward:"Calculating material derivatives",completed:"Results ready"},Cd=n=>(n.sources||[]).find(e=>e.enabled!==!1);async function Yn(n,e){var s;const t=await fetch("/api/"+n,e===void 0?{}:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),i=(s=t.headers.get("content-type"))!=null&&s.includes("json")?await t.json():await t.text();if(!t.ok)throw Error(typeof i.detail=="string"?i.detail:JSON.stringify(i.detail||i));return i}function wc(n,e,t="application/json"){const i=URL.createObjectURL(new Blob([n],{type:t})),s=document.createElement("a");s.href=i,s.download=e,s.click(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}function p0(n){var o,l,c;const e=Cd(n),t=(e==null?void 0:e.normal)||"x",i="xyz".indexOf(t),s=((l=(o=n.region)==null?void 0:o.size)==null?void 0:l[i])||4,a=((c=n.region)==null?void 0:c.mesh)||.1,r=d=>Math.round(d/a)*a;return{version:1,project:ws(n),normal:t,ports:[{name:"left",coordinate_um:r(-s*.15),source_coordinate_um:r(-s*.25),direction:1,mode_indices:[0]},{name:"right",coordinate_um:r(s*.15),source_coordinate_um:r(s*.25),direction:-1,mode_indices:[0]}],num_modes:1,open_ports:null,execution:{device:"cpu",checkpoints:4,gpu_budget_bytes:null,host_budget_bytes:8*bs,resident_budget_bytes:null,network_budget_bytes:256*1024**2,output_budget_bytes:64*1024**2},objective:{output_channel:["right",0],input_channel:["left",0],quantity:"power"},differentiate_materials:[]}}function f0(n){var i;if((n==null?void 0:n.version)!==1||!((i=n.project)!=null&&i.region)||!Array.isArray(n.ports)||n.ports.length!==2||!n.execution||!["x","y","z"].includes(n.normal))throw Error("Choose a version 1 mode-network setup, not a Project file.");if(n.ports.some(s=>typeof s.name!="string"||!Array.isArray(s.mode_indices)))throw Error("The setup needs two named ports with mode lists.");if(!Array.isArray(n.differentiate_materials))throw Error("The setup needs a material selection list.");const e=s=>typeof s=="number"&&Number.isFinite(s);if(!Array.isArray(n.project.materials)||n.project.materials.some(s=>!s||typeof s.name!="string")||!Array.isArray(n.project.sources)||n.project.sources.some(s=>!s||typeof s!="object"))throw Error("The setup contains an invalid Project.");if(!Number.isInteger(n.num_modes)||n.num_modes<1||n.ports.some(s=>!e(s.coordinate_um)||!e(s.source_coordinate_um)||![1,-1].includes(s.direction)||!s.mode_indices.length||s.mode_indices.some(a=>!Number.isInteger(a)||a<0)))throw Error("Check the port coordinates, directions and mode indices.");const t=n.execution;if(!["cpu","cuda"].includes(t.device)||!Number.isInteger(t.checkpoints)||t.checkpoints<0||["host_budget_bytes","network_budget_bytes","output_budget_bytes"].some(s=>!e(t[s])||t[s]<=0)||["gpu_budget_bytes","resident_budget_bytes"].some(s=>t[s]!==null&&(!e(t[s])||t[s]<=0)))throw Error("The setup contains invalid execution limits.");if(n.open_ports!==null&&(!n.open_ports||!e(n.open_ports.cladding_epsilon)||!e(n.open_ports.mode_budget_bytes)||!e(n.open_ports.confinement_tolerance)||n.open_ports.target_neff!==null&&!e(n.open_ports.target_neff)))throw Error("The setup contains invalid open-guide settings.");if(n.objective!==null&&(!n.objective||!["real","imag","power"].includes(n.objective.quantity)||["input_channel","output_channel"].some(s=>!Array.isArray(n.objective[s])||n.objective[s].length!==2)))throw Error("The setup contains an invalid S objective.");return ws(n)}async function m0(n,{toast:e=()=>{}}={}){if(!(n!=null&&n.region))throw Error("Open a project before setting up mode ports.");let t=p0(n),i=0,s=!1,a=null,r=!1,o=null,l=null;const c=new Set,d=document.createElement("dialog");d.className="mode-network-dialog",document.body.append(d);const u=P=>d.querySelector(P),h=P=>{u("[data-status]").textContent=P},m=P=>{h(P.message),e(P.message)},g=()=>t.ports.flatMap(P=>P.mode_indices.map(O=>[P.name,O])),_=()=>Cd(t.project),p=(P,O,N,{type:z="number",optional:B=!1,step:H="any"}={})=>`<label>${kt(P)}<input aria-label="${kt(P)}" data-path="${O}" type="${z}" value="${kt(N??"")}" ${z==="number"?`step="${H}"`:""} ${B?"data-optional":""}></label>`,f=(P,O,N,z)=>`<label>${kt(P)}<select aria-label="${kt(P)}" data-path="${O}">${z.map(([B,H])=>`<option value="${kt(B)}" ${String(N)===String(B)?"selected":""}>${kt(H)}</option>`).join("")}</select></label>`;function w(){u("[data-run]").disabled=r||!!a||c.size>0;for(const P of["validate","python","export"])u(`[data-${P}]`).disabled=c.size>0;u("[data-cancel]").disabled=!a&&!r}function E(){i++,l=null,u("[data-results]").replaceChildren(),u("[data-downloads]").replaceChildren(),h(a?"Setup changed. The earlier run is still active; its result will not replace this setup.":"Setup changed. Validate before running.")}function y(P,O){const N=P.split(".");let z=t;for(const B of N.slice(0,-1))z=z[B];z[N.at(-1)]=O}function T(){const P=g().map(O=>[JSON.stringify(O),`${O[0]} · mode ${O[1]}`]);return`<label><input type="checkbox" data-objective ${t.objective?"checked":""}> Evaluate a selected S entry</label>${t.objective?f("S quantity","objective.quantity",t.objective.quantity,[["power","Power |S|²"],["real","Real S"],["imag","Imaginary S"]])+f("Output channel","objective.output_channel",JSON.stringify(t.objective.output_channel),P)+f("Input channel","objective.input_channel",JSON.stringify(t.objective.input_channel),P):""}`}function S(){const P=_(),O=t.project.materials||[];d.innerHTML=`<header><div><h2>Mode ports</h2><p>Two opposing fixed-mode ports · ${kt(t.normal)} direction</p></div><button data-close>Close</button></header>
   <p>Closing this window cancels its active run. This setup uses its own copy of the current project. Main-scene edits do not change it. Mode profiles and port sections stay fixed; selected material derivatives apply only in the allowed interior.</p>
   <div class="mode-network-grid"><fieldset><legend>Port phase planes</legend>${t.ports.map((N,z)=>`<section class="mode-port-row"><h3>${z?"Right port · inward −":"Left port · inward +"}</h3>${p(`${z?"Right":"Left"} port name`,`ports.${z}.name`,N.name,{type:"text"})}${p(`${z?"Right":"Left"} phase plane (µm)`,`ports.${z}.coordinate_um`,N.coordinate_um)}${p(`${z?"Right":"Left"} source plane (µm)`,`ports.${z}.source_coordinate_um`,N.source_coordinate_um)}${p(`${z?"Right":"Left"} mode indices`,`ports.${z}.mode_indices`,N.mode_indices.join(", "),{type:"text"})}</section>`).join("")}
   ${p("Number of solved modes","num_modes",t.num_modes,{step:1})}<p>Phase planes and sources must align with the grid. Sources lie outside the two phase planes.</p></fieldset>
   <fieldset><legend>Guide and illumination</legend>${f("Transverse boundary","boundary",t.open_ports?"open":"periodic",[["periodic","Periodic cell"],["open","Open guide with PML"]])}
   ${t.open_ports?p("Cladding permittivity","open_ports.cladding_epsilon",t.open_ports.cladding_epsilon)+p("Target effective index","open_ports.target_neff",t.open_ports.target_neff,{optional:!0})+p("Mode budget (GiB)","open_ports.mode_budget_bytes",t.open_ports.mode_budget_bytes/bs)+p("Maximum tail fraction","open_ports.confinement_tolerance",t.open_ports.confinement_tolerance):""}
   <p>Propagation normal: <strong>${kt(t.normal)}</strong>, from the enabled source. Boundary choices must match the project.</p>
   ${P?p("Carrier wavelength (µm)","carrier",P.wavelength)+p("Pulse cycles","cycles",P.pulse_cycles??2):"<p>Add one enabled plane source in the main project, then reopen this setup.</p>"}
   ${p("Time steps","project.region.steps",t.project.region.steps,{step:1})}<p>Requires one soft Gaussian plane source. Material, source and boundary support are checked by validation.</p></fieldset>
   <fieldset><legend>Execution</legend>${f("Compute device","execution.device",t.execution.device,[["cpu","CPU"],["cuda","CUDA GPU"]])}${p("Checkpoints","execution.checkpoints",t.execution.checkpoints,{step:1})}
   ${[["Host budget (GiB)","host_budget_bytes"],["GPU budget (GiB)","gpu_budget_bytes"],["Resident budget (GiB)","resident_budget_bytes"],["Network budget (GiB)","network_budget_bytes"],["Output budget (GiB)","output_budget_bytes"]].map(([N,z])=>p(N,`execution.${z}`,t.execution[z]==null?null:t.execution[z]/bs,{optional:["gpu_budget_bytes","resident_budget_bytes"].includes(z)})).join("")}<p>Blank GPU or resident limits use backend defaults. Limits include the separately admitted solver and fixed mode preparation.</p></fieldset>
   <fieldset><legend>Objective and material derivatives</legend><div data-objective-controls>${T()}</div><h3>Differentiate permittivity</h3>${O.map(N=>`<label class="mode-material"><input type="checkbox" data-material="${kt(N.name)}" ${t.differentiate_materials.includes(N.name)?"checked":""}> ${kt(N.name)} <small>${kt(N.model||"dielectric")}</small></label>`).join("")||"<p>No named materials in this project.</p>"}<p>Choose an objective to request material derivatives. Fixed source, port and PML regions are excluded. This does not differentiate the eigenmodes.</p></fieldset></div>
   <div class="mode-network-actions"><button data-import>Import setup</button><button data-export>Export setup JSON</button><button data-python>Export Python</button><input data-file type="file" accept=".json,application/json" hidden><button data-validate>Validate setup</button><button data-run>Run mode network</button><button data-cancel>Cancel run</button></div>
   <p data-status role="status">Ready to validate. Validation does not run the field simulation.</p><div data-results></div><div data-downloads></div>`,M(),w()}function M(){d.querySelectorAll("[data-path]").forEach(P=>{const O=N=>{try{const z=P.dataset.path;let B=P.value;if(P.type==="number"){if(B===""&&P.hasAttribute("data-optional"))B=null;else{if(B.trim()===""||!Number.isFinite(Number(B)))throw Error("Enter a finite number.");B=Number(B)}z.endsWith("_bytes")&&B!==null&&(B=Math.round(B*bs))}if(z==="boundary")t.open_ports=B==="open"?{cladding_epsilon:(t.project.region.background_index||1)**2,mode_budget_bytes:2*bs,target_neff:null,confinement_tolerance:1e-4}:null;else if(z.endsWith("mode_indices")){if(B=B.split(",").map(H=>H.trim()),B.some(H=>!/^\d+$/.test(H)))throw Error("Enter nonnegative mode indices separated by commas.");y(z,B.map(Number))}else z.startsWith("objective.")&&z.endsWith("_channel")?y(z,JSON.parse(B)):z==="carrier"?_().wavelength=B:z==="cycles"?_().pulse_cycles=B:y(z,B);if(z.startsWith("ports.")&&t.objective){const H=g();t.objective.output_channel=H.find(Y=>JSON.stringify(Y)===JSON.stringify(t.objective.output_channel))||H.at(-1),t.objective.input_channel=H.find(Y=>JSON.stringify(Y)===JSON.stringify(t.objective.input_channel))||H[0]}c.delete(z),E(),w(),N&&c.size===0&&(z==="boundary"||z.startsWith("ports."))&&(S(),h("Setup changed. Validate before running."))}catch(z){c.add(P.dataset.path),E(),w(),m(z)}};P.addEventListener("input",()=>O(!1)),P.addEventListener("change",()=>O(!0))}),u("[data-objective]").onchange=P=>{t.objective=P.target.checked?{output_channel:g().at(-1),input_channel:g()[0],quantity:"power"}:null,E(),S()},d.querySelectorAll("[data-material]").forEach(P=>P.onchange=()=>{t.differentiate_materials=[...d.querySelectorAll("[data-material]:checked")].map(O=>O.dataset.material),E()}),u("[data-close]").onclick=()=>d.close(),u("[data-export]").onclick=()=>wc(JSON.stringify(t,null,2),"mode-network-v1.json"),u("[data-import]").onclick=()=>u("[data-file]").click(),u("[data-file]").onchange=async P=>{const O=P.target.files[0];if(!O)return;const N=++i;try{const z=f0(JSON.parse(await O.text()));if(s||N!==i)return;t=z,c.clear(),E(),S(),h("Setup imported. Validate before running.")}catch(z){!s&&N===i&&m(z)}finally{P.target.value=""}},u("[data-validate]").onclick=()=>b(),u("[data-python]").onclick=async()=>{const P=i,O=ws(t);try{const N=await Yn("mode-networks/python",O);if(s||P!==i)return;const z=typeof N=="string"?N:N.python;if(typeof z!="string")throw Error("Python export returned no source.");wc(z,"mode_network.py","text/x-python"),h("Python exported for this setup.")}catch(N){!s&&P===i&&m(N)}},u("[data-run]").onclick=A,u("[data-cancel]").onclick=I}async function b(){const P=i,O=ws(t);h("Validating setup…");try{const N=await Yn("mode-networks/validate",O);if(s||P!==i)return;l=JSON.stringify(O),h(`Setup validated. ${N.summary||"Ready for an explicitly requested run."}`)}catch(N){!s&&P===i&&m(N)}}function x(P){if(!Array.isArray(P.channels)||!Array.isArray(P.s_real)||!Array.isArray(P.s_imag))throw Error("The completed job has no S matrix.");const O=z=>`${z[0]} · ${z[1]}`,N=z=>Number(z).toPrecision(6);u("[data-results]").innerHTML=`<h3>Complex S matrix</h3><p>Rows: outgoing channel. Columns: incident channel. Phase planes: ${kt((P.phase_planes_um||[]).join(", "))} µm.</p><div class="mode-network-table"><table><thead><tr><th>Output / input</th>${P.channels.map(z=>`<th>${kt(O(z))}</th>`).join("")}</tr></thead><tbody>${P.channels.map((z,B)=>`<tr><th>${kt(O(z))}</th>${P.channels.map((H,Y)=>{const de=P.s_real[B][Y],ge=P.s_imag[B][Y];return`<td>${N(de)} ${ge<0?"−":"+"} ${N(Math.abs(ge))}i<small>|S|² ${N(de*de+ge*ge)}</small></td>`}).join("")}</tr>`).join("")}</tbody></table></div><p>Selected objective: ${P.objective==null?"Not requested":N(P.objective)}</p><h3>Material permittivity derivatives</h3>${Object.entries(P.material_gradients||{}).length?`<table><thead><tr><th>Material</th><th>d objective / d epsilon</th></tr></thead><tbody>${Object.entries(P.material_gradients).map(([z,B])=>`<tr><td>${kt(z)}</td><td>${N(B)}</td></tr>`).join("")}</tbody></table>`:"<p>No material derivatives requested.</p>"}<details><summary>Run identity and preparation</summary><p>Request digest: <code data-request-digest>${kt(P.request_digest||"Unavailable")}</code></p><pre>${kt(JSON.stringify({modes:P.mode_summaries,admission:P.admission},null,2))}</pre></details>`}async function v(P){var O,N,z;if(!(s||a!==P))try{const B=await Yn(`mode-network-jobs/${encodeURIComponent(P.id)}`);if(s||a!==P)return;const H=["completed","failed","cancelled","canceled"].includes(B.status);if(P.generation===i){const Y=typeof B.progress=="string"?B.progress:((O=B.progress)==null?void 0:O.message)||h0[(N=B.progress)==null?void 0:N.phase]||((z=B.progress)==null?void 0:z.phase);h(`${B.status}${Y?" · "+Y:""}`),B.status==="completed"&&(x(B.result),u("[data-downloads]").innerHTML=`<a href="/api/mode-network-jobs/${encodeURIComponent(P.id)}/download" download>Download NPZ</a> <a href="/api/mode-network-jobs/${encodeURIComponent(P.id)}/s.csv" download>Download S CSV</a>`),B.status==="failed"&&h(`Failed: ${typeof B.error=="string"?B.error:JSON.stringify(B.error||"See server log")}`)}else h(H?"Earlier run finished. Validate and run the edited setup when ready.":"Earlier setup is still running. Cancel it before starting this setup.");if(H){a=null,w();return}o=setTimeout(()=>v(P),750)}catch(B){!s&&a===P&&(m(B),o=setTimeout(()=>v(P),2e3))}}async function A(){if(a||r)return;const P=i,O=ws(t);r=!0,w();try{if(l!==JSON.stringify(O)&&(h("Validating before submission…"),await Yn("mode-networks/validate",O)),s||P!==i)return;h("Submitting to the shared queue…");const N=await Yn("mode-network-jobs",O);if(!N.id)throw Error("Job submission returned no identifier.");if(s||P!==i){await Yn(`mode-network-jobs/${encodeURIComponent(N.id)}/cancel`,{});return}a={id:N.id,generation:P},h(N.status||"queued"),v(a)}catch(N){!s&&P===i&&m(N)}finally{r=!1,s||w()}}async function I(){if(r&&!a){i++,h("Submission cancelled. Any accepted worker will be stopped.");return}if(!a)return;const P=a;try{await Yn(`mode-network-jobs/${encodeURIComponent(P.id)}/cancel`,{}),!s&&a===P&&h("Cancellation requested. Waiting for the worker to stop.")}catch(O){s||m(O)}}return d.addEventListener("close",()=>{s=!0,i++,clearTimeout(o),a&&Yn(`mode-network-jobs/${encodeURIComponent(a.id)}/cancel`,{}).catch(()=>{}),d.remove()},{once:!0}),S(),d.showModal(),d}const g0={Waves:vu,FolderOpen:eu,Save:du,FileCode2:Qd,Box:jd,Cylinder:Jd,Circle:Yd,Orbit:su,Scan:uu,Radio:ou,MoveRight:iu,Activity:Wd,Copy:Zd,Trash2:gu,Maximize:nu,PencilRuler:au,Play:ru,Square:fu,Settings2:hu,Undo2:_u,Redo2:lu,GitCommitHorizontal:tu,CircleDot:Xd,Shapes:pu,ChartNoAxesCombined:qd,Terminal:mu,Download:Kd,RefreshCw:cu};try{for(const n of Object.keys(localStorage)){if(!n.startsWith("photonweave."))continue;const e="torchfdtd."+n.slice(12);localStorage.getItem(e)===null&&localStorage.setItem(e,localStorage.getItem(n))}}catch{}const he=n=>document.querySelector(n),ni=n=>[...document.querySelectorAll(n)],Ie=n=>String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Fe=n=>`<i data-lucide="${n}"></i>`,D={project:null,selected:"fdtd",multi:[],clipboard:null,mode:"layout",snap:!0,history:[],future:[],job:null,results:null,frame:0,tab:"geometry",bottom:"messages",dirty:!1,planHash:null,maxRevision:0};let st,et,Tc,Bi,nt;const Dr=[];he("#app").innerHTML=`
<header><div class="brand"><span class="brand-mark">${Fe("waves")}</span><strong>TorchFDTD</strong><span class="product">Workbench</span></div><div class="project-title" id="project-title"></div><div class="connection" id="connection"><span class="dot"></span>Connecting to solver…</div></header>
<nav class="menubar"><button data-action="new">File</button><button data-action="undo">Edit</button><button data-action="fit">View</button><button data-action="materials">Materials</button><button data-action="region">Simulation</button><button data-action="inverse-design">Inverse design</button><button data-action="mode-ports">Mode ports</button><button data-action="capabilities">Supported combinations</button><button data-action="flux-results">Flux results</button><button data-action="help">Help</button><span class="version">DEVELOPMENT</span></nav>
<div class="ribbon-tabs"><button class="active" data-ribbon="design">Design</button><button data-ribbon="simulation">FDTD</button><button data-ribbon="view">View</button><span class="ribbon-note">Geometry and wavelength in µm</span></div>
<div class="ribbon">
 <div class="tool-group"><div class="tool-row"><button class="tool" data-action="open">${Fe("folder-open")}<span>Open</span></button><button class="tool" data-action="save">${Fe("save")}<span>Save</span></button><button class="tool" data-action="fsp">${Fe("folder-open")}<span>FSP inspect</span></button><button class="tool editable" data-action="fsp-native">${Fe("folder-open")}<span>FSP → GPU</span></button><button class="tool editable" data-action="gds">${Fe("folder-open")}<span>GDS</span></button><button class="tool" data-action="python">${Fe("file-code-2")}<span>Python</span></button><button class="tool" data-action="export-gds">${Fe("download")}<span>Export GDS</span></button></div><label>Project</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool editable" data-add="rectangle">${Fe("box")}<span>Rectangle</span></button><button class="tool editable" data-add="circle">${Fe("cylinder")}<span>Circle</span></button><button class="tool editable" data-add="ring">${Fe("circle")}<span>Ring</span></button><button class="tool editable" data-add="sphere">${Fe("orbit")}<span>Sphere</span></button><button class="tool editable" data-add="polygon">${Fe("shapes")}<span>Polygon</span></button></div><label>Structures</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool" data-action="region">${Fe("scan")}<span>FDTD region</span></button><button class="tool editable" data-add="point">${Fe("radio")}<span>Dipole</span></button><button class="tool editable" data-add="plane">${Fe("move-right")}<span>Sheet source</span></button><button class="tool editable" data-add="tfsf">${Fe("scan")}<span>TFSF box</span></button><button class="tool editable" data-add="monitor">${Fe("activity")}<span>Time monitor</span></button><button class="tool editable" data-add="field">${Fe("activity")}<span>DFT / Flux</span></button></div><label>Simulation objects</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool editable" data-action="duplicate">${Fe("copy")}<span>Duplicate</span></button><button class="tool editable" data-action="copy">${Fe("copy")}<span>Copy</span></button><button class="tool editable" data-action="paste">${Fe("copy")}<span>Paste</span></button><button class="tool editable" data-action="delete">${Fe("trash-2")}<span>Delete</span></button><button class="tool" data-action="fit">${Fe("maximize")}<span>Fit view</span></button></div><label>Edit & view</label></div>
 <div class="tool-group run-tools"><div class="tool-row"><button class="tool" id="layout-button" data-action="layout">${Fe("pencil-ruler")}<span>Layout</span></button><button class="tool run" id="run-button" data-action="run">${Fe("play")}<span>Run</span></button><button class="tool stop" id="stop-button" data-action="stop" disabled>${Fe("square")}<span>Stop</span></button></div><label>Run simulation</label></div>
</div>
<main>
 <aside class="left-panel"><div class="panel-heading">Objects Tree <span id="object-count"></span></div><div class="tree-tools"><button data-action="region" title="Edit selected object">${Fe("settings-2")}</button><button data-action="undo" title="Undo (Ctrl+Z)">${Fe("undo-2")}</button><button data-action="redo" title="Redo (Ctrl+Y)">${Fe("redo-2")}</button><label><input type="checkbox" id="snap" checked> Snap</label></div><div id="tree"></div><div class="panel-heading results-heading">Results View</div><div id="stale-banner" class="stale-banner" role="status" hidden></div><div id="results-tree" class="results-tree"><div class="muted empty-hint">Select Run to calculate fields<br>and monitor signals.</div></div><div class="left-footer"><span class="eyebrow">EXAMPLE PROJECTS</span><button data-example="waveguide">${Fe("git-commit-horizontal")}SiN waveguide<span>2D</span></button><button data-example="scatterer">${Fe("circle-dot")}Cylinder scattering<span>2D</span></button><button data-example="3d">${Fe("orbit")}Dielectric sphere<span>3D</span></button><button data-example="pmc">${Fe("box")}PMC cavity<span>3D</span></button></div></aside>
 <section class="workspace"><div class="workspace-tabs"><button class="active" data-tab="geometry">${Fe("shapes")} Layout editor</button><button data-tab="fields">${Fe("chart-no-axes-combined")} Field visualizer</button><span class="mode-badge" id="mode-badge">LAYOUT</span></div><div id="viewports" class="viewports"></div><div id="field-view" hidden><div class="field-tools"><strong id="field-label">Ez · XY plane</strong><span id="frame-label">No data</span><button data-action="playback" title="Animate stored frames">${Fe("play")}</button><input type="range" id="frame-slider" min="0" max="0" value="0"><button data-action="download">${Fe("download")} NPZ</button></div><canvas id="field-canvas"></canvas><div class="plot-title"><strong>Point monitor</strong><select id="plot-monitor" aria-label="Plot monitor"></select><select id="plot-axis" aria-label="Spectrum axis" hidden><option value="frequency">Frequency</option><option value="wavelength">Wavelength</option></select><button data-plot="time" class="active">Time signal</button><button data-plot="spectrum">Field spectrum</button><button data-action="csv">${Fe("download")} CSV</button></div><canvas id="monitor-canvas"></canvas></div>
 <section class="bottom-panel"><div class="bottom-tabs"><button class="active" data-bottom="messages">${Fe("terminal")} Simulation log <span id="log-count"></span></button><button data-bottom="python">${Fe("file-code-2")} Python script</button><div class="bottom-actions"><button data-action="export-python">Export .py</button></div></div><div id="messages" role="log"></div><textarea id="python-editor" spellcheck="false" readonly hidden aria-label="Generated Python script"></textarea></section></section>
 <aside class="right-panel"><div class="panel-heading">Object properties <span id="property-type"></span></div><div id="properties"></div><div class="mesh-card"><div><span class="eyebrow">SIMULATION SUMMARY</span><button data-action="validate" title="Validate mesh and geometry">${Fe("refresh-cw")}</button></div><div id="mesh-summary">Validating project…</div></div></aside>
</main>
<footer><span id="status-text"><span class="dot"></span>Ready</span><span id="footer-grid"></span><div class="progress-track"><div id="progress-bar"></div></div><span id="progress-label"></span><span id="footer-device">Solver connecting</span></footer>
<input id="file-input" type="file" accept=".json,.fsp" hidden><dialog id="dialog"><div id="dialog-content"></div></dialog><div id="toast" role="alert" hidden></div>`;function ns(){xu({icons:g0,attrs:{"stroke-width":1.65}})}function lt(n,e="info"){Dr.push({text:n,kind:e,time:new Date().toLocaleTimeString("en-GB")}),he("#messages").innerHTML=Dr.slice(-100).map(t=>`<div class="log ${t.kind}"><time>${t.time}</time><span>${Ie(t.text)}</span></div>`).join(""),he("#messages").scrollTop=he("#messages").scrollHeight,he("#log-count").textContent=Dr.length}function Pt(n){he("#toast").textContent=n,he("#toast").hidden=!1,setTimeout(()=>he("#toast").hidden=!0,5e3)}async function bt(n,e){var i;const t=await fetch("/api"+n,e===void 0?{}:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){let s;try{s=await t.json()}catch{throw Error(`Server returned ${t.status}`)}throw Error(Array.isArray(s.detail)?s.detail.map(a=>a.loc.join(".")+": "+a.msg).join(`
`):s.detail||`Server returned ${t.status}`)}return(i=t.headers.get("content-type"))!=null&&i.includes("json")?t.json():t.text()}function Ac(){return[...D.project.structures,...D.project.sources,...D.project.monitors].find(n=>n.id===D.selected)}function _0(n){return D.project.structures.some(e=>e.id===n)?"structures":D.project.sources.some(e=>e.id===n)?"sources":"monitors"}function dt(){D.history.push(JSON.stringify(D.project)),D.history.length>80&&D.history.shift(),D.future=[]}function ot(){D.dirty=!0,D.maxRevision=Math.max(D.maxRevision,D.project.revision||0)+1,D.project.revision=D.maxRevision,D.project.content_sha256=null,Rd()||(Pt("Browser storage is full. Use Save to keep this project before closing or reloading."),lt("Automatic browser save failed. Export this project with Save to retain the current settings.","warning"))}function v0(n,e,t=!0){Object.assign([...D.project.structures,...D.project.sources,...D.project.monitors].find(i=>i.id===n)||{},e),t&&(ot(),Ut(),qt(),tt())}function vi(){return D.multi.length?D.multi:D.selected==="fdtd"?[]:[D.selected]}function Bn(n,e=!1){if(e&&n!=="fdtd"){const t=new Set(vi());t.has(n)?t.delete(n):t.add(n),D.multi=[...t],D.selected=D.multi.at(-1)||"fdtd"}else D.multi=n==="fdtd"?[]:[n],D.selected=n;qt(),Ut(),st==null||st.render()}function Ir(n){D.multi=n.length>1?[...n]:[],D.selected=n.at(-1)||"fdtd",qt(),Ut(),st==null||st.render()}function Lo(){const n=!!D.results&&(D.planHash===null||D.results.plan_hash!==D.planHash);he("#stale-banner").hidden=!n,he("#stale-banner").textContent=n?`Stale results: the project changed since run revision ${D.results.revision??"?"} (plan hash differs). Run again for current results.`:"",he("#results-tree").classList.toggle("stale",n),he("#field-view").classList.toggle("stale",n),D.tab==="fields"&&An()}function Rd(){try{return localStorage.setItem("torchfdtd.project.v1",JSON.stringify(D.project)),!0}catch{return!1}}function xn(n){D.mode=n,he("#mode-badge").textContent=n.toUpperCase(),he("#mode-badge").className="mode-badge "+n,ni(".editable").forEach(e=>e.disabled=n!=="layout"),he("#run-button").disabled=n!=="layout",he("#stop-button").disabled=n!=="running",he("#layout-button").disabled=n==="running",ni("[data-example]").forEach(e=>e.disabled=n==="running"),Ut(),st==null||st.render()}function qt(){const n=D.project;he("#project-title").innerHTML=Ie(n.name)+(n.revision?` <small class="revision">rev ${n.revision}</small>`:""),he("#object-count").textContent=n.structures.length+n.sources.length+n.monitors.length+1;const e=new Set(vi()),t=(s,a,r="")=>`<button class="tree-row ${e.has(s.id)?"selected":""} ${r}" data-select="${Ie(s.id)}"><span class="tree-icon">${Fe(a)}</span><span>${Ie(s.name)}</span>${s.enabled===!1?"<small>off</small>":""}</button>`,i=(s,a,r="")=>`<div class="tree-item">${t(s,a,r)}<button class="row-delete editable" data-action="delete-object" data-id="${Ie(s.id)}" aria-label="Delete ${Ie(s.name)}" title="Delete ${Ie(s.name)}" ${D.mode!=="layout"?"disabled":""}>${Fe("trash-2")}</button></div>`;he("#tree").innerHTML=`<div class="tree-root">${Fe("folder-open")} model</div>${t({id:"fdtd",name:"FDTD"},"scan","region-row")}<div class="tree-group">Structures <span>${n.structures.length}</span></div>${n.structures.map(s=>i(s,{rectangle:"box",circle:"cylinder",ring:"circle",sphere:"orbit",polygon:"shapes"}[s.kind])).join("")}<div class="tree-group">Sources <span>${n.sources.length}</span></div>${n.sources.map(s=>i(s,"radio","source-row")).join("")}<div class="tree-group">Monitors <span>${n.monitors.length}</span></div>${n.monitors.map(s=>i(s,"activity","monitor-row")).join("")}`,ns()}function Ze(n,e,t,i="",s={}){var a;return`<label class="property-row"><span>${n}</span><div><input aria-label="${n}" data-path="${e}" data-scale="${s.scale||1}" ${s.reciprocal?`data-reciprocal="${s.reciprocal}"`:""} type="number" value="${Number(((a=t.toPrecision)==null?void 0:a.call(t,12))??t)}" step="${s.step||"any"}" ${s.min!==void 0?`min="${s.min}"`:""}><small>${i}</small></div></label>`}function Lt(n,e,t,i){return`<label class="property-row"><span>${n}</span><select aria-label="${n}" data-path="${e}">${i.map(s=>{const[a,r]=Array.isArray(s)?s:[s,s];return`<option value="${Ie(a)}" ${a===t?"selected":""}>${Ie(r)}</option>`}).join("")}</select></label>`}function Wt(n,e){return`<section class="property-section"><h3>${n}</h3>${e}</section>`}const Ns={resident:"Resident",streamed_host:"Streamed through host memory",streamed_disk:"Streamed through disk",tiled:"Tiled (approximate)"},ba=n=>n==null?"?":n>=2**30?(n/2**30).toFixed(2)+" GiB":(n/2**20).toFixed(1)+" MiB";function Pd(n){var s,a;if(!n)return"Resolving execution mode…";const e=n.requested==="auto"?"Auto → ":"",t=(a=(s=n.auto)==null?void 0:s.rungs)!=null&&a.length?`<span class="auto-rungs">${n.auto.rungs.map(r=>`${r.chosen?"✔":"✘"} ${Ie(r.tier==="streamed_host"?"DRAM banks":r.tier==="tiled"?"approximate tiles":r.tier)}: ${Ie(r.reason)}`).join("<br>")}</span>`:"";if(!n.mode)return`<span class="warning error">${Ie(e+(n.error||"no execution mode fits"))}</span>${t}`;const i=(n.warnings||[]).map(r=>`<span class="warning">${Ie(r)}</span>`).join("");return`<b>${Ie(e+Ns[n.mode])}</b> on ${n.backend==="cuda"?"GPU":"CPU"}${t?` · chosen tier ${Ie(Ns[n.mode])}`:` · ${Ie(n.reason||"")}`}${n.mode==="streamed_disk"?` · scratch ${Ie(n.scratch_directory)}`:""}${t}${i}`}const Do=()=>(et==null?void 0:et.admission)==="fixed"?et.server_limits.resident_cells:null;function x0(){if(!(et!=null&&et.admission))return"";const n=et.admission==="memory";return`<div class="static-row" id="admission" title="${n?"Started with torchfdtd serve --memory-admission: scenes are admitted by the memory estimate, as on the Python API":"The server applies fixed size limits to every request; torchfdtd serve --memory-admission admits by the memory estimate instead"}">admission <b>${n?"memory estimate":`fixed server limits (${Do().toLocaleString("en-US")} resident cells)`}</b></div>`}function y0(n){var s,a;if(n.execution_mode!=="tiled")return"";const e=n.tiling,t=(a=(s=nt==null?void 0:nt.execution)==null?void 0:s.tiled)==null?void 0:a.plan,i=t==null?void 0:t.suggestion;return'<div class="tiled-panel">'+Ze("tile size","tiling.size_um",e.size_um,"µm",{min:.001})+Ze("tile overlap","tiling.overlap_um",e.overlap_um,"µm",{min:.001})+Ze("max diffraction angle","tiling.max_angle_deg",e.max_angle_deg,"°",{min:0})+`<div class="static-row">suggested overlap <b id="tiled-suggestion">${i?`${i.overlap_um.toPrecision(3)} µm = ${i.spread_um.toPrecision(3)} spread + ${i.absorber_um.toPrecision(3)} absorber`:"validate to compute"}</b></div><label class="enabled-row"><input type="checkbox" aria-label="Propagate to a focal plane" data-tiled-propagate ${e.propagation_um!=null?"checked":""}> Propagate to a focal plane</label>`+(e.propagation_um!=null?Ze("propagation distance","tiling.propagation_um",e.propagation_um,"µm",{min:0}):"")+'<p class="property-help">Approximate overlapping tiles for planar devices that fit no memory tier: one soft sheet source spanning the device (tick “extend through PML” on the sheet), CPML on every face and exactly one frequency plane, the output plane. Each tile misses the scatterers beyond its overlap, so read the mismatch indicator of the finished run and compare overlaps; the suggested overlap is distance × tan(angle) plus the absorber. The optional focal plane is an angular-spectrum propagation of the stitched plane. Point, one-way and TFSF sources, Bloch phases and graded meshes are rejected; the tiled adjoint is Python only. See docs/TILED_STITCHING.md.</p></div>'}const b0=299792458;function S0(n,e){const t=((n==null?void 0:n.sources)||[]).filter(i=>i.enabled!==!1).map(i=>{const s=i.use_global_source&&n.global_source?n.global_source:i;return["wavelength","frequency"].includes(s.time_definition)?s.wavelength_start:s.wavelength}).filter(i=>i>0);return t.length&&e?Math.min(...t)*1e-6/b0/(e*1e-15):null}function Ld(n){if(!n||n.frames_per_period==null)return"";const e=n.effective_interval>n.interval?` (one frame every ${n.effective_interval} steps: at most 100 frames are stored)`:"";return`<div class="static-row">frames per optical period <b id="snapshot-rate">${n.frames_per_period.toFixed(1)}</b></div>`+(n.aliased?`<p class="warning" id="snapshot-warning">Stored frames alias the carrier: ${n.frames_per_period.toFixed(1)} frames per optical period${e}; the playback will look like backward motion. Store a frame at least every ${Math.max(1,Math.floor(n.period_steps/4))} steps.</p>`:`<p class="property-help">${n.frames_per_period.toFixed(1)} stored frames per optical period of the shortest source wavelength (${n.period_steps.toFixed(1)} steps)${e}; four or more keep the playback direction faithful.</p>`)}function M0(n){var s,a,r,o,l;if(!(n!=null&&n.mode))return"";const e=n.policy,t=n.reservation;let i=Ie(Ns[n.mode]||n.mode);if(n.mode==="resident"&&(i+=` · estimate ${ba((s=n.resident)==null?void 0:s.estimated_bytes)}`),e&&(i+=` · slab ${e.slab_width} × depth ${e.temporal_depth} · ${e.state_storage==="disk"?"file banks":"DRAM banks"} · ${e.tile_device==="cuda"?"GPU tiles":"CPU tiles"}`),t&&(i+=`<br>host ${ba(t.host_reservation_bytes)}${(e==null?void 0:e.tile_device)==="cuda"?` · GPU ${ba(t.gpu_reservation_bytes)}`:""}${t.disk_reservation_bytes?` · disk ${ba(t.disk_reservation_bytes)}`:""}`),n.mode==="streamed_disk"&&(i+=`<br>scratch ${Ie(n.scratch_directory)}`),((a=n.report)==null?void 0:a.forward_seconds)!=null&&(i+=`<br>${n.report.forward_seconds.toFixed(2)} s streamed forward`),n.mode==="tiled"&&((r=n.tiled)!=null&&r.plan)){const c=n.tiled.plan,d=n.indicator,u=h=>h==null?"n/a":h.toFixed(3);i+=` · ${c.tiles} tiles (${c.counts.join(" × ")}) of ${c.tile_um.toPrecision(3)} µm · overlap ${c.overlap_um.toPrecision(3)} µm${c.propagation?` · focal plane +${c.propagation.distance_um} µm`:""}`,d&&(i+=`<br><b class="indicator">max mismatch ${u(d.max_mismatch_center)}</b> (centre) · ${u(d.max_mismatch)} (full band)`),(l=(o=n.report)==null?void 0:o.pairs)!=null&&l.length&&(i+=`<table class="mismatch-table"><thead><tr><th>pair</th><th>axis</th><th>mismatch</th><th>centre</th></tr></thead><tbody>${n.report.pairs.map(h=>`<tr><td>${Ie(h.tiles[0].replace("tile-",""))} | ${Ie(h.tiles[1].replace("tile-",""))}</td><td>${Ie(h.axis)}</td><td>${u(h.mismatch)}</td><td>${u(h.mismatch_center)}</td></tr>`).join("")}</tbody></table><p class="mismatch-note">Neighbour disagreement inside the shared overlap: the error indicator of an approximate method, not the error against the whole device.</p>`)}return"<br>"+i}function Ut(){var s,a,r;if(!D.project)return;const n=D.project,e=Ac(),t=n.region;he("#property-type").textContent=D.multi.length>1?"selection":e?e.kind||"monitor":"solver";let i="";if(D.multi.length>1){const o=D.multi.map(l=>[...n.structures,...n.sources,...n.monitors].find(c=>c.id===l)).filter(Boolean);i=`<div class="object-title">${Fe("copy")}<div><strong>${o.length} objects selected</strong><small>Ctrl+click adds to or removes from the selection</small></div></div>`+Wt("Selection",`<ul class="multi-list">${o.map(l=>`<li>${Ie(l.name)} <small>${Ie(l.kind||"monitor")}</small></li>`).join("")}</ul><div class="dialog-buttons"><button data-action="duplicate">Duplicate all</button><button data-action="copy">Copy</button><button data-action="delete">Delete all</button></div><p class="property-help">Duplicate, Copy (Ctrl+C), Paste (Ctrl+V) and Delete act on every selected object. Select one object to edit its properties.</p>`),he("#properties").innerHTML=`<fieldset ${D.mode!=="layout"?"disabled":""}>${i}</fieldset>`,ns();return}if(e){const o=_0(e.id),l=o==="structures",c=o==="sources";i=`<div class="object-title">${Fe(l?"box":c?"radio":"activity")}<div><strong>${Ie(e.name)}</strong><small>${l?e.kind:c?e.kind+" source":e.kind==="field"?"Frequency / flux monitor":"Point time monitor"}</small></div></div><label class="property-row name-row"><span>name</span><input aria-label="name" data-path="name" value="${Ie(e.name)}"></label><label class="enabled-row"><input type="checkbox" data-path="enabled" ${e.enabled?"checked":""}> Enabled in simulation</label><div class="object-actions"><button data-action="duplicate-object" data-id="${Ie(e.id)}" aria-label="Duplicate ${Ie(e.name)}">${Fe("copy")} Duplicate</button><button class="danger" data-action="delete-object" data-id="${Ie(e.id)}" aria-label="Delete ${Ie(e.name)}">${Fe("trash-2")} Delete</button></div>`;const d=e.kind==="field"?[0,1,2].filter(u=>u!=="xyz".indexOf(e.normal)&&(t.dimension==="3d"||u<2)):e.kind==="tfsf"?[0,1,2].filter(u=>t.dimension==="3d"||u<2):e.kind==="rectangle"||e.kind==="plane"?[0,1,2]:["circle","ring","polygon"].includes(e.kind)?[2]:[];if(i+=Wt("Geometry",e.center.map((u,h)=>Ze("xyz"[h],"center."+h,u,"µm")).join("")+d.map(u=>Ze("xyz"[u]+" span","size."+u,e.size[u],"µm",{min:l?.001:0})).join("")+(["circle","sphere","ring"].includes(e.kind)?Ze("radius","radius",e.radius,"µm",{min:.001}):"")+(e.kind==="ring"?Ze("inner radius","inner_radius",e.inner_radius,"µm",{min:0}):"")+(l?Hv(e,Ze):"")),l&&(i+=Wt("Material",Lt("material","material",e.material,n.materials.map(u=>u.name))+`<div class="static-row">refractive index <b>${(((a=n.materials.find(u=>u.name===e.material))==null?void 0:a.model)||"dielectric")==="dielectric"?(r=n.materials.find(u=>u.name===e.material))==null?void 0:r.index:"dispersive"}</b></div>`+Ze("mesh order","mesh_order",e.mesh_order,"",{step:1,min:1})+'<p class="property-help">Lower order takes priority in overlaps. Open Materials to edit dielectric, Drude or Lorentz parameters and inspect n/k.</p>'),i+=Wt("Rotation",Gv(e,Ze,Lt))),l){const u=n.structures.findIndex(h=>h.id===e.id);i+=Wt("Structure order",`<button data-action="structure-earlier" ${u===0?"disabled":""}>Move earlier in tree</button><button data-action="structure-later" ${u===n.structures.length-1?"disabled":""}>Move later in tree</button><p class="property-help">When mesh orders are equal, the later structure takes priority in overlaps.</p>`)}if(c){e.time_definition??(e.time_definition="cycles"),e.pulse_length??(e.pulse_length=2e-14),e.pulse_offset??(e.pulse_offset=5e-14),e.phase??(e.phase=0);const u=e.use_global_source?n.global_source:e;i+=Wt("Source settings",Kv(e,t,Ze,Lt)+Jv(e,Ze,Lt)+`<label class="enabled-row"><input type="checkbox" data-path="use_global_source" ${e.use_global_source?"checked":""} ${n.global_source?"":"disabled"}> Use global source settings</label><button data-action="global-source">Edit global source settings</button>${n.global_source?"":'<p class="property-help">Imported global settings are unavailable. Configure them before enabling inheritance.</p>'}`+(u?`<fieldset ${e.use_global_source?"disabled":""}>`+wd(u,Ze,Lt)+'<button data-action="source-signal">Load / edit time signal</button></fieldset>':"")+Ze("phase","phase",e.phase,"deg")+Ze("amplitude","amplitude",e.amplitude,"",{min:.001})+`<button data-action="source-preview">Preview time signal / spectrum</button><p class="property-help">${e.kind==="tfsf"?"Closed box with six-face E/H corrections and a live incident Yee line. Source preview shows the incident field at the entry face.":e.injection==="oneway"?"Normal-incidence discrete E/H plane with an eight-cell incident-line delay. Amplitude scales the incident-line soft drive. Source preview includes both corrections.":e.kind==="plane"?"Bidirectional E/H sheet. Bloch axes apply the unit-cell phase across the sheet.":"Reduced electric or magnetic point excitation. Magnetic sources use the H half-step time. Vector orientation may excite both 2D polarizations."}</p>`)}if(!l&&!c){e.spectrum??(e.spectrum={sampling:"fft",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:101,apodization:"hann",apodization_center:2e-14,apodization_time_width:1e-14});const u=e.use_global_monitor?n.global_monitor:e.spectrum,h=e.use_global_monitor&&e.inherit_apodization!==!1,m=h?u:e.spectrum;i+=Wt("Monitor settings",(e.kind==="field"?c0(e,t,Ze,Lt):Lt("component","component",e.component,["Ex","Ey","Ez","Hx","Hy","Hz"])+'<p class="property-help">Records one Yee field component at every time step. DFT downsampling affects spectral processing only.</p>')+Ze("DFT time downsample","time_downsample",e.time_downsample||1,"",{min:1,step:1})+`<label class="enabled-row"><input type="checkbox" data-path="use_global_monitor" ${e.use_global_monitor?"checked":""}> Use global monitor settings</label>${e.use_global_monitor?`<label class="enabled-row"><input type="checkbox" data-path="inherit_apodization" ${h?"checked":""}> Inherit global apodization</label>`:""}<button data-action="global-monitor">Edit global monitor settings</button>`),i+=Wt("Frequency / wavelength",`<fieldset ${e.use_global_monitor?"disabled":""}>`+Ad(u,Ze,Lt,{plane:e.kind==="field"})+'</fieldset><p class="property-help">DFT values are unnormalized field integrals. Power ratios require a matching air reference.</p>'),i+=Wt("Apodization",`<fieldset ${h?"disabled":""}>`+Lt("apodization","spectrum.apodization",m.apodization,[["none","None"],["start","Start"],["end","End"],["full","Full"],...e.kind==="field"?[]:[["hann","Hann (legacy FFT)"]]])+(["start","end","full"].includes(m.apodization)?Ze("apodization center","spectrum.apodization_center",m.apodization_center*1e15,"fs",{min:0,scale:1e-15})+Ze("apodization time width","spectrum.apodization_time_width",m.apodization_time_width*1e15,"fs",{min:.001,scale:1e-15})+'<p class="property-help">Width is the intensity FWHM of the Gaussian window. Apodized spectra are not normalized transmission or absolute intensity.</p>':"")+"</fieldset>")}}else{i=`<div class="object-title">${Fe("scan")}<div><strong>FDTD</strong><small>Simulation region</small></div></div>`,t.tiling??(t.tiling={size_um:20,overlap_um:2,max_angle_deg:45,propagation_um:null,allow_approximate:!1});const o=t.backend==="cuda"||t.backend==="auto"&&!!(et!=null&&et.cuda),l=et!=null&&et.cuda?et.cupy?"CUDA with fused Yee / CPML and plane DFT kernels":"CUDA with PyTorch kernels. Install the cuda-kernels extra for fused kernels.":"No CUDA device reported by the solver";i+=Wt("General",`<label class="enabled-row switch-row" title="${Ie(l)}"><input type="checkbox" aria-label="GPU" data-gpu-switch ${o?"checked":""} ${et!=null&&et.cuda?"":"disabled"}> GPU <small>${Ie(et!=null&&et.cuda?et.cupy?"fused CUDA kernels":"PyTorch CUDA kernels":"no CUDA device")}</small></label>`+Lt("dimension","dimension",t.dimension,[["2d","2D (XY)"],["3d","3D"]])+Lt("memory","execution_mode",t.execution_mode||"auto",[["auto","Auto (recommended)"],["resident","Resident (GPU or CPU memory)"],["streamed_host","Streamed through host memory (DRAM)"],["streamed_disk","Streamed through disk (slow, opt-in)"],["tiled","Tiled (approximate, large devices)"]])+`<label class="enabled-row consent-row" title="Lets Auto fall back to the approximate overlapping tiles for a planar device when neither resident nor DRAM-streamed execution fits"><input type="checkbox" aria-label="Allow approximate tiling" data-path="tiling.allow_approximate" ${(s=t.tiling)!=null&&s.allow_approximate?"checked":""}> Allow approximate tiling in Auto</label><div class="execution-status" id="execution-status">${Pd(nt==null?void 0:nt.execution)}</div>${x0()}<p class="property-help">Auto runs resident when the estimate fits 75% of free GPU memory (80% of host memory on CPU)${Do()?` and at most ${Do()/1e6} million cells`:""}; otherwise it streams x slabs through DRAM field banks; otherwise, only with the consent above and for a planar device, it runs the approximate tiles; otherwise it refuses. Streamed through disk is never chosen automatically: it is an explicit opt-in that ran 1.9 to 2.4 times slower than DRAM banks in the records. Streamed jobs are forward only: point monitors, frequency planes and one field snapshot at the final step, no live frames, no decay shutoff, no dispersive, TFSF, subpixel or PMC scenes. Expect streaming to run several times slower than resident. See docs/EXECUTION_MODES.md.</p>`+y0(t)+`<div class="advanced-execution ${D.advancedExecution?"open":""}"><button type="button" class="advanced-toggle" data-advanced-toggle aria-expanded="${!!D.advancedExecution}">Advanced execution</button><div class="advanced-body" ${D.advancedExecution?"":"inert"}>`+Lt("resource","backend",t.backend,[["auto","GPU if available"],["cuda","GPU · CUDA"],["cpu","CPU"]])+Lt("precision","precision",t.precision,["float32","float64"])+Lt("CUDA kernel","cuda_kernel",t.cuda_kernel||"auto",[["auto","Automatic (fused with CuPy)"],["torch","PyTorch reference"],["fused","Fused Yee / CPML (experimental)"]])+Lt("Frequency monitor kernel","cuda_monitor_kernel",t.cuda_monitor_kernel||"auto",[["auto","Automatic (fused with CuPy)"],["torch","PyTorch reference"],["fused","Shared CUDA plane DFT (experimental)"]])+'<p class="property-help">The GPU switch sets these together: on selects CUDA with fused kernels when CuPy is installed, off selects CPU. Streamed GPU tiles always use the fused kernels.</p></div></div>'),i+=Wt("Geometry",t.size.map((c,d)=>Ze("xyz"[d]+" span","size."+d,c,"µm",{min:.01})).join("")),i+=Wt("Mesh settings",Fv(t,Ze,Lt,Ie)),i+=Wt("Boundary conditions",Ze("PML layers","pml_cells",t.pml_cells,"cells",{step:1,min:3})+["x","y",...t.dimension==="3d"?["z"]:[]].map((c,d)=>["min","max"].map(h=>{const m=c+"_"+h,g=t.boundaries[m];return Lt(c+" "+h+" bc","boundaries."+m+".kind",g.kind,[["pml","PML"],["periodic","Periodic"],["bloch","Bloch"],["pec","PEC"],["antisymmetric","Anti-symmetric (PEC)"],["pmc","PMC"],["symmetric","Symmetric (PMC)"]])+(g.kind==="pml"?`<details class="boundary-options"><summary>${c} ${h} PML settings</summary>${Ze(c+" "+h+" layers","boundaries."+m+".layers",g.layers??t.pml_cells,"cells",{step:1,min:3})}<label class="enabled-row"><input type="checkbox" data-boundary-default="${m}" ${g.layers===null?"checked":""}> Use default layers</label>${Ze("sigma scale","boundaries."+m+".sigma_scale",g.sigma_scale)}${Ze("kappa","boundaries."+m+".kappa",g.kappa)}${Ze("alpha","boundaries."+m+".alpha",g.alpha)}${Ze("polynomial","boundaries."+m+".polynomial",g.polynomial)}${Ze("alpha polynomial","boundaries."+m+".alpha_polynomial",g.alpha_polynomial)}</details>`:"")}).join("")+(t.boundaries[c+"_min"].kind==="bloch"?Ze("Bloch phase "+c,"bloch_phase."+d,t.bloch_phase[d],"rad"):"")).join("")+Ze("background index","background_index",t.background_index,"",{min:1})+'<button data-action="boundary-editor">Edit six faces together</button><p class="property-help">Cyclic boundaries are paired. Bloch phase is the phase gained over one positive unit-cell translation. PMC and magnetic symmetry support PEC/PMC walls or restricted endpoint CPML with point sources/monitors. Use the six-face editor for the supported CPML profile.</p>'),i+=Wt("Simulation time",Ze("dt stability factor","courant_factor",t.courant_factor??.99,"",{min:.01})+Ze("time steps","steps",t.steps,"",{step:1,min:10})+Ze("snapshot every","snapshot_interval",t.snapshot_interval,"steps",{step:1,min:1})+`<div id="snapshot-status">${Ld(nt==null?void 0:nt.snapshot)}</div>`),i+=Wt("Termination and diagnostics",a0(t,Ze)),i+=Wt("Field output",Lt("component","field",t.field,["Ex","Ey","Ez","Hx","Hy","Hz"])+Lt("plane normal","slice_axis",t.slice_axis,t.dimension==="2d"?["z"]:["x","y","z"])+Ze("plane position","slice_position",t.slice_position,"µm")+Lt("field display","complex_display",t.complex_display,[["real","Real"],["imag","Imaginary"],["magnitude","Magnitude"],["phase","Phase (rad)"]]))}he("#properties").innerHTML=`<fieldset ${D.mode!=="layout"?"disabled":""}>${i}</fieldset>`,ns(),w0(),he("#properties").querySelectorAll("[data-path]").forEach(o=>o.addEventListener("change",()=>{var h;if(D.mode!=="layout"||o.type==="number"&&!E0(o))return;dt();const l=Ac()||n.region,c=o.dataset.path.split(".");c[0]==="downsample_xyz"&&!l.downsample_xyz&&(l.downsample_xyz=[l.downsample||1,l.downsample||1,l.downsample||1]);let d=l;for(const m of c.slice(0,-1))d=d[m];const u=o.type==="checkbox"?o.checked:o.type==="number"?o.dataset.reciprocal?Number(o.dataset.reciprocal)/Number(o.value):Number(o.value)*Number(o.dataset.scale||1):o.value;if(c.length===1&&n.sources.includes(l)?Ed(l,c[0],u):d[c.at(-1)]=u,l===t&&c[0]==="mesh_type"&&u==="graded"&&(t.material_sampling="yee",t.mesh_max=Math.max(t.mesh_max,t.mesh)),l===t&&c[0]==="interface_method"&&u==="subpixel"&&(t.material_sampling="yee"),l===t&&c[0]==="mesh_type"&&u!=="explicit"&&(t.mesh_coordinates=null),n.sources.includes(l)&&["injection","normal"].includes(c[0])&&Sc(l,t,{boundaries:!0}),l.kind==="field"&&c[0]==="normal"){const m=l.size.indexOf(0),g="xyz".indexOf(u);m!==g&&(l.size[m]=Math.min(1,t.size[m]/2),l.size[g]=0)}if(c.join(".")==="spectrum.sampling"&&u==="custom"&&!((h=l.spectrum.custom_frequencies_hz)!=null&&h.length)&&(l.spectrum.custom_frequencies_hz=[2e14]),c.join(".")==="spectrum.sampling"&&o.value!=="fft"&&l.spectrum.apodization==="hann"&&(l.spectrum.apodization="none"),c.join(".")==="spectrum.sampling"&&u==="fft"&&(l.spectrum.use_source_limits=!1),l===t&&c[0]==="boundaries"&&c[2]==="kind"){const[m,g]=c[1].split("_"),_=o.value,p=m+"_"+(g==="min"?"max":"min");(["periodic","bloch"].includes(_)||["periodic","bloch"].includes(t.boundaries[p].kind))&&(t.boundaries[p].kind=_),_!=="bloch"&&(t.bloch_phase["xyz".indexOf(m)]=0)}l===t&&c[0]==="dimension"&&t.dimension==="2d"&&(t.slice_axis="z",t.slice_position=0,t.bloch_phase[2]=0,t.boundaries.z_min.kind="pml",t.boundaries.z_max.kind="pml",n.sources.forEach(m=>m.center[2]=0),n.monitors.forEach(m=>{m.center[2]=0,m.kind==="field"&&m.normal==="z"&&(m.normal="x",m.size[0]=0,m.size[2]=1)})),l===t&&c[0]==="dimension"&&t.mesh_type==="explicit"&&(t.mesh_type="uniform",t.mesh_coordinates=null),l===t&&["size","mesh","dimension"].includes(c[0])&&n.sources.forEach(m=>Sc(m,t)),ot(),qt(),st.render(),Ut(),tt()})),he("#properties").querySelectorAll("[data-record-family]").forEach(o=>o.onchange=()=>{if(D.mode!=="layout")return;dt();const l=o.dataset.recordFamily,c=l==="record_fields"?["Ex","Ey","Ez","Hx","Hy","Hz"]:["x","y","z"],d=new Set(e[l]??c);o.checked?d.add(o.value):d.delete(o.value),e[l]=c.filter(u=>d.has(u)),ot(),Ut(),tt()}),he("#properties").querySelectorAll("[data-source-vector]").forEach(o=>o.onchange=()=>{D.mode==="layout"&&(dt(),e.theta=o.checked?e.component[1]==="z"?0:90:null,e.phi=e.component[1]==="y"?90:0,ot(),Ut(),st.render(),tt())}),he("#properties").querySelectorAll("[data-source-family]").forEach(o=>o.onchange=()=>{D.mode==="layout"&&(dt(),e.component=o.value+e.component[1],ot(),Ut(),st.render(),tt())}),he("#properties").querySelectorAll("[data-frequency-table]").forEach(o=>o.onchange=()=>{D.mode==="layout"&&(dt(),e.spectrum.custom_frequencies_hz=o.value.trim().split(/[\s,;]+/).filter(Boolean).map(l=>Number(l)*1e12),ot(),tt())}),he("#properties").querySelectorAll("[data-run-field-limit]").forEach(o=>o.onchange=()=>{D.mode==="layout"&&(dt(),t.run_control.field_limit=o.checked?1e6:null,ot(),Ut(),tt())}),he("#properties").querySelectorAll("[data-gpu-switch]").forEach(o=>o.onchange=()=>{if(D.mode!=="layout")return;dt();const l=o.checked&&!!(et!=null&&et.cupy);t.backend=o.checked?"cuda":"cpu",t.cuda_kernel=l?"fused":"torch",t.cuda_monitor_kernel=l?"fused":"torch",ot(),Ut(),tt()}),he("#properties").querySelectorAll("[data-tiled-propagate]").forEach(o=>o.onchange=()=>{D.mode==="layout"&&(dt(),t.tiling.propagation_um=o.checked?10:null,ot(),Ut(),tt())}),he("#properties").querySelectorAll("[data-advanced-toggle]").forEach(o=>o.onclick=()=>{D.advancedExecution=!D.advancedExecution;const l=o.closest(".advanced-execution");l.classList.toggle("open",D.advancedExecution),o.setAttribute("aria-expanded",String(D.advancedExecution)),l.querySelector(".advanced-body").toggleAttribute("inert",!D.advancedExecution)}),he("#properties").querySelectorAll("[data-axis-steps]").forEach(o=>o.onchange=()=>{D.mode==="layout"&&(dt(),t.mesh_steps=o.checked?[t.mesh,t.mesh,t.mesh]:null,o.checked&&(t.material_sampling="yee"),ot(),Ut(),st.render(),tt())}),he("#properties").querySelectorAll("[data-fixed-dt]").forEach(o=>o.onchange=()=>{D.mode==="layout"&&(dt(),t.time_step_override=o.checked?((nt==null?void 0:nt.dt_fs)??.01)*5e-16:null,ot(),Ut(),tt())})}function E0(n){var c,d;const e=n.dataset.reciprocal?Number(n.dataset.reciprocal)/Number(n.value):Number(n.value)*Number(n.dataset.scale||1),t=n.getAttribute("aria-label"),i=((c=n.parentElement.querySelector("small:not(.field-error)"))==null?void 0:c.textContent)||"",s=n.min===""?null:Number(n.min),a=n.max===""?null:Number(n.max);let r=null;n.validity.badInput||n.value.trim()===""||!Number.isFinite(Number(n.value))||!Number.isFinite(e)?r=`${t} must be a finite number${i?" in "+i:""}.`:s!==null&&Number(n.value)<s?r=`${t} must be at least ${s}${i?" "+i:""}.`:a!==null&&Number(n.value)>a&&(r=`${t} must be at most ${a}${i?" "+i:""}.`);const o=n.closest(".property-row");if((d=o==null?void 0:o.querySelector(".field-error"))==null||d.remove(),n.removeAttribute("aria-invalid"),!r)return!0;n.setAttribute("aria-invalid","true");const l=document.createElement("small");return l.className="field-error",l.textContent=r,o==null||o.append(l),Pt(r+" The previous value is kept."),lt("Rejected input: "+r,"warning"),!1}function w0(){ni("[data-boundary-default]").forEach(n=>n.onchange=()=>{if(D.mode!=="layout")return;dt();const e=D.project.region;e.boundaries[n.dataset.boundaryDefault].layers=n.checked?null:e.pml_cells,ot(),Ut(),st.render(),tt()})}async function tt(){var n,e,t;try{const i=D.project,s=i.revision;nt=await bt("/validate",i),D.project===i&&D.project.revision===s&&(D.project.content_sha256=nt.content_sha256,Rd()),D.planHash=nt.plan_hash,Lo(),he("#mesh-summary").innerHTML=`<strong>${nt.shape.join(" × ")}</strong><span>${nt.cells.toLocaleString()} cells · ~${Number(nt.estimated_memory_mb).toFixed(1)} MB</span>${nt.mesh_type==="graded"?`<span>${nt.cell_reduction_percent.toFixed(1)}% fewer cells than uniform</span>`:""}<span>Δt ${nt.dt_fs.toFixed(4)} fs · ${nt.duration_fs.toFixed(1)} fs total</span>${nt.warnings.map(c=>`<p class="warning">${Ie(c)}</p>`).join("")}`,he("#footer-grid").textContent=nt.shape.join(" × ")+" cells";const a=he("#execution-status");a&&(a.innerHTML=Pd(nt.execution));const r=he("#snapshot-status");r&&(r.innerHTML=Ld(nt.snapshot));const o=he("#tiled-suggestion"),l=(t=(e=(n=nt.execution)==null?void 0:n.tiled)==null?void 0:e.plan)==null?void 0:t.suggestion;return o&&l&&(o.textContent=`${l.overlap_um.toPrecision(3)} µm = ${l.spread_um.toPrecision(3)} spread + ${l.absorber_um.toPrecision(3)} absorber`),!0}catch(i){return D.planHash=null,Lo(),he("#mesh-summary").innerHTML=`<p class="warning error">${Ie(i.message)}</p>`,!1}}function T0(n){var s;if(D.mode!=="layout"||!D.project||!st)return;dt();const e=crypto.randomUUID(),t={id:e,name:n+"_"+(D.project.structures.length+D.project.sources.length+D.project.monitors.length+1),center:[0,0,0],enabled:!0};if(["rectangle","circle","ring","sphere","polygon"].includes(n))D.project.structures.push(Ha({...t,kind:n,size:[1,1,.5],radius:.5,inner_radius:.3,rotation:0,material:((s=D.project.materials.find(a=>a.name.startsWith("SiN")))==null?void 0:s.name)||D.project.materials[0].name,mesh_order:2}));else if(n==="field")D.project.monitors.push({...t,kind:"field",component:"Ez",normal:"x",size:[0,Math.min(1,D.project.region.size[1]/3),D.project.import_provenance&&D.project.region.dimension==="2d"?1:Math.min(1,D.project.region.size[2]/3)],downsample:1,use_global_monitor:!1,spectrum:{sampling:"frequency",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:41,apodization:"none",apodization_center:2e-14,apodization_time_width:1e-14}});else if(n==="monitor")D.project.monitors.push({...t,component:"Ez",...D.project.import_provenance?{spectrum:{sampling:"fft",apodization:"none"}}:{}});else if(n==="tfsf"){const a=D.project.region,r=a.dimension==="2d"?2:3,o=a.size.map((l,c)=>c>=r?0:Math.max(3*a.mesh,Math.min(2,l-2*(Math.max(a.boundaries["xyz"[c]+"_min"].layers??a.pml_cells,a.boundaries["xyz"[c]+"_max"].layers??a.pml_cells)+3)*a.mesh)));D.project.sources.push({...t,kind:n,injection:"oneway",normal:"x",direction:"+",size:o,component:"Ez",wavelength:1.55,amplitude:1,pulse:"gaussian",pulse_cycles:3,incident_pml_cells:96})}else D.project.sources.push({...t,kind:n,size:[0,1,0],component:"Ez",wavelength:1.55,amplitude:1,pulse:"gaussian",pulse_cycles:3});const i=D.project.sources.find(a=>a.id===e);i&&D.project.import_provenance&&Object.assign(i,{time_definition:"standard",pulse_length:2e-14,pulse_offset:5e-14}),ot(),Bn(e),tt(),lt("Added "+t.name+". Drag in a viewport or edit its properties.")}function Io(n,e,t="application/json"){const i=URL.createObjectURL(new Blob([n],{type:t})),s=document.createElement("a");s.href=i,s.download=e,s.click(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}function $n(n){D.tab=n,ni("[data-tab]").forEach(e=>e.classList.toggle("active",e.dataset.tab===n)),he("#viewports").hidden=n!=="geometry",he("#field-view").hidden=n!=="fields",n==="geometry"?st.render():An()}function Dd(n){D.bottom=n,ni("[data-bottom]").forEach(e=>e.classList.toggle("active",e.dataset.bottom===n)),he("#messages").hidden=n!=="messages",he("#python-editor").hidden=n!=="python",n==="python"&&bt("/python",D.project).then(e=>he("#python-editor").value=e).catch(e=>Pt(e.message))}function An(){var c,d,u,h,m,g,_,p,f;const n=D.project.region,e="xyz".indexOf(n.slice_axis);let t=(((d=(c=D.results)==null?void 0:c.summary)==null?void 0:d.actual_size_um)||n.size).filter((w,E)=>E!==e);const i=D.results,s=(i==null?void 0:i.frames[D.frame])||D.liveFrame,a=(m=(h=(u=i==null?void 0:i.summary)==null?void 0:u.execution)==null?void 0:h.frames)==null?void 0:m[D.frame],r=he("#field-view").classList.contains("stale");he("#field-label").textContent=(r?"STALE · ":"")+(a?`${a.label} · ${a.axes.join("").toUpperCase()} plane`:n.field+" · "+n.complex_display+" · "+["YZ","XZ","XY"][e]+" plane");let o="";if(i&&((g=i.frame_steps)==null?void 0:g.length)>1&&((_=i.summary)!=null&&_.dt_fs)){const w=i.frame_steps[1]-i.frame_steps[0],E=((p=i.summary.snapshot)==null?void 0:p.period_steps)??S0(D.project,i.summary.dt_fs);E&&E/w<4&&(o=` · aliased: ${(E/w).toFixed(1)} frames per optical period, motion may look reversed`)}he("#frame-label").textContent=(a?a.plane+" plane":i?i.frames.length?"Step "+i.frame_steps[D.frame]:"No field snapshot":"Live field")+o,a&&(t=a.span_um),he("#frame-slider").max=Math.max(0,((i==null?void 0:i.frames.length)||1)-1),he("#frame-slider").value=D.frame;const l=D.monitors||[];l.some(w=>w.id===D.plotMonitor)||(D.plotMonitor=(f=l[0])==null?void 0:f.id),he("#plot-monitor").innerHTML=l.map(w=>`<option value="${Ie(w.id)}" ${w.id===D.plotMonitor?"selected":""}>${Ie(w.name)} · ${w.component}</option>`).join(""),he("#plot-axis").hidden=!D.spectrum,jv(he("#field-canvas"),s,t,a?a.label:n.field+" "+n.complex_display,n.complex_display==="phase"?Math.PI:i==null?void 0:i.max,a?"|E|², reduced":n.complex_display==="phase"?"rad":"reduced field"),ts(he("#monitor-canvas"),l.filter(w=>w.id===D.plotMonitor),D.spectrum,he("#plot-axis").value==="wavelength")}async function A0(){var n,e,t;if(D.mode==="layout"){if(!await tt()){Pt("Fix the highlighted project settings before running.");return}if((n=nt.execution)!=null&&n.error){Pt(nt.execution.error),lt(nt.execution.error,"error");return}try{D.results=null,D.monitors=null,D.liveFrame=null;const i=await bt("/jobs",D.project);D.job=i.id,localStorage.setItem("torchfdtd.activeJob",i.id),xn("running"),$n("fields"),lt("Submitted "+D.project.name+" · "+D.project.region.backend+" · "+D.project.region.precision+((e=nt.execution)!=null&&e.mode?" · "+Ns[nt.execution.mode]:"")),nt.warnings.forEach(s=>lt(s,"warning")),(((t=nt.execution)==null?void 0:t.warnings)||[]).forEach(s=>lt(s,"warning")),Fa()}catch(i){lt(i.message,"error"),Pt(i.message)}}}async function Fa(){var n,e,t;try{const i=await bt("/jobs/"+D.job),s=i.progress,a=Math.round(100*s.step/s.total);if(he("#progress-bar").style.width=a+"%",he("#progress-label").textContent=a+"%",he("#status-text").textContent=i.status==="queued"?"Queued on solver":i.status==="running"?s.blocks?`Streaming block ${s.block} / ${s.blocks} · tile ${s.tile} / ${s.tiles}`:s.tiles?`Tile ${s.tile} / ${s.tiles} · step ${s.step%(s.total/s.tiles)||s.total/s.tiles}`:"Calculating fields…":i.status,D.liveFrame=s.frame,D.tab==="fields"&&An(),["completed","cancelled","failed"].includes(i.status)){if(i.status==="failed"){localStorage.removeItem("torchfdtd.activeJob"),xn("analysis"),lt(i.error,"error"),Pt(i.error);return}he("#status-text").textContent="Calculation complete · loading field results…";const r=await bt("/jobs/"+D.job+"/fields");let o=1e-20;r.frames.forEach(l=>l.forEach(c=>c.forEach(d=>o=Math.max(o,Math.abs(d))))),r.max=o,r.plan_hash=i.plan_hash,r.revision=i.revision,D.results=r,D.frame=Math.max(0,r.frames.length-1),D.monitors=i.monitors,localStorage.removeItem("torchfdtd.activeJob"),xn("analysis"),he("#status-text").textContent=i.status,he("#results-tree").innerHTML=`<button data-tab="fields">${Fe("chart-no-axes-combined")} ${((n=i.execution)==null?void 0:n.mode)==="tiled"?"Stitched plane |E|²":Ie(D.project.region.field)+" field snapshots"}</button>${i.monitors.map(l=>`<button data-tab="fields">${Fe("activity")} ${Ie(l.name)} · ${l.component}</button>`).join("")}${(e=i.flux_monitors)!=null&&e.length?`<button data-action="propagation">${Fe("chart-no-axes-combined")} Angular spectrum</button>`:""}<div class="run-summary"><b>${i.summary.seconds.toFixed(2)} s</b> solver loop<br>${i.summary.backend.toUpperCase()}${i.summary.cuda_graph?" · CUDA graph":""}${i.summary.cuda_kernel==="fused"?" · fused Yee / CPML":""}${i.summary.cuda_monitor_kernel==="fused"?" · shared plane DFT":""}<br>${i.summary.mcells_per_second.toFixed(1)} Mcells/s<br>${i.summary.gpu?Ie(i.summary.gpu):"CPU"}<br>${i.summary.auto_shutoff?"Decay threshold reached":i.summary.cancelled?"Cancelled":"Step limit reached"}<br>${i.summary.steps} / ${i.summary.requested_steps??i.summary.steps} steps${M0(i.execution)}</div>`,ns(),Lo(),An(),lt(`${i.status}: ${i.summary.steps} steps in ${i.summary.seconds.toFixed(3)} s, ${i.summary.mcells_per_second.toFixed(1)} Mcells/s. Setup ${i.summary.setup_seconds.toFixed(2)} s.`+((t=i.execution)!=null&&t.mode?` Execution: ${Ns[i.execution.mode]}${i.execution.policy?` (slab ${i.execution.policy.slab_width} × depth ${i.execution.policy.temporal_depth}, ${i.execution.policy.state_storage} banks)`:""}.`:"")),i.summary.warnings.forEach(l=>lt(l,"warning"));return}Tc=setTimeout(Fa,400)}catch(i){lt("Connection lost: "+i.message+". Retrying the same job…","warning"),Tc=setTimeout(Fa,2e3)}}function Cc(n){he("#dialog-content").innerHTML=n+'<div class="dialog-actions"><button data-close>Close</button></div>',he("#dialog").showModal(),ns()}function Rc(){L0.open()}const Id=qv({esc:Ie,toast:Pt,log:lt}),C0=Xv({esc:Ie,toast:Pt,log:lt,getProject:()=>D.project,loadProject:async n=>{if(D.mode==="running")throw Error("Wait for the active simulation to finish before opening a scene.");const e=await bt("/validate",n);dt(),D.project=e.project,D.selected="fdtd",D.results=null,D.monitors=null,D.liveFrame=null,D.job=null,he("#results-tree").innerHTML='<div class="muted empty-hint">Run to calculate the imported scene.</div>',ot(),xn("layout"),$n("geometry"),qt(),st.fit(),await tt(),lt("Opened independently converted FSP scene. Conversion differences are retained with the project.")}}),R0=Zv({esc:Ie,toast:Pt,log:lt,api:bt,getProject:()=>D.project,download:Io}),P0=Yv({esc:Ie,toast:Pt,log:lt,getProject:()=>D.project,loadProject:async n=>{if(D.mode!=="layout")throw Error("Switch to Layout before importing geometry.");const e=await bt("/validate",n);dt(),D.project=e.project,D.selected="fdtd",D.results=null,D.monitors=null,D.liveFrame=null,D.job=null,he("#results-tree").innerHTML='<div class="muted empty-hint">Run to calculate the imported scene.</div>',ot(),xn("layout"),$n("geometry"),qt(),st.fit(),await tt()}}),L0=n0({state:D,api:bt,esc:Ie,toast:Pt,commit:n=>{if(D.mode!=="layout")throw Error("Switch to Layout before editing.");dt(),D.project=n,ot(),Ut(),qt(),st.render(),tt()}}),ms=Ov({state:D,api:bt,esc:Ie,commit:n=>{if(D.mode!=="layout")throw Error("Switch to Layout before editing.");dt(),D.project=n,ot(),Ut(),st.render(),tt()}}),Ur=e0({state:D,api:bt,esc:Ie,toast:Pt,commit:n=>{if(D.mode!=="layout")throw Error("Switch to Layout before editing.");dt(),D.project=n,ot(),Ut(),qt(),st.render(),tt()}}),D0=Vv({state:D,api:bt,esc:Ie,commit:n=>{if(D.mode!=="layout")throw Error("Switch to Layout before editing.");dt(),D.project=n,ot(),Ut(),qt(),st.render(),tt()}}),I0=i0({api:bt,esc:Ie}),U0=s0({esc:Ie}),Pc=d0({state:D,api:bt,esc:Ie,toast:Pt,numeric:Ze,dropdown:Lt,commit:n=>{if(D.mode!=="layout")throw Error("Switch to Layout before editing.");dt(),D.project=n,ot(),Ut(),qt(),st.render(),tt()}}),N0=u0({state:D,api:bt,esc:Ie,commit:n=>{if(D.mode!=="layout")throw Error("Switch to Layout before editing.");dt(),D.project=n,ot(),Ut(),qt(),st.render(),tt()}}),Ts={"boundary-editor":()=>N0.open(),gds:()=>{D.mode==="layout"&&P0.open()},"geometry-vertices":()=>D0.open(D.selected),capabilities:()=>I0.open(),"inverse-design":()=>U0.open(),"global-monitor":()=>Pc.globals(),"flux-results":()=>Pc.flux(),propagation:()=>Td({state:D,api:bt,esc:Ie,toast:Pt}),"mesh-preview":()=>ms.open(),"mesh-freeze":()=>ms.freeze(),"mesh-nodes":()=>ms.editNodes(),"mesh-add":()=>ms.add(),"mesh-remove":n=>ms.remove(Number(n.dataset.index)),"global-source":()=>Ur.globals(),"source-signal":()=>Ur.signal(D.selected),"source-preview":()=>Ur.preview(D.selected),fsp:()=>Id.open(),"fsp-native":()=>{D.mode==="layout"&&C0.open()},new:()=>{D.mode!=="running"&&Cc('<h2>Project files</h2><p>Save your current project before opening another design.</p><div class="dialog-buttons"><button data-action="save">Save current project</button><button data-action="open">Open project (.json)</button><button data-action="blank">New empty project</button></div>')},blank:async()=>{if(D.mode==="running")return;dt();const n=await bt("/examples/waveguide");n.name="Untitled",n.structures=[],n.sources=[],n.monitors=[],D.project=n,D.selected="fdtd",D.results=null,D.monitors=null,D.liveFrame=null,ot(),xn("layout"),$n("geometry"),qt(),tt(),he("#dialog").close()},save:async()=>{D.mode==="layout"&&await tt(),Io(JSON.stringify(D.project,null,2),D.project.name.replace(/[^a-z0-9]/gi,"_")+".json"),D.dirty=!1,lt(`Project saved as JSON (revision ${D.project.revision||0}${D.project.content_sha256?", content hash "+D.project.content_sha256.slice(0,12):", content hash unavailable"}). Load the same file from Python with Project.load().`)},"export-gds":()=>R0.open(),open:()=>{D.mode!=="running"&&he("#file-input").click()},region:()=>Bn("fdtd"),fit:()=>st.fit(),materials:Rc,undo:()=>{D.mode!=="layout"||!D.history.length||(D.future.push(JSON.stringify(D.project)),D.project=JSON.parse(D.history.pop()),ot(),Bn("fdtd"),tt())},redo:()=>{D.mode!=="layout"||!D.future.length||(D.history.push(JSON.stringify(D.project)),D.project=JSON.parse(D.future.pop()),ot(),Bn("fdtd"),tt())},delete:()=>Lc(vi()),"delete-object":n=>Lc([n.dataset.id]),"duplicate-object":n=>{if(D.mode!=="layout")return;const e=[...D.project.structures,...D.project.sources,...D.project.monitors].find(i=>i.id===n.dataset.id);if(!e)return;dt();const t=Nr([structuredClone(e)]);ot(),Ir(t.map(i=>i.id)),tt()},duplicate:()=>{if(D.mode!=="layout"||!vi().length)return;dt();const n=Nr(vi().map(e=>structuredClone([...D.project.structures,...D.project.sources,...D.project.monitors].find(t=>t.id===e))));ot(),Ir(n.map(e=>e.id)),tt()},copy:()=>{if(!vi().length)return;const n=vi().map(e=>structuredClone([...D.project.structures,...D.project.sources,...D.project.monitors].find(t=>t.id===e)));D.clipboard=JSON.stringify(n),lt(`Copied ${n.length} object${n.length===1?"":"s"}.`),Pt(`Copied ${n.length} object${n.length===1?"":"s"}. Paste with Ctrl+V.`)},paste:()=>{if(D.mode!=="layout"||!D.clipboard)return;dt();const n=Nr(JSON.parse(D.clipboard));ot(),Ir(n.map(e=>e.id)),tt(),lt(`Pasted ${n.length} object${n.length===1?"":"s"}.`)},"structure-earlier":()=>Dc(-1),"structure-later":()=>Dc(1),layout:()=>{D.mode!=="running"&&(D.liveFrame=null,xn("layout"),$n("geometry"),lt("Layout mode. The results of the last run stay visible and are marked stale as soon as the project plan differs from that run."))},run:A0,stop:async()=>{D.job&&(await bt("/jobs/"+D.job+"/cancel",{}),lt("Stop requested. Waiting for the current time step to finish."))},validate:tt,python:()=>Dd("python"),"export-python":async()=>{Io(await bt("/python",D.project),"simulation.py","text/x-python")},"mode-ports":()=>m0(D.project,{toast:Pt}),download:()=>{if(!D.results){Pt("Run the simulation first.");return}he("#stale-banner").hidden||lt("Downloading the results of run revision "+(D.results.revision??"?")+"; the project has changed since that run.","warning"),window.location.href="/api/jobs/"+D.job+"/download"},csv:()=>{D.results?window.location.href="/api/jobs/"+D.job+(D.spectrum?"/spectra.csv":"/monitors.csv"):Pt("Run the simulation first.")},playback:()=>{var n;if(Bi){clearInterval(Bi),Bi=null;return}(n=D.results)!=null&&n.frames.length&&(Bi=setInterval(()=>{if(!D.results){clearInterval(Bi),Bi=null;return}D.frame=(D.frame+1)%D.results.frames.length,An()},80))},"add-material":()=>{dt(),D.project.materials.push({name:"Custom dielectric "+D.project.materials.length,index:1.5,color:"#60bdaa"}),ot(),he("#dialog").close(),Rc()},help:()=>Cc("<h2>From Lumerical to TorchFDTD</h2><p>The workbench follows the familiar Objects Tree, CAD views, FDTD region and Layout / Analysis workflow.</p><ol><li>Add a Rectangle, Circle, Ring or Sphere from the Design ribbon.</li><li>Select an object in the tree or any viewport. Drag to move. Edit x, y, z, spans, material and mesh order in Object properties.</li><li>Select FDTD to set dimension, mesh, PML and simulation time steps.</li><li>Add a dipole or bidirectional sheet source and point time monitors.</li><li>Run on the connected solver. Inspect field snapshots, time traces and field spectra.</li><li>Switch to Layout to edit, or export JSON, Python and NPZ results.</li></ol><p><b>Shortcuts:</b> Ctrl+S save · Ctrl+O open · Ctrl+D duplicate · Delete remove · Ctrl+Z undo · Ctrl+Y redo · F fit.</p><p>This is an independent open-source workbench. The FSP inspector reads and edits .fsp settings through an installed, licensed Lumerical API. FSP → GPU independently imports a verified subset of layout settings and displays unsupported settings and numerical differences. Arbitrary FSP execution and .lsf execution remain unimplemented. See Supported combinations for the supported physics and execution modes. PMC cavities currently use point electric sources and point monitors. General material, port and boundary combinations remain under development.</p>")};function Nr(n){const e={rectangle:"structures",circle:"structures",ring:"structures",sphere:"structures",polygon:"structures",point:"sources",plane:"sources",tfsf:"sources",field:"monitors"};return n.map(t=>(t.id=crypto.randomUUID(),t.name+="_copy",t.center[0]+=.2,D.project[e[t.kind]||"monitors"].push(t),t))}function Lc(n){if(D.mode!=="layout")return;const e=[...D.project.structures,...D.project.sources,...D.project.monitors],t=n.map(s=>{var a;return(a=e.find(r=>r.id===s))==null?void 0:a.name}).filter(Boolean);if(!t.length)return;dt();const i=new Set(n);for(const s of["structures","sources","monitors"])D.project[s]=D.project[s].filter(a=>!i.has(a.id));ot(),Bn("fdtd"),tt(),lt(t.length===1?`Deleted ${t[0]}. Undo (Ctrl+Z) restores it.`:`Deleted ${t.length} objects.`)}function Dc(n){if(D.mode!=="layout")return;const e=D.project.structures,t=e.findIndex(s=>s.id===D.selected),i=t+n;t<0||i<0||i>=e.length||(dt(),[e[t],e[i]]=[e[i],e[t]],ot(),Bn(D.selected),tt())}document.addEventListener("click",async n=>{var t;const e=n.target.closest("button");if(!(!e||e.disabled||!D.project||!st))try{if(e.dataset.action&&await((t=Ts[e.dataset.action])==null?void 0:t.call(Ts,e)),e.dataset.add&&T0(e.dataset.add),e.dataset.select&&Bn(e.dataset.select,n.ctrlKey||n.metaKey),e.dataset.tab&&$n(e.dataset.tab),e.dataset.bottom&&Dd(e.dataset.bottom),e.dataset.plot&&(D.spectrum=e.dataset.plot==="spectrum",ni("[data-plot]").forEach(i=>i.classList.toggle("active",i===e)),An()),e.dataset.example){if(D.mode==="running")return;dt(),D.project=await bt("/examples/"+e.dataset.example),D.results=null,D.monitors=null,D.liveFrame=null,D.selected="fdtd",ot(),xn("layout"),$n("geometry"),qt(),st.fit(),tt(),lt("Opened example: "+D.project.name)}e.dataset.ribbon&&(ni("[data-ribbon]").forEach(i=>i.classList.toggle("active",i===e)),e.dataset.ribbon==="simulation"&&Bn("fdtd"),e.dataset.ribbon==="view"&&st.fit()),e.hasAttribute("data-close")&&he("#dialog").close()}catch(i){Pt(i.message),lt(i.message,"error")}});he("#file-input").onchange=async n=>{const e=n.target.files[0];if(e){if(e.name.toLowerCase().endsWith(".fsp")){n.target.value="",he("#dialog").close(),await Id.openFile(e);return}try{const t=JSON.parse(await e.text()),i=await bt("/validate",t);dt(),D.project=i.project,D.selected="fdtd",D.results=null,D.monitors=null,D.liveFrame=null,ot(),xn("layout"),$n("geometry"),qt(),st.fit(),tt(),he("#dialog").close(),lt("Opened "+e.name)}catch(t){Pt(t.message)}n.target.value=""}};he("#snap").onchange=n=>D.snap=n.target.checked;he("#frame-slider").oninput=n=>{D.frame=Number(n.target.value),An()};document.addEventListener("keydown",n=>{if(!D.project||!st||document.querySelector("dialog[open]")||["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName))return;const e=n.key.toLowerCase();n.ctrlKey&&["s","o","d","z","y","c","v"].includes(e)?(n.preventDefault(),Ts[{s:"save",o:"open",d:"duplicate",z:"undo",y:"redo",c:"copy",v:"paste"}[e]]()):n.key==="Delete"?Ts.delete():e==="f"&&st.fit()});he("#plot-monitor").onchange=n=>{D.plotMonitor=n.target.value,An()};he("#plot-axis").onchange=()=>An();window.addEventListener("resize",()=>{D.tab==="fields"&&An()});async function F0(){try{et=await bt("/health"),he(".version").textContent="DEVELOPMENT"+(et.version?" · "+et.version:""),he("#connection").innerHTML=`<span class="dot"></span>${et.cuda?Ie(et.gpu):"CPU solver"} <small>${Ie(et.hostname)}</small>`,he("#footer-device").textContent=et.cuda?"CUDA · "+et.gpu_memory_gb+" GB":"CPU";const n=localStorage.getItem("torchfdtd.project.v1");let e=null;try{n?(e=await bt("/validate",JSON.parse(n)),D.project=e.project):D.project=await bt("/examples/waveguide")}catch{D.project=await bt("/examples/waveguide")}D.maxRevision=D.project.revision||0,st=new Wv(he("#viewports"),D,Bn,v0,dt),qt(),xn("layout"),st.fit(),await tt(),lt("Connected to "+et.hostname+" · "+et.engine+"."),e&&(lt(`Recovered the autosaved project "${D.project.name}" at revision ${D.project.revision||0} from browser storage.`),e.stored_content_sha256_matches===!1&&lt("The autosaved project content does not match its stored content hash; it was changed outside the workbench.","warning")),lt("Select an object to edit. Add structures, configure FDTD and Run. Python and JSON use the same project model.");const t=localStorage.getItem("torchfdtd.activeJob");if(t)try{const i=await bt("/jobs/"+t);D.project=i.project,D.job=t,xn("running"),qt(),$n("fields"),Fa()}catch{localStorage.removeItem("torchfdtd.activeJob")}}catch(n){he("#connection").textContent="Solver unavailable",lt(n.message,"error"),Pt("Cannot connect to the solver. Start torchfdtd serve and reload.")}ns()}ni(".editable").forEach(n=>n.disabled=!0);he("#run-button").disabled=!0;F0();
