document.getElementById('year').textContent = new Date().getFullYear();
// Create a form at formspree.io, then replace the placeholder with your actual endpoint.
const FORM_ENDPOINT = 'REPLACE_WITH_YOUR_FORMSPREE_ENDPOINT';
const form = document.getElementById('inquiry-form');
const statusBox = document.getElementById('form-status');
const submitButton = document.getElementById('submit-inquiry');
if (form) form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusBox.className = 'form-status';
  statusBox.textContent = '';
  if (!form.reportValidity()) return;
  if (!form.querySelector('input[name="services"]:checked')) {
    statusBox.classList.add('error');
    statusBox.textContent = 'Please select at least one service, or Not sure yet.';
    return;
  }
  if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(FORM_ENDPOINT)) {
    statusBox.classList.add('error');
    statusBox.textContent = 'The inquiry form is not connected yet. Please check back soon.';
    return;
  }
  submitButton.disabled = true;
  statusBox.textContent = 'Sending your request…';
  try {
    const data = new FormData(form);
    const services = data.getAll('services');
    data.delete('services');
    data.set('services', services.join(', '));
    const response = await fetch(FORM_ENDPOINT, { method:'POST', body:data, headers:{Accept:'application/json'} });
    if (!response.ok) throw new Error('Form submission failed');
    form.reset();
    statusBox.classList.add('success');
    statusBox.textContent = 'Thank you! Your inquiry was sent. We will contact you about your request.';
  } catch {
    statusBox.classList.add('error');
    statusBox.textContent = 'We could not send your request. Please try again later.';
  } finally {
    submitButton.disabled = false;
  }
});