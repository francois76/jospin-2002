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

// --- Header commun : bandeau principal + ticker defilant ---
function initHeader() {
  var placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;

  var actuTexte = (typeof ACTU_TEXTE !== 'undefined' && ACTU_TEXTE)
    ? ACTU_TEXTE
    : '\u2605 JOSPIN PRESIDENT ! \u2605 La France est en ligne ! \u2605 Rejoignez la campagne sur le WEB \u2605';

  placeholder.innerHTML =
    '<table width="800" border="0" cellpadding="0" cellspacing="0" id="bandeau-principal">' +
      '<tr>' +
        '<td width="140" bgcolor="#5C1030" align="center" valign="middle">' +
          '<img src="ps.png" alt="Parti Socialiste" style="max-height:80px;max-width:120px;" border="0"><br>' +
          '<font face="Arial" size="1" color="#FFAACC">PARTI SOCIALISTE</font><br><br>' +
        '</td>' +
        '<td width="520" align="center" valign="middle" bgcolor="#CC0000">' +
          '<br>' +
          '<font face="Arial Black,Impact,Arial" size="7" color="#FFFFFF"><b>LIONEL JOSPIN</b></font><br>' +
          '<font face="Arial" size="3" color="#FFFF00"><b><i>Candidat a la Presidence de la Republique</i></b></font><br>' +
          '<font face="Arial" size="2" color="#FFCCCC">Election Presidentielle Fran\u00e7aise \u2014 Avril 2002</font>' +
          '<br><br>' +
        '</td>' +
        '<td width="140" bgcolor="#5C1030" align="center" valign="middle">' +
          '<br>' +
          '<span class="etoile-clignote">\u2605</span>' +
          '<span class="etoile-clignote" style="animation-delay:0.3s">\u2605</span>' +
          '<span class="etoile-clignote" style="animation-delay:0.6s">\u2605</span><br>' +
          '<font face="Arial" size="1" color="#FFAACC">VOTEZ JOSPIN</font><br>' +
          '<span class="etoile-clignote" style="animation-delay:0.9s">\u2605</span>' +
          '<span class="etoile-clignote" style="animation-delay:0.15s">\u2605</span>' +
          '<span class="etoile-clignote" style="animation-delay:0.45s">\u2605</span>' +
          '<br><br>' +
        '</td>' +
      '</tr>' +
    '</table>' +
    '<table width="800" border="0" cellpadding="0" cellspacing="0" id="bandeau-defilant">' +
      '<tr>' +
        '<td width="90" bgcolor="#CC0000" align="center">' +
          '<font face="Arial" size="2" color="#FFFFFF"><b>&nbsp;ACTU&nbsp;:&nbsp;</b></font>' +
        '</td>' +
        '<td bgcolor="#FFFF00" id="ticker-zone" style="overflow:hidden;padding:3px 0;">' +
          '<span id="ticker-texte" style="display:inline-block;white-space:nowrap;' +
          'font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#CC0000;font-weight:bold;">' +
          actuTexte +
          '</span>' +
        '</td>' +
      '</tr>' +
    '</table>';
}

// --- Animation du ticker defilant (remplace marquee) ---
function initTicker() {
  var zone  = document.getElementById('ticker-zone');
  var texte = document.getElementById('ticker-texte');
  if (!zone || !texte) return;

  // 710 = 800 (largeur site) - 90 (etiquette ACTU) ; fallback si element cache
  var ZONE_FALLBACK = 710;
  var pos   = ZONE_FALLBACK;
  var speed = 1.5;                // pixels par frame (~90px/s a 60fps)

  function tick() {
    pos -= speed;
    var zoneW  = zone.offsetWidth  || ZONE_FALLBACK;
    var texteW = texte.offsetWidth || texte.scrollWidth || 400;
    if (pos < -texteW) {
      pos = zoneW;                // recommence depuis la droite
    }
    texte.style.transform = 'translateX(' + pos + 'px)';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// --- Execution immediate (script en fin de body, DOM pret) ---
initHeader();      // doit preceder initBasDebit (cree les elements #bandeau-*)
initBasDebit();
initCliqueModem();
initCompteur(2847);
initNavRollover();
initTicker();      // apres initHeader, les elements ticker existent
