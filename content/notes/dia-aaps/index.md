---
title: "Сборка AAPS"
date: "2025-10-24"
summary: "Сборка приложения AAPS для Android для мониторинга сахара в крови."
description: "Сборка приложения AAPS для Android для мониторинга сахара в крови."
toc: true
autonumber: false
math: false
tags: ["Диа"]
showTags: true
hideBackToTop: false
fediverse: "@username@instance.url"
---

## Введение

Инструкция по получению APK AndroidAPS на стационарном компьютере (не телефоне) с минимальными усилиями. Без установки Android Studio в браузере, с помощью Github Actions.

[Официальная инструкция по сборке в браузере](https://androidaps.readthedocs.io/en/latest/SettingUpAaps/BrowserBuild.html).

## Перед началом работы

* Аккаунт на [Github](https://github.com)
* Аккаунт на Google (если есть почта на gmail, то аккаунт уже есть)
* Установить VSCode + расширение Live server

## Инструкция по сборке

1. Сделать Fork репозитория приложения AAPS https://github.com/simgislab/AndroidAPS
2. [Скачать](https://github.com/nightscout/aaps-ci-preparation/releases/download/release-v1.1.2/aaps-ci-preparation.html) aaps-ci-preparation.html. Это страница-хелпер которая поможет сгенерировать KEYSTORE_SET и GDRIVE_OAUTH2.
3. Открыть в VSCode и запустить страницу в Live server.
4. Сгенерировать в хелпере KEYSTORE_SET.
5. Добавить секрет репозитория KEYSTORE_SET со значением выше (Repository secret, не путать с Environment secret) https://github.com/simgislab/AndroidAPS/settings/secrets/actions.
6. Сделать в хелпере Google Drive Auth, нажать Start Auth, выбрать аккаунт, принять предупреждение.
7. Добавить секрет репозитория GDRIVE_OAUTH2 со значением (Repository secret, не путать с Environment secret) https://github.com/simgislab/AndroidAPS/settings/secrets/actions.
8. Выбрать Actions в репозитории с форком (или перейти по ссылке https://github.com/simgislab/AndroidAPS/actions)
9. All workflows -> AAPS CI -> Run workflow. Branch: master, Build: FullRelease
10. Дождите результата, файл APK появится в личном Google Drive, в папке AAPS https://drive.google.com/drive/my-drive

Примечания:

* Видео-превью в [официальной документации](https://androidaps.readthedocs.io/en/latest/SettingUpAaps/BrowserBuild.html) требуют VPN.
* Ошибка "There was a problem while parsing the package" при установке означает, что вы пытаетесь установить из APK на телефоне со старой (неподдерживаемой) версией операционной системы Android - найдите другое, более современное устройство.


## Комментарии

[**Обсудить**](https://t.me/answer42geo/128)
