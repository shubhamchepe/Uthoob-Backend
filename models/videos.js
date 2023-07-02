const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  channelId: {
    type: String
  },
  videos: [
    {
      id: {
        type: String,
      },
      snippet: {
        publishedAt: {
          type: Date,
        },
        title: {
          type: String
        },
        description: {
        },
        thumbnails: {
          default: {
            url: {
              type: String,
            },
            width: {
              type: Number
            },
            height: {
              type: Number
            }
          }
        },
        channelTitle: {
          type: String
        }
      
      }
    }
  ]
});

module.exports = mongoose.model('Video', videoSchema);
