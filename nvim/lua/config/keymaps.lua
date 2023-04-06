-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here

-- Insert UUID
vim.keymap.set("i", "<C-u>", "<C-r>=trim(system('uuidgen'))<cr>", { noremap = true, desc = "Insert a UUID" })

-- Format JSON
vim.keymap.set("n", "<leader>json", ":%!jq<cr>", { noremap = true, desc = "Format JSON" })

-- Format xml
vim.keymap.set("n", "<leader>xml", ":%!xmllint --format -<cr>", { noremap = true, desc = "Format XML" })

-- Format X12
vim.keymap.set(
  "n",
  "<leader>x12",
  -- "<cmd>%s/\\n//g<cr><cmd>%s/\\~/\\~\r/g<cr>gg<cmd>nohlsearch<cr>",
  "<cmd>%s/\\~/\\~\r/g<cr>",
  { noremap = true, silent = true, desc = "Format X12" }
)

-- Unstringify JSON
-- :command US execute('silent! %s/\\\\/\\/ge | %s/\\"/\"/ge | %s/\\[n,r,t]//ge | %!jq')
vim.keymap.set(
  "n",
  "<leader>jj",
  '<cmd>%s/\\\\/\\/ge | %s/\\"/"/ge<cr>',
  { noremap = true, silent = true, desc = "Unstringify JSON" }
)
-- vim.keymap.set("n", "<leader>fj", vim.cmd('silent! %s/\\\\/\\/ge | %s/\\"/"/ge | %s/\\[n,r,t]//ge<cr>'))
