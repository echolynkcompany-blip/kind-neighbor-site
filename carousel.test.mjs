import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
function setup(reduced=false){
 const listeners=new Map(),calls=[],classes=new Set();let resize,timer;
 const control=()=>({disabled:false,attrs:{},addEventListener(type,fn){this[type]=fn},setAttribute(k,v){this.attrs[k]=v}});
 const prev=control(),next=control(),dots=Array.from({length:4},control),status={textContent:''};
 const slides=['Connection','Home','Outings','Planning'].map((title,i)=>({dataset:{title},offsetLeft:i*500}));
 const track={scrollLeft:0,addEventListener:(name,fn)=>listeners.set(name,fn),scrollTo:x=>{calls.push(x);track.scrollLeft=x.left}};
 const root={classList:{add:x=>classes.add(x)},querySelector:s=>({'[data-story-track]':track,'[data-story-prev]':prev,'[data-story-next]':next,'[data-story-status]':status})[s],querySelectorAll:s=>s==='[data-story]'?slides:dots};
 vm.runInNewContext(readFileSync(new URL('./carousel.js',import.meta.url),'utf8'),{document:{querySelector:()=>root},window:{matchMedia:()=>({matches:reduced}),addEventListener:(name,fn)=>resize=fn},setTimeout:fn=>{timer=fn;return 1},clearTimeout:()=>{timer=undefined}});
 return {prev,next,dots,status,slides,track,calls,classes,key:(key,target=track)=>{let prevented=false;listeners.get('keydown')({key,target,preventDefault(){prevented=true}});return prevented},swipe:left=>{track.scrollLeft=left;listeners.get('scroll')();timer()},resize:()=>resize()};
}
test('manual navigation, direct story choices and boundary controls stay consistent',()=>{
 const x=setup();assert.equal(x.calls.length,0);assert.equal(x.prev.disabled,true);assert.equal(x.next.disabled,false);assert.match(x.status.textContent,/1 of 4/);
 x.next.click();assert.equal(x.calls.at(-1).left,500);assert.equal(x.dots[1].attrs['aria-current'],'true');assert.equal(x.prev.disabled,false);
 x.dots[3].click();assert.equal(x.next.disabled,true);assert.match(x.status.textContent,/Planning/);x.prev.click();assert.equal(x.calls.at(-1).left,1000);assert.equal(x.dots.filter(d=>d.attrs['aria-current']==='true').length,1);
});
test('keyboard navigation works without intercepting keys from links inside stories',()=>{
 const x=setup();assert.equal(x.key('End'),true);assert.equal(x.next.disabled,true);x.key('Home');assert.equal(x.prev.disabled,true);x.key('ArrowRight');assert.equal(x.calls.at(-1).left,500);assert.equal(x.key('ArrowRight',{}),false);assert.equal(x.key('Tab'),false);
});
test('swipe position updates controls and reduced motion and resize avoid animated scroll',()=>{
 const x=setup(true);x.swipe(1040);assert.equal(x.dots[2].attrs['aria-current'],'true');x.next.click();assert.equal(x.calls.at(-1).behavior,'auto');
 x.slides.forEach((s,i)=>s.offsetLeft=i*320);x.resize();assert.equal(x.calls.at(-1).left,960);assert.equal(x.calls.at(-1).behavior,'auto');assert.equal(x.classes.has('stories-enhanced'),true);
});
