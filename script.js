(function(){
  const grid = document.getElementById('grid');
  const cards = Array.from(grid.querySelectorAll('.card'));
  const filters = Array.from(document.querySelectorAll('.filter-btn'));
  const modal = document.getElementById('modal');
  const videoWrap = document.getElementById('videoWrap');
  const modalTitle = document.getElementById('modalTitle');
  const closeBtn = document.getElementById('closeModal');

  // FILTER FUNCTION
  function setFilter(cat){
    filters.forEach(f => 
      f.classList.toggle('active', f.dataset.filter === cat)
    );

    cards.forEach(card => {
      const cats = (card.dataset.cat || '').split(/\s+/);
      if(cat === 'all' || cats.includes(cat)){
        card.style.display = '';  
      } else {
        card.style.display = 'none';
      }
    });
  }

  // FILTER BUTTON CLICK EVENTS
  filters.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const cat = btn.dataset.filter;
      setFilter(cat);
    });
  });

  // OPEN VIDEO MODAL
  function openPreview(videoUrl, title){
    let src = videoUrl;

    // Convert watch?v= links → embed/ links
    const ytMatch = src.match(/v=([^&]+)/);
    if(ytMatch){
      src = 'https://www.youtube.com/embed/' + ytMatch[1] + '?autoplay=1&rel=0';
    } 
    else if(src.includes('youtube.com/embed/')){
      src = src + '?autoplay=1&rel=0';
    }

    videoWrap.innerHTML = `
      <iframe 
        src="${src}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;

    modalTitle.textContent = title || 'Preview';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');

    document.body.style.overflow = 'hidden';
  }

  // CLOSE MODAL
  function closePreview(){
    videoWrap.innerHTML = '';
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');

    document.body.style.overflow = '';
  }

  // CARD CLICK EVENTS
  cards.forEach(card => {
    const videoUrl = card.dataset.video;
    const title = card.dataset.title || 'Preview';

    card.addEventListener('click', e => {
      e.preventDefault();
      openPreview(videoUrl, title);
    });

    // Keyboard support
    card.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){
        openPreview(videoUrl, title);
        e.preventDefault();
      }
    });
  });

  // CLOSE BUTTON
  closeBtn.addEventListener('click', closePreview);

  // CLICK OUTSIDE MODAL
  modal.addEventListener('click', e => {
    if(e.target === modal) closePreview();
  });

  // ESC KEY
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') closePreview();
  });

  // INITIAL FILTER
  setFilter('all');

})();
