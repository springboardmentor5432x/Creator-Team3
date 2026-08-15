$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root 'backend'
$frontendPath = Join-Path $root 'frontend'
$logPath = Join-Path $root '.dev-logs'

New-Item -ItemType Directory -Path $logPath -Force | Out-Null

function Test-LocalPort([int] $port) {
    return $null -ne (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue)
}

if (-not (Test-LocalPort 8000)) {
    Start-Process -FilePath 'python' -ArgumentList '-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000' -WorkingDirectory $backendPath -RedirectStandardOutput (Join-Path $logPath 'backend.out.log') -RedirectStandardError (Join-Path $logPath 'backend.err.log')
}

if (-not (Test-LocalPort 5173)) {
    Start-Process -FilePath 'npm.cmd' -ArgumentList 'run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173' -WorkingDirectory $frontendPath -RedirectStandardOutput (Join-Path $logPath 'frontend.out.log') -RedirectStandardError (Join-Path $logPath 'frontend.err.log')
}

Write-Output 'Creator IQ development services are ready:'
Write-Output 'Frontend: http://127.0.0.1:5173'
Write-Output 'Backend:  http://127.0.0.1:8000'