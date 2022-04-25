var { query } = require('express');
const client = require('./obj.js');

const question_lib = require('./question.js');

async function get_attempted_questions(sid)
{
    query = `
        with x as
        (
            select distinct question_id
            from student_exam_ques_stat
            where student_id = ${sid}
        )
        select question_id, question_text, primary_difficulty
        from question
        where question_id in (select * from x)
    `
    qres = await client.query(query);
    return qres.rows;
}

async function get_attempted_exams(sid)
{
    query = `
        with x as
        (
            select distinct exam_id
            from student_exam_ques_stat
            where student_id = ${sid}
        )
        select exam_id, exam_name, year
        from exam
        where exam_id in (select * from x);
    `
    qres = await client.query(query);
    return qres.rows;
}

async function get_report_card(eid, sid)
{
    resp = {}
    query = `
        with x as
        (
            select question_id, marks, time_taken
            from student_exam_ques_stat
            where
                student_id = ${sid} and
                exam_id = ${eid}
        ),
        y as
        (
            select x.question_id, question_text, marks, time_taken
            from x, question
            where x.question_id = question.question_id  
        )
        select * from y
        `
    qres = await client.query(query);
    resp['ques_wise']=qres.rows;

    query = `
        with x as
        (
            select student_id, sum(marks) as marks, sum(time_taken) as time_taken, count(*) as num_ques
            from student_exam_ques_stat
            where exam_id = ${eid}
            group by student_id
        ),
        y as
        (
            select student_id, marks, num_ques, time_taken, RANK() OVER (ORDER BY marks, time_taken DESC) as rnk
            from x
        )
        select CONCAT(marks, '/', num_ques) as marks, time_taken, CONCAT(rnk, ' / ', (select count(*) from y)) as rank
        from y
        where student_id = ${sid}
    `
    qres = await client.query(query);
    resp['overall'] = qres.rows[0];
    return resp;
}

module.exports=
{
    get_attempted_questions,
    get_attempted_exams,
    get_report_card
}