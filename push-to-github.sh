#!/bin/bash

# GitHub Repository Setup Script
# Replace 'YOUR_USERNAME' with your actual GitHub username
# Replace 'REPO_NAME' with your chosen repository name

echo "🚀 Setting up GitHub repository..."

# Set the remote origin (replace with your actual repository URL)
echo "📡 Adding remote origin..."
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo "✅ Successfully pushed to GitHub!"
echo "🌐 Your repository is now available at: https://github.com/YOUR_USERNAME/REPO_NAME"
echo ""
echo "🚀 Next steps for Vercel deployment:"
echo "1. Go to vercel.com"
echo "2. Import your GitHub repository"
echo "3. Deploy automatically!"
