# DiscordCardBot
Простенький бот, позволяющий коллекционировать карты(любой поддерживаемый дискордом медиа контент) участниками сервера.
## Описание
Участник дискорд сервера может при использовании команд этого бота:
 - **daikarty** :получить коллекционную карту 1 раз в 24 часа или просмотреть через сколько времени он ее сможет получить
 - **pokajimne** :просмотреть список и количество карт одного типа, которые он уже получил
 - **помощь** :получить справку о командах бота

 **фича от 31.07.2021**
 - Чтобы не превышать максимальное количество символов в сообщении для API Discord`а был введен "страничный" инвентарь:
после ввода команды о запросе показать инвентарь, бот показывает вам последнюю страницу инвентаря, в которой содержатся ваши недавно полученные коллекционные карты. Вы можете перелистывать страницы инвентаря при помощи реакций(⬅️ и ➡️) в сообщении с вашими картами. Учтите, бот не будет бесконечно ждать, когда вы соизволете пролистнуть страницу, через некоторое время он перестанет реагировать на новые реакции, и вам придется запросить инвентарь командой снова.
![](https://cdn.discordapp.com/attachments/852679774128439386/871084401600110632/3LfGjl6Rj4.gif)

 **фича от 11.06.2021**
- При получении одной и той же карты каждый 3й раз, участнику сервера дается возможность сразу же попытаться выбить еще одну карту.
- Теперь, когда человек будет использовать команду для получения карты, но 24 часа с момента прошлого получения еще не прошли, бот покажет через сколько времни выдача карты будет доступна.

## Настройка проекта
Требуется:
 - Node.js 10.0.0 или выше;

### Создание конфига
В корне проекта создайте конфигурационный файл **.env**
Пример файла .env :
```
TOKEN = "токен вашего бота"
PREFIX = '!' 
PAGE_SIZE = 7 #количество элементов, которые будут умещаться на одной странице инвентаря при показе
INVENTORY_TIME = 60000 #время бездействия инвентаря, после которого бот перестает листать страницы, указывается в миллисекундах 
```

### Подготовка контента
Откройте файл /storage/db.json
```
{
	"users": [], // Ссодержит данные участников сервера и их инвентарь 
	"cards": [] // Содержит данные о картах, которые могут выпасть на сервере
}
```

Данные о пользователях сервера **будут автоматически добавляться** по мере использования команд бота.
Данные о картах вам **придется заполнить самостоятельно**. 
Пример добавления карты в **db.json**
```
cards: [
    {
        "name": "test_card", // Название карты
        "active": true, // Флаг, определяющий, может ли катра вывпасть участникам сервера
        "url": "url_string.png"  // Ссылка на изображение карты
    }, 
]
```

### Подгрузка зависимостей
Откройте терминал в корне проекта, далее пропишите следующие команды:
```
npm i 
```

### Запуск проекта
```
npm start 
```