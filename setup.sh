#!/bin/sh

DOTFILES=$(pwd)

ln -fs $DOTFILES/.editorconfig ~/.editorconfig
ln -fs $DOTFILES/.gitattributes ~/.gitattributes
ln -fs $DOTFILES/.gitignore ~/.gitignore
ln -fs $DOTFILES/.vimrc ~/.vimrc
ln -fs $DOTFILES/.gvimrc ~/.gvimrc
ln -fs $DOTFILES/.zshrc ~/.zshrc
rm -rf ~/.oh-my-zsh/custom
ln -fs $DOTFILES/custom ~/.oh-my-zsh/custom
