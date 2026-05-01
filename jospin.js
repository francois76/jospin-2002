// ============================================================
//  JOSPIN 2002 - Scripts communs du site
//  Compatible Netscape 6 / Internet Explorer 5.5
// ============================================================

// --- Intro Flash : suppression automatique ---
function initIntro() {
  var introEl = document.getElementById('flash-intro');
  if (!introEl) return;

  var btnSkip = document.getElementById('btn-skip');

  setTimeout(function() {
    if (btnSkip) btnSkip.style.display = 'inline-block';
  }, 2000);

  setTimeout(function() {
    finIntro();
  }, 4500);
}

function skipIntro() {
  finIntro();
}

function finIntro() {
  var introEl = document.getElementById('flash-intro');
  if (!introEl) return;
  introEl.classList.add('fade-out');
  setTimeout(function() {
    introEl.style.display = 'none';
  }, 700);
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

// --- Initialisation au chargement ---
window.onload = function() {
  initIntro();
  initCompteur(2847);
  initNavRollover();
};
