const mongoose = require("mongoose");
const express = require("express");
const app = express();
app.use(express.json());

async function main() {
  await mongoose.connect("mongodb://localhost:27017/FootballTeam");
}
//Schema for Creating team
const teamSchema = new mongoose.Schema({
  name: String,
  owner: String,
  players: [
    {
      name: String,
      touchdownpasses: Number,
      rushingYard: Number,
      sack: Number,
      goal: Number,
    },
  ],
});
const team = mongoose.model("team", teamSchema);
//schema for players
const playerSchema = new mongoose.Schema({
  name: String,
  touchdownpasses: Number,
  rushingYard: Number,
  sack: Number,
  goal: Number,
});
const player = mongoose.model("players", playerSchema);

//createteam

app.post("/createTeam", async (req, res) => {
  const value = req.body;
  if (value.players.length <= 15) {
    console.log(value);
    const data = await team(value)
      .save()
      .then(() => {
        res.send({ response: "team is added successfully" });
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    res.status(400).json({ message: "team player is greater then 15" });
  }
});

//update player
app.put("/updatePlayers/:id", async (req, res) => {
  try {
    const value = req.body;
    const data = await player.findByIdAndUpdate(
      { _id: req.params.id, value },
      {
        new: true,
      }
    );
    res.status(200).json({
      response: "player is updated",
    });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
});
//update team player
app.put("/updatePlayersInTeam/:id", async (req, res) => {
  try {
    var playars;
    const value = req.body;
    const data = await team.findById(req.params.id);
    console.log(value.id);
    if (data) {
      playars = data.players;
      var updateplayer;
      const newarray = playars.map((element) => {
        if (element._id.toString() === value.id) {
          element.name = value.name;
          element.touchdownpasses = value.touchdownpasses;
          element.goal = value.goals;
          element.rushingYard = value.rushingYard;
          element.sack = value.sack;
        }
      });
    }

    await team.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.status(200).json({
      response: data,
    });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
});

//delete player
app.delete("/deletePlayersFromTeam/:id", async (req, res) => {
  try {
    var playars;

    const value = req.body;
    const data = await team.findById(req.params.id);
    console.log(value.id);
    if (data) {
      playars = data.players;

      var updateplayer;
      const newarray = playars.map((element, index) => {
        if (element._id.toString() === value.id) {
          playars.splice(index, 1);
        }
      });
    }

    await team.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.status(200).json({
      response: "player is deleted",
    });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
});

//addplayer in team
app.post("/addPlayerInTeam/:id", async (req, res) => {
  try {
    var playars;

    const value = req.body;
    const data = await team.findById(req.params.id);
    if (data) {
      playars = data.players;
      data.players.push({
        name: value.name,
        touchdownpasses: value.touchdownpasses,
        rushingYard: value.rushingYard,
        sack: value.sack,
        goals: value.goals,
      });
    }

    await team.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.status(200).json({
      response: "player is added in team",
    });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
});
//add players
app.post("/addPlayer", async (req, res) => {
  const value = req.body;

  console.log(value);
  const data = await player(value)
    .save()
    .then(() => {
      res.send({ response: "player is added successfully" });
    })
    .catch((err) => {
      res.send(err);
    });
});

//most touch down pass player

app.get("/touchdownpass", async (req, res) => {
  const data = await player
    .find()
    .sort({ touchdownpasses: -1 })
    .limit(1)
    .select("name touchdownpasses -_id");
  res.send(data);
});

// most rushing yard player
app.get("/rushingYard", async (req, res) => {
  const data = await player
    .find()
    .sort({ rushingYard: -1 })
    .limit(1)
    .select("name rushingYard -_id");
  res.send(data);
});

// least rushing yard player
app.get("/LeastrushingYard", async (req, res) => {
  const data = await player
    .find()
    .sort({ rushingYard: 1 })
    .limit(1)
    .select("name rushingYard -_id");
  res.send(data);
});

//sorted most goal to fewest goal
app.get("/goals", async (req, res) => {
  const data = await player.find().sort({ goal: -1 }).select("name goal -_id");
  res.send(data);
});

// most sack player
app.get("/sack", async (req, res) => {
  const data = await player
    .find()
    .sort({ sack: -1 })
    .limit(1)
    .select("name sack -_id");
  res.send(data);
});

//server creating
app.listen(3000, () => {
  console.log("connected");
});

main()
  .then(() => console.log("database is connected"))
  .catch((err) => console.log(err));
