" Load Pathogen {{{
"execute pathogen#infect()
" }}}

" Load Vundle {{{
set nocompatible
filetype off

set runtimepath+=~/.vim/bundle/Vundle.vim
call vundle#begin()

Plugin 'gmarik/Vundle.vim'
Plugin 'vim-scripts/SyntaxRange'
Plugin 'mileszs/ack.vim'
Plugin 'kien/ctrlp.vim'
Plugin 'rizzatti/dash.vim'
Plugin 'editorconfig/editorconfig-vim'
Plugin 'mattn/emmet-vim'
Plugin 'rizzatti/funcoo.vim'
Plugin 'jaxbot/github-issues.vim'
Plugin 'nanotech/jellybeans.vim'
Plugin 'sjbach/lusty'
Plugin 'scrooloose/nerdcommenter'
Plugin 'scrooloose/nerdtree'
Plugin 'vim-scripts/paredit.vim'
Plugin 'kien/rainbow_parentheses.vim'
Plugin 'Keithbsmiley/swift.vim'
Plugin 'scrooloose/syntastic'
Plugin 'godlygeek/tabular'
Plugin 'majutsushi/tagbar'
Plugin 'marijnh/tern_for_vim'
Plugin 'tpope/vim-abolish'
Plugin 'itchyny/lightline.vim'
Plugin 'duff/vim-bufonly'
Plugin 'tpope/vim-classpath'
Plugin 'guns/vim-clojure-static'
Plugin 'kchmck/vim-coffee-script'
Plugin 'altercation/vim-colors-solarized'
Plugin 'tpope/vim-cucumber'
Plugin 'xolox/vim-easytags'
Plugin 'elixir-lang/vim-elixir'
Plugin 'tpope/vim-endwise'
Plugin 'tpope/vim-fireplace'
Plugin 'tpope/vim-flatfoot'
Plugin 'tpope/vim-fugitive'
Plugin 'tpope/vim-git'
Plugin 'tpope/vim-haml'
Plugin 'nono/vim-handlebars'
Plugin 'wgibbs/vim-irblack'
Plugin 'pangloss/vim-javascript'
Plugin 'elzr/vim-json'
Plugin 'groenewege/vim-less'
Plugin 'plasticboy/vim-markdown'
Plugin 'xolox/vim-misc'
"Plugin 'tpope/vim-pathogen'
Plugin 'therubymug/vim-pyte'
Plugin 'tpope/vim-ragtag'
Plugin 'tpope/vim-rails'
Plugin 'tpope/vim-rake'
Plugin 'tpope/vim-repeat'
Plugin 'vim-ruby/vim-ruby'
Plugin 'tpope/vim-speeddating'
Plugin 'tpope/vim-surround'
Plugin 'tpope/vim-unimpaired'
Plugin 'tpope/vim-vividchalk'
Plugin 'rking/ag.vim'
Plugin 'itspriddle/vim-marked'
Plugin 'tpope/vim-leiningen'
Plugin 'neilagabriel/vim-geeknote'
Plugin 'bling/vim-bufferline'
Plugin 'haya14busa/incsearch.vim'
Plugin 'shime/vim-livedown'

call vundle#end()
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
set macmeta                         " Enable Option key for key bindings

" Set up GUI options
if has("gui_running")
  :set columns=120 lines=70
  if has("gui_gtk2")
    :set guifont=Source\ Code\ Pro\ for\ Powerline\ 18
  else
    :set guifont=Source\ Code\ Pro\ for\ Powerline:h18
  endif
endif
nnoremap Q <nop>                    " Turn off Ex mode
" }}}

" Leader settings {{{
let mapleader = "\<Space>"
let maplocalleader = "\\"
" }}}

" Various mappings {{{
nnoremap / /\v
vnoremap / /\v
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
nnoremap <leader>da :%d<cr>

" Move visual block up or down
vnoremap J :m '>+1<CR>gv=gv
vnoremap K :m '<-2<CR>gv=gv
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

" Bufferline settings {{{
let g:bufferline_echo = 0
let g:bufferline_active_buffer_left = '⎰'
let g:bufferline_active_buffer_right = '⎱'
" }}}

" Operator Pending mappings {{{
onoremap p i(
onoremap in( :<c-u>normal! f(vi(<cr>
onoremap il( :<c-u>normal! F)vi(<cr>
onoremap in{ :<c-u>normal! f{vi{<cr>
onoremap il{ :<c-u>normal! F}vi{<cr>
" }}}

" Focus Lost settings ---------------------- {{{
augroup focus_lost
  autocmd!
  autocmd FocusLost * silent! :wa
augroup END
" }}}

" Source .vimrc on save ---------------------- {{{
autocmd! bufwritepost .vimrc source $MYVIMRC
" }}}

" JavaScript file settings {{{
augroup javascript
  autocmd!
  autocmd FileType javascript nnoremap <buffer> <localleader>c I//<esc>
  autocmd FileType javascript :iabbrev <buffer> iff if ()<left>
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
" }}}

" Corona SDK settings {{{
nnoremap <leader>rc :!/Applications/CoronaSDK/simulator -project %:p -skin iPhone<cr>
nnoremap <leader>rC :!/Applications/CoronaSDK/simulator -project %:p -skin iPad<cr>
" }}}

" NERDTree settings {{{
let NERDTreeBookmarksFile=expand("$HOME/.vim/NERDTreeBookmarks")
let NERDTreeShowBookmarks=1
let NERDTreeShowFiles=1
let NERDTreeShowHidden=1
let NERDTreeQuitOnOpen=1
let NERDTreeHighlightCursorline=1
let NERDTreeMouseMode=2
nnoremap <leader>n :NERDTreeClose<CR>:NERDTreeToggle<CR>
nnoremap <leader>m :NERDTreeClose<CR>:NERDTreeFind<CR>
nnoremap <leader>N :NERDTreeClose<CR>
" }}}

" CtrlP settings {{{
let g:ctrlp_map = '<c-p>'
let g:ctrlp_cmd = 'CtrlP'
set wildignore+=*/tmp/*,*.so,*.swp,*.zip,*.class,*/bower_components/*,*/node_modules/*
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
nnoremap <leader>l :TagbarToggle<cr><C-w>l
"inoremap <leader>l :TagbarToggle<cr><C-w>l
vnoremap <leader>l :TagbarToggle<cr><C-w>l

let g:tagbar_type_objc = {
    \ 'ctagstype' : 'ObjectiveC',
    \ 'kinds'     : [
        \ 'i:interface',
        \ 'I:implementation',
        \ 'p:Protocol',
        \ 'm:Object_method',
        \ 'c:Class_method',
        \ 'v:Global_variable',
        \ 'F:Object field',
        \ 'f:function',
        \ 'p:property',
        \ 't:type_alias',
        \ 's:type_structure',
        \ 'e:enumeration',
        \ 'M:preprocessor_macro',
    \ ],
    \ 'sro'        : ' ',
    \ 'kind2scope' : {
        \ 'i' : 'interface',
        \ 'I' : 'implementation',
        \ 'p' : 'Protocol',
        \ 's' : 'type_structure',
        \ 'e' : 'enumeration'
    \ },
    \ 'scope2kind' : {
        \ 'interface'      : 'i',
        \ 'implementation' : 'I',
        \ 'Protocol'       : 'p',
        \ 'type_structure' : 's',
        \ 'enumeration'    : 'e'
    \ }
\ }
" }}}

" Latex-Suite settings {{{
set grepprg=grep\ -nH\ $*
let g:tex_flavor='latex'
" }}}

" Rainbow Parentheses settings {{{
au VimEnter * RainbowParenthesesToggle
au Syntax * RainbowParenthesesLoadRound
au Syntax * RainbowParenthesesLoadSquare
au Syntax * RainbowParenthesesLoadBraces
" }}}

" NeoVim does not have Ruby support yet {{{
let g:LustyJugglerSuppressRubyWarning = 1
" }}}

" GeekNote settings {{{
nnoremap <leader>gn :Geeknote<cr>
" }}}

" EasyMotion settings {{{
"map <Leader> <Plug>(easymotion-prefix)
"nmap s <Plug>(easymotion-s)
"map / <Plug>(easymotion-sn)
"omap / <Plug>(easymotion-tn)
"map n <Plug>(easymotion-next)
"map N <Plug>(easymotion-prev)
"map <Leader>h <Plug>(easymotion-linebackward)
"map <Leader>j <Plug>(easymotion-j)
"map <Leader>k <Plug>(easymotion-k)
"map <Leader>l <Plug>(easymotion-lineforward)
"let g:EasyMotion_smartcase = 1
"let g:EasyMotion_startofline = 0
" }}}

" incsearch settings {{{
map /  <Plug>(incsearch-forward)
map ?  <Plug>(incsearch-backward)
map g/ <Plug>(incsearch-stay)
" }}}

" Livedown settings {{{
let g:livedown_autorun = 1
" }}}

" Emmet settings {{{
let g:user_emmet_install_global = 0
autocmd FileType html,css EmmetInstall
let g:user_emmet_leader_key='<c-z>'
" }}}

" Syntastic settings {{{
let g:syntastic_c_checkers = ['cppcheck']
" }}}

" Lightline settings {{{
let g:lightline = {
      \   'colorscheme': 'wombat',
      \   'active': {
      \     'left': [
      \       [ 'mode', 'paste' ],
      \       [ 'fugitive', 'filename' ],
      \       [ 'ctrlpmark', 'bufferline' ]
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
      \     'bufferline'  : 'MyBufferline',
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
      let mark = ' '
      let _ = fugitive#head()
      return strlen(_) ? mark._ : ''
    endif
  catch
  endtry
  return ''
endfunction

function! MyFileformat()
  return winwidth(0) > 70 ? &fileformat : ''
endfunction

function! MyFiletype()
  return winwidth(0) > 70 ? (strlen(&filetype) ? &filetype : 'no ft') : ''
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

function! MyBufferline()
  call bufferline#refresh_status()
  let b = g:bufferline_status_info.before
  let c = g:bufferline_status_info.current
  let a = g:bufferline_status_info.after
  let alen = strlen(a)
  let blen = strlen(b)
  let clen = strlen(c)
  let w = winwidth(0) * 4 / 11
  if w < alen+blen+clen
      let whalf = (w - strlen(c)) / 2
      let aa = alen > whalf && blen > whalf ? a[:whalf] : alen + blen < w - clen || alen < whalf ? a : a[:(w - clen - blen)]
      let bb = alen > whalf && blen > whalf ? b[-(whalf):] : alen + blen < w - clen || blen < whalf ? b : b[-(w - clen - alen):]
      return (strlen(bb) < strlen(b) ? '...' : '') . bb . c . aa . (strlen(aa) < strlen(a) ? '...' : '')
  else
      return b . c . a
  endif
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
