@echo off
echo [INFO] Moving to backend directory...
cd backend
if %errorlevel% neq 0 (
    echo [ERROR] Could not find backend directory!
    pause
    exit /b %errorlevel%
)

echo [INFO] Building the project (Lombok-free)...
call mvn clean compile
if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Please check the errors above.
    pause
    exit /b %errorlevel%
)

echo [INFO] Starting the Spring Boot server (H2 Database)...
call mvn spring-boot:run
pause
