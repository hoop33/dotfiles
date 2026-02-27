#!/bin/bash

set -e

install_homebrew() {
  msg "Installing Homebrew"
  if command -v brew >/dev/null; then
    msg "Homebrew already installed"
  else
    # From https://brew.sh/
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    msg "Homebrew installed"
  fi
}

install_brews() {
  msg "Installing brews"
  brew bundle
  msg "Brews installed"
}

install_packages() {
  msg "Installing packages"
  while IFS= read -r line; do
    sudo apt-add-repository --yes "$line"
  done <"repolist"

  sudo apt-get --assume-yes install $(cat pkglist)
  msg "Packages installed"
}

install_node_modules() {
  msg "Installing global node modules"
  npm install --location=global $(cat node_list)
  msg "Node modules installed"
}

install_flatpaks() {
  msg "Installing Flatpaks"
  # TODO first check if installed
  #flatpak install --assumeyes $(cat flatpaks)
  msg "Flatpaks installed"
}

install_cargoes() {
  msg "Installing Cargoes"
  cargo install --locked $(cat cargolist)
  #cargo install-update -a
  msg "Cargoes installed"
}

install_go_packages() {
  msg "Installing Go packages"
  while IFS= read -r package; do
    go install "$package"
  done <"golist"
  msg "Go packages installed"
}

install_awscli() {
  msg "Installing AWS CLI"
  if command -v aws >/dev/null; then
    _install_awscli "--update"
    msg "AWS CLI upgraded"
  else
    _install_awscli
    msg "AWS CLI installed"
  fi
}

_install_awscli() {
  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    # From https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install "$@"
    rm -rf ./aws
    rm awscliv2.zip
  elif [[ $OSTYPE == darwin* ]]; then
    curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
    sudo installer -pkg AWSCLIV2.pkg -target /
    rm AWSCLIV2.pkg
  fi
}

install_oh_my_zsh() {
  msg "Installing Oh My Zsh"
  if [[ -d "$HOME/.oh-my-zsh" ]]; then
    msg "Oh My Zsh already installed"
  else
    # From https://github.com/robbyrussell/oh-my-zsh
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
    msg "Oh My Zsh installed"
  fi
}

link_dotfiles() {
  msg "Linking dotfiles"

  # Make sure we have the XDG_CONFIG_HOME directory defined and present
  local XDG_CONFIG_HOME
  XDG_CONFIG_HOME=${XDG_CONFIG_HOME:-"$HOME/.config"}
  mkdir -p "$XDG_CONFIG_HOME"

  local dotfiles
  dotfiles=$(pwd)

  local files
  files=($(find . -maxdepth 1 -name '.*' -type f))

  for i in "${files[@]}"; do
    if [[ $i = */.DS_Store ]]; then
      msg "Skipping $i"
    else
      local file
      file=${i//^../} #"$(echo $i | sed -e 's/^..//')"
      ln -fsv "$dotfiles/$file" "$HOME/$file"
    fi
  done

  # ZSH custom setup
  ln -fsv "$dotfiles/.zsh_custom" "$HOME"

  # Create the nvim configuration
  ln -fsvn "$dotfiles/nvim" "$XDG_CONFIG_HOME/nvim"

  # Starship
  ln -fsv "$dotfiles/starship.toml" "$XDG_CONFIG_HOME/starship.toml"

  # Conky
  mkdir -p "$XDG_CONFIG_HOME/conky"
  ln -fsv "$dotfiles/conky.conf" "$XDG_CONFIG_HOME/conky/conky.conf"

  # Kitty
  mkdir -p "$XDG_CONFIG_HOME/kitty"
  ln -fsv "$dotfiles/kitty.conf" "$XDG_CONFIG_HOME/kitty/kitty.conf"

  # WezTerm
  mkdir -p "$XDG_CONFIG_HOME/wezterm"
  ln -fsv "$dotfiles/wezterm.lua" "$XDG_CONFIG_HOME/wezterm/wezterm.lua"

  # Espanso
  mkdir -p "$XDG_CONFIG_HOME/espanso/config/"
  mkdir -p "$XDG_CONFIG_HOME/espanso/match/"
  ln -fsv "$dotfiles/espanso_match.yml" "$XDG_CONFIG_HOME/espanso/match/base.yml"
  ln -fsv "$dotfiles/espanso_config.yml" "$XDG_CONFIG_HOME/espanso/config/default.yml"

  # Macchina
  mkdir -p "$XDG_CONFIG_HOME/macchina"
  ln -fsv "$dotfiles/macchina.toml" "$XDG_CONFIG_HOME/macchina/macchina.toml"

  # Sublime
  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    mkdir -p "$XDG_CONFIG_HOME/sublime-text-3/Packages/User"
    ln -fsv "$dotfiles/Preferences.sublime-settings" "$XDG_CONFIG_HOME/sublime-text-3/Packages/User/Preferences.sublime-settings"
  elif [[ $OSTYPE == darwin* ]]; then
    mkdir -p "$HOME/Library/Application Support/Sublime Text/Packages/User"
    ln -fsv "$dotfiles/Preferences.sublime-settings" "$HOME/Library/Application Support/Sublime Text/Packages/User/Preferences.sublime-settings"
  fi

  # Git
  mkdir -p "$XDG_CONFIG_HOME/git"
  ln -fsv "$dotfiles/globalignore" "$XDG_CONFIG_HOME/git/ignore"

  # Zellij
  mkdir -p "$XDG_CONFIG_HOME/zellij"
  ln -fsv "$dotfiles/zellij.kdl" "$XDG_CONFIG_HOME/zellij/config.kdl"

  # Nu Shell
  # TODO Mac uses /Users/rwarner/Library/Application Support/nushell/env.nu
  mkdir -p "$XDG_CONFIG_HOME/nushell"
  ln -fsv "$dotfiles/nushell/config.nu" "$XDG_CONFIG_HOME/nushell/config.nu"
  ln -fsv "$dotfiles/nushell/env.nu" "$XDG_CONFIG_HOME/nushell/env.nu"
  ln -fsv "$dotfiles/nushell/plugin.nu" "$XDG_CONFIG_HOME/nushell/plugin.nu"

  # atuin
  mkdir -p "$XDG_CONFIG_HOME/atuin"
  ln -fsv "$dotfiles/atuin/config.toml" "$XDG_CONFIG_HOME/atuin/config.toml"
  ln -fsv "$dotfiles/atuin/init.nu" "$XDG_CONFIG_HOME/atuin/init.nu"

  # zed
  mkdir -p "$XDG_CONFIG_HOME/zed"
  ln -fsv "$dotfiles/zed/settings.json" "$XDG_CONFIG_HOME/zed/settings.json"
  ln -fsv "$dotfiles/zed/keymap.json" "$XDG_CONFIG_HOME/zed/keymap.json"

  # jujutusu
  mkdir -p "$XDG_CONFIG_HOME/jj"
  ln -fsv "$dotfiles/jj.toml" "$XDG_CONFIG_HOME/jj/config.toml"

  # ghostty
  mkdir -p "$XDG_CONFIG_HOME/ghostty"
  ln -fsv "$dotfiles/ghostty" "$XDG_CONFIG_HOME/ghostty/config"

  msg "Dotfiles linked"
}

install_terminfos() {
  local terminfos=(
    "xterm-256color-italic"
    "tmux-256color"
  )

  for i in "${terminfos[@]}"; do
    msg "Installing terminfo $i"
    if infocmp "$i" >/dev/null 2>&1; then
      msg "terminfo $i already installed"
    else
      if [[ $i == tmux* ]]; then
        echo "$i|tmux with 256 colors and italic," >"$TMPDIR/$i.terminfo"
        echo "  ritm=\E[23m, rmso=\E[27m, sitm=\E[3m, smso=\E[7m, Ms@," >>"$TMPDIR/$i.terminfo"
        echo "  khome=\E[1~, kend=\E[4~," >>"$TMPDIR/$i.terminfo"
        echo "  use=xterm-256color, use=screen-256color, " >>"$TMPDIR/$i.terminfo"
      else
        echo "$i|xterm with 256 colors and italic," >"$TMPDIR/$i.terminfo"
        echo "  sitm=\E[3m, ritm=\E[23m," >>"$TMPDIR/$i.terminfo"
        echo "  use=xterm-256color," >>"$TMPDIR/$i.terminfo"
      fi

      tic -x "$TMPDIR/$i.terminfo"
      rm "$TMPDIR/$i.terminfo"

      msg "Installed terminfo $i"
    fi
  done

  msg "Terminfos installed"
}

install_tpm() {
  msg "Installing tpm"
  if [[ -d "$HOME/.tmux/plugins/tpm" ]]; then
    msg "tpm already installed"
  else
    git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
    msg "tpm installed"
  fi
}

install_font() {
  msg "Installing nerd font"
  if system_profiler SPFontsDataType 2>/dev/null | grep -q "Hasklug Nerd Font Complete"; then
    msg "Nerd font already installed"
  else
    cd "$HOME/Library/Fonts" && {
      curl -O https://github.com/ryanoasis/nerd-fonts/blob/master/patched-fonts/Hasklig/Regular/complete/Hasklug%20Nerd%20Font%20Complete.otf
      cd -
    }
    msg "Nerd font installed"
  fi
}

install_starship() {
  msg "Installing starship"
  # From https://starship.rs -- will install or update
  sudo mkdir -p /usr/local/bin
  curl -sS https://starship.rs/install.sh | sh
  msg "starship installed"
}

configure_ctags() {
  msg "Configuring ctags"

  mkdir -p "$HOME/.config/ctags"

  local dotfiles
  dotfiles=$(pwd)

  local files
  files=($(find . -maxdepth 1 -name '*.ctags' -type f))

  for i in "${files[@]}"; do
    local file
    file=${i//^../} #"$(echo $i | sed -e 's/^..//')"
    ln -fsv "$dotfiles/$file" "$HOME/.config/ctags/$file"
  done
}

configure_git() {
  msg "Configuring git"

  local name
  name="$(git config --global --includes user.name)" || true
  if [[ -z "$name" ]]; then
    echo "Enter your full name:"
    read -r name
    echo "Enter your email address:"
    read -r email

    echo "[user]" >>"$HOME/.gitconfig.local"
    echo "  name = $name" >>"$HOME/.gitconfig.local"
    echo "  email = $email" >>"$HOME/.gitconfig.local"

    msg "git configured"
  else
    msg "git already configured"
  fi
}

configure_neovim() {
  msg "Configuring Neovim"

  pip install --upgrade pip pynvim
  npm install --location=global neovim
  sudo gem install neovim

  msg "Neovim configured"
}

configure_flatpak() {
  flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
}

enable_gtk_inspector() {
  gsettings set org.gtk.Settings.Debug enable-inspector-keybinding true
}

link_fd() {
  ln -fsv "$(which fdfind)" ~/bin/fd
}

msg() {
  if [[ "$1" != "" ]]; then
    echo "[$(date +'%T')]" "$1"
  fi
}

main() {
  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    install_oh_my_zsh
    link_dotfiles
    install_packages
    install_starship
    install_cargoes
    install_go_packages
    install_node_modules
    install_awscli
    install_tpm
    configure_ctags
    configure_git
    configure_neovim
    configure_flatpak
    install_flatpaks
    enable_gtk_inspector
    link_fd
  elif [[ $OSTYPE == darwin* ]]; then
    install_oh_my_zsh
    link_dotfiles
    install_homebrew
    install_starship
    install_cargoes
    install_go_packages
    install_node_modules
    install_awscli
    install_brews
    #    install_pythons
    install_tpm
    install_terminfos
    install_font
    configure_ctags
    configure_git
    configure_neovim
  else
    msg "Unrecognized operating system"
  fi
}

main
