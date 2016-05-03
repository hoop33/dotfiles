#!/bin/sh

# Link all the dot files and directories
DOTFILES=$(pwd)

FILES=($(find . -maxdepth 1 -name '.*' -type f))
for i in "${FILES[@]}"; do
  FILE=`echo $i | sed -e 's/^..//'`
  ln -fsv $DOTFILES/$FILE $HOME/$FILE
done

DIRS=(.tmuxinator bin)
for i in "${DIRS[@]}"; do
  if [[ ! -d $HOME/$i ]]; then
    ln -sv $DOTFILES/$i $HOME/$i
  fi
done

# Link the fish config file
ln -fsv $DOTFILES/config.fish $HOME/.config/fish/config.fish
ln -fsv $DOTFILES/powerline-shell.py $HOME/powerline-shell.py

# Remove the directory and symlink to ours
rm -rf $HOME/.oh-my-zsh/custom
ln -fsv $DOTFILES/zsh_files $HOME/.oh-my-zsh/custom

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
    "tmuxinator" \
  )

  for i in "${GEMS[@]}"; do
    gem install $i
  done
fi

if [[ $* == *--brew* ]]; then
  FORMULAE=( \
    "carthage" \
    "cmake" \
    "cppcheck" \
    "ctags" \
    "curl" \
    "elasticsearch" \
    "git" \
    "git-extras" \
    "git-flow" \
    "go" \
    "httpie" \
    "jq" \
    "leiningen" \
    "lua" \
    "md5sha1sum" \
    "mongodb" \
    "nasm" \
    "openssl" \
    "pandoc" \
    "postgresql" \
    "python" \
    "readline" \
    "reattach-to-user-namespace" \
    "redis" \
    "rust" \
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
