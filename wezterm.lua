local wezterm = require("wezterm")

return {
	font = wezterm.font("ComicCodeLigatures Nerd Font"),
	font_size = 14.0,
	color_scheme = "Galaxy",
	enable_tab_bar = false,
	keys = {
		{
			key = "Enter",
			mods = "META",
			action = wezterm.action.DisableDefaultAssignment,
		},
	},
}
