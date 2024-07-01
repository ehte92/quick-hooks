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
};

export default LINKS;
