const mongoose = require('mongoose')
mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('[DB] Connected to mongodb'))
    .catch(err => console.log(`[DB] An error has occurred: ${err}`))