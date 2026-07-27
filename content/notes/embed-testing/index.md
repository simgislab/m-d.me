---
title: "Тестирование iframe embed"
date: "2025-07-13"
summary: "Тестирование встраиваемых карт и вьюверов внешних данных."
description: "Тестирование встраиваемых карт и вьюверов внешних данных."
toc: true
autonumber: false
math: false
tags: ["Инструменты"]
showTags: true
hideBackToTop: false
fediverse: "@username@instance.url"
---

## Введение

Дайте время загрузиться всем эмбедам.

Должно красиво работать и на десктопе и в мобильном браузере.

Если embed-код предлагает только фиксированный размер в пикселях, нужно прописать width в процентах, например так: width:100%.

В meta темы должно обязательно быть такое:

```text
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## Веб-карта из NGW

<iframe src="https://maxim.nextgis.com/resource/8282/display/tiny?angle=0&zoom=16&styles=8284%2C8320%2C8281%2C8287%2C8322&linkMainMap=true&events=false&panel=none&controls=id%2Cmd%2Czi%2Czo%2Cml&panels=layers%2Cidentify&base=blank&lon=76.8699&lat=42.6366" style="overflow:hidden;height:600px;width:100%;background:white;border:1px dotted gray" height="600" width="100%"></iframe>

[Веб-карта на NextGIS Web](https://maxim.nextgis.com/resource/8282/display??angle=0&zoom=16&styles=8284%2C8320%2C8281%2C8287%2C8322&linkMainMap=true&events=false&panel=none&controls=id%2Cmd%2Czi%2Czo%2Cml&panels=layers%2Cidentify&base=blank&lon=76.8699&lat=42.6366).

## Sketchfab model

<iframe title="Issyk-Kul Ornok petroglyph 20250701-10-46 v1" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/2228ffc1e9f148d296a921ca38f19ceb/embed" style="width: 100%;height: 600px;"> </iframe>

[Модель на Sketchfab](https://sketchfab.com/3d-models/issyk-kul-ornok-petroglyph-20250701-10-46-v1-2228ffc1e9f148d296a921ca38f19ceb).

## Вопросы?

Возникли вопросы, комментарии или есть полезная информация по теме заметки?

Можно [**написать в телеграм**](https://t.me/answer42geo/110) или оставить вопрос в форме ниже.
