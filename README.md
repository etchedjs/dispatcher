# @etchedjs/dispatcher

[![](https://raw.githubusercontent.com/Lcfvs/library-peer/main/badge.svg)](https://github.com/Lcfvs/library-peer#readme)

A utility to easily dispatch updates on [`@etchedjs/etched`](https://github.com/etchedjs/etched) objects, without any state


## Why a dispatcher?

When we're trying to only manipulate immutable objects to improve the project stability/integrity, we can have to manage some mutable objects (e.g. DOM nodes).

We can also maybe need to create a common channel between them, but it isn't a good idea to store the mutable things statically (aka state), because it breaks the idempotency.

Then the idea is simple: provide a way to subscribe/unsubscribe for updates to some immutable objects that handle the changes to the mutable things.

## A concrete example

```js
import { etch, model } from '@etchedjs/etched'
import { dispatcher, subscription } from '@etchedjs/dispatcher.js'

const incrementer = model(dispatcher, {
  // a set of dispatcher subscriptions
  subscriptions: new Set(),
  decrement (step = -1) {
    if (!Number.isInteger(step)) {
      throw new TypeError('Must be an integer')
    }

    this.dispatch({ step })
  },
  increment (step = 1) {
    if (!Number.isInteger(step)) {
      throw new TypeError('Must be an integer')
    }

    this.dispatch({ step })
  }
})

const incrementerSubscription = model(subscription, {
  // just to know which subscription
  set name (value) {
    if (typeof value !== 'string') {
      throw new TypeError('Must be a string')
    }
  },
  // can be filled by something like `document.querySelector('input')`
  set target (target) {
    if (Object(target) !== target) {
      throw new TypeError('Must be an Object')
    }
  },
  // a key that ca be updated
  set step (value) {
    const { target } = this

    target.value += value
    // show the result
    console.log(JSON.stringify(this))
  }
})

const subscription1 = etch(incrementerSubscription, {
  name: 'subscription1',
  target: { value: 0 }
})

const subscription2 = etch(incrementerSubscription, {
  name: 'subscription2',
  target: { value: 0 }
})

incrementer.subscribe(subscription1)
incrementer.increment()
// {"target":{"value":1},"name":"subscription1"}
incrementer.subscribe(subscription2)
incrementer.increment()
// {"target":{"value":2},"name":"subscription1"}
// {"target":{"value":1},"name":"subscription2"}
incrementer.decrement()
// {"target":{"value":1},"name":"subscription1"}
// {"target":{"value":0},"name":"subscription2"}
```

## Install

`npm i @etchedjs/dispatcher`

## API

### dispatcher
An etched model that have the following properties

#### set subscriptions
A setter to define a `Set` to register the subscriptions

#### dispatch(update, subscriptions = this.subscriptions)
A method to dispatch an update to a subscriptions set

#### subscribe(subscription)
A method to subscribe to the updates

#### unsubscribe(subscription)
A method to unsubscribe to the updates

### subscription
An empty etched model that represents a subscription


## Licence

MIT
