const base = {
  width: 17,
  height: 17,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const HomeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
  </svg>
)

export const GridIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
    <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" />
    <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
    <rect x="13" y="13" width="7.5" height="7.5" rx="1.5" />
  </svg>
)

export const ActivityIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 12h4l2.5-7 4 14 2.5-7H21" />
  </svg>
)

export const SunIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </svg>
)

export const MoonIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
  </svg>
)

export const PlusIcon = (p) => (
  <svg {...base} width={15} height={15} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const TrashIcon = (p) => (
  <svg {...base} width={15} height={15} {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    <path d="M10 11v6M14 11v6" />
  </svg>
)

export const SendIcon = (p) => (
  <svg {...base} width={16} height={16} fill="currentColor" stroke="none" {...p}>
    <path d="M3 11.2 20.4 3.2a.8.8 0 0 1 1.06 1.05l-6.2 17a.8.8 0 0 1-1.49.06l-2.9-6.5-6.5-2.9a.8.8 0 0 1 .07-1.49z" />
  </svg>
)

export const UploadIcon = (p) => (
  <svg {...base} width={18} height={18} {...p}>
    <path d="M12 16V4M7.5 8.5 12 4l4.5 4.5" />
    <path d="M4.5 16.5V18a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1.5" />
  </svg>
)

export const DownloadIcon = (p) => (
  <svg {...base} width={13} height={13} {...p}>
    <path d="M12 4v11M8 11.5 12 15.5l4-4" />
    <path d="M4.5 16.5V18a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1.5" />
  </svg>
)

export const ChevronRightIcon = (p) => (
  <svg {...base} width={13} height={13} {...p}>
    <path d="M9 6l6 6-6 6" />
  </svg>
)

export const ChevronDownIcon = (p) => (
  <svg {...base} width={12} height={12} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export const RefreshDotIcon = (p) => (
  <svg {...base} width={14} height={14} stroke="#fff" {...p}>
    <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
    <path d="M18 3v4h-4M6 21v-4h4" />
  </svg>
)
