const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');
const CarTreatmentSchema = new mongoose.Schema(
  {
    TreatmentNumber: {
      type: String,
    },
    TreatmentInformation: {
      type: String,
      required: true,
    },
    Date: {
      type: Date, // TODO change to Date
      required: true,
    },
    WorkerEmail: { type: String, required: true },
    CarNumber: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

// CarTreatmentSchema.pre('save', (next) => {
//   this.Treatment_Number = this._id;
//   next();
// });
CarTreatmentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model(
  'carTreatment',
  CarTreatmentSchema,
  'carTreatments'
);
