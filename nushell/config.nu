# ---- UI / editing ----
$env.config.edit_mode = "vi"

# ---- External tool integrations ----
# Nushell auto-loads every *.nu file in the vendor autoload dirs, right after
# config.nu finishes -- see $nu.vendor-autoload-dirs in
# https://www.nushell.sh/book/configuration.html
let vendor_autoload = ($nu.data-dir | path join "vendor/autoload")
mkdir $vendor_autoload
starship init nu | save --force ($vendor_autoload | path join "starship.nu")
mise activate nu | save --force ($vendor_autoload | path join "mise.nu")
fzf --nushell | save --force ($vendor_autoload | path join "fzf.nu")
atuin init nu --disable-up-arrow | save --force ($vendor_autoload | path join "atuin.nu")

# ---- Zoxide ----
# Note: zoxide writes/overwrites its own file, so it must exist before
# this loads on a fresh machine -- run `touch ~/.zoxide.nu` if this errors,
# then reload the config. (Two-pass loading quirk of config.nu.)
zoxide init nushell | save --force ($nu.home-dir | path join ".zoxide.nu")
source ($nu.home-dir | path join ".zoxide.nu")

# ==== Aliases (ported from .zsh_custom/aliases.zsh) ====

alias bls = brew list
alias bo = brew outdated
alias bu = brew upgrade
alias cat = bat --theme TwoDark
alias e = eza -alm --group-directories-first --git --icons=auto
alias fixopenwith = /System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -kill -r -domain local -domain user
alias icat = kitty +kitten icat
alias l = ^ls -la
alias lt = eza -alm --group-directories-first --git --icons=auto --tree
alias mkae = make
alias pubkey = open --raw ~/.ssh/id_ed25519.pub | pbcopy
alias sz = exec nu -l
alias tmfast = sudo sysctl debug.lowpri_throttle_enabled=0
alias xml = xmllint --format -
alias telent = telnet
alias xdg = cd ~/.config
alias web = python -m http.server

# Git
# Note: zsh had `get`/`merge` aliased to git too, but those names collide
# with nu's own `get` and `merge` commands (used everywhere in pipelines) --
# dropped to avoid breaking every `| get foo` in this config and beyond.
alias clone = git clone
alias gcm = git commit -m
alias gfa = git fetch --all
alias gkd = git ksdiff
alias glc = git log -p --follow -n 1
alias gs = git status
alias gti = git
alias pull = git pull
alias push = git push
alias switch = git switch

# Claude, because I can't spell
alias calude = claude

# Apex for markdown
alias apx = apex --to terminal256

# Password generator
alias pw = coinflip --faces "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789!@#$%^&*()-_+=.,?" --count 20

if $nu.os-info.name == "linux" {
    alias xclipc = ^xclip -in -selection clip
    alias xclipp = ^xclip -out -selection clip
    alias pbcopy = ^xclip -in -selection clip
    alias pbpaste = ^xclip -out -selection clip
}

# ==== Functions (ported from .zsh_custom/functions.zsh) ====

# Open an SQLite file found under home directory tree
def opensql [name: string] {
    ^find ~ -name $"($name).sqlite" -exec sqlite3 '{}' +
}

# List PATH components, one per line (named to avoid shadowing `path ...` builtins)
def pathlist [] {
    $env.PATH | each {|p| print $p}
}

# Convert hex to decimal
def h2d [hex: string] {
    ^printf "%d\n" $"0x($hex)"
}

# Convert decimal to hex
def d2h [dec: string] {
    ^printf "%x\n" $dec
}

# Switch to a git branch using fzf
def gbs [] {
    let branch = (^git branch | ^grep -v '^\*' | ^fzf --no-multi | str trim)
    if ($branch | is-not-empty) {
        ^git switch $branch
    }
}

# Delete one or more git branches using fzf
def gbd [] {
    let branches = (^git branch | ^grep -v '^\*' | ^fzf --multi | lines | str trim | where {|it| $it | is-not-empty})
    if ($branches | is-not-empty) {
        ^git branch -d ...$branches
    }
}

# git log --author
def gla [author: string] {
    ^git log --author $author
}

# git for-each-ref, sorted by commit date
def gbls [] {
    ^git for-each-ref --format='%(committerdate) %09 %(authorname) %09 %(refname)' | ^sort -k5n -k2M -k3n -k4n
}

# git branch --set-upstream-to
def gsut [upstream?: string] {
    let current = (^git rev-parse --abbrev-ref HEAD | str trim)
    let up = ($upstream | default $current)
    ^git branch $"--set-upstream-to=origin/($up)" $current
}

# Print a 256-color table
def colours [] {
    for i in 0..255 {
        let prefix = if $i < 10 { "    " } else if $i < 100 { "   " } else { "  " }
        print -n $"\e[48;5;($i)m\e[38;5;(255 - $i)m($prefix)($i) "
        if (($i + 1) mod 16) == 0 {
            print ""
        }
    }
    print "\e[0m"
}

# Test whether your terminal supports truecolor
def truecolor [] {
    mut line = ""
    for col in 0..<77 {
        let r = (255 - ($col * 255 / 76) | into int)
        mut g = ($col * 510 / 76 | into int)
        if $g > 255 { $g = 510 - $g }
        let b = ($col * 255 / 76 | into int)
        $line = $line + $"\e[48;2;($r);($g);($b)m\e[38;2;(255 - $r);(255 - $g);(255 - $b)m "
    }
    print $line
    print "\e[0m"
}

# wh = "who has" -- print the process listening on PORT
def wh [port: string] {
    let pid = (^netstat -vanp tcp | ^grep $"\\*\\.($port) " | ^awk '{print $9}' | str trim)
    if ($pid | is-empty) or $pid == "0" {
        print $"no pid for port ($port)"
    } else {
        ^ps -a $pid
    }
}

# Rerun the previous command, replacing the first instance of `bad` with `good`
# e.g. after typing `car foo.txt`, run `fix car cat`
def fix [bad: string, good: string] {
    let cmd = (history | last 1 | get command | get 0 | str replace $bad $good)
    nu -c $cmd
}

# Decode a URL
def urldecode [s: string] {
    $s | str replace --all '+' ' ' | url decode
}

# cat an s3 file, picking bucket/file with fzf
def s3cat [] {
    let bucket = (^aws s3 ls | ^tr -s ' ' | ^cut -d' ' -f 3- | ^fzf | str trim)
    if ($bucket | is-empty) { return }
    let file = (^aws s3 ls $bucket --recursive | ^tr -s ' ' | ^cut -d' ' -f 4- | ^fzf | str trim)
    if ($file | is-empty) { return }
    ^aws s3 cp $"s3://($bucket)/($file)" - | ^cat
}

# eza -l on `which $cmd`
def lw [cmd: string] {
    let found = (which $cmd)
    if ($found | is-empty) {
        print $"($cmd) not found"
        return
    }
    ^eza -alm ($found | get 0.path)
}

# Piknik: copy args to the clipboard
def pko [...content: string] {
    $content | str join ' ' | ^piknik -copy
}

# Piknik: copy a file's content to the clipboard
def pkf [file: path] {
    open --raw $file | ^piknik -copy
}

# Piknik: send a whole directory to the clipboard, as a tar archive
def pkfr [dir?: string] {
    let d = ($dir | default ".")
    ^tar czpvf - $d | ^piknik -copy
}

# Verify a file's checksum
def dlc [algo: string, expected: string, file: string] {
    match $algo {
        "md5" | "5" => { $"($expected)  ($file)" | ^md5sum --check }
        "sha256" | "256" => { $"($expected)  ($file)" | ^sha256sum --check }
        "sha512" | "512" => { $"($expected)  ($file)" | ^sha512sum --check }
        _ => { print "algorithm must be md5, sha256, or sha512" }
    }
}

# Russ Time
def russtime [] {
    with-env {TZ_LIST: "Australia/Melbourne"} { ^tz }
}

# Open the web page for the git repo in cwd
def gopen [] {
    let remotes_result = (do { ^git remote } | complete)
    if $remotes_result.exit_code != 0 {
        print "error: not a git repository"
        return
    }
    let remote_list = ($remotes_result.stdout | lines | where {|it| ($it | str trim) != ""})

    if ($remote_list | is-empty) {
        print "error: no remotes configured"
        return
    }

    let remote_name = if ($remote_list | length) == 1 {
        $remote_list | first
    } else {
        let picked = ($remote_list | str join "\n" | ^fzf --prompt "remote> " | str trim)
        if ($picked | is-empty) { return }
        $picked
    }

    let url_result = (do { ^git remote get-url $remote_name } | complete)
    if $url_result.exit_code != 0 {
        print $"error: could not resolve remote ($remote_name)"
        return
    }
    let remote = ($url_result.stdout | str trim)

    let url = if ($remote | str starts-with "git@") {
        let rest = ($remote | str replace "git@" "")
        let swapped = ($rest | str replace ":" "/")
        ($"https://($swapped)" | str replace --regex '\.git$' "")
    } else if ($remote | str starts-with "ssh://") {
        let rest = ($remote | str replace "ssh://git@" "")
        let no_git = ($rest | str replace --regex '\.git$' "")
        let host_part = ($no_git | split row "/" | first)
        let path_part = ($no_git | str replace $"($host_part)/" "")
        let host = ($host_part | split row ":" | first)
        $"https://($host)/($path_part)"
    } else if ($remote | str starts-with "https://") {
        ($remote | str replace --regex '\.git$' "")
    } else {
        print $"error: unsupported remote format: ($remote)"
        return
    }

    let opener = if (which open | is-not-empty) {
        "open"
    } else if (which xdg-open | is-not-empty) {
        "xdg-open"
    } else if (which wslview | is-not-empty) {
        "wslview"
    } else {
        print "error: no url opener found"
        return
    }

    ^$opener $url
}

# mise use, picking tool/version with fzf
def mu [--global(-g), --installed(-i), tool?: string] {
    let name = if ($tool | is-empty) {
        (^mise plugin list | ^fzf | str trim)
    } else {
        $tool
    }
    if ($name | is-empty) { return }

    let version = if $installed {
        (^mise ls $name | ^awk '{print $2}' | ^fzf | str trim)
    } else {
        let choices = ([(^mise ls-remote $name | ^awk '{print $1}' | lines); ["latest"]] | flatten | str join "\n")
        ($choices | ^fzf | str trim)
    }
    if ($version | is-empty) { return }

    if $global {
        ^mise use --global $"($name)@($version)"
    } else {
        ^mise use $"($name)@($version)"
    }
}
