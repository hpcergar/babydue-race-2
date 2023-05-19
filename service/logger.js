'use strict';

const { createLogger, format, transports } = require("winston");
const {combine, timestamp, printf } = format
const path = require("path");

const logFormat = printf(({message, timestamp}) => {
    return `[${timestamp}] ${message}`
})

exports.logger = function(){
    return createLogger({
        format: combine(
            timestamp(),
            logFormat,
        ),
        transports: [
            new transports.File({filename: path.join(__dirname, '..', 'data', 'log')})
        ]
    })
}