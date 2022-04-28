var { query } = require('express');
const client = require('./obj.js');

const question_lib = require('./question.js');

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

async function register(roll_no, user_name, password, first_name, last_name,
    date_of_birth, student_template, institute, facad) {
    resp = {}
    query = `
    insert into student(student_id, user_name, password, first_name, last_name, 
        date_of_birth, student_template, institute, facad)
    values(${roll_no}, '${user_name}', '${password}', '${first_name}', '${last_name}','${date_of_birth}',
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
    register
}