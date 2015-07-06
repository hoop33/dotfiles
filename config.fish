# Path to your oh-my-fish.
set fish_path $HOME/.oh-my-fish

# Path to your custom folder (default path is ~/.oh-my-fish/custom)
set fish_custom $HOME/dotfiles/oh-my-fish

# Load oh-my-fish configuration.
. $fish_path/oh-my-fish.fish

function fish_prompt
  ~/powerline-shell.py $status --shell bare ^/dev/null
end

function fish_greeting
end

# NVM / Node
source ~/.config/fish/nvm-wrapper/nvm.fish
nvm use node 2>&1 >/dev/null

# Custom plugins and themes may be added to ~/.oh-my-fish/custom
# Plugins and themes can be found at https://github.com/oh-my-fish/
#Theme 'robbyrussell'
Plugin 'theme'
Plugin 'balias'
Plugin 'vi-mode'
Plugin 'git-flow'
Plugin 'gi'
Plugin 'z'
