const fs = require('fs');
const path = require('path');

const express = require('express'),
  jsonParser = require('body-parser').json(),
  mongoose = require('mongoose');

const {Candidate, Organization} = require('./models');

mongoose.Promise = global.Promise;

const router = express.Router();

router.use(jsonParser);

router.get('/candidates/:_id', (req, res) => {
  Candidate
    .findOne({_id: req.params._id})
    .exec()
    .then(data => {
      if (!data || data.length < 1) {
        res.status(404).json({message: 'No Such Record Exists'})
      } else {
        res.json(data);
      }
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
      }
    );
});

router.get('/organizations/:_id', (req, res) => {
  Organization
    .findOne({_id: req.params._id})
    .exec()
    .then(data => {
      if (!data || data.length < 1) {
        res.status(404).json({message: 'No Such Record Exists'})
      } else {
        res.json(data);
      }
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
      }
    );
});

router.put('/candidates/:_id', (req, res) => {
  if (!(req.params._id && req.body.candidateId && (req.params._id === req.body.candidateId))) {
    const message = (
      `Request path id (${req.params.candidateId}) and request body id ` +
      `(${req.body.candidateId}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ['answers', 'result', 'clickedSurveyLink', 'completedSurvey', 'feedback'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field]
    }
  })

  Candidate
    .findOneAndUpdate({_id: req.params._id}, {$set: toUpdate})
    .exec()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json(err))
});

router.post('/usertesting/adduser', (req, res) => {
  // FEEDBACK ORG
  const orgId = '5aafa626b19de17106e699cf';
  let candidate = new Candidate({firstName: req.body.userName, name: req.body.userName, orgId})
  candidate
    .save()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json(err))
});

module.exports = {router}
