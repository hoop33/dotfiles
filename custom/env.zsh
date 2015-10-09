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

# FZF
[ -f $HOME/.fzf.zsh ] && source $HOME/.fzf.zsh

# iTerm
[ -f $HOME/.iterm2_shell_integration.zsh ] && source $HOME/.iterm2_shell_integration.zsh

# NVM
export NVM_DIR=$HOME/.nvm
[ -f $NVM_DIR/nvm.sh ] && source $NVM_DIR/nvm.sh  # This loads nvm
nvm use 0.12 >/dev/null

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
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_51.jdk/Contents/Home

# For AXI builds
export JAVA3_HOME=/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home
export JAVA4_HOME=/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home
export JAVA5_HOME=/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home
export JAVA6_HOME=/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home
export JAVA7_HOME=/Library/Java/JavaVirtualMachines/jdk1.7.0_79.jdk/Contents/Home
export JAVA8_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_51.jdk/Contents/Home
export JBOSS_HOME=$HOME/jboss

# Gradle
export GRADLE_OPTS="-Xmx1024m -Xms256m -XX:MaxPermSize=512m -XX:+CMSClassUnloadingEnabled -XX:+HeapDumpOnOutOfMemoryError"

export EDITOR='mvim -f'

# Install z plugin
source `brew --prefix`/etc/profile.d/z.sh

# For poll
export REMOTE_USER=rwarner
#
# Eliminate duplicate path entries
typeset -U PATH
