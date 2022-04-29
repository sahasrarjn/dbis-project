var { query } = require('express');
const client = require('./obj.js');

const question_lib = require('./question.js');

async function get_template(sid)
{
    query = `
        select * from template
        where template_id = (select student_template from student where student_id = ${sid})
    `
    console.log(query);
    qres = await client.query(query);
    return qres.rows[0];
}

async function attempt_exam(sid, eid)
{
    query = `
        select question_id
        from exam_question
        where exam_id = ${eid}
    `
    qres = await client.query(query);
    qres = qres.rows;

    for (let i = 0; i < qres.length; i++) {
        qid = qres[i].question_id;
        query = `
            select max(statid)+1 as rid from student_exam_ques_stat
        `
        qres1 = await client.query(query);
        rid = qres1.rows[0].rid;
        marks = Math.floor(Math.random() * 2);
        time = 5 + Math.floor(Math.random() * 10);
        diff = 100 * Math.floor(Math.random() * 11) + 1000;
        rel = Math.floor(Math.random() * 10) + 1;
        query = `
            insert into student_exam_ques_stat values(${rid}, ${sid}, ${qid}, ${eid}, ${marks}, ${time}, ${diff}, ${rel})
            `
        //qres = await client.query(query);
        try{
            qres2 = await client.query(query);
        }
        catch{}
    }

    return qres1;

}
async function get_student_data(sid) {
    query = `
        with x as
        (
            select student_id, first_name, last_name, user_name, institute, facad
            from student
            where student_id = ${sid}
        )
        select student_id, x.first_name, x.last_name, x.user_name, x.institute, x.facad,
        institute.name, CONCAT(teacher.first_name, ' ', teacher.last_name) as facad_name
        from x, institute, teacher
        where x.institute = institute.institute_id and
            x.facad = teacher.teacher_id
    `
    qres = await client.query(query);
    return qres.rows[0];
}

async function get_attempted_questions(sid) {
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

async function get_attempted_exams(sid) {
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

async function get_report_card(eid, sid) {
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
    resp['ques_wise'] = qres.rows;

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
            select student_id, marks, num_ques, time_taken, RANK() OVER (ORDER BY marks DESC, time_taken ) as rnk
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

async function login(user_name, password) {
    resp = {}
    query = `
    select * from 
    student 
    where user_name = '${user_name}' and password = '${password}'`

    qres = await client.query(query);
    resp['loginstatus'] = qres.rows[0];

    if (resp['loginstatus'] == undefined) {
        resp['loginstatus'] = "failed";
    }
    return resp;
}

async function register(user_name, password, first_name, last_name,
    date_of_birth, student_template, institute, facad) {
    resp = {}

    query = `
		select 1+max(student_id) as student_id from student
	`
    qres = await client.query(query);
    new_id = qres.rows[0].student_id;

    query = `
    insert into student(student_id, user_name, password, first_name, last_name, 
        date_of_birth, student_template, institute, facad)
    values(${new_id}, '${user_name}', '${password}', '${first_name}', '${last_name}','${date_of_birth}',
    ${student_template},${institute},${facad})`

    after_query = `select * from student where user_name = '${user_name}'`

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
    get_attempted_questions,
    get_attempted_exams,
    get_report_card,
    get_student_data,
    login,
    register,
    attempt_exam,
    get_template
}