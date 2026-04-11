---
title: "AAPS: cборка и настройка"
date: "2025-10-24"
summary: "Сборка и настройка приложения AAPS для Android для мониторинга сахара."
description: "Сборка и настройка приложения AAPS для Android для мониторинга сахара."
toc: true
autonumber: false
math: false
tags: ["Диа"]
showTags: true
hideBackToTop: false
fediverse: "@username@instance.url"
---

## Введение

Инструкции и заметки по сборке и настройке AndroidAPS (AAPS), Libre, XDrip+ и др.

### Версии и оборудование

Текущие версии используемого ПО:

* AAPS 3.4.0.0
* XDrip 2025.09.05 (System Status)
* Juggluco 10.7.1
* Freestyle Libre 2 2.13.0.11566
* Nightscout 15.0.3 (Railway)

Оборудование:

* Помпа Medtronic 722
* CGM Libre 2
* RileyLink
* Samsung A17

## Сборка приложения

Инструкция по получению APK AndroidAPS на стационарном компьютере (не телефоне) с минимальными усилиями. Без установки Android Studio в браузере, с помощью Github Actions.

[Официальная инструкция по сборке в браузере](https://androidaps.readthedocs.io/en/latest/SettingUpAaps/BrowserBuild.html).

### Что нужно для сборки приложения

* Аккаунт на [Github](https://github.com)
* Аккаунт на Google (если есть почта на gmail, то аккаунт уже есть)
* Установить VS Code + расширение Live server

### Первичная сборка Android AAPS

1. Сделать Fork репозитория приложения AAPS. Перейти в [официальный репозиторий](https://github.com/nightscout/AndroidAPS), нажать Fork, адрес форка <https://github.com/simgislab/AndroidAPS>
2. [Скачать](https://github.com/nightscout/aaps-ci-preparation/releases/download/release-v1.1.2/aaps-ci-preparation.html) aaps-ci-preparation.html. Это страница-хелпер которая поможет сгенерировать KEYSTORE_SET и GDRIVE_OAUTH2. Репозиторий [aaps-ci-preparation](https://github.com/nightscout/aaps-ci-preparation). Текущая версия 1.1.2 Oct 13, 2025.
3. Открыть файл aaps-ci-preparation.html в VS Code и запустить страницу в Live server.
4. Сгенерировать в хелпере KEYSTORE_SET.
5. Добавить секрет репозитория KEYSTORE_SET со значением выше (Repository secret, не путать с Environment secret) <https://github.com/simgislab/AndroidAPS/settings/secrets/actions>.
6. Сделать в хелпере Google Drive Auth, нажать Start Auth, выбрать аккаунт, принять предупреждение.
7. Добавить секрет репозитория GDRIVE_OAUTH2 со значением (Repository secret, не путать с Environment secret) <https://github.com/simgislab/AndroidAPS/settings/secrets/actions>.
8. Выбрать Actions в репозитории с форком (или перейти по ссылке <https://github.com/simgislab/AndroidAPS/actions>)
9. All workflows -> AAPS CI -> Run workflow. Branch: master, Build: FullRelease
10. Дождитесь результата, файл APK появится в [личном Google Drive](https://drive.google.com/drive/my-drive), в папке AAPS.

Примечания:

* Видео-превью в [официальной документации](https://androidaps.readthedocs.io/en/latest/SettingUpAaps/BrowserBuild.html) требуют VPN.
* Ошибка "There was a problem while parsing the package" при установке означает, что вы пытаетесь установить из APK на телефоне со старой (неподдерживаемой) версией операционной системы Android - найдите другое, более современное устройство.

### Обновление сборки Android AAPS

При условии, что успешно выполнено всё, что выше.

1. В репозитории форка выбрать Sync fork
2. Выбрать Actions в репозитории с форком (или перейти по ссылке <https://github.com/simgislab/AndroidAPS/actions>)
3. All workflows -> AAPS CI -> Run workflow. Branch: master, Build: FullRelease
4. Дождитесь результата, файл APK появится в [личном Google Drive](https://drive.google.com/drive/my-drive), в папке AAPS.

Примечания:

* Замечено периодическое падение сборки на этапе Build APKs, 403 ошибки gradle. Помогает простой перезапуск сборки.

## Настройки

### Профиль

Основные параметры которые нужно знать и указать ([официальная документация](https://androidaps.readthedocs.io/en/latest/SettingUpAaps/SetupWizard.html#profile)).

**DIA** (duration of insulin action) - время необходимое, чтобы закончилось действие инсулина.

**Glucose target** (BG target) -  желаемый диапазон сахара, AAPS будет действовать, если его предсказания буду показывать что сахар выходит за этот диапазон.

**BR** (basal rate, units/hour) - поставка фонового инсулина, стабилизирует уровень сахара в отсутствии еды или упражнений.

**ISF** (insulin sensitivity factor, correction factor) - на сколько снизится уровень сахара в крови на одну единицу инсулина.

    autotune: 4 mmol/L

**IC or ICR** (insulin-to-carb ratios) - сколько грамм углеводов покрывается одной единицей инсулина.

    autotune: 10 g/U

### Связь с Nightscout

* Версия Nightscout: 14.2.6 (2022, версия на 10.2025 - 15.0.3)
* AAPS 3.3.2.1 (требуемая версия Android 11 и выше). Эта версия не совместима с 14.2.6, не важно v1 или v3.

Чем отличается [V3 от V1](https://androidaps.readthedocs.io/en/latest/Maintenance/ReleaseNotes.html#important-comments-on-using-v3-versus-v1-api-for-nightscout-with-aaps).

### Перенос настроек

Примечания:

* Чтобы файл json с настройками увидело приложение, он должен лежать в подпапке preferences.
* При восстановлени настроек из json - профиль не будет подхвачен автоматически. Чтобы он подхватился нужно после импорта настроек его активировать или выбрать через Setup Wizard.

### Objectives/Цели

### Objective 1

Чтобы пройти задачу "Pump status available in NS or Tidepool" нужно чтобы в сборке NightScout был pump и другие переменные описанные в [настройках](https://androidaps.readthedocs.io/en/latest/SettingUpAaps/Nightscout.html#manual-nightscout-setup). Если их нет, то требуется изменение переменных среды и пересборка.

### Objective 2

Display the Loop plugin’s content. Этот раздел это не раздел в Config builder, в нем всегда включенная и засеренная галка и пустой раздел настройки. Чтобы пройти задачу, нужно нажать гамбургер и выбрать Loop там.

## Medtronic, RileyLink, AAPS

Официальная инструкция на [androidaps.readthedocs.io](https://androidaps.readthedocs.io/en/latest/CompatiblePumps/MedtronicPump.html).

* Medtronic 722, Worldwide (868 Mhz)
* [RileyLink 916MHz (Medtronic) to BLE Bridge](https://getrileylink.org/product/rileylink916) (также можно OrangeLink, EmaLink)

![medtronic722.png](medtronic722.png "Medtronic 722WWS")

Детали:

* Не хотело коннектиться при первичной установке (переходе с Virtual pump на Medtronic). Помогло отключить Bluetooth, отключить райли, перезапустить помпу, запустить все обратно.
* Не хотело коннектиться при перестановке сенсора. Помогло отключить Bluetooth, подождать 10 секунд, включить. Райли загорелся зеленым.
* Райли при включении - мигает синим.
* Райли при успешном подключении к помпе - включает зеленый свет.

## Батареи и заряды в AAPS

В программе несколько мест, где нужно смотреть смотреть состояние батарей:

1. Батарея сенсора (sensor battery level) --- уровень заряда сенсора в %, есть в сенсорах работающих с передатчиком, например MiaoMiao.
2. Возраст сенсора (sensor age, SAGE) --- сколько времени отработал сенсор. Пример: 2d1h.
3. Батарея помпы (pump battery level) --- уровень заряда помпы в %.
4. Возраст батареи помпы (pump battery age) --- сколько времени прошло с замены батареи. Пример: 0d5h.

![Home2020_StatusLights.webp](Home2020_StatusLights.webp)

На картинке: первое справа - 3 и 4, второе справа - 2.

Уровень заряда помпы и возраст батареи помпы в AAPS показываются вместе (3 и 4), например: 0d5h 92%. В AAPSClient возраст батареи помпы показывается в строке с другими статусами, а уровень заряда в % в желтой строке ниже.

Сам Riley не передает свой уровень заряда батареи, поэтому его нужно периодически заряжать. Рекомендуют раз в сутки, обычно заряда хватает на 36 часов. Когда заряд полный, гаснет красная лампочка.

## XDrip+ и Libre 1

[Официальный сайт](https://jamorham.github.io/#xdrip-plus) XDrip+.

XDrip+ устанавливается из [последней ночной сборки](https://xdrip-plus-updates.appspot.com/stable/xdrip-plus-latest.apk).

При подключении выбирается Libre, потом Bluetooth Bride и выбирается соединение с miaomiao (должен быть включен). [Хорошая инструкция](https://miaomiao.cool/pages/how-to-use-miaomiao-with-xdrip) по использованию XDrip+ c Libre 1 через miaomiao.

Для полного включения понадобится подождать несколько минут, пока XDrip+ получит несколько значений.

При вводе калибровки может понадобится переключиться на mmol/L.

## XDrip+, Juggluco и Libre 2

Первая установка, первый сенсор:

* Регистрируемся на libreview.ru
* Ставим на отдельный телефон официальное приложение Free Style Libre 2 - RU (важно)
* Входим с созданной учетной записью
* Включаем, если отключен NFC
* Активируем сенсор официальным приложением и ждем 60 мин пока пойдут значения в официальное приложение.
* После того как значения пошли - отбираем у приложения все разрешения.
* Переключаем XDrip+ на получение данных через Libre (patched App).
* Устанавливаем Juggluco 10.3.11 ([официальный сайт](https://www.juggluco.nl/Juggluco/index.html), [все версии](https://drive.google.com/drive/folders/1qysiLYb2e93WBMjC9MYCqEdW-gGDUb2n), скачать 10.3.11)

Действия при установке следующего сенсора:

* Устанавливаем новый сенсор
* Отбираем у XDrip+ разрешения: Nearby devices: Allow -> Don't allow
* Отбираем у Juggluco разрешения: Nearby devices: Allow -> Don't allow
* Выгружаем оба приложения из памяти
* Возвращаем право Nearby devices: Allow Free Style Libre 2
* Сканируем сенсор, должно выдаться сообщение о том, что сенсор новый, жмем New
* Сканируем еще раз сенсор, активируем, ждем 60 минут, должны пойти значения.
* Отбираем у Free Style Libre 2 разрешения: Nearby devices: Allow -> Don't allow, лучше так же отключить Уведомления.
* Возвращаем XDrip+ и Juggluco разрешения: Nearby devices: Don't allow -> Allow
* Сканируем Juggluco сенсор, подтверждаем, разрешаем добавить в календарь, запоминаем последние две буквы. Если говорит Try again, пробуем еще.
* Сканируем Juggluco еще раз для начала работы, покажет значение.
* Вызываем настройки Juggluco нажатием слева, нажимаем на Sensor, выбираем новый сенсор.
* Открываем XDrip+, в нем все должно подхватиться автоматически.
* Райли должен гореть зеленым. Если не горит, на телефоне отключаем Bluetooth, ждем 10 сек, включаем обратно. Проверяем выбрав в главном меню AAPS - Medtronic, первая запись должна быть Connected.

## Juggluco и проблемы с Bluetooth

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
> Permission: Previous versions of Juggluco required location permission to find the device address of the sensor. This is no longer necessary for the sensors I use. Maybe there are still sensors out there for which it is necessary; in that case you can turn it on. After the first contact Juggluco http://127.0.0.1:17580/hallo/x/stream saves the device address and location permission is always useless. The device address, if known, is displayed after the sensor identifier. Red means a US-like sensor. Android 12 has a new Nearby devices permission, which can be used instead of location permission for searching for a Bluetooth device address, but it is also needed for later contact with Bluetooth devices.
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

## Nighscout

### Обновление Nighscout в Railway

Если форк очень долго не обновлялся - недостаточно сделать Sync Fork и Redeploy.

Самый надежный способ - сделать копию master ветки, например в master2 и перенацелить на нее deployment в Railway. После этого обязательно нажать Deploy в маленьком всплывающем окне.

### Соединение с XDrip+

Settings - Data Sync - Cloud Upload - Nightscout Sync (REST-API)

Детали:

* Включить REST API
* Use mobile data
* Base URL: <https://password@hostname/api/v1/>, обязательно нужен слэш в конце. Обратить внимание, что если просто использовать эту ссылку в браузере, то он ответит Cannot GET /api/v1/ (но работать будет)

## Комментарии

[**Обсудить**](https://t.me/answer42geo/131)
