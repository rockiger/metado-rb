import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg-color: hsl(0, 0%, 100%);
    --bg-color-secondary: hsl(240, 14%, 96%); /* secondary */
    --border: 1px solid var(--border-color);
    --border-color: rgba(34,36,38,.15);
    --border-radius: 4px;
    --box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2);
    --color-darkGrey: hsl(216, 4%, 26%); /* tertiary */
    --color-error: hsl(0, 64%, 53%);
    --color-grey: hsl(231, 5%, 48%); /* quaternary */
    --color-lightGrey: hsl(218, 14%, 85%); /* quinary */
    --color-link: hsl(221, 100%, 54%);
    --color-primary: hsl(221, 100%, 64%);
    --color-secondary: hsl(348, 95%, 68%)
    --color-success: hsl(113, 81%, 41%);
    --color-tertiary: hsl(36, 99%, 65%);
    --font-family: 'Lato', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    --font-size: 1.6rem;
    --grid-maxWidth: 120rem;
    --grid-gutter: 2rem;
    --padding-horizontal: 4.2rem;
    --padding-dialog: 1.8rem 2.2rem;
    --padding-vertical: 0;
    --color-text: hsl(207, 10%, 42%);
    --transition: background-color .1s ease,opacity .1s ease,color .1s ease,box-shadow .1s ease,-webkit-box-shadow .1s ease;
}
  }

  /* Base
   * ––––––––––––––––––––––––––––––––––––––––––––––––––
   * Set box-sizing globally to handle padding and border widths
   */
  *,
  *:after,
  *:before {
    box-sizing: inherit;
  }

  /* The base font-size is set at 62.5% for having the convenience
  * of sizing rems in a way that is similar to using px: 1.6rem = 16px
  */
  html {
    box-sizing: border-box;
    font-size: 62.5%;
  }
  
  /* Default body styles */
  body {
    color: var(--color-text);
    font-family: var(--font-family);
    font-size: 1.6em;  /* Currently ems cause chrome bug misinterpreting rems on body element */
    font-weight: 300;
    height: 100%;
    letter-spacing: .01em;
    line-height: 1.6;
    width: 100%;
  }

  #root {
    min-height: 100%;
    min-width: 100%;
  }

  b,
strong {
	font-weight: bold;
}

p {
	margin-top: 0;
}

a {
	color: var(--color-link);
	text-decoration: none;
}

a:focus, a:hover {
	color: var(--color-darkGrey);
}

h1,
h2,
h3,
h4,
h5,
h6 {
	font-weight: 300;
	letter-spacing: -.1rem;
	margin-bottom: 2.0rem;
	margin-top: 0;
}

h1 {
	font-size: 4.6rem;
	line-height: 1.2;
}

h2 {
	font-size: 3.6rem;
	line-height: 1.25;
}

h3 {
	font-size: 2.8rem;
	line-height: 1.3;
}

h4 {
	font-size: 2.2rem;
	letter-spacing: -.08rem;
	line-height: 1.35;
}

h5 {
	font-size: 1.8rem;
	letter-spacing: -.05rem;
	line-height: 1.5;
}

h6 {
	font-size: 1.6rem;
	letter-spacing: 0;
	line-height: 1.4;
}

blockquote {
	border-left: .3rem solid var(--bg-secondary-color);
	margin-left: 0;
	margin-right: 0;
	padding: 1rem 1.5rem;
}

blockquote *:last-child {
	margin-bottom: 0;
}

.button,
button,
input[type='button'],
input[type='reset'],
input[type='submit'] {
	background-color: var(--color-primary);
	border: 0.1rem solid var(--color-primary);
	border-radius: .4rem;
	color: var(--bg-color);
	cursor: pointer;
	display: inline-block;
	font-size: 1.1rem;
	font-weight: 700;
	height: 3.8rem;
	letter-spacing: .1rem;
	line-height: 3.8rem;
	padding: 0 3.0rem;
	text-align: center;
	text-decoration: none;
	text-transform: uppercase;
	white-space: nowrap;
}

.button:focus, .button:hover,
  button:focus,
  button:hover,
  input[type='button']:focus,
  input[type='button']:hover,
  input[type='reset']:focus,
  input[type='reset']:hover,
  input[type='submit']:focus,
  input[type='submit']:hover {
	background-color: var(--color-lightGrey);
	border-color: var(--color-lightGrey);
	color: var(--color-primary);
	outline: 0;
}

.button[disabled],
  button[disabled],
  input[type='button'][disabled],
  input[type='reset'][disabled],
  input[type='submit'][disabled] {
	cursor: default;
	opacity: .5;
}

.button[disabled]:focus, .button[disabled]:hover,
    button[disabled]:focus,
    button[disabled]:hover,
    input[type='button'][disabled]:focus,
    input[type='button'][disabled]:hover,
    input[type='reset'][disabled]:focus,
    input[type='reset'][disabled]:hover,
    input[type='submit'][disabled]:focus,
    input[type='submit'][disabled]:hover {
	background-color: var(--color-primary);
	border-color: var(--color-primary);
}

.button.button-outline,
  button.button-outline,
  input[type='button'].button-outline,
  input[type='reset'].button-outline,
  input[type='submit'].button-outline {
	background-color: transparent;
	color: var(--color-primary);
}

.button.button-outline:focus, .button.button-outline:hover,
    button.button-outline:focus,
    button.button-outline:hover,
    input[type='button'].button-outline:focus,
    input[type='button'].button-outline:hover,
    input[type='reset'].button-outline:focus,
    input[type='reset'].button-outline:hover,
    input[type='submit'].button-outline:focus,
    input[type='submit'].button-outline:hover {
	background-color: transparent;
	border-color: var(--color-lightGrey);
	color: var(--color-text);
}

.button.button-outline[disabled]:focus, .button.button-outline[disabled]:hover,
    button.button-outline[disabled]:focus,
    button.button-outline[disabled]:hover,
    input[type='button'].button-outline[disabled]:focus,
    input[type='button'].button-outline[disabled]:hover,
    input[type='reset'].button-outline[disabled]:focus,
    input[type='reset'].button-outline[disabled]:hover,
    input[type='submit'].button-outline[disabled]:focus,
    input[type='submit'].button-outline[disabled]:hover {
	border-color: inherit;
	color: var(--color-primary);
}

.button.button-clear,
  button.button-clear,
  input[type='button'].button-clear,
  input[type='reset'].button-clear,
  input[type='submit'].button-clear {
	background-color: transparent;
	border-color: transparent;
	color: var(--color-primary);
}

.button.button-clear:focus, .button.button-clear:hover,
    button.button-clear:focus,
    button.button-clear:hover,
    input[type='button'].button-clear:focus,
    input[type='button'].button-clear:hover,
    input[type='reset'].button-clear:focus,
    input[type='reset'].button-clear:hover,
    input[type='submit'].button-clear:focus,
    input[type='submit'].button-clear:hover {
	background-color: var(--color-lightGrey);
	border-color: transparent;
	color: var(--color-darkGrey);
}

.button.button-clear[disabled]:focus, .button.button-clear[disabled]:hover,
    button.button-clear[disabled]:focus,
    button.button-clear[disabled]:hover,
    input[type='button'].button-clear[disabled]:focus,
    input[type='button'].button-clear[disabled]:hover,
    input[type='reset'].button-clear[disabled]:focus,
    input[type='reset'].button-clear[disabled]:hover,
    input[type='submit'].button-clear[disabled]:focus,
    input[type='submit'].button-clear[disabled]:hover {
	color: var(--color-primary);
}

code {
	background: var(--bg-color-secondary);
	border-radius: .4rem;
	font-size: 86%;
	margin: 0 .2rem;
	padding: .2rem .5rem;
	white-space: nowrap;
}

pre {
	background: var(--bg-color-secondary);
	border-left: 0.3rem solid var(--color-primary);
	overflow-y: hidden;
}

pre > code {
	border-radius: 0;
	display: block;
	padding: 1rem 1.5rem;
	white-space: pre;
}

hr {
	border: 0;
	border-top: 0.1rem solid var(--border-color);
	margin: 3.0rem 0;
}


img {
  max-width: 100%;
}

input[type='color'],
input[type='date'],
input[type='datetime'],
input[type='datetime-local'],
input[type='email'],
input[type='month'],
input[type='number'],
input[type='password'],
input[type='search'],
input[type='tel'],
input[type='text'],
input[type='url'],
input[type='week'],
input:not([type]),
textarea,
select {
	-webkit-appearance: none;
	background-color: transparent;
	border: 0.1rem solid var(--border-color);
	border-radius: .4rem;
	box-shadow: none;
	box-sizing: inherit;
  font-family: var(--font-family);
	height: 3.8rem;
	padding: .6rem 1.0rem .7rem;
	width: 100%;
}

input[type='color']:focus,
  input[type='date']:focus,
  input[type='datetime']:focus,
  input[type='datetime-local']:focus,
  input[type='email']:focus,
  input[type='month']:focus,
  input[type='number']:focus,
  input[type='password']:focus,
  input[type='search']:focus,
  input[type='tel']:focus,
  input[type='text']:focus,
  input[type='url']:focus,
  input[type='week']:focus,
  input:not([type]):focus,
  textarea:focus,
  select:focus {
	border-color: var(--color-primary);
	outline: 0;
}

select {
	background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 8" width="30"><path fill="var(--color-grey)" d="M0,0l6,8l6-8"/></svg>') center right no-repeat;
	padding-right: 3.0rem;
}

select:focus {
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 8" width="30"><path fill="var(--color-primary)" d="M0,0l6,8l6-8"/></svg>');
}

select[multiple] {
	background: none;
	height: auto;
}

textarea {
	min-height: 6.5rem;
}

label,
legend {
	display: block;
	font-size: 1.6rem;
	font-weight: 700;
	margin-bottom: .5rem;
}

fieldset {
	border-width: 0;
	padding: 0;
}

input[type='checkbox'],
input[type='radio'] {
	display: inline;
}

.label-inline {
	display: inline-block;
	font-weight: normal;
	margin-left: .5rem;
}

dl,
ol,
ul {
	list-style: none;
	margin-top: 0;
	padding-left: 0;
}

dl dl,
  dl ol,
  dl ul,
  ol dl,
  ol ol,
  ol ul,
  ul dl,
  ul ol,
  ul ul {
	font-size: 90%;
	margin: 1.5rem 0 1.5rem 3.0rem;
}

ol {
	list-style: decimal inside;
}

ul {
	list-style: circle inside;
}

.button,
button,
dd,
dt,
li {
	margin-bottom: 1.0rem;
}

fieldset,
input,
select,
textarea {
	margin-bottom: 1.5rem;
}

blockquote,
dl,
figure,
form,
ol,
p,
pre,
table,
ul {
	margin-bottom: 2.5rem;
}

table {
	border-spacing: 0;
	display: block;
	overflow-x: auto;
	text-align: left;
	width: 100%;
}

td,
th {
	border-bottom: 0.1rem solid var(--color-lightGray);
	padding: 1.2rem 1.5rem;
}

td:first-child,
  th:first-child {
	padding-left: 0;
}

td:last-child,
  th:last-child {
	padding-right: 0;
}

@media (min-width: 40rem) {
	table {
		display: table;
		overflow-x: initial;
	}
}
`;
