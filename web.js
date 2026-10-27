(() => {
  const toast=(message)=>{const el=document.getElementById('web-toast');el.textContent=message;el.hidden=false;clearTimeout(window.travelToastTimer);window.travelToastTimer=setTimeout(()=>el.hidden=true,4500);};
  document.getElementById('share-experience').addEventListener('click',async()=>{
    const url=location.origin+location.pathname;
    try{if(navigator.share&&matchMedia('(pointer: coarse)').matches){await navigator.share({title:'慢游 · 旅行规划',text:'一起体验，把想去的地方安排成旅行。',url});return;}await navigator.clipboard.writeText(url);toast('体验链接已复制，可以发送给朋友了。');}
    catch(error){if(error.name!=='AbortError')prompt('复制这个链接，邀请朋友体验：',url);}
  });
})();
