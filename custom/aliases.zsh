alias appstore='find /Applications -path "*Contents/_MASReceipt/receipt" -maxdepth 4 -print |\sed "s#.app/Contents/_MASReceipt/receipt#.app#g; s#/Applications/##"'
alias bls='brew list'
alias bo='brew outdated'
alias bucp='brew upgrade && brew cleanup && brew prune'
alias cat='pygmentize -O style=monokai -f console256 -g'
alias chrome-dev='open -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --disable-web-security -–allow-file-access-from-files'
alias fixopenwith='/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user'
alias get='git'
alias gkd='git ksdiff'
alias glod='git pull origin develop'
alias glom='git pull origin master'
alias gn='geeknote'
alias gpod='git push origin develop'
alias gpom='git push origin master'
alias gti='git'
alias hs='history | grep'
alias json='jq "."'
alias ni='npm install'
alias nis='npm install --save'
alias nisd='npm install --save-dev'
alias nls='npm list -g --depth=0'
alias pubkey='pbcopy < ~/.ssh/id_rsa.pub'

alias v='mvim'
alias xml='xmllint --format -'
