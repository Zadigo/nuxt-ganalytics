import { defineNuxtPlugin, useHead, useRouter, useRuntimeConfig } from '#app'

export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const config = useRuntimeConfig().public.clarity.id || '40lq6t5uns'

    useHead({
      script: [
        {
          innerHTML: `
          (function(c,l,a,r,i,t,y){(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${config}");
          `,
          type: 'text/javascript',
          crossorigin: 'anonymous',
          'data-clarity': ''
          
        }
      ]
    })
  }
})
