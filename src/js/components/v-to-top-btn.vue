<template>
  <div id="to-top-btn"></div>
</template>

<script>
export default {
  name: "v-to-top-btn",
  mounted() {
    $(function() {
      $(window).scroll(function() {
        if ($(window).scrollTop() != 0) {
          $("#to-top-btn").fadeIn();
        } else {
          $("#to-top-btn").fadeOut();
        }
      });
      $("#to-top-btn").click(function() {
        $("body,html").animate({ scrollTop: 0 }, 800);
      });
    });
  }
};
</script>

<style scoped>
#to-top-btn {
  width: 48px;
  height: 48px;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGNTNBNDEiLz48cGF0aCBkPSJNMjQgOXYzME0yNCA5bC05LjUgOU0yNCA5bDkuNSA5IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+);
  background-size: contain;
  position: fixed;
  bottom: 25px;
  right: 50px;
  cursor: pointer;
  display: none;
  opacity: 0.7;
  z-index: 90;
  transition: width 0.3s, height 0.3s;
}

#to-top-btn:hover {
  opacity: 1;
}

#to-top-btn:active {
  width: 56px;
  height: 56px;
}
</style>