const env = require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const jwt = require('jsonwebtoken');

var upload = multer();

app.options('*', cors());
app.use(cors());
app.use(upload.array());
app.use(express.static('public'));
app.use('/media', express.static('media'));
app.use(bodyParser.json());

var AuthController = require('./auth/AuthController');
app.use('/auth', AuthController);
module.exports = app;

HOST = (process.env.PGHOST ? process.env.PGHOST : '0.0.0.0');

const teacher_lib = require('./teacher.js');
const exam_lib = require('./exams.js');
const question_lib = require('./question.js');
const student_lib = require('./student.js');
const insti_lib = require('./institute.js')


const { Client } = require('pg');
var { query } = require('express');
const { nextTick } = require('async');

const client = new Client();
client.connect();

app.get('/tags_list', async function (req, res) {
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

app.get('/exam_types', async function (req, res) {
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

app.get('/questions', async function (req, res) {
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

app.get('/question_data', async function (req, res) {
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
		"basic_tags": 
		{
			"tags": 
			[
				"Bit Manipulation"
			]
		},
		"related_tags": 
		{
			"tags": 
			[
				"Array",
				"String",
				"Greedy",
				"Dynamic Programming",
				"Bit Manipulation",
				"Math",
				"Divide and Conquer"
			]
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
			stud_diff
		},
		demographics:
		[
			{
				institute_id as institute
				insti_name as name
				avg_time
				perc
				student_rating
				stud_diff
			}
		],
		student_data: 
		[
			{
				"student_id": 20197,
				"student_name": "Deann Torres",
				"exam_id": 40096,
				"exam_name": "National5284",
				"time_taken": 12,
				"marks": 0,
				"relevance": 3
			}
		]

	}
	*/

	var qres = await question_lib.get_question_data(qid);
	res.send(qres);
})

app.post('/attempt_exam', async function (req, res) {
	var { sid, eid } = req.body;
	var qres = await student_lib.attempt_exam(sid, eid);
	res.send(qres);
})

app.post('/create_question', async function (req, res) {
	var { qtext, diff, ans, tc, auth, tags } = req.body;
	var qres = await question_lib.create_question(qtext, diff, ans, tc, auth, tags);
	res.send(qres);
})

app.post('/create_random_exam', async function (req, res) {
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

app.post('/create_manual_exam', async function (req, res) {
	var { exam_name, exam_type, qids, author } = req.body;
	var qres = await exam_lib.manual_exam(exam_name, qids, exam_type, author);
	res.send(qres);
})

app.get('/get_exam_data', async function (req, res) {
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
		"students": 
		[
			{
				"student_id": 20901,
				"marks": "6",
				"time_taken": "44",
				"rnk": "1",
				"name": "David Cox"
			}
		],
		"institutes": 
		[
			{
				"institute_id": 74,
				"insti_name": "Indian Institute of Food Processing Technology (IIFPT)",
				"avg_marks": "1.5000000000000000",
				"avg_time": "70.0000000000000000"
			}
		]
	}
	*/

	var qres = await exam_lib.get_exam_data(exam_id);
	res.send(qres);
})

app.get('/get_teacher', async function (req, res) {
	tid = req.query.tid;
	/*
	"questions": 
	[
		{
			"question_id": 48,
			"question_text": "Check whether a String is Palindrome or not",
			"primary_difficulty": 1400
		}
	],
	"students": 
	[
		{
			"student_id": 20014,
			"name": "Christopher Clancy"
		}
	],
	"teacher": 
	{
		"teacher_id": 1001,
		"name": "Connie Collins",
		"date_of_birth": "1963-07-09T18:30:00.000Z",
		"user_name": "Conni830"
	}
	*/
	var qres = await teacher_lib.get_teacher_data(tid);
	res.send(qres);
})

app.get('/get_all_teachers', async function (req, res) {
	var qres = await teacher_lib.get_all_teachers();
	res.send(qres);
})

app.get('/get_student', async function (req, res) {
	var sid = req.query.sid;
	/*
		{
			"student_id": 20001,
			"first_name": "Nancy",
			"last_name": "Carney",
			"user_name": "NancyCarne1984",
			"institute": 2,
			"facad": 1015,
			"name": "Indian Institute of Technology Delhi",
			"facad_name": "Caridad Dean"
		}
	*/
	var qres = await student_lib.get_student_data(sid);
	res.send(qres);
})

app.get('/get_all_teachers', async function (req, res) {
	var qres = await teacher_lib.get_all_teachers();
	res.send(qres);
})

app.get('/get_own_students', async function (req, res) {
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

app.get('/get_attempted_questions', async function (req, res) {
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

app.get('/get_attempted_exams', async function (req, res) {
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

app.get('/get_all_exams', async function (req, res) {
	var author = req.query.author; //empty if all exams are needed
	/*
		[
			{
				"exam_id": 40046,
				"exam_name": "State4463",
				"year": 2021,
				"type": "State",
				"duration": 30
			}
		]
	*/
	var qres = await exam_lib.get_all_exams(author);
	res.send(qres);
})

app.get('/get_report_card', async function (req, res) {
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
		},
		"students": 
		[
			{
				"student_id": 20901,
				"marks": "6",
				"time_taken": "44",
				"rnk": "1",
				"name": "David Cox"
			}
		],

	}
	*/
	var qres = await student_lib.get_report_card(eid, sid);
	res.send(qres);
})

app.get('/get_all_insti', async function (req, res) {
	/*
	{
		"institute_id": 1,
		"name": "Indian Institute of Technology Madras",
		"location": "Tamil Nadu",
		"num_students": "10"
	}
	*/
	var qres = await insti_lib.get_all_institutes();
	res.send(qres)
})

app.get('/get_insti', async function (req, res) {
	var iid = req.query.iid;
	/*
		"general": 
		{
			"institute_id": 2,
			"name": "Indian Institute of Technology Delhi",
			"location": "Delhi"
		},
		"students": 
		[
			{
				"student_id": 20001,
				"name": "Nancy Carney"
			}
		],
		"exams": 
		[
			{
				"exam_id": 40004,
				"exam_name": "Standard1175",
				"avg_marks": "4.0000000000000000",
				"avg_time": "32.0000000000000000",
				"best_rank": "12"
			}
		]
	*/
	var qres = await insti_lib.get_institute_data(iid);
	res.send(qres);
})

// Todo (prabs): get teacher, return student list who's facad is the teacher. List of questions prepared by the teacher.

var server = app.listen(8081, HOST, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)
})

