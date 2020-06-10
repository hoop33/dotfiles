alias al='python $HOME/.cloud/scripts/saml/saml_ping.py'
alias appstore='find /Applications -path "*Contents/_MASReceipt/receipt" -maxdepth 4 -print |\sed "s#.app/Contents/_MASReceipt/receipt#.app#g; s#/Applications/##"'
alias bls='brew list'
alias bo='brew outdated'
alias bu='brew upgrade'
alias bimv='brew remove macvim && brew install macvim --with-override-system-vim --with-lua && brew linkapps macvim'
alias cat='bat --theme TwoDark'
alias cpwd='pwd | tr -d "\n" | pbcopy'
alias e='exa -alm --group-directories-first --git --icons'
alias chrome-dev='open -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --disable-web-security -–allow-file-access-from-files'
alias fixopenwith='/System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -kill -r -domain local -domain user'
#alias ls='lsd'
alias l='ls -la'
alias lt='ls --tree'
alias lg='ls-go -alnSLN'
alias hs='history | grep'
alias mkae='make'
alias mit='curl https://hoop33.mit-license.org/license.txt > LICENSE'
alias n='nvim'
alias ni='npm install'
alias nis='npm install --save'
alias nisd='npm install --save-dev'
alias nls='npm list -g --depth=0'
alias o='Onivim2-x86_64.AppImage'
alias pubkey='pbcopy < ~/.ssh/id_rsa.pub'
alias sz='source ~/.zshrc'
alias tmfast='sudo sysctl debug.lowpri_throttle_enabled=0'
alias v='vim'
alias vv='mvim'
alias vd='vimdeck -e mvim'
alias xml='xmllint --format -'
alias telent='telnet'
alias tlh='telnet localhost'
alias xclip='xclip -selection c'
alias web2='python -m SimpleHTTPServer'
alias web='python -m http.server'
alias -s go='go run'

# Git
#alias git='hub'
alias clone='git clone'
alias gbls="git for-each-ref --format='%(committerdate) %09 %(authorname) %09 %(refname)' | sort -k5n -k2M -k3n -k4n"
alias gcm='git commit -m'
alias get='git'
alias gfa='git fetch --all'
alias gkd='git ksdiff'
alias glc='git log -p --follow -n 1'
alias gs='git status'
alias gti='git'
alias gt='gittower .'
alias merge='git merge'
alias pull='git pull'
alias push='git push'

# Gradle
alias gce="./gradle.sh cleanEclipse eclipse"
alias gctj="./gradle.sh compileTestJava"
alias ginit="./gradle.sh initWorkspace"

# Docker
alias ds='eval "$(docker-machine env default)"'
alias drm='docker rm $(docker ps -aq -f status=exited)'

alias java10='export JAVA_HOME=$(/usr/libexec/java_home -v 10)'

alias ssh="TERM=xterm-256color ssh"
