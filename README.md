# svelte-intl-universal

![npm bundle size](https://img.shields.io/bundlephobia/minzip/svelte-intl-universal)![npm](https://img.shields.io/npm/v/svelte-intl-universal)

**The simplest internationalization solution for svelte(or others.)**


> `svelte-intl-universal` is benefit and modified from [react-intl-universal](https://github.com/alibaba/react-intl-universal) and provides the simplest operation to support svelte application to achieve internationalization (not only svelte application can be used)

## Features

- Simple, Simple, Simple
- Display numbers, currency, dates and times for different locales.
- Pluralize labels in strings.
- Support variables in message.
- Runs in the browser and Node.js.
- Message format is strictly implemented by ICU standards.
- Locale data in nested JSON format are supported.

## Usage

### Install

```shell
npm i svelte-intl-universal
```

### Base Example
```js
<script>
import { onMount } from 'svelte'
import intl from 'svelte-intl-universal'

const locales = {
  "en-US": require('./locales/en-US.js'),
  "zh-CN": require('./locales/zh-CN.js'),
}

export let lang = 'zh-CN'
export let loadingLang = true

function loadLocales() {
  intl.init({
    currentLocale: lang,
    locales,
  })

  loadingLang = false
}

onMount(() => {
  loadLocales()
})
</script>

{#if !loadingLang}
  <h1>{intl.get('banner.title')}</h1>
{/if}
```

### Init options

- currentLocale: the current locale string, such as 'en-US'
- fallbackLocale: a fallback locale string used when no currentLocale matched
- escapeHtml: should escape the html string? default true
- locales: your locales object, like '{ en-US: { ... } }'
- formats: intl-messageformat advanced useage, more detail [here](https://formatjs.io/docs/intl-messageformat)
- options: intl-messageformat advanced useage, more detail [here](https://formatjs.io/docs/intl-messageformat)

### Html string

Thanks to svelte’s `@html` design, we can directly use it like this

```js
// en-US.js
export default ({
  title: "'<h1>'{title}'</h1>'"
})

// some-component.svelte
<script>
import intl from 'svelte-intl-universal'
export let title = 'Some Title'
</script>

<div class='title'>
  {@html intl.get('title', { title })}
<div>
```

**NOTICE**: `"'<h1>'{title}'</h1>'"` the `<h1>` tag was wrapped by apostrophe，more in [intl-messageformate](https://formatjs.io/docs/intl-messageformat/#formatvalues-method)

### Message With Variables

> more advanced details in [intl-messageformat](https://formatjs.io/docs/intl-messageformat)

1. plural labels

```js
// en-US.js
export default ({
  photos: `You have {numPhotos, plural,
      =0 {no photos.}
      =1 {one photo.}
      other {# photos.}
    }`
})

// some-component.svelte
<h1>{ intl.get('photos', { numPhotos: 1000 }) }</h1> // You have 1,000 photos.
<h1>{ intl.get('photos', { numPhotos: 0 }) }</h1> // You have no photos.
<h1>{ intl.get('photos', { numPhotos: 1 }) }</h1> // You have one photos.
```

2. Date/Time/Number Skeleton

```js
export default ({
  price: 'The price is: {price, number, ::currency/EUR}'
})

<h1>{intl.get('price', { price: 100 })}</h1> // The price is: €100.00
```

### Default Message

When the specific key does't exist in current locale, you may want to make it return a default message.

```js
intl.get(key: string, vars: IObject, defaultMsg: string = '')

// or you can just ignore the vars
intl.get(key: string, defaultMsg: string = '')
```

## Online DEMO

[simple demo 01](https://codesandbox.io/s/hardcore-morse-71w94?file=/App.svelte:472-520)

## License

MIT
