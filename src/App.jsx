import React, { useEffect, useState, useRef } from 'react';
import {
  FEATURED_PROJECTS,
  OTHER_PROJECTS,
  STACK,
  EXPERIENCE,
  MARQUEE_ITEMS,
} from './data';

export default function App() {
  const [progress, setProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollBarRef = useRef(null);
  const archImgRef = useRef(null);
  const aboutTextRef = useRef(null);
  const canvasRef = useRef(null);
  const terminalPreRef = useRef(null);
  const terminalMountedRef = useRef(false);

  // Preloader progress animation
  useEffect(() => {
    const t0 = performance.now();
    let frameId;
    const animatePreloader = (t) => {
      const p = Math.min((t - t0) / 1300, 1);
      setProgress(Math.round(100 * p));
      if (p < 1) {
        frameId = requestAnimationFrame(animatePreloader);
      } else {
        setTimeout(() => {
          document.body.classList.add('ld');
        }, 250);
      }
    };
    frameId = requestAnimationFrame(animatePreloader);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Intersection observer for reveals (.rv)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll('.rv');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Counter animations for stats ([data-n])
  useEffect(() => {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const targetVal = Number(el.getAttribute('data-n'));
            const start = performance.now();
            const step = (t) => {
              const p = Math.min((t - start) / 1500, 1);
              el.textContent = Math.round(targetVal * (1 - Math.pow(1 - p, 4)));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.6 }
    );

    const counters = document.querySelectorAll('[data-n]');
    counters.forEach((el) => counterObserver.observe(el));

    return () => counterObserver.disconnect();
  }, []);

  // Custom cursor & magnetic buttons & bento spotlight effect
  useEffect(() => {
    const dot = document.getElementById('dot');
    const ring = document.getElementById('ring');
    if (!dot || !ring) return;

    let rx = 0,
      ry = 0,
      mx = 0,
      my = 0;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    };

    let animId;
    const renderRing = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      animId = requestAnimationFrame(renderRing);
    };

    const onMouseOver = (e) => {
      const isHoverable = e.target.closest('[data-h], .bn, a, button');
      ring.classList.toggle('h', !!isHoverable);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    animId = requestAnimationFrame(renderRing);

    // Magnetic buttons (.mag)
    const magButtons = document.querySelectorAll('.mag');
    const cleanups = [];
    magButtons.forEach((btn) => {
      const handleMove = (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
      };
      const handleLeave = () => {
        btn.style.transform = '';
      };
      btn.addEventListener('mousemove', handleMove);
      btn.addEventListener('mouseleave', handleLeave);
      cleanups.push(() => {
        btn.removeEventListener('mousemove', handleMove);
        btn.removeEventListener('mouseleave', handleLeave);
      });
    });

    // Bento spotlight effect (.bn)
    const bentoItems = document.querySelectorAll('.bn');
    bentoItems.forEach((c) => {
      const handleBento = (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', `${e.clientX - r.left}px`);
        c.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      c.addEventListener('mousemove', handleBento);
      cleanups.push(() => c.removeEventListener('mousemove', handleBento));
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animId);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  // Interactive Particle Canvas in Hero (#cv)
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    const mp = { x: -999, y: -999 };
    let W, H;
    let pts = [];
    let fr = 0;
    let cc = '#c6ff3d';
    let reqId;

    const rs = () => {
      if (!cv) return;
      W = cv.width = cv.offsetWidth;
      H = cv.height = cv.offsetHeight;
      pts = Array.from({ length: Math.min(70, (W / 16) | 0) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
    };
    rs();
    window.addEventListener('resize', rs);

    const heroEl = document.getElementById('hero');
    const onHeroMove = (e) => {
      const r = cv.getBoundingClientRect();
      mp.x = e.clientX - r.left;
      mp.y = e.clientY - r.top;
    };
    if (heroEl) {
      heroEl.addEventListener('mousemove', onHeroMove);
    }

    const drawParticles = () => {
      if (fr++ % 90 === 0) {
        cc = getComputedStyle(document.documentElement).getPropertyValue('--ac').trim() || '#c6ff3d';
      }
      cx.clearRect(0, 0, W, H);
      cx.fillStyle = cx.strokeStyle = cc;

      pts.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        cx.globalAlpha = 0.7;
        cx.beginPath();
        cx.arc(p.x, p.y, 1.6, 0, 7);
        cx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dd = dx * dx + dy * dy;
          if (dd < 12000) {
            cx.globalAlpha = (1 - dd / 12000) * 0.3;
            cx.beginPath();
            cx.moveTo(p.x, p.y);
            cx.lineTo(q.x, q.y);
            cx.stroke();
          }
        }

        const mx = p.x - mp.x;
        const my = p.y - mp.y;
        const md = mx * mx + my * my;
        if (md < 24000) {
          cx.globalAlpha = (1 - md / 24000) * 0.7;
          cx.beginPath();
          cx.moveTo(p.x, p.y);
          cx.lineTo(mp.x, mp.y);
          cx.stroke();
        }
      });
      reqId = requestAnimationFrame(drawParticles);
    };
    reqId = requestAnimationFrame(drawParticles);

    return () => {
      window.removeEventListener('resize', rs);
      if (heroEl) heroEl.removeEventListener('mousemove', onHeroMove);
      cancelAnimationFrame(reqId);
    };
  }, []);

  // Scramble cipher effect on section labels (.lab)
  useEffect(() => {
    const cs = "01<>/{}[]#$";
    const labels = document.querySelectorAll('.lab');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const originalText = el.textContent;
          let n = 0;
          const iv = setInterval(() => {
            el.textContent = originalText
              .split('')
              .map((ch, i) => (i < n || ch === ' ' ? ch : cs[(Math.random() * cs.length) | 0]))
              .join('');
            if (++n > originalText.length) {
              el.textContent = originalText;
              clearInterval(iv);
            }
          }, 30);
          obs.unobserve(el);
        }
      });
    }, { threshold: 1 });

    labels.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Interactive Terminal typing effect (.tm)
  useEffect(() => {
    const terminalEl = document.querySelector('.tm');
    const tp = terminalPreRef.current;
    if (!terminalEl || !tp) return;

    const tl = [
      ["$ whoami", "g"],
      ["pranav_mani · full-stack developer", ""],
      ["$ cat stack.json", "g"],
      ['{ "frontend": ["Next.js","Vue"], "backend": ["FastAPI","Flask"], "db": ["PostgreSQL","MongoDB"] }', "b"],
      ["$ git log --oneline -1", "g"],
      ["a1f93c2 ship: deknek-hub → production ✓", ""],
      ["$ status", "g"],
      ["open_to: full-stack internships", "b"]
    ];

    const es = (s) => s.replace(/</g, "&lt;");
    let dn = "";
    let li = 0;
    let ci = 0;
    let timeoutId;

    const ty = () => {
      if (li >= tl.length) {
        tp.innerHTML = dn + '<span class="cr"></span>';
        return;
      }
      const [l, k] = tl[li];
      ci++;
      tp.innerHTML = dn + `<span class="${k}">${es(l.slice(0, ci))}</span><span class="cr"></span>`;
      if (ci >= l.length) {
        dn += `<span class="${k}">${es(l)}</span>\n`;
        li++;
        ci = 0;
        timeoutId = setTimeout(ty, l[0] === "$" ? 350 : 600);
        return;
      }
      timeoutId = setTimeout(ty, l[0] === "$" ? 55 : 14);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting && !terminalMountedRef.current) {
        terminalMountedRef.current = true;
        ty();
        obs.disconnect();
      }
    }, { threshold: 0.5 });

    observer.observe(terminalEl);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  // Scroll tracking (Progress bar, Parallax image, Reading highlight in About)
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollBarRef.current && totalScroll > 0) {
        scrollBarRef.current.style.width = `${(window.scrollY / totalScroll) * 100}%`;
      }
      if (archImgRef.current) {
        archImgRef.current.style.transform = `translateY(${-Math.min(window.scrollY * 0.06, 40)}px)`;
      }

      if (aboutTextRef.current) {
        const r = aboutTextRef.current.getBoundingClientRect();
        const p = Math.min(
          Math.max((window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.35), 0),
          1
        );
        const spans = aboutTextRef.current.querySelectorAll('span');
        spans.forEach((w, i) => {
          w.style.opacity = i / spans.length < p ? '1' : '0.18';
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const aboutWords = "I design databases, ship APIs and craft interfaces. Third-year CSE at KMCE, Hyderabad. I like owning a feature end to end, from schema to deploy, and making it feel effortless.".split(' ');

  return (
    <>
      {/* Background Matrix Grid */}
      <div className="gr"></div>

      {/* Preloader */}
      <div id="pre">
        <span className="m">loading portfolio…</span>
        <b id="pn">{progress}</b>
      </div>

      {/* Top Scroll Progress Bar */}
      <div id="bar" ref={scrollBarRef}></div>

      {/* Custom Cursor */}
      <div id="dot"></div>
      <div id="ring"></div>

      {/* Navigation */}
      <nav className="m">
        <b>PM©26</b>
        <span>
          <a href="#ab" data-h>about</a>
          <a href="#work" data-h>work</a>
          <a href="#stack" data-h>stack</a>
          <a href="#ct" data-h>contact</a>
        </span>
        <button
          className="nav-toggle m"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? 'close' : 'menu'}
        </button>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-menu m ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#ab" onClick={() => setMobileMenuOpen(false)}>about</a>
        <a href="#work" onClick={() => setMobileMenuOpen(false)}>work</a>
        <a href="#stack" onClick={() => setMobileMenuOpen(false)}>stack</a>
        <a href="#ct" onClick={() => setMobileMenuOpen(false)}>contact</a>
      </div>

      {/* Hero Section */}
      <div className="w">
        <section id="hero">
          <div className="glow"></div>
          <canvas id="cv" ref={canvasRef}></canvas>
          <div>
            <span className="pill m">
              <i></i>Open to full-stack internships
            </span>
            <h1>
              <span className="ln">
                <span>Pranav</span>
              </span>
              <span className="ln">
                <span><em>Mani.</em></span>
              </span>
            </h1>
            <p className="lead">
              Full-stack developer crafting fast, reliable products, from the database to the last pixel.
            </p>
            <div className="cta">
              <a className="btn p mag" data-h href="#work">
                View my work
              </a>
              <a className="btn mag" data-h href="#ct">
                Get in touch
              </a>
            </div>
          </div>

          <div className="hw">
            {/* Floating Code Badges */}
            <span className="fl m" style={{ top: '8%', left: '-26px' }}>
              &lt;/&gt;
            </span>
            <span className="fl m" style={{ top: '42%', right: '-30px', animationDelay: '-2s' }}>
              SQL
            </span>
            <span className="fl m" style={{ bottom: '6%', left: '-10px', animationDelay: '-4s' }}>
              &#123; api &#125;
            </span>

            <div className="arch" id="arch">
              <img
                ref={archImgRef}
                alt="Pranav Mani"
                src="/pranav.jpg"
              />
            </div>
            <svg className="badge" viewBox="0 0 120 120">
              <defs>
                <path
                  id="c"
                  d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"
                />
              </defs>
              <text>
                <textPath href="#c">
                  FULL-STACK • HYDERABAD • CLASS OF 2028 •
                </textPath>
              </text>
              <circle cx="60" cy="60" r="5" fill="var(--ac)" />
            </svg>
          </div>
        </section>
      </div>

      {/* Continuous Marquee Ribbon */}
      <div className="mq">
        <div>
          {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, idx) => (
            <span key={idx}>{item}</span>
          ))}
        </div>
      </div>

      <div className="w">
        {/* About Section */}
        <section id="ab">
          <span className="lab m">( 01 ) ABOUT</span>
          <p id="ap" ref={aboutTextRef}>
            {aboutWords.map((word, idx) => (
              <span key={idx}>{word} </span>
            ))}
          </p>

          {/* Interactive Terminal Window */}
          <div className="tm rv">
            <h5>
              <i></i><i></i><i></i>pranav@dev: ~
            </h5>
            <pre id="tp" ref={terminalPreRef}></pre>
          </div>

          {/* Metrics / Numbers */}
          <div className="st rv">
            <div>
              <b data-n="6">0</b>
              <small className="m">PROJECTS SHIPPED</small>
            </div>
            <div>
              <b data-n="4">0</b>
              <small className="m">INDUSTRY SIMULATIONS</small>
            </div>
            <div>
              <b data-n="2028">0</b>
              <small className="m">GRADUATING</small>
            </div>
          </div>
        </section>

        {/* Selected Work Section */}
        <section id="work">
          <span className="lab m">( 02 ) SELECTED WORK</span>
          <h2 className="rv">
            Things I’ve<br />built.
          </h2>

          <div id="ps">
            {FEATURED_PROJECTS.map((p, i) => (
              <article
                key={p.title}
                className="pc rv"
                style={{ top: `${90 + i * 22}px` }}
              >
                <div>
                  <span className="n m">
                    0{i + 1} / 0{FEATURED_PROJECTS.length}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="ch m">
                    {p.chips.map((chip) => (
                      <span key={chip}>{chip}</span>
                    ))}
                  </div>
                  {p.url && (
                    <a
                      className="lk m"
                      data-h
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live site ↗
                    </a>
                  )}
                </div>
                <div className="vz" style={{ '--h': p.hue }}>
                  <div className="win">
                    <i></i><i></i><i></i>
                    <div className="a"></div>
                    <div style={{ width: '90%' }}></div>
                    <div style={{ width: '70%' }}></div>
                    <div style={{ width: '82%' }}></div>
                    <div style={{ width: '50%' }}></div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="oth">
            {OTHER_PROJECTS.map((item) => (
              <div
                key={item.title}
                className="bn rv"
                style={{ gridColumn: 'auto' }}
              >
                <h4>{item.title}</h4>
                <div className="ch">
                  {item.chips.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stack Section */}
        <section id="stack">
          <span className="lab m">( 03 ) STACK</span>
          <h2 className="rv">
            Tools of<br />the trade.
          </h2>

          {/* Interactive Architecture Wireup SVG Diagram */}
          <div className="ar rv">
            <span className="lab m" style={{ marginBottom: '14px' }}>
              // how I usually wire things up
            </span>
            <svg viewBox="0 0 900 230">
              <path d="M200 70H330" />
              <path d="M510 70H640" />
              <path d="M420 110V150" />
              <rect className="nd" x="20" y="30" width="180" height="80" rx="16" />
              <text className="t" x="40" y="66">Client</text>
              <text className="s" x="40" y="88">Next.js · Vue · TS</text>
              <rect className="nd" x="330" y="30" width="180" height="80" rx="16" style={{ animationDelay: '-1s' }} />
              <text className="t" x="350" y="66">API</text>
              <text className="s" x="350" y="88">FastAPI · Flask · Node</text>
              <rect className="nd" x="640" y="30" width="220" height="80" rx="16" style={{ animationDelay: '-2s' }} />
              <text className="t" x="660" y="66">Database</text>
              <text className="s" x="660" y="88">PostgreSQL · MySQL · MongoDB</text>
              <rect className="nd" x="330" y="150" width="180" height="60" rx="16" style={{ animationDelay: '-1.5s' }} />
              <text className="t" x="350" y="177">AI</text>
              <text className="s" x="350" y="196">YOLO · GenAI</text>
              <circle r="4">
                <animateMotion dur="1.8s" repeatCount="indefinite" path="M200 70H330" />
              </circle>
              <circle r="4">
                <animateMotion dur="1.8s" begin=".6s" repeatCount="indefinite" path="M510 70H640" />
              </circle>
              <circle r="4">
                <animateMotion dur="1.4s" begin=".3s" repeatCount="indefinite" path="M420 110V150" />
              </circle>
            </svg>
          </div>

          <div className="bg">
            {STACK.map((group) => (
              <div
                key={group.title}
                className={`bn rv ${group.wide ? 'x' : ''}`}
              >
                <h4>{group.title}</h4>
                <div className="ch">
                  {group.chips.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section id="exp">
          <span className="lab m">( 04 ) EXPERIENCE</span>
          <h2 className="rv">
            Industry<br />simulations.
          </h2>
          <div className="ex rv">
            {EXPERIENCE.map((exp, idx) => (
              <div key={idx}>
                <small className="m">{exp.date}</small>
                <b>{exp.company}</b>
                <small>{exp.role}</small>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="ct">
          <span className="lab m">( 05 ) CONTACT</span>
          <h2 className="rv">
            Let’s build<br />something.
          </h2>
          <div className="cta rv" style={{ justifyContent: 'center' }}>
            <a className="btn p mag" data-h href="mailto:your@email.com">
              Say hello
            </a>
            <a
              className="btn mag"
              data-h
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="btn mag"
              data-h
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="m">
        <span>© 2026 Pranav Mani</span>
        <span>Hyderabad, India</span>
      </footer>
    </>
  );
}
