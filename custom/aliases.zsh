alias appstore='find /Applications -path "*Contents/_MASReceipt/receipt" -maxdepth 4 -print |\sed "s#.app/Contents/_MASReceipt/receipt#.app#g; s#/Applications/##"'
alias big="osascript ~/bin/large-type.scpt"
alias bls='brew list'
alias bo='brew outdated'
alias bcp='brew cleanup && brew prune'
alias bucp='brew upgrade --all && brew cleanup && brew prune'
alias bimv='brew remove macvim && brew install macvim --with-override-system-vim --with-python --with-lua --with-cscope && brew linkapps macvim'
alias cat='pygmentize -O style=monokai -f console256 -g'
alias chrome-dev='open -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --disable-web-security -–allow-file-access-from-files'
alias fixopenwith='/System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -kill -r -domain local -domain user'
alias gn='geeknote'
alias hs='history | grep'
alias json='jq "."'
alias mit='curl http://hoop33.mit-license.org/license.txt > LICENSE'
alias ni='npm install'
alias nis='npm install --save'
alias nisd='npm install --save-dev'
alias nls='npm list -g --depth=0'
alias pubkey='pbcopy < ~/.ssh/id_rsa.pub'
alias sz='source ~/.zshrc'
alias v='mvim'
alias vd='vimdeck -e mvim'
alias xml='xmllint --format -'
alias web='python -m SimpleHTTPServer'

# Git
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

# Ember
alias egen='ember generate'
alias egenp='ember generate --pod'
alias ega='ember generate adapter'
alias egc='ember generate component'
alias egcp='ember generate component --pod'
alias egh='ember generate http-mock'
alias egm='ember generate model'
alias egr='ember generate route'
alias egrp='ember generate route --pod'
alias egs='ember generate serializer'

# Gradle
alias gce="./gradle.sh cleanEclipse eclipse"
alias gctj="./gradle.sh compileTestJava"
alias ginit="./gradle.sh initWorkspace"

# Java
[ -d /Library/Java/JavaVirtualMachines/1.6.0.jdk ] && alias java6="export JAVA_HOME=`/usr/libexec/java_home -v 1.6.0_65-b14-468`"
[ -d /Library/Java/JavaVirtualMachines/jdk1.7.0_79.jdk ] && alias java7="export JAVA_HOME=`/usr/libexec/java_home -v 1.7.0_79`"
[ -d /Library/Java/JavaVirtualMachines/jdk1.8.0_72.jdk ] && alias java8="export JAVA_HOME=`/usr/libexec/java_home -v 1.8.0_72`"

# Docker
alias ds='eval "$(docker-machine env default)"'
alias drm='docker rm $(docker ps -aq -f status=exited)'
