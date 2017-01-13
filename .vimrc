" Load vim-plug {{{
set shell=/bin/sh
set nocompatible
filetype off

call plug#begin(expand('~/.vim/plugged'))

Plug 'Keithbsmiley/swift.vim'
Plug 'altercation/vim-colors-solarized'
Plug 'ap/vim-buftabline'
Plug 'cespare/vim-toml'
Plug 'diepm/vim-rest-console'
Plug 'duff/vim-bufonly'
Plug 'easymotion/vim-easymotion'
"Plug 'editorconfig/editorconfig-vim'
Plug 'edkolev/tmuxline.vim'
Plug 'elixir-lang/vim-elixir'
Plug 'elzr/vim-json'
Plug 'fatih/vim-go'
Plug 'groenewege/vim-less'
Plug 'guns/vim-clojure-static'
Plug 'itchyny/vim-cursorword'
Plug 'itchyny/lightline.vim'
Plug 'itspriddle/vim-marked'
Plug 'jaxbot/github-issues.vim'
Plug 'jaxbot/semantic-highlight.vim'
Plug 'jremmen/vim-ripgrep'
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'junegunn/fzf.vim'
Plug 'junegunn/vim-easy-align'
Plug 'junegunn/vim-peekaboo'
Plug 'justinj/vim-react-snippets'
Plug 'kchmck/vim-coffee-script'
Plug 'ctrlpvim/ctrlp.vim'
Plug 'kien/rainbow_parentheses.vim'
Plug 'Konfekt/FastFold'
Plug 'lluchs/vim-wren'
Plug 'majutsushi/tagbar'
Plug 'marijnh/tern_for_vim'
Plug 'mattn/emmet-vim'
Plug 'mileszs/ack.vim'
Plug 'mtscout6/vim-cjsx'
Plug 'pangloss/vim-javascript'
Plug 'mxw/vim-jsx'
Plug 'nathanaelkane/vim-indent-guides'
Plug 'neilagabriel/vim-geeknote'
Plug 'nlknguyen/papercolor-theme'
Plug 'nono/vim-handlebars'
Plug 'rhysd/committia.vim'
Plug 'rizzatti/dash.vim'
Plug 'rizzatti/funcoo.vim'
Plug 'gabesoft/vim-ags'
Plug 'robertmeta/nofrils'
Plug 'rust-lang/rust.vim'
Plug 'scrooloose/nerdcommenter'
Plug 'scrooloose/nerdtree'
Plug 'ryanoasis/vim-devicons'
Plug 'samuelsimoes/vim-jsx-utils'
Plug 'shime/vim-livedown'
Plug 'Shougo/context_filetype.vim'
Plug 'Shougo/neocomplete'
Plug 'Shougo/neosnippet'
Plug 'Shougo/neosnippet-snippets'
Plug 'sickill/vim-pasta'
Plug 'sjbach/lusty'
Plug 'slashmili/alchemist.vim'
Plug 'terryma/vim-multiple-cursors'
Plug 'tmux-plugins/vim-tmux'
Plug 'tmux-plugins/vim-tmux-focus-events'
Plug 'tpope/vim-abolish'
Plug 'tpope/vim-classpath'
Plug 'tpope/vim-cucumber'
Plug 'tpope/vim-endwise'
Plug 'tpope/vim-fireplace'
Plug 'tpope/vim-fugitive'
Plug 'tpope/vim-git'
Plug 'tpope/vim-haml'
Plug 'tpope/vim-leiningen'
Plug 'tpope/vim-markdown'
Plug 'tpope/vim-projectionist'
Plug 'tpope/vim-ragtag'
Plug 'tpope/vim-rails'
Plug 'tpope/vim-rake'
Plug 'tpope/vim-repeat'
Plug 'tpope/vim-speeddating'
Plug 'tpope/vim-surround'
Plug 'tpope/vim-unimpaired'
Plug 'tpope/vim-vividchalk'
Plug 'trusktr/seti.vim'
Plug 'vim-ruby/vim-ruby'
Plug 'vim-scripts/ReplaceWithRegister'
Plug 'vim-scripts/SyntaxRange'
Plug 'vim-scripts/paredit.vim'
Plug 'vim-syntastic/syntastic'
Plug 'wincent/loupe'
Plug 'xolox/vim-easytags'
Plug 'xolox/vim-misc'
"Plug 'Yggdroot/indentLine'

call plug#end()
filetype plugin indent on
" }}}

" Basic settings {{{
scriptencoding utf-8
syntax on
set autoindent                      " Indent like previous line
set autoread                        " Automatically reload changed files
set backspace=indent,eol,start
set backupcopy=yes                  " On save, make a backup and overwrite original
set clipboard=unnamed               " Use system clipboard
set copyindent                      " Copy indentation
set cursorline                      " Highlight current line
set directory=/tmp                  " Directory for swap files
set encoding=utf-8                  " Set file encoding
set expandtab                       " Expand tabs to spaces
set fillchars=vert:║
set gdefault                        " Set default to global
set guioptions+=e                   " Use GUI tabs
set guioptions-=T                   " Remove toolbar
set guioptions-=r                   " Remove scrollbar
set hidden                          " Hide buffer when abandoned
set hlsearch                        " Highlight current matches
set ignorecase                      " Ignore case when searching
set incsearch                       " Incremental search
set laststatus=2                    " Always show status line
set modelines=0
set nobackup                        " Don't create a backup of a file
set noerrorbells                    " Turn off error bells
set nolist                          " Don't show $ at ends of lines
set noswapfile                      " Don't create a swap file
set number                          " Show line numbers
set pastetoggle=<F3>                " Key to toggle paste mode
set relativenumber                  " Show relative line numbers
set ruler                           " Show current line and column
set scrolloff=3                     " Minimum number of lines above/below cursor
set shiftround                      " Round indentation to multiple of shiftwidth
set shiftwidth=2                    " Number of spaces to indent
set showcmd                         " Show command at bottom of screen
set showmatch                       " Show matching bracker
set showmode                        " Show the current mode
set smartcase                       " Override ignorecase when search string has upper case characters
set smarttab                        " Use shiftwidth when inserting tabs at beginning of line
set softtabstop=2                   " Number of spaces for a tab when editing
set t_Co=256                        " Set 256 colors for terminal vim
set tabstop=2                       " Number of spaces for a tab
set title                           " Set titlebar to current file
set ttyfast                         " Fast terminal connection (faster redraw)
set visualbell                      " Use a visual bell instead of audible bell
set wildmenu                        " Enhanced command-line completion
set wildmode=list:longest           " List all matches
if has("gui_macvim")
  set macmeta                       " Enable Option key for key bindings
endif

set background=dark
:colorscheme PaperColor

" Set up GUI options
if has("gui_running")
  :set columns=120 lines=70
  if has("gui_gtk2")
    :set guifont=Source\ Code\ Pro\ for\ Powerline\ 18
  elseif has("win32")
    :set guifont=Sauce_Code_Powerline_PNFT:h14
  else
    :set guifont=Sauce\ Code\ Powerline\ Plus\ Nerd\ File\ Types\ Plus\ Font\ Awesome\ Plus\ Octicons\ Plus\ Pomicons:h18
  endif
endif
nnoremap Q <nop>                    " Turn off Ex mode
" }}}

" Cursor shape on tmux/iTerm2 {{{
let &t_SI = "\<Esc>Ptmux;\<Esc>\<Esc>]50;CursorShape=1\x7\<Esc>\\"
let &t_SR = "\<Esc>Ptmux;\<Esc>\<Esc>]50;CursorShape=2\x7\<Esc>\\"
let &t_EI = "\<Esc>Ptmux;\<Esc>\<Esc>]50;CursorShape=0\x7\<Esc>\\"
" }}}

" Leader settings {{{
let mapleader = "\<Space>"
let maplocalleader = "\\"
" }}}

" Various mappings {{{
nnoremap ; :
"nnoremap j gj
"nnoremap k gk
noremap <silent> <expr> j (v:count == 0 ? 'gj' : 'j')
noremap <silent> <expr> k (v:count == 0 ? 'gk' : 'k')
nnoremap <tab> %
vnoremap <tab> %
nnoremap <silent> <leader>/ :nohlsearch<cr>
cnoremap w!! w !sudo tee % >/dev/null
nnoremap <leader>S ?{<CR>jV/^\s*\}?$<CR>k:sort<CR>:noh<CR>
nnoremap <leader>v V`]
nnoremap <leader>- yyp<esc>:s/./-/<cr>:nohlsearch<cr>
nnoremap <leader>= yyp<esc>:s/./=/<cr>:nohlsearch<cr>
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l
nnoremap <leader>cd :cd %:p:h<cr>
nnoremap <leader>json :%!python -m json.tool<cr>
nnoremap <leader>xml :%!xmllint --format -<cr>
nnoremap - ddp
nnoremap _ ddkP
nnoremap <leader>ev :vsplit $MYVIMRC<cr>
nnoremap <leader>" viw<esc>a"<esc>hbi"<esc>lel
nnoremap <leader>' viw<esc>a'<esc>hbi'<esc>lel
nnoremap <leader>` viw<esc>a`<esc>hbi`<esc>lel
inoremap jj <esc>
inoremap kk <esc>
inoremap jk <esc>
inoremap <c-u> <esc>viwUi
nnoremap <c-u> viwU
vnoremap < <gv
vnoremap > >gv

" Delete all
nnoremap <leader>da :%d<cr>

" Move visual block up or down
vnoremap J :m '>+1<CR>gv=gv
vnoremap K :m '<-2<CR>gv=gv

" Close all other splits except active
nnoremap <leader>s :on<cr>

" Search and Replace
nnoremap <c-r> :%s//<left>

" Yank to end of line
nnoremap Y y$
" }}}

" Buffer settings {{{
" New buffer
nnoremap <leader>bn :enew<cr>
" Previous buffer
nnoremap <c-u> :bprevious<cr>
" Next buffer
nnoremap <c-i> :bnext<cr>
" Close current buffer and move to previous buffer
nnoremap <leader>bd :bp <bar> bd #<cr>
" }}}

" Operator Pending mappings {{{
onoremap p i(
onoremap in( :<c-u>normal! f(vi(<cr>
onoremap il( :<c-u>normal! F)vi(<cr>
onoremap in{ :<c-u>normal! f{vi{<cr>
onoremap il{ :<c-u>normal! F}vi{<cr>
" }}}

" Focus Lost settings {{{
augroup focus_lost
  autocmd!
  autocmd FocusLost * silent! :wa
augroup end
" }}}

" Plugin helpers {{{
nnoremap <leader>pi :PlugInstall<cr>
nnoremap <leader>pu :PlugUpdate<cr>
nnoremap <leader>pc :PlugClean!<cr>
"}}}

" Go settings {{{
augroup golang
  autocmd!
  autocmd FileType go nmap <leader>b <Plug>(go-build)
  autocmd FileType go nmap <leader>c <Plug>(go-coverage)
  autocmd FileType go nmap <leader>ds <Plug>(go-def-split)
  autocmd FileType go nmap <leader>dt <Plug>(go-def-tab)
  autocmd FileType go nmap <leader>dv <Plug>(go-def-vertical)
  autocmd FileType go nmap <leader>e <Plug>(go-rename)
  autocmd FileType go nmap <leader>gb <Plug>(go-doc-browser)
  autocmd FileType go nmap <leader>gd <Plug>(go-doc)
  autocmd FileType go nmap <leader>gv <Plug>(go-doc-vertical)
  autocmd FileType go nmap <leader>i <Plug>(go-info)
  autocmd FileType go nmap <leader>r <Plug>(go-run)
  autocmd FileType go nmap <leader>s <Plug>(go-implements)
  autocmd FileType go nmap <leader>t <Plug>(go-test)
  autocmd FileType go nmap <leader>v <Plug>(go-vet)
augroup end

let g:go_fmt_command = "goimports"
let g:go_highlight_build_constraints = 1
let g:go_highlight_functions = 1
let g:go_highlight_methods = 1
let g:go_highlight_operators = 1
let g:go_highlight_structs = 1
let g:go_list_type = 'quickfix'
" }}}

" Rust settings {{{
let g:rustfmt_autosave = 1
" }}}

" Source .vimrc on save {{{
augroup vimrc_changed
  autocmd!
  autocmd bufwritepost $MYVIMRC nested source $MYVIMRC
augroup end
" }}}

" fzf settings {{{
set rtp+=~/.fzf
command! -bang -nargs=* Find call fzf#vim#grep('rg --column --line-number --no-heading --fixed-strings --ignore-case --no-ignore --hidden --follow --glob "!.git/*" --color "always" '.shellescape(<q-args>), 1, <bang>0)
" }}}

" IndentLine settings {{{
let g:indentLine_leadingSpaceChar='·'
let g:indentLine_leadingSpaceEnabled=1
let g:indentLine_showFirstIndentLevel=1
let g:indentLine_char = '┊'"
" }}}

" Ags settings {{{
let g:ags_agexe='$HOMEBREW/bin/ag'
" }}}

" ripgrep settings {{{
let g:rg_highlight=1
" }}}

" JavaScript file settings {{{
augroup javascript
  autocmd!
  autocmd FileType javascript nnoremap <buffer> <localleader>c I// <esc>
  autocmd FileType javascript :iabbrev <buffer> iff if ()<left>
  autocmd BufRead,BufNewFile *.es6 setfiletype javascript
augroup end
"}}}

" REST console settings {{{
nnoremap <leader>rc :set filetype=rest<cr>
let g:vrc_allow_get_request_body=1
augroup rest
  autocmd!
  autocmd FileType rest :iabbrev lh http://localhost:9200<cr>--<cr><cr>--<cr>
  autocmd FileType rest :iabbrev lha http://localhost:8280<cr>RemoteUser:rwarner<cr>--<cr><cr>--<cr>
augroup end
" }}}

" HTML file settings {{{
augroup html
  autocmd!
  autocmd FileType html nnoremap <buffer> <localleader>c I\<!-- <esc>A --\><esc>
  autocmd FileType html :iabbrev <buffer> --- &mdash;
augroup end
" }}}

" Vimscript file settings {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup end
" }}}

" Abbreviations {{{
:iabbrev ot to
:iabbrev em rwarner@grailbox.com
:iabbrev retunr return
" }}}

" DevIcons settings {{{
let g:webdevicons_enable_airline_tabline=0
let g:webdevicons_enable_airline_statusline=0
let g:WebDevIconsUnicodeDecorateFolderNodes=1
let g:WebDevIconsUnicodeDecorateFileNodesExtensionSymbols = {} " needed
let g:WebDevIconsUnicodeDecorateFileNodesExtensionSymbols['cjsx'] = ''
" }}}

" NERDTree settings {{{
let NERDTreeBookmarksFile=expand("$HOME/.vim/NERDTreeBookmarks")
let NERDTreeShowBookmarks=1
let NERDTreeShowFiles=1
let NERDTreeShowHidden=1
let NERDTreeQuitOnOpen=0
let NERDTreeHighlightCursorline=1
let NERDTreeMouseMode=2
nnoremap <leader>n :NERDTreeToggle<CR>
nnoremap <leader>m :NERDTreeClose<CR>:NERDTreeFind<CR>
augroup vim_startup
  autocmd!
  autocmd StdinReadPre * let s:std_in=1
  autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif
  autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif
augroup end

function! NERDTreeHighlightFile(extension, fg, bg, guifg, guibg)
exec 'autocmd FileType nerdtree highlight ' . a:extension .' ctermbg='. a:bg .' ctermfg='. a:fg .' guibg='. a:guibg .' guifg='. a:guifg
exec 'autocmd FileType nerdtree syn match ' . a:extension .' #^\s\+.*'. a:extension .'$#'
endfunction

call NERDTreeHighlightFile('jade', 'green', 'none', 'green', '#151515')
call NERDTreeHighlightFile('ini', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('md', 'blue', 'none', '#3366FF', '#151515')
call NERDTreeHighlightFile('yml', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('config', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('conf', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('json', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('html', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('styl', 'cyan', 'none', 'cyan', '#151515')
call NERDTreeHighlightFile('css', 'cyan', 'none', 'cyan', '#151515')
call NERDTreeHighlightFile('coffee', 'Red', 'none', 'red', '#151515')
call NERDTreeHighlightFile('js', 'Red', 'none', '#ffa500', '#151515')
call NERDTreeHighlightFile('jsx', 'Red', 'none', '#ffa500', '#151515')
call NERDTreeHighlightFile('cjsx', 'Red', 'none', 'red', '#151515')
call NERDTreeHighlightFile('php', 'Magenta', 'none', '#ff00ff', '#151515')
call NERDTreeHighlightFile('go', 'cyan', 'none', 'cyan', '#151515')
" }}}

" CtrlP settings {{{
let g:ctrlp_map = '<c-p>'
let g:ctrlp_cmd = 'CtrlP'
set wildignore+=*/tmp/*,*.so,*.o,*.swp,*.zip,*.class,*/bower_components/*,*/node_modules/*,*/build/*,*/dist/*
nnoremap <leader>. :CtrlPTag<cr>
nnoremap <leader>o :CtrlP<cr>
" }}}

" vim-json settings {{{
"let g:vim_json_syntax_conceal = 0
"augroup filetype_json
  "autocmd!
  "autocmd FileType json setlocal foldmethod=syntax
"augroup end
" }}}

" Tagbar settings {{{
" For my work Mac, ctags is in a non-standard place
" and Tagbar doesn't search path for ctags
let g:tagbar_ctags_bin='$HOMEBREW/bin/ctags'
let g:tagbar_autoclose=1

nnoremap <leader>l :TagbarToggle<cr><C-w>l
vnoremap <leader>l :TagbarToggle<cr><C-w>l

let g:tagbar_type_markdown = {
    \ 'ctagstype' : 'markdown',
    \ 'kinds' : [
        \ 'h:Heading_L1',
        \ 'i:Heading_L2',
        \ 'k:Heading_L3'
    \ ]
\ }

let g:tagbar_type_objc = {
  \ 'ctagstype': 'objc',
  \ 'ctagsargs': [
    \ '-f',
    \ '-',
    \ '--excmd=pattern',
    \ '--extra=',
    \ '--format=2',
    \ '--fields=nksaSmt',
    \ '--objc-kinds=-N',
  \ ],
  \ 'sro': ' ',
  \ 'kinds': [
    \ 'c:constant',
    \ 'e:enum',
    \ 't:typedef',
    \ 'i:interface',
    \ 'P:protocol',
    \ 'p:property',
    \ 'I:implementation',
    \ 'M:method',
    \ 'g:pragma',
  \ ],
\ }
" }}}

" Latex-Suite settings {{{
set grepprg=grep\ -nH\ $*
let g:tex_flavor='latex'
" }}}

" Rainbow Parentheses settings {{{
augroup rainbow
  autocmd!
  autocmd VimEnter * RainbowParenthesesToggle
  autocmd Syntax * RainbowParenthesesLoadRound
  autocmd Syntax * RainbowParenthesesLoadSquare
  autocmd Syntax * RainbowParenthesesLoadBraces
augroup end
" }}}

" NeoVim does not have Ruby support yet {{{
let g:LustyJugglerSuppressRubyWarning = 1
" }}}

" GeekNote settings {{{
nnoremap <leader>gn :Geeknote<cr>
" }}}

" Livedown settings {{{
let g:livedown_autorun = 0
" }}}

" Emmet settings {{{
let g:user_emmet_install_global = 0
augroup emmet
  autocmd!
  autocmd FileType html,css,handlebars.html,javascript.jsx,eelixir EmmetInstall
augroup end
let g:user_emmet_leader_key='<c-z>'
let g:user_emmet_settings = {
\ 'javascript' : {
\   'extends' : 'jsx',
\ },
\}
" }}}

" JSX settings {{{
let g:jsx_ext_required = 1 " Allow JSX in normal JS files
" }}}

" vim-jsx-utils settings {{{
nnoremap <leader>jr :call JSXEncloseReturn()<cr>
nnoremap <leader>ja :call JSXEachAttributeInLine()<cr>
nnoremap <leader>je :call JSXExtractPartialPrompt()<cr>
nnoremap vat :call JSXSelectTag()<cr>
" }}}

" Syntastic settings {{{
let g:syntastic_javascript_checkers = ['eslint']
let g:syntastic_c_checkers = ['cppcheck']
let g:syntastic_go_checkers = ['golint', 'govet']
let g:syntastic_mode_map = {'mode': 'active', 'passive_filetypes': ['go']}

set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*

let g:syntastic_enable_signs = 1

let g:syntastic_error_symbol = '💀'
let g:syntastic_style_error_symbol = '👎'
let g:syntastic_warning_symbol = '🚫'
let g:syntastic_style_warning_symbol = '🙈'

let g:syntastic_always_populate_loc_list = 1
let g:syntastic_loc_list_height = 5
let g:syntastic_auto_loc_list = 1
let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 0
" }}}

" Semantic Highlight settings {{{
:nnoremap <leader>sh :SemanticHighlightToggle<cr>
" }}}

" Sourcegraph settings {{{
let g:SOURCEGRAPH_AUTO = "false"
nnoremap <leader>sg :GRAPH<cr>
" }}}

" Dash settings {{{
:nmap <silent> <leader>d <Plug>DashSearch
:nmap <silent> <leader>df <Plug>DashGlobalSearch
" }}}

" Easymotion settings {{{
let g:EasyMotion_do_mapping = 0 " Disable default mappings
let g:EasyMotion_smartcase = 1
let g:EasyMotion_use_upper = 1
let g:EasyMotion_keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ;'
nmap s <Plug>(easymotion-s2)
map <Leader>j <Plug>(easymotion-j)
map <Leader>k <Plug>(easymotion-k)
" }}}

" Buftabline settings {{{
let g:buftabline_indicators = 1
let g:buftabline_separators = 1
highlight default link BufTabLineActive TabLineSel
highlight default link BufTabLineCurrent PmenuSel
" }}}

" Neocomplete settings {{{
" Disable AutoComplPop.
let g:acp_enableAtStartup = 0
" Use neocomplete.
let g:neocomplete#enable_at_startup = 1
" Use smartcase.
let g:neocomplete#enable_smart_case = 1
" Set minimum syntax keyword length.
let g:neocomplete#sources#syntax#min_keyword_length = 3
let g:neocomplete#lock_buffer_name_pattern = '\*ku\*'

" Define dictionary.
let g:neocomplete#sources#dictionary#dictionaries = {
    \ 'default' : '',
    \ 'vimshell' : $HOME.'/.vimshell_hist',
    \ 'scheme' : $HOME.'/.gosh_completions'
        \ }

" Define keyword.
if !exists('g:neocomplete#keyword_patterns')
    let g:neocomplete#keyword_patterns = {}
endif
let g:neocomplete#keyword_patterns['default'] = '\h\w*'

" Plugin key-mappings.
inoremap <expr><C-g>     neocomplete#undo_completion()
inoremap <expr><C-l>     neocomplete#complete_common_string()

" Recommended key-mappings.
" <CR>: close popup and save indent.
inoremap <silent> <CR> <C-r>=<SID>my_cr_function()<CR>
function! s:my_cr_function()
"  return neocomplete#close_popup() . "\<CR>"
  " For no inserting <CR> key.
  return pumvisible() ? neocomplete#close_popup() : "\<CR>"
endfunction
" <TAB>: completion.
inoremap <expr><TAB>  pumvisible() ? "\<C-n>" : "\<TAB>"
" <C-h>, <BS>: close popup and delete backword char.
inoremap <expr><C-h> neocomplete#smart_close_popup()."\<C-h>"
inoremap <expr><BS> neocomplete#smart_close_popup()."\<C-h>"
inoremap <expr><C-y>  neocomplete#close_popup()
inoremap <expr><C-e>  neocomplete#cancel_popup()
" Close popup by <Space>.
"inoremap <expr><Space> pumvisible() ? neocomplete#close_popup() : "\<Space>"

" For cursor moving in insert mode(Not recommended)
"inoremap <expr><Left>  neocomplete#close_popup() . "\<Left>"
"inoremap <expr><Right> neocomplete#close_popup() . "\<Right>"
"inoremap <expr><Up>    neocomplete#close_popup() . "\<Up>"
"inoremap <expr><Down>  neocomplete#close_popup() . "\<Down>"
" Or set this.
"let g:neocomplete#enable_cursor_hold_i = 1
" Or set this.
"let g:neocomplete#enable_insert_char_pre = 1

" AutoComplPop like behavior.
"let g:neocomplete#enable_auto_select = 1

" Shell like behavior(not recommended).
"set completeopt+=longest
"let g:neocomplete#enable_auto_select = 1
"let g:neocomplete#disable_auto_complete = 1
"inoremap <expr><TAB>  pumvisible() ? "\<Down>" : "\<C-x>\<C-u>"

" Enable omni completion.
augroup omni
  autocmd!
  autocmd FileType css setlocal omnifunc=csscomplete#CompleteCSS
  autocmd FileType html,markdown setlocal omnifunc=htmlcomplete#CompleteTags
  autocmd FileType javascript setlocal omnifunc=javascriptcomplete#CompleteJS
  autocmd FileType python setlocal omnifunc=pythoncomplete#Complete
  autocmd FileType xml setlocal omnifunc=xmlcomplete#CompleteTags
augroup end

" Enable heavy omni completion.
if !exists('g:neocomplete#sources#omni#input_patterns')
  let g:neocomplete#sources#omni#input_patterns = {}
endif
"let g:neocomplete#sources#omni#input_patterns.php = '[^. \t]->\h\w*\|\h\w*::'
"let g:neocomplete#sources#omni#input_patterns.c = '[^.[:digit:] *\t]\%(\.\|->\)'
"let g:neocomplete#sources#omni#input_patterns.cpp = '[^.[:digit:] *\t]\%(\.\|->\)\|\h\w*::'

" For perlomni.vim setting.
" https://github.com/c9s/perlomni.vim
let g:neocomplete#sources#omni#input_patterns.perl = '\h\w*->\h\w*\|\h\w*::'
" }}}

" Neosnippet settings {{{
imap <c-space> <Plug>(neosnippet_expand_or_jump)
smap <c-space> <Plug>(neosnippet_expand_or_jump)
xmap <c-space> <Plug>(neosnippet_expand_target)

" SuperTab like snippets behavior.
imap <expr><TAB> neosnippet#expandable_or_jumpable() ?
\ "\<Plug>(neosnippet_expand_or_jump)"
\: pumvisible() ? "\<C-n>" : "\<TAB>"
smap <expr><TAB> neosnippet#expandable_or_jumpable() ?
\ "\<Plug>(neosnippet_expand_or_jump)"
\: "\<TAB>"

" For conceal markers.
if has('conceal')
  set conceallevel=2 concealcursor=niv
endif

" Enable snipMate compatibility
let g:neosnippet#enable_snipmate_compatibility = 1
" }}}

" Lightline settings {{{
let g:lightline = {
      \   'colorscheme': 'wombat',
      \   'active': {
      \     'left': [
      \       [ 'mode', 'paste' ],
      \       [ 'fugitive', 'filename' ],
      \       [ 'ctrlpmark' ]
      \     ],
      \     'right': [
      \       [ 'syntastic', 'lineinfo' ],
      \       [ 'percent' ],
      \       [ 'fileformat', 'fileencoding', 'filetype' ] ]
      \   },
      \   'component': {
      \     'lineinfo': '%3l:%-2v'
      \   },
      \   'component_function': {
      \     'fugitive'    : 'MyFugitive',
      \     'filename'    : 'MyFilename',
      \     'fileformat'  : 'MyFileformat',
      \     'filetype'    : 'MyFiletype',
      \     'fileencoding': 'MyFileencoding',
      \     'mode'        : 'MyMode',
      \     'ctrlpmark'   : 'CtrlPMark'
      \   },
      \   'component_expand': {
      \     'syntastic': 'SyntasticStatuslineFlag',
      \   },
      \   'component_type': {
      \     'syntastic': 'error',
      \   },
      \   'separator': {
      \     'left': '',
      \     'right': ''
      \   },
      \   'subseparator': {
      \     'left': '',
      \     'right': ''
      \   },
		  \   'tab': {
		  \     'active': [ 'tabnum', 'filename', 'modified' ],
		  \     'inactive': [ 'tabnum', 'filename', 'modified' ]
      \   },
      \   'tabline': {
      \     'left': [
      \       [ 'tabs' ]
      \     ],
      \     'right': [
      \       [ 'close' ]
      \     ]
      \   }
      \ }

function! MyModified()
  return &ft =~ 'help' ? '' : &modified ? '+' : &modifiable ? '' : '-'
endfunction

function! MyReadonly()
  return &ft !~? 'help' && &readonly ? '' : ''
endfunction

function! MyFilename()
  let fname = expand('%:t')
  return fname == 'ControlP' ? g:lightline.ctrlp_item :
        \ fname == '__Tagbar__' ? g:lightline.fname :
        \ fname =~ '__Gundo\|NERD_tree' ? '' :
        \ &ft == 'vimfiler' ? vimfiler#get_status_string() :
        \ &ft == 'unite' ? unite#get_status_string() :
        \ &ft == 'vimshell' ? vimshell#get_status_string() :
        \ ('' != MyReadonly() ? MyReadonly() . ' ' : '') .
        \ ('' != fname ? fname : '[No Name]') .
        \ ('' != MyModified() ? ' ' . MyModified() : '')
endfunction

function! MyFugitive()
  try
    if expand('%:t') !~? 'Tagbar\|Gundo\|NERD' && &ft !~? 'vimfiler' && exists('*fugitive#head')
      let mark = ' '
      let _ = fugitive#head()
      return strlen(_) ? mark._ : ''
    endif
  catch
  endtry
  return ''
endfunction

function! MyFileformat()
  return winwidth(0) > 70 ? (&fileformat. ' ' . WebDevIconsGetFileFormatSymbol()) : ''
endfunction

function! MyFiletype()
  return winwidth(0) > 70 ? (strlen(&filetype) ? &filetype . ' ' . WebDevIconsGetFileTypeSymbol() : 'no ft') : ''
endfunction

function! MyFileencoding()
  return winwidth(0) > 70 ? (strlen(&fenc) ? &fenc : &enc) : ''
endfunction

function! MyMode()
  let fname = expand('%:t')
  return fname == '__Tagbar__' ? 'Tagbar' :
        \ fname == 'ControlP' ? 'CtrlP' :
        \ fname == '__Gundo__' ? 'Gundo' :
        \ fname == '__Gundo_Preview__' ? 'Gundo Preview' :
        \ fname =~ 'NERD_tree' ? 'NERDTree' :
        \ &ft == 'unite' ? 'Unite' :
        \ &ft == 'vimfiler' ? 'VimFiler' :
        \ &ft == 'vimshell' ? 'VimShell' :
        \ winwidth(0) > 60 ? lightline#mode() : ''
endfunction

function! CtrlPMark()
  if expand('%:t') =~ 'ControlP'
    call lightline#link('iR'[g:lightline.ctrlp_regex])
    return lightline#concatenate([g:lightline.ctrlp_prev, g:lightline.ctrlp_item
          \ , g:lightline.ctrlp_next], 0)
  else
    return ''
  endif
endfunction

let g:ctrlp_status_func = {
  \ 'main': 'CtrlPStatusFunc_1',
  \ 'prog': 'CtrlPStatusFunc_2',
  \ }

function! CtrlPStatusFunc_1(focus, byfname, regex, prev, item, next, marked)
  let g:lightline.ctrlp_regex = a:regex
  let g:lightline.ctrlp_prev = a:prev
  let g:lightline.ctrlp_item = a:item
  let g:lightline.ctrlp_next = a:next
  return lightline#statusline(0)
endfunction

function! CtrlPStatusFunc_2(str)
  return lightline#statusline(0)
endfunction

let g:tagbar_status_func = 'TagbarStatusFunc'

function! TagbarStatusFunc(current, sort, fname, ...) abort
  let g:lightline.fname = a:fname
  return lightline#statusline(0)
endfunction

augroup AutoSyntastic
  autocmd!
  autocmd BufWritePost *.c,*.cpp call s:syntastic()
augroup end

function! s:syntastic()
  SyntasticCheck
  call lightline#update()
endfunction

let g:unite_force_overwrite_statusline = 0
let g:vimfiler_force_overwrite_statusline = 0
let g:vimshell_force_overwrite_statusline = 0
" }}}
