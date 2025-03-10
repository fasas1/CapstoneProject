const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
});

module.exports = mongoose.model("Task", TaskSchema);
