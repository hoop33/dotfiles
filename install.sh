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

install_nvm() {
  msg "Installing nvm"
  if [[ -d "$HOME/.nvm" ]]; then
    msg "nvm already installed"
  else
    # From https://github.com/nvm-sh/nvm
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
    source "$HOME/.nvm/nvm.sh"
    nvm install 12
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
    "2.7.15" \
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

configure_git() {
  msg "Configuring git"

  local name
  name="$(git config --global --includes user.name)"
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

msg() {
  if [[ "$1" != "" ]]; then
    echo "[$(date +'%T')]" "$1"
  fi
}

main() {
  link_dotfiles
  install_homebrew
  install_brews
  install_nvm
  install_oh_my_zsh
  install_pythons
  install_tpm
  install_terminfos
  install_font
  configure_git
  configure_neovim

  # TODO
  # Install vim plugins
  # Install tmux plugins
  # Configure iTerm
}

main
