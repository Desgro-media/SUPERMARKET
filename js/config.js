/* Store-wide settings. Change these to rebrand or localise the whole app. */
window.CONFIG = {
  name: 'NestMart',
  tagline: 'Everything you need, delivered',
  currency: 'SAR',
  deliveryFee: 12,
  expressFee: 8,
  freeDeliveryAt: 150,
  pageSize: 12,
  maxPerItem: 20,
  areas: ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Makkah', 'Madinah'],
  slots: ['08:00 – 10:00', '10:00 – 12:00', '12:00 – 14:00', '16:00 – 18:00', '18:00 – 20:00', '20:00 – 22:00'],
  promos: {
    SAVE10: { label: '10% off your basket', type: 'pct', value: 10 },
    WELCOME25: { label: 'SAR 25 off orders over SAR 120', type: 'flat', value: 25, min: 120 },
    FREESHIP: { label: 'Free delivery on this order', type: 'ship' }
  },
  /* Colour themes (defined in css/styles.css). The first is the default. Set paletteSwitcher to false
     to hide the picker (Account → Preferences) once you've settled on a brand colour. */
  paletteSwitcher: true,
  palettes: [
    { id: 'ocean', name: 'Ocean blue', color: '#1d4ed8' },
    { id: 'crimson', name: 'Crimson red', color: '#c8102e' },
    { id: 'sunset', name: 'Sunset orange', color: '#c2410c' },
    { id: 'plum', name: 'Plum purple', color: '#6d28d9' },
    { id: 'teal', name: 'Teal', color: '#0f766e' }
  ],
  contact: {
    email: 'hello@nestmart.example',
    phone: '+966 00 000 0000',
    hours: '7am – 11pm, every day',
    address: 'Riyadh, Saudi Arabia'
  }
};
