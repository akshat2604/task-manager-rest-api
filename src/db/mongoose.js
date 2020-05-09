const mongoose = require('mongoose')
mongoose.connect(process.env.dbport, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});