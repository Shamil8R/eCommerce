const mongoose = require('mongoose');
const database = 'eCart';

class Database {
    constructor() {
      this._connect()
    }

    _connect() {
        mongoose.connect(`${process.env.DATABASE}/${database}`)
        .then(()=>{
            console.log("Database connected successfully.");
        }).catch(()=>{
            console.log("Database connection failed!");
        })
    }
}

module.exports = new Database();