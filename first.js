var http = require('http');
var rawData = '';
const cron = require("node-cron");
const express = require("express");
const fs = require("fs");

function UpdateData(){
    http.get('http://data.fixer.io/api/latest?access_key=d476dd5c8d64f264e1c13eb95f316c90', (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
      
        let error;
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`);
        }
        if (error) {
          console.error(error.message);
          res.resume();
          return;
        }
        rawData = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            console.log("-----------Update Data----------");
          } catch (e) {
            console.error(e.message);
          }
        });
      }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
      });
}

UpdateData();

cron.schedule("* 1 * * *", () => {
    UpdateData();
  });

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(rawData);
}).listen(8080);