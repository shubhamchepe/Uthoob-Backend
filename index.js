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
    console.log(typeof req.body.videos);
    const videos = JSON.parse(req.body.videos); 
   

    try {
      // Create an array to store the video documents
      const videoDocuments = videos.map((video) => ({
        channelId: channelId,
        videos: [
          {
            id: video.id,
            snippet: {
              publishedAt: video.snippet.publishedAt,
              title: video.snippet.title,
              description: video.snippet.description,
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
        ],
      }));
  
      // Insert the array of video documents into the 'videos' collection
      await Video.insertMany(videoDocuments)
        .then(() => {
          res.send({ message: 'Videos stored successfully' });
        })
        .catch((error) => {
            console.log('Error storing videos',error)
          res.status(500).send({ error: 'Error storing videos' });
        });
    } catch (error) {
        console.log('Invalid videos data',error)
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