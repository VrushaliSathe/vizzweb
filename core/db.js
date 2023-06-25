const mongoose = require('mongoose');
let conn = null;

const _DBException = (message) => {
    this.message = message;
    this.name = 'DBException';
}

const _dbExecuteHelper = async (db, fn) => db.then(fn).finally(async () => {
    await mongoose.connection.close();
    console.log("Connection closed");
});
//const _dbExecuteHelper = async (db, fn) => db.then(fn);

module.exports.connect = async (event) => {
    return mongoose.connect(process.env.DB_CONNECTION_URL, { useCreateIndex: true, useNewUrlParser: true });
}

module.exports.dbExecute = async (fn) => {
    let dbUrl = process.env.DB_CONNECTION_URL;
    if (!dbUrl) {
        throw _DBException('DB connection string not valid');
    }
    console.log("Opening new Connection");
    return _dbExecuteHelper(
        mongoose.connect(dbUrl, {
            useNewUrlParser: true,
        }),
        fn
    );
}

module.exports.openDBConnection = async () => {
    try {
        const dbUrl = process.env.DB_CONNECTION_URL;
        if (!dbUrl) {
            throw _DBException('DB connection string not valid');
        }
        console.log('mongoose connection', mongoose.connection.readyState);
        if (!mongoose.connection.readyState) {
            console.log("Opening new Connection", conn);
            conn = await mongoose.connect(dbUrl, {
                useNewUrlParser: true
              });
            return conn;  
        } else {
            return conn;
        }
       

    } catch (error) {
        console.log(error);
        return null
    }
}

module.exports.closeDBConnection = async (db) => {
    // if (db) {
    //     await db.disconnect();
    //     console.log("Connection closed");
    // }
}

