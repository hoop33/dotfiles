local wezterm = require("wezterm")

return {
	font = wezterm.font("ComicCodeLigatures Nerd Font"),
	font_size = 14.0,
	color_scheme = "tokyonight",
	keys = {
		{
			key = "Enter",
			mods = "META",
			action = wezterm.action.DisableDefaultAssignment,
		},
	},
}
