const path = require("path");
require("dotenv").config({ path: "./config.env" });
const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')


const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

const User = require("./models/User");

const Order = require("./models/Order");
const Files = require("./models/Files");


const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

app.use(cors())
app.use(express.json())


mongoose.connect(process.env.DATABASE_URI)

app.get('/api/read', (req,res) =>{

	Order.find({}).then((orders) =>{
		res.send(orders);
	}).catch((err) =>{
		res.status(500).send(err);
	})
})

//

//Order
app.post('/api/remove', async (req, res) => {
	const id = req.body.id;
	try {
		 Order.findByIdAndRemove(id).exec()
		res.json({ status: 'ok', text:'order deleted'})
	} catch (err) {
		res.json({ status: 'error', error: err })
	}
})


app.delete('/api/delete', async (req, res) => {
	const id = req.body.id;
	await Order.findByIdAndRemove(id).exec()
	res.send("Item Deleted")
	// console.log(id)
})


app.put('/api/editsub', async(req, res) => {
	const company=req.body.company
	const name=req.body.name
	const street=req.body.street
	const postcode=req.body.postcode
	const location =req.body.location
	const email =req.body.email
	const phone =req.body.phone
	const vat =req.body.vat 


	try{
		const result = await User.updateOne({email: email},{
			$set: {
				company:company,
				name:name,
				street:street,
				postcode:postcode,
				location :location,
				phone :phone,
				vat :vat
			}
		});
		// console.log(result);
		res.json({ status: 'ok', text:'subcontractor info updated successfully'})
	}
	catch(err){
		// console.log(err);
		res.json({ status: 'error', error: err})
	}
})

app.get('/api/profiledata', (req,res) =>{
	// console.log(req.query.email)
	const email = req.query.email;


	User.findOne({email:email}).then((subs) =>{
// console.log(subs)
		res.json({ status: 'ok', sub:subs})
	}).catch((err) =>{
		// console.log(err);
		res.json({ status: 'error', error: err})
	})
})

app.get('/api/filemail', async (req, res) => {
	// console.log(req.query.email)
	try{
		const user = await Files.findOne({
			email: req.query.email,
		})
		if(user){
			res.json({ status: 'ok', text: 'Certificate exists' })
		}
		else{
			res.json({ status: 'invalid', error: 'No certificate could be found' })
		}

	}
	catch (err) {
		res.json({ status: 'invalid', error: err })
	}
})

app.post('/api/sendfile', async (req, res) => {

	try{
		if(req.body.file!==''){
		await Files.create({
			file: req.body.file,
			email: req.body.email,
		})
		res.json({ status: 'ok' })
	}
	else{
		res.json({ status: 'error', error: 'No file found' })
	}
	}
	catch (err) {
		res.json({ status: 'error', error: 'Upload Failed' })
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
		//For development env
		// console.log("email not found bruhh")
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

//Order
app.post('/api/order', async (req, res) => {
	// console.log(req.body)
	try {
		await Order.create({
			value: req.body.value,
			images : req.body.images,
			length : req.body.length,
			sliderVal : req.body.sliderVal,
			name : req.body.name,
			email : req.body.email,
			contact : req.body.contact,
			address : req.body.address,
			section : req.body.section,
			others : req.body.others,
			method: req.body.method,
			floor: req.body.floor,
        	date : req.body.date,
			postcode : req.body.postcode,
			city : req.body.city,
			description : req.body.description,
			orderstatus : req.body.orderstatus
		})
		res.json({ status: 'ok', text:'stored successfully'})
	} catch (err) {
		res.json({ status: 'error', error: err })
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