export class NewUser {
    student_id = '';
    first_name = '';
    last_name = '';
    date_of_birth = '';
    user_name = '';
    password = '';
    student_template = 0;
    institute = 0;
    facad = 0;

    constructor(
        student_id: string,
        first_name: string,
        last_name: string,
        date_of_birth: string,
        user_name: string,
        password: string,
        student_template: number,
        institute: number,
        facad: number,
    ) {
        this.student_id = student_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.date_of_birth = date_of_birth;
        this.user_name = user_name;
        this.password = password;
        this.student_template = student_template;
        this.institute = institute;
        this.facad = facad;
    }
}

export class NewTeacherUser {
    teacher_id = '';
    first_name = '';
    last_name = '';
    date_of_birth = '';
    user_name = '';
    password = '';

    constructor(
        teacher_id: string,
        first_name: string,
        last_name: string,
        date_of_birth: string,
        user_name: string,
        password: string,
    ) {
        this.teacher_id = teacher_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.date_of_birth = date_of_birth;
        this.user_name = user_name;
        this.password = password;
    }
}