📌 Real-time Collaborative Code Editor with Gemini AI

A full-stack prototype of a real-time collaborative code editor featuring:

✔ Multi-user live editing using WebSockets + STOMP
✔ Remote cursor & text synchronization
✔ AI-powered code completion via Google Gemini
✔ Angular 20 + CodeMirror 6 frontend
✔ Spring Boot 3.5.7 backend
✔ Gemini (google-genai 1.27.0) for intelligent code suggestions

⸻

🚀 Features

🖊 Real-time Collaboration
	•	Multiple users edit the same document simultaneously
	•	Live updates broadcast to all participants
	•	Remote cursor highlighting
	•	Room-based sessions: ?room=session1

⸻

🤖 AI Code Completion (Gemini)

Backend securely calls Google Gemini using google-genai SDK.
The frontend sends:
	•	current code
	•	cursor position
	•	language

Then displays completion suggestions inside CodeMirror.

🧱 Tech Stack
Frontend:    Angular 20, TypeScript, CodeMirror 6, STOMP.js
Backend:     Spring Boot 3.5.7, Java 25
AI:          Gemini (google-genai 1.27.0)
Live Sync:   WebSocket + STOMP
Build Tools: Maven, npm

📂 Folder Structure

collab-editor-Assignment/
│
├── collab-editor-backend/
│   ├── src/main/java/com/kundan/editor/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── socket/
│   │   └── dto/
│   ├── application.yml
│   └── pom.xml
│
└── collab-editor-frontend/
    ├── src/app/
    │   ├── app.ts
    │   ├── app.html
    │   ├── app.css
    │   └── collaboration.service.ts
    ├── proxy.conf.json
    ├── package.json
    └── angular.json

⚙️ Backend Setup (Spring Boot 3.5.7, Java 25)
   1️⃣ Install dependencies
      cd collab-editor-backend
      mvn clean install
      mvn spring-boot:run

Backend URLs
     POST /api/complete                      Gemini code completion
     ws://localhost:8080/ws                  STOMP WebSocket endpoint
     http://localhost:8080/actuator/health   Actuator health check

🖥 Frontend Setup (Angular 20)
   1️⃣ Install packages and start
      cd collab-editor-frontend
      npm install
      npm start

App opens at:
    👉 http://localhost:4200/?room=session1
      Open two browser tabs with same room ID to test collaboration.


🔌 Testing Gemini AI Completion

Use Postman:
POST http://localhost:8080/api/complete
Body:
    {
  "code": "function hello(name) {\n  console.log('Hi ' + name);\n}",
  "cursorOffset": 35,
  "language": "javascript"
}

Expected structure:
   {
  "suggestions": [
         "return name;",
    "console.log('Hello');",
    "// ..."
  ]
}

🧩 Architecture Diagram
                      ┌──────────────────────────┐
                     │        Angular App        │
                     │  CodeMirror Editor + AI   │
                     └────────────┬─────────────┘
                                  │
                    Autocomplete  │  STOMP WebSocket
                                  │
                     ┌────────────▼────────────┐
                     │     Spring Boot API      │
                     │  /api/complete (REST)    │
                     │  /ws (WebSocket)         │
                     └────────────┬────────────┘
                                  │
                                  │ Gemini API call
                                  │
                     ┌────────────▼────────────┐
                     │      Google Gemini       │
                     │   (Code Completion AI)   │
                     └──────────────────────────┘




