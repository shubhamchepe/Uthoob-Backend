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
    const videos = Object.values(req.body.videos);
  
    try {
      // Create an array to store the video documents
      const videoDocuments = videos.map((video) => ({
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
      }));
  
      const existingDocument = await Video.findOne({ channelId }).exec();
  
      if (existingDocument) {
        // Update the existing document
        existingDocument.videos = videoDocuments;
        await existingDocument.save();
        console.log('Document updated:', existingDocument);
      } else {
        // Create a new document
        const newDocument = await Video.create({ channelId, videos: videoDocuments });
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

  app.get('/check-videos-in-db/:channelId', async (req,res)=>{
    const channelId = req.params.channelId;
    try{
        const result = await Video.findOne({ channelId }).exec()
        res.send({Value : result})
    }catch(error){
        console.log(error)
    }
    
  })

 

connectDB().then(() =>{
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
})