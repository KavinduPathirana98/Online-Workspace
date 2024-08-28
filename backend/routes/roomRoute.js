const router = require("express").Router();
let Room = require("../models/roomModel");
// Update users in a room by roomID
// Multer configuration for file uploads
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
// Define the upload folder path

router.put("/update-users/:roomID", async (req, res) => {
  try {
    const { roomID } = req.params;
    const { users } = req.body; // Array of user IDs to be added/updated in the room

    // Find the room by roomID
    const room = await Room.findOne({ roomID: roomID });

    if (!room) {
      return res.status(404).json({
        msg: "Room not found!",
        code: 0,
        data: [],
      });
    }

    // Update the users array in the room document
    room.users = users;

    // Save the updated room document
    await room.save();

    res.json({
      msg: "Room users successfully updated!",
      code: 1,
      data: [{ roomID: roomID, users: room.users }],
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "Error updating users in room", code: 0, data: [] });
  }
});

// Delete Room by roomID
router.delete("/delete/:roomID", async (req, res) => {
  try {
    const { roomID } = req.params;

    // Find the room by roomID
    const room = await Room.findOne({ roomID: roomID });

    if (!room) {
      return res.status(404).json({
        msg: "Room not found!",
        code: 0,
        data: [],
      });
    }

    // Delete the room
    await Room.deleteOne({ roomID: roomID });

    res.json({
      msg: "Room successfully deleted!",
      code: 1,
      data: [{ roomID: roomID }],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error deleting room", code: 0, data: [] });
  }
});
router.post("/create", async (req, res) => {
  try {
    const { roomName, roomID, createdUser, roomPassword, users } = req.body;

    const roomRes = await Room.findOne({ roomID: roomID });

    if (roomRes) {
      res.json({
        msg: "Error Occurred While Creating Room.Please Recreate !",
        code: 0,
        data: [{ roomID: roomID }],
      });
    } else {
      const uploadFolder = path.join(__dirname, "../uploads/" + roomID);
      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }
      // if (!fs.existsSync(uploadFolder + "/temp")) {
      //   fs.mkdirSync(uploadFolder + "/temp", { recursive: true });
      // }
      const response = await Room.create({
        roomName,
        roomID,
        createdUser,
        roomPassword,
        users,
      });

      res
        .json({
          msg: "Successfully Created Room !",
          code: 1,
          data: [{ response }],
        })
        .send();
    }
  } catch (err) {
    console.log(err);
    res.json({ msg: err, code: 0, data: [] }).send();
  }
});
router.post("/create", async (req, res) => {
  try {
    const { roomName, roomID, createdUser, roomPassword, users } = req.body;

    const roomRes = await Room.findOne({ roomID: roomID });

    if (roomRes) {
      res.json({
        msg: "Error Occurred While Creating Rom.Please Recreate !",
        code: 0,
        data: [{ roomID: roomID }],
      });
    } else {
      const response = await Room.create({
        roomName,
        roomID,
        createdUser,
        roomPassword,
        users,
      });

      res
        .json({
          msg: "Successfully Created Room !",
          code: 1,
          data: [{ response }],
        })
        .send();
    }
  } catch (err) {
    console.log(err);
    res.json({ msg: err, code: 0, data: [] }).send();
  }
});
//find all rooms
router.post("/search", async (req, res) => {
  try {
    const { userID } = req.body;

    // Find rooms where the user is either the creator or inside the room
    const rooms = await Room.find({
      $or: [{ createdUser: userID }, { users: { $in: [userID] } }],
    }).populate("createdUser users", "-password -__v"); // Populating user details without sensitive information

    console.log(rooms);

    res.json({
      msg: "Successfully retrieved rooms",
      code: 1,
      data: rooms, // Send the array of rooms directly
    });
  } catch (err) {
    console.error("Error finding rooms:", err);
    res.status(500).json({
      msg: "Error retrieving rooms",
      code: 0,
      error: err.message,
    });
  }
});
module.exports = router;
