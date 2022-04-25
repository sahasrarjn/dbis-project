var { query } = require('express');
const client = require('./obj.js');

const exam_lib = require('./exams.js');


async function get_all_teachers()
{
	query = `
		select teacher_id, CONCAT(first_name, ' ', last_name) as name
		from teacher
	`
	qres = await client.query(query);
	return qres.rows;
}

async function get_own_students(tid)
{
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

module.exports = 
{
	get_all_teachers,
	get_own_students
}