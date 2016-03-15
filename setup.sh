#!/bin/sh

# Link all the dot files
DOTFILES=$(pwd)
FILES=($(find . -maxdepth 1 -type f -name '.*'))

for i in "${FILES[@]}"; do
  FILE=`echo $i | sed -e 's/^..//'`
  ln -fsv $DOTFILES/$FILE $HOME/$FILE
done

# Link the fish config file
ln -fsv $DOTFILES/config.fish $HOME/.config/fish/config.fish
ln -fsv $DOTFILES/powerline-shell.py $HOME/powerline-shell.py

# Remove the directory and symlink to ours
rm -rf $HOME/.oh-my-zsh/custom
ln -fsv $DOTFILES/custom $HOME/.oh-my-zsh/custom

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
    "openssl" \
    "pandoc" \
    "python" \
    "readline" \
    "reattach-to-user-namespace" \
    "sqlite" \
    "the_silver_searcher" \
    "tig" \
    "tmux" \
    "tree" \
    "wry" \
    "z" \
    "zsh" \
  )

  for i in "${FORMULAE[@]}"; do
    brew install $i
  done
fi
