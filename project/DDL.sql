DROP TABLE IF EXISTS "question" CASCADE;
CREATE TABLE "question" (
  "question_id" int PRIMARY KEY,
  "question_text" text NOT NULL,
  "Primary_difficulty" int NOT NULL,
  "answer" varchar,
  "testcase" text,
  "visibility" varchar NOT NULL,
  "author" int NOT NULL
);

DROP TABLE IF EXISTS "teacher" CASCADE;
CREATE TABLE "teacher" (
  "teacher_id" int PRIMARY KEY,
  "First_Name" varchar NOT NULL,
  "Last_Name" varchar NOT NULL,
  "Date_of_Birth" date,
  "user_name" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL
);

DROP TABLE IF EXISTS "student" CASCADE;
CREATE TABLE "student" (
  "student_id" int PRIMARY KEY,
  "First_Name" varchar NOT NULL,
  "Last_Name" varchar NOT NULL,
  "Date_of_Birth" date,
  "user_name" varchar NOT NULL UNIQUE,
  "password" varchar,
  "student_template" text,
  "institute" int NOT NULL,
  "facad" int NOT NULL
);

DROP TABLE IF EXISTS "institute" CASCADE;
CREATE TABLE "institute" (
  "institute_id" int PRIMARY KEY,
  "name" varchar NOT NULL,
  "location" varchar NOT NULL
);

DROP TABLE IF EXISTS "exam" CASCADE;
CREATE TABLE "exam" (
  "exam_id" int PRIMARY KEY,
  "exam_name" varchar NOT NULL,
  "year" int NOT NULL,
  "exam_type_id" int NOT NULL,
  "author" int NOT NULL
);

DROP TABLE IF EXISTS "tags" CASCADE;
CREATE TABLE "tags" (
  "tag_id" int PRIMARY KEY,
  "tag_name" varchar NOT NULL
);

DROP TABLE IF EXISTS "exam_type" CASCADE;
CREATE TABLE "exam_type" (
  "id" int PRIMARY KEY,
  "type" varchar NOT NULL,
  "duration" int NOT NULL,
  "num_ques" int NOT NULL
);

DROP TABLE IF EXISTS "template" CASCADE;
CREATE TABLE "template" (
  "template_id" int PRIMARY KEY,
  "base_code" text
);

DROP TABLE IF EXISTS "language" CASCADE;
CREATE TABLE "language" (
  "language_id" int PRIMARY KEY,
  "language" varchar NOT NULL
);

DROP TABLE IF EXISTS "student_exam_ques_stat" CASCADE;
CREATE TABLE "student_exam_ques_stat" (
  "statid" int PRIMARY KEY,
  "student_id" int ,
  "question_id" int,
  "exam_id" int,
  "marks" int NOT NULL,
  "time_taken" int NOT NULL,
  "rating" int,
  "relevance" int
);

DROP TABLE IF EXISTS "exam_question" CASCADE;
CREATE TABLE "exam_question" (
  "eq_id" int PRIMARY KEY,
  "exam_id" int,
  "question_id" int
);

DROP TABLE IF EXISTS "template_language" CASCADE;
CREATE TABLE "template_language" (
  "tl_id" int PRIMARY KEY,
  "template_id" int,
  "language_id" int
);

DROP TABLE IF EXISTS "question_tags" CASCADE;
CREATE TABLE "question_tags" (
  "id" int PRIMARY KEY,
  "question_id" int,
  "tag_id" int
);

DROP TABLE IF EXISTS "tag_child" CASCADE;
CREATE TABLE "tag_child" (
  "id" int PRIMARY KEY,
  "parent_tag" int,
  "child_tag" int
);

ALTER TABLE "question" ADD FOREIGN KEY ("author") REFERENCES "teacher" ("teacher_id");

ALTER TABLE "student" ADD FOREIGN KEY ("institute") REFERENCES "institute" ("institute_id");

ALTER TABLE "student" ADD FOREIGN KEY ("facad") REFERENCES "teacher" ("teacher_id");

ALTER TABLE "exam" ADD FOREIGN KEY ("exam_type_id") REFERENCES "exam_type" ("id");

ALTER TABLE "exam" ADD FOREIGN KEY ("author") REFERENCES "teacher" ("teacher_id");

ALTER TABLE "student_exam_ques_stat" ADD FOREIGN KEY ("student_id") REFERENCES "student" ("student_id");

ALTER TABLE "student_exam_ques_stat" ADD FOREIGN KEY ("question_id") REFERENCES "question" ("question_id");

ALTER TABLE "student_exam_ques_stat" ADD FOREIGN KEY ("exam_id") REFERENCES "exam" ("exam_id");

ALTER TABLE "exam_question" ADD FOREIGN KEY ("exam_id") REFERENCES "exam" ("exam_id");

ALTER TABLE "exam_question" ADD FOREIGN KEY ("question_id") REFERENCES "question" ("question_id");

ALTER TABLE "template_language" ADD FOREIGN KEY ("template_id") REFERENCES "template" ("template_id");

ALTER TABLE "template_language" ADD FOREIGN KEY ("language_id") REFERENCES "language" ("language_id");

ALTER TABLE "question_tags" ADD FOREIGN KEY ("question_id") REFERENCES "question" ("question_id");

ALTER TABLE "question_tags" ADD FOREIGN KEY ("tag_id") REFERENCES "tags" ("tag_id");

ALTER TABLE "tag_child" ADD FOREIGN KEY ("parent_tag") REFERENCES "tags" ("tag_id");

-- ALTER TABLE "Tags" ADD FOREIGN KEY ("tag_id") REFERENCES "tag_child" ("child_tag");
ALTER TABLE "tag_child" ADD FOREIGN KEY ("child_tag") REFERENCES "tags" ("tag_id");
-- ALTER TABLE "tag_child" ADD FOREIGN KEY ("parent_tag") REFERENCES "tags" ("tag_id");
