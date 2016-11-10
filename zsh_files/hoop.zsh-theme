#!/usr/bin/env zsh

setopt prompt_subst

autoload -U add-zsh-hook
autoload -Uz vcs_info

# Set the shell to vi mode
bindkey -v
bindkey '^w' backward-kill-word
bindkey '^r' history-incremental-search-backward
export KEYTIMEOUT=1

# Prompt characters
STATUS_SUCCESS_CHAR='👍 '
STATUS_ERROR_CHAR='💀 '
GIT_BISECT_CHAR='<B>'
GIT_REBASE_CHAR='>R>'
GIT_MERGE_CHAR=''
GIT_BRANCH_CHAR=''
GIT_STAGED_CHAR=''
GIT_UNSTAGED_CHAR=''
GIT_UNTRACKED_CHAR='👻'
PROMPT_CHAR='🏀'
VIM_MODE_CHAR=''

WAITING_PROMPT_CHAR='⏳'

ZSH_THEME_GIT_PROMPT_CLEAN=
ZSH_TMP_PROMPT_FILE=${HOME}/tmp/.zsh_tmp_prompt

# Print a segment of the prompt
# params: background color, foreground color, text
function prompt_segment() {
  local bg fg
  [[ -n $1 ]] && bg="%K{$1}" || bg="%k"
  [[ -n $2 ]] && fg="%F{$2}" || fg="%f"

  echo -n "%{$bg%}%{$fg%}"
  [[ -n $3 ]] && echo -n $3
}

# Prints an error if the previous command failed
function prompt_status() {
  local prev_status
  prev_status=()
  
  [[ $RETVAL -eq 0 ]] && prev_status+="$STATUS_SUCCESS_CHAR"
  [[ $RETVAL -ne 0 ]] && prev_status+="$STATUS_ERROR_CHAR"
  [[ -n "$prev_status" ]] && prompt_segment NONE default "$prev_status"
}

# Prints the current directory
function prompt_dir() {
  prompt_segment NONE blue '%~'
}

# Prints Git information
function prompt_git() {
  local ref dirty mode repo_path
  repo_path=$(git rev-parse --git-dir 2>/dev/null)

  if $(git rev-parse --is-inside-work-tree >/dev/null 2>&1); then
    dirty=$(parse_git_dirty)
    ref=$(git symbolic-ref HEAD 2> /dev/null) || ref="➦ $(git show-ref --head -s --abbrev |head -n1 2> /dev/null)"
    if [[ -n $dirty ]]; then
      prompt_segment NONE yellow
    else
      prompt_segment NONE green
    fi

    if [[ -e "${repo_path}/BISECT_LOG" ]]; then
      mode=" $GIT_BISECT_CHAR "
    elif [[ -e "${repo_path}/MERGE_HEAD" ]]; then
      mode=" $GIT_MERGE_CHAR "
    elif [[ -e "${repo_path}/rebase" || -e "${repo_path}/rebase-apply" || -e "${repo_path}/rebase-merge" || -e "${repo_path}/../.dotest" ]]; then
      mode=" $GIT_REBASE_CHAR "
    fi

    zstyle ':vcs_info:*' enable git
    zstyle ':vcs_info:*' get-revision true
    zstyle ':vcs_info:*' check-for-changes true
    zstyle ':vcs_info:*' stagedstr "$GIT_STAGED_CHAR "
    zstyle ':vcs_info:git:*' unstagedstr "$GIT_UNSTAGED_CHAR "
    zstyle ':vcs_info:*' formats ' %u%c'
    zstyle ':vcs_info:*' actionformats ' %u%c%m'
    zstyle ':vcs_info:git*+set-message:*' hooks git-untracked
    vcs_info
    echo -n "${ref/refs\/heads\//$GIT_BRANCH_CHAR }${vcs_info_msg_0_%% }${mode}"
  fi
}

# From https://github.com/sunaku/home/blob/master/.zsh/config/prompt.zsh
### git: Show marker (T) if there are untracked files in repository
# Make sure you have added staged to your 'formats':  %c
function +vi-git-untracked(){
  if [[ $(git rev-parse --is-inside-work-tree 2> /dev/null) == 'true' ]] && \
    git status --porcelain | fgrep '??' &> /dev/null ; then
    # This will show the marker if there are any untracked files in repo.
    # If instead you want to show the marker only if there are untracked
    # files in $PWD, use:
    #[[ -n $(git ls-files --others --exclude-standard) ]] ; then
    hook_com[unstaged]+="$GIT_UNTRACKED_CHAR "
  fi
}

# Prints the end of the prompt
function prompt_end() {
  echo -n "%{%k%}%{%f%}"
}

# Async prompt from http://www.anishathalye.com/2015/02/07/an-asynchronous-shell-prompt/
ASYNC_PROC=0
function zle-line-init zle-keymap-select {
  RETVAL=$?
  VIM_PROMPT="${${KEYMAP/vicmd/$VIM_MODE_CHAR }/(main|viins)/$PROMPT_CHAR }"
  PROMPT='$(prompt_status) $(prompt_dir) $(prompt_segment NONE green $VIM_PROMPT) $(prompt_end)'
  RPROMPT='$(prompt_segment NONE blue $WAITING_PROMPT_CHAR)'

  function async() {
    printf "%s" "$(prompt_git)" > ${ZSH_TMP_PROMPT_FILE}
    kill -s USR1 $$
  }

  if [[ "${ASYNC_PROC}" != 0 ]]; then
    kill -s HUP $ASYNC_PROC >/dev/null 2>&1 || :
  fi

  async &!
  ASYNC_PROC=$!
  zle reset-prompt
  zle -R
}

function TRAPUSR1() {
  RPROMPT="$(<${ZSH_TMP_PROMPT_FILE})"
  ASYNC_PROC=0
  zle && zle reset-prompt
}

RPS1=
zle -N zle-line-init
zle -N zle-keymap-select
