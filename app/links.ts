type SocialMedia = (typeof websites)[number];

type Link = {
  title: string;
  icon?: any;
  link: string;
  text?: string;
};

const websites = [
  'usedebounce',
  'uselocalstorage',
  'usewindowsize',
  'useprevious',
  'useintersectionobserver',
  'usenetworkstate',
  'usemediaquery',
  'useorientation',
  'usesessionstorage',
  'usefetch',
];

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
};

export default LINKS;
