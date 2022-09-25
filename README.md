# DiscordCardBot
A simple bot that allows you to collect cards by server participants.
[Project Setup](#Project-Setup) [ru-README](./RU-README.md)
## Description
Commands available to discord server participants:
 - [drop](#drop) : get a card 1 time in 24 hours or view after how long it can be received
 - [show](#show) : view the list and number of cards of the same type that user has already received
 - [profile](#profile) : view statistics of the server user on the drawn cards
 - [help](#help) : get help about bot commands
 - [undiscovered](#undiscovered) : find out the number of cards that have not fallen to any of the server participants
 - [giveacard](#giveacard) : issue 1 card to the specified user
 - [activate](#activate-Code) : activate the code for a chance to get the card again
 - [createcode](#createcode) : create a code that users can use to be able to get a card
 - [deletecard](#deletecard-CardName) : remove the card from the system and from all users
 - [addcard](#addcard) : add a new card to the card drop pool
 - [editcard](#editcard) : change an existing map in the system and for all users
 - [resetdrop](#resetdrop) : cooldown reset of drop for everyone or a specific user
### drop
Drops a random card from the pool of cards existing in the system 1 time every 24 hours or 1 time a day at a certain time, depending on the bot settings.
This command has a mechanic in which if the user receives the 3rd repeating card, the system gives a chance to use this command again.
![](https://cdn.discordapp.com/attachments/852679774128439386/1008477525267198014/unknown.png)
### show [@UserMention]
When entering a command without arguments, it shows the inventory of the user - the author of the message.

When adding a user mention as an argument (via @), the inventory of the specified user will be shown (provided that the admin has enabled this feature in the config: INVENTORY_PUBLIC_ACCESS = 1 )

![](https://cdn.discordapp.com/attachments/852679774128439386/1008502106547818636/unknown.png)

The inventory has a page interface, where the pages are changed by adding the reactions of arrows ( ⬅️ and ➡️ ) that the bot offers, the pages change only if the response under the message with the inventory was left by the author of the sent command.
After some time (which is configured in the config: **INVENTORY_TIME**), when the inventory is inactive, there is no active page switching, the inventory stops working, and in order to view it again, you need to enter the necessary command again. 
 
### profile [@UserMention]
Shows the profile of the specified user or the author of the message with statistics of the collected cards for all time.

![](https://media.discordapp.net/attachments/852679774128439386/1008503033279299625/unknown.png) 
 
### help
Displays a list of all commands available to the author of the message.
If the server administrator has requested help, the bot will display an expanded list of commands.

![](https://media.discordapp.net/attachments/852679774128439386/1008503228532543558/unknown.png)

### undiscovered 
Displays the number of cards that none of the registered participants have.

![](https://cdn.discordapp.com/attachments/852679774128439386/1008503947549495376/unknown.png)

### giveacard @UserMention CardName
Gives the specified user a card found by the entered name (or part of the name).

The command can be used **only by the server administrator**. To use this function, you need 2 required arguments:
 - @UserMention: the user to whom the card will be issued
 - CardName: the name of the card that will be issued in the amount of 1 to the user. This argument can take an incomplete name of the card, the system will find the most suitable one by the entered name of the card

![](https://cdn.discordapp.com/attachments/852679774128439386/1008505520358948985/unknown.png)

### activate Code
Activation of the code created by the administrator, upon successful activation by the user, resets his cooldown for using the **drop** command

![](https://cdn.discordapp.com/attachments/852679774128439386/1008507041159057428/unknown.png)

### createcode [-c] [-u] [-d]
Creates a special code that users can activate to be able to reset the cooldown of the **drop command**
This command can only be used by the administrator, while 3 optional parameters are available to him for use, which can be used in any order to set restrictions on the use of the code:
 - -cCodeName : custom code name
 - -uUsingCount : the number of unique users who can use the code
 - -dmm/dd/yyyy : the expiration date of the code, after which users will not be able to use it

![](https://media.discordapp.net/attachments/852679774128439386/1008506789672779826/unknown.png)

By default, an automatically generated code is created with no expiration date for 1 use.

![](https://cdn.discordapp.com/attachments/852679774128439386/1008507346982547466/unknown.png)

### deletecard CardName
The admin command that removes the specified card from the system and from all users.

This command requires 1 mandatory argument - **the full name of the card.**

![](https://cdn.discordapp.com/attachments/852679774128439386/1008512987608403998/unknown.png)

**If there is a space in the name of the card, then use ";" instead, because the space is used to separate arguments.**

### addcard CardName ClassNumber [ImageSourceLink]
The server admin can create a new card that is automatically placed in the card drop pool.
Command arguments:
 - CardNameCardName **name of the new card**, (required) - must not match the existing name of the card in the database, use the **SPACE_SYMBOL** symbol to add a space
 - ClassNumber **card class**, (required) it should be a number from 1 to 5 - standard classes of cards, other values will make a card of a non-standard class
 - ImageSourceLink **link to the picture .png .jpg .gif**, a mandatory argument that can be omitted provided that a picture is attached to the message of this command in the attachment.

![](https://media.discordapp.net/attachments/852679774128439386/1008514371703541780/unknown.png)
 
 ### editcard CardName editCardName editClassNumber [editImageSourceLink]
A command accessible only to the administrator, created to change the data of existing maps, requires the following arguments:
 - CardName (required) - full name of the card to be changed
 - editCardName (required) - the new name of the card, if you do not want to change, insert the one that is (a reminder to use **SPACE_SYMBOL** instead of a space)
 - editClassNumber - (required) new card class, must be a number
 - editImageSourceLink (required) - new image (link to image) to display

![](https://media.discordapp.net/attachments/852679774128439386/1008515485215764480/unknown.png)

 ### resetdrop [@UserMention]
Resets the cooldown of the **drop** command for all users or only the specified one. (Available only to the administrator)

![](https://media.discordapp.net/attachments/852679774128439386/1008515882055651358/unknown.png)

## News
 **a small update from 09.25.2022**
 - Added option for replacing ' ' in commands: **SPACE_SYMBOL** , before it was ';' by default
 For example to add Card with name that contains ' ' in name you can use your own different symbol(s) (not allowed symbols that using as args separator):
 in .env file **SPACE_SYMBOL = "__"**
 ```
 !addcard Hello__world 2 https://c.tenor.com/mGgWY8RkgYMAAAAC/hello-world.gif // cardname in DB: "Hello world"
 ```

 **Major update from 08.11.2022**
 - Added administration of cards using commands (add, change and delete)
 - Added the ability to select a language and add your own localization, now the bot supports Russian and English.
 - Added the ability to create/activate special codes that users can use to get one more card
 - Added the function of reseting the cooldown of issuing cards to all users or to some specific
 - Fixed errors with user registration and caused the bot to stop working, added new ones)
 - Added display of the number of non-standard cards in the user profile
 - When receiving a card, it is now indicated how many of the same the user has in the inventory


 **feature from 09.12.2021**
 - now you can set the server time at which the timer of all users to receive the card (**drop**) is reset.

 **update from 11/30/2021**
 - Links are embedded in the name of the cards, which allows you to use urls of any length without spoiling the type of message.
 - Fixed a bug where the value (**class**) of cards with symbols/emojis in **show me** was not displayed.
 - Removed the url display in **profile** (now the link is in the name of the map).
 - Changed the appearance for **drop**.

![](https://media.discordapp.net/attachments/852679774128439386/915276541347381268/drop.png)

 - Changed the appearance for **show**.

![](https://media.discordapp.net/attachments/852679774128439386/915276541573881896/покажимне.png)

 - Added the ability to view someone else's inventory (**show me @UserMention**), provided that this function is allowed (by the parameter in the config **INVENTORY_PUBLIC_ACCESS = 1**).

 **a small update from 11.21.2021**
 - Added test cards to **db.json** for an example of adding them.

![](https://cdn.discordapp.com/attachments/852679774128439386/911969469914574939/unknown.png)

 - Added display of the number of cards of each class when viewing the profile (**profile**).

![](https://cdn.discordapp.com/attachments/852679774128439386/911967665906651166/unknown.png)

 **feature from 06.10.2021**
 - Added the **undiscovered** command. Displays the number of cards that no one has been able to get on the server yet.

![](https://cdn.discordapp.com/attachments/852679774128439386/895117207615471666/unknown.png)

 **feature from 09.26.2021**
 - added the **profile** [@UserMention] command. Displays a user profile containing information:
 - how many cards have fallen out in total;
 - how many cards of a certain class have fallen out;
 - the number of cards that the user has not opened yet;
 - the card that fell out the most times.
 - added fields for cards: **class** (card class), designed to determine the value /rarity of the card.

 **a small update from 08.04.2021**
 - When viewing the inventory, not only the current page is now shown, but also how many pages are available in total.
 - When the inventory expires, all reactions attached to the message are deleted.

 **feature from 31.07.2021**
 - In order not to exceed the maximum number of characters in the message, a "page" inventory was introduced for the Discord API:
after entering the command about the show inventory request, the bot shows you the last inventory page, which contains your recently received collectible cards. You can flip through the inventory pages using the reactions ( ⬅️ and ➡️ ) in the message with your cards. Keep in mind, the bot will not wait indefinitely for you to scroll through the page, after a while it will stop responding to new reactions, and you will have to request inventory with the command again.

**feature from 11.06.2021**
- When receiving the same card every 3rd time, the server participant is given the opportunity to immediately try to knock out another card.
- Now, when a person uses the command to receive a card, 24 hours have not passed since the last receipt, the bot will show how long the card will be available.

## Project Setup
1. **Clone the project.**

2. **Make sure that you have installed:**
 - ![Node.js](https://nodejs.org/en/) 10.0.0 or higher.

3. **Create a configuration file and enter the necessary information into it.**

### Creating a config
In the root of the project, create a configuration file **.env**
Example of the .env file :
```
TOKEN = "your bot token"
PREFIX = '!' 
PAGE_SIZE = 7
INVENTORY_TIME = 60000
INVENTORY_PUBLIC_ACCESS = 1
RARE_CLASS_NUMBER = 5
CLASS_SYMBOL_FILL = ":star:"
CLASS_SYMBOL_OF_VOID = ":small_orange_diamond:"
RESET_LOCAL_TIME = ""
SPACE_SYMBOL = "__"
LOCALES = "en"
```

**PAGE_SIZE** - the number of items that will fit on one inventory page when displayed

**INVENTORY_TIME** - the idle time of the inventory, after which the bot stops flipping pages, is indicated in milliseconds

**INVENTORY_PUBLIC_ACCESS** - access to another user's inventory **1 - you can use show @UserMention, 0 - other users can only show their inventory themselves in the chat**

**RESET_LOCAL_TIME** - the local time of the server during which the timer is reset for **drop** to all users at the same time. Field value format: **"hh:mm:ss"**, for example **RESET_LOCAL_TIME** = "16:45:00". If **""** - then when using **drop**, the bot will set the reset time for each user individually.

**LOCALES** - setting up the localization of the bot en - English, ru - Russian

**SPACE_SYMBOL** - Symbol(s) should use instead of SPACE in commands, because ' ' by default is using for splitting arguments

**RARE_CLASS_NUMBER** - number of rarity/value classes

**CLASS_SYMBOL_FILL** - Discord emoji to fill in the rarity/value scale

**CLASS_SYMBOL_OF_VOID** - Discord emoji to fill the void of the rarity/value scale



The illustration below is to understand the essence of the last 3 parameters:

![](https://media.discordapp.net/attachments/852679774128439386/891748889118511134/env_decr.png)

4. **Add the necessary content for your server.**

### Content preparation
Open /storage/db.json
```
{
	"users": [], // Contains data of server participants and their inventory 
	"cards": [], // Contains data about cards that may fall out on the server
	"codes": [], // Contains information about event codes for users
}
```

Data about server users ** will be automatically added** as the bot commands are used.
You ** can fill in the card data by yourself**.
Example of adding a map to **db.json**
```
cards: [
    {
        "name": "test_card", // Name of the card
        "class": 1, // the value of the card is determined from 1 to RARE_CLASS_NUMBER inclusive
        "active": true, // Flag that determines whether the card can fall to the server participants
        "url": "url_string.png"  // Link to the card image
    }, 
]
```

If you have only cloned the project, then you may find that in **db.json** already has information about test cards with a rarity from 1 to 6 where cards with **class from 1 to 5 are standard** and the one with **class 6 is non-standard** (Which means its value will not be displayed using **CLASS_SYMBOL_FILL** and **CLASS_SYMBOL_OF_VOID**, keep this in mind, if you want to somehow mark its value with symbols/emojis, you can write them in the card name field, as in **db.json** of the repository).  

5. **Download the necessary modules for the project to work.**

### Download dependencies
Open the terminal in the root of the project, then write the following commands:
```
npm i 
```
6. **After all the steps have been successfully completed, you can start the bot by writing a command in the terminal.**
### Project launch
```
npm start 
```