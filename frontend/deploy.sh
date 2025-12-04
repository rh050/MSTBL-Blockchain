#!/bin/bash

# MSTBL Frontend Deployment Script for Google Cloud Platform
# This script deploys the MSTBL application to Google App Engine

echo "🚀 MSTBL Frontend Deployment to Google Cloud Platform"
echo "======================================================="

# Check if gcloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if logged in to gcloud
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not logged in to gcloud. Please run: gcloud auth login"
    exit 1
fi

# Get current project
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No project set. Please run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📋 Using project: $PROJECT_ID"

# Verify we're in the correct directory
if [ ! -f "package.json" ] || [ ! -f "app.yaml" ]; then
    echo "❌ Please run this script from the frontend directory containing package.json and app.yaml"
    exit 1
fi

echo "🔧 Installing dependencies..."
npm install

echo "🏗️  Building application..."
npm run build

echo "☁️  Deploying to Google App Engine..."
gcloud app deploy app.yaml --project=$PROJECT_ID --quiet

echo "✅ Deployment completed!"
echo ""
echo "🌐 Your application is now available at:"
echo "   https://mstbl-frontend-dot-$PROJECT_ID.appspot.com"
echo ""
echo "📋 To set up a custom domain:"
echo "   gcloud app domain-mappings create your-domain.com --certificate-management=AUTOMATIC"
echo ""
echo "🎉 MSTBL Frontend successfully deployed with:"
echo "   ✅ Original MSTBL logo as favicon"
echo "   ✅ Keplr integration showing only CW20 MSTBL"
echo "   ✅ Production optimizations"
echo "   ✅ HTTPS enabled"
