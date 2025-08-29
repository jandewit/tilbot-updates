//const fs = require('fs');
const LineByLine = require('n-readlines');
const csvdb = require('csv-database');

class CsvData {

    db = null;
    filename = '';

    constructor() {

    }

    async initialize(filename, p) {
        // Retrieve the columns from the first row of the CSV file
        let csvfile = new LineByLine(p + '/var/' + filename);
        let firstline = csvfile.next();
        let firstlineutf = firstline.toString('utf8').replace("\r", "").replace(/[\u0000-\u001F\u007F-\u009F\u200B\u200C\uFEFF]/g, "");
        let cols = firstlineutf.split(';');

        // Set up the CSV database
        this.db = await csvdb(p + '/var/' + filename, cols, ";");
    }

    async get(col, val = '') {
        console.log(val + 'heyj');
        console.log(this.db);
        if (this.db !== null) {
            if (val == '') {
                let out = [];
                let res = await this.db.get();
                console.log('== res ==');
                console.log(res);
                if (res.length > 0 && res[0][col] !== undefined) {
                    res.forEach(function(row) {
                        out.push(row[col]);
                    });    
                }

                return out;
            }
            else {
                let param = {};
                param[col] = val;
                let res = await this.db.get(param);
                return res;    
            }
        }
        else {
            return null;
        }
    }

    async get_random_line() {
        if (this.db !== null) {
            let res = await this.db.get();
            let linenr = Math.floor(Math.random() * res.length);
            return res[linenr];
        }
        else {
            return null;
        }
    }

}

module.exports = CsvData;