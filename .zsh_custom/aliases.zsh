alias bls='brew list'
alias bo='brew outdated'
alias bu='brew upgrade'
alias cat='bat --theme TwoDark'
alias cpwd='pwd | tr -d "\n" | pbcopy'
alias e='eza -alm --group-directories-first --git --icons'
alias fixopenwith='/System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -kill -r -domain local -domain user'
#alias ls='lsd'
alias icat='kitty +kitten icat'
alias l='ls -la'
alias lt='ls --tree'
alias mkae='make'
alias mit='curl https://hoop33.mit-license.org/license.txt > LICENSE'
alias pubkey='pbcopy < ~/.ssh/id_ed25519.pub'
alias sz='source ~/.zshrc'
alias tmfast='sudo sysctl debug.lowpri_throttle_enabled=0'
alias xml='xmllint --format -'
alias telent='telnet'
alias xdg='cd ~/.config'
alias web='python -m http.server'
alias -s go='go run'

if [[ "$OSTYPE" == "linux-gnu" ]]; then
  alias xclipc='xclip -in -selection clip'
  alias xclipp='xclip -out -selection clip'
  alias pbcopy='xclip -in -selection clip'
  alias pbpaste='xclip -out -selection clip'
fi

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
alias merge='git merge'
alias pull='git pull'
alias push='git push'
alias switch='git switch'
unalias gbs
unalias gbd

# Claude, because I can't spell
alias calude='claude'

# Russ Time
alias russtime='TZ_LIST="Australia/Melbourne" tz'

# Password generator
alias pw='coinflip --faces "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789\!@#$%^&*()-_+=.,?" --count 20'
