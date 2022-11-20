const mongoose = require('mongoose')

const ImeiRecord = new mongoose.Schema(
	{
		id_: {
			type: String,
			required: true	
		},
		tempId: {
			type: String,
			required: true	
		},
		imei: {
			type: String,
            required: true
		},
        createdOn: {
            type: String,
            required: true
        },
	
	},
	{ collection: 'inf-imei' }
)


const model = mongoose.model('ImeiRecord', ImeiRecord)
module.exports = model