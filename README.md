READ ME


Mongo DB ===================================================================

	use capstone


	****** Each quiz and its information *******

	db.quizzes.find()
		teacherID						teacher of the class
		quizID							quiz id, unique identifier autogen
		classID							class id, such as CS 3330	
		quizName						quiz title
		timeAllowed						time allowed for whole quiz
		question 						list of questions (description)
		numSubmission					number of submission allow for each q
		answer							main.c file of the teachers
		language 						language file (currently only C)
		retake 							are they allowed for retake?
		beginTime		 				list/section when is the quiz allowed
		beginDate						"  "
		endTime			 				list/section when is the quiz over?
		endDate							"  "
		lateTime						list/section when will it be counted late
		lateDate 						"  "
		sectionNumber					list/section what section it is



	******** Each submission for grading / testing / save *******

	db.submission.find()
		studentID						student such as jl4vw
		quizID							quiz id of a partiular quiz (selected)
		questionNumber 					which question the submission is for
		code 					[]		the code
		graded					[]		is this for grade or for testing	
		result 							what the output was JSON
		submitDate 						when it was submitted
		submitTime 	 					"  "
		save 							was this saved?
	


	******** Overall quiz information per student ***********

	db.quizSubmission.find()
		MyIPAddress 			[] 		ip address of the student
		numSubmission					list of number of submission
		finished 						is the student done?
		studentID 						student id
		quizID 							quiz id
		beginDate 						when did the quiz begin
		beginTime				 		"  "
		endDate							when did the quiz end
		endTime					 		"  "
		exitTime				[]	 	list - did this person exit
		timeAllowed				[]		time allowed for that particular student
		grade 					[]		grade
		result 					[] 		list - result




	******** Roster for class *********

	db.roster.find()
		teacherID				[] 		teacher of the class
		studentID 				[] 		a student
		classID					[] 		class id
		sectionNumber 			[]   	section number for that student
		extraTime				[] 		extra time multiplier
		email					[] 		email of the student
		studentName				[] 		student name



	******** Additional Priv *******

	db.allowed.find()
		studentID						student ID
		note					[] 		any notes by TA / Prof
		lateAllowed 			[] 		are they excused to be late by TA
		exitAllowed 			[] 		are they excused to exit by TA
		moreAllowed				[]		more submission allowed
		quitID					[] 		quizID
		lateDateAllowed			[]  	late date allowed
		retakeAllowed 			[]		additional take allowed



Quizzes.php ================================================================

	SESSION:
		<string> 	MystudentID / TeacherID

	OUTPUT:
		[JSON OBJECT] 
			<list> 		quizName
			<list>		quizID
			<list> 		timeAllowed
			<list> 		beginTime
			<list> 		beginDate
			<list> 		endTime
			<list>		endDate
			<list>		retake	
			<bool> 		success; see if it is successful or not
    		<string> 	message; message about it's return to see what went wrong



GetQuestions.php ===========================================================

	SESSION:
		<string> 	MystudentID
		<string> 	MyclassID
		<int>		MysectionNumber
		<double>	MyextraTime
		<string>	MyIPAddress
		<bool> 		lateDateAllowed
		<int> 		retakeAllowed

	INPUT:
		<string> 	quizID

	OUTPUT:
		[JSON OBJECT] quiz
    		<list> 		question
			<list> 		numSubmission
			<int> 		timeAllowed
			<string> 	quizName
			<time> 		beginTime
			<date> 		beginDate
			<time> 		endTime
			<date>		endDate
			<int>		retake
			<list> 		code
			<list> 		feedback
			<int> 		timeLeft 			// milliseconds
    		<bool> 		success; see if it is successful or not
    		<string> 	message; message about it's return to see what went wrong

	SUMMARY:
		given quizID, returns the questions and details. 				
			Checks if student is logged in							
			Checks if student can take the quiz / again. 			
			Checks if student started it before 						
			Save into quizSubmission mongo 								



Submit.php ===============================================================

	SESSION:
		<string> 	MystudentID
		<string> 	MyclassID
		<int>		MysectionNumber
		<double>	MyextraTime
		<string>	MyIPAddress
	
	INPUT: 
		<string> 	quizID
		<int> 		questionNumber
		<string>	submission
		<bool>		grade

	OUTPUT:
		[JSON OBJECT] output
			<bool> 		success; see if it is successful or not
    		<string> 	message; message about it's return to see what went wrong
			<JSON>  result
			 	<string>  compilationMessages
			 	<string>  stdoutMessages
			 	<string>  stderrMessages
			 	<double>  grade

	SUMMARY:
		given quizID and the questionNumber and compile and run 	
		  	Save to database                                      	



CreateQuiz.php ==========================================================

	SESSION:
		<string> 	teacherID

	INPUT:
		<string> 	classID
		<string>	quizName
		<int>	 	timeAllowed
		<list>		numSubmission
		<list>		question
		<list>		answer
		<int>		retake
		<string>	language
		<list>		beginTime
		<list>		beginDate
		<list>		endTime
		<list>		endDate
		<list>		sectionNumber

	OUTPUT:
		[JSON OBJECT] output
		    <bool> 		success
		    <string>	message

  	SUMMARY:
    	makes the quiz                                        

SubmitQuiz.php ==========================================================

	SESSION:
		<string> 	MystudentID
		<string> 	MyclassID
		<int>		MysectionNumber
		<double>	MyextraTime
		<string>	MyIPAddress


	INPUT:
		<string> 	quizID


	OUTPUT:
		"success"

	SUMMARY:
		closing the quiz


CreateRoster.php ==========================================================

	SESSION:
		<string> 	teacherID


	INPUT:
		<string> 	classID
		<list> 		sectionNumber
		<list>		studentID
		<list>		extraTime
		<list>		studentName
		<list>		email
		<list>		ta

	OUTPUT:
		[JSON OBJECT] output
		    <bool> 		success
		    <string>	message

	SUMMARY:
		using txt file or whatever, add people to roster
		able to add manually


EditRoster.php ==========================================================

	SESSION:
		<string> 	teacherID


	INPUT:
		<string> 	classID
		<list> 		sectionNumber
		<list>		studentID
		<list>		extraTime
		<list>		studentName
		<list>		email
		<list>		ta

	OUTPUT:
		[JSON OBJECT] output
		    <bool> 		success
		    <string>	message

	SUMMARY:
		using txt file or whatever, edit people to roster
		able to add manually


ViewRoster.php ==========================================================

	SESSION:
		<string> 	teacherID


	INPUT:
		<string> 	classID

	OUTPUT:
		[JSON OBJECT] output
		    <bool> 		success
		    <string>	message
		    <list> 		sectionNumber
			<list>		studentID
			<list>		extraTime
			<list>		studentName
			<list>		email
			<list>		ta

	SUMMARY:
		View roster


ViewQuiz.php ==========================================================

	SESSION:
		<string> 	teacherID 		/ 	TA


	OUTPUT:
		<string> 	classID
		<string>	quizName
		<int>	 	timeAllowed
		<list>		numSubmission
		<list>		question
		<list>		answer
		<int>		retake
		<string>	language
		<list>		beginTime
		<list>		beginDate
		<list>		endTime
		<list>		endDate
		<list>		sectionNumber

	OUTPUT:
		[JSON OBJECT] output
		    <bool> 		success
		    <string>	message

  	SUMMARY:
    	see the quiz without taking it

EditQuiz.php ==========================================================

	SESSION:
		<string> 	teacherID

	INPUT:
		<string> 	classID
		<string>	quizName
		<int>	 	timeAllowed
		<list>		numSubmission
		<list>		question
		<list>		answer
		<int>		retake
		<string>	language
		<list>		beginTime
		<list>		beginDate
		<list>		endTime
		<list>		endDate
		<list>		sectionNumber

	OUTPUT:
		[JSON OBJECT] output
		    <bool> 		success
		    <string>	message

  	SUMMARY:
    	edit the quiz  

EditNotes.php ========================================================

	SESSION:
		<string> 	teacherID

	INPUT:
		<string>	quizID
		<list> 		studentID
		<list>		notes
		<list> 		lateAllowed 		
		<list> 		exitAllowed 
		<list>		moreAllowed

	OUTPUT:
		[JSON OBJECT] output
		    <bool> 		success
		    <string>	message

Notes.php ============================================================

	SESSION:
		<string> 	teacherID

	INPUT:
		<string> 	quizID

	OUTPUT:
	[JSON OBJECT] output
		<bool> 		success
		<string>	message
		<list> 		studentID
		<list>		notes
		<list> 		lateAllowed 		
		<list> 		exitAllowed 
		<list>		moreAllowed	
		<list>		lateDateAllowed
		<list> 		retakeAllowed


Save.php =============================================================

	SESSION:
		<string> 	MystudentID
		<string>	MyclassID

	INPUT:
		<string> 	quizID
		<list> 		code

	OUTPUT:
	[JSON OBJECT] output
		<bool> 		success
		<string>	message
CheckLogin.php - Will finish after netbadge

