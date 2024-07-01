'use client';

import { useRouter } from 'next/navigation';
import Marquee from 'react-fast-marquee';

import LINKS from '@/app/links';

export default function Features() {
  const router = useRouter();
  return (
    <div>
      <section className="border-t-border dark:border-t-darkBorder dark:bg-darkBg border-t-2 bg-bg py-20 font-base lg:py-[100px]">
        <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          Explore Our Collection of React Hooks
        </h2>

        <div className="mx-auto grid w-container max-w-full grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.keys(LINKS).map((key, index) => {
            const hook = LINKS[key];
            if (!hook) return null; // Guard clause to check for undefined
            return (
              <div
                className="border-border dark:border-darkBorder dark:bg-darkBg shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base border-2 bg-white p-5 hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none cursor-pointer transition-all"
                key={index}
                onClick={() => {
                  router.push(hook.link);
                }}
              >
                <h4 className="mt-2 text-xl font-heading">{hook.title}</h4>
                <p>{hook.text}</p>
              </div>
            );
          })}
        </div>
      </section>
      <div>
        <Marquee
          className="border-y-border dark:border-y-darkBorder dark:border-darkBorder dark:bg-darkBg border-y-2 bg-white py-3 font-base sm:py-5"
          direction="left"
        >
          {Object.keys(LINKS).map((key, index) => {
            const hook = LINKS[key];
            if (!hook) return null; // Guard clause to check for undefined
            return (
              <div className="flex items-center justify-center" key={index}>
                <span className="mx-10 text-xl font-heading sm:text-2xl lg:text-4xl">
                  {hook.title}
                </span>
              </div>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
}
