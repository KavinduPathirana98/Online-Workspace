const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const { mongoose } = require("mongoose");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = process.env.PORT || 5000;

// Configure CORS
app.use(cors());

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Array to store socket connections
let connections = [];

// Function to get file names in the uploads folder
const getFileNames = () => {
  return new Promise((resolve, reject) => {
    fs.readdir("uploads/", (err, files) => {
      if (err) {
        reject(err);
      } else {
        //console.log(files);
        resolve(files);
      }
    });
  });
};

// Function to emit file names to all connected clients
const emitFileNames = async () => {
  try {
    const files = await getFileNames();
    connections.forEach((socket) => {
      socket.emit("fileList", files);
    });
  } catch (error) {
    console.error("Error getting file names:", error);
  }
};

// Socket.IO connection handling
io.on("connect", (socket) => {
  connections.push(socket);

  console.log(`${socket.id} has connected`);

  // Send initial file list on connection
  emitFileNames();

  socket.on("text", (data) => {
    // Broadcast text data to all connected clients except the sender
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("text", data);
      }
    });
  });

  socket.on("elements", (data) => {
    // Broadcast elements data to all connected clients except the sender
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("servedElements", { elements: data });
      }
    });
  });

  socket.on("down", (data) => {
    // Broadcast "down" event to all connected clients except the sender
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("ondown", { x: data.x, y: data.y });
      }
    });
  });
});

// File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // After file upload, emit updated file list to all connected clients
  emitFileNames();
  res.status(200).json({ message: "File uploaded successfully" });
});
// File download endpoint
app.get("/download/", (req, res) => {
  const fileName = req.query.fileName;
  // const fileName = req.params.fileName;
  // console.log(fileName);
  const filePath = path.join(__dirname, "uploads/", fileName);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File not found:", err);
      return res.status(404).json({ message: "File not found" });
    }

    // Set the appropriate headers
    res.setHeader("Content-disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-type", "application/octet-stream");

    // Create a read stream from the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});
//Database Connection Initialize

const URI = process.env.MONGODB_URI;
try {
  mongoose.connect(URI, {
    // useCreateindex: true,
    // useNewUrlParser: true,
    // userUnifiedTopologyL: true,
    // useFindAndModify: false,
  });

  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("Mongodb Connection success!");
  });
} catch (err) {
  console.log(err);
}

//Database Interaction Endpoints
const userController = require("./routes/userRoutes");

app.use("/api/user", userController);

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
