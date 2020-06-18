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
  while IFS= read -r line
  do
    sudo apt-add-repository --yes "$line"
  done < "repolist"

  sudo apt-get --assume-yes install $(cat pkglist)
  msg "Packages installed"
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
  msg "Cargoes installed"
}

install_awscli() {
  msg "Installing AWS CLI"
  # TODO how to upgrade?
  if command -v aws >/dev/null; then
    msg "AWS CLI already installed"
  else
    # From https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf ./aws
    rm awscliv2.zip
    msg "AWS CLI installed"
  fi
}

install_amplify() {
  msg "Installing Amplify"
  if command -v amplify >/dev/null; then
    msg "Amplify already installed"
  else
    npm install -g @aws-amplify/cli
    amplify configure
    msg "Amplify installed"
  fi
}

install_nvm() {
  msg "Installing nvm"
  if [[ -d "$HOME/.nvm" ]]; then
    msg "nvm already installed"
  else
    # From https://github.com/nvm-sh/nvm
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
    source "$HOME/.nvm/nvm.sh"
    nvm install 12
    msg "nvm installed"
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
  mkdir -p "$HOME/.config/nvim"
  ln -fsv "$dotfiles/init.vim" "$HOME/.config/nvim/init.vim"

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

  msg "Dotfiles linked"
}

install_pythons() {
  msg "Installing pythons"

  if [[ "$PYENV_ROOT" = "" ]]; then
    export PYENV_ROOT=$HOME/.pyenv
    export PATH=$PATH:$PYENV_ROOT/bin
    eval "$(pyenv init -)"
  fi

  local pythons
  pythons=( \
    #"2.7.15" \
    "3.8.1" \
  )

  for i in "${pythons[@]}"; do
    msg "Installing python $i"
    if pyenv versions --bare | grep -q "$i"; then
      msg "Python $i already installed"
    else
      pyenv install "$i"
    fi
  done

  msg "Pythons installed"
}

install_terminfos() {
  local terminfos=( \
    "xterm-256color-italic" \
    "tmux-256color" \
  )

  for i in "${terminfos[@]}"; do
    msg "Installing terminfo $i"
    if infocmp "$i" >/dev/null 2>&1; then
      msg "terminfo $i already installed"
    else
      if [[ $i == tmux* ]]; then
        echo "$i|tmux with 256 colors and italic," > "$TMPDIR/$i.terminfo"
        echo "  ritm=\E[23m, rmso=\E[27m, sitm=\E[3m, smso=\E[7m, Ms@," >> "$TMPDIR/$i.terminfo"
        echo "  khome=\E[1~, kend=\E[4~," >> "$TMPDIR/$i.terminfo"
        echo "  use=xterm-256color, use=screen-256color, " >> "$TMPDIR/$i.terminfo"
      else
        echo "$i|xterm with 256 colors and italic," > "$TMPDIR/$i.terminfo"
        echo "  sitm=\E[3m, ritm=\E[23m," >> "$TMPDIR/$i.terminfo"
        echo "  use=xterm-256color," >> "$TMPDIR/$i.terminfo"
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
    cd "$HOME/Library/Fonts" && { curl -O https://github.com/ryanoasis/nerd-fonts/blob/master/patched-fonts/Hasklig/Regular/complete/Hasklug%20Nerd%20Font%20Complete.otf; cd -; } 
    msg "Nerd font installed"
  fi
}

install_starship() {
  msg "Installing starship"
  if command -v starship >/dev/null; then
    msg "starship already installed"
  else
    # From https://github.com/starship/starship
    curl -fsSL https://starship.rs/install.sh | bash
    msg "starship installed"
  fi
}

install_vim_plug() {
  msg "Installing vim-plug"
  if [[ -f "$HOME/.vim/autoload/plug.vim" ]]; then
    msg "vim-plug already installed"
  else
    # TODO when I drop .vimrc, change this location
    # From https://github.com/junegunn/vim-plug
    curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
      https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
    nvim +PlugInstall +qall
    msg "vim-plug installed"
  fi
}

install_pyenv() {
  msg "Installing pyenv"
  if command -v pyenv >/dev/null; then
    msg "pyenv already installed"
  else
    git clone https://github.com/pyenv/pyenv.git ~/.pyenv
    msg "pyenv installed"
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

configure_git() {
  msg "Configuring git"

  local name
  name="$(git config --global --includes user.name)" || true
  if [[ -z "$name" ]]; then
    echo "Enter your full name:"
    read -r name
    echo "Enter your email address:"
    read -r email

    echo "[user]" >> "$HOME/.gitconfig.local"
    echo "  name = $name" >> "$HOME/.gitconfig.local"
    echo "  email = $email" >> "$HOME/.gitconfig.local"

    msg "git configured"
  else
    msg "git already configured"
  fi
}

configure_neovim() {
  msg "Configuring Neovim"

  local pythons
  pythons=($(pyenv versions --bare))

  for i in "${pythons[@]}"; do
    pyenv global "$i"
    pip install --upgrade pip pynvim neovim
  done

  npm install -g neovim

  msg "Neovim configured"
}

configure_flatpak() {
  flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
}

configure_docker() {
  sudo systemctl start docker
  sudo systemctl enable docker
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
    install_nvm
    install_pyenv
    install_pythons
    install_rust
    install_cargoes
    install_awscli
    install_amplify
    install_tpm
    configure_git
    configure_neovim
    configure_flatpak
    install_flatpaks
    configure_docker
  elif [[ $OSTYPE == darwin* ]]; then
    install_oh_my_zsh
    link_dotfiles
    install_homebrew
    install_brews
    install_nvm
    install_pythons
    install_tpm
    install_terminfos
    install_font
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
