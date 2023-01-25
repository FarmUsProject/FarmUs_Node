const express = require('express');

const app = require('../../app');
const farm = require('./farmController');


//농장목록 조회
app.get("/api/postings", farm.getFarmlist);

//농장 세부사항 조회
app.get("api/postings/:Farmidx", farm.getFarmDetail);

//과거 이용 내역 조회
app.get("/farm/befolist:userid", farm.getFarmUsedList);

app.get("/farm/curlist:userid", farm.getFarmUseList);

module.exports = app;