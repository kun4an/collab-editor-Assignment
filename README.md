REAL-TIME COLLABORATIVE CODE EDITOR WITH GEMINI AI

This project is a full-stack prototype that provides:
	.	Real-time multi-user code editing using WebSockets and STOMP
	.	Remote cursor and text synchronization
	.	AI-based code completion via Google Gemini
	.	Angular 20 frontend with CodeMirror 6 code editor
	.	Spring Boot 3.5.7 backend using Java 25
	.	google-genai SDK version 1.27.0 for AI integration

⸻

1.	REPOSITORY INFORMATION

	Repository URL:
	https://github.com/kun4an/collab-editor-Assignment
	
	Clone the repository:
	HTTPS:
	git clone https://github.com/kun4an/collab-editor-Assignment.git
	
	SSH:
	git clone git@github.com:kun4an/collab-editor-Assignment.git
	
	IDE used:
	Backend: IntelliJ IDEA
	Frontend: Visual Studio Code (VS Code)

2.	PROJECT STRUCTURE

	collab-editor-Assignment/
	collab-editor-backend/
	src/main/java/com/kundan/editor/
	controller/
	service/
	model/
	src/main/resources/application.yml
	pom.xml
	
	collab-editor-frontend/
	src/app/
	app.ts
	app.html
	app.css
	collaboration.service.ts
	proxy.conf.json
	package.json
	angular.json

3.	PREREQUISITES

	Backend requirements:
	Java 25
	Maven 3.9 or higher
	
	Frontend requirements:
	Node 24.x
	npm 11.x
	Angular CLI 20.x (optional)
	
	IDE recommendation:
	Backend: IntelliJ IDEA
	Frontend: VS Code



4.	CONFIGURING GEMINI API KEY

	Open file:
	collab-editor-backend/src/main/resources/application.yml
	
	Update this line:
	gemini.api.key = YOUR_GEMINI_API_KEY_HERE
	
	Alternatively set environment variable:
	export GEMINI_API_KEY=“your-real-key”
	
	Using your own Gemini API key is mandatory for the backend to work.


5.	BACKEND SETUP (SPRING BOOT 3.5.7 AND JAVA 25)

	Step 1: Navigate to backend folder
	cd collab-editor-backend
	
	Step 2: Build the backend
	mvn clean install
	
	Step 3: Start backend
	mvn spring-boot:run
	
	Backend runs at:
	http://localhost:8080
	
	Backend endpoints:
	POST /api/complete        	(Gemini AI code completion)
	WS ws://localhost:8080/ws 	(WebSocket STOMP endpoint)
	GET /actuator/health      	(Actuator health check)

6.	TESTING GEMINI API VIA POSTMAN

		POST URL:
		http://localhost:8080/api/complete
		
		Request body:
		{
		“code”: “function hello(name) { console.log(’Hi ’ + name); }”,
		“cursorOffset”: 35,
		“language”: “javascript”
		}
		
		Expected output:
		{
		“suggestions”: [
		“return name;”,
		“console.log(‘Hello’);”,
		“// …”
		]
		}

		If suggestions appear, Gemini integration is working.

7.	FRONTEND SETUP (ANGULAR 20)

	Step 1: Navigate to frontend folder
	cd collab-editor-frontend
	
	Step 2: Install dependencies
	npm install
	
	Step 3: Start Angular dev server
	npm start
	
	Application runs at:
	http://localhost:4200
	
	Open with room ID:
	http://localhost:4200/?room=session1

8.	WHAT TO TEST (ASSIGNMENT VALIDATION CHECKLIST)

	8.1 Real-time collaboration
	Open two tabs:
	http://localhost:4200/?room=session1
	http://localhost:4200/?room=session1
	
	Typing in one tab must immediately appear in the other.
	
	8.2 Remote cursor synchronization
	Move cursor or select text in Tab 1.
	A blue cursor or highlight should appear in Tab 2.
	
	8.3 Room-based session isolation
	Tab A: http://localhost:4200/?room=A
	Tab B: http://localhost:4200/?room=B
	No sync should occur.
	
	Both tabs with same room ID must sync.
	
	8.4 AI code completion
	Place cursor inside code.
	Press CTRL + SPACE.
	AI suggestions from Gemini must appear.
	In browser dev tools → Network → XHR:
	POST /api/complete should be visible.
	
	8.5 Backend health check
	Open:
	http://localhost:8080/actuator/health
	Expected result:
	{ “status”: “UP” }

9.	QUICK START SUMMARY

	Backend:
	cd collab-editor-backend
	mvn spring-boot:run
	
	Frontend:
	cd collab-editor-frontend
	npm start
	
	Browser:
	http://localhost:4200/?room=session1
	
	Open the same room in two tabs to test:
		•	Real-time collaboration
		•	Remote cursor synchronization
		•	Gemini AI code completion


10.	NOTES AND ASSUMPTIONS
    
	This is a prototype created for demonstration purposes.
	No authentication feature is included.
	No database is used; all operations are in-memory.
	Gemini API key is required for AI suggestions.
	All testing is intended on localhost environment.

11. SCREENSHOT
<img width="2940" height="1764" alt="image" src="https://github.com/user-attachments/assets/901d9d74-2b53-4dcd-b828-d6c30d845a83" />
<img width="2940" height="1760" alt="image" src="https://github.com/user-attachments/assets/760f0d77-d70b-4032-9acd-d26856ce695b" />
<img width="2940" height="1758" alt="image" src="https://github.com/user-attachments/assets/528753d9-df29-4617-97e0-fb8386eb4093" />





