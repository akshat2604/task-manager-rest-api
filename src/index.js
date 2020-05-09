const express = require('express'),
    app = express(),
    port = process.env.PORT,
    userRouter = require('./router/user'),
    taskRouter = require('./router/task');

require('./db/mongoose');

app.use(express.json());
app.use('/users', userRouter);
app.use('/tasks', taskRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port)
});