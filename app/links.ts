type SocialMedia = 
  | 'usedebounce'
  | 'uselocalstorage'
  | 'usewindowsize'
  | 'useprevious'
  | 'useintersectionobserver'
  | 'usenetworkstate'
  | 'usemediaquery'
  | 'useorientation'
  | 'usesessionstorage'
  | 'usefetch'
  | 'usevisibilitychange'
  | 'usescript'
  | 'usetoggle'
  | 'usecounter'
  | 'usecopytoclipboard';

type Link = {
  title: string;
  icon?: unknown;
  link: string;
  text?: string;
};

const LINKS: { [key in SocialMedia]: Link } = {
  usedebounce: {
    title: 'useDebounce',
    // icon: behance,
    link: '/use-debounce',
    text: 'a hook to debounce a value',
  },
  uselocalstorage: {
    title: 'useLocalStorage',
    // icon: buymeacoffee,
    link: '/use-local-storage',
    text: 'a hook to persist data in local storage',
  },
  usewindowsize: {
    title: 'useWindowSize',
    // icon: dribbble,
    link: '/use-window-size',
    text: 'a hook to get the window size',
  },
  useprevious: {
    title: 'usePrevious',
    // icon: figma,
    link: '/use-previous',
    text: 'a hook to get the previous value of a state',
  },
  useintersectionobserver: {
    title: 'useIntersectionObserver',
    // icon: github,
    link: '/use-intersection-observer',
    text: 'a hook to observe an element intersection',
  },
  usenetworkstate: {
    title: 'useNetworkState',
    // icon: gumroad,
    link: '/use-network-state',
    text: 'a hook to get the network status',
  },
  usemediaquery: {
    title: 'useMediaQuery',
    // icon: instagram,
    link: '/use-media-query',
    text: 'a hook to get media query changes',
  },
  useorientation: {
    title: 'useOrientation',
    // icon: linkedin,
    link: '/use-orientation',
    text: 'a hook to get the device orientation',
  },
  usesessionstorage: {
    title: 'useSessionStorage',
    // icon: medium,
    link: '/use-session-storage',
    text: 'a hook to persist data in session storage',
  },
  usefetch: {
    title: 'useFetch',
    // icon: patreon,
    link: '/use-fetch',
    text: 'a hook to fetch data',
  },
  usevisibilitychange: {
    title: 'useVisibilityChange',
    // icon: paypal,
    link: '/use-visibility-change',
    text: 'a hook to get the visibility change',
  },
  usescript: {
    title: 'useScript',
    // icon: pinterest,
    link: '/use-script',
    text: 'a hook to load an external script',
  },
  usetoggle: {
    title: 'useToggle',
    link: '/use-toggle',
    text: 'a hook for managing boolean state with toggle functionality',
  },
  usecounter: {
    title: 'useCounter',
    link: '/use-counter',
    text: 'a hook for numeric state with increment, decrement, and boundaries',
  },
  usecopytoclipboard: {
    title: 'useCopyToClipboard',
    link: '/use-copy-to-clipboard',
    text: 'a hook for copying text to clipboard with fallback support',
  },
};

export default LINKS;
