#!/bin/bash

# Note: This is WIP -- not ready for real use

install_homebrew() {
  msg "Installing Homebrew"
  brew -v >/dev/null 2>&1
  if [ "$?" = "0" ]; then
    # From https://brew.sh/
    run_exit_on_fail /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    msg "Homebrew installed"
  else
    msg "Homebrew already installed"
  fi
}

install_brews() {
  msg "Installing brews"
  local FORMULAE=( \
    "ctags" \
    "curl" \
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
    "sqlite" \
    "tig" \
    "tmux" \
    "z" \
    "zsh" \
    "zsh-syntax-highlighting" \
  )

  for i in "${FORMULAE[@]}"; do
    msg "Installing $i"
    brew install $i
  done

  msg "Brews installed"
}

install_oh_my_zsh() {
  msg "Installing Oh My Zsh"
  if [ -d $HOME/.oh-my-zsh ]; then
    msg "Oh My Zsh already installed"
  else
    # From https://github.com/robbyrussell/oh-my-zsh
    run_exit_on_fail 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"'
    msg "Oh My Zsh installed"
  fi
}

link_dotfiles() {
  msg "Linking dotfiles"

  local DOTFILES=$(pwd)
  local FILES=($(find . -maxdepth 1 -name '.*' -type f))
  for i in "${FILES[@]}"; do
    FILE=`echo $i | sed -e 's/^..//'`
    ln -fsv $DOTFILES/$FILE $HOME/$FILE
  done

  local DIRS=(bin)
  for i in "${DIRS[@]}"; do
    if [[ ! -d $HOME/$i ]]; then
      ln -sv $DOTFILES/$i $HOME/$i
    fi
  done

  # ZSH custom setup
  ln -fsv $DOTFILES/.zsh_custom $HOME

  # Create the nvim configuration
  mkdir -p $HOME/.config/nvim
  ln -fsv $DOTFILES/init.vim $HOME/.config/nvim/init.vim

  msg "Dotfiles linked"
}

install_pythons() {
  msg "Installing pythons"
  local PYTHONS=( \
    "2.7.15" \
    "3.7.2" \
  )

  for i in "${PYTHONS[@]}"; do
    msg "Installing python $i"
    # TODO check if already installed
    pyenv install $i
    pyenv global $i
    pip install --upgrade pip pynvim neovim 
  done

  msg "Pythons installed"
}

install_terminfos() {
  local TERMINFOS=( \
    "xterm-256color-italic" \
    "tmux-256color" \
  )

  for i in "${TERMINFOS[@]}"; do
    msg "Installing terminfo $i"
    infocmp $i >/dev/null 2>&1
    if [ "$?" = "0" ]; then
      msg "terminfo $i already installed"
    else
      if [[ $i == tmux* ]]; then
        echo "$i|tmux with 256 colors and italic," > $TMPDIR/$i.terminfo
        echo "  ritm=\E[23m, rmso=\E[27m, sitm=\E[3m, smso=\E[7m, Ms@," >> $TMPDIR/$i.terminfo
        echo "  khome=\E[1~, kend=\E[4~," >> $TMPDIR/$i.terminfo
        echo "  use=xterm-256color, use=screen-256color, " >> $TMPDIR/$i.terminfo
      else
        echo "$i|xterm with 256 colors and italic," > $TMPDIR/$i.terminfo
        echo "  sitm=\E[3m, ritm=\E[23m," >> $TMPDIR/$i.terminfo
        echo "  use=xterm-256color," >> $TMPDIR/$i.terminfo
      fi

      tic -x $TMP/$i.terminfo
      rm $TMP/$i.terminfo

      msg "Installed terminfo $i"
    fi
  done

  # TODO configure iTerm

  msg "Terminfos installed"
}

msg() {
  if [ "$1" != "" ]; then
    now=$(date +"%T")
    echo [$now] $1 
  fi
}

run_exit_on_fail() {
  if [ "$1" != "" ]; then
    $@
    if [ "$?" != "0" ]; then
      msg "Failed"
      exit 1
    fi
  fi
}

main() {
  install_homebrew
  #install_brews
  install_oh_my_zsh
  link_dotfiles

  # TODO probably need a new shell with environment
  #install_pythons

  # TODO
  # Install TPM
  # Install a nerd font
  # Install spaceship prompt
  install_terminfos
}

main
