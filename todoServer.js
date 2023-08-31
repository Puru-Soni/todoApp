const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

var todoList = [];

// MIDDLEWARE that gets data from file in a variable to manipulate
app.use((req, res, next) => {
	fs.readFile("todoData.json", "utf-8", (err, data) => {
		if (err) res.sendStatus(404);
		todoList = JSON.parse(data);
		next();
	});
});

// get all items in todolist
app.get("/todos", (req, res) => {
	res.status(200).json(todoList);
});

// create a new todo item in todolist and returns the new item as response
app.post("/todos", (req, res) => {
	const newItem = {
		id: Math.floor(Math.random() * 1000).toString(),
		...req.body,
	};
	todoList.push(newItem);
	fs.writeFile("todoData.json", JSON.stringify(todoList), (err) => {
		err ? res.sendStatus(401) : res.send(newItem);
	});
});

//delete todo item and send that el as response
app.delete("/todos/:id", (req, res) => {
	const todoIdx = todoList.findIndex((el) => el.id === req.params.id);
	if (todoIdx === -1) res.sendStatus(404);
	else {
		const el = todoList[todoIdx];
		todoList.splice(todoIdx, 1);
		fs.writeFile("todoData.json", JSON.stringify(todoList), (err) => {
			err ? res.sendStatus(401) : res.send(el);
		});
	}
});

// wrong route
app.get("*", (req, res) => res.status(404).send("Route not found"));

//starting http server
app.listen(PORT, () => console.log("Listening to port 3000"));

module.exports = app;
