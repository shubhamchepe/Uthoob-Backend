require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Video = require('./models/videos');
const bodyParser = require('body-parser')


const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000;

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected : ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.send({ title: "Uthoob Videos" });
});

app.post('/videos/:channelId', async (req, res) => {
    const channelId = req.params.channelId; 
    console.log('TYPEOF',typeof req.body.videos);
    const videos = Object.values(req.body.videos);
   

    try {
      // Create an array to store the video documents
      const videoDocuments = []
      let something = {}
      videos.forEach(video => {
        console.log(video);
         videoDocuments.push({
            videos: [
                {
                  id: video.id,
                  snippet: {
                    publishedAt: video.snippet.publishedAt,
                    title: video.snippet.title,
                    description: video?.snippet?.description,
                    thumbnails: {
                      default: {
                        url: video.snippet.thumbnails.default.url,
                        width: video.snippet.thumbnails.default.width,
                        height: video.snippet.thumbnails.default.height,
                      },
                    },
                    channelTitle: video.snippet.channelTitle,
                  },
                },
            ]
        })
        something = [
                {
                  channelId:channelId,  
                  id: video.id,
                  snippet: {
                    publishedAt: video.snippet.publishedAt,
                    title: video.snippet.title,
                    description: video?.snippet?.description,
                    thumbnails: {
                      default: {
                        url: video.snippet.thumbnails.default.url,
                        width: video.snippet.thumbnails.default.width,
                        height: video.snippet.thumbnails.default.height,
                      },
                    },
                    channelTitle: video.snippet.channelTitle,
                  },
                },
            ]
        
      });

        
      const existingDocument = await Video.findOne({ channelId }).exec();

    if (existingDocument) {
      // Update the existing document
      existingDocument.videos = videoDocuments;
      await existingDocument.save();
      console.log('Document updated:', existingDocument);
    } else {
      // Create a new document
      const newDocument = await Video.create({ channelId, videos: something });
      console.log('Document created:', newDocument);
    }

    console.log('VIDEO DOCUMENT', videoDocuments);
    res.status(200).send('Videos updated successfully.');
  } catch (error) {
    console.error('Error updating or creating document:', error);
    res.status(400).send({ error: 'Invalid videos data' });
  }
});

  app.get('/:channelId', (req, res) => {
    const channelId = req.params.channelId; // Assuming the channelId is passed as a route parameter
  
    Video.find({ channelId: channelId })
      .then((videos) => {
        res.json({ videos });
      })
      .catch((error) => {
        res.status(500).send({ error: 'Error fetching videos' });
      });
  });

 

connectDB().then(() =>{
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
})