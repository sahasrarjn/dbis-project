const env = require('dotenv').config({path: __dirname + '/.env'});
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
var upload = multer();

app.options('*', cors());
app.use(cors());
app.use(upload.array()); 
app.use(express.static('public'));
app.use(bodyParser.json());
HOST = (process.env.PGHOST ? process.env.PGHOST : '0.0.0.0');

const tacher_lib = require('./teacher.js');
const exam_lib = require('./exams.js');
const question_lib = require('./question.js');
const student_lib = require('./student.js');


const { Client } = require('pg');
var { query } = require('express');

const client = new Client();
client.connect();

app.get('/tags_list', async function(req, res){
    /*
    [
        {
            "tag_id": 1,
            "tag_name": "Array"
        },
        {
            "tag_id": 2,
            "tag_name": "Matrix"
        },
        {
            "tag_id": 3,
            "tag_name": "String"
        },
        {
            "tag_id": 4,
            "tag_name": "Searching & Sorting"
        }
    ]
    */
    qres = await question_lib.get_all_tags();
    res.send(qres);
})

app.get('/exam_types', async function(req, res){
    /*
    [
        {
            "id": 0,
            "type": "State",
            "duration": 30,
            "num_ques": 2
        },
        {
            "id": 1,
            "type": "Educational",
            "duration": 60,
            "num_ques": 3
        },
        {
            "id": 2,
            "type": "Standard",
            "duration": 90,
            "num_ques": 4
        },
        {
            "id": 3,
            "type": "National",
            "duration": 120,
            "num_ques": 6
        }
        ]
    */
    var qres = await exam_lib.get_exam_types();
    res.send(qres);
})

app.get('/questions', async function(req, res){
    // needs diff_lower, diff_upper, author_id, tags(as array)
    var { diff_lower, diff_upper, author_id, tags } = req.query;
    // pass empty string if no filter
    
    // Todo: return tags names instead of ids
    /*
    [
        {
            "question_id": 320,
            "question_text": "Merge “K” Sorted Linked Lists [V.IMP]",
            "primary_difficulty": 1800,
            "author": "Mark Anderson",
            "tags": [
                11
            ],
            "author_id": 1044
        },
        {
            "question_id": 62,
            "question_text": "Balanced Parenthesis problem.[Imp]",
            "primary_difficulty": 1600,
            "author": "Martin Rhodd",
            "tags": [
                14,
                15,
                3,
                4
            ],
            "author_id": 1038
        },
        {
            "question_id": 35,
            "question_text": "Median of 2 sorted arrays of equal size",
            "primary_difficulty": 1600,
            "author": "Gene Wood",
            "tags": [
                4,
                2,
                15,
                1,
                23,
                3,
                14,
                16,
                8
            ],
            "author_id": 1017
        }
    ]
    */
    
    var qres = await question_lib.get_all_questions(diff_lower, diff_upper, author_id, tags);
    // console.log(qres);
    res.send(qres);
})

app.get('/question_data', async function(req, res){
    // needs question_id as qid
    var qid = req.query.qid;
    /*
    // Todo: return tags names instead of ids
    returns resp as
    resp:
    {
        general:
        {
            question_id
            question_text
            primary_difficulty
            author_id as author
            first_name as author_first_name
            last_name as author_last_name
        },
        tags:
        {
            tags: [tag1, tag2, ...]
        },
        exams:
        [
            {
                exam_id
                exam_name
            }
        ],
        stats:
        {
            avg_time
            perc
            student_rating
        },
        demographics:
        [
            {
                institute_id as institute
                insti_name as name
                avg_time
                perc
                student_rating
            }
        ]

    }
    */
    
    var qres = await question_lib.get_question_data(qid);
    res.send(qres);
})

app.post('/create_random_exam', async function(req, res){
    // exam_name, exam_type, max_diff, min_diff, tags, authorid as author
    // returns nothing
    var exam_name = req.body.exam_name;
    var exam_type = req.body.exam_type;
    var max_diff = req.body.max_diff;
    var min_diff = req.body.min_diff;
    var tags = req.body.tags;
    var author = req.body.author;
    // console.log(req.body);
    var qres = await exam_lib.auto_create_exam(exam_name, exam_type, max_diff, min_diff, tags, author);
    res.send(qres);
})

app.post('/create_manual_exam', async function(req, res){
    var {exam_name, exam_type, qids, author} = req.body;
    var qres = await exam_lib.manual_exam(exam_name, qids, exam_type, author);
    res.send(qres);
})

app.get('/get_exam_data', async function(req, res){
    var exam_id = req.query.exam_id;
    /*
    {
        "overall": {
            "exam_name": "National1153",
            "year": 2016,
            "exam_type": "(3,National,120,6)",
            "duration": 120,
            "type": "National",
            "num_ques": 6,
            "avg_marks": "2.95",
            "max_marks": "6",
            "num_students": "264"
        },
        "questions": [
            {
                "question_id": 27,
                "question_text": "Find whether an array is a subset of another array",
                "primary_difficulty": 1700
            },
            {
                "question_id": 187,
                "question_text": "Sum of Nodes on the Longest path from root to leaf node",
                "primary_difficulty": 1700
            },
            {
                "question_id": 220,
                "question_text": "Job SequencingProblem",
                "primary_difficulty": 1700
            },
            {
                "question_id": 336,
                "question_text": "flood fill algo",
                "primary_difficulty": 1300
            },
            {
                "question_id": 388,
                "question_text": "Gold Mine Problem",
                "primary_difficulty": 1900
            },
            {
                "question_id": 425,
                "question_text": "Count Derangements (Permutation such that no element appears in its original position) [ IMPORTANT ]",
                "primary_difficulty": 1200
            }
        ]
    }
    */
    
    var qres = await exam_lib.get_exam_data(exam_id);
    res.send(qres);
})

app.get('/get_own_students', async function(req, res){
    var tid = req.query.tid;
    /*
[
    {
        "student_id": 20029,
        "name": "Antoinette Leslie",
        "institute_id": 20,
        "institute_name": "Amrita School of Engineering"
    },
    {
        "student_id": 20052,
        "name": "Patrick Roth",
        "institute_id": 70,
        "institute_name": "R. V. College of Engineering"
    }
]
    */
    var qres = await tacher_lib.get_own_students(tid);
    res.send(qres);
})

app.get('/get_attempted_questions', async function(req, res){
    var sid = req.query.sid;
    /*
    [
        {
            "question_id": 9,
            "question_text": "Minimise the maximum difference between heights [V.IMP]",
            "primary_difficulty": 1800
        },
        {
            "question_id": 10,
            "question_text": "Minimum no. of Jumps to reach end of an array",
            "primary_difficulty": 2000
        }
    ]
    */
    var qres = await student_lib.get_attempted_questions(sid);
    res.send(qres);
})

app.get('/get_attempted_exams', async function(req, res){
    var sid = req.query.sid;
    /*
    [
        {
            "exam_id": 40000,
            "exam_name": "Standard5346",
            "year": 2016
        },
        {
            "exam_id": 40003,
            "exam_name": "National5677",
            "year": 2017
        }
    ]
    */
    
    var qres = await student_lib.get_attempted_exams(sid);
    res.send(qres);
})

app.get('/get_report_card', async function(req, res){
    var sid = req.query.sid;
    var eid = req.query.eid;
    /*
    {
        "ques_wise": 
        [
            {
                "question_id": 251,
                "question_text": "Find smallest number with given number of digits and sum of digits",
                "marks": 1,
                "time_taken": 14
            },
            {
                "question_id": 42,
                "question_text": "Maximum size rectangle",
                "marks": 1,
                "time_taken": 10
            },
            {
                "question_id": 353,
                "question_text": "Snake and Ladders Problem",
                "marks": 0,
                "time_taken": 6
            },
            {
                "question_id": 140,
                "question_text": "Find the middle Element of a linked list.",
                "marks": 1,
                "time_taken": 7
            },
            {
                "question_id": 441,
                "question_text": "Count number of bits to be flipped to convert A to B",
                "marks": 0,
                "time_taken": 14
            },
            {
                "question_id": 169,
                "question_text": "Postorder Traversal of a tree both using recursion and Iteration",
                "marks": 1,
                "time_taken": 8
            }
        ],
        "overall": 
        {
            "marks": "4/6",
            "time_taken": "59",
            "rank": "108 / 131"
        }
    }
    */
    var qres = await student_lib.get_report_card(eid, sid);
    res.send(qres);
})


var server = app.listen(8081, HOST, function () {
    var host = server.address().address
    var port = server.address().port
 
    console.log("Example app listening at http://%s:%s", host, port)
 })
 