var { query } = require('express');
const client = require('./obj.js');

async function get_soln(qid)
{
	query = `select answer from question where question_id = ${qid}`;
	qres = await client.query(query);
	return qres.rows[0];
}

async function get_all_tags()
{
	query = `
		select *
		from tags
	`
	qres = await client.query(query);
	return qres.rows;
}

async function create_question(qtext, diff, ans, tc, auth, tags)
{
	query = `
		select max(question_id)+1 as qid
		from question
	`
	qres = await client.query(query);
	qid = qres.rows[0].qid;
	query = `
		insert into question values(${qid}, '${qtext}', ${diff}, '${ans}', '${tc}', 'public', ${auth})
	`
	resp = await client.query(query);
	for(let i=0; i<tags.length; i++)
	{
		query = `
			select max(id)+1 as rid
			from question_tags
		`
		qres = await client.query(query);
		rid = qres.rows[0].rid;
		query = `
			insert into question_tags values(${rid}, ${qid}, ${tags[i]})
		`
		qres = await client.query(query);
	}
	return resp;
}
async function get_all_questions(diff_lower, diff_upper, author_id, tags)
{
	if (diff_lower == null || diff_lower=="")
		diff_lower = 0;
	if (diff_upper == null || diff_upper =="")
		diff_upper = 10000;
	if (tags == null || tags=="")
	{
		// tg = await get_all_tags();
		tags = [];
		// for(let i=0; i<tg.length; i++)
		// 	tags.push(tg[i].tag_id);
		
	}
		
	tgstr = '(';
	for(let i=0; i<tags.length; i++)
	{
		if (i!=0)
			tgstr += ',';
		tgstr += tags[i];
	}
	tgstr += ')';
	if(tgstr == '()'){
		tgstr = '(0)';
	}

	if (author_id == null || author_id=="")
	{   
		resp = {}
		query1 = `
		with x1 as
		(
			select question_id, question_text, question.primary_difficulty, CONCAT(teacher.first_name, ' ', teacher.last_name) as author, question.author as author_id
			from question, teacher
			where question.author = teacher.teacher_id and
				question.primary_difficulty >= ${diff_lower} and question.primary_difficulty <= ${diff_upper} and
				question_id in
				(select question_id from question_tags where tag_id in ${tgstr})
		),
		y1 as
		(
			select x1.question_id, question_text, x1.primary_difficulty, author, ARRAY_AGG(tag_name) as tags, author_id
			from x1, ques_tags_names
			where x1.question_id = ques_tags_names.question_id
			group by x1.question_id, question_text, x1.primary_difficulty, author, author_id
		)

		`
	}
	else
	{   
		query1 = `
		with x1 as
		(
			select question_id, question_text, question.primary_difficulty, CONCAT(teacher.first_name, ' ', teacher.last_name) as author, question.author as author_id
			from question, teacher
			where question.author = teacher.teacher_id and
				question.primary_difficulty >= ${diff_lower} and question.primary_difficulty <= ${diff_upper} and
				question.author = ${author_id} and
				question_id in
				(select question_id from question_tags where tag_id in ${tgstr})
		),
		y1 as
		(
			select x1.question_id, question_text, primary_difficulty, author, ARRAY_AGG(tag_name) as tags, author_id
			from x1, ques_tags_names
			where x1.question_id = ques_tags_names.question_id
			group by x1.question_id, question_text, x1.primary_difficulty, author, author_id
		)
		`
	}
	// console.log(query1 + ' select * from y1');
	qres = await client.query(query1+ ' select * from y1');
	resp['direct'] = qres.rows;

	

	if (author_id == null || author_id=="")
	{   
		query2 = `
		,
		x as
		(
			select question_id, question_text, question.primary_difficulty, CONCAT(teacher.first_name, ' ', teacher.last_name) as author, question.author as author_id
			from question, teacher
			where question.author = teacher.teacher_id and
				question.primary_difficulty >= ${diff_lower} and question.primary_difficulty <= ${diff_upper} and
				question_id in
				(select question_id from all_ques_tags where tag in ${tgstr})
		),
		y as
		(
			select x.question_id, question_text, x.primary_difficulty, author, ARRAY_AGG(tag_name) as tags, author_id
			from x, all_ques_tags_names
			where x.question_id = all_ques_tags_names.question_id
			group by x.question_id, question_text, x.primary_difficulty, author, author_id
		)
		select * from y
		where question_id not in (select question_id from y1)
		`
	}
	else
	{   
		query2 = `
		,
		x as
		(
			select question_id, question_text, question.primary_difficulty, CONCAT(teacher.first_name, ' ', teacher.last_name) as author, question.author as author_id
			from question, teacher
			where question.author = teacher.teacher_id and
				question.primary_difficulty >= ${diff_lower} and question.primary_difficulty <= ${diff_upper} and
				question.author = ${author_id} and
				question_id in
				(select question_id from all_ques_tags where tag in ${tgstr})
		),
		y as
		(
			select x.question_id, question_text, primary_difficulty, author, ARRAY_AGG(tag_name) as tags, author_id
			from x, all_ques_tags_names
			where x.question_id = all_ques_tags_names.question_id
			group by x.question_id, question_text, x.primary_difficulty, author, author_id
		)
		select * from y
		where question_id not in (select question_id from y1)
		`
	}
	query = query1+query2;
	// console.log(query)
	qres = await client.query(query);
	resp['related'] = qres.rows;
	return resp;
}

async function get_question_data(qid)
{
    var resp={}
    query = `
        select question_text, primary_difficulty, author, question_id, first_name as author_first_name, last_name as author_last_name
        from question
		inner join teacher on question.author = teacher.teacher_id
        where question_id = ${qid}
    `
    qres = await client.query(query);
    resp['general'] = qres.rows[0];

	query = `
        select ARRAY_AGG(tag_name) as tags from ques_tags_names where question_id = ${qid}
    `
    qres = await client.query(query);
    resp['basic_tags'] = qres.rows[0];

    query = `
        select ARRAY_AGG(tag_name) as tags from all_ques_tags_names where question_id = ${qid}
    `
    qres = await client.query(query);
    resp['related_tags'] = qres.rows[0];
    query = `
        with x as
        (
            select distinct exam_id from student_exam_ques_stat
            where question_id = ${qid}
        )
        select x.exam_id, exam.exam_name 
        from x, exam
        where x.exam_id = exam.exam_id
    `
    // console.log(query);
    qres = await client.query(query);
    resp['exams'] = qres.rows;

    query = `
        with x as
        (
            select avg(time_taken) as avg_time, 100*avg(marks) as perc, avg(relevance) as student_rating, avg(rating) as stud_diff
            from student_exam_ques_stat
            where question_id = ${qid}
        )
        select round(avg_time, 2) as avg_time, round(perc, 2) as perc, round(student_rating, 0) as student_rating, round(stud_diff, 0) as stud_diff
        from x
    `
    qres = await client.query(query);
    resp['stats'] = qres.rows[0];

    query = `
        with x as
        (
            select student_id, avg(time_taken) as avg_time, 100*avg(marks) as perc, avg(relevance) as student_rating,  avg(rating) as stud_diff
            from student_exam_ques_stat
            where question_id = ${qid}
            group by student_id
        ),
        y as
        (
            select institute, avg(round(avg_time, 2)) as avg_time, avg(round(perc, 2)) as perc, avg(round(student_rating, 0)) as student_rating, avg(round(stud_diff, 0)) as stud_diff
            from x, student
            where x.student_id = student.student_id
            group by institute
        )
        select institute, institute.name, avg_time, perc, student_rating, stud_diff
        from y, institute
        where y.institute = institute.institute_id

    `
    qres = await client.query(query);
    resp['demographics'] = qres.rows;

	query = `
		with x as
		(
			select exam_id, student_id, time_taken, marks, relevance
			from student_exam_ques_stat
			where question_id = ${qid}
		)
		select x.student_id, CONCAT(first_name, ' ', last_name) as student_name, x.exam_id, exam_name,
			time_taken, marks, relevance
		from x, exam, student
		where x.exam_id = exam.exam_id and x.student_id = student.student_id
		order by student_name
	`
	qres = await client.query(query);
	resp['student_data'] = qres.rows;

    return resp;

}

module.exports = 
{
    get_all_tags,
    get_all_questions,
    get_question_data,
	create_question,
	get_soln
}

