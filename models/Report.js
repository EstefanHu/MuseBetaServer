const mongoose = requrie('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema({
  body: {
    type: String,
    required: true,
    maxlength: 280
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }
});