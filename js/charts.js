/* Group Insights – D3 chart helpers
   Charts use CSS classes for styling; no inline SVG styles. */

(function (global) {
  'use strict';

  function themeColors() {
    var dark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
    return {
      text: dark ? '#94a3b8' : '#64748b',
      heading: dark ? '#e2e8f0' : '#1e293b',
      grid: dark ? 'rgba(148,163,184,0.25)' : 'rgba(100,116,139,0.25)',
      teal: dark ? '#2dd4bf' : '#0d9488',
      coral: dark ? '#f97316' : '#ea580c',
      area: dark ? 'rgba(45,212,191,0.15)' : 'rgba(13,148,136,0.12)'
    };
  }

  function clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  /** Line chart: historical + projection (Q1) */
  function drawGrowthLine(containerId, data) {
    var el = document.getElementById(containerId);
    if (!el || !window.d3) return;
    clear(el);
    var c = themeColors();
    var margin = { top: 24, right: 28, bottom: 40, left: 52 };
    var width = Math.min(680, el.clientWidth || 680) - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;

    var svg = d3.select(el).append('svg')
      .attr('class', 'svg-chart d3-chart')
      .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
      .attr('role', 'img');

    var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.scaleLinear().domain(d3.extent(data, function (d) { return d.year; })).range([0, width]);
    var y = d3.scaleLinear().domain([0, d3.max(data, function (d) { return d.twh; }) * 1.08]).nice().range([height, 0]);

    g.append('g').attr('class', 'grid-y')
      .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''))
      .selectAll('line').attr('stroke', c.grid).attr('stroke-dasharray', '4 4');
    g.select('.grid-y').select('.domain').remove();

    g.append('g').attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).ticks(data.length).tickFormat(d3.format('d')))
      .selectAll('text').attr('fill', c.text).attr('font-size', 11);
    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text').attr('fill', c.text).attr('font-size', 11);

    var hist = data.filter(function (d) { return !d.projected; });
    var proj = data.filter(function (d) { return d.projected; });
    if (hist.length && proj.length) proj = [hist[hist.length - 1]].concat(proj);

    var line = d3.line().x(function (d) { return x(d.year); }).y(function (d) { return y(d.twh); }).curve(d3.curveMonotoneX);
    var area = d3.area().x(function (d) { return x(d.year); }).y0(height).y1(function (d) { return y(d.twh); }).curve(d3.curveMonotoneX);

    g.append('path').datum(hist).attr('class', 'area-path').attr('d', area).attr('fill', c.area);
    g.append('path').datum(hist).attr('class', 'line-path').attr('d', line).attr('fill', 'none').attr('stroke', c.teal).attr('stroke-width', 2.6);
    if (proj.length > 1) {
      g.append('path').datum(proj).attr('class', 'line-path').attr('d', line)
        .attr('fill', 'none').attr('stroke', c.coral).attr('stroke-width', 2.4).attr('stroke-dasharray', '6 4');
    }

    g.selectAll('.dot-hist').data(hist).enter().append('circle')
      .attr('class', 'dot').attr('cx', function (d) { return x(d.year); }).attr('cy', function (d) { return y(d.twh); })
      .attr('r', 4).attr('fill', c.teal);
  }

  /** Horizontal bars */
  function drawHBars(containerId, data, valueKey, labelKey) {
    var el = document.getElementById(containerId);
    if (!el || !window.d3) return;
    clear(el);
    var c = themeColors();
    var margin = { top: 8, right: 48, bottom: 28, left: 110 };
    var width = Math.min(680, el.clientWidth || 680) - margin.left - margin.right;
    var height = Math.max(180, data.length * 36) - margin.top - margin.bottom;

    var svg = d3.select(el).append('svg')
      .attr('class', 'svg-chart d3-chart')
      .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom));

    var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    var y = d3.scaleBand().domain(data.map(function (d) { return d[labelKey]; })).range([0, height]).padding(0.25);
    var x = d3.scaleLinear().domain([0, d3.max(data, function (d) { return d[valueKey]; }) * 1.1]).range([0, width]);

    g.selectAll('.bar').data(data).enter().append('rect')
      .attr('class', function (d, i) { return i === 0 ? 'bar bar-accent' : 'bar'; })
      .attr('y', function (d) { return y(d[labelKey]); })
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', function (d) { return x(d[valueKey]); })
      .attr('fill', function (d, i) { return i === 0 ? c.coral : c.teal; });

    g.selectAll('.bar-label').data(data).enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', function (d) { return x(d[valueKey]) + 6; })
      .attr('y', function (d) { return y(d[labelKey]) + y.bandwidth() / 2; })
      .attr('dy', '0.35em')
      .attr('fill', c.heading)
      .attr('font-size', 12)
      .text(function (d) { return d[valueKey]; });

    g.append('g').call(d3.axisLeft(y).tickSize(0))
      .selectAll('text').attr('fill', c.heading).attr('font-size', 12);
    g.select('.domain').attr('stroke', c.grid);
  }

  /** Simple grouped vertical bars for scenarios */
  function drawScenarioBars(containerId, data) {
    var el = document.getElementById(containerId);
    if (!el || !window.d3) return;
    clear(el);
    var c = themeColors();
    var margin = { top: 20, right: 16, bottom: 40, left: 48 };
    var width = Math.min(680, el.clientWidth || 680) - margin.left - margin.right;
    var height = 280 - margin.top - margin.bottom;

    var svg = d3.select(el).append('svg')
      .attr('class', 'svg-chart d3-chart')
      .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom));

    var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    var x = d3.scaleBand().domain(data.map(function (d) { return d.name; })).range([0, width]).padding(0.3);
    var y = d3.scaleLinear().domain([0, d3.max(data, function (d) { return d.twh; }) * 1.1]).nice().range([height, 0]);

    g.append('g').attr('class', 'grid-y')
      .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''))
      .selectAll('line').attr('stroke', c.grid).attr('stroke-dasharray', '4 4');
    g.select('.domain').remove();

    g.selectAll('.bar').data(data).enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function (d) { return x(d.name); })
      .attr('width', x.bandwidth())
      .attr('y', function (d) { return y(d.twh); })
      .attr('height', function (d) { return height - y(d.twh); })
      .attr('fill', function (d) { return d.accent ? c.coral : c.teal; });

    g.selectAll('.bar-label').data(data).enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', function (d) { return x(d.name) + x.bandwidth() / 2; })
      .attr('y', function (d) { return y(d.twh) - 6; })
      .attr('text-anchor', 'middle')
      .attr('fill', c.heading)
      .attr('font-size', 11)
      .text(function (d) { return d.twh; });

    g.append('g').attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text').attr('fill', c.text).attr('font-size', 11);
    g.append('g').call(d3.axisLeft(y).ticks(5))
      .selectAll('text').attr('fill', c.text).attr('font-size', 11);
  }

  global.InsightsCharts = {
    drawGrowthLine: drawGrowthLine,
    drawHBars: drawHBars,
    drawScenarioBars: drawScenarioBars,
    themeColors: themeColors
  };
})(window);
