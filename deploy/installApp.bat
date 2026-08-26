C:
cd /
git clone https://github.com/ot3107487/last-minute.git
cd last-minute
cd last-minute-frontend
call npm i --silent
call npm run build
cd ..
cd last-minute-backend
call npm i --silent
cd ..
cd ..
cd nginx-1.30.4/nginx-1.30.4/conf
del /F "nginx.conf"
echo F | xcopy "C:\last-minute\deploy\nginx.conf" "C:\nginx-1.30.4\nginx-1.30.4\conf\nginx.conf"
cd C:/last-minute/deploy
serviceInstantiation.bat
