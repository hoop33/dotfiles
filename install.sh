#!/bin/bash

install_homebrew() {
  msg "Installing Homebrew"
  if command -v brew >/dev/null; then
    msg "Homebrew already installed"
  else
    # From https://brew.sh/
    exec_with_exit /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    msg "Homebrew installed"
  fi
}

install_brews() {
  msg "Installing brews"
  local formulae=( \
    "bat" \
    "ctags" \
    "curl" \
    "diff-so-fancy" \
    "exa" \
    "git" \
    "git-extras" \
    "git-flow" \
    "go" \
    "httpie" \
    "hub" \
    "jq" \
    "neovim" \
    "openssl" \
    "pyenv" \
    "readline" \
    "reattach-to-user-namespace" \
    "ripgrep" \
    "starship" \
    "sqlite" \
    "tig" \
    "tmux" \
    "z" \
    "zsh" \
    "zsh-autosuggestions" \
    "zsh-completions" \
    "zsh-syntax-highlighting" \
  )

  for i in "${formulae[@]}"; do
    msg "Installing $i"
    brew ls "$i" >/dev/null 2>&1
    if [[ "$?" = "0" ]]; then
      msg "$i already installed"
    else
      exec_with_exit "brew install $i"
    fi
  done

  msg "Brews installed"
}

install_oh_my_zsh() {
  msg "Installing Oh My Zsh"
  if [[ -d "$HOME/.oh-my-zsh" ]]; then
    msg "Oh My Zsh already installed"
  else
    # From https://github.com/robbyrussell/oh-my-zsh
    exec_with_exit 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"'
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
      file="$(echo $i | sed -e 's/^..//')"
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
  local pythons
  pythons=( \
    "2.7.15" \
    "3.7.2" \
  )

  for i in "${pythons[@]}"; do
    msg "Installing python $i"
    pyenv versions --bare | grep -q "$i"
    if [[ "$?" = "0" ]]; then
      msg "Python $i already installed"
    else
      exec_with_exit "pyenv install $i"
      exec_with_exit "pyenv global $i"
      exec_with_exit "pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org --upgrade pip pynvim neovim"
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
    infocmp "$i" >/dev/null 2>&1
    if [[ "$?" = "0" ]]; then
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
    exec_with_exit "git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm"
    msg "tpm installed"
  fi
}

install_font() {
  msg "Installing nerd font"
  system_profiler SPFontsDataType | grep -q "Hasklug Nerd Font Complete"
  if [[ "$?" = "0" ]]; then
    msg "Nerd font already installed"
  else
    exec_with_exit "cd $HOME/Library/Fonts && { curl -O https://github.com/ryanoasis/nerd-fonts/blob/master/patched-fonts/Hasklig/Regular/complete/Hasklug%20Nerd%20Font%20Complete.otf; cd -; }" 
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

msg() {
  if [[ "$1" != "" ]]; then
    echo "[$(date +'%T')]" "$1"
  fi
}

exec_with_exit() {
  if [[ "$1" != "" ]]; then
    "$@"
    if [[ "$?" != "0" ]]; then
      msg "Failed: $*"
      exit 1
    fi
  fi
}

main() {
  install_homebrew
  install_brews
  install_oh_my_zsh
  link_dotfiles

  if [[ "$PYENV_ROOT" = "" ]]; then
    msg "Close this shell and start a new ZSH shell, then rerun install.sh"
    exit 0
  fi

  install_pythons
  install_tpm
  install_terminfos
  install_font
  configure_git

  # TODO
  # Allow custom installation location for Homebrew
  # Install vim plugins
  # Install tmux plugins
  # Configure iTerm
}

main
