const router = require("express").Router();
let Room = require("../models/roomModel");
// Update users in a room by roomID
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
//Get All Rooms belongs
router.post("/search", async (req, res) => {
  try {
    const { userID } = req.body;
    let rooms = [];
    const created = await Room.find({ createdUser: userID })
      .then((rooms) => {
        return rooms;
        //  res.json(rooms);
      })
      .catch((err) => {
        console.log(err);
      });

    const belongs = await Room.find({ users: { $in: [userID] } }).populate(
      "users",
      "username email"
    );
    created &&
      created.map((item) => {
        rooms.push(item);
      });
    belongs &&
      belongs.map((item) => {
        rooms.push(item);
      });

    res
      .json({
        msg: "Successfully",
        code: 1,
        data: [rooms],
      })
      .send();
  } catch (err) {
    console.error("Error finding rooms:", err);
    res
      .json({
        msg: "Error",
        code: 0,
        data: [{ err }],
      })
      .send();
  }
});
module.exports = router;
