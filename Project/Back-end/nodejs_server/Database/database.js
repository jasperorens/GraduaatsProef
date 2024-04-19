const mysql = require('mysql2');
const faker = require('faker');

const con = mysql.createConnection({
    host: "localhost",
    user: "adminOne",
    password: "Password123-",
});

function generateAddress(){
    return faker.address?.streetAddress();
}
function generateName(){
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    return `${firstName} ${lastName}`;
}
function escapeQuotes(str) {
    return str.replace(/'/g, "\\'");
}
function generateInsertStatements(numRecords){
    let insertSql = "INSERT INTO customers (name, address) VALUES";
    for (let i = 0; i < numRecords; i++){
        let name = generateName();
        let address = generateAddress();
        name = escapeQuotes(name);
        insertSql += `('${name}', '${address}')`;
        if (i !== numRecords - 1){
            insertSql += ", ";
        }
    }
    insertSql += ";";
    return insertSql;
}


con.connect(function(err) {
    if (err) throw err;
    console.log("Connected");

    // Create Database if it doesn't exist
    con.query("CREATE DATABASE IF NOT EXISTS nodeDb", function (err, result) {
        if (err) throw err;
        console.log("Database created or already exists");

        // Use the database
        con.query("USE nodeDb", function(err, result) {
            if (err) throw err;
            console.log("Database selected");

            // Create Table
            let createSql = "CREATE TABLE IF NOT EXISTS customers (name VARCHAR(255), address VARCHAR(255))";
            con.query(createSql, function (err, result){
                if (err) throw err;
                console.log("Table created or already exists");

                // Insert into Table
                let insertSql = generateInsertStatements(100);
                con.query(insertSql, function (err, result){
                    if (err) throw err;
                    console.log("100 records inserted");
                    // Close connection
                    con.end();
                });
            });
        });
    });
});
