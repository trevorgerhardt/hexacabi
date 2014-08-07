#!/usr/bin/env node

var fs = require('fs');
var xml = require('node-xml-lite');

var data = xml.parseFileSync(process.argv[2]);
var stations = data.childs;
var json = {};

for (var i = 0; i < stations.length; i++) {
  var s = stations[i].childs;
  var terminalName = parseInt(s[2].childs[0]);

  json[terminalName] = {
    coords: [
      parseFloat(s[5].childs[0]),
      parseFloat(s[4].childs[0])
    ],
    id: parseInt(s[0].childs[0]),
    name: s[1].childs[0],
    terminal: terminalName
  };
}

fs.writeFileSync(process.argv[3], JSON.stringify(json, null, '\t'), { encoding: 'utf8' });
