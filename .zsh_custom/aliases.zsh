alias appstore='find /Applications -path "*Contents/_MASReceipt/receipt" -maxdepth 4 -print |\sed "s#.app/Contents/_MASReceipt/receipt#.app#g; s#/Applications/##"'
alias big="osascript ~/bin/large-type.scpt"
alias bls='brew list'
alias bo='brew outdated'
alias bcp='brew cleanup && brew prune'
alias bucp='brew upgrade && brew cleanup && brew prune'
alias bimv='brew remove macvim && brew install macvim --with-override-system-vim --with-lua && brew linkapps macvim'
alias dog='pygmentize -O style=paraiso-dark -f console256 -g'
alias chrome-dev='open -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --disable-web-security -–allow-file-access-from-files'
alias fixopenwith='/System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -kill -r -domain local -domain user'
alias lg='ls-go -aklnSL'
alias gn='geeknote'
alias -s go='go run'
alias hs='history | grep'
alias json='jq "."'
alias mit='curl https://hoop33.mit-license.org/license.txt > LICENSE'
#alias n='nvim'
alias ni='npm install'
alias nis='npm install --save'
alias nisd='npm install --save-dev'
alias nls='npm list -g --depth=0'
alias pubkey='pbcopy < ~/.ssh/id_rsa.pub'
alias sz='source ~/.zshrc'
alias tmfast='sudo sysctl debug.lowpri_throttle_enabled=0'
alias v='vim'
alias vv='mvim'
alias vd='vimdeck -e mvim'
alias xml='xmllint --format -'
alias telent='telnet'
alias tlh='telnet localhost'
alias web='python -m SimpleHTTPServer'

# Git
alias git='hub'
alias clone='git clone'
alias gbls="git for-each-ref --format='%(committerdate) %09 %(authorname) %09 %(refname)' | sort -k5n -k2M -k3n -k4n"
alias gcm='git commit -m'
alias get='git'
alias gfa='git fetch --all'
alias gkd='git ksdiff'
alias glc='git log -p --follow -n 1'
alias glod='git pull origin develop'
alias glom='git pull origin master'
alias gpod='git push origin develop'
alias gpom='git push origin master'
alias gs='git status'
alias gti='git'
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
