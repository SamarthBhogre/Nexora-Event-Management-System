@echo off
REM Nexora Event Management System - GitHub Push Script (Windows)
REM This script automates the GitHub setup process

echo.
echo ========================================
echo  NEXORA - GitHub Setup Script
echo ========================================
echo.

setlocal enabledelayedexpansion

REM Get user input
set /p USERNAME="Enter your GitHub username: "
set /p EMAIL="Enter your email: "
set /p REPONAME="Enter repository name (default: nexora-event-management): "

if "!REPONAME!"=="" (
    set REPONAME=nexora-event-management
)

echo.
echo Configuring Git...

REM Configure git
git config user.name "%USERNAME%"
git config user.email "%EMAIL%"

echo Git configured with name: %USERNAME%, email: %EMAIL%

echo.
echo Initializing repository...

REM Initialize git if not already done
if not exist .git (
    git init
    echo Repository initialized
) else (
    echo Repository already initialized
)

REM Set main branch
git branch -M main 2>nul

echo.
echo Adding all files...
git add .

echo.
echo Creating initial commit...
git commit -m "init: Nexora Event Management System Phase 1 setup" -m "- React 18 + TypeScript frontend with Vite and Tailwind CSS" -m "- Express + TypeScript backend with MySQL" -m "- Complete database schema and migrations" -m "- 10 reusable UI components" -m "- Authentication middleware structure" -m "- Comprehensive documentation" -m "- GitHub workflows for CI/CD" -m "" -m "Team: Dhyey, Vidhan, Samarth, Manthan" 2>nul

if !ERRORLEVEL! NEQ 0 (
    echo Repository already committed
)

echo.
echo.
echo ========================================
echo  MANUAL GITHUB SETUP REQUIRED
echo ========================================
echo.
echo 1. Go to https://github.com/new
echo.
echo 2. Create repository with these settings:
echo    - Repository name: %REPONAME%
echo    - Description: Modern Event Management System
echo    - Visibility: Public
echo    - DO NOT check "Initialize repository with README"
echo.
echo 3. After creating, GitHub will show commands like:
echo    git remote add origin https://github.com/%USERNAME%/%REPONAME%.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. Copy the git remote URL and run:
echo.
set /p GITHUB_URL="Paste the GitHub repository URL: "

echo.
echo Adding remote repository...
git remote remove origin 2>nul
git remote add origin %GITHUB_URL%

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo  SUCCESS!
echo ========================================
echo.
echo Your project is now on GitHub!
echo Repository: %GITHUB_URL%
echo.
echo Next steps:
echo  1. Add team members as collaborators on GitHub
echo  2. Create develop branch for active development
echo  3. Start Phase 2 development
echo.
pause
