This page represents the front end of a bigger web application.  
Its purpose is to emulate the deployment phase of the development process,  
together with the other elements that constitute the  application (server and database).  
This instance of the application didn't work for the longest time, but now it does!  
The real challenge was to have it done for free, but I learned a lot along the way.  
The project is huge right now (horizontally, that is). The apps, although nice, are only an excuse.

It has a browser-recognized SSL certificate, environment-specific configurations, standardized git flows, HTTP filters and validation,  
decent error handling, build scripts and it is deployed in two different web servers (Linux and Windows) and a Linux Virtual machine  
and two different databases (MySQL and SQLServer), as well as installed separately on my phone as Cordova-wrapped Android apps,  
although I'm not sure if I want to commit to the $25 fee to deploy at the app store yet.  
My free Azure services don't provide enough computing power to handle actual traffic anyway, and will soon expire.

The calculator app can persist text (on invalid expression), so read the last message and send a new one!

I've added a stupid serverless Secret Santa raffler to play with my co-workers now that Christmas is coming.  
The cool part is that it guarantees a single cycle (reminded me of that one Futurama episode), so it's more fun this way.

I've also added a very fancy Sudoku generator and solver, which requires server computing!  
The generated sudokus have at least 17 clues, so they are supposed to have exactly one solution.  
The program can import others with a similar format to [this](https://projecteuler.net/project/resources/p096_sudoku.txt), and will attempt to store them in a database.  
The solution is generated serverside, so no cheating allowed!

There's also a <s>small</s> Rubik's cube (and other types of puzzles alike) timer to use on the train on my way to work because  
I was annoyed at ads, repeated scrambles and other issues with the Android app store apps.  
As the Secret Santa app, it is completely serverless and very convenient to use as a timer + scramble generator + stats tracker app.  
Stats and times are clickable for detailed info and deletion respectively.

I've now added a shopping app. It uses Cookies for authorization as well as for some database querying:  
There are two groups of records, one for the "default" user, and one for me, so I can actually use it as a shopping list.  
The categories are not sorted by name but by ID, so to match my usual supermarket distribution.  
The hardest part to do was easily the category select, since I built it on my own in a hacky way.  
I do not own any of the icons shown in the table.

This message is a react component that parses the readme of this branch of the repository into HTML.

Refer to [this page](https://github.com/Lucas1774/Web-app) for more information.
