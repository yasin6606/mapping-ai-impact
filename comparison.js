/* No chart libraries or live API calls: the checked snapshot works offline. */
(function () {
  'use strict';
  var root = document.documentElement;
  var key = 'insights-theme';
  try {
    var saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (_) { /* Themes still work when storage is unavailable. */ }
  function syncTheme() {
    var dark = root.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.theme-toggle').forEach(function (button) {
      button.textContent = dark ? '☀' : '☾';
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }
  syncTheme();
  document.querySelectorAll('.theme-toggle').forEach(function (button) {
    button.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(key, next); } catch (_) {}
      syncTheme();
    });
  });

  var sortControl = document.getElementById('bar-order');
  if (sortControl) sortControl.addEventListener('change', function () {
    var groups = Array.from(document.querySelectorAll('.country-bar'));
    groups.sort(function (a, b) {
      return sortControl.value === 'name'
        ? a.dataset.country.localeCompare(b.dataset.country)
        : Number(b.dataset.value) - Number(a.dataset.value);
    });
    groups.forEach(function (group, index) {
      group.setAttribute('transform', 'translate(0,' + index * 45 + ')');
      group.parentNode.appendChild(group);
    });
  });

  // Inserted from the validated source rows by the preparation script.
  var rows = [{"country": "France", "year": 2025, "intensity": 41.44, "fossil": 5.149304, "renewables": 26.064074, "nuclear": 68.78663, "wind": 8.156427, "solar": 5.582652, "hydro": 10.423173, "coal": 0.3052739, "gas": 3.026422}, {"country": "Germany", "year": 2025, "intensity": 329.65, "fossil": 40.907547, "renewables": 59.09245, "nuclear": 0.0, "wind": 27.18045, "solar": 17.907167, "hydro": 3.9083261, "coal": 20.610626, "gas": 16.518473}, {"country": "Italy", "year": 2025, "intensity": 284.78, "fossil": 51.224022, "renewables": 48.77597, "nuclear": 0.0, "wind": 8.114846, "solar": 16.860596, "hydro": 15.753683, "coal": 1.4091424, "gas": 47.24216}, {"country": "Netherlands", "year": 2025, "intensity": 253.56, "fossil": 45.84321, "renewables": 51.20035, "nuclear": 2.9564314, "wind": 24.970362, "solar": 21.117367, "hydro": 0.037048012, "coal": 7.0761704, "gas": 34.89182}, {"country": "Spain", "year": 2025, "intensity": 153.6, "fossil": 25.36038, "renewables": 55.858135, "nuclear": 18.781479, "wind": 20.410572, "solar": 21.848621, "hydro": 11.372399, "coal": 0.3195665, "gas": 21.556845}, {"country": "Sweden", "year": 2025, "intensity": 35.26, "fossil": 1.2184405, "renewables": 71.1909, "nuclear": 27.590649, "wind": 22.787184, "solar": 2.5950441, "hydro": 39.974224, "coal": 0.0, "gas": 0.06443676}];
  var categories = ['fossil', 'renewables', 'nuclear'];
  function squareCounts(row) {
    var total = categories.reduce(function (sum, k) { return sum + row[k]; }, 0);
    var values = categories.map(function (k) { return row[k] / total * 100; });
    var counts = values.map(Math.floor);
    var missing = 100 - counts.reduce(function (a, b) { return a + b; }, 0);
    var rank = [0, 1, 2].sort(function (a, b) {
      return (values[b] - counts[b]) - (values[a] - counts[a]) || a - b;
    });
    rank.slice(0, missing).forEach(function (i) { counts[i] += 1; });
    return counts;
  }
  var waffleCountry = document.getElementById('waffle-country');
  if (waffleCountry) waffleCountry.addEventListener('change', function (event) {
    var row = rows.find(function (r) { return r.country === event.target.value; });
    if (!row) return;
    var counts = squareCounts(row);
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 310 310');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', row.country + ': 100 squares representing the generation mix');
    var title = document.createElementNS(ns, 'title');
    title.textContent = row.country + ': electricity generation mix, 2025';
    svg.appendChild(title);
    var index = 0;
    categories.forEach(function (category, i) {
      for (var n = 0; n < counts[i]; n += 1) {
        var square = document.createElementNS(ns, 'rect');
        square.setAttribute('x', 10 + (index % 10) * 29);
        square.setAttribute('y', 10 + Math.floor(index / 10) * 29);
        square.setAttribute('width', 25);
        square.setAttribute('height', 25);
        square.setAttribute('class', 'cmp-' + category);
        svg.appendChild(square);
        index += 1;
      }
    });
    document.getElementById('waffle-grid').replaceChildren(svg);
    var summary = document.getElementById('waffle-summary');
    var heading = document.createElement('h3');
    heading.textContent = row.country + ' · 2025';
    summary.replaceChildren(heading);
    categories.forEach(function (category, i) {
      var p = document.createElement('p');
      var value = document.createElement('strong');
      value.textContent = row[category].toFixed(2) + '%';
      p.append(value, ' ' + category + ' (' + counts[i] + (counts[i] === 1 ? ' square)' : ' squares)'));
      summary.appendChild(p);
    });
  });
})();
