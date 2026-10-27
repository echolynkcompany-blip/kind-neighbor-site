import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
function setup({ok=true,hold=false,search="",storage=new Map(),blockedStorage=false}={}){
 let submit,reset=0,requests=0,release,payload;const values={name:'TEST Browser',email:'browser@example.com',contact_consent:'Yes',company_website:'',frequency:'Weekly',hours:'2'};
 const form={querySelectorAll:()=>[],reportValidity:()=>true,addEventListener:(type,fn)=>submit=fn,reset:()=>reset++,setAttribute:()=>{},removeAttribute:()=>{}};
 const button={disabled:false},status={className:'',textContent:'',classList:{add:()=>{}}};
 const fetch=async (url,options)=>{if(url.endsWith('inquiry-challenge'))return {ok:true,json:async()=>({token:'test-challenge'})};requests++;payload=JSON.parse(options.body);if(hold)await new Promise(r=>release=r);return {ok,json:async()=>ok?{ok:true}:{error:'Please agree to receive launch updates.'}}};
 const context={window:{location:{search}},URLSearchParams,sessionStorage:{getItem:key=>{if(blockedStorage)throw Error();return storage.get(key)},setItem:(key,v)=>{if(blockedStorage)throw Error();storage.set(key,v)}},document:{getElementById:id=>({'launch-form':form,'join-launch':button,'launch-status':status})[id]},fetch,AbortSignal,Intl,FormData:class{get(key){return values[key]}},setTimeout:fn=>{fn();return 1},Date,Promise,Error};
 vm.runInNewContext(readFileSync(new URL('./launch.js',import.meta.url),'utf8'),context);
 return {get payload(){return payload},submit:()=>submit({preventDefault(){}}),button,status,get reset(){return reset},get requests(){return requests},release:()=>release()};
}
test('success clears fields and confirms queue priority with provisional times',async()=>{const x=setup();await x.submit();assert.equal(x.requests,1);assert.equal(x.reset,1);assert.equal(x.button.disabled,false);assert.match(x.status.textContent,/priority booking queue is saved/)});
test('server failure retains entries, shows error and permits retry',async()=>{const x=setup({ok:false});await x.submit();assert.equal(x.reset,0);assert.equal(x.button.disabled,false);assert.match(x.status.textContent,/Please agree/)});
test('double submission sends one request while pending',async()=>{const x=setup({hold:true});const first=x.submit();await new Promise(r=>setImmediate(r));assert.equal(x.button.disabled,true);await x.submit();assert.equal(x.requests,1);x.release();await first;assert.equal(x.reset,1)});


test('tagged campaign is sent and retained for this tab session',async()=>{const storage=new Map();const x=setup({search:'?utm_source=google_business_profile&utm_medium=organic&utm_campaign=opening_waitlist',storage});await x.submit();assert.equal(x.payload.marketing.source,'google_business_profile');const next=setup({storage});await next.submit();assert.equal(next.payload.marketing.campaign,'opening_waitlist')});
test('invalid tags are discarded and unavailable storage does not prevent signup',async()=>{const x=setup({search:'?utm_source=a%40b.com&utm_medium=social&utm_campaign=opening',blockedStorage:true});await x.submit();assert.equal(x.reset,1);assert.equal(x.payload.marketing.source,undefined)});
test('new complete tagged link replaces prior session attribution',async()=>{const storage=new Map([['kn_marketing_v1',JSON.stringify({source:'flyer',medium:'print',campaign:'old'})]]);const x=setup({storage,search:'?utm_source=facebook&utm_medium=social&utm_campaign=new'});await x.submit();assert.equal(x.payload.marketing.source,'facebook')});
