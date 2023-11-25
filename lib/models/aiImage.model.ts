import mongoose from "mongoose";

const aiImageSchema = new mongoose.Schema({
    name: { type: String, required: true},
    prompt: { type: String, required: true},
    photo: { type: String, required: true},
});

const AiImage = mongoose.models.AiImage || mongoose.model("AiImage", aiImageSchema);
export default AiImage;