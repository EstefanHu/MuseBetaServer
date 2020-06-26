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
    required: true,
    ref: 'User',
  },
  on: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    required: true,
    enum: [
      'User',
      'Story',
      'Review',
      'Page',
      'Chapter',
      'Campfire',
      'Monument'
    ]
  }
});