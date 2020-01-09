ulimit -n 2048

# Go and Rust
export GOPATH=$HOME/go
export PATH=$HOME/.cargo/bin:$GOPATH/bin:$PATH

# Homebrew
if [ -d $HOME/.homebrew ]; then
    HOMEBREW=$HOME/.homebrew
    export HOMEBREW_NO_ANALYTICS=1
else
    HOMEBREW=/usr/local
fi
export HOMEBREW
export PATH=$HOMEBREW/bin:$PATH
export HOMEBREW_INSTALL_CLEANUP=1

# ZSH context highlighting
source $HOMEBREW/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source $HOMEBREW/share/zsh-autosuggestions/zsh-autosuggestions.zsh

# Groovy
export GROOVY_HOME=$HOMEBREW/opt/groovy/libexec

# Node / nvm
source ~/.nvmload

# WASM
export PATH=$PATH:$HOME/wabt/build

# GRC
#[ -f $HOME/.grc.zsh ] && source $HOME/.grc.zsh

# pyenv
export PYENV_ROOT=$HOME/.pyenv
export PATH=$PATH:$PYENV_ROOT/bin
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

# RVM
[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"
export PATH="$PATH:$HOME/.rvm/bin"

# Proxy
[[ -s $HOME/.proxy ]] && source $HOME/.proxy

# FZF
export FZF_DEFAULT_COMMAND='rg --files --no-ignore --hidden --follow --glob "!.git/*" --glob "!node_modules/*" --glob "!vendor/*" --glob "!build/*" --glob "!dist/*" --glob "!target/*"'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"

# zsh-completions
fpath=($HOMEBREW/share/zsh-completions $fpath)

# Edit command line in vim
# https://www.reddit.com/r/vim/comments/9atgsj/edit_any_command_line_in_vim/
autoload -U edit-command-line
zle -N edit-command-line 
bindkey -M vicmd v edit-command-line

# Flutter
export FLUTTER_HOME=/opt/flutter
export PATH=$PATH:$FLUTTER_HOME/bin

# Eliminate duplicate path entries
typeset -U PATH
