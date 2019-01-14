<script>
import Vue from 'vue';
export default Vue.component('Card', {
    functional: true,
    render: function(createElement, context){
        return createElement('div', { class: { 'card': true, ...context.data.class } }, context.children);
    }
});
</script>

<style lang="scss" scoped>
.card {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #fff;
    border-radius: 5px;
    background: #fff;
    padding: 20px;
}
</style>
