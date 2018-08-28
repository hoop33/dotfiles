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
source $HOMEBREW/share/zsh-autosuggestions/zsh-autosuggestions.zsh

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
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm use 9.6.0 1>/dev/null

# pyenv
export PYENV_ROOT=$HOME/.pyenv
export PATH=$PYENV_ROOT/bin:$PATH
eval "$(pyenv init -)"

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
export FZF_DEFAULT_COMMAND='rg --files --no-ignore --hidden --follow --glob "!.git/*" --glob "!node_modules/*" --glob "!vendor/*" --glob "!build/*" --glob "!dist/*"'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"

# zsh-completions
fpath=($HOMEBREW/share/zsh-completions $fpath)

# Eliminate duplicate path entries
typeset -U PATH
