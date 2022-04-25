DROP TABLE IF EXISTS "question" CASCADE;
CREATE TABLE "question" (
  "question_id" int PRIMARY KEY,
  "question_text" text NOT NULL,
  "primary_difficulty" int NOT NULL,
  "answer" varchar,
  "testcase" text,
  "visibility" varchar NOT NULL,
  "author" int NOT NULL
);

DROP TABLE IF EXISTS "teacher" CASCADE;
CREATE TABLE "teacher" (
  "teacher_id" int PRIMARY KEY,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "date_of_birth" date,
  "user_name" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL
);

DROP TABLE IF EXISTS "student" CASCADE;
CREATE TABLE "student" (
  "student_id" int PRIMARY KEY,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "date_of_birth" date,
  "user_name" varchar NOT NULL UNIQUE,
  "password" varchar NOT NULL,
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
  "student_id" int NOT NULL ,
  "question_id" int NOT NULL,
  "exam_id" int NOT NULL,
  "marks" int NOT NULL,
  "time_taken" int NOT NULL,
  "rating" int,
  "relevance" int
);

DROP TABLE IF EXISTS "exam_question" CASCADE;
CREATE TABLE "exam_question" (
  "eq_id" int PRIMARY KEY,
  "exam_id" int NOT NULL,
  "question_id" int NOT NULL
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
  "question_id" int NOT NULL,
  "tag_id" int NOT NULL
);

DROP TABLE IF EXISTS "tag_child" CASCADE;
CREATE TABLE "tag_child" (
  "id" int PRIMARY KEY,
  "parent_tag" int NOT NULL,
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


-- triggers to assert some constraints
-- CREATE OR REPLACE FUNCTION check_num_ques()
--   RETURNS TRIGGER 
--   LANGUAGE PLPGSQL
--   AS
-- $$
-- DECLARE
-- count_exams INT;
-- exam_type_id_ INT;
-- BEGIN
--   select count(*) into count_exams from exam_question where exam_question.exam_id = NEW.exam_id;
--   select exam_type_id into exam_type_id_ from exam where exam.exam_id = NEW.exam_id;
--   IF count_exams > (select num_ques from exam_type where exam_type =  exam_type_id_) THEN
--     RAISE EXCEPTION 'Exam contains more questions than specified by its type';
--   END IF;

--   RETURN NEW;
-- END;
-- $$;

-- create trigger assert_question_exam_type
-- after INSERT on "exam_question" execute procedure check_num_ques();

-- -- trigger to check question_id and exam_id are consistent with each other in student_exam_ques_stat
-- CREATE OR REPLACE FUNCTION check_ques_exam_consistency()
--   RETURNS TRIGGER 
--   LANGUAGE PLPGSQL
--   AS
-- $$
-- DECLARE
-- num_exam_ques_mapping INT;
-- BEGIN
--   select count(*) into num_exam_ques_mapping from exam_question where exam_question.exam_id = NEW.exam_id and exam_question.question_id = NEW.question_id;
--   IF num_exam_ques_mapping > 1 THEN
--     RAISE EXCEPTION 'Invalid exam question mapping while insertion into student_exam_ques_stat %', num_exam_ques_mapping;
--   END IF;
--   RETURN NEW;
-- END;
-- $$;

-- create trigger assert_ques_exam_consistency
-- after INSERT on student_exam_ques_stat execute procedure check_ques_exam_consistency();
DROP FUNCTION IF EXISTS check_num_ques();
CREATE FUNCTION check_num_ques()
RETURNS TRIGGER AS $$
BEGIN
	if (select count(*) from exam_question where exam_question.exam_id = NEW.exam_id) > (select num_ques from exam_type where exam_type.id = (select exam_type_id from exam where exam.exam_id = NEW.exam_id)) then
		RAISE EXCEPTION 'Exam contains more questions than specified by its type';
	end if;
	return NEW;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS check_ques_exam_consistency();
CREATE FUNCTION check_ques_exam_consistency()
RETURNS TRIGGER AS $$
BEGIN
	if (select count(*) from exam_question where exam_question.exam_id = NEW.exam_id and exam_question.question_id = NEW.question_id) > 1 then
		RAISE EXCEPTION 'Invalid exam question mapping while insertion into student_exam_ques_stat %', (select count(*) from exam_question where exam_question.exam_id = NEW.exam_id and exam_question.question_id = NEW.question_id);
	end if;
	return NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER cap_num_ques after insert or update on student_exam_ques_stat for each row execute procedure check_num_ques();
CREATE TRIGGER check_ques_exam after insert or update on student_exam_ques_stat for each row execute procedure check_ques_exam_consistency();

DROP MATERIALIZED VIEW IF EXISTS tag_children;
CREATE MATERIALIZED VIEW tag_children AS
	WITH RECURSIVE tag_req(parent_tag, child_tag) AS (
		SELECT parent_tag, child_tag 
		FROM tag_child
		
		UNION ALL

		SELECT tag_child.parent_tag, tag_child.child_tag
		FROM tag_child, tag_req
		WHERE tag_child.parent_tag = tag_req.child_tag
	)
	SELECT parent.tag_id as parent_tag, child.tag_id as child_tag
	FROM tag_req
	INNER JOIN tags as child ON child.tag_id = tag_req.child_tag
	INNER JOIN tags as parent ON parent.tag_id = tag_req.parent_tag;



CREATE INDEX student_idx ON student_exam_ques_stat(student_id);
CREATE INDEX ques_idx ON student_exam_ques_stat(question_id);
CREATE INDEX exam_idx ON student_exam_ques_stat(exam_id);

DROP VIEW if EXISTS all_ques_tags;
CREATE VIEW all_ques_tags AS
with x as
(
  select question_id, tag_children.parent_tag as tag
  from question_tags, tag_children
  where question_tags.tag_id = tag_children.child_tag

  UNION

  select question_id, tag_id
  from question_tags
)
select * from x;