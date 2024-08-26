const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
    class: {
        type: Number,
        required: true,
    },
    product: {
        type: String,
        required: true,
    },
    score:Number,
},
    { timestamps: false }
);
productsSchema.index({ product: 'text' });
const ProductsModel = mongoose.models.products || mongoose.model("products", productsSchema);
export default ProductsModel;
