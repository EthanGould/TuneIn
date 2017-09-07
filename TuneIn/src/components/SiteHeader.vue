<script>
export default {
	name: 'site-header',

	props: ['headerText', 'homescreen'],

	data () {
		return {
		}
	}
}

</script>

<template>
	<header class="header">
		<router-link v-if="!homescreen" to="/home" class="header__link">Home</router-link>
		<p class="header__heading">{{this.headerText}}</p>
	</header>
</template>