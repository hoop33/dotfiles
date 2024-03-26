ulimit -n 2048

# Fix for VTE
if [ $TILIX_ID ] || [ $VTE_VERSION ]; then
  source /etc/profile.d/vte.sh
fi

# Android development
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools

# Homebrew
if [ -d $HOME/.homebrew ]; then
    PACKAGES=$HOME/.homebrew
    export HOMEBREW_NO_ANALYTICS=1
elif [ -d /opt/homebrew ]; then
    PACKAGES=/opt/homebrew
elif command -v brew >/dev/null; then
  PACKAGES=/usr/local
fi

if [[ ! -z "$PACKAGES" ]]; then
  export PACKAGES
  export PATH=$PACKAGES/bin:$PATH
  export HOMEBREW_INSTALL_CLEANUP=1
fi

# Go
export GOPATH=$HOME/go
export PATH=$HOME/.cargo/bin:$GOPATH/bin:$PATH
if [[ -d /usr/local/go/bin ]]; then
  export PATH=/usr/local/go/bin:$PATH
fi

# ZSH context highlighting
SHARE="${PACKAGES:-/usr}"
source "$SHARE/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh"
source "$SHARE/share/zsh-autosuggestions/zsh-autosuggestions.zsh"

# GitHub
if command -v gh >/dev/null; then
  eval "$(gh completion --shell zsh)"
fi

# zoxide, for switching directories
if command -v zoxide >/dev/null; then
  eval "$(zoxide init zsh)"
fi

# WASM
if [[ -f "$HOME/wabt/build" ]]; then
  export PATH=$PATH:$HOME/wabt/build
fi

# User configuration
export PATH="$PATH:$HOME/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

# For tab completion
export FIGNORE=".o:~:Application Scripts"

# Java
# if [[ -f "/usr/libexec/java_home" ]]; then
#   export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)
# fi
# if [[ $OSTYPE == darwin* ]]; then
#   export _JAVA_OPTIONS="-Dapple.awt.UIElement=true"
# fi

# Gradle
#export GRADLE_OPTS="-Xmx1024m -Xms256m -XX:MaxPermSize=512m -XX:+CMSClassUnloadingEnabled -XX:+HeapDumpOnOutOfMemoryError"

export EDITOR='nvim'
export OSC_EDITOR='nvim' # OpenShift

# Proxy
[[ -s $HOME/.proxy ]] && source $HOME/.proxy

# FZF
export FZF_DEFAULT_COMMAND='rg --files --no-ignore --hidden --follow --glob "!.git/*" --glob "!node_modules/*" --glob "!vendor/*" --glob "!build/*" --glob "!dist/*" --glob "!target/*" --glob "!.idea/*" --glob "!.cache/*"'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_DEFAULT_OPTS='
--height 30%
--border
--cycle
--prompt=" "
--pointer="▶"
--marker="✓"
'

# zsh-completions
fpath=($PACKAGES/share/zsh-completions $fpath)
export ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=180'

# Certs for sbt
if [[ -f "/Library/Java/JavaVirtualMachines/amazon-corretto-8.jdk/Contents/Home/jre/lib/security/cacerts" ]]; then
  export SBT_OPTS=-Djavax.net.ssl.trustStore=/Library/Java/JavaVirtualMachines/amazon-corretto-8.jdk/Contents/Home/jre/lib/security/cacerts
fi

# Airflow
export AIRFLOW_HOME="$HOME/airflow"

# Edit command line in vim
# https://www.reddit.com/r/vim/comments/9atgsj/edit_any_command_line_in_vim/
autoload -U edit-command-line
zle -N edit-command-line
bindkey -M vicmd v edit-command-line

autoload -Uz compinit && compinit

export PATH=$PATH:$HOME/.local/bin

# asdf
ASDF_DIR=$HOME/.asdf
if [ -f $ASDF_DIR/asdf.sh ]; then
  source $ASDF_DIR/asdf.sh
  fpath=($ASDF_DIR/completions $fpath)
fi

# Flutter
export FLUTTER_ROOT="$(asdf where flutter)"
export CHROME_EXECUTABLE="chromium-browser"

# Spark
export PATH=$PATH:/opt/spark-3.3.0-bin-hadoop3/bin

# Eliminate duplicate path entries
typeset -U PATH
