# 🚀 GITHUB SETUP & PUSH GUIDE - NEXORA EVENT MANAGEMENT SYSTEM

## 📋 Pre-Push Checklist

Before pushing to GitHub, ensure:

- [x] Project renamed from "Syncova" to "Nexora" ✅
- [x] All files updated with new project name ✅
- [x] GitHub workflows configured ✅
- [x] Contributing guidelines added ✅
- [x] Code of Conduct included ✅
- [x] Issue templates created ✅
- [x] Pull request template added ✅
- [x] .gitignore properly configured ✅
- [x] Documentation complete ✅

---

## 🎯 STEP 1: CREATE NEW GITHUB REPOSITORY

### Option A: Using GitHub Web Interface

1. **Go to GitHub.com** and log in to your account
2. **Click "New"** button in the top-left corner
3. **Configure repository**:
   - **Repository name**: `nexora-event-management`
   - **Description**: `Modern Event Management System - React, Express, TypeScript, MySQL`
   - **Visibility**: Public (or Private if preferred)
   - **Initialize repository**: **DO NOT** check any options (we have local files)
4. **Click "Create repository"**

### Option B: Using GitHub CLI

```bash
# Install GitHub CLI if not already installed
# Then authenticate
gh auth login

# Create new repository
gh repo create nexora-event-management \
  --description "Modern Event Management System" \
  --public \
  --source=. \
  --remote=origin \
  --push
```

---

## 🔧 STEP 2: INITIALIZE GIT LOCALLY

### First Time Setup

```bash
# Navigate to project directory
cd "/d/College/Semester - 7/Nexora Event Management System"

# Initialize git (if not already done)
git init

# Configure git user (important!)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# For global config (optional)
# git config --global user.name "Your Name"
# git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

---

## 📝 STEP 3: CONFIGURE REMOTE & BRANCHES

```bash
# Add remote repository (replace with your GitHub URL)
git remote add origin https://github.com/yourusername/nexora-event-management.git

# Verify remote was added
git remote -v

# Should show:
# origin  https://github.com/yourusername/nexora-event-management.git (fetch)
# origin  https://github.com/yourusername/nexora-event-management.git (push)

# Create main branch (or rename from master)
git branch -M main
```

---

## ✅ STEP 4: INITIAL COMMIT

```bash
# Check status
git status

# Add all files
git add .

# Verify what will be committed
git status

# Commit with meaningful message
git commit -m "init: Nexora Event Management System Phase 1 setup

- React + TypeScript frontend with Vite and Tailwind CSS
- Express + TypeScript backend with MySQL
- Complete database schema
- Reusable UI components
- Authentication middleware structure
- Comprehensive documentation
- GitHub workflows for CI/CD

Team: Dhyey, Vidhan, Samarth, Manthan"

# Verify commit
git log --oneline -1
```

---

## 🚀 STEP 5: PUSH TO GITHUB

### First Push (Create main branch on GitHub)

```bash
# Push to GitHub main branch with upstream tracking
git push -u origin main

# You may be prompted to authenticate:
# - If using HTTPS: Enter your GitHub username and personal access token
# - If using SSH: Make sure SSH keys are configured
```

### Subsequent Pushes

```bash
# After first push, simply use:
git push

# Or be explicit:
git push origin main
```

---

## 🔑 AUTHENTICATION OPTIONS

### Option A: Personal Access Token (Recommended for HTTPS)

1. **Generate Token on GitHub**:
   - Go to Settings → Developer settings → Personal access tokens
   - Click "Generate new token"
   - Give it a name (e.g., "Nexora Development")
   - Select scopes: `repo`, `workflow`
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Use Token for Authentication**:
   ```bash
   # When prompted for password, paste the token instead
   git push origin main
   ```

3. **Cache Token** (Windows/macOS/Linux):
   ```bash
   # Git will remember your credentials
   git config credential.helper store
   git push origin main
   # Enter username and paste token when prompted
   # Credentials will be cached
   ```

### Option B: SSH Keys (Recommended for frequent pushing)

1. **Generate SSH Key** (if not already done):
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   # Or for older systems:
   ssh-keygen -t rsa -b 4096 -C "your.email@example.com"
   
   # Press Enter for default location
   # Enter passphrase (optional)
   ```

2. **Add SSH Key to GitHub**:
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub Settings → SSH and GPG keys
   - Click "New SSH key"
   - Paste the public key
   - Click "Add SSH key"

3. **Update Remote URL** (if you added HTTPS):
   ```bash
   git remote set-url origin git@github.com:yourusername/nexora-event-management.git
   ```

4. **Push with SSH**:
   ```bash
   git push origin main
   ```

---

## 📊 STEP 6: VERIFY GITHUB REPOSITORY

After pushing, verify on GitHub:

1. **Go to your repository**: `https://github.com/yourusername/nexora-event-management`
2. **Check files are there**: Main branch should have all 60+ files
3. **Check commit history**: Should show your initial commit
4. **Check workflows**: 
   - Go to "Actions" tab
   - Should see frontend.yml and backend.yml workflows
5. **Check branches**: Main branch should be the default

---

## 🔄 SETTING UP FOR TEAM DEVELOPMENT

### For Team Members to Contribute

1. **Fork the repository** (if needed)
   ```bash
   # Go to GitHub and click "Fork"
   ```

2. **Clone repository**:
   ```bash
   git clone https://github.com/yourusername/nexora-event-management.git
   cd nexora-event-management
   ```

3. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make changes** and commit:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. **Push branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request** on GitHub

---

## 📚 STEP 7: CONFIGURE REPOSITORY SETTINGS

### On GitHub Repository Page

1. **Settings → General**:
   - [ ] Add description: "Modern Event Management System"
   - [ ] Add topics: `react`, `express`, `typescript`, `mysql`, `event-management`
   - [ ] Set "Default branch" to `main`

2. **Settings → Collaborators and teams**:
   - Add team members (Dhyey, Vidhan, Manthan)
   - Set appropriate permissions

3. **Settings → Branch protection rules**:
   - Protect `main` branch
   - Require pull request reviews
   - Require status checks to pass

4. **Settings → Actions**:
   - Enable workflows (should be enabled by default)

---

## 📋 COMMON GIT COMMANDS FOR TEAM

```bash
# Create and switch to feature branch
git checkout -b feature/new-feature

# See status
git status

# Add specific files
git add frontend/src/components/Button.tsx

# Add all changes
git add .

# Commit changes
git commit -m "feat: add button component"

# Push to GitHub
git push origin feature/new-feature

# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge feature into main (via PR on GitHub)
# OR locally:
git merge feature/new-feature

# View commit history
git log --oneline

# View branches
git branch -a

# Delete local branch
git branch -d feature/new-feature

# Delete remote branch
git push origin --delete feature/new-feature
```

---

## 🚨 TROUBLESHOOTING

### "Authentication failed"
```bash
# Reset credentials
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Clear cached credentials (if applicable)
git config --global --unset credential.helper
```

### "Permission denied (publickey)"
```bash
# SSH key not set up properly
# Solution: Use HTTPS instead or set up SSH keys

# Use HTTPS URL
git remote set-url origin https://github.com/yourusername/nexora-event-management.git
```

### "Remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/yourusername/nexora-event-management.git
```

### "Your branch is ahead by X commits"
```bash
# You have local commits not pushed
git push origin main
```

### "Changes would be overwritten by merge"
```bash
# Stash changes or commit them
git stash

# Then pull
git pull origin main

# Apply stashed changes
git stash pop
```

---

## ✨ GITHUB WORKFLOW AUTOMATION

The CI/CD pipelines will automatically:

✅ **Run on every push** to `main` or `develop` branch  
✅ **Check code with ESLint** (warnings don't block)  
✅ **Verify TypeScript** types  
✅ **Build frontend** with Vite  
✅ **Build backend** with TypeScript  
✅ **Test on Node 18 and 20**  

View results in the "Actions" tab on GitHub.

---

## 📱 BRANCH STRATEGY

Recommended workflow:

```
main (production-ready)
  ↑
  └─ develop (integration branch)
      ↑
      ├─ feature/auth-system
      ├─ feature/event-crud
      ├─ feature/dashboard
      ├─ bugfix/login-issue
      └─ docs/update-readme
```

---

## 📖 GITHUB README TIPS

Your GitHub repository README should include:

- ✅ Project description
- ✅ Tech stack used
- ✅ Features overview
- ✅ Quick start instructions
- ✅ Contributing guidelines
- ✅ License information
- ✅ Contact information
- ✅ Build status badge (GitHub Actions)

---

## 🎓 FINAL CHECKLIST

Before considering the GitHub setup complete:

- [x] Repository created on GitHub
- [x] Local git initialized
- [x] Remote configured
- [x] Initial commit made
- [x] Code pushed to main
- [x] All files visible on GitHub
- [x] GitHub workflows configured
- [x] Repository settings configured
- [x] Team members added (if applicable)
- [x] README visible on GitHub
- [x] CONTRIBUTING.md linked
- [x] CODE_OF_CONDUCT.md visible

---

## 📞 NEXT STEPS

1. **Share repository URL** with team members
2. **Add team members** as collaborators
3. **Create develop branch** for ongoing development
4. **Start Phase 2** by creating feature branches
5. **Use pull requests** for code reviews

---

## 🎉 YOU'RE READY!

Your Nexora project is now ready to collaborate on GitHub!

**Repository URL**: `https://github.com/yourusername/nexora-event-management`

**Happy coding!** 🚀

---

**Last Updated**: May 24, 2025  
**Status**: ✅ Ready for GitHub  
**Version**: 1.0.0
