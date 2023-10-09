<template>
<div>{{ index }} - {{ source.text }}</div>
</template>

  
<script>
export default {
    name: 'item-component',
    props: {
        index: { 
            type: Number
        },
        source: { // here is: {uid: 'unique_1', text: 'abc'}
            type: Object,
            default () {
                return {}
            }
        }
    }
}
</script>
