const mongoose = require("mongoose");

const keywordsSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
},
  { timestamps: false }
);
const keywordsModel = mongoose.models.keywords || mongoose.model("keywords", keywordsSchema);
export default keywordsModel;
