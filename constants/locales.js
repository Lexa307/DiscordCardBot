const LOCALES = {
    DropCard__MessageEmbed__got_card_with_name: {
        ru: `Вам выпала карта с названием: `,
        en: `You got a card with the name: `,
        jp: `あなたはカードを在ります: `,
    },
    DropCard__MessageEmbed__cards_you_have_now: {
        ru: `Таких карт у вас сейчас: X`,
        en: `Such cards you have now: X`,
        jp: `今あなたのインベントリ内のこれ同じカードの数:`,
    },
    DropCard__MessageEmbed__3_cards_in_a_row1: {
        ru: `Поздравляю, тебе выпало 3 повторки! 👏👏👏 `,
        en: `Congratulations, you have collected 3 identical cards👏👏👏`,
        jp: `おめでと、あなたは3枚同じカードがあります!👏👏👏`,
    },
    DropCard__MessageEmbed__3_cards_in_a_row2: {
        ru: `Можешь попытаться выбить еще одну карту прямо сейчас!`,
        en: `You can try to get another card right now!`,
        jp: `今カードをもらってはもいいです！`,
    },
    DropCard__MessageEmbed__cant_get_more_now: {
        ru: `Сейчас у вас не получится получить карту, но вы можете попытать удачу через:`,
        en: `Now you will not be able to get a card, but you can try your luck through:`,
        jp: `今すぐカードを貰っていけませんが1っ回をして時間の後もいいです：`,
    },
    DropCard__MessageEmbed__hours: {
        ru: `ч`,
        en: `h`,
        jp: `時間`
    },
    DropCard__MessageEmbed__min: {
        ru: `м`,
        en: `m`,
        jp: `分`
    },
    DropCard__MessageEmbed__sec: {
        ru: `с`,
        en: `s`,
        jp: `秒`
    },
    DropCard__EXPORTS__name: {
        ru: `дайкарту`,
        en: `drop`,
        jp: `貰います`
    },
    DropCard__EXPORTS__desc: {
        ru: `Раз в 24 часа рандомная карта помещается вам в инвентарь при использовании этой команды`,
        en: `Once every 24 hours, a random card is placed in your inventory when using this command`,
        jp: `このコマンドを使用すると、24時間ごとにランダムなカードがインベントリに配置されます`
    },

    Profile__MessageEmbed__wrong_user: {
        ru: `Для просмотра профиля учаcтника необходимо упомянуть только его`,
        en: `To view a participant's profile, you only need to mention him`,
        jp: `参加者のプロフィールを表示するには、彼に言及するだけです`
    },
    Profile__MessageEmbed__user_profile: {
        ru: `Профиль участника`,
        en: `Member profile of`,
        jp: `メンバープロフィール`,
    },
    Profile__MessageEmbed__cards_fallen_total: {
        ru: ` Сколько всего карт выпало :`,
        en: ` How many cards have fallen out in total :`,
        jp: ` 落ちたカードの枚数`,
    },
    Profile__MessageEmbed__statistics_of_dropped_cards: {
        ru: ` Статистика выпавших карт :`,
        en: ` Statistics of dropped cards :`,
        jp: ` あなたのカード統計: `,
    },
    Profile__MessageEmbed__collected_non_standard_cards: {
        ru: ` Собрано нестандартных карт :`,
        en: ` Collected non-standard cards :`,
        jp: ` 非標準カード: `,
    },
    Profile__MessageEmbed__not_been_opened_yet: {
        ru: ` Сколько карт еще не открыто :`,
        en: ` How many cards have not been opened yet :`,
        jp: ` カード枚数がまだ研究しません : `,
    },
    Profile__MessageEmbed__fell_out_the_most_times: {
        ru: ` Карта, которая больше всего раз выпала :`,
        en: ` The card that fell out the most times :`,
        jp: `これはあなたのカード一番多い枚数があります`,
    },
    Profile__MessageEmbed__no_cards_in_the_inventory: {
        ru: ` на данный момент не имеет карт в инвентаре:`,
        en: ` currently has no cards in the inventory :`,
        jp: ` は今カードを在りません！`,
    },
    Profile__MessageEmbed__of: {
        ru: `из`,
        en: `of`,
        jp: `/`,
    },
    Profile__EXPORTS__name: {
        ru: `профиль`,
        en: `profile`,
        jp: `プロフィール`,
    },
    Profile__EXPORTS__desc: {
        ru: `Показывает профиль пользователя, содержащий информацию о статистике выпавших ему карт`,
        en: `Shows the user's profile containing information about the statistics of the cards that fell to him`,
        jp: `ユーザーのプロフィールとユーザーのカード統計を見せます`,
    },

    GiveCard__MessageEmbed__issued_a_card: {
        ru: `Вами была выдана карта с названием: `,
        en: `You have been issued a card with the name: `,
        jp: `あなたはカードをもらいました：`,
    },
    GiveCard__MessageEmbed__wrong_user: {
        ru: `Для выдачи карты учаcтнику необходимо упомянуть только его`,
        en: `To give card to participant, you only need to mention him `,
        jp: `ユーザーが正しく指定されていません`,
    },
    GiveCard__EXPORTS__name: {
        ru: `выдайкарту`,
        en: `giveacard`,
        jp: `カードを上げます`,
    },
    GiveCard__EXPORTS__desc: {
        ru: `Выдает карту указанному пользователю :warning: `,
        en: `Issues the card to the specified user :warning: `,
        jp: `ユーザーにカードをあげます :warning:`,
    },

    ActivateCode__MessageEmbed__code_expired: {
        ru: `Время действия введенного кода истекло`,
        en: `The entered code has expired`,
        jp: `入力したコードの有効期限が切れています `,
    },
    ActivateCode__MessageEmbed__exceeded_number_uses: {
        ru: `превышено количество использований введенного вами кода`,
        en: `exceeded the number of uses of the code you entered`,
        jp: `入力したコードの使用回数を超えました`,
    },
    ActivateCode__MessageEmbed__already_used: {
        ru: `Вами уже был использован данный код`,
        en: `You have already used this code`,
        jp: `もうあなたはこのコードを使いました`,
    },
    ActivateCode__MessageEmbed__code: {
        ru: `код: `,
        en: `code: `,
        jp: `コード`,
    },
    ActivateCode__MessageEmbed__activated: {
        ru: ` успешно активирован!`,
        en: ` has been successfully activated!`,
        jp: ` を活性化ました!`,
    },
    ActivateCode__EXPORTS__name: {
        ru: `активируй`,
        en: `activate`,
        jp: `活性化`,
    },
    ActivateCode__EXPORTS__desc: {
        ru: `Активирует эвентовый код позволяющий получить шанс на крутку`,
        en: `Activates an event code that allows you to get a chance to spin`,
        jp: `コードを有効にするとタイマーがリセットされ、ユーザーは別のカードを受け取る機会が与えられます`,
    },

    CreateCode__MessageEmbed__created_code_with_name: {
        ru: `Вами был создан код с названием: `,
        en: `You have created a code with the name: `,
        jp: `コードを作りました：`,
    },
    CreateCode__MessageEmbed__able_to_use_it: {
        ru: `Использовать его смогут `,
        en: `Count of users able to use it: `,
        jp: `このコードを使用できるユーザーの数：`,
    },
    CreateCode__MessageEmbed__unlimited_quantity: {
        ru: `неограниченное количество`,
        en: `unlimited`,
        jp: `無制限の量`,
    },
    CreateCode__MessageEmbed__just_unlimited: {
        ru: `неограничено`,
        en: `unlimited`,
        jp: `いいえ`,
    },
    CreateCode__MessageEmbed__users: {
        ru: `пользователей`,
        en: ``,
        jp: `人`,
    },
    CreateCode__MessageEmbed__code_expiration_date: {
        ru: `Дата истечения работы кода: `,
        en: `Code expiration date:`,
        jp: `コードの有効期限：`,
    },
    CreateCode__EXPORTS__name: {
        ru: `создатькод`,
        en: `createcode`,
        jp: `コードを作ります`,
    },
    CreateCode__EXPORTS__desc: {
        ru: `Создает код, который можно активировать для получения возможности крутки карт :warning:`,
        en: `Creates a code that can be activated to get the ability to drop cards:warning:`,
        jp: `カードを受け取るために有効化できるコードを生成します `,
    },

    DeleteCard__MessageEmbed__deleted_card_with_name: {
        ru: `Вами была удалена карта с текущим названием: `,
        en: `You have deleted a card with the current name:`,
        jp: `カードを削除ました：`,
    },
    DeleteCard__MessageEmbed__card_not_found: {
        ru: `Не найдено указанной карты!`,
        en: `The specified card was not found!`,
        jp: `このカードは見つかりませんでした！`,
    },
    DeleteCard__MessageEmbed__mandatory_argument: {
        ru: `Для функции требуется 1 обязательный аргумент - полное название карты!`,
        en: `The function requires 1 mandatory argument - the full name of the card!`,
        jp: `関数にはカードの完全な名前が必要です！`,
    },
    DeleteCard__EXPORTS__name: {
        ru: `удалитькарту`,
        en: `deletecard`,
        jp: `カードを削除`,
    },
    DeleteCard__EXPORTS__desc: {
        ru: `Удаляет карту из общего пула и у всех пользователей :warning:`,
        en: `Removes the card from the shared pool and from all users :warning:`,
        jp: `どこからでもカードを削除します`,
    },

    AddNewCard__MessageEmbed__added_card_with_name: {
        ru: `Вами была добавлена карта с названием: `,
        en: `You have added a card with the name: `,
        jp: `新しいカードを追加しました`,
    },
    AddNewCard__MessageEmbed__name_already_exists: {
        ru: `Такое название карты уже существует!`,
        en: `This cardname already exists!`,
        jp: `このカード名前はもうありました！`,
    },
    AddNewCard__MessageEmbed__class_number: {
        ru: `Класс карты должен быть числом!`,
        en: `The card class must be a number!`,
        jp: `カードクラスは数字でなければなりません！`,
    },
    AddNewCard__MessageEmbed__media_not_found: {
        ru: `Не указана ссылка на изображение и не найдено вложенного файла`,
        en: `The link to the image is not specified or the attached file is not found`,
        jp: `画像リンクが提供されておらず、添付ファイルが見つかりません`,
    },
    AddNewCard__MessageEmbed__media_incorrect: {
        ru: `Неправильно указана ссылка на изображение | неверный прикреплекнный файл`,
        en: `The link to the image is incorrect | the attached file is incorrect`,
        jp: `間違った画像リンク | 無効な添付ファイル`,
    },
    AddNewCard__EXPORTS__name: {
        ru: `новаякарта`,
        en: `addcard`,
        jp: `新しいカード`,
    },
    AddNewCard__EXPORTS__desc: {
        ru: `Добавляет новую карту в пул карточек которые могут выпадать игрокам :warning:`,
        en: `Adds a new card to the pool of cards that can be get by users :warning:`,
        jp: `ユーザーが取得できるカードのプールに新しいカードを追加します :warning:`,
    },

    EditCard__MessageEmbed__edited_card_with_name: {
        ru: `Вами была изменена карта с текущим названием: `,
        en: `You have changed a card with the name: `,
        jp: `カードを変更しました：`,
    },
    EditCard__MessageEmbed__class_number: this.AddNewCard__MessageEmbed__class_number,
    EditCard__MessageEmbed__media_not_found: this.AddNewCard__MessageEmbed__media_not_found,
    EditCard__MessageEmbed__media_incorrect: this.AddNewCard__MessageEmbed__media_incorrect,
    EditCard__EXPORTS__name: {
        ru: `изменитькарту`,
        en: `editcard`,
        jp: `カードを変更`,
    },
    EditCard__EXPORTS__desc: {
        ru: `Меняет данные карточки в системе :warning:`,
        en: `Changes card data in the system :warning:`,
        jp: `システム内のカードデータを変更します :warning:`,
    },

    ResetDrop__MessageEmbed__specify_user: {
        ru: `Укажите пользователя используя @`,
        en: `Specify the user using @`,
        jp: `@を使用してユーザーを指定します`,
    },
    ResetDrop__MessageEmbed__to_all_users: {
        ru: ` всех пользователей!`,
        en: ` all users!`,
        jp: `すべてのユーザー`,
    },
    ResetDrop__MessageEmbed__updated_drops: {
        ru: `Вами были обновлены крутки для`,
        en: `You have updated the drops for `,
        jp: `カードを受け取るためのタイマーをリセットします：`,
    },
    ResetDrop__EXPORTS__name: {
        ru: `обновикрутки`,
        en: `resetdrop`,
        jp: `タイマーリセット`,
    },
    ResetDrop__EXPORTS__desc: {
        ru: `Обнуляет счетчик круток всем/указанному пользователю :warning: `,
        en: `Resets the drops to all/specified user :warning:`,
        jp: `全ユーザーまたは指定ユーザーのカード受け取りタイマーをリセットします  :warning:`,
    },

    ShowCards__MessageEmbed__no_cards: {
        ru: `Пока что у вас нет ни одной выбитой карты в инвентаре.`,
        en: `You don't have a single knocked-out card in your inventory.`,
        jp: `まだあなたはカードがありっていません`,
    },
    ShowCards__MessageEmbed__cards_in_inventary1: {
        ru: `Вот что у `,
        en: `That's what `,
        jp: `これはユーザーが有っています：`,
    },
    ShowCards__MessageEmbed__cards_in_inventary2: {
        ru: `вас`,
        en: `you`,
        jp: ``,
    },
    ShowCards__MessageEmbed__cards_in_inventary3: {
        ru: ` в инвентаре:`,
        en: `have:`,
        jp: ``,
    },
    ShowCards__MessageEmbed__page: {
        ru: ` страница `,
        en: `page`,
        jp: `ページ`,
    },
    ShowCards__MessageEmbed__inventory_is_over: {
        ru: `Время действия инвентаря закончилось`,
        en: `Inventory expiration time is over`,
        jp: `在庫の有効期限が切れています`,
    },
    ShowCards__MessageEmbed__incorrect_user: {
        ru: `Для просмотра инвентаря участника необходимо упомянуть только его`,
        en: `To view the participant's inventory, you only need to mention him`,
        jp: `ユーザーが正しく指定されていません`,
    },
    ShowCards__MessageEmbed__access_denied: {
        ru: `Вы не можете посмотреть инвентарь участника пока он сам его не откроет при вас`,
        en: `You cannot view the participant's inventory until he opens it in chat to you`,
        jp: `他のユーザーの在庫をオンデマンドで閲覧することはできません`,
    },
    ShowCards__MessageEmbed__no_cards2: {
        ru: `у участника`,
        en: `the user does not`,
        jp: ``,
    },
    ShowCards__MessageEmbed__no_cards3: {
        ru: `у вас`,
        en: `you don't`,
        jp: ``,
    },
    ShowCards__MessageEmbed__no_cards4: {
        ru: `нет ни одной выбитой карты в инвентаре.`,
        en: `have a card in inventory.`,
        jp: `ユーザーはかーどーが有っていません`,
    },
    ShowCards__MessageEmbed__total: {
        ru: `Общее количество уникальных карт`,
        en: `Total unique cards collected`,
        jp: `収集されたユニークカードの合計`,
    },
    ShowCards__MessageEmbed__category: {
        ru: `Категория`,
        en: `Category`,
        jp: `カテゴリ`,
    },
    ShowCards__EXPORTS__name: {
        ru: `покажимне`,
        en: `show`,
        jp: `見せて`,
    },
    ShowCards__EXPORTS__desc: {
        ru: `Показывает карты, находящиеся у вас или у @UserMention в инвентаре`,
        en: `Shows the cards that you or @UserMention have in inventory`,
        jp: `あなたまたは@ユーザーのカードを見せます`,
    },

    Undiscovered__MessageEmbed__no_cards_in_base: {
        ru: `Сначала добавьте карты в базу, перед тем как заставлять меня считать то, чего нет!`,
        en: `First add the cards to the database before forcing me to count what is not there!`,
        jp: `DBにカードがありまっていません`,
    },
    Undiscovered__MessageEmbed__no_users: {
        ru: `Не у кого считать карты!`,
        en: `There is no one to count the cards!`,
        jp: `DBにユーザーがありまっていません！`,
    },
    Undiscovered__MessageEmbed__cards_untouched: {
        ru: `На данный момент количество карт, которых не повидал сервер: `,
        en: `At the moment, the number of cards that the server has not seen: `,
        jp: `カード枚数みんなはみませんでした：`,
    },
    Undiscovered__EXPORTS__name: {
        ru: `неисследовано`,
        en: `undiscovered`,
        jp: `研究しませんでした`,
    },
    Undiscovered__EXPORTS__desc: {
        ru: `Показывает количество карт, которых нет ни у одного из участников`,
        en: `Shows the number of cards that none of the participants have`,
        jp: `カードのかずを`
    },

    FindCardByName__MessageEmbed_one_more_card_exist: {
        ru: `Уточните название карты тк есть больше одного совпадения`,
        en: `Specify the full name of the card, there is more than one match`,
        jp: ``
    },
    FindCardByName__MessageEmbed_no_similar_name_found: {
        ru: `Не найдено похожего названия`,
        en: `No similar name found`,
        jp: `類似の名前は見つかりませんでした`
    },
    RegisterUser__MessageEmbed_registered: {
        ru: `зарегистрирован`,
        en: `registered`,
        jp: `は登録た`
    },
    UserCheck__MessageEmbed_db_error: {
        ru: `Ошибка чтения базы`,
        en: `Database reading error`,
        jp: `DBの読み方の過ち`
    },
    Help__MessageEmbed_commands: {
        ru: `Команды бота`,
        en: `Bot Commands`,
        jp: `ボットのコマンド`
    },
    Help__EXPORTS__name: {
        ru: `помощь`,
        en: `help`,
        jp: `手伝い`
    },
    Help__EXPORTS__desc: {
        ru: `Показывает какие команды имеются у бота`,
        en: `Shows which commands the bot has`,
        jp: `ボットのコマンドを見せる`
    },
}

module.exports = LOCALES;