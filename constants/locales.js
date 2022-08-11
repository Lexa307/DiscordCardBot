const LOCALES = {
    DropCard__MessageEmbed__got_card_with_name: {
        ru: `Вам выпала карта с названием: `,
        en: `You got a card with the name: `,
    },
    DropCard__MessageEmbed__cards_you_have_now: {
        ru: `Таких карт у вас сейчас: X`,
        en: `Such cards you have now: X`,
    },
    DropCard__MessageEmbed__3_cards_in_a_row1: {
        ru: `Поздравляю, тебе выпало 3 повторки! 👏👏👏 `,
        en: `Congratulations, you have collected 3 identical cards👏👏👏`,
    },
    DropCard__MessageEmbed__3_cards_in_a_row2: {
        ru: `Можешь попытаться выбить еще одну карту прямо сейчас!`,
        en: `You can try to get another card right now!`,
    },
    DropCard__MessageEmbed__cant_get_more_now: {
        ru: `Сейчас у вас не получится получить карту, но вы можете попытать удачу через:`,
        en: `Now you will not be able to get a card, but you can try your luck through:`,
    },
    DropCard__MessageEmbed__hours: {
        ru: `ч`,
        en: `h`,
    },
    DropCard__MessageEmbed__min: {
        ru: `м`,
        en: `m`,
    },
    DropCard__MessageEmbed__sec: {
        ru: `с`,
        en: `s`,
    },
    DropCard__EXPORTS__name: {
        ru: `дайкарту`,
        en: `drop`,
    },
    DropCard__EXPORTS__desc: {
        ru: `Раз в 24 часа рандомная карта помещается вам в инвентарь при использовании этой команды`,
        en: `Once every 24 hours, a random card is placed in your inventory when using this command`,
    },

    Profile__MessageEmbed__wrong_user: {
        ru: `Для просмотра профиля учаcтника необходимо упомянуть только его`,
        en: `To view a participant's profile, you only need to mention him`,
    },
    Profile__MessageEmbed__user_profile: {
        ru: `Профиль участника`,
        en: `Member profile of`,
    },
    Profile__MessageEmbed__cards_fallen_total: {
        ru: ` Сколько всего карт выпало :`,
        en: ` How many cards have fallen out in total :`,
    },
    Profile__MessageEmbed__statistics_of_dropped_cards: {
        ru: ` Статистика выпавших карт :`,
        en: ` Statistics of dropped cards :`,
    },
    Profile__MessageEmbed__collected_non_standard_cards: {
        ru: ` Собрано нестандартных карт :`,
        en: ` Collected non-standard cards :`,
    },
    Profile__MessageEmbed__not_been_opened_yet: {
        ru: ` Сколько карт еще не открыто :`,
        en: ` How many cards have not been opened yet :`,
    },
    Profile__MessageEmbed__fell_out_the_most_times: {
        ru: ` Карта, которая больше всего раз выпала :`,
        en: ` The card that fell out the most times :`,
    },
    Profile__MessageEmbed__no_cards_in_the_inventory: {
        ru: ` на данный момент не имеет карт в инвентаре:`,
        en: ` currently has no cards in the inventory :`,
    },
    Profile__MessageEmbed__of: {
        ru: `из`,
        en: `of`,
    },
    Profile__EXPORTS__name: {
        ru: `профиль`,
        en: `profile`,
    },
    Profile__EXPORTS__desc: {
        ru: `Показывает профиль пользователя, содержащий информацию о статистике выпавших ему карт`,
        en: `Shows the user's profile containing information about the statistics of the cards that fell to him`,
    },

    GiveCard__MessageEmbed__issued_a_card: {
        ru: `Вами была выдана карта с названием: `,
        en: `You have been issued a card with the name: `,
    },
    GiveCard__MessageEmbed__wrong_user: {
        ru: `Для выдачи карты учаcтнику необходимо упомянуть только его`,
        en: `To give card to participant, you only need to mention him `,
    },
    GiveCard__EXPORTS__name: {
        ru: `выдайкарту`,
        en: `giveacard`,
    },
    GiveCard__EXPORTS__desc: {
        ru: `Выдает карту указанному пользователю :warning: `,
        en: `Issues the card to the specified user :warning: `,
    },

    ActivateCode__MessageEmbed__code_expired: {
        ru: `Время действия введенного кода истекло`,
        en: `The entered code has expired`,
    },
    ActivateCode__MessageEmbed__exceeded_number_uses: {
        ru: `превышено количество использований введенного вами кода`,
        en: `exceeded the number of uses of the code you entered`,
    },
    ActivateCode__MessageEmbed__already_used: {
        ru: `Вами уже был использован данный код`,
        en: `You have already used this code`,
    },
    ActivateCode__MessageEmbed__code: {
        ru: `код: `,
        en: `code: `,
    },
    ActivateCode__MessageEmbed__activated: {
        ru: ` успешно активирован!`,
        en: ` has been successfully activated!`,
    },
    ActivateCode__EXPORTS__name: {
        ru: `активируй`,
        en: `activate`,
    },
    ActivateCode__EXPORTS__desc: {
        ru: `Активирует эвентовый код позволяющий получить шанс на крутку`,
        en: `Activates an event code that allows you to get a chance to spin`,
    },

    CreateCode__MessageEmbed__created_code_with_name: {
        ru: `Вами был создан код с названием: `,
        en: `You have created a code with the name: `,
    },
    CreateCode__MessageEmbed__able_to_use_it: {
        ru: `Использовать его смогут `,
        en: `Count of users able to use it: `,
    },
    CreateCode__MessageEmbed__unlimited_quantity: {
        ru: `неограниченное количество`,
        en: `unlimited`,
    },
    CreateCode__MessageEmbed__just_unlimited: {
        ru: `неограничено`,
        en: `unlimited`,
    },
    CreateCode__MessageEmbed__users: {
        ru: `пользователей`,
        en: ``,
    },
    CreateCode__MessageEmbed__code_expiration_date: {
        ru: `Дата истечения работы кода: `,
        en: `Code expiration date:`,
    },
    CreateCode__EXPORTS__name: {
        ru: `создатькод`,
        en: `createcode`,
    },
    CreateCode__EXPORTS__desc: {
        ru: `Создает код, который можно активировать для получения возможности крутки карт :warning:`,
        en: `Creates a code that can be activated to get the ability to twist cards:warning:`,
    },

    DeleteCard__MessageEmbed__deleted_card_with_name: {
        ru: `Вами была удалена карта с текущим названием: `,
        en: `You have deleted a card with the current name:`,
    },
    DeleteCard__MessageEmbed__deleted_card_with_name: {
        ru: `Вами была удалена карта с текущим названием: `,
        en: `You have deleted a card with the current name:`,
    },
    DeleteCard__MessageEmbed__card_not_found: {
        ru: `Не найдено указанной карты!`,
        en: `The specified card was not found!`,
    },
    DeleteCard__MessageEmbed__mandatory_argument: {
        ru: `Для функции требуется 1 обязательный аргумент - полное название карты!`,
        en: `The function requires 1 mandatory argument - the full name of the card!`,
    },
    DeleteCard__EXPORTS__name: {
        ru: `удалитькарту`,
        en: `deletecard`,
    },
    DeleteCard__EXPORTS__desc: {
        ru: `Удаляет карту из общего пула и у всех пользователей :warning:`,
        en: `Removes the card from the shared pool and from all users :warning:`,
    },

    AddNewCard__MessageEmbed__added_card_with_name: {
        ru: `Вами была добавлена карта с названием: `,
        en: `You have added a card with the name: `,
    },
    AddNewCard__MessageEmbed__name_already_exists: {
        ru: `Такое название карты уже существует!`,
        en: `This cardname already exists!`,
    },
    AddNewCard__MessageEmbed__class_number: {
        ru: `Класс карты должен быть числом!`,
        en: `The card class must be a number!`,
    },
    AddNewCard__MessageEmbed__media_not_found: {
        ru: `Не указана ссылка на изображение и не найдено вложенного файла`,
        en: `The link to the image is not specified or the attached file is not found`,
    },
    AddNewCard__MessageEmbed__media_incorrect: {
        ru: `Неправильно указана ссылка на изображение | неверный прикреплекнный файл`,
        en: `The link to the image is incorrect | the attached file is incorrect`,
    },
    AddNewCard__EXPORTS__name: {
        ru: `новаякарта`,
        en: `addcard`,
    },
    AddNewCard__EXPORTS__desc: {
        ru: `Добавляет новую карту в пул карточек которые могут выпадать игрокам :warning:`,
        en: `Adds a new card to the pool of cards that can fall to players :warning:`,
    },

    EditCard__MessageEmbed__edited_card_with_name: {
        ru: `Вами была изменена карта с текущим названием: `,
        en: `You have changed a card with the name: `,
    },
    EditCard__MessageEmbed__class_number: this.AddNewCard__MessageEmbed__class_number,
    EditCard__MessageEmbed__media_not_found: this.AddNewCard__MessageEmbed__media_not_found,
    EditCard__MessageEmbed__media_incorrect: this.AddNewCard__MessageEmbed__media_incorrect,
    EditCard__EXPORTS__name: {
        ru: `изменитькарту`,
        en: `editcard`,
    },
    EditCard__EXPORTS__desc: {
        ru: `Меняет данные карточки в системе :warning:`,
        en: `Changes card data in the system :warning:`,
    },

    ResetDrop__MessageEmbed__specify_user: {
        ru: `Укажите пользователя используя @`,
        en: `Specify the user using @`,
    },
    ResetDrop__MessageEmbed__to_all_users: {
        ru: `всех пользователей!`,
        en: `all users!`,
    },
    ResetDrop__MessageEmbed__updated_drops: {
        ru: `Вами были обновлены крутки для`,
        en: `You have updated the drops for `,
    },
    ResetDrop__EXPORTS__name: {
        ru: `обновикрутки`,
        en: `resetdrop`,
    },
    ResetDrop__EXPORTS__desc: {
        ru: `Обнуляет счетчик круток всем/указанному пользователю :warning: `,
        en: `Resets the drops to all/specified user :warning:`,
    },

    ShowCards__MessageEmbed__no_cards: {
        ru: `Пока что у вас нет ни одной выбитой карты в инвентаре.`,
        en: `You don't have a single knocked-out card in your inventory.`,
    },
    ShowCards__MessageEmbed__cards_in_inventary1: {
        ru: `Вот что у `,
        en: `That's what `,
    },
    ShowCards__MessageEmbed__cards_in_inventary2: {
        ru: `вас`,
        en: `you`,
    },
    ShowCards__MessageEmbed__cards_in_inventary3: {
        ru: ` в инвентаре:`,
        en: `have:`,
    },
    ShowCards__MessageEmbed__page: {
        ru: ` страница `,
        en: `page`,
    },
    ShowCards__MessageEmbed__inventory_is_over: {
        ru: `Время действия инвентаря закончилось`,
        en: `Inventory expiration time is over`,
    },
    ShowCards__MessageEmbed__incorrect_user: {
        ru: `Для просмотра инвентаря участника необходимо упомянуть только его`,
        en: `To view the participant's inventory, you only need to mention him`,
    },
    ShowCards__MessageEmbed__access_denied: {
        ru: `Вы не можете посмотреть инвентарь участника пока он сам его не откроет при вас`,
        en: `You cannot view the participant's inventory until he opens it in chat to you`,
    },
    ShowCards__MessageEmbed__no_cards2: {
        ru: `у участника`,
        en: `the user does not`,
    },
    ShowCards__MessageEmbed__no_cards3: {
        ru: `у вас`,
        en: `you don't`,
    },
    ShowCards__MessageEmbed__no_cards4: {
        ru: `нет ни одной выбитой карты в инвентаре.`,
        en: `have a card in inventory.`,
    },
    ShowCards__EXPORTS__name: {
        ru: `покажимне`,
        en: `show`,
    },
    ShowCards__EXPORTS__desc: {
        ru: `Показывает карты, находящиеся у вас или у @UserMention в инвентаре`,
        en: `Shows the cards that you or @UserMention have in inventory`,
    },

    Undiscovered__MessageEmbed__no_cards_in_base: {
        ru: `Сначала добавьте карты в базу, перед тем как заставлять меня считать то, чего нет!`,
        en: `First add the cards to the database before forcing me to count what is not there!`,
    },
    Undiscovered__MessageEmbed__no_users: {
        ru: `Не у кого считать карты!`,
        en: `There is no one to count the cards!`,
    },
    Undiscovered__MessageEmbed__cards_untouched: {
        ru: `На данный момент количество карт, которых не повидал сервер: `,
        en: `At the moment, the number of cards that the server has not seen: `,
    },
    Undiscovered__EXPORTS__name: {
        ru: `неисследовано`,
        en: `undiscovered`,
    },
    Undiscovered__EXPORTS__desc: {
        ru: `Показывает количество карт, которых нет ни у одного из участников`,
        en: `Shows the number of cards that none of the participants have`,
    },

    FindCardByName__MessageEmbed_one_more_card_exist: {
        ru: `Уточните название карты тк есть больше одного совпадения`,
        en: `Specify the full name of the card, there is more than one match`,
    },
    FindCardByName__MessageEmbed_no_similar_name_found: {
        ru: `Не найдено похожего названия`,
        en: `No similar name found`,
    },
    RegisterUser__MessageEmbed_registered: {
        ru: `зарегистрирован`,
        en: `registered`,
    },
    UserCheck__MessageEmbed_db_error: {
        ru: `Ошибка чтения базы`,
        en: `Database reading error`,
    },
    Help__MessageEmbed_commands: {
        ru: `Команды бота`,
        en: `Bot Commands`,
    },
    Help__EXPORTS__name: {
        ru: `помощь`,
        en: `help`,
    },
    Help__EXPORTS__desc: {
        ru: `Показывает какие команды имеются у бота`,
        en: `Shows which commands the bot has`,
    },
}

module.exports = LOCALES;