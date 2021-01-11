# botbuilder-adapter-workplace
This module is a wrapper around [botbuilder-adapter-facebook](https://github.com/howdyai/botkit/tree/main/packages/botbuilder-adapter-facebook) that allows you to connect botkit to Facebook Workplace using "Require App Secret Proof" option in Custom Integration Settings.

## Install Package

Add this package to your project using npm:

```bash
npm install https://github.com/acropolium/botbuilder-adapter-workplace
```

Import the adapter class into your code:

```javascript
const { WorkplaceAdapter } = require('botbuilder-adapter-workplace');
```

### Botkit Basics

When used in concert with Botkit, developers need only pass the configured adapter to the Botkit constructor, as seen below. Botkit will automatically create and configure the webhook endpoints and other options necessary for communicating with Facebook.

Developers can then bind to Botkit's event emitting system using `controller.on` and `controller.hears` to filter and handle incoming events from the messaging platform.

```javascript
const adapter = new WorkplaceAdapter({
     verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
     app_secret: process.env.FACEBOOK_APP_SECRET,
     access_token: process.env.FACEBOOK_ACCESS_TOKEN
});

adapter.use(new WorkplaceEventTypeMiddleware());

const controller = new Botkit({
    adapter,
    // ...other options
});

controller.on('message', async(bot, message) => {
    await bot.reply(message, 'I heard a message!');
});
```

## Calling Facebook APIs

This package also includes a minimal Facebook API client. To use with a BotBuilder application, the adapter provides the getAPI() method.

```javascript
controller.on('message', async(bot, message) {

    // call the facebook API to get the bot's page identity
    let identity = await bot.api.callAPI('/me', 'GET', {});
    await bot.reply(message,`My name is ${ identity.name }`);

});
```

## About Botkit

Botkit is a part of the [Microsoft Bot Framework](https://dev.botframework.com).

Want to contribute? [Read the contributor guide](https://github.com/howdyai/botkit/blob/master/CONTRIBUTING.md)

Botkit is released under the [MIT Open Source license](https://github.com/howdyai/botkit/blob/master/LICENSE.md)
