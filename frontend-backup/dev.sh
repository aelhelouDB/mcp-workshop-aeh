#!/bin/bash

# Development script for the MCP Workshop frontend

echo "🚀 Starting Databricks MCP Workshop frontend..."
echo ""
echo "Building optimized version..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo "📍 Running on: http://localhost:3000"
    echo ""
    echo "Available routes:"
    echo "  • Home: http://localhost:3000"
    echo "  • Managed MCP: http://localhost:3000/managed-mcp"
    echo "  • External MCP: http://localhost:3000/external-mcp"
    echo "  • Custom MCP: http://localhost:3000/custom-mcp"
    echo "  • Local IDE: http://localhost:3000/local-ide"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    # Start the static server
    npx serve out -p 3000
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
