
const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  class: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  }
},
  { timestamps: false }
);

const proclassModel = mongoose.models.classes || mongoose.model("classes", classSchema);
export default proclassModel;