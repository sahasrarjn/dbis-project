var { query } = require('express');
const client = require('./obj.js');

const exam_lib = require('./exams.js');
async function get_all_institutes()
{
	query = `
		with x as
		(
			select count(*) as num_students, institute as institute_id
			from student
			group by institute_id
		)
		select * from institute natural join x
	`
	qres = await client.query(query);
	return qres.rows;
}

async function get_institute_data(iid)
{
	resp = {}
	query = `
		select *
		from institute
		where institute_id = ${iid}
	`
	qres = await client.query(query);
	resp['general'] = qres.rows[0];

	query = `
		select student_id, CONCAT(first_name, ' ', last_name) as name
		from student
		where institute = ${iid}
	`
	qres = await client.query(query);
	resp['students'] = qres.rows;

	query = `
		with x as
		(
			select student_id 
			from student
			where institute = ${iid}
		),
		y as
		(
			select student_id, exam_id, sum(marks) as marks, sum(time_taken) as time_taken
			from student_exam_ques_stat
			group by exam_id, student_id
		),
		z as
		(
			select *, RANK() OVER (PARTITION BY exam_id ORDER BY marks DESC, time_taken) as rnk
			from y
		),
		w as
		(
			select * from z
			where student_id in (select * from x)
		),
		r as
		(
			select exam_id, avg(marks) as avg_marks, avg(time_taken) as avg_time, min(rnk) as best_rank
			from w
			group by exam_id
		)
		select r.exam_id, exam.exam_name, avg_marks, avg_time, best_rank
		from r natural join exam
	`
	// todo (prabs): round off return kar de
	qres = await client.query(query)
	resp['exams'] = qres.rows
	return resp;
}


module.exports = 
{
	get_all_institutes,
	get_institute_data
}