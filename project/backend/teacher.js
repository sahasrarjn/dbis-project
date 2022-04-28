var { query } = require('express');
const client = require('./obj.js');

const exam_lib = require('./exams.js');


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

async function register(roll_no, user_name, password, first_name, last_name,
	date_of_birth) {
	resp = {}

	query = `
    insert into teacher(teacher_id, user_name, password, first_name, last_name, 
        date_of_birth)
    values(${roll_no}, '${user_name}', '${password}', '${first_name}', '${last_name}','${date_of_birth}')`

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
	register
}