const path = require("path");
const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')


const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

const User = require("./models/User");
const ImeiRecord = require("./models/ImeiRecord");
const Permissions = require("./models/Permissions");

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

app.use(cors())
app.use(express.json())


mongoose.connect(process.env.DATABASE_URI)

app.get('/getRegisteredUsers', (req,res) =>{

	User.find({}).then((users) =>{
		res.status(200).send(users);
	}).catch((err) =>{
		res.status(500).send(err);
	})
})

app.get('/totalRegisteredUsers', (req,res) =>{
	try{
	User.countDocuments().then(async(count_documents) =>{
		res.status(200).send({"count": count_documents});
	})
}
catch(err){
	res.status(404).send({message: error})
}
})

app.get('/totalUsers', (req,res) =>{
	try{
	ImeiRecord.countDocuments().then(async(count_documents) =>{
		res.status(200).send({"count": count_documents});
	})
}
catch(err){
	res.status(404).send({message: error})
}
})

app.get('/getPermissions', (req,res) =>{

	Permissions.find({}).then((users) =>{
		res.status(200).send(users);
	}).catch((err) =>{
		res.status(500).send(err);
	})
})

app.get('/getImeiRecords', (req,res) =>{

	ImeiRecord.find({}).then((users) =>{
		res.status(200).send(users);
	}).catch((err) =>{
		res.status(500).send(err);
	})
})

app.post('/api/remove', async (req, res) => {
	const id = req.body.id;
	try {
		 User.findByIdAndRemove(id).exec()
		res.json({ status: 'ok', text:'user deleted'})
	} catch (err) {
		res.json({ status: 'error', error: err })
	}
})

app.post('/remove/permissions', async (req, res) => {
	const id = req.body.id;
	try {
		 Permissions.findByIdAndRemove(id).exec()
		res.json({ status: 'ok', text:'user deleted'})
	} catch (err) {
		res.json({ status: 'error', error: err })
	}
})

app.post('/remove/downloads', async (req, res) => {
	const id = req.body.id;
	try {
		 ImeiRecord.findByIdAndRemove(id).exec()
		res.json({ status: 'ok', text:'user deleted'})
	} catch (err) {
		res.json({ status: 'error', error: err })
	}
})


app.post('/api/register', async (req, res) => {
	console.log(req.body.password)
	try {
		const newPassword = await bcrypt.hash(req.body.password, 10)
		console.log(newPassword)
		await User.create({
			name: req.body.name,
			email: req.body.email,
			password: newPassword,
		})
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' })
	}
})

app.post('/api/login', async (req, res) => {
	const user = await User.findOne({
		email: req.body.email,
	})

	if (!user) {
		
		return { status: 'error', error: 'Invalid login', remarks:"Email address isn't valid" }
	}
	else{
	
		const isPasswordValid = await bcrypt.compare(
			req.body.password,
			user.password
		)
	
		if (isPasswordValid) {
		 	// console.log("pass is valid")
			const token = jwt.sign(
				{
					name: user.name,
					email: user.email,
				},
				process.env.SECRET_KEY
			)
	
			return res.json({ status: 'ok', user: user.email, remarks: "Logged in successfully!" })
		} else {
			// console.log("pass is not valid")
			return res.json({ status: 'error', user: false, remarks: "Password is not valid" })
		}
	}


})



const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Sever running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
	console.log(`Logged Error: ${err.message}`);
	server.close(() => process.exit(1));
  });
