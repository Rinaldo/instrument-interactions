# Instrument Interactions

`npm install instrument-interactions`

**Automatically record user interactions with no configuration required**

Instrument Interactions records click and change events on all interactive elements. Instead of maintaining a list of elements to instrument, just instrument every button, link, tab, checkbox, etc so all new features and changes have analytics automatically.

## Usage

The `instrumentClicks` function adds a global click handler that walks up the DOM tree on each click to see if the clicked element is a child of a button, link, etc. This way if a click event is fired on a span within a link, the `onInteraction` callback will be passed the link element, not the span.

The provided `getLabel` and `getRole` functions return the accessible name and aria role of an element respectively.

```js
import { instrumentClicks, getLabel, getRole } from "instrument-interactions"

import { sendToAnalytics } from "" // wherever

instrumentClicks({
    onInteraction: (element) => {
        sendToAnalytics({
            label: getLabel(element),
            role: getRole(element),
        })
    }
})
```

Often the accessible name is enough to uniquely identify an element. But if it isn't, the `getLandmarks` function returns an array of landmark element descriptions.

```html
<header aria-labelledby="main-title">
    <h1 id="main-title">My Cool Site</h1>
    <nav>
        <a href="/">Home</a>
    </nav>
</header>
```

calling `getLandmarks` on the link element would return

```js
[{
    role: "navigation",
    label: undefined
},
{
    role: "banner",
    label: "My Cool Site"
}]
```

## Provided Functions
```
instrumentClicks
```
Records click events on interactive elements. Returns an unsubscribe function.

**Options**

onInteraction: `(element: Element) => void`<br>
*called whenever an event is triggered on an interactive element*

findInteractive?: `(element: Element) => Element | undefined`<br>
*find the interactive element, if any, that was clicked on, default function finds buttons, links, menuitems, switchs, and tabs*

maxDepth?: `number`<br>
*if using the default findInteractive function, how far up the tree to look for the interactive element, default is 6*

keyboardHandlers?: `boolean`<br>
*whether to add Space and Enter keyboard listeners to support keyboard 'clicks' on non-native buttons and links, default is true*

eventCapture?: `boolean`<br>
*add a listener with { capture: true }, default is true*

rootElement?: `HTMLElement`<br>
*element to attach the listener to, default is document.body*
```
instrumentApp
```
Records change events and click events on interactive elements. Returns an unsubscribe function.

It takes the same options as instrumentClicks.
*Unlike instrumentClicks, the default findInteractive function includes clicks on non-native checkboxes, radios, and selects by default since they don't fire change events.*
```
getLabel
```
Returns the accessible name for the provided element.
```
getRole
```
Returns the aria role for the provided element. *To reduce bundle size, implicit roles are only supported for interactive elements.*
```
getAncestors
```
Returns an iterator for the given element's ancestors. 

**Arguments**

element: `Element`<br>
*the first item returned by the iterator*

rootElement?: `Element`<br>
*the last element returned by the iterator, default is document.body*

maxDepth?: `number`<br>
*max number of elements returned by the iterator, optional*
```
getLandmark
```
Returns a landmark description for a given element or undefined if the element doesn't have a landmark role.<br>
`{ role: string; label?: string }`
```
getLandmarks
```
Returns an array of landmark descriptions for the given element's ancestors.

*It takes the same arguments as getAncestors*
```
removeInvalidLandmarks
```
Mutates the passed in landmark array, removing banner and contentinfo roles under article, complementary, main, navigation, or region roles per the implicit roles spec

## License

MIT
