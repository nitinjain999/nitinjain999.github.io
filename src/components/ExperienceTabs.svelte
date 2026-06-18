<script>
  import { gsap } from 'gsap';

  let { roles = [] } = $props();

  let activeIdx = $state(0);

  function selectTab(i) {
    activeIdx = i;
    // Animate bullets after Svelte updates the DOM
    setTimeout(() => {
      const panel = document.querySelector(`[data-panel="${i}"]`);
      if (panel) {
        gsap.from(panel.querySelectorAll('li'), {
          opacity: 0, y: 10, stagger: 0.07, duration: 0.35, ease: 'power2.out',
        });
      }
    }, 0);
  }
</script>

<div class="flex flex-col md:flex-row gap-0">
  <!-- Tab list -->
  <div class="md:w-60 flex-shrink-0 flex md:flex-col overflow-x-auto md:overflow-visible
              border-b md:border-b-0 md:border-r border-white/10 pb-0">
    {#each roles as role, i}
      <button
        onclick={() => selectTab(i)}
        class="text-left px-5 py-3.5 text-sm font-medium whitespace-nowrap md:whitespace-normal
               border-b-2 md:border-b-0 md:border-l-2 transition-all duration-200
               {activeIdx === i
                 ? 'border-cyan text-cyan bg-cyan/5'
                 : 'border-transparent text-white/40 hover:text-white/70 hover:bg-white/5'}"
      >
        <div class="font-semibold leading-snug">{role.company}</div>
        <div class="text-xs text-white/30 mt-0.5">{role.period}</div>
      </button>
    {/each}
  </div>

  <!-- Panels -->
  <div class="flex-1 md:pl-10 pt-6 md:pt-0">
    {#each roles as role, i}
      {#if activeIdx === i}
        <div data-panel={i}>
          <h3 class="text-xl font-bold text-white mb-1">{role.title}</h3>
          <p class="text-cyan font-medium mb-1">{role.company}</p>
          <p class="text-white/40 text-sm mb-6">{role.period} · {role.location}</p>
          <ul class="space-y-3">
            {#each role.bullets as bullet}
              <li class="flex gap-3 text-white/65 text-sm leading-relaxed">
                <span class="text-cyan mt-0.5 flex-shrink-0">▹</span>
                <span>{bullet}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/each}
  </div>
</div>
