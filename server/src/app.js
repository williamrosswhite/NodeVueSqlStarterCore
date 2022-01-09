const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

app.post('/register', (req,res) => {
    getPoolConnection((connectionErr, connection) => {
        if(connectionErr) console.log(connectionErr)
        console.log('' + req.body.email + req.body.password)
        connection.query(`INSERT INTO Users (email, password) VALUES ('${req.body.email}', '${req.body.password}')`, (insertionErr, rows) => {
            if(!insertionErr) {
                console.log(rows)
            } else {
                console.log(insertionErr)

                // create missing taable
                var tableCreator = require('./db-utilities/generate-table')
                tableCreator()

                // reattempt
                connection.query(`INSERT INTO Users (email, password) VALUES ('${req.body.email}', '${req.body.password}')`, (insertionErr, rows) => {
                    if(!insertionErr) {
                        console.log(rows)
                    } else {
                        console.log('queryErr: ' + insertionErr)
                        console.log('table creation unsuccessful, check connection settings')
                    }
                })
            }
        })
    })
    res.send({
        message: `Hello ${req.body.email} your user was registered`
    })
})

var getPoolConnection = require('./db-utilities/connection-pool');

getPoolConnection((connectionErr, connection) => {
    if(connectionErr) console.log('connectionErr:' + connectionErr)

    connection.query('SELECT * FROM Users', (queryErr, rows) => {

        if(!queryErr) {
            console.log(rows)
        } else {
            console.log('queryErr: ' + queryErr)

            // create missing taable
            var tableCreator = require('./db-utilities/generate-table')
            tableCreator()

            // reattempt
            getPoolConnection((connectionErr, connection) => {
                if(connectionErr) {
                    console.log('connectionErr:' + connectionErr)
                    connection.query('SELECT * FROM Users', (queryErr, rows) => {
                        if(!queryErr) {
                            console.log(rows)
                        } else {
                            console.log('queryErr: ' + queryErr)
                            console.log('table creation unsuccessful, check connection settings')
                        }
                    })
                }
            })

        }
    })
})

app.listen(process.env.PORT || 8081)
