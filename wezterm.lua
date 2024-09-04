local wezterm = require("wezterm")
local config = wezterm.config_builder()

config.font = wezterm.font({ family = "ComicCodeLigatures Nerd Font" })
config.font_size = 14.0
config.color_scheme = "Galaxy"
config.enable_tab_bar = false
-- config.window_background_opacity = 0.8
-- config.macos_window_background_blur = 30
config.window_decorations = "RESIZE"
config.keys = {
  {
    key = "Enter",
    mods = "META",
    action = wezterm.action.DisableDefaultAssignment,
  },
}

return config
