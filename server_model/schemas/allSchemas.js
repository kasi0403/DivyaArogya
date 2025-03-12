const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  userId:{
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true
  }
});

let usersModel = mongoose.model('User', userSchema);

const patientSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  bloodType: { // Changed from bloodGroup to match React component
    type: String,
    required: true,
  },
  medicalHistory: {
    type: String
  },
  caretakerId: {
    type: String,
    required: true,
  },
  // Adding additional fields needed for the dashboard
  vitals: [{
    date: String,
    bloodPressure: String,
    sugarLevel: String
  }],
  reports: [String],
  doctorNotes: String,
  medications: [String],
  appointments: [{
    date: String,
    doctor: String
  }]
});


let doctorIdSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  gender:{
    type: String,
    required: true,
  },
  specialization:{
    type: String,
    required: true,
  },
  phone:{
    type:String,
    required:true
  }
});


let patientIdModel = mongoose.model('patientId', patientSchema);
let doctorIdModel = mongoose.model('doctorId', doctorIdSchema);

let reportIdSchema = new mongoose.Schema({
  userId: { type: String, required: true },  
  ALLreportIDs: {
    type: Array,
  },
  PredictionID:{
    type:Array,
  },
  

});

let reportIdsModel = mongoose.model('ReportId', reportIdSchema);

let reportDataSchema = new mongoose.Schema({
  userId:{
    type:String
  },
  date:{
    type:String
  },
  reportPdf:{
    type:Object
  },
  docNote:{
    type:String
  }
  ,
  dietPlan:{
    type:String
  }
})
let reportDatasModel=mongoose.model('reportData',reportDataSchema);
let PredictionSchema= new mongoose.Schema({
  predictionId:{
    type:String,
  },
  userId:
  {
    type:String
  },
  reportIds:{
    type:Array,
  }
  ,
  LLMPrediction:{
    type:String,
  },
  riskPercent:{
  type: Number
  }
})
let predictionsModel= mongoose.model('Prediction',PredictionSchema);
let careIDSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  patientIds: {
    type: [String],
    required: true
  }
});

let careIDsModel = mongoose.model('CareID', careIDSchema);

module.exports = {
  usersModel,
  patientIdModel,
  reportIdsModel,
  reportDatasModel,
  careIDsModel,
  predictionsModel,
  doctorIdModel
};