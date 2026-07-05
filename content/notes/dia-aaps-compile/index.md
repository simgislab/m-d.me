---
title: "Сборка приложения AAPS"
date: "2025-10-24"
summary: "Сборка приложения AAPS в браузере."
description: "Сборка приложения AAPS в браузере."
toc: true
autonumber: false
math: false
tags: ["Диа"]
showTags: true
hideBackToTop: false
fediverse: "@username@instance.url"
---

## Введение

Инструкция по сборке AndroidAPS (AAPS) своими руками.

## Сборка приложения AAPS

Инструкция по получению APK AndroidAPS на стационарном компьютере (не телефоне) с минимальными усилиями. Без установки Android Studio. В браузере, с помощью Github Actions.

[Официальная инструкция по сборке в браузере](https://androidaps.readthedocs.io/en/latest/SettingUpAaps/BrowserBuild.html).

### Перед началом

* Заведите аккаунт на [Github](https://github.com)
* Заведите аккаунт в Google (если есть почта на gmail, то аккаунт уже есть)
* Установить [VS Code](https://code.visualstudio.com/download) + расширение Live server

### Первичная сборка Android AAPS

Здесь во всех ссылках на Github - simgislab это мой аккаунт, у вас должен быть свой, вы получите его после регистрации. Ссылки на github.com приведены для примера, у вас должны получиться аналогичные, но с вашим аккаунтом.

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

1. В репозитории форка <https://github.com/simgislab/AndroidAPS> выбрать Sync fork
2. Нажать Update branch.
3. В репозитории с форком в верхнем меню выбрать Actions или перейти по ссылке <https://github.com/simgislab/AndroidAPS/actions>
4. В левой панели: All workflows -> AAPS CI. Справа кнопка: Run workflow. Branch: master, Version: текущая версия AAPS, Build: FullRelease
5. Ждем около 5 минут. Статус должен смениться с желтого на зеленый.
6. файл APK появится в [личном Google Drive](https://drive.google.com/drive/my-drive), в папке AAPS.

Примечания:

* Замечено периодическое падение сборки на этапе Build APKs, 403 ошибки gradle. Помогает простой перезапуск сборки.

## Обсуждение

[**Остались вопросы?**](https://t.me/answer42geo/131)
