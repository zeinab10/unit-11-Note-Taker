// Dependencies

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Parser with Express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// GET Methods
// Routes to index.html
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});

// Routes to notes.html
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});

// Routes to db.json
app.get("/api/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./Develop/db/db.json"));
});

//POST Method
// Create new note object and write it to the JSON file with incremented id
app.post("/api/notes", function(req, res) {
  fs.readFile(path.join(__dirname, "./Develop/db/db.json"), "utf8", function(
    error,
    response
  ) {
    if (error) {
      console.log(error);
    }
    const notes = JSON.parse(response);
    const noteRequest = req.body;
    const newNoteId = notes.length + 1;
    const newNote = {
      id: newNoteId,
      title: noteRequest.title,
      text: noteRequest.text
    };
    notes.push(newNote);
    res.json(newNote);
    fs.writeFile(
      path.join(__dirname, "/Develop/db/db.json"),
      JSON.stringify(notes),
      function(err) {
        if (err) throw err;
      }
    );
  });
});

// DELETE Method
// Removes the note with given id property and rewrites the note the JSON file
app.delete("/api/notes/:id", function(req, res) {
  const deleteNote = req.params.id;
  fs.readFile("./Develop/db/db.json", "utf8", function(error, response) {
    if (error) {
      console.log(error);
    }
    let notes = JSON.parse(response);
    if (deleteNote <= notes.length) {
      res.json(notes.splice(deleteNote - 1, 1));

      for (let i = 0; i < notes.length; i++) {
        notes[i].id = i + 1;
      }
      fs.writeFile("./Develop/db/db.json", JSON.stringify(notes), function(err) {
        if (err) throw err;
      });
    } else {
      res.json(false);
    }
  });
});

// Set static folder
app.use(express.static(path.join(__dirname, "./Develop/public")));

// Server listens

const PORT = process.env.port || 3030;

app.listen(PORT, () => console.log("Server started on port " + PORT));