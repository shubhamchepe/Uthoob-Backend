const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  channelId: {
    type: String,
    required: true
  },
  videos: [
    {
      id: {
        type: String,
        required: true
      },
      snippet: {
        publishedAt: {
          type: Date,
          required: true
        },
        title: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        thumbnails: {
          default: {
            url: {
              type: String,
              required: true
            },
            width: {
              type: Number,
              required: true
            },
            height: {
              type: Number,
              required: true
            }
          }
        },
        channelTitle: {
          type: String,
          required: true
        }
      
      }
    }
  ]
});

module.exports = mongoose.model('Video', videoSchema);
