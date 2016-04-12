ulimit -n 2048

# Homebrew
if [ -d $HOME/homebrew ]; then
    HOMEBREW=$HOME/homebrew
else
    HOMEBREW=/usr/local
fi
export PATH=$HOMEBREW/bin:$PATH

# Groovy
export GROOVY_HOME=$HOMEBREW/opt/groovy/libexec

# Go
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

# FZF
[ -f $HOME/.fzf.zsh ] && source $HOME/.fzf.zsh

# iTerm
[ -f $HOME/.iterm2_shell_integration.zsh ] && source $HOME/.iterm2_shell_integration.zsh

# NVM
export NVM_DIR=$HOME/.nvm
[ -f $NVM_DIR/nvm.sh ] && source $NVM_DIR/nvm.sh  # This loads nvm
nvm use 5 >/dev/null

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
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_72.jdk/Contents/Home

# For AXI builds
JAVA_BASE=/Library/Java/JavaVirtualMachines
JAVA6=$(ls -d $JAVA_BASE/*1.6* 2>/dev/null)
JAVA7=$(ls -d $JAVA_BASE/*1.7* 2>/dev/null)
JAVA8=$(ls -d $JAVA_BASE/*1.8* 2>/dev/null)

if [ "$JAVA6" != "" ]; then
  export JAVA3_HOME=$JAVA6/Contents/Home
  export JAVA4_HOME=$JAVA6/Contents/Home
  export JAVA5_HOME=$JAVA6/Contents/Home
  export JAVA6_HOME=$JAVA6/Contents/Home
  alias java6="export JAVA_HOME=$(/usr/libexec/java_home -v 1.6)"
fi

if [ "$JAVA7" != "" ]; then
  export JAVA7_HOME=$JAVA7/Contents/Home
  alias java7="export JAVA_HOME=$(/usr/libexec/java_home -v 1.7)"
fi

if [ "$JAVA8" != "" ]; then
  export JAVA8_HOME=$JAVA8/Contents/Home
  alias java8="export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)"
fi

export JBOSS_HOME=$HOME/jboss
export _JAVA_OPTIONS="-Dapple.awt.UIElement=true"

# Gradle
export GRADLE_OPTS="-Xmx1024m -Xms256m -XX:MaxPermSize=512m -XX:+CMSClassUnloadingEnabled -XX:+HeapDumpOnOutOfMemoryError"

export EDITOR='vim'
export OSC_EDITOR='vim' # OpenShift

# Install z plugin
source $HOMEBREW/etc/profile.d/z.sh

# For poll
export REMOTE_USER=rwarner

# RVM
[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"
export PATH="$PATH:$HOME/.rvm/bin"

# Tmuxinator completion
source $HOME/.tmuxinator.zsh

# GRC
source $HOMEBREW/etc/grc.bashrc

# Eliminate duplicate path entries
typeset -U PATH
