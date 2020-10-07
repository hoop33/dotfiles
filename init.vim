" Load vim-plug {{{
set shell=/bin/sh
set nocompatible
filetype off

call plug#begin(expand('~/.vim/plugged'))

Plug 'ap/vim-buftabline'
Plug 'arrufat/vala.vim'
Plug 'cespare/vim-toml'
Plug 'christoomey/vim-tmux-navigator'
Plug 'dart-lang/dart-vim-plugin'
Plug 'diepm/vim-rest-console'
Plug 'edkolev/tmuxline.vim'
Plug 'elzr/vim-json'
Plug 'fatih/vim-go'
Plug 'jsfaint/gen_tags.vim'
Plug 'groenewege/vim-less'
Plug 'hashivim/vim-terraform'
Plug 'haya14busa/is.vim'
Plug 'itchyny/vim-cursorword'
Plug 'itchyny/lightline.vim'
Plug 'itspriddle/vim-marked'
Plug 'jaxbot/semantic-highlight.vim'
Plug 'jparise/vim-graphql'
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'junegunn/fzf.vim'
Plug 'junegunn/vim-peekaboo'
Plug 'justinj/vim-react-snippets'
Plug 'kaicataldo/material.vim'
Plug 'kdheepak/lazygit.nvim'
Plug 'kristijanhusak/vim-carbon-now-sh'
Plug 'leafgarland/typescript-vim'
Plug 'liuchengxu/vim-clap'
Plug 'liuchengxu/vim-which-key'
Plug 'luochen1990/rainbow'
Plug 'mattn/emmet-vim'
Plug 'maximbaz/lightline-ale'
Plug 'mileszs/ack.vim'
Plug 'ms-jpq/chadtree', {'branch': 'chad', 'do': ':UpdateRemotePlugins'}
Plug 'mtscout6/vim-cjsx'
Plug 'mxw/vim-jsx'
Plug 'nathanaelkane/vim-indent-guides'
Plug 'neoclide/coc.nvim', {'branch': 'release'}
Plug 'nono/vim-handlebars'
Plug 'pangloss/vim-javascript'
Plug 'peitalin/vim-jsx-typescript'
Plug 'godlygeek/tabular'
Plug 'plasticboy/vim-markdown'
Plug 'rhysd/committia.vim'
Plug 'rhysd/git-messenger.vim'
Plug 'gabesoft/vim-ags'
Plug 'scrooloose/nerdcommenter'
Plug 'scrooloose/nerdtree'
Plug 'Xuyuanp/nerdtree-git-plugin'
Plug 'qpkorr/vim-renamer'
Plug 'radenling/vim-dispatch-neovim'
Plug 'reisub0/hot-reload.vim'
Plug 'rhadley-recurly/vim-terragrunt'
Plug 'rust-lang/rust.vim'
Plug 'ryanoasis/vim-devicons'
Plug 'samuelsimoes/vim-jsx-utils'
Plug 'Shougo/context_filetype.vim'
Plug 'Shougo/neosnippet'
Plug 'Shougo/neosnippet-snippets'
Plug 'sebdah/vim-delve'
Plug 'sickill/vim-pasta'
Plug 'sodapopcan/vim-twiggy'
Plug 'styled-components/vim-styled-components', { 'branch': 'main' }
Plug 'ternjs/tern_for_vim', { 'do': 'npm install && npm install -g tern' }
Plug 'tmux-plugins/vim-tmux'
Plug 'tmux-plugins/vim-tmux-focus-events'
Plug 'tpope/vim-characterize'
Plug 'tpope/vim-endwise'
Plug 'tpope/vim-eunuch'
Plug 'tpope/vim-fugitive'
Plug 'tpope/vim-git'
Plug 'tpope/vim-repeat'
Plug 'tpope/vim-surround'
Plug 'tveskag/nvim-blame-line'
Plug 'vim-scripts/groovyindent-unix'
Plug 'vim-scripts/vim-gradle'
Plug 'dense-analysis/ale'
Plug 'wincent/loupe'
Plug 'Yilin-Yang/vim-markbar'

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
set clipboard=unnamedplus           " Use system clipboard
set completeopt=menuone,noinsert,noselect,preview
set copyindent                      " Copy indentation
set cursorline                      " Highlight current line
set directory=/tmp                  " Directory for swap files
set encoding=utf-8                  " Set file encoding
set equalalways                     " Keep windows equally sized
set expandtab                       " Expand tabs to spaces
set fillchars=vert:║
set guioptions+=e                   " Use GUI tabs
set guioptions-=T                   " Remove toolbar
set guioptions-=r                   " Remove scrollbar
set hidden                          " Hide buffer when abandoned
set hlsearch                        " Highlight current matches
set ignorecase                      " Ignore case when searching
set incsearch                       " Incremental search
set laststatus=2                    " Always show status line
set lazyredraw                      " Trying to fix lag problems
set modelines=0
set nobackup                        " Don't create a backup of a file
set noerrorbells                    " Turn off error bells
set nolist                          " Don't show $ at ends of lines
set noswapfile                      " Don't create a swap file
set nowritebackup
set number                          " Show line numbers
set pastetoggle=<F3>                " Key to toggle paste mode
set pumblend=30                     " Popup transparency
set relativenumber                  " Show relative line numbers
set ruler                           " Show current line and column
set scrolloff=3                     " Minimum number of lines above/below cursor
set shiftround                      " Round indentation to multiple of shiftwidth
set shiftwidth=2                    " Number of spaces to indent
set showcmd                         " Show command at bottom of screen
set showmatch                       " Show matching bracker
set showmode                        " Show the current mode
set shortmess+=c
set signcolumn=yes
set smartcase                       " Override ignorecase when search string has upper case characters
set smarttab                        " Use shiftwidth when inserting tabs at beginning of line
set softtabstop=2                   " Number of spaces for a tab when editing
set tabstop=2                       " Number of spaces for a tab
set timeoutlen=500
set title                           " Set titlebar to current file
set updatetime=300
set visualbell                      " Use a visual bell instead of audible bell
set wildmenu                        " Enhanced command-line completion
set wildmode=list:longest           " List all matches
if has("gui_macvim")
  set macmeta                       " Enable Option key for key bindings
endif

if (has("termguicolors"))
  set termguicolors
  let &t_8f = "[38;2;%lu;%lu;%lum"
  let &t_8b = "[48;2;%lu;%lu;%lum"
else
  set t_Co=256
endif

set background=dark
let g:material_terminal_italics=1
colorscheme material

highlight Keyword cterm=italic gui=italic ctermfg=221 guifg=#ffcb6b
highlight jsFunction cterm=italic gui=italic ctermfg=221 guifg=#ffcb6b
highlight Operator ctermfg=221 guifg=#ffcb6b
highlight Noise ctermfg=221 guifg=#ffcb6b
highlight NormalNC ctermfg=248 guifg=#aaaaaa
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
noremap <silent> <expr> j (v:count == 0 ? 'gj' : 'j')
noremap <silent> <expr> k (v:count == 0 ? 'gk' : 'k')
nnoremap <silent> <leader>/ :nohlsearch<cr>
nnoremap <leader>S ?{<CR>jV/^\s*\}?$<CR>k:sort<CR>:noh<CR>
nnoremap <leader>v V`]
nnoremap <leader>- yyp<esc>:s/./-/<cr>:nohlsearch<cr>
nnoremap <leader>= yyp<esc>:s/./=/<cr>:nohlsearch<cr>
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l
nnoremap <leader>cd :cd %:p:h<cr>
nnoremap <leader>json :%!jq<cr>
nnoremap <leader>xml :%!xmllint --format -<cr>
nnoremap <leader>x12 :%s/\n//g<cr>:%s/\~/\~\r/g<cr>gg:nohlsearch<cr>
nnoremap - ddp
nnoremap _ ddkP
nnoremap <leader>ev :split $MYVIMRC<cr>
nnoremap <leader>" viw<esc>a"<esc>hbi"<esc>lel
nnoremap <leader>' viw<esc>a'<esc>hbi'<esc>lel
nnoremap <leader>` viw<esc>a`<esc>hbi`<esc>lel
inoremap jj <esc>
inoremap <c-u> <esc>viwUi
nnoremap <c-u> viwU
vnoremap < <gv
vnoremap > >gv

" Turn off Ex mode, and use it to replay the last macro
nnoremap Q @@

" Delete all
nnoremap <leader>da :%d<cr>

" Move visual block up or down
vnoremap J :m '>+1<CR>gv=gv
vnoremap K :m '<-2<CR>gv=gv

" Close all other splits except active
nnoremap <leader>s :on<cr>

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

" Go settings {{{
augroup golang
  autocmd!
  autocmd FileType go :iabbrev pakcage package
  autocmd FileType go :iabbrev stirng string
  autocmd FileType go nmap <leader>a <Plug>(go-alternate-edit)
  autocmd FileType go nmap <leader>b <Plug>(go-build)
  autocmd FileType go nmap <leader>ds <Plug>(go-def-split)
  autocmd FileType go nmap <leader>dt <Plug>(go-def-tab)
  autocmd FileType go nmap <leader>dv <Plug>(go-def-vertical)
  autocmd FileType go nmap <leader>e <Plug>(go-rename)
  autocmd FileType go nmap <leader>gb <Plug>(go-doc-browser)
  autocmd FileType go nmap <leader>gd <Plug>(go-doc)
  autocmd FileType go nmap <leader>gv <Plug>(go-doc-vertical)
  autocmd FileType go nmap <leader>i <Plug>(go-info)
  autocmd FileType go nmap <leader>r <Plug>(go-run)
  autocmd FileType go nmap <leader>st :GoAddTags<cr>
  autocmd FileType go nmap <leader>t <Plug>(go-test)
  autocmd FileType go normal zR
  autocmd FileType go setlocal foldmethod=syntax
augroup end

let g:go_def_mapping_enabled = 0 " Let COC handle gd
let g:go_doc_keywordprg_enabled = 0 " Let COC handle K for documentation
let g:go_addtags_transform = "snakecase"
let g:go_auto_sameids = 1
let g:go_auto_type_info = 0
let g:go_fmt_command = "goimports"
let g:go_highlight_build_constraints = 1
let g:go_highlight_extra_types = 1
let g:go_highlight_fields = 1
let g:go_highlight_functions = 1
let g:go_highlight_methods = 1
let g:go_highlight_operators = 1
let g:go_highlight_structs = 1
let g:go_highlight_types = 1
let g:go_list_type = 'quickfix'
let g:go_snippet_engine = "neosnippet"
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

" gen_tags settings {{{
let g:loaded_gentags#gtags=1
let g:gen_tags#ctags_use_cache_dir=0
" }}}

" fzf settings {{{
set rtp+=~/.fzf
nnoremap <leader>o :Files<cr>
nnoremap <leader>p :BTags<cr>
nnoremap <leader>[ :Buffers<cr>
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
:iabbrev retunr return
" }}}

" DevIcons settings {{{
let g:webdevicons_enable_airline_tabline=0
let g:webdevicons_enable_airline_statusline=0
let g:webdevicons_enable_nerdtree=1
let g:webdevicons_conceal_nerdtree_brackets=1
let g:WebDevIconsUnicodeDecorateFolderNodes=1
let g:WebDevIconsUnicodeDecorateFileNodesExtensionSymbols = {} " needed
let g:WebDevIconsUnicodeDecorateFileNodesExtensionSymbols['cjsx'] = ''
" }}}

" CHADTree settings {{{
"nnoremap <leader>n <cmd>CHADopen<cr>
" }}}

" NERDTree settings {{{
let NERDTreeBookmarksFile=expand("$HOME/.vim/NERDTreeBookmarks")
let NERDTreeShowBookmarks=1
let NERDTreeShowFiles=1
let NERDTreeShowHidden=1
let NERDTreeQuitOnOpen=1
let NERDTreeHighlightCursorline=1
let NERDTreeMouseMode=2
let NERDTreeAutoDeleteBuffer=1
nnoremap <leader>n :NERDTreeToggle<CR>
nnoremap <leader>m :NERDTreeClose<CR>:NERDTreeFind<CR>
augroup vim_startup
  autocmd!
  autocmd StdinReadPre * let s:std_in=1
  "autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif
  autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif
augroup end

function! NERDTreeHighlightFile(extension, fg, bg, guifg, guibg)
  exec 'autocmd FileType nerdtree highlight ' . a:extension .' ctermbg='. a:bg .' ctermfg='. a:fg .' guibg='. a:guibg .' guifg='. a:guifg
  exec 'autocmd FileType nerdtree syn match ' . a:extension .' #^\s\+.*'. a:extension .'$#'
endfunction

call NERDTreeHighlightFile('ini', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('md', 'blue', 'none', '#3366FF', '#151515')
call NERDTreeHighlightFile('txt', 'blue', 'none', '#3366FF', '#151515')
call NERDTreeHighlightFile('yml', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('yaml', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('toml', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('config', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('conf', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('json', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('html', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('styl', 'cyan', 'none', 'cyan', '#151515')
call NERDTreeHighlightFile('css', 'cyan', 'none', 'cyan', '#151515')
call NERDTreeHighlightFile('js', 'red', 'none', '#ffa500', '#151515')
call NERDTreeHighlightFile('jsx', 'red', 'none', '#ffa500', '#151515')
call NERDTreeHighlightFile('cjsx', 'red', 'none', 'red', '#151515')
call NERDTreeHighlightFile('php', 'magenta', 'none', '#ff00ff', '#151515')
call NERDTreeHighlightFile('go', 'cyan', 'none', 'cyan', '#151515')
" }}}

" Latex-Suite settings {{{
set grepprg=grep\ -nH\ $*
let g:tex_flavor='latex'
" }}}

" Rainbow Parentheses settings {{{
let g:rainbow_active = 1
let g:rainbow_conf = {
\ 	'guifgs': ['royalblue3', 'darkorange3', 'seagreen3', 'firebrick'],
\ 	'ctermfgs': ['160', '226', '164', '028'],
\ 	'operators': '_,_',
\  	'parentheses': ['start=/(/ end=/)/ fold', 'start=/\[/ end=/\]/ fold', 'start=/{/ end=/}/ fold'],
\  	'separately': {
\  		'*': {},
\     'nerdtree': 0,
\  		'tex': {
\  			'parentheses': ['start=/(/ end=/)/', 'start=/\[/ end=/\]/'],
\  		},
\  		'lisp': {
\  			'guifgs': ['royalblue3', 'darkorange3', 'seagreen3', 'firebrick', 'darkorchid3'],
\  		},
\  		'vim': {
\  			'parentheses': ['start=/(/ end=/)/', 'start=/\[/ end=/\]/', 'start=/{/ end=/}/ fold', 'start=/(/ end=/)/ containedin=vimFuncBody', 'start=/\[/ end=/\]/ containedin=vimFuncBody', 'start=/{/ end=/}/ fold containedin=vimFuncBody'],
\  		},
\  		'html': {
\  			'parentheses': ['start=/\v\<((area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)[ >])@!\z([-_:a-zA-Z0-9]+)(\s+[-_:a-zA-Z0-9]+(\=("[^"]*"|'."'".'[^'."'".']*'."'".'|[^ '."'".'"><=`]*))?)*\>/ end=#</\z1># fold'],
\ 		},
\		'css': 0,
\	  }
\}
" }}}

" Emmet settings {{{
let g:user_emmet_install_global = 0
augroup emmet
  autocmd!
  autocmd FileType html,css,handlebars.html,javascript,javascript.jsx,eelixir EmmetInstall
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

" ALE settings {{{
let g:ale_disable_lsp = 1
let g:ale_sign_column_always = 1
let g:ale_sign_error = ''
let g:ale_sign_warning = ''
let g:ale_fixers = {
  \ 'javascript': ['eslint']
  \ }
let g:ale_fix_on_save = 1
nmap <silent> <leader>aj :ALENext<cr>
nmap <silent> <leader>ak :ALEPrevious<cr>
" }}}

" Semantic Highlight settings {{{
:nnoremap <leader>sh :SemanticHighlightToggle<cr>
" }}}

" Buftabline settings {{{
let g:buftabline_indicators = 1
let g:buftabline_separators = 1
highlight default link BufTabLineActive TabLineSel
highlight default link BufTabLineCurrent PmenuSel
" }}}

" Lightline settings {{{
let g:lightline = {
      \   'colorscheme': 'material_vim',
      \   'active': {
      \     'left': [
      \       [ 'mode', 'paste' ],
      \       [ 'fugitive', 'filename', 'cocstatus' ]
      \     ],
      \     'right': [
      \       [ 'lineinfo' ],
      \       [ 'percent', 'fileformat', 'fileencoding', 'filetype' ],
      \       [ 'linter_checking', 'linter_errors', 'linter_warnings', 'linter_ok' ] 
      \     ]
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
      \     'cocstatus'   : 'coc#status'
      \   },
      \   'component_expand': {
      \     'linter_checking': 'lightline#ale#checking',
      \     'linter_warnings': 'lightline#ale#warnings',
      \     'linter_errors': 'lightline#ale#errors',
      \     'linter_ok': 'lightline#ale#ok'
      \   },
      \   'component_type': {
      \     'linter_checking': 'left',
      \     'linter_warnings': 'warning',
      \     'linter_errors': 'error',
      \     'linter_ok': 'left'
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
  return fname =~ '__Gundo\|NERD_tree' ? '' :
        \ &ft == 'vimfiler' ? vimfiler#get_status_string() :
        \ &ft == 'unite' ? unite#get_status_string() :
        \ &ft == 'vimshell' ? vimshell#get_status_string() :
        \ ('' != MyReadonly() ? MyReadonly() . ' ' : '') .
        \ ('' != fname ? fname : '[No Name]') .
        \ ('' != MyModified() ? ' ' . MyModified() : '')
endfunction

function! MyFugitive()
  try
    if expand('%:t') !~? 'Gundo\|NERD' && &ft !~? 'vimfiler' && exists('*fugitive#head')
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
  return fname == '__Gundo__' ? 'Gundo' :
        \ fname == '__Gundo_Preview__' ? 'Gundo Preview' :
        \ fname =~ 'NERD_tree' ? 'NERDTree' :
        \ &ft == 'unite' ? 'Unite' :
        \ &ft == 'vimfiler' ? 'VimFiler' :
        \ &ft == 'vimshell' ? 'VimShell' :
        \ winwidth(0) > 60 ? lightline#mode() : ''
endfunction

let g:unite_force_overwrite_statusline = 0
let g:vimfiler_force_overwrite_statusline = 0
let g:vimshell_force_overwrite_statusline = 0

let g:lightline#ale#indicator_checking = "\uf110"
let g:lightline#ale#indicator_warnings = "\uf071 "
let g:lightline#ale#indicator_errors = "\uf05e "
let g:lightline#ale#indicator_ok = "\uf00c"
" }}}

" deoplete settings {{{
"let g:deoplete#enable_at_startup = 1
"let g:deoplete#enable_smart_case = 1
"let g:deoplete#sources#go#gocode_binary = $GOPATH.'/bin/gocode'
"let g:deoplete#sources#go#sort_class = ['package', 'func', 'type', 'var', 'const']
"let g:deoplete#sources#go#pointer = 1
"let g:deoplete#sources#go#use_cache = 1
"let g:deoplete#sources#go#json_directory = $HOME.'/.cache/deoplete/go/$GOOS_$GOARCH'

"inoremap <silent><expr><tab> pumvisible() ? "\<c-n>" : "\<tab>"
" }}}

" NeoSnippet settings {{{
imap <c-d> <Plug>(neosnippet_expand_or_jump)
smap <c-d> <Plug>(neosnippet_expand_or_jump)
xmap <c-d> <Plug>(neosnippet_expand_target)
" }}}

" Python settings {{{
let g:python_host_prog=$HOME.'/.pyenv/versions/2.7.15/bin/python'
let g:python3_host_prog=$HOME.'/.pyenv/versions/3.8.1/bin/python'
" }}}

" Markbar settings {{{
map <leader>M <Plug>ToggleMarkbar
" }}}

" WhichKey settings {{{
nnoremap <silent> <leader> :WhichKey '<space>'<cr>
" }}}

" nvim-blame-line settings {{{
nnoremap <silent> <leader>b :ToggleBlameLine<cr>
" }}}

" Show highlight attributes {{{
map <F10> :echo "hi<" . synIDattr(synID(line("."),col("."),1),"name") . '> trans<'
\ . synIDattr(synID(line("."),col("."),0),"name") . "> lo<"
\ . synIDattr(synIDtrans(synID(line("."),col("."),1)),"name") . ">"<CR>
" }}}

" COC {{{
" Use tab for trigger completion with characters ahead and navigate.
" Use command ':verbose imap <tab>' to make sure tab is not mapped by other plugin.
inoremap <silent><expr> <TAB>
      \ pumvisible() ? "\<C-n>" :
      \ <SID>check_back_space() ? "\<TAB>" :
      \ coc#refresh()
inoremap <expr><S-TAB> pumvisible() ? "\<C-p>" : "\<C-h>"

function! s:check_back_space() abort
  let col = col('.') - 1
  return !col || getline('.')[col - 1]  =~ '\s'
endfunction

" Use <c-space> to trigger completion.
inoremap <silent><expr> <c-space> coc#refresh()

"if exists('*complete_info')
  "inoremap <expr> <cr> complete_info()["selected"] != "-1" ? "\<C-y>" : "\<C-g>u\<CR>"
"else
  "imap <expr> <cr> pumvisible() ? "\<C-y>" : "\<C-g>u\<CR>"
"endif

" Use <cr> to confirm completion, `<C-g>u` means break undo chain at current position.
" Coc only does snippet and additional edit on confirm.
"inoremap <expr> <cr> pumvisible() ? "\<C-y>" : "\<C-g>u\<CR>"

" Use `[g` and `]g` to navigate diagnostics
nmap <silent> [g <Plug>(coc-diagnostic-prev)
nmap <silent> ]g <Plug>(coc-diagnostic-next)

" Remap keys for gotos
nmap <silent> gd <Plug>(coc-definition)
nmap <silent> gy <Plug>(coc-type-definition)
nmap <silent> gi <Plug>(coc-implementation)
nmap <silent> gr <Plug>(coc-references)

" Use K to show documentation in preview window
nnoremap <silent> K :call <SID>show_documentation()<CR>

function! s:show_documentation()
  if (index(['vim','help'], &filetype) >= 0)
    execute 'h '.expand('<cword>')
  else
    call CocAction('doHover')
  endif
endfunction

" Highlight symbol under cursor on CursorHold
autocmd CursorHold * silent call CocActionAsync('highlight')

" Remap for rename current word
nmap <leader>rn <Plug>(coc-rename)

" Remap for format selected region
xmap <leader>f  <Plug>(coc-format-selected)
nmap <leader>f  <Plug>(coc-format-selected)

augroup coc
  autocmd!
  " Setup formatexpr specified filetype(s).
  autocmd FileType typescript,json setl formatexpr=CocAction('formatSelected')
  " Update signature help on jump placeholder
  autocmd User CocJumpPlaceholder call CocActionAsync('showSignatureHelp')
augroup end

" Remap for do codeAction of selected region, ex: `<leader>aap` for current paragraph
xmap <leader>a  <Plug>(coc-codeaction-selected)
nmap <leader>a  <Plug>(coc-codeaction-selected)

" Remap for do codeAction of current line
nmap <leader>ac  <Plug>(coc-codeaction)
" Fix autofix problem of current line
nmap <leader>qf  <Plug>(coc-fix-current)

" Use `:Format` to format current buffer
command! -nargs=0 Format :call CocAction('format')

" Use `:Fold` to fold current buffer
command! -nargs=? Fold :call     CocAction('fold', <f-args>)

" Using CocList
" Show all diagnostics
nnoremap <silent> <leader>a  :<C-u>CocList diagnostics<cr>
" Manage extensions
nnoremap <silent> <leader>e  :<C-u>CocList extensions<cr>
" Show commands
nnoremap <silent> <leader>c  :<C-u>CocList commands<cr>
" Find symbol of current document
nnoremap <silent> <leader>l  :<C-u>CocList outline<cr>
" Search workleader symbols
nnoremap <silent> <leader>s  :<C-u>CocList -I symbols<cr>
" Do default action for next item.
nnoremap <silent> <leader>j  :<C-u>CocNext<CR>
" Do default action for previous item.
nnoremap <silent> <leader>k  :<C-u>CocPrev<CR>
" Resume latest coc list
nnoremap <silent> <leader>;  :<C-u>CocListResume<CR>

let g:coc_global_extensions = ['coc-emmet', 'coc-css', 'coc-html', 'coc-json', 'coc-prettier', 'coc-tsserver']

if isdirectory('./node_modules') && isdirectory('./node_modules/prettier')
  let g:coc_global_extensions += ['coc-prettier']
endif

if isdirectory('./node_modules') && isdirectory('./node_modules/eslint')
  let g:coc_global_extensions += ['coc-eslint']
endif
" }}}

" Terraform {{{
let g:terraform_fmt_on_save=1
augroup terraform
  autocmd!
  autocmd BufNewFile,BufRead *.hcl set filetype=terraform
augroup END
" }}}

" JSX / TSX syntax highlighting gets out of sync on large files {{{
augroup jsx_syntax_highlighting
  autocmd!
  autocmd BufEnter *.{js,jsx,ts,tsx} :syntax sync fromstart
  autocmd BUfLeave *.{js,jsx,ts,tsx} :syntax sync clear
augroup END
" }}}

" LazyGit {{{
nnoremap <silent> <leader>g :LazyGit<cr>
" }}}

" Typora {{{
nnoremap <silent> <leader>t :exe ':silent !typora % &'<cr> 
