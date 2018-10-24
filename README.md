# VerySmug
A simple discord bot, which checks all the messages from the server, that it's in and stores quotes written in format: "**quote**" ~**author**.
The quotes are connected to the server from which they were read.

## Options

* '**quote**' ~**author** - saves a quote under given author (**author** can be any of author's aliases)
* &quote **author** / &q **author** - returns a random quote from the author and the server the command is written from
* &authors / &a - returns all authors, that have quotes on the server
* &all **author** - returns all quotes from that author
* &aliases **author** - returns author's aliases, where **author** is any of the author's aliases
* &alias **author**, **newAlias** - sets a new alias for **author**
* &dq **quoteId** - deletes the quote
* &da **authorId** - deletes the author and author's quotes
* &dl **alias** - deletes author's alias

### NSFW

* &i **tag** - returns a random image with given tag
* &i **tag** - returns a SFW random image with given tag
* &hentaibomb - returns 10 random NSFW images

## Author
[Paweł Mendroch](https://github.com/FrozenTear7), under MIT license
