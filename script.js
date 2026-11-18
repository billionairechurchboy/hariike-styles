/* ==========================================================================
   Hariike Styles — interactions & motion
   GSAP + ScrollTrigger + Lenis, with graceful fallback when unavailable
   or when the visitor prefers reduced motion.
   ========================================================================== */
(function () {
    'use strict';
    window.__hsReady = true;

    var root = document.documentElement;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    var motion = hasGsap && !reduce;

    var $ = function (s, c) { return (c || document).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
    var store = {
        get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } },
        del: function (k) { try { sessionStorage.removeItem(k); } catch (e) { /* ignore */ } }
    };

    if (motion) {
        root.classList.add('motion');
        gsap.registerPlugin(ScrollTrigger);
        gsap.defaults({ ease: 'expo.out', duration: 1.2 });
    } else {
        root.classList.remove('motion');
        root.classList.add('no-motion');
    }

    /* ---------------------------------------------------------------- Lenis */
    var lenis = null;
    if (motion && typeof window.Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.15,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            smoothWheel: true
        });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
    }
    function headerOffset() { return -(($('[data-header]') || {}).offsetHeight || 0); }
    function scrollToTarget(target, offset) {
        if (lenis) {
            lenis.scrollTo(target, { offset: offset || 0, duration: 1.4 });
        } else {
            var y = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY + (offset || 0);
            window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
        }
    }

    /* ---------------------------------------------------------------- Text splitting */
    function splitWords(el, wrapperClass, innerClass) {
        if (el.dataset.splitDone) return $$('.' + innerClass, el);
        var walk = function (node) {
            Array.prototype.slice.call(node.childNodes).forEach(function (child) {
                if (child.nodeType === 3) {
                    var parts = child.textContent.split(/(\s+)/);
                    var frag = document.createDocumentFragment();
                    parts.forEach(function (p) {
                        if (!p) return;
                        if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
                        var inner = document.createElement('span');
                        inner.className = innerClass;
                        inner.textContent = p;
                        if (wrapperClass) {
                            var outer = document.createElement('span');
                            outer.className = wrapperClass;
                            outer.appendChild(inner);
                            frag.appendChild(outer);
                        } else {
                            frag.appendChild(inner);
                        }
                    });
                    node.replaceChild(frag, child);
                } else if (child.nodeType === 1 && child.tagName !== 'BR') {
                    walk(child);
                }
            });
        };
        walk(el);
        el.dataset.splitDone = '1';
        return $$('.' + innerClass, el);
    }

    /* ---------------------------------------------------------------- Footer year */
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    /* ---------------------------------------------------------------- Header */
    var header = $('[data-header]');
    var menuOpen = false;
    (function initHeader() {
        if (!header) return;
        var lastY = window.scrollY;
        var onScroll = function () {
            var y = window.scrollY;
            header.classList.toggle('is-scrolled', y > 40);
            var hide = y > 320 && y > lastY + 2 && !menuOpen;
            var show = y < lastY - 2 || y < 320;
            if (hide) { header.classList.add('is-hidden'); root.classList.add('header-hidden'); }
            else if (show) { header.classList.remove('is-hidden'); root.classList.remove('header-hidden'); }
            lastY = y;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    })();

    /* ---------------------------------------------------------------- Mobile menu */
    (function initMenu() {
        var toggle = $('.menu-toggle');
        var menu = $('#menu');
        if (!toggle || !menu) return;
        var label = $('.menu-toggle__label', toggle);
        var set = function (open) {
            menuOpen = open;
            root.classList.toggle('menu-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            if (label) label.textContent = open ? 'Close' : 'Menu';
            if (open) { menu.removeAttribute('inert'); header.classList.remove('is-hidden'); }
            else menu.setAttribute('inert', '');
            if (lenis) { open ? lenis.stop() : lenis.start(); }
            document.body.style.overflow = open ? 'hidden' : '';
        };
        toggle.addEventListener('click', function () { set(!menuOpen); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) { set(false); toggle.focus(); } });
        window.addEventListener('resize', function () { if (menuOpen && window.innerWidth > 1100) set(false); });
        $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { if (a.getAttribute('aria-current') === 'page') set(false); }); });
    })();

    /* ---------------------------------------------------------------- Page transitions */
    var curtain = $('.curtain');
    (function initTransitions() {
        if (!curtain) return;
        document.addEventListener('click', function (e) {
            var a = e.target.closest('a[href]');
            if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            if (a.target === '_blank' || a.hasAttribute('download')) return;
            var url;
            try { url = new URL(a.href, location.href); } catch (err) { return; }
            if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
            if (url.pathname === location.pathname && url.search === location.search) return; // same-page anchors
            if (!motion) return;
            e.preventDefault();
            store.set('hs-transition', '1');
            gsap.fromTo(curtain, { yPercent: 100 }, {
                yPercent: 0, duration: 0.75, ease: 'power4.inOut',
                onStart: function () { curtain.classList.add('is-covering'); },
                onComplete: function () { location.href = url.href; }
            });
            gsap.fromTo($('img', curtain), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.35 });
        });
        window.addEventListener('pageshow', function (e) {
            if (e.persisted) {
                if (hasGsap) gsap.set(curtain, { clearProps: 'all' });
                curtain.classList.remove('is-covering');
                root.classList.remove('arriving');
            }
        });
    })();

    function revealPage() {
        return new Promise(function (resolve) {
            var arriving = root.classList.contains('arriving');
            store.del('hs-transition');
            if (!arriving || !motion || !curtain) { root.classList.remove('arriving'); resolve(); return; }
            gsap.set($('img', curtain), { opacity: 1 });
            gsap.timeline({ onComplete: function () { root.classList.remove('arriving'); gsap.set(curtain, { clearProps: 'all' }); gsap.set($('img', curtain), { clearProps: 'all' }); } })
                .to($('img', curtain), { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' })
                .fromTo(curtain, { yPercent: 0 }, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.1')
                .add(resolve, '-=0.55');
        });
    }

    /* ---------------------------------------------------------------- Preloader */
    function runPreloader() {
        return new Promise(function (resolve) {
            var pre = $('.preloader');
            if (!pre) { resolve(); return; }
            if (!motion || root.classList.contains('seen')) { pre.classList.add('is-done'); resolve(); return; }
            store.set('hs-seen', '1');
            if (lenis) lenis.stop();
            var count = $('.preloader__count', pre);
            var counter = { v: 0 };
            gsap.timeline({
                onComplete: function () { pre.classList.add('is-done'); if (lenis) lenis.start(); }
            })
                .to($('.preloader__logo', pre), { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'power3.inOut' }, 0.1)
                .to($('.preloader__bar i', pre), { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
                .to(counter, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: function () { count.textContent = Math.round(counter.v); } }, 0)
                .to(pre, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=0.15')
                .add(resolve, '-=0.7');
        });
    }

    /* ---------------------------------------------------------------- Cursor */
    (function initCursor() {
        if (!motion || !finePointer) return;
        var cursor = $('.cursor');
        if (!cursor) return;
        root.classList.add('has-cursor');
        var dot = $('.cursor__dot', cursor), ring = $('.cursor__ring', cursor), label = $('.cursor__label', cursor);
        gsap.set([dot, ring], { x: -100, y: -100 });
        var dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' }), dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
        var rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
        window.addEventListener('mousemove', function (e) { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
        document.addEventListener('mouseleave', function () { gsap.to(cursor, { opacity: 0, duration: 0.3 }); });
        document.addEventListener('mouseenter', function () { gsap.to(cursor, { opacity: 1, duration: 0.3 }); });
        document.addEventListener('mouseover', function (e) {
            var labelled = e.target.closest('[data-cursor]');
            var hoverable = e.target.closest('a, button, input, select, textarea, label');
            cursor.classList.toggle('is-label', !!labelled);
            cursor.classList.toggle('is-hover', !labelled && !!hoverable);
            if (labelled) label.textContent = labelled.getAttribute('data-cursor');
        });
    })();

    /* ---------------------------------------------------------------- Magnetic */
    (function initMagnetic() {
        if (!motion || !finePointer) return;
        $$('[data-magnetic]').forEach(function (el) {
            var xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
            var yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
            var strength = el.classList.contains('orb') ? 0.4 : 0.25;
            el.addEventListener('mousemove', function (e) {
                var r = el.getBoundingClientRect();
                xTo((e.clientX - (r.left + r.width / 2)) * strength);
                yTo((e.clientY - (r.top + r.height / 2)) * strength);
            });
            el.addEventListener('mouseleave', function () {
                gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
            });
        });
    })();

    /* ---------------------------------------------------------------- Scroll reveals */
    function initReveals() {
        if (!motion) return;

        $$('[data-split]').forEach(function (el) {
            var words = splitWords(el, 'w', 'wi');
            gsap.fromTo(words, { yPercent: 110, y: 0 }, {
                yPercent: 0, duration: 1.3, stagger: 0.045,
                scrollTrigger: { trigger: el, start: 'top 88%', once: true }
            });
        });

        var revealEls = $$('[data-reveal]');
        gsap.set(revealEls, { opacity: 0, y: 40 });
        // Anything already on screen at load animates in straight away
        var vh = window.innerHeight;
        var initial = revealEls.filter(function (el) { return el.getBoundingClientRect().top < vh; });
        gsap.to(initial, { opacity: 1, y: 0, duration: 1.3, stagger: 0.1, delay: 0.35 });
        revealEls = revealEls.filter(function (el) { return initial.indexOf(el) === -1; });
        ScrollTrigger.batch(revealEls, {
            start: 'top 90%', once: true,
            onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, stagger: 0.09, overwrite: true }); }
        });

        $$('[data-clip]').forEach(function (el) {
            var img = $('img', el);
            var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
            tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' });
            if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 2, ease: 'expo.out', clearProps: 'scale' }, 0);
        });

        $$('[data-speed]').forEach(function (img) {
            var s = parseFloat(img.getAttribute('data-speed')) / 2;
            gsap.fromTo(img, { yPercent: -s }, {
                yPercent: s, ease: 'none',
                scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
            });
        });

        $$('[data-hero-media] img').forEach(function (img) {
            gsap.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 2.4, ease: 'expo.out' });
            gsap.to(img, {
                yPercent: 12, ease: 'none',
                scrollTrigger: { trigger: img.closest('section'), start: 'top top', end: 'bottom top', scrub: true }
            });
        });

        $$('[data-scrub]').forEach(function (el) {
            var words = splitWords(el, null, 'sw');
            gsap.fromTo(words, { opacity: 0.14 }, {
                opacity: 1, ease: 'none', stagger: 0.1,
                scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true }
            });
        });

        $$('[data-count]').forEach(function (el) {
            var end = parseInt(el.getAttribute('data-count'), 10);
            var start = end > 1000 ? end - 18 : 0;
            var o = { v: start };
            el.textContent = start;
            gsap.to(o, {
                v: end, duration: 2, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 90%', once: true },
                onUpdate: function () { el.textContent = Math.round(o.v); }
            });
        });

        var mark = $('[data-mark]');
        if (mark) {
            var text = mark.textContent;
            mark.textContent = '';
            text.split('').forEach(function (ch) {
                var s = document.createElement('span');
                s.className = 'ch';
                s.textContent = ch;
                mark.appendChild(s);
            });
            gsap.fromTo($$('.ch', mark), { yPercent: 70, opacity: 0 }, {
                yPercent: 0, opacity: 1, ease: 'power2.out', stagger: 0.06,
                scrollTrigger: { trigger: mark, start: 'top 98%', end: 'bottom bottom', scrub: 0.8 }
            });
        }
    }

    /* ---------------------------------------------------------------- Home hero */
    function initHero() {
        var hero = $('[data-hero]');
        if (!hero) return function () {};
        var slides = $$('[data-slide]', hero);
        var lines = $$('[data-hero-line]', hero);
        var bars = $$('.hero__bar', hero);
        var countEl = $('[data-hero-count]', hero);
        var DWELL = 6.5;
        var current = 0;
        var busy = false;

        if (!motion) {
            var tick = function (n) {
                slides[current].classList.remove('is-active'); lines[current].classList.remove('is-active');
                current = n;
                slides[current].classList.add('is-active'); lines[current].classList.add('is-active');
                if (countEl) countEl.textContent = '0' + (current + 1);
                bars.forEach(function (b, i) { b.querySelector('i').style.transform = 'scaleX(' + (i <= current ? 1 : 0) + ')'; });
            };
            bars.forEach(function (b, i) { b.addEventListener('click', function () { tick(i); }); });
            tick(0);
            if (!reduce) setInterval(function () { tick((current + 1) % slides.length); }, DWELL * 1000);
            return function () {};
        }

        var lineWords = lines.map(function (l) { return splitWords(l, 'w', 'wi'); });
        lineWords.forEach(function (w) { gsap.set(w, { yPercent: 110 }); });
        gsap.set($$('[data-hero-fade]', hero), { opacity: 0, y: 30 });
        var progress = null;
        var kenBurns = null;

        function startProgress() {
            bars.forEach(function (b, i) { gsap.set(b.querySelector('i'), { scaleX: i < current ? 1 : 0 }); });
            if (progress) progress.kill();
            progress = gsap.fromTo(bars[current].querySelector('i'), { scaleX: 0 }, {
                scaleX: 1, duration: DWELL, ease: 'none',
                onComplete: function () { go((current + 1) % slides.length); }
            });
            if (kenBurns) kenBurns.kill();
            kenBurns = gsap.to(slides[current].querySelector('img'), { scale: 1, duration: DWELL + 2, ease: 'none' });
        }

        function go(next) {
            if (busy || next === current) return;
            busy = true;
            var prev = current;
            current = next;
            if (countEl) countEl.textContent = '0' + (current + 1);
            var nextSlide = slides[next];
            nextSlide.classList.add('is-active');
            gsap.set(nextSlide, { zIndex: 3 });
            gsap.timeline({
                onComplete: function () {
                    slides[prev].classList.remove('is-active');
                    gsap.set(nextSlide, { clearProps: 'zIndex,clipPath' });
                    busy = false;
                }
            })
                .fromTo(nextSlide, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, 0)
                .fromTo(nextSlide.querySelector('img'), { scale: 1.3 }, { scale: 1.08, duration: 2, ease: 'expo.out' }, 0)
                .to(slides[prev].querySelector('img'), { scale: 1.15, duration: 1.5, ease: 'expo.inOut' }, 0)
                .to(lineWords[prev], { yPercent: -110, duration: 0.7, stagger: 0.02, ease: 'power3.in' }, 0)
                .add(function () {
                    lines[prev].classList.remove('is-active');
                    lines[next].classList.add('is-active');
                }, 0.75)
                .fromTo(lineWords[next], { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.04, ease: 'expo.out' }, 0.75);
            startProgress();
        }

        bars.forEach(function (b, i) { b.addEventListener('click', function () { go(i); }); });

        ScrollTrigger.create({
            trigger: hero, start: 'top top', end: 'bottom top',
            onLeave: function () { if (progress) progress.pause(); },
            onEnterBack: function () { if (progress) progress.resume(); }
        });
        document.addEventListener('visibilitychange', function () {
            if (!progress) return;
            document.hidden ? progress.pause() : progress.resume();
        });

        // Scroll-out parallax
        gsap.to($('.hero__content', hero), {
            yPercent: -18, opacity: 0.1, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
        });
        gsap.to($('.hero__slides', hero), {
            yPercent: 20, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
        });

        return function intro() {
            gsap.fromTo(slides[0].querySelector('img'), { scale: 1.35 }, { scale: 1.08, duration: 2.6, ease: 'expo.out' });
            gsap.to(lineWords[0], { yPercent: 0, duration: 1.4, stagger: 0.06, delay: 0.15 });
            gsap.to($$('[data-hero-fade]', hero), { opacity: 1, y: 0, duration: 1.4, stagger: 0.12, delay: 0.5, onComplete: startProgress });
        };
    }

    /* ---------------------------------------------------------------- Marquee */
    function initMarquee() {
        var track = $('[data-marquee]');
        if (!track || !motion) return;
        var loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
        var dir = 1;
        ScrollTrigger.create({
            trigger: track, start: 'top bottom', end: 'bottom top',
            onUpdate: function (self) {
                var v = self.getVelocity();
                dir = v < 0 ? -1 : 1;
                var boost = Math.min(Math.abs(v) / 250, 5);
                gsap.to(loop, { timeScale: dir * (1 + boost), duration: 0.2, overwrite: true });
                gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2 });
            }
        });
    }

    /* ---------------------------------------------------------------- Services hover follower */
    function initFollower() {
        var list = $('[data-svc-list]');
        var follower = $('[data-follower]');
        if (!list || !follower || !motion || !finePointer) return;
        var imgs = $$('img', follower);
        var xTo = gsap.quickTo(follower, 'x', { duration: 0.7, ease: 'power3' });
        var yTo = gsap.quickTo(follower, 'y', { duration: 0.7, ease: 'power3' });
        var lastX = 0;
        list.addEventListener('mouseenter', function (e) {
            gsap.set(follower, { x: e.clientX, y: e.clientY });
            gsap.to(follower, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' });
        });
        list.addEventListener('mouseleave', function () { gsap.to(follower, { opacity: 0, scale: 0.6, rotate: 0, duration: 0.5, ease: 'power3.out' }); });
        list.addEventListener('mousemove', function (e) {
            xTo(e.clientX); yTo(e.clientY);
            var dx = e.clientX - lastX; lastX = e.clientX;
            gsap.to(follower, { rotate: gsap.utils.clamp(-10, 10, dx * 0.6), duration: 0.6, ease: 'power3' });
        });
        $$('.svc-row', list).forEach(function (row) {
            row.addEventListener('mouseenter', function () {
                var i = +row.getAttribute('data-img');
                imgs.forEach(function (img, j) { img.classList.toggle('is-on', i === j); });
            });
        });
    }

    /* ---------------------------------------------------------------- Horizontal showcase */
    function initShowcase() {
        var section = $('[data-showcase]');
        if (!section || !motion) return;
        var track = $('[data-showcase-track]', section);
        var mm = gsap.matchMedia();
        mm.add('(min-width: 900px)', function () {
            section.classList.add('is-pinned');
            var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
            var tween = gsap.to(track, {
                x: function () { return -dist(); }, ease: 'none',
                scrollTrigger: {
                    trigger: section, start: 'top top', end: function () { return '+=' + dist(); },
                    pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
                }
            });
            $$('.piece .frame img', track).forEach(function (img) {
                gsap.fromTo(img, { xPercent: -6 }, {
                    xPercent: 6, ease: 'none',
                    scrollTrigger: { trigger: img.closest('.piece'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true }
                });
            });
            return function () { section.classList.remove('is-pinned'); };
        });
    }

    /* ---------------------------------------------------------------- Testimonials */
    function initQuotes() {
        var wrap = $('[data-quotes]');
        if (!wrap) return;
        var quotes = $$('[data-quote]', wrap);
        var dots = $$('.quotes__dot', wrap);
        var current = 0, timer = null, DWELL = 6.5;

        function show(n) {
            if (n === current) return;
            var prev = quotes[current];
            var next = quotes[n];
            dots[current].classList.remove('is-active');
            current = n;
            dots[n].classList.add('is-active');
            if (motion) {
                gsap.to(prev, { opacity: 0, y: -24, duration: 0.5, ease: 'power2.in', onComplete: function () { prev.classList.remove('is-active'); gsap.set(prev, { clearProps: 'all' }); } });
                next.classList.add('is-active');
                gsap.fromTo(next, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.1, delay: 0.45 });
            } else {
                prev.classList.remove('is-active');
                next.classList.add('is-active');
            }
            run();
        }
        function run() {
            if (timer) { timer.kill ? timer.kill() : clearTimeout(timer); }
            dots.forEach(function (d) { var i = d.querySelector('i'); i.style.transform = ''; });
            if (motion) {
                gsap.set($$('.quotes__dot i', wrap), { scaleX: 0 });
                timer = gsap.fromTo(dots[current].querySelector('i'), { scaleX: 0 }, { scaleX: 1, duration: DWELL, ease: 'none', onComplete: function () { show((current + 1) % quotes.length); } });
            } else if (!reduce) {
                timer = setTimeout(function () { show((current + 1) % quotes.length); }, DWELL * 1000);
            }
        }
        dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); }); });
        run();
    }

    /* ---------------------------------------------------------------- Services stacking cards */
    function initStack() {
        if (!motion) return;
        var cards = $$('[data-stack-card]');
        cards.forEach(function (card, i) {
            var next = cards[i + 1];
            if (!next) return;
            gsap.to(card, {
                scale: 0.92, '--dim': 0.55, ease: 'none',
                scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true }
            });
        });
    }

    /* ---------------------------------------------------------------- Collection */
    function initCollection() {
        var looks = $$('[data-look]');
        if (!looks.length) return;
        var chips = $$('.chip');
        var chipBar = $('.chips');
        var barOffset = function () { return headerOffset() - (($('.index-bar') || {}).offsetHeight || 0) - 24; };

        function activateChip(key) {
            chips.forEach(function (c) {
                var on = c.getAttribute('data-jump') === key;
                c.classList.toggle('is-active', on);
                if (on && chipBar) chipBar.scrollTo({ left: c.offsetLeft - chipBar.offsetWidth / 2 + c.offsetWidth / 2, behavior: 'smooth' });
            });
        }
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                var key = chip.getAttribute('data-jump');
                if (key === 'top') { scrollToTarget($('.lookbook'), barOffset()); activateChip('top'); return; }
                var el = document.getElementById(key);
                if (!el) return;
                scrollToTarget(el, barOffset());
                activateChip(key);
                el.classList.remove('is-flash');
                setTimeout(function () { el.classList.add('is-flash'); }, 900);
                setTimeout(function () { el.classList.remove('is-flash'); }, 2400);
            });
        });
        if (hasGsap) {
            looks.forEach(function (look) {
                ScrollTrigger.create({
                    trigger: look, start: 'top 55%', end: 'bottom 55%',
                    onToggle: function (self) { if (self.isActive) activateChip(look.id); }
                });
            });
        }

        // Lightbox
        var dialog = $('[data-lightbox]');
        if (!dialog || typeof dialog.showModal !== 'function') return;
        var data = looks.map(function (look) {
            var imgs = $$('img', look);
            return {
                id: look.id,
                name: $('.look__name', look).textContent,
                tag: $('.look__tag', look).textContent,
                desc: $('.look__desc', look).textContent,
                imgs: imgs.map(function (i) { return i.getAttribute('src'); })
            };
        });
        var idx = 0, opener = null;
        var lbImgs = $$('[data-lb-img]', dialog);
        var title = $('[data-lb-title]', dialog), tag = $('[data-lb-tag]', dialog), desc = $('[data-lb-desc]', dialog);
        var indexEl = $('[data-lb-index]', dialog), enquire = $('[data-lb-enquire]', dialog);
        var textEls = [title, tag, desc];

        function fill(i) {
            idx = (i + data.length) % data.length;
            var d = data[idx];
            lbImgs.forEach(function (img, j) { img.src = d.imgs[j] || d.imgs[0]; img.alt = d.name + ' — view ' + (j + 1); });
            title.textContent = d.name; tag.textContent = d.tag; desc.textContent = d.desc;
            indexEl.textContent = (idx + 1 < 10 ? '0' : '') + (idx + 1);
            enquire.href = 'mailto:Hariikestyles@gmail.com?subject=' + encodeURIComponent('Enquiry: ' + d.name) +
                '&body=' + encodeURIComponent('Hello Hariike Styles,\n\nI would love to know more about the ' + d.name + ' piece from your collection.\n\n');
            if (history.replaceState) history.replaceState(null, '', '#' + d.id);
        }
        function animateIn() {
            if (!motion) return;
            gsap.fromTo($$('.lightbox__media .frame', dialog), { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut', stagger: 0.08 });
            gsap.fromTo(lbImgs, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'expo.out', stagger: 0.08 });
            gsap.fromTo(textEls, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, stagger: 0.07, delay: 0.3 });
        }
        function open(i, from) {
            opener = from || null;
            fill(i);
            dialog.showModal();
            if (lenis) lenis.stop();
            if (motion) gsap.fromTo($('.lightbox__panel', dialog), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' });
            animateIn();
        }
        function close() {
            var done = function () {
                dialog.close();
                if (lenis) lenis.start();
                if (history.replaceState) history.replaceState(null, '', location.pathname);
                if (opener) opener.focus({ preventScroll: true });
            };
            if (motion) gsap.to($('.lightbox__panel', dialog), { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'expo.inOut', onComplete: function () { gsap.set($('.lightbox__panel', dialog), { clearProps: 'clipPath' }); done(); } });
            else done();
        }
        function step(dir) {
            if (!motion) { fill(idx + dir); return; }
            gsap.to(textEls.concat(lbImgs), {
                opacity: 0, duration: 0.3, ease: 'power2.in',
                onComplete: function () { gsap.set(lbImgs, { opacity: 1 }); fill(idx + dir); animateIn(); }
            });
        }
        $$('[data-open]').forEach(function (btn) {
            btn.addEventListener('click', function () { open(+btn.getAttribute('data-open'), btn); });
        });
        $('[data-lb-close]', dialog).addEventListener('click', close);
        $('[data-lb-prev]', dialog).addEventListener('click', function () { step(-1); });
        $('[data-lb-next]', dialog).addEventListener('click', function () { step(1); });
        dialog.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
        dialog.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') step(1);
            if (e.key === 'ArrowLeft') step(-1);
        });

        // Deep link: collection.html#piece opens that piece
        var hash = location.hash.replace('#', '');
        var deep = data.findIndex(function (d) { return d.id === hash; });
        if (deep > -1) {
            var target = document.getElementById(hash);
            setTimeout(function () {
                scrollToTarget(target, barOffset());
                setTimeout(function () { open(deep, $('[data-open]', target)); }, 700);
            }, 300);
        }
    }

    /* ---------------------------------------------------------------- Contact form */
    function initContact() {
        var form = $('[data-contact-form]');
        if (!form) return;
        var success = $('[data-form-success]');
        var setErr = function (field, msg) {
            var wrap = field.closest('.field');
            wrap.classList.toggle('is-invalid', !!msg);
            var e = $('.field__error', wrap);
            if (e) e.textContent = msg || '';
            field.setAttribute('aria-invalid', msg ? 'true' : 'false');
        };
        var validate = function (field) {
            var v = field.value.trim();
            if (field.required && !v) { setErr(field, 'This field is required.'); return false; }
            if (field.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setErr(field, 'Please enter a valid email address.'); return false; }
            setErr(field, '');
            return true;
        };
        $$('input, textarea, select', form).forEach(function (f) {
            f.addEventListener('blur', function () { if (f.value) validate(f); });
            f.addEventListener('input', function () { if (f.closest('.field').classList.contains('is-invalid')) validate(f); });
        });
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var fields = $$('input, textarea, select', form);
            var ok = fields.map(validate).every(Boolean);
            if (!ok) { var first = $('.is-invalid input, .is-invalid textarea', form); if (first) first.focus(); return; }
            var d = {};
            fields.forEach(function (f) { d[f.name] = f.value.trim(); });
            var body = d.message + '\n\n— ' + d.name + '\n' + d.email + (d.phone ? '\n' + d.phone : '');
            window.location.href = 'mailto:Hariikestyles@gmail.com?subject=' + encodeURIComponent(d.subject + ' — ' + d.name) + '&body=' + encodeURIComponent(body);
            form.style.display = 'none';
            success.classList.add('is-visible');
            success.focus();
            if (motion) gsap.fromTo(success, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 });
        });
    }

    /* ---------------------------------------------------------------- Legal TOC */
    function initToc() {
        var toc = $('[data-toc]');
        if (!toc) return;
        var links = $$('a', toc);
        links.forEach(function (a) {
            a.addEventListener('click', function (e) {
                var el = document.getElementById(a.getAttribute('href').slice(1));
                if (!el) return;
                e.preventDefault();
                scrollToTarget(el, headerOffset() - 16);
            });
        });
        if (!hasGsap) return;
        var activate = function (a) { links.forEach(function (l) { l.classList.toggle('is-active', l === a); }); };
        activate(links[0]);
        links.forEach(function (a, i) {
            var el = document.getElementById(a.getAttribute('href').slice(1));
            if (!el) return;
            ScrollTrigger.create({
                trigger: el, start: 'top 40%',
                onEnter: function () { activate(a); },
                onLeaveBack: function () { activate(links[Math.max(0, i - 1)]); }
            });
        });
    }

    /* ---------------------------------------------------------------- Back to top */
    $$('[data-to-top]').forEach(function (a) {
        a.addEventListener('click', function (e) { e.preventDefault(); scrollToTarget(0); });
    });

    /* ---------------------------------------------------------------- Boot */
    var heroIntro = initHero();
    initMarquee();
    initFollower();
    initShowcase();
    initQuotes();
    initStack();
    initContact();
    initToc();

    Promise.all([runPreloader(), revealPage()]).then(function () {
        initReveals();
        heroIntro();
        initCollection();
        if (hasGsap) ScrollTrigger.refresh();
    });

    if (hasGsap) {
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
        window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    }
})();
