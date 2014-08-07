
function mapTiles(el) {
  var width = el.clientWidth;
  var height = el.clientHeight;
  var prefix = prefixMatch(['webkit', 'ms', 'Moz', 'O']);

  var tile = d3.geo.tile()
    .size([width, height]);

  var zoom = d3.behavior.zoom()
    .scale(1 << 12)
    .scaleExtent([1 << 10, 1 << 23])
    .translate([width / 2, height / 2])
    .on('zoom', zoomed);

  var projection = d3.geo.mercator()
    .scale(zoom.scale() / 2 / Math.PI)
    .translate([width / 2, height / 2]);

  var map = d3.select(el).append('div')
    .attr('class', 'map')
    .style('width', width + 'px')
    .style('height', height + 'px')
    .call(zoom);

  var layer = map.append('div')
    .attr('class', 'layer');

  function zoomed(is, it) {
    var s = is || zoom.scale();
    var t = it || zoom.translate();

    tile
      .scale(s)
      .translate(t);

    projection
      .scale(s / 2 / Math.PI)
      .translate(t);

    renderTiles(tile());
  }

  function bounds() {
    return {
      nw: projection.invert([ 0, 0 ]),
      se: projection.invert([ width, height ])
    };
  }

  function renderTiles(tiles) {
    var image = layer
      .style(prefix + 'transform', matrix3d(tiles.scale, tiles.translate))
      .selectAll('.tile')
      .data(tiles, function(d) {
        return d;
      });

    image.exit()
      .remove();

    image.enter().append('img')
      .attr('class', 'tile')
      .attr('src', function(d) {
        return 'http://' + ['a', 'b', 'c', 'd'][Math.random() * 4 | 0] +
          '.tiles.mapbox.com/v3/conveyal.gepida3i/' + d[2] + '/' + d[0] +
          '/' + d[1] + '.png';
      })
      .style('left', function(d) {
        return (d[0] << 8) + 'px';
      })
      .style('top', function(d) {
        return (d[1] << 8) + 'px';
      });
  }

  function zoomToLLBounds(nw, se) {
    var pnw = projection(nw);
    var pse = projection(se);

    var scale = zoom.scale();
    var translate = zoom.translate();
    var dx = pse[0] - pnw[0];
    var dy = pse[1] - pnw[1];

    scale = scale * (1 / Math.max(dx / width, dy / height));
    projection
      .translate([ width / 2, height / 2])
      .scale(scale / 2 / Math.PI);

    // reproject
    pnw = projection(nw);
    pse = projection(se);
    var x = (pnw[0] + pse[0]) / 2;
    var y = (pnw[1] + pse[1]) / 2;
    translate = [width - x, height - y];

    zoom
      .scale(scale)
      .translate(translate);

    zoomed(scale, translate);
  }

  function matrix3d(scale, translate) {
    var k = scale / 256,
      r = scale % 1 ? Number : Math.round;
    return 'matrix3d(' + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] *
      scale), r(translate[1] * scale), 0, 1] + ')';
  }

  function prefixMatch(p) {
    var i = -1,
      n = p.length,
      s = document.body.style;
    while (++i < n)
      if (p[i] + 'Transform' in s) return '-' + p[i].toLowerCase() + '-';
    return '';
  }

  zoomed();

  return {
    bounds: bounds,
    map: map,
    projection: projection,
    to: zoomToLLBounds,
    zoom: zoom
  };
}