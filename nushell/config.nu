

# Zoxide -- note that it creates the `.zoxide.nu`  file (or overrides the existing one)
# and then sources it. Because of the two-pass loading of the Nushell config,
# if the file doesn't already exist before this loads, the load will fail.
# In that case, run ``touch ~/.zoxide.nu`` to create the file, then reload the config.
zoxide init nushell | save --force ($nu.home-dir | path join ".zoxide.nu")
source ($nu.home-dir | path join ".zoxide.nu")

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

# Load Starship prompt
mkdir ($nu.data-dir | path join "vendor/autoload")
starship init nu | save --force ($nu.data-dir | path join "vendor/autoload/starship.nu")
