const copyButton=document.querySelector('#copy-email');
copyButton.addEventListener('click',async()=>{
 const status=document.querySelector('#copy-status');
 try{await navigator.clipboard.writeText('gilbertkilakiga02@gmail.com');status.textContent='Email address copied.';}
 catch{status.textContent='Select and copy the email address below.';const range=document.createRange();range.selectNodeContents(document.querySelector('.email'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);}
});
let certificates=[],filter='All';const grid=document.querySelector('#certificates'),search=document.querySelector('#search'),viewer=document.querySelector('#viewer');
function render(){const query=search.value.trim().toLowerCase();const list=certificates.filter(c=>(filter==='All'||c.category===filter)&&`${c.title} ${c.issuer}`.toLowerCase().includes(query));grid.replaceChildren();document.querySelector('#certificate-count').textContent=`${list.length} of ${certificates.length} certificates`;for(const c of list){const article=document.createElement('article');article.className='certificate';const imageButton=document.createElement('button');imageButton.className='cert-image';imageButton.setAttribute('aria-label',`View ${c.title}`);const img=document.createElement('img');img.src=c.preview;img.alt=`${c.title} certificate`;img.loading='lazy';imageButton.append(img);imageButton.onclick=()=>openCertificate(c);const info=document.createElement('div');info.className='cert-info';const issuer=document.createElement('span');issuer.className='tiny-label';issuer.textContent=c.issuer;const title=document.createElement('h3');title.textContent=c.title;const detail=document.createElement('p');detail.textContent=c.date||'Course / professional development';const button=document.createElement('button');button.textContent='View certificate ↗';button.onclick=()=>openCertificate(c);info.append(issuer,title,detail,button);article.append(imageButton,info);grid.append(article);}if(!list.length){const p=document.createElement('p');p.textContent='No certificates match. Try another search or category.';grid.append(p);}}
function openCertificate(c){document.querySelector('#viewer-title').textContent=c.title;const img=document.querySelector('#viewer-image');img.src=c.preview;img.alt=`Full certificate: ${c.title}`;document.querySelector('#original').href=c.file;document.querySelector('#download').href=c.file;document.querySelector(".viewer-canvas").classList.remove("zoomed");document.querySelector("#zoom-certificate").textContent="Zoom in +";document.querySelector("#zoom-certificate").setAttribute("aria-pressed","false");viewer.showModal();}document.querySelector('#close-viewer').onclick=()=>viewer.close();viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});render();});search.addEventListener('input',render);fetch('assets/certificates.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{certificates=data;render();}).catch(()=>{document.querySelector('#certificate-count').textContent='Certificates could not load. Please refresh the page.';});

const zoomButton=document.querySelector('#zoom-certificate');
zoomButton.addEventListener('click',()=>{const zoomed=document.querySelector('.viewer-canvas').classList.toggle('zoomed');zoomButton.setAttribute('aria-pressed',String(zoomed));zoomButton.textContent=zoomed?'Fit to screen −':'Zoom in +';});
const heartButton=document.querySelector('#heart-button');
const heartCount=document.querySelector('#heart-count'),counterStatus=document.querySelector('#counter-status');
let heartPending=false;
function setHeart(data){heartButton.setAttribute('aria-pressed',String(data.active));heartButton.setAttribute('aria-label',data.active?'Remove your heart':'Leave a heart');heartCount.textContent=new Intl.NumberFormat().format(data.count);}
async function updateHearts(active){
 if(heartPending)return;heartPending=true;heartButton.disabled=true;
 try{
  const options={cache:'no-store',credentials:'same-origin'};
  if(typeof active==='boolean'){options.method='POST';options.headers={'Content-Type':'application/json'};options.body=JSON.stringify({active});}
  const response=await fetch('api/hearts',options);if(!response.ok)throw Error();
  const data=await response.json();if(!Number.isSafeInteger(data.count)||data.count<0||typeof data.active!=='boolean')throw Error();
  setHeart(data);counterStatus.textContent='Hearts from visitors';
  if(typeof active==='boolean')document.querySelector('#heart-status').textContent=data.active?'Thank you for being here!':'Your heart has been removed.';
 }catch{counterStatus.textContent='The shared counter is currently unavailable. Please try again later.';}
 finally{heartPending=false;heartButton.disabled=false;}
}
heartButton.addEventListener('click',()=>updateHearts(heartButton.getAttribute('aria-pressed')!=='true'));
updateHearts();
