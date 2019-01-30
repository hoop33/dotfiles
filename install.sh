#!/bin/bash

# Note: This is WIP -- not ready for real use

install_homebrew() {
  msg "Installing Homebrew"
  brew -v >/dev/null 2>&1
  if [ "$?" = "0" ]; then
    msg "Homebrew already installed"
  else
    # From https://brew.sh/
    exec_with_exit /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    msg "Homebrew installed"
  fi
}

install_brews() {
  msg "Installing brews"
  local FORMULAE=( \
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
    "sqlite" \
    "tig" \
    "tmux" \
    "z" \
    "zsh" \
    "zsh-autosuggestions" \
    "zsh-completions" \
    "zsh-syntax-highlighting" \
  )

  for i in "${FORMULAE[@]}"; do
    msg "Installing $i"
    brew ls $i >/dev/null 2>&1
    if [ "$?" = "0" ]; then
      msg "$i already installed"
    else
      exec_with_exit "brew install $i"
    fi
  done

  msg "Brews installed"
}

install_oh_my_zsh() {
  msg "Installing Oh My Zsh"
  if [ -d $HOME/.oh-my-zsh ]; then
    msg "Oh My Zsh already installed"
  else
    # From https://github.com/robbyrussell/oh-my-zsh
    exec_with_exit 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"'
    msg "Oh My Zsh installed"
  fi
}

link_dotfiles() {
  msg "Linking dotfiles"

  local DOTFILES=$(pwd)
  local FILES=($(find . -maxdepth 1 -name '.*' -type f))
  for i in "${FILES[@]}"; do
    if [[ $i = */.DS_Store ]]; then
      msg "Skipping $i"
    else
      FILE=`echo $i | sed -e 's/^..//'`
      ln -fsv $DOTFILES/$FILE $HOME/$FILE
    fi
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
    pyenv versions --bare | grep -q $i
    if [ "$?" = "0" ]; then
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

      tic -x $TMPDIR/$i.terminfo
      rm $TMPDIR/$i.terminfo

      msg "Installed terminfo $i"
    fi
  done

  msg "Terminfos installed"
}

install_tpm() {
  msg "Installing tpm"
  if [ -d $HOME/.tmux/plugins/tpm ]; then
    msg "tpm already installed"
  else
    exec_with_exit "git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm"
    msg "tpm installed"
  fi
}

install_spaceship_prompt() {
  msg "Installing spaceship prompt"
  if [ -d $ZSH_CUSTOM/themes/spaceship-prompt ]; then
    msg "spaceship prompt already installed"
  else
    exec_with_exit "git clone https://github.com/denysdovhan/spaceship-prompt.git $ZSH_CUSTOM/themes/spaceship-prompt"
    ln -fsv "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
    msg "Installed spaceship prompt"
  fi
}

install_font() {
  msg "Installing nerd font"
  system_profiler SPFontsDataType | grep -q "Hasklug Nerd Font Complete"
  if [ "$?" = "0" ]; then
    msg "Nerd font already installed"
  else
    exec_with_exit "cd $HOME/Library/Fonts && { curl -O https://github.com/ryanoasis/nerd-fonts/blob/master/patched-fonts/Hasklig/Regular/complete/Hasklug%20Nerd%20Font%20Complete.otf; cd -; }" 
    msg "Nerd font installed"
  fi
}

msg() {
  if [ "$1" != "" ]; then
    now=$(date +"%T")
    echo [$now] $1 
  fi
}

exec_with_exit() {
  if [ "$1" != "" ]; then
    $@
    if [ "$?" != "0" ]; then
      msg "Failed: $@"
      exit 1
    fi
  fi
}

main() {
  install_homebrew
  install_brews
  install_oh_my_zsh
  link_dotfiles

  if [ "$PYENV_ROOT" = "" ]; then
    msg "Close this shell and start a new ZSH shell, then rerun install.sh"
    exit 0
  fi

  install_pythons
  install_tpm
  install_terminfos
  install_spaceship_prompt
  install_font

  # TODO
  # Allow custom installation location for Homebrew
  # Write ~/.gitconfig.local
  # Install vim plugins
  # Install tmux plugins
  # Configure iTerm
}

main
