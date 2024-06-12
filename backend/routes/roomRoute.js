const router = require("express").Router();
let Room = require("../models/roomModel");

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
    rooms.push(created);
    rooms.push(belongs);
    res
      .json({
        msg: "Successfully",
        code: 1,
        data: [{ rooms }],
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
