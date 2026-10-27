(()=>{
 const API='https://kind-neighbor-admin-production.up.railway.app';
 const form=document.getElementById('launch-form'),button=document.getElementById('join-launch'),status=document.getElementById('launch-status');
 if(!form)return;
 let challengePromise,challengeTime=0,pending=false;
 function prepare(){challengeTime=Date.now();challengePromise=fetch(API+'/api/public/inquiry-challenge',{credentials:'omit',signal:AbortSignal.timeout(15000)}).then(async r=>{if(!r.ok)throw Error('Launch sign-up is temporarily unavailable. Please try again shortly.');const d=await r.json();await new Promise(resolve=>setTimeout(resolve,1600));return d.token});challengePromise.catch(()=>{});return challengePromise}
 prepare();
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(pending||!form.reportValidity())return;
  pending=true;button.disabled=true;form.setAttribute('aria-busy','true');status.className='form-status';status.textContent='Adding you to launch updates…';
  try{
   if(Date.now()-challengeTime>3300000)prepare();
   let challenge;try{challenge=await challengePromise}catch{challenge=await prepare()}
   const data=new FormData(form),payload={name:data.get('name'),email:data.get('email'),contact_consent:data.get('contact_consent'),company_website:data.get('company_website'),challenge};
   const response=await fetch(API+'/api/public/launch-list',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
   let result;try{result=await response.json()}catch{throw Error('We could not confirm your sign-up. Please try again shortly.')}
   if(!response.ok)throw Error(result.error||'We could not save your sign-up. Please try again.');
   form.reset();status.classList.add('success');status.textContent='Thank you! You’re on our launch list. We’ll email you updates and let you know when booking opens. No visit has been reserved.';prepare();
  }catch(error){status.classList.add('error');status.textContent=error.name==='TimeoutError'||error.name==='AbortError'?'We could not confirm your sign-up in time. Your entries are still here; please try again.':error.message||'Unable to connect. Your entries are still here; please try again.'}
  finally{pending=false;button.disabled=false;form.removeAttribute('aria-busy')}
 });
})();
