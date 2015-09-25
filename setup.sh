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

if [[ "$1" == "--node" ]]; then
  # Install global node modules
  NODE_MODULES=("bower" "david" "ember-cli" "eslint" "gulp" "git://github.com/ramitos/jsctags.git" "jshint" "jsx" "livedown" "tern" "eslint" "babel-eslint" "eslint-plugin-react")

  for i in "${NODE_MODULES[@]}"; do
    npm install --global $i
  done
fi
