<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  let { stats = [] } = $props();

  let refs = $state([]);

  $effect(() => {
    gsap.registerPlugin(ScrollTrigger);
    refs.forEach((el, i) => {
      if (!el) return;
      const target = stats[i].value;
      const isDecimal = target % 1 !== 0;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = isDecimal ? obj.val.toFixed(2) : Math.round(obj.val).toString();
            },
          });
        },
      });
    });
  });
</script>

<div class="grid grid-cols-2 gap-6">
  {#each stats as stat, i}
    <div class="glass p-6 text-center">
      <div class="text-4xl font-extrabold text-cyan mb-2">
        <span bind:this={refs[i]}>0</span>{stat.suffix}
      </div>
      <div class="text-sm text-white/50">{stat.label}</div>
    </div>
  {/each}
</div>
