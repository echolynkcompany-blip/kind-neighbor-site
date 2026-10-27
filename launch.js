(()=>{
 const API='https://kind-neighbor-admin-production.up.railway.app';
 const form=document.getElementById('launch-form'),button=document.getElementById('join-launch'),status=document.getElementById('launch-status');
 if(!form)return;
 const clean=v=>typeof v==='string'&&/^[a-z0-9][a-z0-9_-]{0,79}$/.test(v)?v:'';
 let attribution={};
 try{
  const params=new URLSearchParams(window.location.search),source=clean(params.get('utm_source')),medium=clean(params.get('utm_medium')),campaign=clean(params.get('utm_campaign'));
  if(source&&medium&&campaign){attribution={source,medium,campaign};try{sessionStorage.setItem('kn_marketing_v1',JSON.stringify(attribution))}catch{}}
  else {try{const saved=JSON.parse(sessionStorage.getItem('kn_marketing_v1')||'{}');if(clean(saved.source)&&clean(saved.medium)&&clean(saved.campaign))attribution={source:saved.source,medium:saved.medium,campaign:saved.campaign}}catch{}}
 }catch{}
 let challengePromise,challengeTime=0,pending=false;
 function prepare(){challengeTime=Date.now();challengePromise=fetch(API+'/api/public/inquiry-challenge',{credentials:'omit',signal:AbortSignal.timeout(15000)}).then(async r=>{if(!r.ok)throw Error('Launch sign-up is temporarily unavailable. Please try again shortly.');const d=await r.json();await new Promise(resolve=>setTimeout(resolve,1600));return d.token});challengePromise.catch(()=>{});return challengePromise}
 prepare();
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(pending||!form.reportValidity())return;
  pending=true;button.disabled=true;form.setAttribute('aria-busy','true');status.className='form-status';status.textContent='Saving your priority booking request…';
  try{
   if(Date.now()-challengeTime>3300000)prepare();
   let challenge;try{challenge=await challengePromise}catch{challenge=await prepare()}
   const data=new FormData(form),payload={frequency:data.get('frequency'),hours:data.get('hours'),name:data.get('name'),email:data.get('email'),contact_consent:data.get('contact_consent'),company_website:data.get('company_website'),marketing:{...attribution,reported:data.get('heard_from')||''},challenge};
   const response=await fetch(API+'/api/public/priority-waitlist',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
   let result;try{result=await response.json()}catch{throw Error('We could not confirm your sign-up. Please try again shortly.')}
   if(!response.ok)throw Error(result.error||'We could not save your sign-up. Please try again.');
   form.reset();status.classList.add('success');status.textContent='Your place in our priority booking queue is saved. We’ll contact you in sign-up order when booking opens. We’ll arrange dates and times with you then. If you already joined, your original place is kept; email us for changes.';prepare();
  }catch(error){status.classList.add('error');status.textContent=error.name==='TimeoutError'||error.name==='AbortError'?'We could not confirm your sign-up in time. Your entries are still here; please try again.':error.message||'Unable to connect. Your entries are still here; please try again.'}
  finally{pending=false;button.disabled=false;form.removeAttribute('aria-busy')}
 });
})();

