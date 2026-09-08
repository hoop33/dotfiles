# Ported from .zsh_custom/env.zsh -- see nushell config docs:
# https://www.nushell.sh/book/configuration.html

ulimit -n 2048

# ---- Homebrew / package prefix ----
$env.PACKAGES = if ("/opt/homebrew" | path exists) {
    "/opt/homebrew"
} else if (($env.HOME | path join ".homebrew") | path exists) {
    $env.HOMEBREW_NO_ANALYTICS = "1"
    ($env.HOME | path join ".homebrew")
} else if (which brew | is-not-empty) {
    "/usr/local"
} else {
    ""
}

if ($env.PACKAGES | is-not-empty) {
    $env.HOMEBREW_INSTALL_CLEANUP = "1"
    $env.PATH = ($env.PATH | prepend ($env.PACKAGES | path join "bin"))
}

# ---- Go / Rust ----
$env.GOPATH = ($env.HOME | path join "go")
$env.PATH = ($env.PATH | prepend [
    ($env.HOME | path join ".cargo/bin")
    ($env.GOPATH | path join "bin")
])
if ("/usr/local/go/bin" | path exists) {
    $env.PATH = ($env.PATH | prepend "/usr/local/go/bin")
}

# ---- General PATH ----
$env.PATH = ($env.PATH | append [
    ($env.HOME | path join "bin")
    "/usr/local/bin"
    "/usr/bin"
    "/bin"
    "/usr/sbin"
    "/sbin"
    ($env.HOME | path join ".local/bin")
    ($env.HOME | path join ".yarn/bin")
    ($env.HOME | path join ".config/yarn/global/node_modules/.bin")
])

# ---- Editor ----
$env.EDITOR = "nvim"
$env.OSC_EDITOR = "nvim" # OpenShift

# ---- fzf ----
$env.FZF_DEFAULT_COMMAND = 'rg --files --no-ignore --hidden --follow --glob "!.git/*" --glob "!node_modules/*" --glob "!vendor/*" --glob "!build/*" --glob "!dist/*" --glob "!target/*" --glob "!.idea/*" --glob "!.cache/*"'
$env.FZF_CTRL_T_COMMAND = $env.FZF_DEFAULT_COMMAND
$env.FZF_DEFAULT_OPTS = '--height 30% --border --cycle --prompt=" " --pointer="▶" --marker="✓"'
# atuin owns Ctrl-R (wired up in config.nu) -- keep fzf from also binding it
$env.FZF_CTRL_R_COMMAND = ""

# ---- Android ----
$env.ANDROID_HOME = if (($env.HOME | path join "Android/Sdk") | path exists) {
    ($env.HOME | path join "Android/Sdk")
} else {
    ($env.HOME | path join "Library/Android/sdk")
}
$env.NDK_HOME = if (($env.ANDROID_HOME | path join "ndk") | path exists) {
    let versions = (ls ($env.ANDROID_HOME | path join "ndk") | get name | path basename)
    $env.ANDROID_HOME | path join "ndk" ($versions | first)
} else {
    $env.ANDROID_HOME | path join "ndk"
}
$env.PATH = ($env.PATH | append [
    ($env.ANDROID_HOME | path join "emulator")
    ($env.ANDROID_HOME | path join "tools")
    ($env.ANDROID_HOME | path join "tools/bin")
    ($env.ANDROID_HOME | path join "platform-tools")
])

$env.CHROME_EXECUTABLE = if ("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" | path exists) {
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
} else {
    "chromium-browser"
}

# ---- sbt certs ----
let sbt_certs = "/Library/Java/JavaVirtualMachines/amazon-corretto-8.jdk/Contents/Home/jre/lib/security/cacerts"
if ($sbt_certs | path exists) {
    $env.SBT_OPTS = $"-Djavax.net.ssl.trustStore=($sbt_certs)"
}

$env.PATH = ($env.PATH | uniq)
