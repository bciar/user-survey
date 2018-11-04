const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const candidateSchema = Schema({
  answers: { type: Object, default: {} },
  result: { type: Object, default: {} },
  feedback: { type: Object, default: {} },
  email: { type: String},
	name: String,
	firstName: String,
	lastName: String,
	candidateGuid: String,
	orgId: String,
	jobApplied: String,
	yearsOfExperience: String,
	timezoneOffset: Number,
  clickedSurveyLink: Boolean,
  completedSurvey: Boolean,
}, {timestamps: true});

const organizationSchema = Schema({
  organizationName: {type: String, unique: true},
  notes: String,
}, {timestamps: true});

const Candidate = mongoose.model('Candidate', candidateSchema);
const Organization = mongoose.model('Organization', organizationSchema);

module.exports = { Candidate, Organization };
