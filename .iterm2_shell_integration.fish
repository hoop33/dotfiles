if [ x"$TERM" != "xscreen" ] 
  function iterm2_status
    printf "\033]133;D;%s\007" $argv
  end

  # Mark start of prompt
  function iterm2_prompt_start
    printf "\033]133;A\007"
  end

  # Mark end of prompt
  function iterm2_prompt_end
    printf "\033]133;B\007"
  end

  # Tell terminal to create a mark at this location
  function iterm2_preexec
    # For other shells we would output status here but we can't do that in fish.
    printf "\033]133;C\007"
  end

  # Usage: iterm2_set_user_var key value
  # These variables show up in badges (and later in other places). For example
  # iterm2_set_user_var currentDirectory "$PWD"
  # Gives a variable accessible in a badge by \(user.currentDirectory)
  # Calls to this go in iterm2_print_user_vars.
  function iterm2_set_user_var
    printf "\033]1337;SetUserVar=%s=%s\007" "$argv[1]" (printf "%s" "$argv[2]" | base64)
  end

  # Users can override this.
  # It should call iterm2_set_user_var and produce no other output.
  function iterm2_print_user_vars
  end

  # iTerm2 inform terminal that command starts here
  function iterm2_precmd
    printf "\033]1337;RemoteHost=%s@%s\007\033]1337;CurrentDir=$PWD\007" $USER $iterm2_hostname
    iterm2_print_user_vars
  end

  functions -c fish_prompt iterm2_fish_prompt

  function fish_prompt --description 'Write out the prompt; do not replace this. Instead, change fish_prompt before sourcing .iterm2_shell_integration.fish, or modify iterm2_fish_prompt instead.'
    # Save our status
    set -l last_status $status

    iterm2_status $last_status
    iterm2_prompt_start
    # Restore the status
    sh -c "exit $last_status"
    iterm2_fish_prompt
    iterm2_prompt_end
  end

  function -v _ underscore_change
    if [ x$_ = xfish ]
      iterm2_precmd
    else
      iterm2_preexec
    end
  end

  # If hostname -f is slow for you, set iterm2_hostname before sourcing this script
  if not set -q iterm2_hostname
    set iterm2_hostname (hostname -f)
  end

  iterm2_precmd
  printf "\033]1337;ShellIntegrationVersion=1\007"
end
