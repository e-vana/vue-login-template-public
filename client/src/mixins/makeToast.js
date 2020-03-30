export default {
  methods: {
    makeToast(variant, title, bodyContent) {
      this.$root.$bvToast.toast(bodyContent, {
        title: title,
        variant: variant,
        solid: true
      })
    },
  }
};