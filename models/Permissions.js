const mongoose = require('mongoose')

const Permissions = new mongoose.Schema(
	{
		id_: {
			type: String,
			required: true	
		},
		isLocationGranted: {
			type: Boolean,
			required: true	
		},
		isReadSmsGranted: {
            type: Boolean,
			required: true	
		},
        isContactsGranted: {
            type: Boolean,
			required: true	
        },
        createdOn: {
            type: String,
            required: true
        },

	
	},
	{ collection: 'inf-permissions' }
)


const model = mongoose.model('Permissions', Permissions)
module.exports = model