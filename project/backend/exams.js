var { query } = require('express');
const client = require('./obj.js');

const question_lib = require('./question.js');
async function get_all_exams()
{
	query = `
		select exam.exam_id, exam.exam_name, exam.year, exam_type.type, exam_type.duration
		from exam, exam_type
		where exam.exam_type_id = exam_type.id 
	`
	qres = await client.query(query);
	return qres.rows;
}

async function get_exam_types()
{
    query = `select * from exam_type`
    qres = await client.query(query);
    return qres.rows;
}

async function get_exam_data(exam_id)
{
    // exam name, exam type, exam duration, no of students, avg score, max score
    resp={};
    // todo (prabs) : not working
    
    query = `
        with x as
        (
            select exam_name, year, exam_type, duration, type, num_ques
            from exam, exam_type
            where exam.exam_type_id = exam_type.id
            and exam_id = ${exam_id}
        ),
        y as
        (
            select student_id, sum(marks) as marks
            from student_exam_ques_stat
            where exam_id = ${exam_id} 
            group by student_id
        ),
        z as
        (
            select round(avg(marks), 2) as avg_marks, max(marks) as max_marks, count(*) as num_students
            from y
        )
        select * from x, z
    `

    qres = await client.query(query);
    resp['overall'] = qres.rows[0];

    query = `
        select question.question_id, question_text, primary_difficulty
        from question natural join exam_question
        where exam_id = ${exam_id}
    `
    qres = await client.query(query);
    resp['questions'] = qres.rows;

    return resp;
}

async function auto_create_exam(exam_name, exam_type, max_diff, min_diff, tags, author)
{
    if (tags == null || tags=="")
	{
		tg = await question_lib.get_all_tags();
		tags = [];
		for(let i=0; i<tg.length; i++)
			tags.push(tg[i].tag_id);
		
	}
    tgstr = '(' + tags.join(',') + ')';
    query = `
        select num_ques from exam_type
        where id = ${exam_type}
    `
    qres = await client.query(query);
    n = qres.rows[0].num_ques;
    query =  `
        with x as
        (
            select distinct question_id
            from all_ques_tags
            where tag in ${tgstr}
        )
        select question_id 
        from question
        where primary_difficulty >= ${min_diff} and primary_difficulty <= ${max_diff} and 
        question_id in (select * from x)      
    `
    qres = await client.query(query);
    qids = [];
    for(let i=0; i<qres.rows.length; i++)
        qids.push(qres.rows[i].question_id);
    var shuff = qids.sort(() => Math.random() - 0.5);
    let selected_questions = shuff.slice(0, n);
    query = `
        select 1+max(exam_id) as exam_id from exam
    `
    qres = await client.query(query);
    eid = qres.rows[0].exam_id;
    upd = `
        insert into exam values(${eid},'${exam_name}', 2022, ${exam_type}, ${author});
    `
    // console.log(upd);
    ret = await client.query(upd);
    // console.log("insert done");
    
    for(let i=0; i<selected_questions.length; i++)
    {
        query = `
            select 1+max(eq_id) as rid from exam_question
            `
        qres = await client.query(query);
        rid = qres.rows[0].rid;
        upd = `
            insert into exam_question values(${rid},${eid}, ${selected_questions[i]});
        `
        await client.query(upd);
    }
    return ret.rows;

}

async function manual_exam(exam_name, selected_questions, exam_type, author)
{
    query = `
        select 1+max(exam_id) as exam_id from exam
    `
    qres = await client.query(query);
    eid = qres.rows[0].exam_id;
    upd = `
        insert into exam values(${eid},'${exam_name}', 2022, ${exam_type}, ${author});
    `
    // console.log(upd);
    ret = await client.query(upd);
    // console.log("insert done");

    for(let i=0; i<selected_questions.length; i++)
    {
        query = `
            select 1+max(eq_id) as rid from exam_question
            `
        qres = await client.query(query);
        rid = qres.rows[0].rid;
        upd = `
            insert into exam_question values(${rid},${eid}, ${selected_questions[i]});
        `
        await client.query(upd);
    }
    return ret.rows;
}
module.exports = 
{
    get_all_exams,
    auto_create_exam,
    manual_exam,
    get_exam_data,
    get_exam_types
}