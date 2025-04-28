#!/bin/bash

# Exit immediately if any command fails
set -e

echo "🚀 Starting full build-and-run process..."

# ------------------------
# Step 1: Setup Backend
# ------------------------
echo "📦 Setting up Python backend..."

cd backend/app

# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3.11 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Start backend server in the background
echo "🚀 Starting backend server..."
uvicorn main:app --reload &
BACKEND_PID=$!

cd ../../

# ------------------------
# Step 2: Setup Frontend
# ------------------------
echo "📦 Setting up Angular frontend..."

cd frontend

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    npm install
fi

# Build the Angular project
npm run build --prod

# Start frontend server
echo "🚀 Starting frontend server..."
npm start

# ------------------------
# Step 3: Clean Exit
# ------------------------

# When frontend exits (e.g., ctrl+c), stop backend too
kill $BACKEND_PID
