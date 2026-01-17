import { useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { cn } from '../../lib/utils';

gsap.registerPlugin(Flip);

type ValueKey = 'humanLed' | 'outcomes' | 'precision' | 'privacy' | 'partner';

const ALL_VALUES: ValueKey[] = ['humanLed', 'outcomes', 'precision', 'privacy', 'partner'];
const VISIBLE_COUNT = 3; // Number of cards visible at once

// SVG paths for each value icon
const SVG_PATHS: Record<ValueKey, string> = {
  humanLed: `
    <circle cx="50" cy="22" r="12"></circle>
    <path d="M50 34 L50 60"></path>
    <path d="M50 42 L30 52"></path>
    <path d="M50 42 L70 52"></path>
    <path d="M50 60 L35 85"></path>
    <path d="M50 60 L65 85"></path>
    <circle cx="30" cy="52" r="4"></circle>
    <circle cx="70" cy="52" r="4"></circle>
    <circle cx="50" cy="42" r="3"></circle>
    <path d="M26 52 L15 52" stroke-dasharray="2 2"></path>
    <path d="M74 52 L85 52" stroke-dasharray="2 2"></path>
    <circle cx="15" cy="52" r="2" fill="currentColor"></circle>
    <circle cx="85" cy="52" r="2" fill="currentColor"></circle>
  `,
  outcomes: `
    <rect x="15" y="65" width="12" height="20" rx="2"></rect>
    <rect x="32" y="50" width="12" height="35" rx="2"></rect>
    <rect x="49" y="35" width="12" height="50" rx="2"></rect>
    <path d="M21 60 L38 45 L55 30 L75 15"></path>
    <circle cx="75" cy="15" r="10"></circle>
    <circle cx="75" cy="15" r="6"></circle>
    <circle cx="75" cy="15" r="2" fill="currentColor"></circle>
    <path d="M55 30 L68 17"></path>
    <path d="M65 12 L68 17 L63 20"></path>
    <path d="M10 90 L90 90"></path>
  `,
  precision: `
    <circle cx="50" cy="50" r="38"></circle>
    <circle cx="50" cy="50" r="28" stroke-dasharray="4 2"></circle>
    <circle cx="50" cy="50" r="18"></circle>
    <circle cx="50" cy="50" r="4" fill="currentColor"></circle>
    <path d="M50 12 L50 20"></path>
    <path d="M50 80 L50 88"></path>
    <path d="M12 50 L20 50"></path>
    <path d="M80 50 L88 50"></path>
    <path d="M50 50 L65 28" stroke-width="2.5"></path>
    <circle cx="65" cy="28" r="3"></circle>
  `,
  privacy: `
    <path d="M50 8 L85 22 L85 50 C85 72 68 88 50 95 C32 88 15 72 15 50 L15 22 Z"></path>
    <path d="M50 18 L75 28 L75 50 C75 66 62 78 50 83 C38 78 25 66 25 50 L25 28 Z" stroke-dasharray="4 2"></path>
    <rect x="38" y="48" width="24" height="20" rx="3"></rect>
    <path d="M42 48 L42 40 C42 34 46 30 50 30 C54 30 58 34 58 40 L58 48"></path>
    <circle cx="50" cy="56" r="3" fill="currentColor"></circle>
    <path d="M50 59 L50 64" stroke-width="3"></path>
  `,
  partner: `
    <path d="M12 30 L35 30 C35 30 35 25 40 25 C45 25 45 35 40 35 C35 35 35 30 35 30 L35 45 C35 45 30 45 30 50 C30 55 40 55 40 50 C40 45 35 45 35 45 L35 70 L12 70 L12 55 C12 55 17 55 17 50 C17 45 7 45 7 50 C7 55 12 55 12 55 Z"></path>
    <path d="M88 30 L65 30 C65 30 65 25 60 25 C55 25 55 35 60 35 C65 35 65 30 65 30 L65 45 C65 45 70 45 70 50 C70 55 60 55 60 50 C60 45 65 45 65 45 L65 70 L88 70 L88 55 C88 55 83 55 83 50 C83 45 93 45 93 50 C93 55 88 55 88 55 Z"></path>
    <path d="M40 50 L60 50" stroke-dasharray="3 3"></path>
    <circle cx="50" cy="50" r="4"></circle>
    <circle cx="50" cy="50" r="2" fill="currentColor"></circle>
  `,
};

export function ValuesCarousel() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const currentStartIndexRef = useRef(0); // Track which value is first in the visible set

  // Create a card element
  const createCard = useCallback(
    (valueKey: ValueKey) => {
      const card = document.createElement('div');
      card.className = 'value-card';
      card.dataset.key = valueKey;

      // Create SVG icon
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'value-card-icon';

      // Use a template to safely set the SVG content
      const template = document.createElement('template');
      template.innerHTML = `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${SVG_PATHS[valueKey]}</svg>`;
      const svgElement = template.content.firstChild as SVGElement;
      iconWrapper.appendChild(svgElement);

      // Create title
      const title = document.createElement('h3');
      title.className = 'value-card-title';
      title.textContent = t(`home:values.items.${valueKey}.title`);

      // Create description
      const description = document.createElement('p');
      description.className = 'value-card-description';
      description.textContent = t(`home:values.items.${valueKey}.description`);

      card.appendChild(iconWrapper);
      card.appendChild(title);
      card.appendChild(description);

      return card;
    },
    [t]
  );

  // Get next value key in sequence
  const getNextValueKey = useCallback((currentKey: ValueKey, forward: boolean): ValueKey => {
    const currentIndex = ALL_VALUES.indexOf(currentKey);
    if (forward) {
      return ALL_VALUES[(currentIndex + 1) % ALL_VALUES.length];
    } else {
      return ALL_VALUES[(currentIndex - 1 + ALL_VALUES.length) % ALL_VALUES.length];
    }
  }, []);

  // Initialize cards on mount - only show VISIBLE_COUNT cards
  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.children.length > 0) return;

    for (let i = 0; i < VISIBLE_COUNT; i++) {
      const card = createCard(ALL_VALUES[i]);
      container.appendChild(card);
    }
  }, [createCard]);

  // Caterpillar animation
  const updateCaterpillar = useCallback(
    (forward: boolean) => {
      const container = containerRef.current;
      if (!container || isAnimatingRef.current) return;

      isAnimatingRef.current = true;

      const cards = gsap.utils.toArray<HTMLElement>('.value-card', container);
      const first = cards[0];
      const last = cards[cards.length - 1];
      const state = Flip.getState(cards);

      if (forward) {
        // Get the next value after the last visible card
        const lastKey = last.dataset.key as ValueKey;
        const nextKey = getNextValueKey(lastKey, true);
        const newCard = createCard(nextKey);
        gsap.set(newCard, { scale: 0, opacity: 0 });
        container.appendChild(newCard);
        first.classList.add('hide');
      } else {
        // Get the previous value before the first visible card
        const firstKey = first.dataset.key as ValueKey;
        const prevKey = getNextValueKey(firstKey, false);
        const newCard = createCard(prevKey);
        gsap.set(newCard, { scale: 0, opacity: 0 });
        container.prepend(newCard);
        last.classList.add('hide');
      }

      Flip.from(state, {
        targets: '.value-card',
        duration: 0.5,
        ease: 'power2.inOut',
        fade: true,
        absoluteOnLeave: true,
        onEnter: (els) => {
          gsap.to(els, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            transformOrigin: forward ? 'bottom right' : 'bottom left',
          });
        },
        onLeave: (els) => {
          gsap.to(els, {
            opacity: 0,
            scale: 0,
            duration: 0.5,
            transformOrigin: forward ? 'bottom left' : 'bottom right',
            onComplete: () => {
              els.forEach((el) => el.remove());
              isAnimatingRef.current = false;
            },
          });
        },
      });
    },
    [createCard, getNextValueKey]
  );

  const goNext = useCallback(() => {
    updateCaterpillar(true);
  }, [updateCaterpillar]);

  const goPrev = useCallback(() => {
    updateCaterpillar(false);
  }, [updateCaterpillar]);

  return (
    <div className="values-carousel-wrapper">
      {/* Cards container */}
      <div ref={containerRef} className="values-carousel-cards" />

      {/* Navigation buttons */}
      <div className="values-carousel-nav">
        <button
          onClick={goPrev}
          className={cn(
            'values-carousel-btn',
            'bg-white dark:bg-gray-800',
            'border-2 border-gray-200 dark:border-gray-600',
            'text-primary dark:text-[#f3ff5a]',
            'hover:border-primary dark:hover:border-[#f3ff5a]'
          )}
          aria-label="Previous value"
        >
          <CaretLeft className="w-6 h-6" weight="bold" />
        </button>

        <button
          onClick={goNext}
          className={cn(
            'values-carousel-btn',
            'bg-white dark:bg-gray-800',
            'border-2 border-gray-200 dark:border-gray-600',
            'text-primary dark:text-[#f3ff5a]',
            'hover:border-primary dark:hover:border-[#f3ff5a]'
          )}
          aria-label="Next value"
        >
          <CaretRight className="w-6 h-6" weight="bold" />
        </button>
      </div>
    </div>
  );
}
