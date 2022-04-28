var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require('./VerifyToken');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const student_lib = require('../student.js');
const teacher_lib = require('../teacher.js');

router.post("/login/student", async function (req, res) {
    var { user_name, password } = req.body;
    var qres = await student_lib.login(user_name, password);
    let token;

    qres = qres["loginstatus"];

    if (qres == "failed") {
        console.log("here");
        res
            .status(200)
            .json({
                success: false,
                data: {
                    user_name: qres.user_name,
                    password: qres.password,
                    token: "invalid",
                }
            })
    }
    else {
        try {
            token = jwt.sign(
                { user_name: qres.user_name, password: qres.password },
                "secret",
                { expiresIn: "1h" }
            );
        } catch (err) {
            console.log(err);
            const error = new Error("Error!!!");
            return next(error);
        }

        res
            .status(200)
            .json({
                success: true,
                data: {
                    user_name: qres.user_name,
                    password: qres.password,
                    token: token,
                }
            })
    }

});

router.post("/login/teacher", async function (req, res) {
    var { user_name, password } = req.body;
    var qres = await teacher_lib.login(user_name, password);
    let token;

    qres = qres["loginstatus"];

    if (qres == "failed") {
        res
            .status(200)
            .json({
                success: false,
                data: {
                    user_name: qres.user_name,
                    password: qres.password,
                    token: "invalid",
                }
            })
    }
    else {
        try {
            token = jwt.sign(
                { user_name: qres.user_name, password: qres.password },
                "secret",
                { expiresIn: "1h" }
            );
        } catch (err) {
            console.log(err);
            const error = new Error("Error!!!");
            return next(error);
        }

        res
            .status(200)
            .json({
                success: true,
                data: {
                    user_name: qres.user_name,
                    password: qres.password,
                    token: token,
                }
            })
    }

});

router.post("/register/student", async function (req, res) {

    const { student_id, user_name, password, first_name, last_name,
        date_of_birth, student_template, institute, facad } = req.body;

    var qres = await student_lib.register(student_id, user_name, password, first_name, last_name,
        date_of_birth, student_template, institute, facad);

    let token;

    if (qres["registerstatus"] != 'failed') {
        try {
            qres = qres["registerstatus"];
            console.log(qres.user_name)
            console.log(qres.password)
            token = jwt.sign(
                { user_name: qres.user_name, password: qres.password },
                "secret",
                { expiresIn: "1h" }
            );
        } catch (err) {
            console.log(err);
            const error = new Error("Error!!!");
            return next(error);
        }

        res.status(200).json({
            success: true,
            data: {
                user_name: qres.user_name,
                password: qres.password,
                token: token,
            }
        });
    }
    else {
        res.status(200).json({
            success: false,
            data: {
            }
        });
    }
})

router.post("/register/teacher", async function (req, res) {

    const { teacher_id, user_name, password, first_name, last_name,
        date_of_birth } = req.body;

    var qres = await teacher_lib.register(teacher_id, user_name, password, first_name, last_name,
        date_of_birth);

    let token;

    if (qres["registerstatus"] != 'failed') {
        try {
            qres = qres["registerstatus"];
            console.log(qres.user_name)
            console.log(qres.password)
            token = jwt.sign(
                { user_name: qres.user_name, password: qres.password },
                "secret",
                { expiresIn: "1h" }
            );
        } catch (err) {
            console.log(err);
            const error = new Error("Error!!!");
            return next(error);
        }

        res.status(200).json({
            success: true,
            data: {
                user_name: qres.user_name,
                password: qres.password,
                token: token,
            }
        });
    }
    else {
        res.status(200).json({
            success: false,
            data: {
            }
        });
    }
})


router.get('/me', VerifyToken, function (req, res, next) {
    res.status(200).json({
        user_name: req.user_name,
    });
});

module.exports = router;