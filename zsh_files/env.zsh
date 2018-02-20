ulimit -n 2048

# Homebrew
if [ -d $HOME/.homebrew ]; then
    HOMEBREW=$HOME/.homebrew
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
#[ -f $HOME/.grc.zsh ] && source $HOME/.grc.zsh

# NVM
export NVM_DIR=$HOME/.nvm
[ -f $NVM_DIR/nvm.sh ] && source $NVM_DIR/nvm.sh  # This loads nvm

# pyenv
export PATH=$HOME/.pyenv/bin:$PATH
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"

# User configuration
export PATH="$PATH:$HOME/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

# For tab completion
export FIGNORE=".o:~:Application Scripts"

# Java
export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)
export JAVA8_HOME=$JAVA_HOME
export JAVA7_HOME=$JAVA_HOME
export JAVA6_HOME=$JAVA_HOME

export JBOSS_HOME=$HOME/jboss
export _JAVA_OPTIONS="-Dapple.awt.UIElement=true"

# Gradle
export GRADLE_OPTS="-Xmx1024m -Xms256m -XX:MaxPermSize=512m -XX:+CMSClassUnloadingEnabled -XX:+HeapDumpOnOutOfMemoryError"

export EDITOR='nvim'
export OSC_EDITOR='nvim' # OpenShift

# Install z plugin
source $HOMEBREW/etc/profile.d/z.sh

# For poll
export REMOTE_USER=rwarner

# RVM
[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"
export PATH="$PATH:$HOME/.rvm/bin"

# GRC
#source $HOMEBREW/etc/grc.bashrc

# Proxy
[[ -s $HOME/.proxy ]] && source $HOME/.proxy

# FZF
export FZF_DEFAULT_COMMAND='rg --files --no-ignore --hidden --follow --glob "!.git/*"'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"

# Eliminate duplicate path entries
typeset -U PATH
