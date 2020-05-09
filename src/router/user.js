const express = require('express'),
    router = new express.Router(),
    User = require('../models/user'),
    multer = require('multer'),
    auth = require("../middleware/auth"),
    sharp = require('sharp'),
    { sendwelcomeemail, sendremoveemail } = require('../emails/account');

router.get('/me', auth, async (req, res) => {
    res.send(req.user);
});

router.post('/', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save();
        sendwelcomeemail(user.email, user.name)
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);

    }
});

router.patch('/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isvalidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isvalidOperation) return res.status(400).send({ error: "Invalid Operation!" });
    try {
        const user = req.user;
        //const user = await User.findById(req.params.id);
        updates.forEach(update => user[update] = req.body[update]);
        await user.save();
        //the below method was replaced by findbyid to again encrypt the password
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).send();
        res.status(200).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    };
});

router.delete('/me', auth, async (req, res) => {
    try {
        //const user = await User.findByIdAndDelete(req.user.id);
        await req.user.remove();
        sendremoveemail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    };
});

router.post('/logout', auth, async (req, res) => {
    try {
        /*const index = req.user.tokens.findIndex((token) => token.token === req.token);
        if (index !== -1) req.user.tokens.splice(index, 1);*/
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send();
    };
});

router.post('/logoutofall', auth, async (req, res) => {
    req.user.tokens = [];
    req.user.save(); console.log("logged out of all")
    res.send();
});

const upload = multer({
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return cb(new Error("Please upload an image"));
        }
        cb(undefined, true);
    }
});

router.post('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (err, req, res, next) => {
    res.status(400).send({ error: err.message })
});

router.delete('/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
}, (err, req, res, next) => {
    res.status(400).send({ error: err.message })
});

router.get('/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) { throw new error(); }
        res.set('content-type', 'image/png');
        res.send(user.avatar);

    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;