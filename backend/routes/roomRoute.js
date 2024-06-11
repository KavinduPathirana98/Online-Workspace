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
module.exports = router;
