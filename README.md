
# Introduce
The component that handles keyboard with ScrollView, it's make them work perfect
# Installation
Installation can be done through `npm` or `yarn`:

```shell
npm i react-native-interaction-keyboard --save
```

```shell
yarn add react-native-interaction-keyboard
```

## Usage

Import `react-native-interaction-keyboard` and wrap your content inside
it:

```js
import InteractionKeyboard from 'react-native-interaction-keyboard'
```

```jsx
<InteractionKeyboard>
  // your component
</InteractionKeyboard>
```

### Props

| **Prop**                    | **Type**                         | **Description**                                                                                |
| --------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------- |
| `contentContainerStyle`                  | `any`                       | These styles will be applied to the scroll view content container which wraps all of the child views|
| `scrollRefs`        | `Func`                        | Catch the reference of the ScrollView component|
| `usingScrollView`       | `boolean` | Disable/ enable ScrollView default is true|
