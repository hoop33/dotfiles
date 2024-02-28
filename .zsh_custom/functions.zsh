# Open an SQLite file in home directory tree
function opensql() { find ~ -name $1.sqlite -exec sqlite3 '{}' + ; }

# List path components, one per line
function path() { echo -e ${PATH//:/\\n}; }

# Convert hex to decimal
function h2d() { printf '%d\n' 0x"$1"; }

# Convert decimal to hex
function d2h() { printf '%x\n' "$1"; }

# Switch to branch
function gbs() {
  local branches branch
  branches=$(git branch | grep -v "^\*") &&
    branch=$(echo "$branches" | fzf --no-multi) &&
    git switch $(echo "$branch" | sed "s/.* //")
}

# Delete a branch
function gbd() {
  local branches branch
  branches=$(git branch | grep -v "^\*") &&
    branch=$(echo "$branches" | fzf --multi) &&
    git branch -d $(echo "$branch" | sed "s/.* //")
}

# git log --author
function gla() { git log --author "$1"; }

# git branch --set-upstream-to
function gsut() {
  local current
  current="$(git rev-parse --abbrev-ref HEAD)"

  local upstream
  if [[ $# -eq 0 ]]; then
    upstream=$current
  else
    upstream=$1
  fi

  git branch --set-upstream-to="origin/$upstream" "$current"
}

# Accept java version, java --version, and java -version
#function java() {
  #case $* in
    #-v|--version|version) shift 1; command java -version ;;
    #*) command java "$@" ;;
  #esac
#}

# Print out a color table
function colours() {
  for i in {0..255}; do
    if ((i < 10)); then
      prefix="    "
    elif ((i < 100)); then
      prefix="   "
    else
      prefix="  "
    fi
    printf "\x1b[48;5;${i}m\x1b[38;5;$[255-i]m${prefix}${i} "
    if (((i+1)%16 == 0)); then
      printf "\n"
    fi
  done
  printf "\x1b[0m\n"
}

# Test to see whether your terminal supports truecolor
function truecolor() {
  awk 'BEGIN{
    s="          "; s=s s s s s s s s;
    for (colnum = 0; colnum<77; colnum++) {
      r = 255-(colnum*255/76);
      g = (colnum*510/76);
      b = (colnum*255/76);
      if (g>255) g = 510-g;
      printf "\033[48;2;%d;%d;%dm", r,g,b;
      printf "\033[38;2;%d;%d;%dm", 255-r,255-g,255-b;
      printf "%s\033[0m", substr(s,colnum+1,1);
    }
    printf "\n";
  }'
}

# wh = "who has" -- print the process listening on PORT
function wh() {
  if [[ $# -eq 0 ]]; then
    echo "usage: wh PORT"
  else
    PID=$(netstat -vanp tcp | grep "\*\.$1 " | awk '{ print $9 }')
    if [[ ${PID} -eq 0 ]]; then
      echo "no pid for port $1"
    else
        ps -a "${PID}"
    fi
  fi
}

# Inspired by Brett Terpstra
# Imagine you've made a typo in a command, e.g., `car foo.txt`
# You want to rerun the previous command, changing the first instance of `car` to `cat`
# Just run `fix car cat`
function fix() {
  if [[ $# -ne 2 ]]; then
    echo "usage: fix [bad] [good]"
  else
    local cmd
    cmd=$(fc -ln -1 | sed -e 's/^ +//' | sed -e "s/$1/$2/")
    eval "$cmd"
  fi
}

# Decode a URL
function urldecode() {
  echo -e "$(sed 's/+/ /g;s/%\(..\)/\\x\1/g;')"
}

# Change pyenv global version
function pyg() {
  pyenv global $(pyenv versions --bare | fzf)
  pyenv global
}

# cat s3 file
function s3cat() {
  local bucket file tmpfile

  bucket=$(aws s3 ls | tr -s ' ' | cut -d' ' -f 3- | fzf)
  [ -n "$bucket" ] && file=$(aws s3 ls "$bucket" --recursive | tr -s ' ' | cut -d' ' -f 4- | fzf)

  if [ -n "$file" ]; then
    aws s3 cp "s3://$bucket/$file" - | cat
  fi
}

# ls -l which $($1)
function lw() {
  if [[ $# -eq 0 ]]; then
    echo "usage: lw <executable>"
  else
    eza -alm $(which "$1")
  fi
}

# Piknik
# pko <content> : copy <content> to the clipboard
pko() {
    echo "$*" | piknik -copy
}

# pkf <file> : copy the content of <file> to the clipboard
pkf() {
    piknik -copy < $1
}

# pkfr [<dir>] : send a whole directory to the clipboard, as a tar archive
pkfr() {
    tar czpvf - ${1:-.} | piknik -copy
}

# Download check
dlc() {
  if [[ $# -ne 3 ]]; then
    echo "usage: dlc <algorithm> <expected> <file>"
  else
    case $1 in
      md5|5) command echo "$2" "$3" | md5sum --check ;;
      sha256|256) command echo "$2" "$3" | sha256sum --check ;;
      sha512|512) command echo "$2" "$3" | sha512sum --check ;;
      *) echo "algorithm must be md5, sha256, or sha512" ;;
    esac
  fi
}

# SDKMAN
javad() {
  sdk default java $(sdk list java | grep 'installed\|local only' | awk '{print $NF}' | fzf)
}

ai() {
  local name
  if [[ $# -eq 0 ]]; then
    name=$(asdf plugin list | fzf)
  else
    name=$1
  fi
  asdf install $name $({ comm -23 <(asdf list all $name | sort --version-sort) <(asdf list $name | awk '{print $1}' | sort --version-sort); echo "latest"; } | fzf)
}

au() {
  local name
  if [[ $# -eq 0 ]]; then
    name=$(asdf plugin list | fzf)
  else
    name=$1
  fi
  asdf global $name $({ asdf list $name | awk '{print $1}' | grep -v "^\*"; echo "latest"; } | fzf)
}

# Kitty
kittycolors() {
  if [[ $# -eq 0 ]]; then
    grep -o "#[a-f0-9]\{6\}" ~/.config/kitty/current-theme.conf | pastel color
  else
    case $1 in
      short|--short|-s) for COLOR in $(grep -o "#[a-f0-9]\{6\}" ~/.config/kitty/current-theme.conf); do pastel paint $(pastel textcolor $COLOR) --on $COLOR "$COLOR          "; done ;;
      *) echo "usage: kittycolors [-s]" ;;
    esac
  fi
}

vcat() {
  if [[ $# -eq 0 ]]; then
    echo "usage: vcat <UUID>"
  else
    local partition
    partition="$1"

    local id
    id=$(vault --bucket availity-data-lake-nonprod-qa-us-east-1 --suppress-header --format csv "$partition" | awk -F "," '{print $1}' | fzf)
    if [[ $id ]]; then
      shift
      vault "$partition/$id" $@
    fi
  fi
}

# Shell wrapper for `yazi`
# https://yazi-rs.github.io/docs/quick-start/
function ya() {
  local tmp="$(mktemp -t "yazi-cwd.XXXXX")"
	yazi "$@" --cwd-file="$tmp"
	if cwd="$(cat -- "$tmp")" && [ -n "$cwd" ] && [ "$cwd" != "$PWD" ]; then
		cd -- "$cwd"
	fi
	rm -f -- "$tmp"
}
