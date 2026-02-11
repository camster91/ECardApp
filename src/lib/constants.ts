export const TIERS = {
  free: {
    name: "Create FREE",
    tagline: "Start free",
    description:
      "Get started\u2014manage invites for free and upgrade as needed.",
    price: 0,
    maxResponses: 15,
    replyLabel: "15 replies",
    features: [
      {
        title: "Create FREE",
        description: "All eCards start as Create FREE.",
      },
      {
        title: "15 replies",
        description: "Manage up to 15 guest replies for free.",
      },
      {
        title: "Your eCard will always collect all replies",
        description:
          "Your eCard will always collect all replies, even on Create FREE. You can upgrade anytime to access full guest details if you receive more than 15 replies.",
      },
      {
        title: "All essentials to design, send, and manage invites",
        description:
          "Everything you need to create, send, and manage your event invites.",
      },
    ],
  },
  pro30: {
    name: "Create PRO30",
    tagline: "Small events",
    description: "Perfect for small gatherings\u2014manage up to 30 guest replies.",
    price: 19,
    maxResponses: 30,
    replyLabel: "16-30 replies",
    features: [
      {
        title: "30 replies",
        description: "Manage up to 30 guest replies.",
      },
      {
        title: "Remove branding",
        description:
          "Send invites without ECardApp branding for a personalized look.",
      },
      {
        title: "Location & calendar links",
        description: "Share event location and calendar links with guests.",
      },
      {
        title: "Guest Tags",
        description:
          "Categorize guests for dietary needs, lodging, table assignments, and more. Tags are private to the host and included in exports.",
      },
      {
        title: "Guest list management",
        description:
          "Edit, add, or delete guests easily from your dashboard.",
      },
    ],
  },
  pass: {
    name: "Create PASS",
    tagline: "Large events",
    description:
      "Ideal for your medium or large event at one simple price.",
    price: 34,
    maxResponses: 1200,
    replyLabel: "All replies*",
    badge: "Best value!",
    features: [
      {
        title: "Unlimited replies*",
        description: "Manage all your guest replies for one event.",
      },
      {
        title: "Remove branding",
        description:
          "Send invites without ECardApp branding for a personalized look.",
      },
      {
        title: "Location & calendar links",
        description: "Share event location and calendar links with guests.",
      },
      {
        title: "Guest Tags",
        description:
          "Categorize guests for dietary needs, lodging, table assignments, and more. Tags are private to the host and included in exports.",
      },
      {
        title: "Guest list management",
        description:
          "Edit, add, or delete guests easily from your dashboard.",
      },
    ],
    footnote: "*Subject to our fair use policy of 1200 guest replies.",
  },
} as const;

export type TierKey = keyof typeof TIERS;

export const DEFAULT_RSVP_FIELDS = [
  {
    field_name: "attendance",
    field_label: "Will you be attending?",
    field_type: "attendance" as const,
    is_required: true,
    is_enabled: true,
    sort_order: 0,
  },
  {
    field_name: "email",
    field_label: "Email Address",
    field_type: "email" as const,
    is_required: false,
    is_enabled: true,
    sort_order: 1,
  },
  {
    field_name: "headcount",
    field_label: "Number of Guests",
    field_type: "number" as const,
    placeholder: "1",
    is_required: false,
    is_enabled: true,
    sort_order: 2,
  },
  {
    field_name: "meal_choice",
    field_label: "Meal Preference",
    field_type: "select" as const,
    options: ["No preference", "Vegetarian", "Vegan", "Gluten-free", "Halal", "Kosher"],
    is_required: false,
    is_enabled: false,
    sort_order: 3,
  },
  {
    field_name: "dietary",
    field_label: "Dietary Requirements",
    field_type: "text" as const,
    placeholder: "Any allergies or dietary needs?",
    is_required: false,
    is_enabled: false,
    sort_order: 4,
  },
  {
    field_name: "plus_one",
    field_label: "Plus One Name",
    field_type: "text" as const,
    placeholder: "Name of your plus one",
    is_required: false,
    is_enabled: false,
    sort_order: 5,
  },
  {
    field_name: "message",
    field_label: "Message to Host",
    field_type: "text" as const,
    placeholder: "Leave a message for the host...",
    is_required: false,
    is_enabled: false,
    sort_order: 6,
  },
];

export const DEFAULT_CUSTOMIZATION = {
  primaryColor: "#7c3aed",
  backgroundColor: "#ffffff",
  backgroundImage: null as string | null,
  fontFamily: "Inter",
  buttonStyle: "rounded" as "rounded" | "pill" | "square",
  showCountdown: true,
};

export const FAQ_ITEMS = [
  {
    question: "What is included in the Create FREE plan?",
    answer:
      "The Create FREE plan includes all essential features to design, send, and manage your event invites. You can manage up to 15 guest replies per event at no cost. Your eCard will always collect all replies, even on the free plan.",
  },
  {
    question: "What happens if I need more than 30 replies for an event?",
    answer:
      "If you need more than 30 replies, you can upgrade to Create PASS which supports unlimited replies (up to 1200 per our fair use policy). You can upgrade at any time, even after you've sent out your invites.",
  },
  {
    question: "Can I upgrade from Create FREE to Create PRO later?",
    answer:
      "Yes! You can upgrade your event at any time. All your existing data, responses, and settings will be preserved when you upgrade.",
  },
  {
    question: "Will I be charged in my local currency?",
    answer:
      "Prices are displayed in USD. Your payment provider may convert the amount to your local currency at the current exchange rate.",
  },
  {
    question: "What is counted as a reply?",
    answer:
      "A reply is counted each time a unique guest submits an RSVP response through your event page. Each guest submission counts as one reply, regardless of headcount.",
  },
  {
    question: "Can I downgrade or cancel my upgrade if my plans change?",
    answer:
      "Event upgrades are one-time purchases per event and are non-refundable. However, you can always create new events on the free plan.",
  },
  {
    question: "How do I upgrade my event to a PRO plan?",
    answer:
      "From your event dashboard, click the 'Upgrade' button next to your event. Choose your preferred plan and complete the payment to instantly unlock additional features.",
  },
  {
    question: "Can I use ECardApp for business events and promotions?",
    answer:
      "Absolutely! ECardApp is great for corporate events, webinars, product launches, grand openings, and more. The PRO and PASS plans offer branding removal for a professional look.",
  },
];

export const FEATURES_LIST = [
  {
    title: "Video and Slideshow eCards",
    subtitle: "Transform static designs dynamically",
    description:
      "Turn your design into a video or slideshow to create an interactive eCard. Engage your recipients with movement, storytelling, and audio.",
    icon: "Play",
  },
  {
    title: "Branded Invitations",
    subtitle: "Maintain brand consistency",
    description:
      "Customize your invitations with your logo, photos, and colors. Ensure cohesive branding across your designs and your eCard webpage.",
    icon: "Palette",
  },
  {
    title: "Customizable Page Colors",
    subtitle: "Match event theme perfectly",
    description:
      "Full control over page backgrounds and button colors to align your eCard with your theme or brand.",
    icon: "Paintbrush",
  },
  {
    title: "Custom Backgrounds and Logos",
    subtitle: "Add a personal touch",
    description:
      "Upload your logo and photos or use high-quality wallpapers to add unique flair to your event page.",
    icon: "Image",
  },
  {
    title: "Music and Sounds",
    subtitle: "Create immersive experiences",
    description:
      "Add music or audio to your video eCard, enhancing emotional impact and making the invitation engaging.",
    icon: "Music",
  },
  {
    title: "Email Builder Integration",
    subtitle: "Reach guests with ease",
    description:
      "Send pretty invite, update, and reminder emails via your own Gmail, Outlook, Yahoo or any other email client.",
    icon: "Mail",
  },
  {
    title: "Marketing Tools",
    subtitle: "Send professionally from your domain",
    description:
      "Easily transfer event assets to your email marketing provider and send your eCard out professionally.",
    icon: "Megaphone",
  },
  {
    title: "Shareable Links",
    subtitle: "Flexible sharing options",
    description:
      "Share your eCard via any chat app, text, iMessage or social platform making it easy for guests to receive and respond.",
    icon: "Share2",
  },
  {
    title: "Add Events to Calendars",
    subtitle: "Make attending convenient",
    description:
      "Recipients can sync events to their calendars in just one click, ensuring they won't miss the event.",
    icon: "Calendar",
  },
  {
    title: "Custom URLs",
    subtitle: "Create memorable links",
    description:
      "Generate a personalized, easy-to-share link for your event, making it more convenient for recipients.",
    icon: "Link",
  },
  {
    title: "Event Analytics",
    subtitle: "Gain guest engagement insights",
    description:
      "Track replies with easy-to-use mobile friendly dashboards, tables, and graphs, keeping you informed as you plan.",
    icon: "BarChart3",
  },
  {
    title: "Collect Recipient Info",
    subtitle: "Tailor event to guest needs",
    description:
      "Use customizable forms to gather meal choices and dietary preferences, making guests feel cared for.",
    icon: "ClipboardList",
  },
  {
    title: "Adult and Child Headcounts",
    subtitle: "Plan with precision",
    description:
      "Collect information to get accurate adult and child headcounts, ensuring proper resources for the event.",
    icon: "Users",
  },
  {
    title: "Guest Tags",
    subtitle: "Organize guest lists efficiently",
    description:
      "Group recipients by adding tags, making it easy to manage and communicate with specific groups.",
    icon: "Tag",
  },
  {
    title: "Location and Time Blocks",
    subtitle: "Provide essential details",
    description:
      "Add location and time details to your eCard webpage, ensuring recipients have all necessary information to attend.",
    icon: "MapPin",
  },
  {
    title: "Gift Registries",
    subtitle: "Make gifting effortless",
    description:
      "Add gift registry links to your eCard webpage, simplifying the gifting process for guests and enhancing their experience.",
    icon: "Gift",
  },
  {
    title: "AI EventScribe",
    subtitle: "Write compelling event details",
    description:
      "Use AI EventScribe to craft the perfect event description, ensuring your message is clear and engaging.",
    icon: "Sparkles",
  },
];
