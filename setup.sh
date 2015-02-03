#!/bin/sh

DOTFILES=$(pwd)

ln -fs $DOTFILES/.editorconfig ~/.editorconfig
ln -fs $DOTFILES/.gitattributes ~/.gitattributes
ln -fs $DOTFILES/.gitignore ~/.gitignore
ln -fs $DOTFILES/.vimrc ~/.vimrc
ln -fs $DOTFILES/.gvimrc ~/.gvimrc
ln -fs $DOTFILES/.zshrc ~/.zshrc
ln -fs $DOTFILES/.ycm_extra_conf.py ~/.ycm_extra_conf.py
ln -fs $DOTFILES/custom ~/.oh-my-zsh/custom
