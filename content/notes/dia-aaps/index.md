---
title: "AAPS, XDrip+, Juggluco, Nightscout"
date: "2025-10-24"
summary: "Настройка и работа с AndroidAPS (AAPS), XDrip+, Juggluco, Nightscout."
description: "Настройка и работа с AndroidAPS (AAPS), XDrip+, Juggluco, Nightscout."
toc: true
autonumber: false
math: false
tags: ["Диа"]
showTags: true
hideBackToTop: false
fediverse: "@username@instance.url"
---

## Введение

Инструкции и заметки по настройке Juggluco, XDrip+, AndroidAPS (AAPS), Nightscout, Libre, Medtronic.

Эта заметка описывает именно эту конфигурацию. Если у вас другой софт, версии, помпа и т.д., у вас может все работать по другому.

Сборка приложения AAPS описывается в [отдельной заметке](/notes/dia-aaps-compile/).

### Версии и оборудование

Версии используемого ПО:

* AAPS 3.4.2.2
* AAPSClient 3.4.2.2
* XDrip+ 2126030111 (System Status), 2026-03-01
* Juggluco 10.7.1
* Freestyle Libre 2 2.13.0.11566
* Nightscout 15.0.3 (Railway)

Оборудование:

* Помпа: Medtronic 722
* CGM: Libre 2
* Мост: OrangeLink Pro
* Телефон: Samsung A17

## Сборка приложения AAPS

Описание процесса сборки приложения AAPS смотри в [подробной инструкции](/notes/dia-aaps-compile/).

### Android AAPS Client

Приложение для наблюдения "со стороны". Собирать отдельно не нужно.

Берется в готовом виде (APK) в основном репозитории AAPS: <https://github.com/nightscout/AndroidAPS/releases/>. Скачиваем файл с названием вида app-aapsclient-release_3.4.2.2.apk.

Версия (3.4.2.2) должна соответствовать версии самого AAPS, иначе будет периодически выдавать предупреждение о несоответствии.

## Настройки AAPS

### Профиль

Основные параметры которые нужно знать и указать ([официальная документация](https://androidaps.readthedocs.io/en/latest/SettingUpAaps/SetupWizard.html#profile)).

**DIA** (duration of insulin action) - время необходимое, чтобы закончилось действие инсулина.

**Glucose target** (BG target) -  желаемый диапазон сахара, AAPS будет действовать, если его предсказания буду показывать что сахар выходит за этот диапазон.

**BR** (basal rate, units/hour) - поставка фонового инсулина, стабилизирует уровень сахара в отсутствии еды или упражнений.

**ISF** (insulin sensitivity factor, correction factor) - на сколько снизится уровень сахара в крови на одну единицу инсулина.

    autotune: 4 mmol/L

**IC or ICR** (insulin-to-carb ratios) - сколько грамм углеводов покрывается одной единицей инсулина.

    autotune: 10 g/U

### Связь с NightScout

* Версия AAPS 3.3.2.1 (требуемая версия Android 11 и выше) не совместима с NightScout 14.2.6, не важно v1 или v3.

Чем отличается [V3 от V1](https://androidaps.readthedocs.io/en/latest/Maintenance/ReleaseNotes.html#important-comments-on-using-v3-versus-v1-api-for-nightscout-with-aaps).

### Перенос настроек

Примечания:

* Чтобы файл json с настройками увидело приложение, он должен лежать в подпапке preferences.
* При восстановлени настроек из json - профиль не будет подхвачен автоматически. Чтобы он подхватился нужно после импорта настроек его активировать или выбрать через Setup Wizard.

### Objectives/Цели

Если застряли на экзамене и он сильно стал раздражать своей неадекватностью (как меня) --- напишите, я скажу где взять все ответы на вопросы.

#### Objective 1

Чтобы пройти задачу "Pump status available in NS or Tidepool" нужно чтобы в сборке NightScout был pump и другие переменные описанные в [настройках](https://androidaps.readthedocs.io/en/latest/SettingUpAaps/Nightscout.html#manual-nightscout-setup). Если их нет, то требуется изменение переменных среды и пересборка.

#### Objective 2

Display the Loop plugin’s content. Этот раздел это не раздел в Config builder, в нем всегда включенная и засеренная галка и пустой раздел настройки. Чтобы пройти задачу, нужно нажать гамбургер и выбрать Loop там.

### Батареи и заряды в AAPS

В программе несколько мест, где нужно смотреть смотреть состояние батарей:

1. Батарея сенсора (sensor battery level) --- уровень заряда сенсора в %, есть в сенсорах работающих с передатчиком, например MiaoMiao.
2. Возраст сенсора (sensor age, SAGE) --- сколько времени отработал сенсор. Пример: 2d1h.
3. Батарея помпы (pump battery level) --- уровень заряда помпы в %.
4. Возраст батареи помпы (pump battery age) --- сколько времени прошло с замены батареи. Пример: 0d5h.

![Home2020_StatusLights.webp](Home2020_StatusLights.webp)

На картинке: первое справа - 3 и 4, второе справа - 2.

Уровень заряда помпы и возраст батареи помпы в AAPS показываются вместе (3 и 4), например: 0d5h 92%. В AAPSClient возраст батареи помпы показывается в строке с другими статусами, а уровень заряда в % в желтой строке ниже.

Сам Riley не передает свой уровень заряда батареи, поэтому его нужно периодически заряжать. Рекомендуют раз в сутки, обычно заряда хватает на 36 часов. Когда заряд полный, гаснет красная лампочка.

### SMB - Super Micro Boluses

Без SMB AAPS управляет сахаром только через базал. С SMB может делать небольшие болюсы. Чтобы включить SMB, нужно:

1. Пройти цель 9 или дальше.
2. Главный экран → Три палки → Config Builder → APS → стрелка вниз (рядом с глазом) → выбрать OpenAPS SMB вместо AMA

Дополнительные настройки:

Главный экран → Три точки → Preferences → OpenAPS SMB

### Типы прогнозов

* COB - есть заявленные углеводы, они ещё работают.
* Accel-COB - оставшиеся углеводы могут начать всасываться быстрее.
* IOB - активный инсулин, еды как будто больше нет.
* UAM - рост при незаявленной еде (прогноз включается при SMB).
* Zero-temp - что будет, если выключить базал.

![forecast.png](forecast.png)

## RileyLink или OrangeLink Pro

Соединяет помпу Medtronic 722 и AAPS по Bluetooth. Сначала нужно убедиться что AAPS успешно соединился с RileyLink/OrangeLink, затем, что последний соединился с помпой. Одно из преимуществ OrangeLink - он умеет сообщать об оставшемся заряде батареи. RileyLink --- не умеет и его регулярно нужно подзаряжать.

* Для работы на телефоне должен быть включен Bluetooth.
* У приложения AAPS должно быть разрешение на Nearby Devices.

Если у вас RileyLink:

* При включении RileyLink должен мигнуть синий индикатор.
* RileyLink работает и на зарядке. В процесе зарядки горит красный индикатор.
* При успешном соединении с помпой горит зеленый индикатор в торце.

* Появляется сообщение "ЧИТСТАТУС драйвер помпы изменен/READSTATUS Pump driver changed" после чего рестарты приложения и Bluetooth не помогают, сообщение ни на что не меняется. Помогает удаление и переподключение RileyLink в настройках помпы в AAPS и перезагрузка телефона.
* Если зеленая лампочка загорается, телефон перегружен 5 раз, но Riley никак не хочет связываться с помпой - вкл/выкл самого RileyLink, должен мигнуть синим.

Если у вас OrangeLink Pro:

* если OrangeLink мигает красным - он не соединен с AAPS;
* если OrangeLink мигает желтым - он соединен с AAPS. Мигает довольно редко.

Замеченные проблемы:

1\. Телефоны Samsung не могут соединиться с OrangeLink, [известная проблема](https://github.com/nightscout/AndroidAPS/issues/474) еще со старых версий AAPS. Решается следующим образом:

* В настройках AAPS, Medtronic, Configuration, отключить Scanning.
* Выключить телефон.
* Вынуть батарейки из OrangeLink и вставить обратно.
* Включить телефон.
* Добавить OrangeLink как обычно.

2\. При соединении с помпой OrangeLink может пропускать подколки сделанные через помпу, как следствие они не появятся и в Nightscout, как будто их не было. Вот как это выглядит: OrangeLink успешно соединяется с AAPS, далее пытается получить информацию с помпы. Процесс фейлится посередине, например зависает по той или иной причине. Далее, вместо общего сбоя - AAPS репортит ОК, подколки не появляются, хотя они были. Показывается статус: Connected, страница Pump history - пустая.

Что делать? Нажать Refresh и дождаться что Pump history - не пустой.

### Информация о Bluetooth RileyLink

Пример информации о сканировании устройства RileyLink с помощью nRF Connect.

* Complete local name: RileyLink
* BC:33:AC:B7:30:61
* -100 dBm, 325 ms
* Device type: LE only
* Advertising type: Legacy
* Flags: LE General Discoverable, BR\EDR Not Supported (см. расшифровку ниже)
* Complete list of 128-bit Service UUIDs: 0235733b-99c5-4197-b856-69219c2a3845

Raw data:

0x020106110745382A9C216956B89741C5993B7335020A0952696C65794C696E6B

| LEN | TYPE | VALUE                              |
|----:|:----:|:-----------------------------------|
|   2 | 0x01 | 0x06                               |
|   17| 0x07 | 0x45382A9C216956B89741C5993B733502 |
|   10| 0x09 | 0x52696C65794C696E6B               |

Расшифровка типов:

* 0x01 - Flags
* 0x07 - Complete List of 128-bit Service Class UUIDs
* 0x09 - Complete Local Name

[Подробнее](/notes/dia-aaps/#информация-о-bluetooth-сенсора)

## Medtronic, RileyLink, AAPS

Официальная инструкция на [androidaps.readthedocs.io](https://androidaps.readthedocs.io/en/latest/CompatiblePumps/MedtronicPump.html).

* Medtronic 722, Worldwide (868 Mhz)
* [RileyLink 916MHz (Medtronic) to BLE Bridge](https://getrileylink.org/product/rileylink916) или OrangeLink Pro (можно также EmaLink, не пробовал)

![medtronic722.png](medtronic722.png "Medtronic 722WWS")

Замеченные проблемы:

* Не хотело коннектиться при первичной установке (переходе с Virtual pump на Medtronic). Помогло отключить Bluetooth, отключить райли, перезапустить помпу, запустить все обратно.
* Не хотело коннектиться при перестановке сенсора. Помогло отключить Bluetooth, подождать 10 секунд, включить. Райли загорелся зеленым.

## XDrip+

[Официальный сайт](https://jamorham.github.io/#xdrip-plus) XDrip+.

XDrip+ устанавливается из [последней ночной сборки](https://xdrip-plus-updates.appspot.com/stable/xdrip-plus-latest.apk).

* Принимает сахар от Juggluco (см. настройки Juggluco)
* Передает сахар в AAPS локальной трансляцией (broadcast)
* Не передает сахара в NightScout

При работе вместе с AAPS, нужны следующие настройки:

1. Settings - Cloud Upload - NighScout - Enabled: OFF
2. Settings - Inter-app settings - Broadcast locally: ON

### XDrip+ и Libre 1

При подключении выбирается Libre, потом Bluetooth Bridge и выбирается соединение с miaomiao (должен быть включен). [Хорошая инструкция](https://miaomiao.cool/pages/how-to-use-miaomiao-with-xdrip) по использованию XDrip+ c Libre 1 через miaomiao.

Для полного включения понадобится подождать несколько минут, пока XDrip+ получит несколько значений.

При вводе калибровки может понадобится переключиться на mmol/L.

## Libre 2

### Информация о Bluetooth сенсора

Пример информации о сканировании конкретного сенсора с помощью nRF Connect. После того как сенсор спарился с приемником больше он таким сканированием не обнаруживается.

* Complete local name: ABBOTT3MH017EV8X0
* 8C:61:20:CE:77:CE
* -57 dBm, 63 ms
* Device type: LE only
* Advertising type: Legacy
* Flags: LE General Discoverable, BR/EDR Not Supported (см. расшифровку ниже)
* Manufacturer data (Bluetooth Core 4.1): Company: Abbott <0x03BB> 0xCE77CE20618C
* Incomplete list of 16-bit device UUIDs: 0xFDE3, 0000fde3-0000-1000-8000-00805f9b34fb (Abbott Diabetes Care)
* Tx Power Level: 0 dbm

00000110 = 0x06

* 000 - Reserved
* 0 - LE and BR/ERD Capable (Host)
* 0 - LE and BR/ERD Capable (Controller)
* 1 - BR/EDR Not Supported
* 1 - LE General Discoverable Mode
* 0 - LE Limited Discoverable Mode

RAW data:

0x02010609FFBB03CE77CE20618C0303E3FD020A0012094142424F5454334D483031374556385830

| LEN | TYPE | VALUE                                |
|----:|:----:|:-------------------------------------|
|   2 | 0x01 | 0x06                                 |
|   9 | 0xFF | 0xBB03CE77CE20618C                   |
|   3 | 0x03 | 0xE3FD                               |
|   2 | 0x0A | 0x00                                 |
|  18 | 0x09 | 0x4142424F5454334D483031374556385830 |

* LEN: length of AD packet (Type+Data) in bytes.
* TYPE: the data type as in [Assigned numbers.pdf](https://www.bluetooth.com/wp-content/uploads/Files/Specification/Assigned_Numbers.pdf), chapter 2.3: Common Data Types

Расшифровка типов:

* 0x01 - Flags
* 0xFF - Manufacturer Specific Data
* 0x03 - Complete List of 16-bit Service Class UUIDs
* 0x0A - Tx Power Leve
* 0x09 - Complete Local Name

См. также [Информация о Bluetooth RileyLink](/notes/dia-aaps/#информация-о-bluetooth-rileylink)

## Libre 2, Juggluco, XDrip+

Основная связка, прежде чем двигаться дальше с развертыванием AAPS, нужно чтобы она заработала.

### Первая установка, первый сенсор

* Регистрируемся на libreview.ru
* Ставим на отдельный телефон официальное приложение Free Style Libre 2 - RU (важно: именно RU)
* Входим с созданной учетной записью
* Включаем, если отключен NFC
* Активируем сенсор официальным приложением и ждем 60 мин пока пойдут значения в официальное приложение.
* После того как значения пошли - отбираем у приложения все разрешения.
* Переключаем XDrip+ на получение данных через Libre (patched App).
* Устанавливаем Juggluco, самую свежую версию ([официальный сайт](https://www.juggluco.nl/Juggluco/index.html), [все версии](https://sourceforge.net/projects/juggluco/files/))

Детали:

* В данной связке у XDrip+ не должно быть разрешения: Nearby devices. Его лучше отобрать на все время пока пользуемся этой связкой.

### Cледующий сенсор

* Устанавливаем новый сенсор
* Отбираем у Juggluco разрешение: Nearby devices: Allow -> Don't allow
* Выгружаем приложение из памяти
* Возвращаем Free Style Libre 2 разрешение: Nearby devices: Don't allow -> Allow
* Сканируем сенсор, должно выдаться сообщение о том, что сенсор новый, жмем New
* Сканируем еще раз сенсор, активируем, ждем 60 минут, должны пойти значения
* Отбираем у Free Style Libre 2 разрешение: Nearby devices: Allow -> Don't allow, лучше так же отключить Уведомления.
* Возвращаем Juggluco разрешения: Nearby devices: Don't allow -> Allow
* Сканируем Juggluco сенсор, подтверждаем, разрешаем добавить в календарь, запоминаем последние две буквы. Если говорит Try again, пробуем еще.
* Сканируем Juggluco еще раз для начала работы, покажет значение.
* Вызываем настройки Juggluco нажатием слева, нажимаем на Sensor, выбираем новый сенсор.
* Открываем XDrip+, в нем все должно подхватиться автоматически.

### Дополнительные 12 часов

После окончания работы сенсора (14 дней) можно продлить его работу на 12 часов если отсканировать его Juggluco. Шаги:

1. Открыть Juggluco
2. Отсканировать сенсор - Juggluco покажет ошибку "sensor error"
3. Отсканировать сенсор еще раз - сенсор снова заработает и проработает еще 12 часов.

## Juggluco и проблемы с Bluetooth

В Sensor выглядит примерно так:

![juggluco-bt-problem.png](juggluco-bt-problem.png)

Что можно проверить/сделать:

0. Перезагрузить телефон. Проблемы с Bluetooth коннективностью имеют обыкновение накапливаться и просто вкл/выкл Bluetooth уже не помогает.
1. Положить телефон с AAPS ближе к сенсору.
2. Убедиться что у Juggluco есть разрешение Nearby devices, а у XDrip, Freestyle Libre 2 - они отозваны.
3. Убедиться, что для Juggluco не включена экономия батареи, это делается в настройках Android, Apps.
4. Припинить приложение (Pin app) [тут](https://www.samsung.com/sg/support/mobile-devices/pin-an-app-to-your-phone-screen-so-that-it-cant-be-closed/) объясняется как это сделать.
5. Альтернативно 3 - "поставить на замок". Аналогично выше, но выбрать не Pin app а Keep open. При нажатии кнопки Недавние (три палки) на приложении появится замок.

Документация Juggluco

> The spinner contains the name of the sensor. If Juggluco is using more than one sensor at the same time, you can select the sensor for which to show information.
>
> Doze mode leads you to a screen with information on how to disable battery optimizations for Juggluco, that can prevent Juggluco from functioning.
>
> Bluetooth history: On Libre 2, history are values of the past in 15 minute intervals. Previously they were only received by scanning. When you turn this option on, the History values are also received via Bluetooth. Also, other things will work differently. To Libreview will be sent the history values, instead of averages of the stream values. The disadvantage is that it is slower. This can be an issue on WearOS watches. This option has no effect on Libre 3 and US/CA/AU/KR Libre 2 sensors; they always receive history values via Bluetooth.
>
> Bug: only present on WearOS for Libre 3. This needs to be set on Samsung Galaxy Watch 5 and higher, until Samsung fixes this bug. Without this option, glucose values will be received 2 instead of 1 minute apart. Watch 5 to Ultra will always receive values from Libre 2 sensors spaced two minutes apart.
>
> ⏰: Let Juggluco use an alarm clock function to ensure the correct timing of connecting to Dexcom G7 and ONE+ sensors. Without it, when the device is in deep sleep when not used, it will sometimes not awake to reconnect to the sensor and it will not immediately receive a glucose value. My WearOS watch had this problem in the middle of the night, probably because I moved very little. Because of backfill afterwards and slow awakening, I didn’t see it on the watch and phone, only in the log files. My phone doesn’t need this setting and seems to perform worse when it turned on.
>
> Permission: Previous versions of Juggluco required location permission to find the device address of the sensor. This is no longer necessary for the sensors I use. Maybe there are still sensors out there for which it is necessary; in that case you can turn it on. After the first contact Juggluco <http://127.0.0.1:17580/hallo/x/stream> saves the device address and location permission is always useless. The device address, if known, is displayed after the sensor identifier. Red means a US-like sensor. Android 12 has a new Nearby devices permission, which can be used instead of location permission for searching for a Bluetooth device address, but it is also needed for later contact with Bluetooth devices.
>
> Forget: Let Juggluco forget the device address and scan for the device address. For some sensors this is needed to get a connection and is then done automatically by Juggluco. With this button you can manually say that Juggluco should do that, because there are maybe other occasions in which it is also needed.
>
> Terminate: stop connecting to this sensor via Bluetooth. If later you want to again receive stream glucose values from this sensor, you only have to scan it again. If the sensor is directly connected with the watch, you need first to turn that off and then press on Terminate on the phone and then on Sync on the watch.
>
> Unpair: Aidex X sensors remember the phone or watch they are paired with and refuse to bond to other devices. By pressing “Unpair” a command is sent to the sensor and if successful, it is again possibly for other phones or watches to connect to the sensor. When you use left menu→Watch→WearOS config → “Direct sensor …” to transfer the sensor from and to the watch, the unpairing will also be done, and you shouldn’t use “Unpair”.
>
> Clear: (Button only present when connecting with Aidex X sensors.) Pressing this button removes all glucose values from the sensor and restarts the sensor like it is a new sensor. This makes it possible to use a sensor longer than 15 days. When I tried it, the values received after the sensor end date were totally worthless, having about half the value of the Libre 3 sensor I ran parallel with it.
>
> Reset: Sibionics 2 only. When switching sensor in a transmitter this button should be pressed. Either when Juggluco is connected to the old sensor and/or when Juggluco is connect to the new sensor. You shouldn’t press it when the transmitter already was reset by another app.
>
> Turbo: Increases effort to contact with sensor in the hope that it results in less connection errors, but can uses more battery power. Seems to be needed on Watch4 with Freestyle Libre 2 sensors, but not with Freestyle Libre 3 sensors and on none of the smartphones I tried it on.
>
> Android: Let Android instead of Juggluco make the connection with the sensor. Don’t use it! In most cases it will take longer before a connection is established. This option was introduced because of a broken Android 13 version, which is later repaired. You should only turn this on when in this sensor screen no recent times are displayed. That means that no connection errors or sensor errors are shown, but also no values are received and you can get it working again by turning off and on Bluetooth. When you try to connect European Libre 2 sensor with two apps on the same phone at the same time (that is only then possible), you can also get in that state.
>
> Info: Gives start and end times and last scan and stream times of sensor.
>
> To connect to a Freestyle Libre 2 sensor via Low Energy Bluetooth, Bluetooth should be turned on. Before the sensor is scanned successfully by this app, nothing will happen. The sensor shouldn't be connected with FreeStyle reader or other applets on smartphones. Abbotts Libre app should uninstalled, disabled or force stopped. If you have started the sensor with Freestyle Reader and you can’t turn it off, you can prevent it from getting into contact with the sensor by putting the reader in a Faraday cage.
>
> If the above conditions are satisfied, it can still take a long time before the app receives glucose values from the sensor. Often it takes a minute, but at other times it takes much longer. The Connection stage gives the most difficulties. The most frequent are failures with status=133, which is the status argument of onConnectionStateChange(BluetoothGatt bluetoothGatt, int status, int newState). It means Bluetooth device not found. Nearly always it just takes some time before the device is found. It is also possible that the sensor is connected to another device, temporary not functioning well, other devices are interfering or the Bluetooth of Android doesn’t function. Sometimes turning Bluetooth off and on seems to help or rebooting the phone or turning off the Bluetooth connection of other devices. Other problems are sometimes resolved by scanning the sensor. Intervening water (including body water) can be a problem, so that wearing a WearOS watch on a different arm than the sensor can give connection problems when the arms are held in a way that the body is positioned between watch and sensor.
>
> One user of AccuChek SmartGuide reported that when a Bluetooth search couldn’t find the sensor, it was solved by to going to connected Bluetooth devices in Android settings, select the sensor and press “Forget”.
>
> Scanning the sensor with Juggluco (with Use Bluetooth enabled) on another phone, will steal the connection away from this phone and it can take some time, with scanning in between, to get it back again.

Перевод:

Список выбора содержит название сенсора. Если Juggluco одновременно использует больше одного сенсора, можно выбрать, для какого именно сенсора показывать информацию.

*Doze mode* переводит вас на экран с информацией о том, как отключить для Juggluco оптимизацию батареи, которая может мешать нормальной работе Juggluco.

*Bluetooth history*: на Libre 2 история — это прошлые значения с интервалом 15 минут. Раньше они получались только при сканировании. Если включить эту опцию, значения истории тоже будут приходить по Bluetooth. Кроме того, некоторые вещи будут работать иначе. В Libreview будут отправляться значения истории, а не средние значения потока. Недостаток в том, что это работает медленнее. Это может быть проблемой на часах WearOS. Для Libre 3 и Libre 2 для США/Канады/Австралии/Кореи эта опция ничего не меняет: они всегда получают исторические значения через Bluetooth.

*Bug*: присутствует только на WearOS для Libre 3. Эту настройку нужно включать на Samsung Galaxy Watch 5 и новее, пока Samsung не исправит эту ошибку. Без этой опции значения глюкозы будут приходить с интервалом 2 минуты вместо 1. Часы от Watch 5 до Ultra всегда получают значения от сенсоров Libre 2 с интервалом в две минуты.

⏰: разрешает Juggluco использовать функцию будильника, чтобы обеспечить правильный момент подключения к сенсорам Dexcom G7 и ONE+. Без этого, когда устройство находится в глубоком сне и не используется, оно иногда не просыпается для повторного соединения с сенсором и не получает значение глюкозы сразу. У моих часов WearOS эта проблема возникала посреди ночи, вероятно потому, что я почти не двигался. Из-за последующего backfill и медленного пробуждения я не видел этого ни на часах, ни на телефоне, только в логах. Моему телефону эта настройка не нужна, и, похоже, с ней он работает хуже.

*Permission*: в предыдущих версиях Juggluco для поиска адреса устройства сенсора требовалось разрешение на определение местоположения. Для сенсоров, которые я использую, это больше не нужно. Возможно, есть сенсоры, для которых это все еще необходимо; в таком случае можно включить эту опцию. После первого контакта Juggluco сохраняет адрес устройства, и разрешение на геолокацию становится бесполезным. Адрес устройства, если он известен, показывается после идентификатора сенсора. Красный цвет означает сенсор типа US. В Android 12 появилось новое разрешение Nearby devices, которое можно использовать вместо разрешения на геолокацию для поиска Bluetooth-адреса устройства, но оно также нужно и для дальнейшего взаимодействия с Bluetooth-устройствами.

*Forget*: заставляет Juggluco забыть адрес устройства и заново искать его. Для некоторых сенсоров это необходимо для установления соединения, и тогда Juggluco делает это автоматически. С помощью этой кнопки можно вручную указать Juggluco сделать это, потому что, возможно, бывают и другие случаи, когда это тоже нужно.

*Terminate*: прекратить подключение к этому сенсору по Bluetooth. Если позже вы снова захотите получать потоковые значения глюкозы от этого сенсора, достаточно будет снова его просканировать. Если сенсор напрямую подключен к часам, сначала нужно отключить это подключение, затем нажать Terminate на телефоне, а потом Sync на часах.

*Unpair*: сенсоры Aidex X запоминают телефон или часы, с которыми они были сопряжены, и отказываются соединяться с другими устройствами. При нажатии Unpair на сенсор отправляется команда, и, если все прошло успешно, к сенсору снова смогут подключаться другие телефоны или часы. Когда вы используете left menu → Watch → WearOS config → “Direct sensor …” для переноса сенсора с часов на телефон и обратно, отвязка тоже выполняется, и использовать Unpair не нужно.

*Clear*: кнопка присутствует только при подключении к сенсорам Aidex X. Нажатие этой кнопки удаляет все значения глюкозы из сенсора и перезапускает его так, как будто это новый сенсор. Это позволяет использовать сенсор дольше 15 дней. Когда я это пробовал, значения, полученные после даты окончания сенсора, были совершенно бесполезными — примерно вдвое ниже значений Libre 3, который работал у меня параллельно.

*Reset*: только для Sibionics 2. При замене сенсора в передатчике нужно нажать эту кнопку. Либо когда Juggluco подключен к старому сенсору, либо когда Juggluco подключен к новому. Не следует нажимать ее, если передатчик уже был сброшен другим приложением.

*Turbo*: усиливает попытки связи с сенсором в надежде уменьшить количество ошибок подключения, но может расходовать больше батареи. Похоже, это нужно на Watch4 с сенсорами Freestyle Libre 2, но не с Freestyle Libre 3 и ни на одном из смартфонов, на которых я это пробовал.

*Android*: позволяет Android, а не Juggluco, устанавливать соединение с сенсором. Не используйте это. В большинстве случаев соединение будет устанавливаться дольше. Эта опция была добавлена из-за одной сломанной версии Android 13, которую позже исправили. Включать это следует только тогда, когда на экране сенсора не показываются недавние времена. Это означает, что нет ни ошибок соединения, ни ошибок сенсора, но и значения тоже не приходят, и работу можно восстановить, выключив и снова включив Bluetooth. В такое состояние можно также попасть, если попытаться подключить европейский сенсор Libre 2 двумя приложениями на одном и том же телефоне одновременно — только в таком случае это вообще возможно.

*Info*: показывает время начала и окончания работы сенсора, а также время последнего сканирования и последнего потокового получения данных.

Чтобы подключиться к сенсору Freestyle Libre 2 по Bluetooth Low Energy, Bluetooth должен быть включен. Пока сенсор не будет успешно просканирован этим приложением, ничего происходить не будет. Сенсор не должен быть подключен к считывателю FreeStyle Reader или к другим приложениям на смартфонах. Приложение Abbott Libre должно быть удалено, отключено или принудительно остановлено. Если вы запустили сенсор с помощью Freestyle Reader и не можете его выключить, можно помешать ему связаться с сенсором, поместив ридер в клетку Фарадея.

Даже если все эти условия выполнены, приложению все равно может понадобиться много времени, чтобы начать получать значения глюкозы с сенсора. Часто это занимает минуту, но иногда — гораздо дольше. Наибольшие трудности вызывает этап подключения. Чаще всего встречаются сбои со статусом 133 — это аргумент status метода onConnectionStateChange(BluetoothGatt bluetoothGatt, int status, int newState). Это означает, что Bluetooth-устройство не найдено. Почти всегда это просто значит, что нужно немного подождать, пока устройство будет найдено. Также возможно, что сенсор подключен к другому устройству, временно работает нестабильно, есть помехи от других устройств или Bluetooth в Android работает некорректно. Иногда помогает выключить и снова включить Bluetooth, перезагрузить телефон или отключить Bluetooth-соединения других устройств. Другие проблемы иногда решаются повторным сканированием сенсора. Помехой может быть вода, включая воду в теле, поэтому если часы WearOS находятся на руке, отличной от той, где стоит сенсор, возможны проблемы со связью, когда руки расположены так, что тело оказывается между часами и сенсором.

Один пользователь AccuChek SmartGuide сообщил, что когда поиск Bluetooth не находил сенсор, проблема решалась так: нужно было зайти в список подключенных Bluetooth-устройств в настройках Android, выбрать сенсор и нажать Forget.

Если просканировать сенсор с помощью Juggluco на другом телефоне при включенной опции Use Bluetooth, это «уведет» соединение с текущего телефона, и может потребоваться некоторое время, а также промежуточные сканирования, чтобы вернуть его обратно.

## Nighscout

### Обновление Nighscout в Railway

Если форк очень долго не обновлялся - недостаточно сделать Sync Fork и Redeploy.

Самый надежный способ - сделать копию master ветки, например в master2 и перенацелить на нее deployment в Railway. После этого обязательно нажать Deploy в маленьком всплывающем окне.

### Отправка данных из XDrip+ в NightScout

**Не включайте эту интеграцию**, если у вас конфигурация: Juggluco+XDrip+AAPS+NightScout.

В настройках XDrip+: Settings - Data Sync - Cloud Upload - Nightscout Sync (REST-API)

Детали:

* Включить REST API
* Use mobile data
* Base URL: <https://password@hostname/api/v1/>, обязательно нужен слэш в конце. Обратить внимание, что если просто использовать эту ссылку в браузере, то он ответит Cannot GET /api/v1/ (но работать будет)

### База данных Nightscout, бэкап и очистка

NS хранит данные в БД MongoDB. База может располагаться на своем сервере или в облаке --- MongoDB Atlas. В облаке на бесплатном плане, т.н. Tier M0, можно хранить до 512 Мб данных.

В кластере (набор БД) есть база данных heroku_xx777xxx, в ней таблицы (т.н. "коллекции"). Основные данные (т.н. "документы") лежат в:

* devicestatus - с 2018 накопилось 243537 записей (если оставить 30 дней, то будет удалено 225904)
* entries - c 2019 года накопилось 849145 записей

Размер базы данных показывается когда включен плагин Database Size. Если он не включен - включите, для этого нужно авторизоваться в Nightscout.

![ns-plugins.png](ns-plugins.png)

#### Полный бэкап базы

Полезно, если хотите иметь возможность всё потом восстановить как было.

1. Скачиваем и ставим [MongoDB Database Tools](https://www.mongodb.com/try/download/database-tools)
2. Запускаем mongodump. Строку подключения берем из переменных NS, обрезаем до .net/

Строка подключения выглядит примерно так:

> mongodb+srv://heroku_xx777xxx:4vqss5tn444vfi@cluster-xx777xxx.ha6za.mongodb.net/xx777xxx?retryWrites=true&w=majority

Итого команда:

> mongodump --uri="mongodb+srv://heroku_xx777xxx:4vqss5tn444vfi@cluster-xx777xxx.ha6za.mongodb.net/" --archive=backup-2026-04-12.gz --gzip

#### Очистка базы данных

Если размер базы данных достиг 90% и выше (на иллюстрации 93), пора ее чистить.

![ns-large-db.png](ns-large-db.png)

Для этого:

1. Открываем панель Nighscout
2. Авторизуемся
3. Открываем Admin tools
4. Находим раздел: Clean Mongo entries (glucose entries) database и выбираем количество дней которые хотим оставить.
5. Альтернативно: делаем тоже самое для devicestatus.

**Важно!** Если вы удаляете историю, но процент занятости не понижается, остановитесь! Нужно [разобраться со старыми индексами БД](/notes/dia-ns-atlas/).

## Долив инсулина в резервуар помпы

1. Отсоединить от порта помпу с канюлей.
2. На помпе Заправка - Перезапуск - ACT. Помпа начинает отгонять поршень назад.
3. Как только слышно жужжание можно вытаскивать резервуар. Повернуть до щелчка и вытащить.
4. Помпа продолжит жужжать пока не отведет поршень.
5. Отсоединить резервуар от канюли. Повернуть до щелчка и вытащить.
6. Теперь три детали лежат отдельно: канюля, помпа, резервуар.
7. На резервуар надеть переходник, зафиксировать.
8. Взять шприц ручку, набрать инсулин (скрутить 10 единиц), воткнуть в переходник.
9. Нажать на спуск на ручке. Спуск должен быть легким, если есть препятствие - что-то не так.
10. Повторить 8-9 пока не заполнится резервуар на половину.
11. На резервуар надевается канюля.
12. Резервуар с канюлей вставляется в помпу.
13. Нажать ACT на помпе. Помпа начинает жужжать, поршень двигается и упирается в дно резервуара и начинают бежать цифры (значит что поршень двигает инсулин).
14. Пропускаем 3-4 единицы (смотрим на помпе цифры) пока не станет прозрачной и без пузырей по всей длине канюли (смотрим на просвет).
15. Потом ESCAPE на помпе.
16. Ставим канюлю обратно на порт.

## Вопросы?

Возникли вопросы, комментарии или есть полезная информация по теме заметки?

Можно [**написать в телеграм**](https://t.me/answer42geo/131) или оставить вопрос в форме ниже.
