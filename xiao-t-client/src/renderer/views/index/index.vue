<template>
    <div>
        <TitleBar>项目模板</TitleBar>
        <div class="main">
            15112
            <wired-input placeholder="Enter name"></wired-input>
            <wired-button>Click Me</wired-button>
        </div>
    </div>

</template>

<script lang="ts">
    import "wired-elements";
    import { defineComponent } from 'vue'
    export default defineComponent({
        components:{
        },
        data: () => ({

        }),
        created() {
        },
        mounted() {
        },
        methods: {

        },
    });
</script>

<style scoped lang="scss">
    .home {
        overflow: hidden auto;

        .card {
            background-color: #fff;
            border-radius: 5px;
            margin-bottom: 15px;

            &--last {
                margin-bottom: 0;
            }
        }
    }
</style>
