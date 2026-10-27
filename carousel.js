(()=>{
 const root=document.querySelector('[data-neighbor-carousel]');if(!root)return;
 const track=root.querySelector('[data-story-track]'),slides=Array.from(root.querySelectorAll('[data-story]')),prev=root.querySelector('[data-story-prev]'),next=root.querySelector('[data-story-next]'),dots=Array.from(root.querySelectorAll('[data-story-go]')),status=root.querySelector('[data-story-status]');
 if(!track||!slides.length||!prev||!next||!status||dots.length!==slides.length)return;
 let current=0,scrollTimer;
 const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 function update(index){current=Math.max(0,Math.min(slides.length-1,index));prev.disabled=current===0;next.disabled=current===slides.length-1;dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===current)));status.textContent=(current+1)+' of '+slides.length+' · '+slides[current].dataset.title;}
 function go(index,instant=false){index=Math.max(0,Math.min(slides.length-1,index));update(index);track.scrollTo({left:slides[index].offsetLeft,behavior:instant||reduced()?'auto':'smooth'});}
 prev.addEventListener('click',()=>go(current-1));next.addEventListener('click',()=>go(current+1));dots.forEach((dot,i)=>dot.addEventListener('click',()=>go(i)));
 track.addEventListener('keydown',event=>{if(event.target!==track)return;const moves={ArrowLeft:current-1,ArrowRight:current+1,Home:0,End:slides.length-1};if(!Object.hasOwn(moves,event.key))return;event.preventDefault();go(moves[event.key]);});
 track.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{let nearest=0;slides.forEach((slide,i)=>{if(Math.abs(slide.offsetLeft-track.scrollLeft)<Math.abs(slides[nearest].offsetLeft-track.scrollLeft))nearest=i});update(nearest)},100)},{passive:true});
 window.addEventListener('resize',()=>go(current,true));
 root.classList.add('stories-enhanced');track.tabIndex=0;update(0);
})();
