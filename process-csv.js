#!/usr/bin/env node

var fs = require('fs');
var Progress = require('progress');
var split = require('split');

var readStream = fs.createReadStream(process.argv[2], { encoding: 'utf8' });
var writeStream = fs.createWriteStream(process.argv[3], { encoding: 'utf8' });

/**
 * Write the headings
 */

writeStream.write([
  'duration',
  'start_time',
  'start_station',
  'end_time',
  'end_station',
  'bike'
].join(','));

/**
 * Progress Bar
 */

var bar = new Progress(':bar', { total: 405983 });
var first = true;

/**
 * Pipe! pipe!
 */

readStream
  .pipe(split())
  .on('data', function(line) {
    if (first) {
      first = false;
      return;
    }

    var data = [];
    line = line.split(',');

    // Length of journey in seconds
    data.push(stringToSeconds(line[0])); // Column 0 has the duration

    // Start / End times in seconds from epoch
    data.push(Date.parse(line[1])); // Column 1 has the time
    data.push(line[3]); // Column 3 has the start "terminal"

    data.push(Date.parse(line[4])); // Column 4 has the end time
    data.push(line[6]); // Column 6 has the end "terminal"

    data.push(line[7]); // Bike number

    writeStream.write('\n' + data.join(','), 'utf8', function() {
      bar.tick();

      if (bar.complete) process.exit();
    });
  }).on('error', function(e) {
    console.error(e);
    process.exit(1);
  });

function stringToSeconds(s) {
  s = s.split(' ')
  return (parseInt(s[0]) * 60 * 60) + (parseInt(s[1]) * 60) + parseInt(s[2]);
}
