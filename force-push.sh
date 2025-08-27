#!/bin/bash

echo "🗑️  Emptying existing repository and pushing new content..."

# Remove the remote if it exists
git remote remove origin 2>/dev/null || true

# Add your actual repository URL (replace with your GitHub username and repo name)
echo "📡 Adding remote origin..."
git remote add origin https://github.com/YOUR_USERNAME/siddesh-logistics-bill-generator.git

# Force push to overwrite existing content
echo "🚀 Force pushing to empty the repository and add new content..."
git push --force -u origin main

echo "✅ Repository has been emptied and new content pushed!"
echo "🌐 Check your repository at: https://github.com/YOUR_USERNAME/siddesh-logistics-bill-generator"
