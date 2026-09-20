
(() => {
  const fill = document.getElementById('progressFill');
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    fill.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  };
  addEventListener('scroll', update, {passive:true});
  addEventListener('resize', update);
  update();

  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, {threshold:.08, rootMargin:'0px 0px -40px 0px'});
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('visible'));
  }

  document.querySelectorAll('details').forEach(d => {
    d.addEventListener('toggle', () => {
      const s = d.querySelector('summary span');
      if (s) s.textContent = d.open ? '−' : '+';
    });
  });
})();
