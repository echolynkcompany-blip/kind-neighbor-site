const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
const API = 'https://kind-neighbor-admin-production.up.railway.app';
const form = document.getElementById('inquiry-form');
const statusBox = document.getElementById('form-status');
const submitButton = document.getElementById('submit-inquiry');
let referral = 'website';
try {
 if (new URLSearchParams(location.search).get('utm_source') === 'google_business_profile') sessionStorage.setItem('kn_referral','google_business_profile');
 referral = sessionStorage.getItem('kn_referral') || 'website';
} catch {}
let challengePromise, challengeTime = 0, pending = false;
function prepareChallenge() {
 challengeTime = Date.now();
 challengePromise = fetch(API+'/api/public/inquiry-challenge',{credentials:'omit',signal:AbortSignal.timeout(15000)})
  .then(async r=>{if(!r.ok)throw Error('The inquiry service is temporarily unavailable. Please try again shortly.');const d=await r.json();await new Promise(resolve=>setTimeout(resolve,1600));return d.token;});
 // Handle a background failure; submitting will retry.
 challengePromise.catch(()=>{});
 return challengePromise;
}
prepareChallenge();
if (form) form.addEventListener('submit', async event => {
 event.preventDefault();
 if (pending) return;
 statusBox.className = 'form-status';
 statusBox.textContent = '';
 if (!form.reportValidity()) return;
 if (!form.querySelector('input[name="services"]:checked')) {
  statusBox.classList.add('error');statusBox.textContent='Please select at least one service, or Not sure yet.';return;
 }
 pending=true;form.setAttribute('aria-busy','true');submitButton.disabled=true;statusBox.textContent='Sending your request…';
 try {
  if(Date.now()-challengeTime>3300000)prepareChallenge();
  let challenge;
  try {challenge=await challengePromise;} catch {challenge=await prepareChallenge();}
  const data=new FormData(form),payload=Object.fromEntries(data);
  payload.services=data.getAll('services');
  payload.challenge=challenge;
  payload.referral_source=referral;
  const response=await fetch(API+'/api/public/inquiries',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
  const result=await response.json();
  if(!response.ok)throw Error(result.error||'We could not send your inquiry. Please try again.');
  form.reset();statusBox.classList.add('success');
  statusBox.textContent='Thank you! Your inquiry was received. We will contact you to discuss services and availability. Your visit is not booked yet.';
  prepareChallenge();
 } catch(error) {
  statusBox.classList.add('error');statusBox.textContent=(error.name==='TimeoutError'||error.name==='AbortError')?'We could not confirm receipt in time. Please call us before resubmitting to avoid a duplicate request.':error.message||'We could not send your inquiry. Your entries are still here; please try again.';
 } finally {pending=false;form.removeAttribute('aria-busy');submitButton.disabled=false;}
});
