const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const Todo = require('./model/todo.model');
const connection = mongoose.connection;
const PORT = 4000;
const URL = "//127.0.0.1:27017/todos";



app.use(cors());
app.use(bodyParser.json());


mongoose.connect(`mongodb:${URL}`, {
	useNewUrlParser: true
});


connection.once('open', () => {
	console.log("Successfully connected.")
});

todoRoutes.route('/').get((req, res) => {
	Todo.find((err, todos) => {
		if(err) {
			console.error(err);
		}
		else {
			res.status(200).json(todos);
		}
	});
});

todoRoutes.route("/:id").get((req, res) => {
	const id = req.param.id;
	Todo.findById(id, (err, todo) => {
		res.status(200).json(todo);
	});
});


todoRoutes.route("/add").post((req, res) => {
	const todo = new Todo(req.body);
	todo.save()
		.then(todo => {
			res.status(200).json(todo);
		})
		.catch(err => {
			res.status(400).send(error,'failed');
		});
});

todoRoutes.route("/update/:id").post((req, res) => {
	const id = req.params.id;	
	Todo.findById(id, (err, todo) => {		
		if(!todo) {
			res.status(404).send("No data found");
		}
		else {
			todo.description = req.body.description;
			todo.responsible = req.body.responsible;
			todo.priority = req.body.priority;
			todo.completed = req.body.completed;

			todo.save()
				.then(todo => {
					res.status(200).json(todo);
				})
				.catch(err => {
					res.status(404).send("failed");
				});
		}
	});
});

app.use("/todos", todoRoutes);

app.listen(PORT, () => {
	console.log(`Server is running at port ${PORT}`);
});