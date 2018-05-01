#!/bin/sh

# Link all the dot files and directories
DOTFILES=$(pwd)

FILES=($(find . -maxdepth 1 -name '.*' -type f))
for i in "${FILES[@]}"; do
  FILE=`echo $i | sed -e 's/^..//'`
  ln -fsv $DOTFILES/$FILE $HOME/$FILE
done

DIRS=(.elvish .grc bin)
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

# Alacritty
mkdir -p $HOME/.config/alacritty
ln -fsv $DOTFILES/alacritty.yml $HOME/.config/alacritty/alacritty.yml

if [[ $* == *--node* ]]; then
  # Install global node modules
  NODE_MODULES=( \
    "babel-eslint" \
    "bower" \
    "caniuse-cmd" \
    "david" \
    "ember-cli" \
    "eslint" \
    "eslint-plugin-react" \
    "git://github.com/ramitos/jsctags.git" \
    "gulp" \
    "jshint" \
    "jsx" \
    "livedown" \
    "react-tools" \
    "tern" \
  )

  for i in "${NODE_MODULES[@]}"; do
    npm install --global $i
  done
fi

if [[ $* == *--gems* ]]; then
  GEMS=( \
  )

  for i in "${GEMS[@]}"; do
    gem install $i
  done
fi

if [[ $* == *--brew* ]]; then
  FORMULAE=( \
    "carthage" \
    "clang-format" \
    "cmake" \
    "cppcheck" \
    "ctags" \
    "curl" \
    "diff-so-fancy" \
    "elasticsearch" \
    "git" \
    "git-extras" \
    "git-flow" \
    "go" \
    "grc" \
    "httpie" \
    "hub" \
    "jq" \
    "lua" \
    "md5sha1sum" \
    "mongodb" \
    "nasm" \
    "openssl" \
    "pandoc" \
    "postgresql" \
    "readline" \
    "reattach-to-user-namespace" \
    "redis" \
    "ripgrep" \
    "rust" \
    "s-search" \
    "spark" \
    "sqlite" \
    "swiftlint" \
    "the_silver_searcher" \
    "tig" \
    "tmux" \
    "tree" \
    "wry" \
    "xctool" \
    "z" \
    "zsh" \
    "zsh-syntax-highlighting" \
  )

  for i in "${FORMULAE[@]}"; do
    brew install $i
  done
fi

if [[ $* == *--go* ]]; then
  GO_PACKAGES=( \
    "github.com/nsf/gocode" \
    "github.com/suzaku/shonenjump" \
    "github.com/svent/sift" \
    "github.com/fatih/gomodifytags" \
  )

  for i in "${GO_PACKAGES[@]}"; do
    go get -u $i
  done
fi
