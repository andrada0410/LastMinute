C:
cd /
nssm.exe install last-minute-backend "C:/last-minute/deploy/runBackend.bat"
nssm.exe set "last-minute-backend" AppDirectory "C:/last-minute/deploy"
nssm.exe set "last-minute-backend" Start SERVICE_AUTO_START
nssm.exe start "last-minute-backend"
nssm.exe install last-minute-frontend "C:/last-minute/deploy/runNGINX.bat"
nssm.exe set "last-minute-frontend" AppDirectory "C:/last-minute/deploy"
nssm.exe set "last-minute-frontend" Start SERVICE_AUTO_START
nssm.exe start "last-minute-frontend"