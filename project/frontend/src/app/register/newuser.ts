export class NewUser {
    first_name = '';
    last_name = '';
    date_of_birth = '';
    user_name = '';
    password = '';
    student_template = 0;
    institute = 0;
    facad = 0;

    constructor(
        first_name: string,
        last_name: string,
        date_of_birth: string,
        user_name: string,
        password: string,
        student_template: number,
        institute: number,
        facad: number,
    ) {
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
    first_name = '';
    last_name = '';
    date_of_birth = '';
    user_name = '';
    password = '';

    constructor(
        first_name: string,
        last_name: string,
        date_of_birth: string,
        user_name: string,
        password: string,
    ) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.date_of_birth = date_of_birth;
        this.user_name = user_name;
        this.password = password;
    }
}