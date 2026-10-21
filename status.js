// Waka Quest status page: reads status.json (what the owner writes: a disruption, maintenance, past notices) and the
// automatic checks (data/state.json, data/days.json, from scripts/check.mjs), in six languages. No cookies, no tracking.
(function () {
  const T = {
    nl: { name: 'Nederlands', langLabel: 'Taal', why: 'Beleef wat ons verbindt', kicker: 'Status van Waka Quest',
      okT: 'Alles werkt', okL: 'Waki heeft alles nagelopen: de app, de linkpagina en het zaakportaal werken.',
      badT: 'We zijn ermee bezig', badL: 'Een deel van Waka Quest werkt nu niet goed. We weten ervan en werken aan een oplossing.',
      maintT: 'Gepland onderhoud', maintL: 'We maken Waka Quest nog beter. Het kan even duren voor alles weer werkt.',
      planned: 'Gepland onderhoud', parts: 'Onderdelen', past: 'Eerdere meldingen', legOk: 'werkt', legBad: 'storing', legNone: 'geen meting', legDays: '90 dagen, oudste links',
      stOk: 'Werkt', stBad: 'Storing', stNone: 'Nog geen meting', pct: '{p}% beschikbaar', today: 'vandaag', ago90: '90 dagen geleden',
      checked: 'Laatst gecontroleerd: {t}', late: 'De automatische controle is later dan normaal; de status kan verouderd zijn.', never: 'nog niet',
      helpTitle: 'Vragen?', helpText: 'Je voortgang staat veilig op je telefoon. De wandeling en de verhalen werken ook zonder internet zodra je de app eerder hebt geopend.',
      chat: 'chat met ons via waka-quest.com/links', backup: 'Werkt deze pagina niet? Probeer ook:', from: 'van', until: 'tot',
      close: 'Waka Quest. Beleef wat ons verbindt. Ontdek wat ons bijzonder maakt.',
      parts_: { app: ['Waka Dag en Waka Nacht', 'de app op waka-quest.com'], links: ['Linkpagina', 'waka-quest.com/links'], zaak: ['Zaakportaal en aanmelden', 'voor partners'], data: ['Database en passen', 'voortgang, passen, berichten'] } },
    en: { name: 'English', langLabel: 'Language', why: 'Experience what connects us', kicker: 'Waka Quest status',
      okT: 'All systems working', okL: 'Waki checked everything: the app, the link page and the business portal work.',
      badT: 'We are on it', badL: 'Part of Waka Quest is not working properly right now. We know about it and are working on a fix.',
      maintT: 'Planned maintenance', maintL: 'We are making Waka Quest even better. It may take a little while before everything works again.',
      planned: 'Planned maintenance', parts: 'Components', past: 'Earlier notices', legOk: 'working', legBad: 'disruption', legNone: 'no data', legDays: '90 days, oldest on the left',
      stOk: 'Working', stBad: 'Disruption', stNone: 'Not measured yet', pct: '{p}% available', today: 'today', ago90: '90 days ago',
      checked: 'Last checked: {t}', late: 'The automatic check is later than usual; the status may be out of date.', never: 'not yet',
      helpTitle: 'Questions?', helpText: 'Your progress is safe on your phone. The walk and the stories also work without internet once you have opened the app before.',
      chat: 'chat with us via waka-quest.com/links', backup: 'Is this page not working? Also try:', from: 'from', until: 'until',
      close: 'Waka Quest. Experience what connects us. Discover what makes us special.',
      parts_: { app: ['Waka Dag and Waka Nacht', 'the app at waka-quest.com'], links: ['Link page', 'waka-quest.com/links'], zaak: ['Business portal and sign-up', 'for partners'], data: ['Database and passes', 'progress, passes, messages'] } },
    es: { name: 'Español', langLabel: 'Idioma', why: 'Vive lo que nos une', kicker: 'Estado de Waka Quest',
      okT: 'Todo funciona', okL: 'Waki lo revisó todo: la app, la página de enlaces y el portal de negocios funcionan.',
      badT: 'Estamos en ello', badL: 'Una parte de Waka Quest no funciona bien ahora. Lo sabemos y estamos trabajando en una solución.',
      maintT: 'Mantenimiento programado', maintL: 'Estamos mejorando Waka Quest. Puede tardar un poco hasta que todo vuelva a funcionar.',
      planned: 'Mantenimiento programado', parts: 'Componentes', past: 'Avisos anteriores', legOk: 'funciona', legBad: 'incidencia', legNone: 'sin datos', legDays: '90 días, los más antiguos a la izquierda',
      stOk: 'Funciona', stBad: 'Incidencia', stNone: 'Aún sin medir', pct: '{p}% disponible', today: 'hoy', ago90: 'hace 90 días',
      checked: 'Última revisión: {t}', late: 'La revisión automática va con retraso; el estado puede no estar al día.', never: 'aún no',
      helpTitle: '¿Preguntas?', helpText: 'Tu progreso está seguro en tu teléfono. El paseo y las historias también funcionan sin internet si ya abriste la app antes.',
      chat: 'chatea con nosotros en waka-quest.com/links', backup: '¿No funciona esta página? Prueba también:', from: 'de', until: 'hasta',
      close: 'Waka Quest. Vive lo que nos une. Descubre lo que nos hace especiales.',
      parts_: { app: ['Waka Dag y Waka Nacht', 'la app en waka-quest.com'], links: ['Página de enlaces', 'waka-quest.com/links'], zaak: ['Portal de negocios y registro', 'para socios'], data: ['Base de datos y pases', 'progreso, pases, mensajes'] } },
    fr: { name: 'Français', langLabel: 'Langue', why: 'Vis ce qui nous relie', kicker: 'État de Waka Quest',
      okT: 'Tout fonctionne', okL: 'Waki a tout vérifié : l’appli, la page de liens et le portail des établissements fonctionnent.',
      badT: 'Nous nous en occupons', badL: 'Une partie de Waka Quest ne fonctionne pas bien en ce moment. Nous le savons et travaillons à une solution.',
      maintT: 'Maintenance prévue', maintL: 'Nous améliorons Waka Quest. Cela peut prendre un peu de temps avant que tout fonctionne à nouveau.',
      planned: 'Maintenance prévue', parts: 'Éléments', past: 'Avis précédents', legOk: 'fonctionne', legBad: 'panne', legNone: 'pas de mesure', legDays: '90 jours, les plus anciens à gauche',
      stOk: 'Fonctionne', stBad: 'Panne', stNone: 'Pas encore mesuré', pct: '{p} % disponible', today: 'aujourd’hui', ago90: 'il y a 90 jours',
      checked: 'Dernière vérification : {t}', late: 'La vérification automatique est en retard ; l’état n’est peut-être pas à jour.', never: 'pas encore',
      helpTitle: 'Des questions ?', helpText: 'Ta progression est en sécurité sur ton téléphone. La balade et les histoires fonctionnent aussi sans internet si tu as déjà ouvert l’appli.',
      chat: 'écris-nous via waka-quest.com/links', backup: 'Cette page ne fonctionne pas ? Essaie aussi :', from: 'du', until: 'au',
      close: 'Waka Quest. Vis ce qui nous relie. Découvre ce qui nous rend uniques.',
      parts_: { app: ['Waka Dag et Waka Nacht', 'l’appli sur waka-quest.com'], links: ['Page de liens', 'waka-quest.com/links'], zaak: ['Portail des établissements et inscription', 'pour les partenaires'], data: ['Base de données et pass', 'progression, pass, messages'] } },
    pt: { name: 'Português', langLabel: 'Idioma', why: 'Viva o que nos une', kicker: 'Status do Waka Quest',
      okT: 'Tudo funcionando', okL: 'O Waki conferiu tudo: o app, a página de links e o portal de empresas estão funcionando.',
      badT: 'Estamos cuidando disso', badL: 'Uma parte do Waka Quest não está funcionando bem agora. Já sabemos e estamos trabalhando numa solução.',
      maintT: 'Manutenção programada', maintL: 'Estamos deixando o Waka Quest ainda melhor. Pode levar um tempinho até tudo voltar a funcionar.',
      planned: 'Manutenção programada', parts: 'Componentes', past: 'Avisos anteriores', legOk: 'funcionando', legBad: 'falha', legNone: 'sem dados', legDays: '90 dias, os mais antigos à esquerda',
      stOk: 'Funcionando', stBad: 'Falha', stNone: 'Ainda não medido', pct: '{p}% disponível', today: 'hoje', ago90: 'há 90 dias',
      checked: 'Última verificação: {t}', late: 'A verificação automática está atrasada; o status pode estar desatualizado.', never: 'ainda não',
      helpTitle: 'Dúvidas?', helpText: 'Seu progresso está seguro no seu celular. O passeio e as histórias também funcionam sem internet depois que você já abriu o app.',
      chat: 'fale com a gente em waka-quest.com/links', backup: 'Esta página não funciona? Tente também:', from: 'de', until: 'até',
      close: 'Waka Quest. Viva o que nos une. Descubra o que nos torna especiais.',
      parts_: { app: ['Waka Dag e Waka Nacht', 'o app em waka-quest.com'], links: ['Página de links', 'waka-quest.com/links'], zaak: ['Portal de empresas e cadastro', 'para parceiros'], data: ['Banco de dados e passes', 'progresso, passes, mensagens'] } },
    zh: { name: '中文', langLabel: '语言', why: '体验将我们相连的一切', kicker: 'Waka Quest 运行状态',
      okT: '一切正常', okL: 'Waki 已全部检查过：应用、链接页面和商家门户都运行正常。',
      badT: '我们正在处理', badL: 'Waka Quest 的部分功能目前无法正常使用。我们已经知道，正在修复。',
      maintT: '计划维护', maintL: '我们正在让 Waka Quest 变得更好。可能需要一点时间才能全部恢复。',
      planned: '计划维护', parts: '组成部分', past: '以往通知', legOk: '正常', legBad: '故障', legNone: '无数据', legDays: '90 天，最早的在左边',
      stOk: '正常', stBad: '故障', stNone: '尚未检测', pct: '可用率 {p}%', today: '今天', ago90: '90 天前',
      checked: '上次检查：{t}', late: '自动检查比平时晚，状态可能不是最新的。', never: '尚未',
      helpTitle: '有问题？', helpText: '你的进度安全地保存在你的手机上。只要之前打开过应用，步行路线和故事在没有网络时也能使用。',
      chat: '通过 waka-quest.com/links 与我们聊天', backup: '这个页面打不开？也可以试试：', from: '从', until: '到',
      close: 'Waka Quest。体验将我们相连的一切，发现让我们与众不同的一切。',
      parts_: { app: ['Waka Dag 和 Waka Nacht', 'waka-quest.com 上的应用'], links: ['链接页面', 'waka-quest.com/links'], zaak: ['商家门户与注册', '面向合作伙伴'], data: ['数据库与通行证', '进度、通行证、消息'] } },
  };
  const LANGS = Object.keys(T);
  const q = new URLSearchParams(location.search).get('lang');
  let lang = [q, (navigator.languages || [navigator.language || 'nl']).map(l => String(l).slice(0, 2)).find(l => LANGS.includes(l)), 'nl'].find(l => LANGS.includes(l));
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const tr = v => (v && typeof v === 'object' ? v[lang] || v.en || v.nl || '' : v || '');
  const fmt = (d, opt) => new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : lang === 'zh' ? 'zh-CN' : lang, { timeZone: 'America/Paramaribo', ...opt }).format(new Date(d));
  const when = d => fmt(d, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const get = f => fetch(f + '?t=' + Date.now(), { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)).catch(() => null);
  let S = null, ST = null, D = null, CFG = null;

  function paint() {
    const t = T[lang];
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang === 'zh' ? 'zh-Hans' : lang;
    document.querySelectorAll('[data-t]').forEach(e => { if (t[e.dataset.t]) e.textContent = t[e.dataset.t]; });
    // the components, from the checks (a component is down when one of its checks failed on two runs in a row)
    const comps = [...new Set((CFG?.checks || []).map(c => c.component))];
    const now = Date.now();
    const inMaint = (S?.maintenance || []).find(m => new Date(m.from) <= now && now < new Date(m.until));
    const down = comps.filter(c => CFG.checks.filter(k => k.component === c).some(k => (ST?.checks?.[k.id]?.fails || 0) >= 2));
    const mode = S?.mode === 'maintenance' || inMaint ? 'maint' : S?.mode === 'incident' || down.length ? 'bad' : 'ok';
    $('hero').className = 'hero ' + mode;
    $('title').textContent = t[mode === 'maint' ? 'maintT' : mode + 'T'];
    $('lead').textContent = t[mode === 'maint' ? 'maintL' : mode + 'L'];
    const msg = tr(inMaint?.message) || (S?.mode !== 'ok' ? tr(S?.message) : '');
    $('msg').hidden = !msg; $('msg').textContent = msg;
    // planned maintenance (now or later)
    const planned = (S?.maintenance || []).filter(m => new Date(m.until) > now);
    $('planned').hidden = !planned.length;
    $('planned-list').innerHTML = planned.map(m => `<li><span class="when">${esc(when(m.from))} – ${esc(when(m.until))}</span>${esc(tr(m.message))}</li>`).join('');
    // the components with their 90 days
    const dayKey = i => new Date(now - 3 * 3600e3 - i * 864e5).toISOString().slice(0, 10);
    $('parts').innerHTML = comps.map(c => {
      const ks = CFG.checks.filter(k => k.component === c), measured = ks.some(k => ST?.checks?.[k.id]);
      const bad = down.includes(c), cls = !measured ? 'none' : bad ? 'bad' : 'ok';
      let okSum = 0, allSum = 0;
      const bars = Array.from({ length: 90 }, (_, i) => {
        const k = dayKey(89 - i); let o = 0, a = 0;
        for (const x of ks) { const cell = D?.[x.id]?.[k]; if (cell) { o += cell[0]; a += cell[1]; } }
        okSum += o; allSum += a;
        const r = a ? o / a : null, c2 = r === null ? '' : r >= 0.999 ? 'ok' : r >= 0.9 ? 'part' : 'bad';
        return `<i class="${c2}" title="${esc(k)}${a ? ' · ' + Math.round(r * 1000) / 10 + '%' : ''}"></i>`;
      }).join('');
      const [name, sub] = t.parts_[c] || [c, ''];
      const p = allSum ? (Math.floor(okSum / allSum * 1000) / 10).toString().replace('.', lang === 'en' || lang === 'zh' ? '.' : ',') : null;
      return `<li><div class="row"><i class="d ${cls}"></i><b>${esc(name)}</b><span class="st ${cls}">${t[cls === 'ok' ? 'stOk' : cls === 'bad' ? 'stBad' : 'stNone']}</span></div>
        <p class="sub">${esc(sub)}</p><div class="bars" aria-hidden="true">${bars}</div>
        <p class="pct"><span>${t.ago90}</span><span>${p ? t.pct.replace('{p}', p) : ''}</span><span>${t.today}</span></p></li>`;
    }).join('');
    const at = ST?.checkedAt;
    $('checked').textContent = t.checked.replace('{t}', at ? when(at) : t.never) + (at && now - new Date(at) > 45 * 60e3 ? ' · ' + t.late : '');
    // earlier notices
    const past = S?.history || [];
    $('past').hidden = !past.length;
    $('past-list').innerHTML = past.map(h => `<li><span class="when">${esc(fmt(h.date, { day: 'numeric', month: 'long', year: 'numeric' }))}</span><b>${esc(tr(h.title))}</b><br>${esc(tr(h.text))}</li>`).join('');
  }

  const sel = $('lang');
  sel.innerHTML = LANGS.map(l => `<option value="${l}">${T[l].name}</option>`).join('');
  sel.value = lang;
  sel.addEventListener('change', () => { lang = sel.value; paint(); });
  async function load() {
    [S, ST, D, CFG] = await Promise.all([get('status.json'), get('data/state.json'), get('data/days.json'), get('checks.json')]);
    CFG ||= { checks: [] };
    paint();
  }
  load(); setInterval(load, 120e3);
})();
