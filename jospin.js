// ============================================================
//  JOSPIN 2002 - Scripts communs du site
//  Compatible Netscape 6 / Internet Explorer 5.5
// ============================================================

// --- Simulation connexion bas debit 56k ---
function initBasDebit() {
  function rand(base, spread) {
    return base + Math.floor(Math.random() * spread);
  }

  var sectionHeader  = document.getElementById('bandeau-principal');
  var sectionTicker  = document.getElementById('bandeau-defilant');
  var sectionContenu = document.getElementById('contenu-principal');
  var sectionPied    = document.getElementById('pied-de-page');

  if (!sectionHeader) return;

  // Stocker les src des images, puis les vider
  var imgs    = document.getElementsByTagName('img');
  var imgSrcs = [];
  for (var i = 0; i < imgs.length; i++) {
    imgSrcs[i] = imgs[i].getAttribute('src') || '';
    if (imgSrcs[i]) {
      imgs[i].src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }
  }

  // Delais aleatoires
  var t1 = rand(1800, 600);       // ~2s  : header + ticker
  var t2 = t1 + rand(900, 600);   // ~3s  : contenu
  var t3 = t2 + rand(900, 600);   // ~4s  : images + curseur

  // Etape 1 : header + ticker
  setTimeout(function() {
    if (sectionHeader) sectionHeader.style.display = 'table';
    if (sectionTicker) sectionTicker.style.display = 'table';
  }, t1);

  // Etape 2 : contenu + pied de page
  setTimeout(function() {
    if (sectionContenu) sectionContenu.style.display = 'table';
    if (sectionPied)    sectionPied.style.display    = 'table';
  }, t2);

  // Etape 3 : images + restaurer la classe bd-init
  setTimeout(function() {
    var imgs = document.getElementsByTagName('img');
    for (var i = 0; i < imgs.length; i++) {
      if (imgSrcs[i]) imgs[i].src = imgSrcs[i];
    }
    var b = document.body;
    b.className = b.className.replace(/\bbd-init\b/g, '').trim();
  }, t3);
}

// --- Interception des clics : son + sablier + delai de navigation ---
function initCliqueModem() {
  var audio = null;
  try {
    audio = new Audio('click.mp3');
    audio.preload = 'auto';
    audio.load();
  } catch(e) {
    console.log(e);
  }

  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el.nodeName !== 'A') {
      el = el.parentNode;
    }
    if (!el || el.nodeName !== 'A') return;

    var href = el.getAttribute('href');
    if (!href) return;
    // Ignorer mailto, javascript, ancres, et liens externes
    if (href.indexOf('mailto:') === 0) return;
    if (href.indexOf('javascript:') === 0) return;
    if (href.charAt(0) === '#') return;
    if (href.indexOf('http://') === 0 || href.indexOf('https://') === 0) return;

    // Son de clic immediat (avant preventDefault pour conserver le contexte user-gesture)
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(function() {});
    }

    e.preventDefault();

    // Sablier immediat
    document.body.style.cursor = 'wait';

    // Navigation differee (~2s)
    var dest = el.href;
    var delai = 1800 + Math.floor(Math.random() * 600);
    setTimeout(function() {
      window.location.href = dest;
    }, delai);
  });
}

// --- Compteur de visiteurs ---
function initCompteur(depart) {
  var compteurEl = document.getElementById('num-visiteur');
  if (!compteurEl) return;
  var nbVisiteurs = depart || 2847;

  function formaterCompteur(n) {
    var s = '0000000' + n;
    s = s.slice(-7);
    return s.slice(0, 3) + '\u00a0' + s.slice(3);
  }

  setInterval(function() {
    if (Math.random() < 0.15) {
      nbVisiteurs++;
      compteurEl.innerHTML = formaterCompteur(nbVisiteurs);
    }
  }, 4000);
}

// --- Rollover Flash sur les cellules de navigation ---
function initNavRollover() {
  var cellules = document.getElementsByClassName('cellule-nav');
  for (var i = 0; i < cellules.length; i++) {
    cellules[i].onmouseover = function() {
      this.style.backgroundColor = '#FF6600';
    };
    cellules[i].onmouseout = function() {
      this.style.backgroundColor = '#BB0000';
    };
  }
}

// --- Execution immediate (script en fin de body, DOM pret) ---
initBasDebit();
initCliqueModem();
initCompteur(2847);
initNavRollover();
