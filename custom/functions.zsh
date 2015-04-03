# Open an SQLite file in home directory tree
function opensql() { find ~ -name $1.sqlite -exec sqlite3 '{}' + ; }

# List path components, one per line
function path() { echo -e ${PATH//:/\\n}; }

# Convert hex to decimal
function h2d() { printf '%d\n' 0x$1; }

# Convert decimal to hex
function d2h() { printf '%x\n' $1; }
