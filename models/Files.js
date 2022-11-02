const mongoose = require('mongoose')

const Files = new mongoose.Schema(
	{
		file: { 
            // low-high-average
            type: String,
             
             },
		email: {
            // data-urls x3
            type: String,
            
             }
	},
	{ collection: 'files' }
)

const model = mongoose.model('Files', Files)

module.exports = model