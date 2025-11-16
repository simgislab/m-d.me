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

Инструкции и заметки по сборке и настройке AndroidAPS (AAPS).

## Сборка приложения

Инструкция по получению APK AndroidAPS на стационарном компьютере (не телефоне) с минимальными усилиями. Без установки Android Studio в браузере, с помощью Github Actions.

[Официальная инструкция по сборке в браузере](https://androidaps.readthedocs.io/en/latest/SettingUpAaps/BrowserBuild.html).

### Что нужно для сборки приложения

* Аккаунт на [Github](https://github.com)
* Аккаунт на Google (если есть почта на gmail, то аккаунт уже есть)
* Установить VSCode + расширение Live server

### Инструкция по сборке Android AAPS

1. Сделать Fork репозитория приложения AAPS <https://github.com/simgislab/AndroidAPS>
2. [Скачать](https://github.com/nightscout/aaps-ci-preparation/releases/download/release-v1.1.2/aaps-ci-preparation.html) aaps-ci-preparation.html. Это страница-хелпер которая поможет сгенерировать KEYSTORE_SET и GDRIVE_OAUTH2.
3. Открыть в VSCode и запустить страницу в Live server.
4. Сгенерировать в хелпере KEYSTORE_SET.
5. Добавить секрет репозитория KEYSTORE_SET со значением выше (Repository secret, не путать с Environment secret) <https://github.com/simgislab/AndroidAPS/settings/secrets/actions>.
6. Сделать в хелпере Google Drive Auth, нажать Start Auth, выбрать аккаунт, принять предупреждение.
7. Добавить секрет репозитория GDRIVE_OAUTH2 со значением (Repository secret, не путать с Environment secret) <https://github.com/simgislab/AndroidAPS/settings/secrets/actions>.
8. Выбрать Actions в репозитории с форком (или перейти по ссылке <https://github.com/simgislab/AndroidAPS/actions>)
9. All workflows -> AAPS CI -> Run workflow. Branch: master, Build: FullRelease
10. Дождите результата, файл APK появится в [личном Google Drive](https://drive.google.com/drive/my-drive), в папке AAPS.

Примечания:

* Видео-превью в [официальной документации](https://androidaps.readthedocs.io/en/latest/SettingUpAaps/BrowserBuild.html) требуют VPN.
* Ошибка "There was a problem while parsing the package" при установке означает, что вы пытаетесь установить из APK на телефоне со старой (неподдерживаемой) версией операционной системы Android - найдите другое, более современное устройство.

## Настройки

### Профиль

Основные параметры которые нужно знать и указать ([официальная документация](https://androidaps.readthedocs.io/en/latest/SettingUpAaps/SetupWizard.html#profile)).

**DIA** (duration of insulin action) - время необходимое, чтобы закончилось действие инсулина.

**Glucose target** (BG target) -  желаемый диапазон сахара, AAPS будет действовать, если его предсказания буду показывать что сахар выходит за этот диапазон.

**BR** (basal rate, units/hour) - поставка фонового инсулина, стабилизирует уровень сахара в отсутствии еды или упражнений.

**ISF** (insulin sensitivity factor, correction factor) - на сколько снизится уровень сахара в кроме на одну единицу инсулина.

    autotune: 4 mmol/L

**IC or ICR** (insulin-to-carb ratios) - сколько грамм углеводов покрывается одной единицей инсулина.

    autotune: 10 g/U

### Связь с Nightscout

* Версия Nightscout: 14.2.6 (2022, версия на 10.2025 - 15.0.3)
* AAPS 3.3.2.1 (требуемая версия Android 11 и выше). Эта версия не совместима с 14.2.6, не важно v1 или v3.

Чем отличается [V3 от V1](https://androidaps.readthedocs.io/en/latest/Maintenance/ReleaseNotes.html#important-comments-on-using-v3-versus-v1-api-for-nightscout-with-aaps).

## XDrip+ и Libre 1

[Официальный сайт](https://jamorham.github.io/#xdrip-plus) XDrip+.

XDrip+ устанавливается из [последней ночной сборки](https://xdrip-plus-updates.appspot.com/stable/xdrip-plus-latest.apk).

При подключении выбирается Libre, потом Bluetooth Bride и выбирается соединение с miaomiao (должен быть включен). 

Для полного включения понадобится подождать несколько минут, пока XDrip+ получит несколько значений.

При вводе калибровки может понадобится переключиться на mmol/L.

## Nighscout

### Обновление Nighscout в Railway

Если форк очень долго не обновлялся - недостаточно сделать Sync Fork и Redeploy.

Самый надежный способ - сделать копию master ветки, например в master2 и перенацелить на нее deployment в Railway. После этого обязательно нажать Deploy в маленьком всплывающем окне.

### Соединение с XDrip+

Settings - Data Sync - Cloud Upload - Nightscout Sync (REST-API)

Детали:

* Включить REST API
* Use mobile data
* Base URL: https://password@hostname/api/v1/, обязательно нужен слэш в конце. Обратить внимание, что если просто использовать эту ссылку в браузере, то он ответит Cannot GET /api/v1/ (но работать будет)


## Комментарии

[**Обсудить**](https://t.me/answer42geo/131)
