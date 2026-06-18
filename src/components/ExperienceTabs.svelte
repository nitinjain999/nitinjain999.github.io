<script lang="ts">
  import { tick } from 'svelte';
  import { gsap } from 'gsap';

  let { roles = [] } = $props();

  let activeIdx = $state(0);
  let panelRefs: HTMLDivElement[] = [];

  const logoSrc: Record<string, string> = {
    aws:      '/assets/logos/aws.svg',
    ericsson: '/assets/logos/ericsson.svg',
    alcatel:  '/assets/logos/alcatel.svg',
    atg:      '/assets/logos/atg.svg',
  };

  $effect(() => {
    const panel = panelRefs[0];
    if (panel) {
      gsap.from(panel.querySelectorAll('li'), {
        opacity: 0, y: 10, stagger: 0.07, duration: 0.35, ease: 'power2.out',
      });
    }
  });

  async function selectTab(i: number) {
    activeIdx = i;
    await tick();
    const panel = panelRefs[i];
    if (panel) {
      gsap.from(panel.querySelectorAll('li'), {
        opacity: 0, y: 10, stagger: 0.07, duration: 0.35, ease: 'power2.out',
      });
    }
  }
</script>

<div class="flex flex-col md:flex-row gap-0">
  <!-- Tab list — vertical on mobile (accordion-style select), sidebar on desktop -->
  <div class="md:w-64 flex-shrink-0 flex flex-col
              border-b md:border-b-0 md:border-r border-white/10">
    {#each roles as role, i}
      <button
        onclick={() => selectTab(i)}
        class="text-left px-4 py-4 md:px-5 font-medium
               border-l-2 transition-all duration-200 flex items-center gap-3 min-h-[56px]
               {activeIdx === i
                 ? 'border-cyan text-cyan bg-cyan/5'
                 : 'border-transparent text-white/40 hover:text-white/70 hover:bg-white/5'}"
      >
        {#if role.logo && logoSrc[role.logo]}
          <img src={logoSrc[role.logo]} alt={role.company}
               class="w-7 h-7 md:w-8 md:h-8 object-contain flex-shrink-0 opacity-70" />
        {/if}
        <span>
          <div class="font-semibold leading-snug text-xs md:text-xs">{role.company}</div>
          <div class="text-[10px] text-white/30 mt-0.5">{role.period}</div>
        </span>
      </button>
    {/each}
  </div>

  <!-- Panels -->
  <div class="flex-1 md:pl-10 pt-6 md:pt-0">
    {#each roles as role, i}
      {#if activeIdx === i}
        <div bind:this={panelRefs[i]}>
          <div class="flex items-start gap-4 mb-6">
            {#if role.logo && logoSrc[role.logo]}
              <img src={logoSrc[role.logo]} alt={role.company}
                   class="w-12 h-12 object-contain flex-shrink-0 mt-1 opacity-85" />
            {/if}
            <div>
              <h3 class="text-xl font-bold text-white mb-1">{role.title}</h3>
              <p class="text-cyan font-medium text-sm mb-1">{role.company}</p>
              <p class="text-white/40 text-xs">{role.period} · {role.location}</p>
            </div>
          </div>
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
