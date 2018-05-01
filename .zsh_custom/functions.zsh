# Open an SQLite file in home directory tree
function opensql() { find ~ -name $1.sqlite -exec sqlite3 '{}' + ; }

# List path components, one per line
function path() { echo -e ${PATH//:/\\n}; }

# Convert hex to decimal
function h2d() { printf '%d\n' 0x$1; }

# Convert decimal to hex
function d2h() { printf '%x\n' $1; }

# Search dash
function dash() { open dash://$1; }

# Check out branch
function fbr() {
  local branches branch
  branches=$(git branch) &&
    branch=$(echo "$branches" | fzf +m) &&
    git checkout $(echo "$branch" | sed "s/.* //")
}

# Accept java version, java --version, and java -version
function java() {
  case $* in
    -v)
      ;&
    version)
      ;&
    --version) shift 1; command java -version ;;
    *) command java "$@" ;;
  esac
}

# git log --author
function gla() { git log --author "$1"; }

# Go continuous testing
# https://gist.github.com/andystanton/b273bb855202d91a42ae
function gotest() {
  local project_hash=-1
  while true; do
    local new_project_hash="$(find . -type f -print0 | sort -z | xargs -0 shasum | shasum)"
    if [ "${new_project_hash}" != "${project_hash}" ]; then
      project_hash="${new_project_hash}"
      echo "Change detected - executing tests..."
      go test ./...
      echo
    fi
    sleep 5
  done
}

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

function truecolor() {
  awk 'BEGIN{
    s="/\\/\\/\\/\\/\\"; s=s s s s s s s s;
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
