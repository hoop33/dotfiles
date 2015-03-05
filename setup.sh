#!/bin/sh

# Link all the dot files
DOTFILES=$(pwd)
FILES=($(find . -maxdepth 1 -type f -name '.*'))

for i in "${FILES[@]}"; do
  FILE=`echo $i | sed -e 's/^..//'`
  echo Linking $DOTFILES/$FILE to ~/$FILE
  ln -fs $DOTFILES/$FILE ~/$FILE
done

# Remove the directory and symlink to ours
rm -rf ~/.oh-my-zsh/custom
ln -fs $DOTFILES/custom ~/.oh-my-zsh/custom

# Install global node modules
NODE_MODULES=("bower" "david" "gulp" "git://github.com/ramitos/jsctags.git" "jshint" "livedown" "tern")

for i in "${NODE_MODULES[@]}"; do
  npm install --global $i
done
