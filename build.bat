@echo off
SETLOCAL

echo 🚀 Starting full build-and-run process...

REM ------------------------
REM Step 1: Setup Backend
REM ------------------------
echo 📦 Setting up Python backend...

cd backend\app

REM Create virtual environment if it doesn't exist
IF NOT EXIST venv (
    python3.11 -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install backend dependencies
pip install -r requirements.txt

REM Start backend server in a new terminal window
start "Backend Server" cmd /k python main.py

cd ..\..

REM ------------------------
REM Step 2: Setup Frontend
REM ------------------------
echo 📦 Setting up Angular frontend...

cd frontend

REM Install frontend dependencies if node_modules doesn't exist
IF NOT EXIST node_modules (
    npm install
)

REM Build the Angular project
npm run build --prod

REM Start frontend server
npm start

ENDLOCAL