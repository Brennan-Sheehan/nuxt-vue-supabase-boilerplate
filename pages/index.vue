<script setup lang="ts"></script>

<template>
  <div class="main">
    <BCard
      class="card"
      title="Nuxt3 + Supabase + BootstrapVue"
      tag="article"
      style="max-width: 40rem"
    >
      <BCardText>
        Authentication template with Supabase Auth and Database. Uses Bootstrap
        for styling and Nuxt3 for the framework.
      </BCardText>
    </BCard>
  </div>
</template>

<style>
:root {
  --color-primary: #6c9bcf;
  --color-primary-modal: #6c9acf81;
  --color-white: #fff;
  --color-info-dark: #7d8da1;
  --color-dark: #363949;
  --color-light: rgba(132, 139, 200, 0.18);
  --color-dark-variant: #677483;
  --color-background: #f6f6f9;
  --element-size: 4rem;
  --accent-color: #cacaca;
  --color-border: rgba(25, 4, 69, 0.1);

  --card-border-radius: 2rem;
  --border-radius-1: 0.4rem;
  --border-radius-2: 1.2rem;

  --card-padding: 1.8rem;
  --padding-1: 1.2rem;

  --box-shadow: 0 2rem 3rem var(--color-light);
  --box-shadow-cards: 0.1rem 0.1rem 0.3rem var(--color-light);
}

:root.dark-theme {
  --color-background: #181a1e;
  --color-white: #202528;
  --color-dark: #edeffd;
  --color-dark-variant: #a3bdcc;
  --color-light: rgba(0, 0, 0, 0.4);
  --box-shadow: 0 2rem 3rem var(--color-light);
  --accent-color: #3f3f3f;
  --color-border: rgba(90, 90, 92, 0.199);
}
.main {
  display: flex;
  justify-content: center;
  padding: 2rem;
}
.card {
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow-cards);
  padding: 4rem;
}
</style>
