/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Sheet definitions
const SHEETS = {
  covers: {
    w: 1744,
    h: 2336,
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010644_837e04ca-2418-45c1-b8e0-0233265c4cd5.png&w=1744&q=85',
  },
  spines: {
    w: 2688,
    h: 1152,
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010738_a3e47ead-18f2-4974-9468-06d16a25edc5.png&w=2688&q=85',
  },
  fix: {
    w: 1520,
    h: 2688,
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010831_3ebb874b-93dc-433e-87ed-6299aba720f0.png&w=1520&q=85',
  },
  fix2: {
    w: 1520,
    h: 2688,
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_092020_f96bc094-db7b-46de-9298-074a24e0a3b8.png&w=1520&q=85',
  },
} as const;

type SheetKey = keyof typeof SHEETS;

interface Film {
  id: string;
  title: string;
  romaji: string;
  kanji: string;
  year: number;
  genre: string;
  minutes: number;
  synopsis: string;
  spineSheet: SheetKey;
  spineBox: [number, number, number, number]; // x, y, w, h
  coverSheet: 'covers';
  coverBox: [number, number, number, number]; // x, y, w, h
}

const FILMS: Film[] = [
  {
    id: 'valley',
    title: 'The Silent Valley',
    romaji: 'SHIZUKANA TANI',
    kanji: '静かな谷',
    year: 1958,
    genre: 'Drama',
    minutes: 104,
    synopsis: 'A schoolteacher returns to the mountain village that exiled her father, and finds the valley has kept every one of its secrets.',
    spineSheet: 'spines',
    spineBox: [266, 31, 189, 1089],
    coverSheet: 'covers',
    coverBox: [497, 72, 344, 659],
  },
  {
    id: 'bluehour',
    title: 'The Blue Hour',
    romaji: 'AO NO TOKI',
    kanji: '青の刻',
    year: 1962,
    genre: 'Romance',
    minutes: 97,
    synopsis: 'Over one long evening in a harbour town, a widow and a stranger trade small lies until the light runs out.',
    spineSheet: 'spines',
    spineBox: [492, 31, 189, 1089],
    coverSheet: 'covers',
    coverBox: [914, 72, 342, 659],
  },
  {
    id: 'river',
    title: 'River of Salt',
    romaji: 'SHIO NO KAWA',
    kanji: '塩の川',
    year: 1964,
    genre: 'Drama',
    minutes: 121,
    synopsis: 'Two brothers drag a salt barge downriver to a city that no longer wants anything they carry.',
    spineSheet: 'fix',
    spineBox: [197, 54, 324, 2566],
    coverSheet: 'covers',
    coverBox: [1332, 72, 344, 659],
  },
  {
    id: 'summer',
    title: 'The Last Summer',
    romaji: 'SAIGO NO NATSU',
    kanji: '最後の夏',
    year: 1966,
    genre: 'Drama',
    minutes: 109,
    synopsis: 'The summer before the dam floods their village, three friends set fire to everything they cannot take with them.',
    spineSheet: 'spines',
    spineBox: [937, 31, 188, 1089],
    coverSheet: 'covers',
    coverBox: [74, 813, 344, 676],
  },
  {
    id: 'green',
    title: 'The Green Road',
    romaji: 'MIDORI NO MICHI',
    kanji: '緑の道',
    year: 1969,
    genre: 'Mystery',
    minutes: 101,
    synopsis: 'A surveyor mapping a forest road keeps finding the same footprints, always one day ahead of him.',
    spineSheet: 'spines',
    spineBox: [1157, 31, 185, 1090],
    coverSheet: 'covers',
    coverBox: [497, 815, 344, 674],
  },
  {
    id: 'noon',
    title: 'Noon in Ashes',
    romaji: 'HAI NO SHOGO',
    kanji: '灰の正午',
    year: 1971,
    genre: 'Western',
    minutes: 112,
    synopsis: 'A rider crosses a white desert to settle an old debt, and learns too late who sent him.',
    spineSheet: 'spines',
    spineBox: [44, 32, 184, 1088],
    coverSheet: 'covers',
    coverBox: [74, 72, 347, 659],
  },
  {
    id: 'observer',
    title: 'The Observer',
    romaji: 'KANSATSUSHA',
    kanji: '観察者',
    year: 1973,
    genre: 'Thriller',
    minutes: 96,
    synopsis: 'A night watchman begins to suspect that the building he guards has started watching him back.',
    spineSheet: 'fix2',
    spineBox: [371, 15, 349, 2655],
    coverSheet: 'covers',
    coverBox: [915, 815, 342, 675],
  },
  {
    id: 'birds',
    title: 'The Fallen Birds',
    romaji: 'OCHITA TORI',
    kanji: '落ちた鳥',
    year: 1975,
    genre: 'Drama',
    minutes: 118,
    synopsis: 'When the birds stop singing over a frontier town, the mayor\'s daughter is the only one who goes looking for the reason.',
    spineSheet: 'spines',
    spineBox: [1573, 31, 183, 1089],
    coverSheet: 'covers',
    coverBox: [1331, 815, 345, 675],
  },
  {
    id: 'storm',
    title: 'Light in the Storm',
    romaji: 'ARASHI NO HI',
    kanji: '嵐の灯',
    year: 1978,
    genre: 'Drama',
    minutes: 127,
    synopsis: 'A lighthouse keeper and his son wait out a three-day storm with a shipwrecked sailor who will not give his name.',
    spineSheet: 'fix2',
    spineBox: [808, 15, 347, 2656],
    coverSheet: 'covers',
    coverBox: [74, 1571, 345, 681],
  },
  {
    id: 'tide',
    title: 'The Long Tide',
    romaji: 'NAGAI SHIO',
    kanji: '長い潮',
    year: 1981,
    genre: 'Drama',
    minutes: 99,
    synopsis: 'A fisherman\'s wife counts the tides on the harbour wall while her husband\'s boat fails to come home.',
    spineSheet: 'spines',
    spineBox: [2012, 31, 188, 1089],
    coverSheet: 'covers',
    coverBox: [496, 1577, 343, 678],
  },
  {
    id: 'war',
    title: 'A Quiet War',
    romaji: 'SHIZUKANA SENSO',
    kanji: '静かな戦争',
    year: 1985,
    genre: 'Comedy',
    minutes: 103,
    synopsis: 'Two neighbours fight a silent war over a garden wall for thirty years, and neither will say how it began.',
    spineSheet: 'spines',
    spineBox: [2236, 31, 189, 1089],
    coverSheet: 'covers',
    coverBox: [913, 1579, 343, 676],
  },
  {
    id: 'door',
    title: 'Red Door',
    romaji: 'AKAI TOBIRA',
    kanji: '赤い扉',
    year: 1989,
    genre: 'Thriller',
    minutes: 114,
    synopsis: 'A projectionist follows a reel of unknown film through the corridors of a cinema on its final night.',
    spineSheet: 'spines',
    spineBox: [2462, 31, 188, 1089],
    coverSheet: 'covers',
    coverBox: [1331, 1579, 344, 677],
  },
];

// Preload sheets
if (typeof window !== 'undefined') {
  Object.values(SHEETS).forEach((s) => {
    const img = new Image();
    img.src = s.url;
  });
}

function getBackgroundStyle(sheetId: SheetKey, box: [number, number, number, number]) {
  const sheet = SHEETS[sheetId];
  const [x, y, w, h] = box;
  const sizeX = (sheet.w / w) * 100;
  const sizeY = (sheet.h / h) * 100;
  const posX = (x / (sheet.w - w)) * 100;
  const posY = (y / (sheet.h - h)) * 100;
  return {
    backgroundImage: `url(${sheet.url})`,
    backgroundSize: `${sizeX}% ${sizeY}%`,
    backgroundPosition: `${posX}% ${posY}%`,
  };
}

const DECADE_TABS = [
  { id: 'all', label: 'ALL / すべて', filmIndex: 0 },
  { id: '1950s', label: '1950s', filmIndex: 0 },
  { id: '1960s', label: '1960s', filmIndex: 1 },
  { id: '1970s', label: '1970s', filmIndex: 5 },
  { id: '1980s', label: '1980s', filmIndex: 9 },
];

function getDecadeForYear(year: number): string {
  if (year < 1960) return '1950s';
  if (year < 1970) return '1960s';
  if (year < 1980) return '1970s';
  return '1980s';
}

const INK_BLOBS = [
  { id: 1, cx: 150, cy: 330, delay: 0 },
  { id: 2, cx: 340, cy: 600, delay: 120 },
  { id: 3, cx: 250, cy: 120, delay: 220 },
  { id: 4, cx: 90, cy: 760, delay: 300 },
  { id: 5, cx: 400, cy: 250, delay: 360 },
  { id: 6, cx: 260, cy: 860, delay: 420 },
  { id: 7, cx: 230, cy: 470, delay: 180 },
];

export default function App() {
  // References
  const stageRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const playRingRef = useRef<HTMLButtonElement>(null);
  const detailDialogRef = useRef<HTMLDivElement>(null);
  const inkBlobsGroupRef = useRef<SVGGElement>(null);
  const activeCoverFaceRef = useRef<HTMLDivElement | null>(null);

  // Masked caption refs
  const titleMaskRef = useRef<HTMLDivElement>(null);
  const subtitleMaskRef = useRef<HTMLDivElement>(null);
  const yearMaskRef = useRef<HTMLDivElement>(null);

  // Detail masked lines refs
  const detailLinesRef = useRef<(HTMLElement | null)[]>([]);

  // Tape refs
  const tapeElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tapeSpineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tapeCoverRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State in refs for the 60fps rAF animation loop
  const stateRef = useRef({
    s: 17, // Start at Noon in Ashes (copy 1, index 5 => 5 + 12 = 17)
    T: 17,
    hoverVirtual: -1,
    activeFilmIndex: 5,
    mx: typeof window !== 'undefined' ? window.innerWidth / 2 : 720,
    my: typeof window !== 'undefined' ? window.innerHeight / 2 : 450,
    cx: typeof window !== 'undefined' ? window.innerWidth / 2 : 720,
    cy: typeof window !== 'undefined' ? window.innerHeight / 2 : 450,
    tiltX: 0,
    tiltY: 0,
    onCover: false,
    hoverBtn: false,
    isOpen: false,
    isDragging: false,
    dragStartX: 0,
    dragStartT: 0,
    hasDragged: false,
    lastTime: performance.now(),
    H: 350,
    ws: 59,
    d: 184,
    gap: 10.5,
    wheelTimeout: null as ReturnType<typeof setTimeout> | null,
    lifts: new Float32Array(36),
  });

  const [activeFilm, setActiveFilm] = useState<Film>(FILMS[5]);
  const [activeDecade, setActiveDecade] = useState<string>('1970s');
  const [decadeIndicatorStyle, setDecadeIndicatorStyle] = useState({ left: 0, width: 0 });
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailFilm, setDetailFilm] = useState<Film>(FILMS[5]);

  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Update tabs position
  const updateTabsIndicator = useCallback((decade: string) => {
    const tabIndex = DECADE_TABS.findIndex((t) => t.id === decade);
    if (tabIndex >= 0 && tabsRef.current[tabIndex]) {
      const tabEl = tabsRef.current[tabIndex]!;
      setDecadeIndicatorStyle({
        left: tabEl.offsetLeft,
        width: tabEl.offsetWidth,
      });
    }
  }, []);

  // Caption swap animation using Web Animations API
  const swapCaptionText = useCallback((film: Film, dir: number) => {
    const titleContainer = titleMaskRef.current;
    const subContainer = subtitleMaskRef.current;
    const yearContainer = yearMaskRef.current;

    const animateMask = (container: HTMLDivElement | null, newContent: string) => {
      if (!container) return;

      const oldElements = Array.from(container.children) as HTMLElement[];

      const newSpan = document.createElement('span');
      newSpan.className = 'block w-full text-center';
      newSpan.textContent = newContent;
      container.appendChild(newSpan);

      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        oldElements.forEach((el) => el.remove());
        return;
      }

      // Older spans animate out
      oldElements.forEach((el) => {
        el.style.position = 'absolute';
        el.style.top = '0';
        el.style.left = '0';
        el.style.width = '100%';
        const anim = el.animate(
          [
            { transform: 'translateY(0%)' },
            { transform: `translateY(${-dir * 105}%)` },
          ],
          {
            duration: 650,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            fill: 'both',
          }
        );
        anim.onfinish = () => el.remove();
      });

      // New span animates in
      newSpan.animate(
        [
          { transform: `translateY(${dir * 105}%)` },
          { transform: 'translateY(0%)' },
        ],
        {
          duration: 650,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          fill: 'both',
        }
      );
    };

    animateMask(titleContainer, film.title);
    animateMask(subContainer, `${film.romaji} / ${film.kanji}`);
    animateMask(yearContainer, film.year.toString());
  }, []);

  // Open Detail Page
  const openDetail = useCallback(() => {
    const state = stateRef.current;
    if (state.isOpen) return;
    state.isOpen = true;
    state.T = Math.round(state.s);
    setDetailOpen(true);

    const film = FILMS[state.activeFilmIndex];
    setDetailFilm(film);

    const dialogEl = detailDialogRef.current;
    if (!dialogEl) return;

    // Reset ink mask blobs
    if (inkBlobsGroupRef.current) {
      const circles = inkBlobsGroupRef.current.querySelectorAll('circle');
      circles.forEach((c) => c.setAttribute('r', '0'));
    }

    // Measure active tape cover rect
    let rect = activeCoverFaceRef.current?.getBoundingClientRect();
    if (!rect || rect.width < 10 || rect.height < 10) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const d = state.d;
      const tH = state.H;
      rect = {
        left: W / 2 - d / 2,
        top: H / 2 - tH / 2,
        right: W / 2 + d / 2,
        bottom: H / 2 + tH / 2,
        width: d,
        height: tH,
        x: W / 2 - d / 2,
        y: H / 2 - tH / 2,
        toJSON: () => {},
      };
    }

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    dialogEl.style.visibility = 'visible';
    dialogEl.style.transformOrigin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;

    const fromClip = `inset(${rect.top}px ${window.innerWidth - rect.right}px ${window.innerHeight - rect.bottom}px ${rect.left}px round 3px)`;
    const toClip = 'inset(0px 0px 0px 0px round 0px)';

    dialogEl.animate(
      [
        { clipPath: fromClip, transform: 'rotate(-4.5deg)' },
        { clipPath: toClip, transform: 'rotate(0deg)' },
      ],
      {
        duration: isReduced ? 1 : 1050,
        easing: 'cubic-bezier(0.76, 0, 0.18, 1)',
        fill: 'both',
      }
    );

    // Text lines rise
    detailLinesRef.current.forEach((line, idx) => {
      if (!line) return;
      line.animate(
        [
          { transform: 'translateY(110%)' },
          { transform: 'translateY(0%)' },
        ],
        {
          duration: isReduced ? 1 : 900,
          delay: isReduced ? 0 : 620 + idx * 75,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          fill: 'both',
        }
      );
    });

    // Poster ink blots bloom
    const startTime = performance.now() + (isReduced ? -5000 : 520);
    const blobDuration = 1250;

    const animateBlobs = (now: number) => {
      if (!inkBlobsGroupRef.current) return;
      const elapsed = now - startTime;
      let allDone = true;

      const circles = inkBlobsGroupRef.current.querySelectorAll('circle');
      INK_BLOBS.forEach((blob, i) => {
        const c = circles[i];
        if (!c) return;

        const blobElapsed = elapsed - blob.delay;
        if (blobElapsed <= 0) {
          c.setAttribute('r', '0');
          allDone = false;
        } else {
          const p = Math.min(1, blobElapsed / blobDuration);
          const eased = 1 - Math.pow(1 - p, 3);
          const r = eased * 720;
          c.setAttribute('r', r.toFixed(1));
          if (p < 1) allDone = false;
        }
      });

      if (!allDone && elapsed < 2600 && state.isOpen) {
        requestAnimationFrame(animateBlobs);
      } else {
        circles.forEach((c) => c.setAttribute('r', '720'));
      }
    };

    requestAnimationFrame(animateBlobs);
  }, []);

  // Close Detail Page
  const closeDetail = useCallback(() => {
    const state = stateRef.current;
    if (!state.isOpen) return;

    const dialogEl = detailDialogRef.current;
    if (!dialogEl) {
      state.isOpen = false;
      setDetailOpen(false);
      return;
    }

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rect = activeCoverFaceRef.current?.getBoundingClientRect();
    if (!rect || rect.width < 10 || rect.height < 10) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const d = state.d;
      const tH = state.H;
      rect = {
        left: W / 2 - d / 2,
        top: H / 2 - tH / 2,
        right: W / 2 + d / 2,
        bottom: H / 2 + tH / 2,
        width: d,
        height: tH,
        x: W / 2 - d / 2,
        y: H / 2 - tH / 2,
        toJSON: () => {},
      };
    }

    const toClip = `inset(${rect.top}px ${window.innerWidth - rect.right}px ${window.innerHeight - rect.bottom}px ${rect.left}px round 3px)`;
    const fromClip = 'inset(0px 0px 0px 0px round 0px)';

    const anim = dialogEl.animate(
      [
        { clipPath: fromClip, transform: 'rotate(0deg)' },
        { clipPath: toClip, transform: 'rotate(-4.5deg)' },
      ],
      {
        duration: isReduced ? 1 : 850,
        easing: 'cubic-bezier(0.76, 0, 0.18, 1)',
        fill: 'both',
      }
    );

    anim.onfinish = () => {
      dialogEl.style.visibility = 'hidden';
      state.isOpen = false;
      setDetailOpen(false);
    };
  }, []);

  // Measure geometry
  const measureGeometry = useCallback(() => {
    if (!probeRef.current || !stageRef.current) return;
    const resolvedH = probeRef.current.getBoundingClientRect().height;
    const H = resolvedH > 0 ? resolvedH : 350;
    const ws = (H * 142) / 840;
    const d = (H * 474) / 900;
    const gap = H * 0.03;

    stateRef.current.H = H;
    stateRef.current.ws = ws;
    stateRef.current.d = d;
    stateRef.current.gap = gap;

    stageRef.current.style.setProperty('--ws', `${ws}px`);
    stageRef.current.style.setProperty('--d', `${d}px`);
  }, []);

  // Initialize and main rAF loop
  useEffect(() => {
    measureGeometry();
    window.addEventListener('resize', measureGeometry);

    // Initial caption set
    const initFilm = FILMS[5];
    if (titleMaskRef.current) titleMaskRef.current.innerHTML = `<span class="block w-full text-center">${initFilm.title}</span>`;
    if (subtitleMaskRef.current) subtitleMaskRef.current.innerHTML = `<span class="block w-full text-center">${initFilm.romaji} / ${initFilm.kanji}</span>`;
    if (yearMaskRef.current) yearMaskRef.current.innerHTML = `<span class="block w-full text-center">${initFilm.year}</span>`;

    updateTabsIndicator('1970s');

    let animationFrameId: number;

    const loop = (now: number) => {
      const state = stateRef.current;
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let dt = (now - state.lastTime) / 1000;
      state.lastTime = now;
      if (dt > 0.05) dt = 0.05;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const cyShelf = H / 2;

      // Spring physics for scroll
      const k = isReduced ? 100 : state.isDragging ? 18 : 5.2;
      const ds = (state.T - state.s) * (1 - Math.exp(-k * dt));
      state.s += ds;

      if (Math.abs(state.T - state.s) < 0.0001) {
        state.s = state.T;
      }

      // Normalise if s drifts beyond 4 loops (48 tapes)
      if (state.s > 36) {
        state.s -= 12;
        state.T -= 12;
      } else if (state.s < 0) {
        state.s += 12;
        state.T += 12;
      }

      // Active film tracking & caption trigger
      const newActiveIndex = ((Math.round(state.s) % 12) + 12) % 12;
      if (newActiveIndex !== state.activeFilmIndex) {
        const dir = Math.sign(state.T - state.s) || 1;
        state.activeFilmIndex = newActiveIndex;
        const curFilm = FILMS[newActiveIndex];
        setActiveFilm(curFilm);
        swapCaptionText(curFilm, dir);

        const newDecade = getDecadeForYear(curFilm.year);
        setActiveDecade(newDecade);
        updateTabsIndicator(newDecade);
      }

      // Cursor smoothing
      state.cx += (state.mx - state.cx) * (1 - Math.exp(-16 * dt));
      state.cy += (state.my - state.cy) * (1 - Math.exp(-16 * dt));

      // Check onCover test
      const distToCoverX = Math.abs(state.mx - W / 2);
      const distToCoverY = Math.abs(state.my - cyShelf);
      const settled = Math.abs(state.T - state.s) < 0.3;
      const onCover =
        !state.isOpen &&
        settled &&
        distToCoverX <= 0.55 * state.d &&
        distToCoverY <= 0.55 * state.H;
      state.onCover = onCover;

      // Tilt easing
      let targetTiltY = 0;
      let targetTiltX = 0;
      if (onCover) {
        targetTiltY = ((state.mx - W / 2) / (0.55 * state.d)) * 9;
        targetTiltX = -((state.my - cyShelf) / (state.H / 2)) * 6;
      } else {
        targetTiltY = ((state.mx - W / 2) / W) * 5;
        targetTiltX = 0;
      }
      state.tiltY += (targetTiltY - state.tiltY) * (1 - Math.exp(-7 * dt));
      state.tiltX += (targetTiltX - state.tiltX) * (1 - Math.exp(-7 * dt));

      // Render custom cursor
      if (cursorRef.current) {
        const curEl = cursorRef.current;
        curEl.style.transform = `translate3d(${state.cx}px, ${state.cy}px, 0)`;

        const ringEl = curEl.querySelector('.cursor-ring') as HTMLElement;
        const dotEl = curEl.querySelector('.cursor-dot') as HTMLElement;
        const lblEl = curEl.querySelector('.cursor-label') as HTMLElement;

        if (ringEl && dotEl && lblEl) {
          if (state.isOpen) {
            // Over detail dialog
            ringEl.style.transform = 'scale(1)';
            ringEl.style.backgroundColor = 'transparent';
            ringEl.style.borderColor = 'var(--ink)';
            dotEl.style.transform = 'scale(1)';
            lblEl.style.transform = 'scale(0)';
          } else if (onCover) {
            ringEl.style.transform = 'scale(1.75)';
            ringEl.style.backgroundColor = 'var(--cobalt)';
            ringEl.style.borderColor = 'var(--cobalt)';
            dotEl.style.transform = 'scale(0)';
            lblEl.style.transform = 'scale(1)';
          } else if (state.hoverBtn) {
            ringEl.style.transform = 'scale(0.55)';
            ringEl.style.backgroundColor = 'transparent';
            ringEl.style.borderColor = 'var(--ink)';
            dotEl.style.transform = 'scale(0)';
            lblEl.style.transform = 'scale(0)';
          } else if (
            state.hoverVirtual >= 0 &&
            Math.abs(state.hoverVirtual - state.s) > 0.5
          ) {
            ringEl.style.transform = 'scale(0.72)';
            ringEl.style.backgroundColor = 'transparent';
            ringEl.style.borderColor = 'var(--ink)';
            dotEl.style.transform = 'scale(1)';
            lblEl.style.transform = 'scale(0)';
          } else {
            ringEl.style.transform = 'scale(1)';
            ringEl.style.backgroundColor = 'transparent';
            ringEl.style.borderColor = 'var(--ink)';
            dotEl.style.transform = 'scale(1)';
            lblEl.style.transform = 'scale(0)';
          }
        }
      }

      // Render play ring
      if (playRingRef.current) {
        const ring = playRingRef.current;
        const left = W / 2 - 0.5 * state.d - 6;
        const top = cyShelf + 0.36 * state.H;
        const diff = Math.abs(state.T - state.s) * 3;
        const mScale = Math.max(0, 1 - diff);
        const playScale = state.isOpen ? 0 : mScale * mScale * (3 - 2 * mScale);
        ring.style.transform = `translate3d(${left}px, ${top}px, 0) scale(${playScale.toFixed(3)})`;
      }

      // Render 36 tapes
      for (let v = 0; v < 36; v++) {
        const tapeEl = tapeElsRef.current[v];
        if (!tapeEl) continue;

        let r = (v - state.s) % 36;
        while (r > 18) r -= 36;
        while (r < -18) r += 36;

        // Formula for x placement
        const B =
          Math.abs(r) < 1
            ? (r + Math.sin(Math.PI * r) / Math.PI) / 2
            : 0.5 * Math.sign(r);
        const x = r * (state.ws + state.gap) + (state.d - state.ws + 1.6 * state.gap) * B;

        // Culling
        if (Math.abs(x) > W / 2 + 1.5 * state.d) {
          tapeEl.style.visibility = 'hidden';
          continue;
        } else {
          tapeEl.style.visibility = 'visible';
        }

        // Lift easing
        const targetLift =
          state.hoverVirtual === v && Math.abs(r) > 0.5 && !state.isOpen ? 1 : 0;
        const liftEase = isReduced ? 100 : 12;
        state.lifts[v] += (targetLift - state.lifts[v]) * (1 - Math.exp(-liftEase * dt));
        const lift = state.lifts[v];

        // Openness & rotations
        const m = Math.max(0, 1 - Math.abs(r));
        const o = m * m * (3 - 2 * m); // smoothstep
        const rotY = -90 * o + state.tiltY * o;
        const rotX = state.tiltX * o;
        const rotZ = -4.5 * o;
        const transZ = o * 0.2 * state.H;
        const transY = -o * 0.025 * state.H - lift * 0.045 * state.H;
        const zIndex = Math.round(100 - Math.abs(r) * 4);

        tapeEl.style.zIndex = `${zIndex}`;
        tapeEl.style.transform = `translate3d(${x.toFixed(2)}px, ${transY.toFixed(2)}px, ${transZ.toFixed(2)}px) rotateZ(${rotZ.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

        // Shading
        const spineFace = tapeSpineRefs.current[v];
        const coverFace = tapeCoverRefs.current[v];
        if (spineFace) {
          spineFace.style.setProperty('--shade', (o * 0.55).toFixed(3));
        }
        if (coverFace) {
          coverFace.style.setProperty('--shade', ((1 - o) * 0.5).toFixed(3));
        }

        // Keep active cover ref for detail zoom transition
        if (Math.abs(r) < 0.5) {
          activeCoverFaceRef.current = coverFace;
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', measureGeometry);
    };
  }, [measureGeometry, swapCaptionText, updateTabsIndicator]);

  // Pointer move handler
  const handlePointerMove = (e: React.PointerEvent) => {
    const state = stateRef.current;
    state.mx = e.clientX;
    state.my = e.clientY;

    if (state.isDragging) {
      const dx = e.clientX - state.dragStartX;
      if (Math.abs(dx) > 5) {
        state.hasDragged = true;
      }
      const unit = state.ws + state.gap;
      state.T = state.dragStartT - dx / unit;
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const state = stateRef.current;
    if (state.isOpen) return;
    state.isDragging = true;
    state.hasDragged = false;
    state.dragStartX = e.clientX;
    state.dragStartT = state.T;
  };

  const handlePointerUp = () => {
    const state = stateRef.current;
    if (state.isDragging) {
      state.isDragging = false;
      state.T = Math.round(state.T);
    }
  };

  // Wheel handling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const state = stateRef.current;
      if (state.isOpen) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const unit = state.ws + state.gap;
      state.T += (delta / unit) * 0.5;

      if (state.wheelTimeout) clearTimeout(state.wheelTimeout);
      state.wheelTimeout = setTimeout(() => {
        state.T = Math.round(state.T);
      }, 160);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = stateRef.current;
      if (e.key === 'Escape') {
        if (state.isOpen) closeDetail();
      } else if (e.key === 'Enter') {
        if (!state.isOpen) openDetail();
      } else if (e.key === 'ArrowLeft') {
        if (!state.isOpen) state.T = Math.round(state.T) - 1;
      } else if (e.key === 'ArrowRight') {
        if (!state.isOpen) state.T = Math.round(state.T) + 1;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeDetail, openDetail]);

  // Tape click
  const handleTapeClick = (v: number) => {
    const state = stateRef.current;
    if (state.hasDragged || state.isOpen) return;

    let r = (v - state.s) % 36;
    while (r > 18) r -= 36;
    while (r < -18) r += 36;

    if (Math.abs(r) < 0.5) {
      openDetail();
    } else {
      state.T = Math.round(state.T + r);
    }
  };

  // Tab jump
  const handleTabClick = (tabId: string, filmIndex: number) => {
    const state = stateRef.current;
    if (state.isOpen) return;

    const currentFilmIndex = ((Math.round(state.s) % 12) + 12) % 12;
    const diff = ((filmIndex - currentFilmIndex + 18) % 12) - 6;
    state.T = Math.round(state.s) + diff;
    updateTabsIndicator(tabId);
  };

  // Arrow clicks
  const handlePrev = () => {
    const state = stateRef.current;
    if (state.isOpen) return;
    state.T = Math.round(state.T) - 1;
  };

  const handleNext = () => {
    const state = stateRef.current;
    if (state.isOpen) return;
    state.T = Math.round(state.T) + 1;
  };

  // Generate 36 tape items
  const tapes = Array.from({ length: 36 }, (_, v) => {
    const filmIndex = v % 12;
    const film = FILMS[filmIndex];
    const spineStyle = getBackgroundStyle(film.spineSheet, film.spineBox);
    const coverStyle = getBackgroundStyle(film.coverSheet, film.coverBox);

    return {
      v,
      film,
      spineStyle,
      coverStyle,
    };
  });

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none bg-[#EDEBE6] text-[#141414]"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Off-screen height probe to resolve exact CSS --H */}
      <div
        ref={probeRef}
        className="fixed top-0 left-0 pointer-events-none opacity-0 invisible"
        style={{ height: 'var(--H)' }}
      />

      {/* 1. Top Bar */}
      <header className="fixed top-0 left-0 w-full h-[84px] max-md:h-[64px] px-8 max-md:px-4 grid grid-cols-[1fr_auto_1fr] items-center z-30 pointer-events-none">
        {/* Left: BACK link */}
        <div className="justify-self-start pointer-events-auto">
          <a
            href="#back"
            onClick={(e) => e.preventDefault()}
            onPointerEnter={() => { stateRef.current.hoverBtn = true; }}
            onPointerLeave={() => { stateRef.current.hoverBtn = false; }}
            className="box lbl text-[#141414] hover:bg-[#141414] hover:text-[#EDEBE6] transition-colors duration-200"
          >
            BACK / 戻る
          </a>
        </div>

        {/* Centre: Logo */}
        <div className="flex flex-col items-center justify-center gap-[5px] text-[#1F3FB0] pointer-events-auto">
          <div className="font-logo-sc font-bold text-[22px] max-md:text-[17px] tracking-[0.04em] leading-none">
            莱昂·瓦萨里
          </div>
          <div className="lbl text-[9px] max-md:text-[7.5px] tracking-[0.34em] pl-[0.34em] leading-none">
            LEON VASARI
          </div>
        </div>

        {/* Right: Career label */}
        <div className="justify-self-end text-right max-md:hidden pointer-events-auto">
          <span className="lbl text-[#141414]">CAREER 1958年〜1989年</span>
        </div>
      </header>

      {/* 2. Decade Tabs */}
      <nav
        aria-label="Decades"
        className="fixed left-1/2 -translate-x-1/2 z-30"
        style={{
          top: 'calc(50% - var(--H) / 2 - 86px)',
        }}
      >
        <div className="relative inline-flex items-center">
          {/* Cobalt sliding indicator */}
          <div
            className="absolute top-0 h-[23px] bg-[#1F3FB0] pointer-events-none z-0"
            style={{
              left: `${decadeIndicatorStyle.left}px`,
              width: `${decadeIndicatorStyle.width}px`,
              transition: 'left 0.6s var(--ease), width 0.6s var(--ease)',
            }}
          />

          {DECADE_TABS.map((tab, idx) => {
            const isActive = tab.id === activeDecade;
            return (
              <button
                key={tab.id}
                ref={(el) => { tabsRef.current[idx] = el; }}
                type="button"
                onClick={() => handleTabClick(tab.id, tab.filmIndex)}
                onPointerEnter={() => { stateRef.current.hoverBtn = true; }}
                onPointerLeave={() => { stateRef.current.hoverBtn = false; }}
                className={`box lbl h-[23px] px-[11px] max-md:px-[7px] max-md:text-[9px] -ml-[1px] first:ml-0 z-10 transition-colors duration-450 ${
                  isActive ? 'text-white' : 'text-[#141414] hover:text-[#1F3FB0]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. The 3D Shelf Stage */}
      <section
        aria-label="Filmography shelf"
        className="shelf-viewport fixed left-0 w-full z-10"
        style={{
          top: 'calc(50% - var(--H) / 2 - 40px)',
          height: 'calc(var(--H) + 80px)',
        }}
      >
        <div
          ref={stageRef}
          className="shelf-stage absolute left-1/2 top-1/2 w-0 h-0"
        >
          {tapes.map(({ v, film, spineStyle, coverStyle }) => (
            <div
              key={v}
              ref={(el) => { tapeElsRef.current[v] = el; }}
              className="tape absolute left-0 top-0 w-0 h-0 cursor-pointer"
              onClick={() => handleTapeClick(v)}
              onPointerEnter={() => {
                stateRef.current.hoverVirtual = v;
              }}
              onPointerLeave={() => {
                if (stateRef.current.hoverVirtual === v) {
                  stateRef.current.hoverVirtual = -1;
                }
              }}
            >
              {/* Spine Face */}
              <div
                ref={(el) => { tapeSpineRefs.current[v] = el; }}
                className="tape-face sp"
                style={spineStyle}
                title={`${film.title} (${film.year})`}
              />
              {/* Cover Face */}
              <div
                ref={(el) => { tapeCoverRefs.current[v] = el; }}
                className="tape-face cv"
                style={coverStyle}
                title={`${film.title} (${film.year})`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Play Ring */}
      <button
        ref={playRingRef}
        type="button"
        aria-label="Open film"
        onClick={openDetail}
        onPointerEnter={() => { stateRef.current.hoverBtn = true; }}
        onPointerLeave={() => { stateRef.current.hoverBtn = false; }}
        className="fixed w-[42px] h-[42px] rounded-full border border-[#1F3FB0] bg-[#EDEBE6]/75 flex items-center justify-center z-25 transition-transform duration-100 ease-out shadow-sm"
        style={{ willChange: 'transform' }}
      >
        <svg
          viewBox="0 0 12 14"
          className="w-3 h-3.5 fill-[#1F3FB0] ml-[2px]"
          aria-hidden="true"
        >
          <polygon points="0,0 12,7 0,14" />
        </svg>
      </button>

      {/* 5. Masked Caption */}
      <div
        aria-live="polite"
        className="fixed left-1/2 -translate-x-1/2 flex flex-col items-center gap-[9px] pointer-events-none z-20 text-center w-[min(92vw,760px)]"
        style={{
          top: 'calc(50% + var(--H) / 2 + 30px)',
        }}
      >
        {/* Title */}
        <div
          ref={titleMaskRef}
          className="relative overflow-hidden w-full h-[40px] max-md:h-[30px] font-serif-vasari text-[31px] max-md:text-[24px] leading-[1.12] tracking-[-0.01em] text-[#141414] font-normal"
        />

        {/* Subtitle */}
        <div
          ref={subtitleMaskRef}
          className="relative overflow-hidden w-full h-[18px] lbl font-medium text-[10.5px] max-md:text-[9.5px] text-[#1F3FB0]"
        />

        {/* Year */}
        <div
          ref={yearMaskRef}
          className="relative overflow-hidden w-full h-[16px] font-sans-vasari font-medium text-[11px] tracking-[0.08em] text-[#141414]"
        />
      </div>

      {/* 6. Navigation Arrows */}
      <button
        type="button"
        aria-label="Previous film"
        onClick={handlePrev}
        onPointerEnter={() => { stateRef.current.hoverBtn = true; }}
        onPointerLeave={() => { stateRef.current.hoverBtn = false; }}
        className="fixed left-[20px] max-md:left-[6px] w-[44px] h-[44px] flex items-center justify-center z-25 text-[#141414] hover:text-[#1F3FB0] transition-colors"
        style={{
          top: 'calc(50% + var(--H) / 2 + 40px)',
        }}
      >
        <svg
          viewBox="0 0 18 10"
          className="w-[18px] h-[10px] stroke-current fill-none"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 1 L1 5 L5 9" />
          <path d="M1 5 L17 5" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Next film"
        onClick={handleNext}
        onPointerEnter={() => { stateRef.current.hoverBtn = true; }}
        onPointerLeave={() => { stateRef.current.hoverBtn = false; }}
        className="fixed right-[20px] max-md:right-[6px] w-[44px] h-[44px] flex items-center justify-center z-25 text-[#141414] hover:text-[#1F3FB0] transition-colors"
        style={{
          top: 'calc(50% + var(--H) / 2 + 40px)',
        }}
      >
        <svg
          viewBox="0 0 18 10"
          className="w-[18px] h-[10px] stroke-current fill-none"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 1 L17 5 L13 9" />
          <path d="M17 5 L1 5" />
        </svg>
      </button>

      {/* 7. Footer */}
      <footer className="fixed bottom-[26px] max-md:bottom-[18px] left-[32px] max-md:left-[16px] right-[32px] max-md:right-[16px] flex items-center justify-between z-20 pointer-events-none">
        <div className="lbl text-[#141414] max-md:text-[9px]">
          © LEON VASARI. ALL RIGHTS RESERVED.
        </div>
        <div className="lbl text-[#141414] max-md:text-[9px] pointer-events-auto flex items-center gap-2">
          <a
            href="#fb"
            onClick={(e) => e.preventDefault()}
            onPointerEnter={() => { stateRef.current.hoverBtn = true; }}
            onPointerLeave={() => { stateRef.current.hoverBtn = false; }}
            className="hover:text-[#1F3FB0] transition-colors"
          >
            FB
          </a>
          <span>/</span>
          <a
            href="#tw"
            onClick={(e) => e.preventDefault()}
            onPointerEnter={() => { stateRef.current.hoverBtn = true; }}
            onPointerLeave={() => { stateRef.current.hoverBtn = false; }}
            className="hover:text-[#1F3FB0] transition-colors"
          >
            TW
          </a>
        </div>
      </footer>

      {/* Paper Grain Overlay */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-40"
        style={{ mixBlendMode: 'multiply', opacity: 0.55 }}
        aria-hidden="true"
      >
        <filter id="paper-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 0 0.38  0 0 0 0.22 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-noise)" />
      </svg>

      {/* 8. Custom Cursor (Fine pointer only) */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-[58px] h-[58px] -ml-[29px] -mt-[29px] pointer-events-none z-[100] max-md:hidden"
        style={{ willChange: 'transform' }}
        aria-hidden="true"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Ring */}
          <div className="cursor-ring absolute inset-0 rounded-full border-[1.5px] border-[#141414] bg-transparent" />
          {/* Center Dot */}
          <div className="cursor-dot w-[6px] h-[6px] rounded-full bg-[#141414]" />
          {/* OPEN / 開く label */}
          <div className="cursor-label absolute flex flex-col items-center justify-center text-white scale-0 pointer-events-none">
            <span className="lbl text-[10px] leading-[1.25] tracking-[0.1em] text-white">
              OPEN
            </span>
            <span className="lbl text-[10px] leading-[1.25] tracking-[0.1em] text-white">
              開く
            </span>
          </div>
        </div>
      </div>

      {/* 9. Detail Dialog (Opening a film: Paper Sheet & Ragged Ink Reveal) */}
      <div
        ref={detailDialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${detailFilm.title} Detail`}
        className="detail-dialog fixed inset-0 z-[60] bg-[#F4F2ED] overflow-y-auto"
        style={{ visibility: 'hidden' }}
      >
        {/* Detail Top Header */}
        <div className="fixed top-0 left-0 w-full h-[84px] max-md:h-[64px] px-8 max-md:px-4 flex items-center justify-between z-10 pointer-events-none">
          <button
            type="button"
            onClick={closeDetail}
            onPointerEnter={() => { stateRef.current.hoverBtn = true; }}
            onPointerLeave={() => { stateRef.current.hoverBtn = false; }}
            className="box lbl text-[#141414] hover:bg-[#141414] hover:text-[#EDEBE6] transition-colors pointer-events-auto"
          >
            CLOSE / 閉じる
          </button>

          <div className="flex flex-col items-center justify-center gap-[5px] text-[#1F3FB0]">
            <div className="font-logo-sc font-bold text-[22px] max-md:text-[17px] tracking-[0.04em] leading-none">
              莱昂·瓦萨里
            </div>
            <div className="lbl text-[9px] max-md:text-[7.5px] tracking-[0.34em] pl-[0.34em] leading-none">
              LEON VASARI
            </div>
          </div>

          <div className="w-[80px]" />
        </div>

        {/* Detail Content Grid */}
        <div className="min-h-full grid grid-cols-2 max-md:grid-cols-1 gap-[4vw] max-md:gap-[24px] pt-[110px] max-md:pt-[84px] pb-[56px] max-md:pb-[40px] px-[7vw] max-md:px-[22px] items-center">
          {/* Left Column: Masked Lines */}
          <div className="flex flex-col justify-center max-w-[520px] gap-[18px] max-md:order-2">
            {/* 1. Subtitle */}
            <div className="overflow-hidden">
              <div
                ref={(el) => { detailLinesRef.current[0] = el; }}
                className="lbl text-[#1F3FB0] font-medium"
              >
                {detailFilm.romaji} / {detailFilm.kanji}
              </div>
            </div>

            {/* 2. Title */}
            <div className="overflow-hidden">
              <h1
                ref={(el) => { detailLinesRef.current[1] = el; }}
                className="font-serif-vasari text-[clamp(44px,5.4vw,84px)] max-md:text-[42px] leading-[1] tracking-[-0.025em] text-[#141414] font-normal"
              >
                {detailFilm.title}
              </h1>
            </div>

            {/* 3. Meta line */}
            <div className="overflow-hidden">
              <div
                ref={(el) => { detailLinesRef.current[2] = el; }}
                className="lbl text-[#6D6A63]"
              >
                {detailFilm.year} / {detailFilm.genre.toUpperCase()} / {detailFilm.minutes} MIN
              </div>
            </div>

            {/* 4. Synopsis */}
            <div className="overflow-hidden">
              <p
                ref={(el) => { detailLinesRef.current[3] = el; }}
                className="font-serif-vasari text-[17px] max-md:text-[16px] leading-[1.5] text-[#141414] max-w-[42ch]"
              >
                {detailFilm.synopsis}
              </p>
            </div>

            {/* 5. Italic credit */}
            <div className="overflow-hidden">
              <p
                ref={(el) => { detailLinesRef.current[4] = el; }}
                className="font-serif-vasari italic text-[15px] text-[#6D6A63]"
              >
                Written and directed by Leon Vasari. 監督作品
              </p>
            </div>

            {/* 6. Watch button */}
            <div className="overflow-hidden pt-[10px]">
              <button
                ref={(el) => { detailLinesRef.current[5] = el; }}
                type="button"
                onPointerEnter={() => { stateRef.current.hoverBtn = true; }}
                onPointerLeave={() => { stateRef.current.hoverBtn = false; }}
                className="box lbl h-[44px] px-[20px] text-[#1F3FB0] border-[#1F3FB0] hover:bg-[#1F3FB0] hover:text-white transition-colors"
              >
                WATCH THE FILM / 映画を見る
              </button>
            </div>
          </div>

          {/* Right Column: Poster SVG with Ink Blots */}
          <div className="flex items-center justify-center max-md:order-1">
            <div
              className="relative w-full max-h-[78vh] max-md:h-[46svh] flex items-center justify-center"
              style={{ aspectRatio: '474 / 900' }}
            >
              <svg
                viewBox="0 0 474 900"
                className="w-full h-full"
                aria-hidden="true"
              >
                <defs>
                  {/* Ink filter feeding feDisplacementMap */}
                  <filter
                    id="ink-bleed-filter"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.011"
                      numOctaves="3"
                      seed="7"
                      result="noise"
                    />
                    <feDisplacementMap
                      in="SourceGraphic"
                      in2="noise"
                      scale="120"
                      xChannelSelector="R"
                      yChannelSelector="G"
                    />
                  </filter>

                  {/* Ink Mask */}
                  <mask
                    id="ink-mask"
                    maskUnits="userSpaceOnUse"
                    x="-200"
                    y="-200"
                    width="874"
                    height="1300"
                  >
                    <g
                      ref={inkBlobsGroupRef}
                      filter="url(#ink-bleed-filter)"
                      fill="#FFFFFF"
                    >
                      {INK_BLOBS.map((blob) => (
                        <circle
                          key={blob.id}
                          cx={blob.cx}
                          cy={blob.cy}
                          r="0"
                        />
                      ))}
                    </g>
                  </mask>

                  {/* Clip to 474 x 900 */}
                  <clipPath id="poster-clip">
                    <rect x="0" y="0" width="474" height="900" />
                  </clipPath>
                </defs>

                {/* Cover Cropped Image */}
                <g clipPath="url(#poster-clip)">
                  <image
                    href={SHEETS.covers.url}
                    x={(-detailFilm.coverBox[0] * 474) / detailFilm.coverBox[2]}
                    y={(-detailFilm.coverBox[1] * 900) / detailFilm.coverBox[3]}
                    width={(SHEETS.covers.w * 474) / detailFilm.coverBox[2]}
                    height={(SHEETS.covers.h * 900) / detailFilm.coverBox[3]}
                    preserveAspectRatio="none"
                    mask="url(#ink-mask)"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
