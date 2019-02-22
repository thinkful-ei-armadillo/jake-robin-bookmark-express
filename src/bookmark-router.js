'use strict';
const express = require('express');
const app = express.Router();
const store = require('./store.json');
const uuid = require('uuid/v4');

app.route('/')
  .get((req, res) => {
    res.send('Hello, world!');})
  .post((req,res)=>{
    console.log(req.body);
    res.send('res recieved');
  });

app.route('/bookmarks')
  .get((req,res)=>{
    res.json(store);})
  .post(express.json(), (req,res)=>{
    const { title, url, desc = ''} = req.body;
    if(!title || title.length < 1){
      return res.status(400).send('please have a title longer than 1 character');
    }
    if(!url || !url.includes('https://') || !url.includes('.com')){
      return res.status(400).send('please have a url');
    }
    const id = uuid();
    const newBookmark = {
      id,
      title,
      url,
      desc
    };
    store.push(newBookmark);
    res.status(201).location(`localhost:8000/bookmarks/${id}`).json({id});
  });
  
app.route('/bookmarks/:id')
  .get((req,res)=>{
    const {id}= req.params;
    const findBookmark = store.filter(el => el.id === id);
    if(findBookmark.length === 0){
      return res.status(404).send('not valid id');
    }
    return res.send(findBookmark);})
  .delete((req,res)=>{
    const {id} = req.params;
    const findBookmark = store.findIndex(el => el.id === id);
    if(findBookmark === -1){
      return res.status(404).send('not found');
    }
    store.splice(findBookmark,1);
    res.status(204).end();
  });

module.exports = app;