// ============================================================
//  JOSPIN 2002 - Scripts communs du site
//  Compatible Netscape 6 / Internet Explorer 5.5
// ============================================================

// --- Effet CRT : bande de balayage phosphore ---
(function() {
  var div = document.createElement('div');
  div.id = 'crt-sweep';
  document.body.appendChild(div);
})();

// --- Chargement progressif d'une image par tronçons haut->bas (simulation 56k) ---
function loadImageProgressively(imgEl, src) {
  // 3 ou 4 tronçons, tirage indépendant par image
  var numChunks = Math.random() < 0.5 ? 3 : 4;

  // Points de coupure aléatoires en pourcentage (1–98)
  var breaks = [];
  for (var j = 0; j < numChunks - 1; j++) {
    breaks.push(1 + Math.floor(Math.random() * 98));
  }
  breaks.sort(function(a, b) { return a - b; });

  // Dédoublonnage
  var uBreaks = [];
  for (var u = 0; u < breaks.length; u++) {
    if (u === 0 || breaks[u] !== breaks[u - 1]) uBreaks.push(breaks[u]);
  }

  // Liste des seuils de révélation (en % depuis le haut), se termine à 100
  var stops = uBreaks.concat([100]);

  // Masquer l'image dès maintenant, avant le chargement
  imgEl.style.clipPath = 'inset(0 0 100% 0)';

  imgEl.onload = function() {
    imgEl.onload = null;
    var delay = 0;
    for (var c = 0; c < stops.length; c++) {
      (function(pct, d) {
        setTimeout(function() {
          if (pct >= 100) {
            imgEl.style.clipPath = '';
          } else {
            imgEl.style.clipPath = 'inset(0 0 ' + (100 - pct) + '% 0)';
          }
        }, d);
      })(stops[c], delay);
      delay += 250 + Math.floor(Math.random() * 500);
    }
  };

  imgEl.src = src;
}

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
      if (imgSrcs[i]) loadImageProgressively(imgs[i], imgSrcs[i]);
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

// --- Footer commun : pied de page ---
function initFooter() {
  var placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;

  placeholder.innerHTML =
    '<table width="100%" border="0" cellpadding="6" cellspacing="0" bgcolor="#2C0818" id="pied-de-page">' +
      '<tr><td align="center">' +
        '<hr noshade size="2" color="#CC0000" width="780">' +
        '<font face="Arial" size="2" color="#CCCCCC">' +
          '<b>JOSPIN 2002</b> &mdash; Site Officiel de Campagne' +
          ' &mdash; <a href="mentions-legales.html" style="color:#FFFF99;">Mentions legales</a>' +
          ' &mdash; <a href="credits.html" style="color:#FFFF99;">Credits</a>' +
          ' &mdash; <a href="https://www.linkedin.com/in/fran%C3%A7ois-gognet-a61525152/" style="color:#FFFF99;">Contact</a>' +
        '</font>' +
        '<br>' +
        '<font face="Arial" size="1" color="#888888">' +
          '&copy; 2002 Parti Socialiste &mdash; Jospin2002 &mdash; Tous droits reserves' +
          ' &mdash; <a href="mailto:webmaster@jospin2002.fr" style="color:#FFFF99;">webmaster@jospin2002.fr</a>' +
          '<br>' +
          'Hebergement : <a href="http://www.wanadoo.fr" style="color:#FFFF99;">Wanadoo</a>' +
        '</font>' +
        '<br>' +
        '<font face="Arial" size="1" color="#666666">' +
          '<i>Site cree avec Microsoft FrontPage 2000 &mdash; Macromedia Flash 5 &mdash; Adobe Photoshop 6</i>' +
        '</font>' +
        '<br><br>' +
      '</td></tr>' +
    '</table>';
}

// --- Header commun : bandeau principal + ticker defilant ---
function initHeader() {
  var placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;

  var actuTexte = (typeof ACTU_TEXTE !== 'undefined' && ACTU_TEXTE)
    ? ACTU_TEXTE
    : '\u2605 JOSPIN PRESIDENT ! \u2605 La France est en ligne ! \u2605 Rejoignez la campagne sur le WEB \u2605';

  placeholder.innerHTML =
    '<table width="100%" border="0" cellpadding="0" cellspacing="0" id="bandeau-principal">' +
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
    '<table width="100%" border="0" cellpadding="0" cellspacing="0" id="bandeau-defilant" style="table-layout:fixed;">' +
      '<tr>' +
        '<td width="90" bgcolor="#CC0000" align="center">' +
          '<font face="Arial" size="2" color="#FFFFFF"><b>&nbsp;ACTU&nbsp;:&nbsp;</b></font>' +
        '</td>' +
        '<td width="710" bgcolor="#FFFF00" id="ticker-zone" style="overflow:hidden;padding:3px 0;">' +
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

// --- Detection du navigateur et alerte si non-IE ---
function initNavigateur() {
  var ua = navigator.userAgent;
  var nomNav = "Navigateur inconnu";
  var estIE = false;

  if (ua.indexOf("MSIE") != -1 || ua.indexOf("Trident") != -1) {
    nomNav = "Internet Explorer";
    estIE  = true;
  } else if (ua.indexOf("Opera") != -1) {
    nomNav = "Opera";
  } else if (ua.indexOf("Firefox") != -1) {
    nomNav = "Mozilla Firefox";
  } else if (ua.indexOf("Chrome") != -1) {
    nomNav = "Google Chrome";
  } else if (ua.indexOf("Safari") != -1) {
    nomNav = "Safari (Apple)";
  } else if (ua.indexOf("Netscape") != -1) {
    nomNav = "Netscape";
  }

  var el = document.getElementById('navigateur-nom');
  if (el) el.innerHTML = nomNav;

  var avert = document.getElementById('navigateur-avertissement');
  if (avert) {
    if (!estIE) {
      avert.innerHTML =
        '<br><font face="Arial" size="1" color="#CC0000"><b>&#9888; ATTENTION !</b><br>' +
        'Ce site est optimise pour<br><b>Internet Explorer</b>,<br>' +
        'le navigateur moderne<br>et rapide de Microsoft.<br>' +
        'Pour une navigation<br>optimale, utilisez IE !</font>';
    }
  }
}

// --- Execution immediate (script en fin de body, DOM pret) ---
initHeader();      // doit preceder initBasDebit (cree les elements #bandeau-*)
initFooter();      // doit preceder initBasDebit (cree l'element #pied-de-page)
initBasDebit();
initCliqueModem();
initCompteur(2847);
initNavRollover();
initTicker();      // apres initHeader, les elements ticker existent
initNavigateur();
