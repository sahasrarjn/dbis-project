var { query } = require('express');
const client = require('./obj.js');

const exam_lib = require('./exams.js');

async function get_teacher_data(tid) {
	resp = {};
	query = `
		select question_id, question_text, primary_difficulty
		from question
		where author=${tid}
	`
	qres = await client.query(query);
	resp['questions'] = qres.rows;

	query = `
		select student_id, concat(first_name, ' ', last_name) as name
		from student
		where facad = ${tid}
	`
	qres = await client.query(query);
	resp['students'] = qres.rows;

	query = `
		select teacher_id, concat(first_name, ' ', last_name) as name, date_of_birth, user_name
		from teacher
		where teacher_id = ${tid}
	`
	qres = await client.query(query);
	resp['teacher'] = qres.rows[0];
	return resp;

}
async function get_all_teachers() {
	query = `
		select teacher_id, CONCAT(first_name, ' ', last_name) as name
		from teacher
	`
	qres = await client.query(query);
	return qres.rows;
}

async function get_own_students(tid) {
	query =
		`
		select student_id, CONCAT(first_name, ' ', last_name) as name, institute_id, institute.name as institute_name
		from student, institute
		where student.institute = institute.institute_id and
			student.facad = ${tid}
	`
	qres = await client.query(query);
	return qres.rows;
}

async function login(user_name, password) {
	resp = {}
	query = `
    select * from 
    teacher 
    where user_name = '${user_name}' and password = '${password}'`

	qres = await client.query(query);
	resp['loginstatus'] = qres.rows[0];

	if (resp['loginstatus'] == undefined) {
		resp['loginstatus'] = "failed";
	}
	return resp;
}

async function register(user_name, password, first_name, last_name,
	date_of_birth) {
	resp = {}

	query = `
		select 1+max(teacher_id) as teacher_id from teacher
	`
	qres = await client.query(query);
	t_id = qres.rows[0].teacher_id;

	query = `
    insert into teacher(teacher_id, user_name, password, first_name, last_name, 
        date_of_birth)
    values(${t_id}, '${user_name}', '${password}', '${first_name}', '${last_name}','${date_of_birth}')`

	after_query = `select * from teacher where user_name = '${user_name}'`

	try {
		qres = await client.query(query);
		qres = await client.query(after_query);
		resp['registerstatus'] = qres.rows[0];
		return resp;
	}
	catch (err) {
		console.log(err);
		resp['registerstatus'] = "failed";
		return resp;
	}
}

module.exports =
{
	get_all_teachers,
	get_own_students,
	login,
	register,
	get_teacher_data
}