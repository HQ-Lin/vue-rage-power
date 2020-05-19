# vue-rage-power
A Vue wrapper component for your rage typing need.

![preview](./preview.webp)

## Installation
```bash
npm install --save vue-rage-power
```

## Usage
Wrap this component around your input component.

```vue
<template>
    <vue-rage-power>
        <textarea></textarea>
    </vue-rage-power>
</template>

<script>
import VueRagePower from 'vue-rage-power';

export default {
    components: {
        'vue-rage-power': VueRagePower
    },
}
</script>
```

## License
MIT