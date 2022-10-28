function waitUntilLoaded(t){setTimeout((()=>{document.querySelector(".loading-container")?waitUntilLoaded(t):t()}),100)}function isTranslationPage(){return window.location.href.startsWith("https://www.bilibilicomics.com/tracer/#/translate-editor")}function getDialogRejectButton(t,{delay:e=500}={}){const n=document.querySelector(".p-dialog-footer .p-button.p-confirm-dialog-reject");if(n||!(e>0))return t(n);setTimeout((()=>{getDialogRejectButton(t,{delay:e-100})}),100)}function waitUntilCancel(t){getDialogRejectButton((e=>{e&&e.click(),waitUntilLoaded(t)}))}function run(){const t=document.querySelector(".image-card");t?t.classList.contains("actived")?go():(t.click(),waitUntilCancel(go)):alert("Please refresh the page.")}function getContainer(t){const e=document.querySelector(".operation-content");e?t(e):setTimeout((()=>{getContainer(t)}),100)}function addButton(){if(document.querySelector('div[data-name="gm-wc"]'))return;const t=document.createElement("div");t.innerHTML="Wc",t.dataset.name="gm-wc",t.style.width="40px",t.style.height="40px",t.style.display="flex",t.style.flexFlow="row nowrap",t.style.alignItems="center",t.style.justifyContent="center",t.style.cursor="pointer",t.style.order=2,t.classList.add("editor-button"),t.classList.add("p-ripple"),t.addEventListener("click",(t=>{confirm("Do you want to count words? ⚠️ Any unsaved changes will be lost.")&&run()})),getContainer((e=>{e.prepend(t)}))}function main(){isTranslationPage()&&addButton()}function next(){document.querySelector(".bottom-action").childNodes[1].childNodes[2].click()}function download(t,e){const n=document.createElement("a");n.href=encodeURI("data:text/csv;charset=utf-8,"+t),n.target="_blank",n.download=`${e} (⌚).csv`,document.body.appendChild(n),n.click()}function downloadFile({sources:t,translations:e}={}){const n=document.querySelector(".episode-title").textContent;let o="Page⌚ZH⌚EN\n";const a={zh:0,en:0};for(let n=0;n<e.length;n++){const c=e[n],i=t[n],r=Math.max(c.length,i.length);for(let t=0;t<r;t++){const e=c[t],r=i[t],l=e.split("\n"),s=r.split("\n"),d=Math.max(l.length,s.length);for(let e=0;e<d;e++){const c=e<l.length?l[e]:"",i=e<s.length?s[e]:"";o+=`${n+1}-${t+1}⌚${i}⌚${c}\n`,a.zh+=match(i,/[\p{sc=Han}]{1}/gu),a.zh+=match(i,/\w+/g),a.en+=match(c,/\w+/g)}}}o+=`⌚${a.zh}⌚${a.en}\n`,confirm(`${n}: ${a.zh} (Chinese), ${a.en} (English). Press OK to download a summary.`)&&download(o,n)}function match(t,e){const n=t.match(e);return n?n.length:0}function getImageCards(){return Array.from(document.querySelectorAll(".image-card"))}function hasMore(){const t=getImageCards();return t.length>0&&!t[t.length-1].classList.contains("actived")}function go({sources:t=[],translations:e=[]}={}){const n=[],o=[];Array.from(document.querySelectorAll('textarea:not([disabled=""]).target-input')).forEach((t=>{n.push(t.value)})),e.push(n),Array.from(document.querySelectorAll('textarea:not([disabled=""]).source-input')).forEach((t=>{o.push(t.value)})),t.push(o);const a={sources:t,translations:e};hasMore()?(next(),waitUntilLoaded((()=>{go(a)}))):downloadFile(a)}main();
