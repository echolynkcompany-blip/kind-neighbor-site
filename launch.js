(()=>{
 const API='https://kind-neighbor-admin-production.up.railway.app';
 const form=document.getElementById('launch-form'),button=document.getElementById('join-launch'),status=document.getElementById('launch-status');
 if(!form)return;
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 form.querySelectorAll('input[type=date]').forEach(input=>input.min=today);
 let challengePromise,challengeTime=0,pending=false;
 function prepare(){challengeTime=Date.now();challengePromise=fetch(API+'/api/public/inquiry-challenge',{credentials:'omit',signal:AbortSignal.timeout(15000)}).then(async r=>{if(!r.ok)throw Error('Launch sign-up is temporarily unavailable. Please try again shortly.');const d=await r.json();await new Promise(resolve=>setTimeout(resolve,1600));return d.token});challengePromise.catch(()=>{});return challengePromise}
 prepare();
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(pending||!form.reportValidity())return;
  pending=true;button.disabled=true;form.setAttribute('aria-busy','true');status.className='form-status';status.textContent='Saving your priority booking request…';
  try{
   if(Date.now()-challengeTime>3300000)prepare();
   let challenge;try{challenge=await challengePromise}catch{challenge=await prepare()}
   const data=new FormData(form),preferences=[1,2,3].map(n=>({date:data.get('date'+n),time:data.get('time'+n)})).filter(p=>p.date||p.time);
   if(preferences.some(p=>!p.date||!p.time))throw Error('Choose both a date and start time for each preference you use.');
   const payload={preferences,frequency:data.get('frequency'),hours:data.get('hours'),name:data.get('name'),email:data.get('email'),contact_consent:data.get('contact_consent'),company_website:data.get('company_website'),challenge};
   const response=await fetch(API+'/api/public/priority-waitlist',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
   let result;try{result=await response.json()}catch{throw Error('We could not confirm your sign-up. Please try again shortly.')}
   if(!response.ok)throw Error(result.error||'We could not save your sign-up. Please try again.');
   form.reset();status.classList.add('success');status.textContent='Your place in our priority booking queue is saved. We’ll contact you in sign-up order when booking opens. Requested dates and times are subject to confirmation after opening. If you already joined, your original place and preferences are kept; email us for changes.';prepare();
  }catch(error){status.classList.add('error');status.textContent=error.name==='TimeoutError'||error.name==='AbortError'?'We could not confirm your sign-up in time. Your entries are still here; please try again.':error.message||'Unable to connect. Your entries are still here; please try again.'}
  finally{pending=false;button.disabled=false;form.removeAttribute('aria-busy')}
 });
})();
