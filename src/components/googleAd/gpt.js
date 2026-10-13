let gptInitialized = false;
let slotsRegistry = new Map(); // Track all ad slots for efficient management

function initializeGPT() {
  if (gptInitialized || typeof window === 'undefined') return;

  window.googletag = window.googletag || { cmd: [] };

  window.googletag.cmd.push(() => {
    const pubads = window.googletag.pubads();

    // PERFORMANCE: Enable thread yielding for better INP (Interaction to Next Paint)
    window.googletag.setConfig({
      threadYield: 'ENABLED_ALL_SLOTS',
    });

    // Enable single request for batched ad requests
    pubads.enableSingleRequest();

    // Disable initial load (we control via refresh)
    pubads.disableInitialLoad();

    // Enable services
    window.googletag.enableServices();

    gptInitialized = true;
  });
}

export function initGPT({ path, size, divId, targeting }) {
  if (typeof window === 'undefined') {
    return;
  }

  initializeGPT();

  window.googletag = window.googletag || { cmd: [] };

  window.googletag.cmd.push(() => {
    // Clean up existing slot if it exists
    const existingSlot = slotsRegistry.get(divId);
    if (existingSlot) {
      const element = document.getElementById(divId);
      if (element) {
        element.innerHTML = '';
      }
      window.googletag.destroySlots([existingSlot]);
      slotsRegistry.delete(divId);
    }

    // Define new slot
    const slot = window.googletag
      .defineSlot(path, size, divId)
      .addService(window.googletag.pubads());

    // Set targeting parameters
    if (targeting) {
      Object.entries(targeting).forEach(([k, v]) =>
        slot.setTargeting(k, String(v)),
      );
    }

    // Store slot in registry for later reference
    slotsRegistry.set(divId, slot);
  });
}

export function displayGPT(divId) {
  if (typeof window === 'undefined') {
    return;
  }

  window.googletag = window.googletag || { cmd: [] };

  window.googletag.cmd.push(() => {
    // Get the specific slot from registry
    const slot = slotsRegistry.get(divId);

    // Display the slot
    window.googletag.display(divId);

    // CRITICAL FIX: Only refresh this specific slot, not all slots
    if (slot) {
      window.googletag.pubads().refresh([slot]);
    }
  });
}
