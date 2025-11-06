#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Function to check if we're in a git repository
is_git_repo() {
    git rev-parse --is-inside-work-tree &>/dev/null
    return $?
}

# Function to get current branch
get_current_branch() {
    git rev-parse --abbrev-ref HEAD 2>/dev/null
}

# Function to check if remote exists
remote_exists() {
    git remote get-url origin &>/dev/null
    return $?
}

# Main script
clear
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  Git Push Automation Script${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Check if we're in a git repository
if is_git_repo; then
    print_info "Existing Git repository detected"
    
    # Check if remote origin exists
    if remote_exists; then
        current_remote=$(git remote get-url origin)
        print_info "Current remote origin: ${YELLOW}$current_remote${NC}"
        echo ""
        echo "What would you like to do?"
        echo "1) Push to existing remote ($current_remote)"
        echo "2) Change remote and push to new repository"
        read -p "Enter your choice (1 or 2): " choice
        
        if [ "$choice" = "2" ]; then
            read -p "Enter new GitHub repository URL (SSH format): " github_url
            if [ -z "$github_url" ]; then
                print_error "No URL provided. Exiting."
                exit 1
            fi
            print_info "Changing remote origin to: $github_url"
            git remote set-url origin "$github_url"
            print_success "Remote origin updated"
        fi
    else
        print_warning "No remote origin found"
        read -p "Enter GitHub repository URL (SSH format): " github_url
        if [ -z "$github_url" ]; then
            print_error "No URL provided. Exiting."
            exit 1
        fi
        print_info "Adding remote origin: $github_url"
        git remote add origin "$github_url"
        print_success "Remote origin added"
    fi
else
    print_info "Not a Git repository. Initializing..."
    git init
    print_success "Git repository initialized"
    
    read -p "Enter GitHub repository URL (SSH format): " github_url
    if [ -z "$github_url" ]; then
        print_error "No URL provided. Exiting."
        exit 1
    fi
    
    print_info "Adding remote origin: $github_url"
    git remote add origin "$github_url"
    print_success "Remote origin added"
fi

echo ""
print_info "Checking repository status..."
echo ""

# Check if there are any changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Uncommitted changes detected"
    git status --short
    echo ""
    
    read -p "Do you want to add all files? (y/n): " add_all
    if [ "$add_all" = "y" ] || [ "$add_all" = "Y" ]; then
        print_info "Adding all files..."
        git add .
        print_success "All files added"
    else
        print_info "Please add files manually using: git add <files>"
        exit 0
    fi
    
    echo ""
    read -p "Enter commit message: " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="Update: $(date '+%Y-%m-%d %H:%M:%S')"
        print_warning "No message provided. Using default: $commit_msg"
    fi
    
    print_info "Committing changes..."
    git commit -m "$commit_msg"
    print_success "Changes committed"
else
    print_info "No uncommitted changes. Working directory is clean."
    
    # Check if there are any commits
    if ! git log -1 &>/dev/null; then
        print_warning "No commits found. Creating initial commit..."
        git add .
        git commit -m "Initial commit"
        print_success "Initial commit created"
    fi
fi

echo ""
current_branch=$(get_current_branch)
print_info "Current branch: ${YELLOW}$current_branch${NC}"

# Ask about branch
if [ "$current_branch" != "main" ]; then
    echo ""
    read -p "Switch to 'main' branch? (y/n): " switch_main
    if [ "$switch_main" = "y" ] || [ "$switch_main" = "Y" ]; then
        # Check if main branch exists
        if git show-ref --verify --quiet refs/heads/main; then
            git checkout main
        else
            git checkout -b main
        fi
        print_success "Switched to main branch"
        current_branch="main"
    fi
fi

echo ""
print_info "Fetching remote changes..."
git fetch origin 2>/dev/null

# Try to pull if branch exists on remote
if git ls-remote --heads origin "$current_branch" | grep -q "$current_branch"; then
    print_info "Remote branch exists. Pulling latest changes..."
    if git pull origin "$current_branch" --rebase; then
        print_success "Successfully pulled and rebased"
    else
        print_warning "Merge conflicts detected or pull failed"
        echo ""
        read -p "Do you want to continue with push? (y/n): " continue_push
        if [ "$continue_push" != "y" ] && [ "$continue_push" != "Y" ]; then
            print_error "Push cancelled. Please resolve conflicts manually."
            exit 1
        fi
    fi
fi

echo ""
print_info "Pushing to origin/$current_branch..."

# Push with upstream setting
if git push -u origin "$current_branch"; then
    echo ""
    print_success "✓ Successfully pushed to origin/$current_branch"
    echo ""
    print_info "Repository URL: $(git remote get-url origin)"
    print_info "Branch: $current_branch"
else
    echo ""
    print_error "Push failed!"
    echo ""
    print_info "Possible reasons:"
    echo "  - SSH key not configured"
    echo "  - No permission to push to repository"
    echo "  - Network connection issue"
    echo "  - Force push may be required (use: git push -f origin $current_branch)"
    exit 1
fi

echo ""
print_success "All operations completed successfully! 🎉"