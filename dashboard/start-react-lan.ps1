# ================================
# start-react-ngrok.ps1
# ================================

# --------- Configuration ---------
# Change this to your project folder
$projectFolder = "D:\Project 4\dashboard"

# React port
$reactPort = 3001

# Path to npm (optional, if npm is not in PATH)
$npmPath = "npm"

# --------- Start Script ---------
Write-Host "Starting React dev server in $projectFolder..." -ForegroundColor Cyan
Set-Location $projectFolder

# Start React in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit","-Command `$env:PORT=$reactPort; $npmPath start"

# Wait a few seconds for React to compile
Start-Sleep -Seconds 10

# Start ngrok
Write-Host "Starting ngrok on port $reactPort..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit","-Command ngrok http $reactPort"

Write-Host ""
Write-Host "✅ React and ngrok started."
Write-Host "Open the public ngrok URL shown in the ngrok terminal on any device (including Android)."
Write-Host "React is running locally at http://localhost:$reactPort"
