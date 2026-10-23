'use strict';
let installPrompt = null;
const appLink = new URL('./', window.location.href).href;
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; });
window.addEventListener('appinstalled', () => { installPrompt = null; });
function openInstallHelp() {
 const dialog=document.getElementById('install-help');
 const ua=navigator.userAgent;
 const ios=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 const wechat=/MicroMessenger/i.test(ua);
 const standalone=navigator.standalone||window.matchMedia('(display-mode: standalone)').matches;
 let tip,steps;
 if(standalone){
  tip='已经从桌面打开啦！把链接发给同学，一起告别选餐困难。';
  steps=['点下方「复制」，将链接发给同学。','同学打开后，也可以添加到自己的桌面。'];
 }else if(wechat){
  tip='微信里可以直接选餐；添加到桌面需要先用手机浏览器打开。';
  steps=['点微信右上角「···」。',ios?'选择「在 Safari 中打开」，或复制下方链接到 Safari。':'选择「在浏览器打开」。',ios?'点 Safari 的分享按钮，选「添加到主屏幕」，如出现「作为网页 App 打开」请开启，最后点「添加」。':'在浏览器菜单中选择「安装应用」或「添加到主屏幕」。'];
 }else if(ios){
  tip='用 Safari 打开本页，几步就能在桌面找到吃啥呀。';
  steps=['点 Safari 的分享按钮（方框向上箭头，可能位于「···」菜单内）。','选择「添加到主屏幕」。','如出现「作为网页 App 打开」请开启，再点「添加」。'];
 }else if(/Android/i.test(ua)){
  tip='安卓手机也可以添加到桌面，和同学共用同一个链接。';
  steps=['在浏览器菜单中选择「安装应用」或「添加到主屏幕」。','按提示确认，以后点桌面图标就能打开。'];
 }else{
  tip='把下方链接发到手机上，iPhone 和安卓都能用。';
  steps=['iPhone：用 Safari 打开，点分享，再选「添加到主屏幕」。','安卓：用浏览器打开，在菜单中选「安装应用」或「添加到主屏幕」。'];
 }
 document.getElementById('install-device-tip').textContent=tip;
 document.getElementById('install-steps').replaceChildren(...steps.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
 document.getElementById('share-link').value=appLink;
 document.getElementById('native-install').hidden=!installPrompt;
 if(!dialog.open)dialog.showModal();
}
function closeInstallHelp(){document.getElementById('install-help').close();}
async function installAndroid(){
 if(!installPrompt)return;
 await installPrompt.prompt();const choice=await installPrompt.userChoice;installPrompt=null;
 document.getElementById('native-install').hidden=true;
 if(choice.outcome==='accepted')closeInstallHelp();
}
async function copyAppLink(){
 try{await navigator.clipboard.writeText(appLink);toast('链接已复制，发给同学吧');}
 catch{openInstallHelp();const field=document.getElementById('share-link');field.focus();field.select();field.setSelectionRange(0,field.value.length);toast('长按链接，选择复制');}
}
async function shareApp(){
 if(navigator.share){
  try{await navigator.share({title:'吃啥呀 · 阳江校区吃饭指南',text:'不知道吃什么？让吃啥呀帮你决定！苹果和安卓都能用。',url:appLink});return;}
  catch(error){if(error.name==='AbortError')return;}
 }
 await copyAppLink();
}
document.addEventListener('DOMContentLoaded',()=>{
 document.getElementById('install-help').addEventListener('click',event=>{
  if(event.target!==event.currentTarget)return;const r=event.currentTarget.getBoundingClientRect();
  if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeInstallHelp();
 });
});
if('serviceWorker' in navigator&&window.isSecureContext){
 window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>{});});
}
