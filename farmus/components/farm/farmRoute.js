const express = require('express');

const app = require('../../app');
const farm = require('./farmController');


//농장목록 조회
app.get("/api/postings", farm.getFarmlist);

//농장 세부사항 조회
app.get("api/postings:Farmidx", farm.getFarmDetail);

//과거 이용 내역 조회
app.get("/farm/befolist:userid", farm.getFarmUsedList);

//현재 이용 내역 조회
app.get("/farm/curlist:userid", farm.getFarmUseList);

//농장주 등록
app.patch("/farm/register_FarmOwner:userid", farm.register_FarmOwner);

//검색 필터
app.get("/farm/Search_filter", farm.getSearchWithFilter);

module.exports = app;