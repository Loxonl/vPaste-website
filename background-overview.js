(() => {
  const { catalog, artwork } = window.vpasteBackgroundStudies;
  const groups = [
    ["A / B · 替换原有线条", "Header、底部导航与主体均保持原样"],
    ["C / D · 在线条之外增加一层", "保留原线条与导航，增加图标或点阵"],
    ["E / F / G · 重构整个背景系统", "重做背景、Header 与底部导航，主体不变"],
  ];
  document.querySelector(".study-groups").innerHTML = groups.map(([title, description], group) => `<section class="study-group"><div class="study-group-heading"><h2>${title}</h2><p>${description}</p></div><div class="study-grid">${catalog.filter(c => c.group === group).map(c => `<article class="study-card" data-study-card="${c.id}"><a href="./?backdrop=${c.id}" aria-label="打开 ${c.id.toUpperCase()} ${c.zh}"><div class="study-thumbnail" data-family="${c.kind}" style="color:${c.color}">${artwork(c)}<div class="study-thumb-header"><b>vPaste</b><span>EN / 中 &nbsp; GitHub</span></div><div class="study-thumb-copy"><strong>剪贴捷径，<br />一键即达</strong><i></i><i></i></div><div class="study-thumb-app"><div></div>${"<i></i>".repeat(6)}</div><div class="study-thumb-nav">${"<i></i>".repeat(7)}</div></div><div class="study-card-title"><b>${c.id.toUpperCase()}</b><h3>${c.zh}</h3><span>↗</span></div><p>${c.note}</p></a><details><summary>128 位数字种子</summary><code>${c.seed}</code></details></article>`).join("")}</div></section>`).join("");
})();
