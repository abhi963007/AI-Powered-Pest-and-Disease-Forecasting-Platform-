@echo off
TITLE AgroScan Multi-Service Runner
COLOR 0A

echo ===================================================
echo           STARTING AGROSCAN APPLICATION           
echo ===================================================
echo.

:: 1. Start MongoDB (Optional - assuming it's a service)
:: If you run MongoDB manually, uncomment the next line:
:: start "MongoDB" cmd /k "mongod"

:: 2. Start AI Service (Python/FastAPI)
echo [1/3] Starting AI Service (Python)...
start "AI Service" cmd /k "echo Starting AI Service... && cd ai-service && venv\Scripts\activate && python main.py"

:: 3. Start Backend Server (Node.js/Express)
echo [2/3] Starting Backend Server (Node.js)...
start "Backend Server" cmd /k "echo Starting Backend Server... && cd server && node index.js"

:: 4. Start Frontend Client (React/Vite)
echo [3/3] Starting Frontend Client (Vite)...
start "Frontend Client" cmd /k "echo Starting Frontend Client... && cd client && npm run dev"

echo.
echo ===================================================
echo All services have been triggered!
echo.
echo AI Service:      http://localhost:8000
echo Backend API:     http://localhost:5000
echo Frontend UI:      http://localhost:5173
echo ===================================================
echo.
echo Keep this window open or close it; the others will stay running.
pause
