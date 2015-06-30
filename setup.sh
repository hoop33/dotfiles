#!/bin/sh

# Link all the dot files
DOTFILES=$(pwd)
FILES=($(find . -maxdepth 1 -type f -name '.*'))

for i in "${FILES[@]}"; do
  FILE=`echo $i | sed -e 's/^..//'`
  echo Linking $DOTFILES/$FILE to ~/$FILE
  ln -fs $DOTFILES/$FILE ~/$FILE
done

# Link the fish config file
echo Linking fish config
ln -fs $DOTFILES/config.fish ~/.config/fish/config.fish

# Remove the directory and symlink to ours
echo Setting up zsh custom directory
rm -rf ~/.oh-my-zsh/custom
ln -fs $DOTFILES/custom ~/.oh-my-zsh/custom

if [ "$1" == "--node" ]; then
  # Install global node modules
  NODE_MODULES=("bower" "david" "gulp" "git://github.com/ramitos/jsctags.git" "jshint" "livedown" "tern")

  for i in "${NODE_MODULES[@]}"; do
    echo Installing $i
    npm install --global $i
  done
fi
