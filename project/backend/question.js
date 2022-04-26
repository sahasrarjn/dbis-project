var { query } = require('express');
const client = require('./obj.js');

async function get_all_tags()
{
	query = `
		select *
		from tags
	`
	qres = await client.query(query);
	return qres.rows;
}


async function get_all_questions(diff_lower, diff_upper, author_id, tags)
{
	if (diff_lower == null || diff_lower=="")
		diff_lower = 0;
	if (diff_upper == null || diff_lower =="")
		diff_upper = 10000;
	if (tags == null || tags=="")
	{
		tg = await get_all_tags();
		tags = [];
		for(let i=0; i<tg.length; i++)
			tags.push(tg[i].tag_id);
		
	}
		
	tgstr = '(' + tags.join(',') + ')';
	if (author_id == null || author_id=="")
	{   
		query = `
		with x as
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
			select x.question_id, question_text, x.primary_difficulty, author, ARRAY_AGG(tag) as tags, author_id
			from x, all_ques_tags
			where x.question_id = all_ques_tags.question_id
			group by x.question_id, question_text, x.primary_difficulty, author, author_id
		)
		select * from y
		`
	}
	else
	{   
		query = `
		with x as
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
			select x.question_id, question_text, primary_difficulty, author, ARRAY_AGG(tag) as tags, author_id
			from x, all_ques_tags
			where x.question_id = all_ques_tags.question_id
			group by x.question_id, question_text, x.primary_difficulty, author, author_id
		)
		select * from y
		`
	}
	// console.log(query)
	qres = await client.query(query);
	return qres.rows;
}

async function get_question_data(qid)
{
    var resp={}
    query = `
        select question_text, primary_difficulty, author, question_id
        from question
        where question_id = ${qid}
    `
    qres = await client.query(query);
    resp['general'] = qres.rows[0];
    query = `
        select ARRAY_AGG(tag) as tags from all_ques_tags where question_id = ${qid}
    `
    qres = await client.query(query);
    resp['tags'] = qres.rows[0];
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
    console.log(query);
    qres = await client.query(query);
    resp['exams'] = qres.rows;

    query = `
        with x as
        (
            select avg(time_taken) as avg_time, 100*avg(marks) as perc, avg(relevance) as student_rating
            from student_exam_ques_stat
            where question_id = ${qid}
        )
        select round(avg_time, 2) as avg_time, round(perc, 2) as perc, round(student_rating, 0) as student_rating
        from x
    `
    qres = await client.query(query);
    resp['stats'] = qres.rows[0];

    query = `
        with x as
        (
            select student_id, avg(time_taken) as avg_time, 100*avg(marks) as perc, avg(relevance) as student_rating
            from student_exam_ques_stat
            where question_id = ${qid}
            group by student_id
        ),
        y as
        (
            select institute, avg(round(avg_time, 2)) as avg_time, avg(round(perc, 2)) as perc, avg(round(student_rating, 0)) as student_rating
            from x, student
            where x.student_id = student.student_id
            group by institute
        )
        select institute, institute.name, avg_time, perc, student_rating
        from y, institute
        where y.institute = institute.institute_id

    `
    qres = await client.query(query);
    resp['demographics'] = qres.rows;
    return resp;

}

module.exports = 
{
    get_all_tags,
    get_all_questions,
    get_question_data
}

