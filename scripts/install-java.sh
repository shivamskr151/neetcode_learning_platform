#!/bin/bash

# Script to install Java on macOS

echo "🔍 Checking Java installation..."

# Check if Java is already installed
if command -v java &> /dev/null && java -version &> /dev/null; then
    echo "✅ Java is already installed!"
    java -version
    exit 0
fi

echo "📦 Java not found. Installing OpenJDK via Homebrew..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed."
    echo "Please install Homebrew first:"
    echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    exit 1
fi

# Install OpenJDK
echo "Installing OpenJDK (this may take a few minutes)..."
brew install openjdk

# Set JAVA_HOME
echo ""
echo "🔧 Setting up JAVA_HOME..."

# Detect shell
SHELL_NAME=$(basename "$SHELL")
if [ "$SHELL_NAME" = "zsh" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ "$SHELL_NAME" = "bash" ]; then
    SHELL_RC="$HOME/.bash_profile"
else
    SHELL_RC="$HOME/.profile"
fi

# Add JAVA_HOME if not already present
if ! grep -q "JAVA_HOME" "$SHELL_RC" 2>/dev/null; then
    echo "" >> "$SHELL_RC"
    echo "# Java Configuration" >> "$SHELL_RC"
    echo 'export JAVA_HOME=$(/usr/libexec/java_home)' >> "$SHELL_RC"
    echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> "$SHELL_RC"
    echo "✅ Added JAVA_HOME to $SHELL_RC"
else
    echo "ℹ️  JAVA_HOME already configured in $SHELL_RC"
fi

# Set JAVA_HOME for current session
export JAVA_HOME=$(/usr/libexec/java_home 2>/dev/null)
if [ -z "$JAVA_HOME" ]; then
    # Try to find Java
    JAVA_HOME=$(brew --prefix openjdk 2>/dev/null)
    if [ -n "$JAVA_HOME" ]; then
        export JAVA_HOME
        export PATH="$JAVA_HOME/bin:$PATH"
    fi
fi

echo ""
echo "✅ Java installation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Reload your shell configuration:"
echo "   source $SHELL_RC"
echo ""
echo "2. Or restart your terminal"
echo ""
echo "3. Verify installation:"
echo "   java -version"
echo "   javac -version"
echo ""

# Try to verify
if command -v java &> /dev/null; then
    echo "🎉 Java is now available!"
    java -version
else
    echo "⚠️  Please reload your shell or restart your terminal for changes to take effect."
fi

