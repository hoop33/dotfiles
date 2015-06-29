ulimit -n 2048

# Homebrew
if [ -d $HOME/homebrew ]; then
  HOMEBREW=$HOME/homebrew
else
  HOMEBREW=/usr/local
fi
export HOMEBREW
export PATH=$HOMEBREW/bin:$PATH

# Groovy
export GROOVY_HOME=$HOMEBREW/opt/groovy/libexec

# Go
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin:$HOMEBREW/opt/go/libexec/bin

# User configuration
export PATH="$PATH:$HOME/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

if [ -d $HOME/Dropbox ]; then
  export SAFE_DIR=$HOME/Dropbox
else
  export SAFE_DIR=$HOME
fi

# For tab completion
export FIGNORE=".o:~:Application Scripts"

# Java
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home

# For AXI builds
export JAVA3_HOME=/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home
export JAVA4_HOME=/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home
export JAVA5_HOME=/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home
export JAVA6_HOME=/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home
export JBOSS_HOME=$HOME/jboss
export JAVA_CRAP=/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home

# Gradle
export GRADLE_OPTS="-Xmx1024m -Xms256m -XX:MaxPermSize=512m -XX:+CMSClassUnloadingEnabled -XX:+HeapDumpOnOutOfMemoryError"

export EDITOR='mvim -f'

export NVM_DIR=$HOME/.nvm
source $(brew --prefix nvm)/nvm.sh
nvm use node > /dev/null

# For building Lime
export PKG_CONFIG_PATH=$(brew --prefix python3)/Frameworks/Python.framework/Versions/3.4/lib/pkgconfig:$(brew --prefix qt5)/lib/pkgconfig

# Install z plugin
source `brew --prefix`/etc/profile.d/z.sh

# For poll
export REMOTE_USER=rwarner
#
# Eliminate duplicate path entries
typeset -U PATH
