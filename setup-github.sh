#!/bin/bash

# Nexora Event Management System - GitHub Push Script (Unix/macOS/Linux)
# This script automates the GitHub setup process

echo ""
echo "========================================"
echo " NEXORA - GitHub Setup Script"
echo "========================================"
echo ""

# Get user input
read -p "Enter your GitHub username: " USERNAME
read -p "Enter your email: " EMAIL
read -p "Enter repository name (default: nexora-event-management): " REPONAME

# Set default repository name
REPONAME=${REPONAME:-nexora-event-management}

echo ""
echo "Configuring Git..."

# Configure git
git config user.name "$USERNAME"
git config user.email "$EMAIL"

echo "Git configured with name: $USERNAME, email: $EMAIL"

echo ""
echo "Initializing repository..."

# Initialize git if not already done
if [ ! -d .git ]; then
    git init
    echo "Repository initialized"
else
    echo "Repository already initialized"
fi

# Set main branch
git branch -M main 2>/dev/null || true

echo ""
echo "Adding all files..."
git add .

echo ""
echo "Creating initial commit..."
git commit -m "init: Nexora Event Management System Phase 1 setup

- React 18 + TypeScript frontend with Vite and Tailwind CSS
- Express + TypeScript backend with MySQL
- Complete database schema and migrations
- 10 reusable UI components
- Authentication middleware structure
- Comprehensive documentation
- GitHub workflows for CI/CD

Team: Dhyey, Vidhan, Samarth, Manthan" 2>/dev/null || echo "Repository already committed"

echo ""
echo ""
echo "========================================"
echo " MANUAL GITHUB SETUP REQUIRED"
echo "========================================"
echo ""
echo "1. Go to https://github.com/new"
echo ""
echo "2. Create repository with these settings:"
echo "   - Repository name: $REPONAME"
echo "   - Description: Modern Event Management System"
echo "   - Visibility: Public"
echo "   - DO NOT check 'Initialize repository with README'"
echo ""
echo "3. After creating, GitHub will show commands like:"
echo "   git remote add origin https://github.com/$USERNAME/$REPONAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Copy the git remote URL and run:"
echo ""
read -p "Paste the GitHub repository URL: " GITHUB_URL

echo ""
echo "Adding remote repository..."
git remote remove origin 2>/dev/null || true
git remote add origin "$GITHUB_URL"

echo ""
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "========================================"
echo " SUCCESS!"
echo "========================================"
echo ""
echo "Your project is now on GitHub!"
echo "Repository: $GITHUB_URL"
echo ""
echo "Next steps:"
echo " 1. Add team members as collaborators on GitHub"
echo " 2. Create develop branch for active development"
echo " 3. Start Phase 2 development"
echo ""
