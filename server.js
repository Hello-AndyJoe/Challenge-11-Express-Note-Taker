const express = require('express');
const path = require('path');
const uniqueID = require('uuid'); // NPM Used to generate random ID number for note entry
const app = express();
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const noteArray = require('./db/db.json');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//GET route to return the index.html
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

//GET route to return the notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//POST for the creation of a new note into the note array API
app.post('/api/notes', (req, res) => {
    console.log(`${req.method}`);

    const { title, text } = req.body;
    const newNote = {
        title,
        text,
        id: uniqueID.v4()
    }

    // First reads and parses the note array in write to due its nature of being JSON object
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const readNotes = JSON.parse(data);
            readNotes.push(newNote);

            // The writing of the database with the new note having been pushed to the array
            fs.writeFile('./db/db.json', JSON.stringify(readNotes, null, 2), (err) =>
                err ? console.error(err) :
                // Reread the note array so when the new note is written, it is displayed
                fs.readFile('./db/db.json', (err, data) => {
                    if (err) {
                        console.error(err);
                    } else {
                        res.json(JSON.parse(data));
                    }
                })
            );
        }
    });
});

// GET route to read the notes array API
// Troubleshooted this part with the instructor
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.json(JSON.parse(data));
        }
    })
});

// Deletes note from array when its respective trash icon is clicked
// Worked on this delete portion with tutor
app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id)
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            // Create new note array with deleted note filtered out based on ID
            let alterArray = JSON.parse(data).filter(singleNote => singleNote.id !== req.params.id);
            // Write over the note array with the altered note array
            fs.writeFile('./db/db.json', JSON.stringify(alterArray, null, 2), (err) =>
                err ? console.error(err) :
                    // Read the new, altered note array
                    fs.readFile('./db/db.json', (err, data) => {
                        if (err) {
                            console.error(err);
                        } else {
                            res.json(JSON.parse(data));
                        }
                    })
            );
        }
    })
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);