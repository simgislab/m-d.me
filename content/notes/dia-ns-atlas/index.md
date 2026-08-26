---
title: "Освобождение места MongoDB для NightScout"
date: "2026-08-25"
summary: "Как освободить место в MongoDB Atlas M0 после удаления старых данных через Nightscout."
description: "Как освободить место в MongoDB Atlas M0 после удаления старых данных через Nightscout."
toc: true
autonumber: false
math: false
tags: ["Диа"]
showTags: true
hideBackToTop: false
fediverse: "@username@instance.url"
---

## Введение

Если вы используете Nightscout с MongoDB Atlas Free Tier (M0), то рано или поздно возникнет проблема места. На Free Tier доступно 512 MB.

По мере наполнения база приближается к лимиту. Вы удаляете старые записи через административный интерфейс Nightscout, однако размер базы в Atlas почти не уменьшается или даже увеличивается. Рано или поздно Atlas заблокирует запись в базу. NS перестает работать, отправка данных в AAPS становится в очередь.

```text
you are over your space quota
Writes are blocked on your cluster
```

Причина может быть не в самих данных, а в индексах MongoDB.

После удаления большого количества документов WiredTiger в M0 сохранит значительный объём пространства внутри существующих индексов. Индексы постепенно станут огромными, значительно больше, чем заново построенные индексы для того же набора документов.

В реальном случае с Nightscout было:

```text
dataSize:   242 MiB
indexSize:  311 MiB
```

То есть индексы занимали больше места, чем сами данные!

После последовательного удаления и создания тех же индексов заново:

```text
dataSize:   244 MiB
indexSize:  108 MiB
```

Количество индексов осталось тем же, данные не удалялись, но было освобождено около **200 MiB**.

Как диагностировать и исправить проблему - ниже.

---

## 1. Подключение к MongoDB Atlas через mongosh

В MongoDB Atlas открываем:

```text
Database → Connect → MongoDB Shell
```

Atlas даст ссылку на скачивание mongosh, а потом покажет команду примерно такого вида:

```bash
mongosh "mongodb+srv://cluster0.example.mongodb.net/" --apiVersion 1 --username USERNAME
```

После подключения посмотри список баз:

```javascript
show dbs
```

Например:

```text
heroku_gl409cbt  432.95 MiB
```

Переключись на базу Nightscout:

```javascript
use heroku_gl409cbt
```

Разумеется, вместо `heroku_gl409cbt` нужно использовать имя своей базы.

Проверь коллекции:

```javascript
show collections
```

Обычно Nightscout содержит:

```text
activity
auth_roles
auth_subjects
devicestatus
entries
food
profile
settings
treatments
```

## 2. Проверка общего размера базы

Выполняем:

```javascript
db.stats(1024 * 1024)
```

Например:

```javascript
{
  dataSize: Long('242'),
  storageSize: Long('121'),
  indexes: 56,
  indexSize: Long('311'),
  ...
}
```

Для Atlas M0 особенно интересны:

```text
dataSize
indexSize
indexes
objects
```

При диагностике проблемы с квотой удобно ориентироваться на:

```text
dataSize + indexSize
```

Например:

```text
242 + 311 = 553 MiB
```

Это уже больше лимита M0 в 512 MB.

`storageSize` здесь не следует путать с `dataSize`: WiredTiger сжимает данные, поэтому физическое хранилище коллекций может быть значительно меньше логического размера.

---

## 3. Найти коллекцию, занимающую место

У Nightscout основной объём обычно приходится на:

```text
entries
devicestatus
treatments
```

Можно получить размеры всех коллекций:

```javascript
db.getCollectionNames().forEach(c => {
    const s = db.runCommand({
        collStats: c,
        scale: 1024 * 1024
    });

    print(
        c,
        "| count:", s.count,
        "| data:", s.size, "MiB",
        "| storage:", s.storageSize, "MiB",
        "| indexes:", s.totalIndexSize, "MiB"
    );
});
```

Пример проблемной базы:

```text
devicestatus | count: 74900  | data: 117 MiB | storage: 31 MiB | indexes: 12 MiB
treatments   | count: 19119  | data:   4 MiB | storage:  1 MiB | indexes:  3 MiB
entries      | count: 489188 | data: 120 MiB | storage: 88 MiB | indexes: 295 MiB
```

Очевидно, что проблема здесь в индексах `entries`.

---

## 4. Проверить размеры индексов entries

Выполняем:

```javascript
db.entries.stats()
```

В конце вывода будет:

```javascript
indexSizes: {
    _id_: 48050176,
    type_1: 18386944,
    identifier_1: 18042880,
    'type_1_date_-1_dateString_1': 43540480,
    mbg_1: 18022400,
    sysTime_1: 38334464,
    srvModified_1: 18030592,
    date_1: 26439680,
    isValid_1: 18051072,
    dateString_1: 38477824,
    sgv_1: 24432640
}
```

Размеры здесь указаны в байтах.

Например:

```text
dateString_1 ≈ 37 MiB
sgv_1        ≈ 23 MiB
date_1       ≈ 25 MiB
```

---

## 5. Обязательно сохранить определения индексов

Перед любыми изменениями выполняем:

```javascript
db.entries.getIndexes()
```

И сохрани вывод в файл

Например:

```javascript
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { type: 1 }, name: 'type_1' },
  { v: 2, key: { identifier: 1 }, name: 'identifier_1' },
  { v: 2, key: { type: 1, date: -1, dateString: 1 }, name: 'type_1_date_-1_dateString_1' },
  { v: 2, key: { mbg: 1 }, name: 'mbg_1' },
  { v: 2, key: { sysTime: 1 }, name: 'sysTime_1' },
  { v: 2, key: { srvModified: 1 }, name: 'srvModified_1' },
  { v: 2, key: { date: 1 }, name: 'date_1' },
  { v: 2, key: { isValid: 1 }, name: 'isValid_1' },
  { v: 2, key: { dateString: 1 }, name: 'dateString_1' },
  { v: 2, key: { sgv: 1 }, name: 'sgv_1' }
]
```

Не следует копировать определения индексов из этой инструкции вслепую. Используй именно определения, которые показывает:

```javascript
db.entries.getIndexes()
```

для твоей базы и версии Nightscout.

---

## 6. Никогда не удалять `_id_`

Индекс:

```text
_id_
```

не трогаем.  Это системный обязательный индекс MongoDB. Перестраиваются только вторичные индексы.

---

## 7. Перестраиваем индексы по одному

Идея проста:

старый раздутый индекс -> dropIndex() -> createIndex() -> новый компактный индекс

Например для `sgv_1`:

```javascript
db.entries.dropIndex("sgv_1")
```

затем:

```javascript
db.entries.createIndex({ sgv: 1 })
```

После этого проверить:

```javascript
db.entries.stats().indexSizes
```

и:

```javascript
db.stats(1024 * 1024)
```

В реальном случае:

```text
sgv_1

до:    ~23 MiB
после:  ~3 MiB
```

---

## 8. Примеры перестройки других индексов

Ещё раз: определения должны соответствовать результату `getIndexes()`.

### type

```javascript
db.entries.dropIndex("type_1")
```

```javascript
db.entries.createIndex({ type: 1 })
```

В рассматриваемом случае:

```text
~18 MiB → ~2 MiB
```

### date

```javascript
db.entries.dropIndex("date_1")
```

```javascript
db.entries.createIndex({ date: 1 })
```

Результат:

```text
~25 MiB → ~6 MiB
```

### dateString

```javascript
db.entries.dropIndex("dateString_1")
```

```javascript
db.entries.createIndex({ dateString: 1 })
```

Результат:

```text
~37 MiB → ~11 MiB
```

### identifier

```javascript
db.entries.dropIndex("identifier_1")
```

```javascript
db.entries.createIndex({ identifier: 1 })
```

Результат:

```text
~17 MiB → ~2 MiB
```

### srvModified

```javascript
db.entries.dropIndex("srvModified_1")
```

```javascript
db.entries.createIndex({ srvModified: 1 })
```

Результат:

```text
~17 MiB → ~2 MiB
```

### Составной индекс

Если `getIndexes()` показывает:

```javascript
{
    key: {
        type: 1,
        date: -1,
        dateString: 1
    },
    name: "type_1_date_-1_dateString_1"
}
```

его можно перестроить:

```javascript
db.entries.dropIndex("type_1_date_-1_dateString_1")
```

затем:

```javascript
db.entries.createIndex({
    type: 1,
    date: -1,
    dateString: 1
})
```

---

## 9. Что делать, если Atlas уже заблокировал запись

Важная особенность M0.мЕсли Atlas уже сообщает:

```text
you are over your space quota
Writes are blocked on your cluster
```

то может возникнуть такая ситуация:

```javascript
db.entries.dropIndex("sgv_1")
```

успешно выполняется, но:

```javascript
db.entries.createIndex({ sgv: 1 })
```

возвращает:

```text
MongoServerError[AtlasError]:
you are over your space quota...
Writes are blocked on your cluster.
```

То есть индекс уже удалён, но Atlas не позволяет создать его заново. В таком случае не нужно продолжать многократно выполнять `createIndex()`. Нужно сначала освободить достаточно места. Для этого можно временно удалить несколько вторичных индексов, определения которых предварительно сохранены через:

```javascript
db.entries.getIndexes()
```

Например:

```javascript
db.entries.dropIndex("type_1")
db.entries.dropIndex("mbg_1")
db.entries.dropIndex("isValid_1")
db.entries.dropIndex("sysTime_1")
```

Удаление обычного неуникального индекса **не удаляет документы Nightscout**.

Оно может временно ухудшить производительность некоторых запросов, но сами данные остаются в базе.

После этого проверить:

```javascript
db.stats(1024 * 1024)
```

Когда база окажется достаточно ниже лимита и Atlas снимет write-block, индексы можно начать восстанавливать.

---

## 10. Проверить, что данные снова поступают в Nightscout

Самый простой признак — посмотреть:

```javascript
db.stats(1024 * 1024)
```

и обратить внимание на:

```text
objects
```

Если через некоторое время число увеличивается:

```text
583246
583286
583547
...
```

значит в Nightscout снова поступают данные. Например их снова пишет AAPS.

Можно также выполняемть тестовую запись:

```javascript
db.getCollection("__quota_test").insertOne({ test: 1 })
```

Если получено:

```text
acknowledged: true
```

запись разрешена.

Тестовую коллекцию после этого удалить:

```javascript
db.getCollection("__quota_test").drop()
```

---

## 11. Восстановить все штатные индексы

После появления достаточного запаса необходимо восстановить все индексы, которые были временно удалены.

Например:

```javascript
db.entries.createIndex({ mbg: 1 })
db.entries.createIndex({ sysTime: 1 })
db.entries.createIndex({ isValid: 1 })
```

Но ориентироваться надо на сохранённый результат:

```javascript
db.entries.getIndexes()
```

В итоге количество индексов должно совпасть с первоначальным.

Например:

```text
до:    indexes: 56
после: indexes: 56
```

---

## 12. Итоговая проверка

Проверить общий размер:

```javascript
db.stats(1024 * 1024)
```

И размеры индексов `entries`:

```javascript
db.entries.stats().indexSizes
```

В рассматриваемом случае до обслуживания было:

```text
dataSize:   242 MiB
indexSize:  311 MiB
-------------------
~553 MiB
```

После перестройки индексов:

```text
dataSize:   244 MiB
indexSize:  108 MiB
-------------------
~352 MiB
```

Количество индексов:

```text
56 → 56
```

То есть индексы не были просто удалены ради экономии места — они были восстановлены, но уже в компактном состоянии.

Только для коллекции `entries`:

```text
индексы до:    ~295 MiB
индексы после:  ~92 MiB
```

Экономия составила примерно:

```text
~203 MiB
```

при практически неизменном объёме самих данных.

---

## 13. Как понять, что проблема повторилась

Периодически можно выполнять:

```javascript
db.stats(1024 * 1024)
```

Если при относительно стабильном объёме данных:

```text
dataSize
```

начинает сильно расти:

```text
indexSize
```

стоит посмотреть:

```javascript
db.entries.stats().indexSizes
```

и сравнить размеры отдельных индексов с предыдущими значениями.

Например после обслуживания нормальные размеры выглядели так:

```javascript
{
  _id_: 32833536,
  sgv_1: 3452928,
  type_1: 2338816,
  date_1: 6647808,
  dateString_1: 11264000,
  identifier_1: 2232320,
  'type_1_date_-1_dateString_1': 20021248,
  srvModified_1: 2215936,
  mbg_1: 2215936,
  sysTime_1: 11128832,
  isValid_1: 2215936
}
```

Этот вывод удобно сохранить как контрольную точку.

---

## Вывод

Если после удаления старых данных Nightscout размер MongoDB Atlas M0 почти не уменьшается, не нужно продолжать удалять историю.

Сначала стоит проверить:

```javascript
db.stats(1024 * 1024)
```

Если большую часть базы занимают индексы (indexSize) и `entries.stats()` показывает очень крупные старые индексы, причиной могут быть раздутые индексы WiredTiger.

В таком случае последовательная перестройка индексов: dropIndex() → createIndex(). Перестройка может освободить сотни мегабайт, сохранив:

* все данные Nightscout;
* все необходимые индексы;
* ту же структуру базы;
* ту же функциональность Nightscout.

Основной подход: **сначала сохранить `getIndexes()`, не трогать `_id_` и перестраивать индексы по одному.**

## Вопросы?

Возникли вопросы, комментарии или есть полезная информация по теме заметки?

Можно [**написать в телеграм**](https://t.me/answer42geo/131) или оставить вопрос в форме ниже.
