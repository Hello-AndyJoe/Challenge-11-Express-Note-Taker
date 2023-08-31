// BOILER PLATE CODE 
const express = require('express');
const path = require('path');
const uniqueID = require('uuid');
const app = express();
const PORT = 3001;
const fs = require('fs');
const noteArray = require('./db/db.json');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Not Needed but it's outlined in the assignment
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.post('/api/notes', (req, res) => {
    console.log(`${req.method}`);

    const { title, text } = req.body;
    const newNote = {
        title,
        text,
        id: uniqueID.v4()
    }

    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const readNotes = JSON.parse(data);
            readNotes.push(newNote);

            fs.writeFile('./db/db.json', JSON.stringify(readNotes, null, 2), (err) =>
                err ? console.error(err) :
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
}
);

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.json(JSON.parse(data));
        }
    })
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);
// 