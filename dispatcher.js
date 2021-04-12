import { etch, etches, model } from '@etchedjs/etched'

function validateSubscription (value) {
  if (!etches(subscription, value)) {
    throw new TypeError('Must be a dispatcher subscription')
  }

  return value
}

export const subscription = model()

export const dispatcher = model({
  set subscriptions (subscriptions) {
    if (!(subscriptions instanceof Set)) {
      throw new TypeError('Must be a Set')
    }

    subscriptions.forEach(validateSubscription)
  },
  dispatch (update, subscriptions = this.subscriptions) {
    if (Object(update) !== update) {
      throw new TypeError('Must be an Object')
    }

    if (!(subscriptions instanceof Set)) {
      throw new TypeError('Must be a Set')
    }

    subscriptions.forEach(validateSubscription)
    subscriptions.forEach(subscription => etch(subscription, update))
  },
  subscribe (subscription) {
    this.subscriptions.add(validateSubscription(subscription))
  },
  unsubscribe (subscription) {
    this.subscriptions.delete(validateSubscription(subscription))
  }
})
