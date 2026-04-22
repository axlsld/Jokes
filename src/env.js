"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var dotenv = require("dotenv");
dotenv.config({
    path: path.resolve(process.cwd(), '../.env')
});
