<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4 py-12">
    <div class="w-full max-w-md">
      <div class="mb-8 flex flex-col items-center gap-2">
        <span
          class="size-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600"
          aria-hidden="true"
        />
        <h1 class="text-xl font-bold text-foreground">آکادمی</h1>
      </div>
      <slot />
    </div>
  </div>
</template>
