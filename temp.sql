with x as
		(
			select student_id 
			from student
			where institute = 40010
		),
		y as
		(
			select student_id, exam_id, sum(marks) as marks, sum(time_taken) as time_taken
			from student_exam_ques_stat
			group by exam_id, student_id
		),
		z as
		(
			select *, RANK() OVER (PARTITION BY exam_id ORDER BY marks DESC, time_taken) as rnk
			from y
		),
		w as
		(
			select * from z
			where student_id in (select * from x)
		),
		r as
		(
			select exam_id, avg(marks) as avg_marks, avg(time_taken) as avg_time, min(rnk) as best_rank
			from w
			group by exam_id
		)
		select r.exam_id, exam.exam_name, ROUND(avg_marks, 3), ROUND(avg_time, 3), ROUND(best_rank, 3)
		from r natural join exam
