
const express = require('express');
const dashboard = require('../model/dashboard');
const treatments = express.Router();

treatments.get('/treatments', dashboard.getTreatments);
treatments.post('/treatment/create', dashboard.addNewTreatment);
treatments.put('/treatments', dashboard.editTreatment);
treatments.delete('/treatments', dashboard.deleteTreatment);
module.exports = treatments;
