ulimit -n 2048

# Homebrew
if [ -d $HOME/homebrew ]; then
    HOMEBREW=$HOME/homebrew
else
    HOMEBREW=/usr/local
fi
export HOMEBREW
export PATH=$HOMEBREW/bin:$PATH
export HOMEBREW_NO_ANALYTICS=1

# ZSH context highlighting
source $HOMEBREW/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# Groovy
export GROOVY_HOME=$HOMEBREW/opt/groovy/libexec

# Go
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

# Rust
export PATH=$PATH:$HOME/.cargo/bin

# GRC
[ -f $HOME/.grc.zsh ] && source $HOME/.grc.zsh

# NVM
export NVM_DIR=$HOME/.nvm
[ -f $NVM_DIR/nvm.sh ] && source $NVM_DIR/nvm.sh  # This loads nvm
nvm use 6 >/dev/null

# pyenv
if which pyenv > /dev/null; then eval "$(pyenv init -)"; fi

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
JAVA_BASE=/Library/Java/JavaVirtualMachines
JAVA6=$(ls -d $JAVA_BASE/*1.6* 2>/dev/null | sort | tail -n 1)
JAVA7=$(ls -d $JAVA_BASE/*1.7* 2>/dev/null | sort | tail -n 1)
JAVA8=$(ls -d $JAVA_BASE/*1.8* 2>/dev/null | sort | tail -n 1)

if [ "$JAVA6" != "" ]; then
  export JAVA3_HOME=$JAVA6/Contents/Home
  export JAVA4_HOME=$JAVA6/Contents/Home
  export JAVA5_HOME=$JAVA6/Contents/Home
  export JAVA6_HOME=$JAVA6/Contents/Home
  alias java6="export JAVA_HOME=$(/usr/libexec/java_home -v 1.6)"
  export JAVA_HOME=$(/usr/libexec/java_home -v 1.6)
fi

if [ "$JAVA7" != "" ]; then
  export JAVA7_HOME=$JAVA7/Contents/Home
  alias java7="export JAVA_HOME=$(/usr/libexec/java_home -v 1.7)"
  export JAVA_HOME=$(/usr/libexec/java_home -v 1.7)
fi

if [ "$JAVA8" != "" ]; then
  export JAVA8_HOME=$JAVA8/Contents/Home
  alias java8="export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)"
  export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)
fi

export JBOSS_HOME=$HOME/jboss
export _JAVA_OPTIONS="-Dapple.awt.UIElement=true"

# Gradle
export GRADLE_OPTS="-Xmx1024m -Xms256m -XX:MaxPermSize=512m -XX:+CMSClassUnloadingEnabled -XX:+HeapDumpOnOutOfMemoryError"

export EDITOR='nvim'
export OSC_EDITOR='nvim' # OpenShift

# Install z plugin
source $HOMEBREW/etc/profile.d/z.sh

# Shonenjump
source $HOME/.shonenjump.zsh

# For poll
export REMOTE_USER=rwarner

# RVM
[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"
export PATH="$PATH:$HOME/.rvm/bin"

# Tmuxinator completion
source $HOME/.tmuxinator.zsh

# GRC
source $HOMEBREW/etc/grc.bashrc

# Proxy
[[ -s $HOME/.proxy ]] && source $HOME/.proxy

# Eliminate duplicate path entries
typeset -U PATH
