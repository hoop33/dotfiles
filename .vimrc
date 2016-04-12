" Load dein {{{
set shell=/bin/sh
set nocompatible
filetype off

set runtimepath+=~/.vim/dein/repos/github.com/Shougo/dein.vim,~/.fzf,~/Development/vim-sift/

call dein#begin(expand('~/.vim/dein'))

call dein#add('Shougo/dein.vim')
call dein#add('Shougo/vimproc.vim')
call dein#add('Shougo/unite.vim')
call dein#add('Keithbsmiley/swift.vim')
call dein#add('altercation/vim-colors-solarized')
call dein#add('ap/vim-buftabline')
call dein#add('diepm/vim-rest-console')
call dein#add('duff/vim-bufonly')
call dein#add('easymotion/vim-easymotion')
call dein#add('editorconfig/editorconfig-vim')
call dein#add('edkolev/tmuxline.vim')
call dein#add('elixir-lang/vim-elixir')
call dein#add('elzr/vim-json')
call dein#add('fatih/vim-go')
call dein#add('groenewege/vim-less')
call dein#add('guns/vim-clojure-static')
"Plugin 'haya14busa/incsearch.vim')
call dein#add('itchyny/vim-cursorword')
call dein#add('itchyny/lightline.vim')
call dein#add('itspriddle/vim-marked')
call dein#add('jaxbot/github-issues.vim')
call dein#add('junegunn/fzf')
call dein#add('justinj/vim-react-snippets')
call dein#add('kchmck/vim-coffee-script')
call dein#add('ctrlpvim/ctrlp.vim')
call dein#add('kien/rainbow_parentheses.vim')
call dein#add('Konfekt/FastFold')
call dein#add('majutsushi/tagbar')
call dein#add('marijnh/tern_for_vim')
call dein#add('mattn/emmet-vim')
call dein#add('mileszs/ack.vim')
call dein#add('mtscout6/vim-cjsx')
call dein#add('pangloss/vim-javascript')
call dein#add('mxw/vim-jsx')
call dein#add('neilagabriel/vim-geeknote')
call dein#add('nlknguyen/papercolor-theme')
call dein#add('nono/vim-handlebars')
call dein#add('rizzatti/dash.vim')
call dein#add('rizzatti/funcoo.vim')
"Plugin 'rking/ag.vim')
call dein#add('gabesoft/vim-ags')
call dein#add('robertmeta/nofrils')
call dein#add('scrooloose/nerdcommenter')
call dein#add('scrooloose/nerdtree')
call dein#add('scrooloose/syntastic')
call dein#add('ryanoasis/vim-devicons')
call dein#add('samuelsimoes/vim-jsx-utils')
call dein#add('shime/vim-livedown')
call dein#add('Shougo/context_filetype.vim')
call dein#add('Shougo/neocomplete')
call dein#add('Shougo/neosnippet')
call dein#add('Shougo/neosnippet-snippets')
call dein#add('sickill/vim-pasta')
call dein#add('sjbach/lusty')
call dein#add('slava/tern-meteor')
call dein#add('terryma/vim-multiple-cursors')
call dein#add('tpope/vim-abolish')
call dein#add('tpope/vim-classpath')
call dein#add('tpope/vim-cucumber')
call dein#add('tpope/vim-endwise')
call dein#add('tpope/vim-fireplace')
call dein#add('tpope/vim-fugitive')
call dein#add('tpope/vim-git')
call dein#add('tpope/vim-haml')
call dein#add('tpope/vim-leiningen')
call dein#add('tpope/vim-markdown')
call dein#add('tpope/vim-projectionist')
call dein#add('tpope/vim-ragtag')
call dein#add('tpope/vim-rails')
call dein#add('tpope/vim-rake')
call dein#add('tpope/vim-repeat')
call dein#add('tpope/vim-speeddating')
call dein#add('tpope/vim-surround')
call dein#add('tpope/vim-unimpaired')
call dein#add('tpope/vim-vividchalk')
call dein#add('trusktr/seti.vim')
call dein#add('vim-ruby/vim-ruby')
call dein#add('vim-scripts/SyntaxRange')
call dein#add('vim-scripts/paredit.vim')
call dein#add('xolox/vim-easytags')
call dein#add('xolox/vim-misc')
call dein#add('Yggdroot/indentLine')

call dein#end()
filetype plugin indent on
" }}}

" Basic settings {{{
syntax on
set modelines=0
set hidden                          " Hide buffer when abandoned
set backspace=indent,eol,start
set tabstop=2                       " Number of spaces for a tab
set softtabstop=2                   " Number of spaces for a tab when editing
set shiftwidth=2                    " Number of spaces to indent
set expandtab                       " Expand tabs to spaces
set smarttab                        " Use shiftwidth when inserting tabs at beginning of line
scriptencoding utf-8
set encoding=utf-8                  " Set file encoding
set shiftround                      " Round indentation to multiple of shiftwidth
set showmode                        " Show the current mode
set showmatch                       " Show matching bracker
set showcmd                         " Show command at bottom of screen
set ignorecase                      " Ignore case when searching
set smartcase                       " Override ignorecase when search string has upper case characters
set wildmenu                        " Enhanced command-line completion
set wildmode=list:longest           " List all matches
set cursorline                      " Highlight current line
set ttyfast                         " Fast terminal connection (faster redraw)
set ruler                           " Show current line and column
set hlsearch                        " Highlight current matches
set incsearch                       " Incremental search
set title                           " Set titlebar to current file
set visualbell                      " Use a visual bell instead of audible bell
set noerrorbells                    " Turn off error bells
set nobackup                        " Don't create a backup of a file
set noswapfile                      " Don't create a swap file
set autoindent                      " Indent like previous line
set copyindent                      " Copy indentation
set directory=/tmp                  " Directory for swap files
set laststatus=2                    " Always show status line
set scrolloff=3                     " Minimum number of lines above/below cursor
set guioptions-=r                   " Remove scrollbar
set guioptions-=T                   " Remove toolbar
set guioptions+=e                   " Use GUI tabs
set clipboard=unnamed               " Use system clipboard
set pastetoggle=<F3>                " Key to toggle paste mode
set gdefault                        " Set default to global
set number                          " Show line numbers
set nolist                          " Don't show $ at ends of lines
set autoread                        " Automatically reload changed files
set t_Co=256                        " Set 256 colors for terminal vim
if has("gui_macvim")
  set macmeta                       " Enable Option key for key bindings
endif
set fillchars=vert:║

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
    ":set guifont=Sauce\ Code\ Powerline\ Plus\ Nerd\ File\ Types:h18
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
"nnoremap / /\v
"vnoremap / /\v
nnoremap ; :
nnoremap j gj
nnoremap k gk
nnoremap <tab> %
vnoremap <tab> %
nnoremap <silent> <leader>/ :nohlsearch<cr>
cnoremap w!! w !sudo tee % >/dev/null
nnoremap <leader>S ?{<CR>jV/^\s*\}?$<CR>k:sort<CR>:noh<CR>
nnoremap <leader>v V`]
"nnoremap <leader>vs <C-w>v<C-w>l
"nnoremap <leader>hs <C-w>s<C-w>j
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
" }}}

" Buffer settings {{{
" New buffer
nnoremap <M-t> :enew<cr>
" Next buffer
nnoremap <M-l> :bnext<cr>
" Previous buffer
nnoremap <M-h> :bprevious<cr>
" Close current buffer and move to previous buffer
nnoremap <leader>bq :bp <bar> bd #<cr>
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
augroup END
" }}}

" Go settings {{{
augroup golang
  autocmd!
  autocmd FileType go nmap <leader>s <Plug>(go-implements)
  autocmd FileType go nmap <leader>i <Plug>(go-info)
  autocmd FileType go nmap <leader>gd <Plug>(go-doc)
  autocmd FileType go nmap <leader>gv <Plug>(go-doc-vertical)
  autocmd FileType go nmap <leader>gb <Plug>(go-doc-browser)
  autocmd FileType go nmap <leader>r <Plug>(go-run)
  autocmd FileType go nmap <leader>b <Plug>(go-build)
  autocmd FileType go nmap <leader>t <Plug>(go-test)
  autocmd FileType go nmap <leader>c <Plug>(go-coverage)
  autocmd FileType go nmap <leader>ds <Plug>(go-def-split)
  autocmd FileType go nmap <leader>dv <Plug>(go-def-vertical)
  autocmd FileType go nmap <leader>dt <Plug>(go-def-tab)
  autocmd FileType go nmap <leader>e <Plug>(go-rename)
  autocmd FileType go nmap <leader>v <Plug>(go-vet)
augroup end

let g:go_fmt_command = "goimports"
let g:go_highlight_functions = 1
let g:go_highlight_methods = 1
let g:go_highlight_structs = 1
let g:go_highlight_operators = 1
let g:go_highlight_build_constraints = 1
" }}}

" Source .vimrc on save {{{
augroup vimrc_changed
  autocmd!
  autocmd! bufwritepost $MYVIMRC nested source $MYVIMRC
augroup END
" }}}

" fzf settings {{{
set rtp+=~/.fzf
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

" HTML file settings {{{
augroup html
  autocmd!
  autocmd FileType html nnoremap <buffer> <localleader>c I\<!-- <esc>A --\><esc>
  autocmd FileType html :iabbrev <buffer> --- &mdash;
augroup end
"}}}

" Vimscript file settings {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
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
augroup END

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
let g:vim_json_syntax_conceal = 0
augroup filetype_json
  autocmd!
  autocmd FileType json setlocal foldmethod=syntax
augroup END
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
augroup END
" }}}

" NeoVim does not have Ruby support yet {{{
let g:LustyJugglerSuppressRubyWarning = 1
" }}}

" GeekNote settings {{{
nnoremap <leader>gn :Geeknote<cr>
" }}}

" incsearch settings {{{
"map /  <Plug>(incsearch-forward)
"map ?  <Plug>(incsearch-backward)
"map g/ <Plug>(incsearch-stay)
" }}}

" Livedown settings {{{
let g:livedown_autorun = 0
" }}}

" Emmet settings {{{
let g:user_emmet_install_global = 0
augroup emmet
  autocmd!
  autocmd FileType html,css,handlebars.html,javascript.jsx EmmetInstall
augroup END
let g:user_emmet_leader_key='<c-z>'
" }}}

" JSX settings {{{
let g:jsx_ext_required = 0 " Allow JSX in normal JS files
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
augroup END

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
augroup END
function! s:syntastic()
  SyntasticCheck
  call lightline#update()
endfunction

let g:unite_force_overwrite_statusline = 0
let g:vimfiler_force_overwrite_statusline = 0
let g:vimshell_force_overwrite_statusline = 0
" }}}
