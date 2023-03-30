#!/bin/bash

set -e

install_homebrew() {
  msg "Installing Homebrew"
  if command -v brew >/dev/null; then
    msg "Homebrew already installed"
  else
    # From https://brew.sh/
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
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
  cargo install $(cat cargolist)
  cargo install-update -a
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
  # From https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  sudo ./aws/install "$1"
  rm -rf ./aws
  rm awscliv2.zip
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
  # mkdir -p "$HOME/.config/nvim"
  # ln -fsv "$dotfiles/init.vim" "$HOME/.config/nvim/init.vim"
  # ln -fsv "$dotfiles/coc-settings.json" "$HOME/.config/nvim/coc-settings.json"

  # Starship
  ln -fsv "$dotfiles/starship.toml" "$HOME/.config/starship.toml"

  # Conky
  mkdir -p "$HOME/.config/conky"
  ln -fsv "$dotfiles/conky.conf" "$HOME/.config/conky/conky.conf"

  # Kitty
  mkdir -p "$HOME/.config/kitty"
  ln -fsv "$dotfiles/kitty.conf" "$HOME/.config/kitty/kitty.conf"

  # WezTerm
  mkdir -p "$HOME/.config/wezterm"
  ln -fsv "$dotfiles/wezterm.lua" "$HOME/.config/wezterm/wezterm.lua"

  # Espanso
  mkdir -p "$HOME/.config/espanso"
  ln -fsv "$dotfiles/espanso.yml" "$HOME/.config/espanso/default.yml"

  # Macchina
  mkdir -p "$HOME/.config/macchina"
  ln -fsv "$dotfiles/macchina.toml" "$HOME/.config/macchina/macchina.toml"

  # Sublime
  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    mkdir -p "$HOME/.config/sublime-text-3/Packages/User"
    ln -fsv "$dotfiles/Preferences.sublime-settings" "$HOME/.config/sublime-text-3/Packages/User/Preferences.sublime-settings"
  elif [[ $OSTYPE == darwin* ]]; then
    mkdir -p "$HOME/Library/Application Support/Sublime Text/Packages/User"
    ln -fsv "$dotfiles/Preferences.sublime-settings" "$HOME/Library/Application Support/Sublime Text/Packages/User/Preferences.sublime-settings"
  fi

  # Git
  mkdir -p "$HOME/.config/git"
  ln -fsv "$dotfiles/globalignore" "$HOME/.config/git/ignore"

  # Zellij
  mkdir -p "$HOME/.config/zellij"
  ln -fsv "$dotfiles/zellij.kdl" "$HOME/.config/zellij/config.kdl"

  # Nu Shell
  mkdir -p "$HOME/.config/nushell"
  ln -fsv "$dotfiles/nushell/config.nu" "$HOME/.config/nushell/config.nu"
  ln -fsv "$dotfiles/nushell/env.nu" "$HOME/.config/nushell/env.nu"
  ln -fsv "$dotfiles/nushell/plugin.nu" "$HOME/.config/nushell/plugin.nu"

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
  sh -c "$(curl -fsSL https://starship.rs/install.sh)" -- --force
  msg "starship installed"
}

install_vim_plug() {
  msg "Installing vim-plug"
  if [[ -f "$HOME/.config/nvim/autoload/plug.vim" ]]; then
    msg "vim-plug already installed"
  else
    # From https://github.com/junegunn/vim-plug
    curl -fLo ~/.config/nvim/autoload/plug.vim --create-dirs \
      https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
    nvim +PlugInstall +qall
    msg "vim-plug installed"
  fi
}

install_rust() {
  msg "Installing Rust"
  if command -v rustc >/dev/null; then
    msg "Rust already installed"
  else
    # From https://www.rust-lang.org/tools/install
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source $HOME/.cargo/env
    msg "Rust installed"
  fi
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

configure_docker() {
  sudo systemctl start docker
  sudo systemctl enable docker
}

enable_gtk_inspector() {
  gsettings set org.gtk.Settings.Debug enable-inspector-keybinding true
}

link_fd() {
  ln -fsv "$(which fdfind)" ~/bin/fd
}

install_asdf() {
  if command -v asdf >/dev/null; then
    msg "Updating asdf"
    cd "$HOME/.asdf"
    git pull
  else
    msg "Installing asdf"
    git clone https://github.com/asdf-vm/asdf.git "$HOME/.asdf"
  fi
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
    install_vim_plug
    install_rust
    install_cargoes
    install_go_packages
    install_node_modules
    install_awscli
    install_tpm
    install_asdf
    configure_ctags
    configure_git
    configure_neovim
    configure_flatpak
    install_flatpaks
    configure_docker
    enable_gtk_inspector
    link_fd
  elif [[ $OSTYPE == darwin* ]]; then
    install_oh_my_zsh
    link_dotfiles
    install_homebrew
    install_brews
    install_pythons
    install_tpm
    install_terminfos
    install_font
    install_asdf
    configure_ctags
    configure_git
    configure_neovim
  else
    msg "Unrecognized operating system"
  fi

  # TODO
  # Linux: add apt repositories
  # Install tmux plugins
  # Configure iTerm
}

main
