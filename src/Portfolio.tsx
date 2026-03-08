import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  id: number;
  period: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  image?: string;
  featured?: boolean;
}

interface Tool {
  name: string;
  category: "language" | "web" | "program";
  level: number;
}

interface Career {
  period: string;
  title: string;
  description?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const LAST_UPDATED = "2026.03.08";

const careers: Career[] = [
  {
    period: "2011.03 - 2017.02",
    title: "궁내초등학교 재학",
    description: "",
  },
  {
    period: "2017.03 — 2020.02",
    title: "궁내중학교 재학",
    description: "수학올림피아드 금상(2019)\n정보올림피아드 은상(2019)\n물리올림피아드 동상(2019)",
  },
  {
    period: "2020.03 - 2023.02",
    title: "경기과학고등학교 재학",
    description: "수학올림피아드 장려상(2022)\n국제수학적모델링대회 수상(2022)\n정보올림피아드 은상(2023)",
  },
  {
    period: "2023.03 — 현재",
    title: "KAIST 전산학부 재학 (2025.01월 부로 군휴학 중)",
    description: "한국과학기술원 전산학부 학사 과정\n한국과학기술원 전기및전자공학부 복수전공\nPLRG 개별연구(2024.06 - 2024.12)\nDean's List(2023 Spring, 2023 Fall, 2024 Spring, 2024 Fall)",
  },
  {
    period: "2025.01 — 2026.07",
    title: "육군 정보보호병",
    description: "육군사관학교 근무지원단 소속\n육군창업경진대회, 육군데이터사이언스대회, 한국형 혁신 랩 대회 등 참여",
  },
];

const projects: Project[] = [
  {
    id: 1,
    period: "2026.04",
    title: "개인 TodoList 웹 (예정)",
    description: "매일 할 일의 성취도를 보여주는 웹 개발",
    tags: ["React", "MongoDB"],
  },
  {
    id: 2,
    period: "2026.03",
    title: "개인 포트폴리오 웹",
    description: "지금 이 페이지",
    tags: ["React", "TypeScript"],
  },
  {
    id: 3,
    period: "2026.02",
    title: "Unknown 게임 웹 개발",
    description: "여러 클라이언트가 동시에 화면을 볼 수 있도록 하는 웹 게임 제작",
    tags: ["React", "Express.js", "Node.js"],
  },
  {
    id: 4,
    period: "2025.10",
    title: "일본어 단어공부 웹사이트",
    description: "정답/오답 횟수 기반 단어 추천을 통한 효율적 일본어 단어학습 웹사이트",
    tags: ["React", "Express.js", "MongoDB"],
  },
  {
    id: 5,
    period: "2025.05",
    title: "최적 무기배치 프로그램",
    description: "다양한 무기 사용에 따른 최적의 무기배치 프로그램 제작 (육군데이터사이언스대회)",
    tags: ["Python-Tkinter", "Mathematical Modeling", "Genetic Algorithm"],
  },
  {
    id: 6,
    period: "2024.03",
    title: "KAIST PUPLE 사이트 관리",
    description: "KAIST PUPLE 홈페이지, 미궁 사이트를 관리하였습니다.",
    tags: ["HTML", "PHP", "Javascript"],
    link: "https://kaistpuple.com/main/",
  },
  {
    id: 7,
    period: "2022.11",
    title: "블루투스 컨트롤러",
    description: "블루투스 컨트롤러의 버튼을 사용자 마음대로 설정할 수 있게 한 안드로이드 앱",
    tags: ["Android", "Android Studio", "Java", "Bluetooth"],
  },
  {
    id: 8,
    period: "2022.11",
    title: "한붓그리기",
    description: "한붓그리기 게임을 제작하고 플레이할 수 있도록 만든 프로그램",
    tags: ["Python", "Pygame"],
  },
  {
    id: 9,
    period: "2022.06",
    title: "지하철 노선도 편집 프로그램",
    description: "Processing으로 제작한 지하철 노선도 편집 및 경로 탐색 프로그램",
    tags: ["Java", "Processing"],
  },
  {
    id: 10,
    period: "2021.06",
    title: "장기, 체스",
    description: "첫 개발 프로젝트입니다",
    tags: ["Java", "Eclipse"],
  },
];

const tools: Tool[] = [
  { name: "C / C++", category: "language", level: 5 },
  { name: "Java", category: "language", level: 4 },
  { name: "Python", category: "language", level: 4 },
  { name: "JavaScript", category: "language", level: 4 },
  { name: "Scala", category: "language", level: 3 },
  { name: "OCaml", category: "language", level: 3 },
  { name: "TypeScript", category: "language", level: 3 },
  { name: "React", category: "web", level: 4 },
  { name: "Express", category: "web", level: 3 },
  { name: "Node.js", category: "web", level: 4 },
  { name: "Vanilla HTML", category: "web", level: 5 },
  { name: "MongoDB", category: "web", level: 3 },
  { name: "MySQL", category: "web", level: 2 },
  { name: "PHP", category: "web", level: 3 },
  { name: "Android Studio", category: "program", level: 4 },
  { name: "VSCode", category: "program", level: 5 },
  { name: "Blender", category: "program", level: 2 },
  { name: "Eclipse", category: "program", level: 3 },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Cursor ───────────────────────────────────────────────────────────────────
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let rx = 0, ry = 0, mx = 0, my = 0;
    const move = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", move);
    let id: number;
    const loop = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      if (dot.current) dot.current.style.transform = `translate(${mx - 4}px,${my - 4}px)`;
      if (ring.current) ring.current.style.transform = `translate(${rx - 20}px,${ry - 20}px)`;
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(id); };
  }, []);
  return (
    <>
      <div ref={dot} style={{ position: "fixed", top: 0, left: 0, width: 8, height: 8, background: "#e8ff47", borderRadius: "50%", pointerEvents: "none", zIndex: 9999 }} />
      <div ref={ring} style={{ position: "fixed", top: 0, left: 0, width: 40, height: 40, border: "1px solid rgba(232,255,71,0.5)", borderRadius: "50%", pointerEvents: "none", zIndex: 9998 }} />
    </>
  );
}

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar({ active }: { active: string }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 48px", height: 64,
      background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "all .4s cubic-bezier(.4,0,.2,1)",
    }}>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 4, color: "#e8ff47" }}>DEV·FOLIO</span>
      <div style={{ display: "flex", gap: 32 }}>
        {[["career", "경력"], ["projects", "프로젝트"], ["skills", "기술 스택"], ["contact", "연락처"]].map(([id, label]) => (
          <button key={id} onClick={() => scrollTo(id)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Noto Sans KR', sans-serif", fontSize: 13, letterSpacing: 1,
            color: active === id ? "#e8ff47" : "rgba(255,255,255,0.5)",
            transition: "color .2s", padding: 0,
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = active === id ? "#e8ff47" : "rgba(255,255,255,0.5)")}
          >{label}</button>
        ))}
        <button key="saving" onClick={() => navigate("/saving")} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Noto Sans KR', sans-serif", fontSize: 13, letterSpacing: 1,
            color: active === "saving" ? "#e8ff47" : "rgba(255,255,255,0.5)",
            transition: "color .2s", padding: 0,
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = active === "saving" ? "#e8ff47" : "rgba(255,255,255,0.5)")}
          >자료</button>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 600);
    return () => clearInterval(id);
  }, []);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", padding: "0 48px" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize: "72px 72px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "15%", right: "8%", width: 420, height: 420, background: "radial-gradient(circle,rgba(232,255,71,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", maxWidth: 900, paddingTop: 80 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 13, color: "#e8ff47", letterSpacing: 3, marginBottom: 28, opacity: .8 }}>
          &gt; PORTFOLIO_2026.init(){tick % 2 === 0 ? "█" : "\u00a0"}
        </div>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(72px, 12vw, 140px)", lineHeight: .92, color: "#fff", margin: 0, letterSpacing: 2 }}>
          <span style={{ display: "block" }}>HELLO,</span>
          <span style={{ display: "block", color: "#e8ff47", position: "relative" }}>
            REDUCTION-CHOI
          </span>
          <span style={{ display: "block", WebkitTextStroke: "2px rgba(255,255,255,0.2)", color: "transparent" }}>WEBPAGE</span>
        </h1>

        {/* Last updated badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 44, padding: "7px 16px", border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.02)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8ff47", display: "inline-block", boxShadow: "0 0 8px rgba(232,255,71,0.8), 0 0 2px #e8ff47" }} />
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 2 }}>
            최종 수정일: {LAST_UPDATED}
          </span>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={() => scrollTo("projects")} style={{
            background: "#e8ff47", color: "#0a0a0a", border: "none", cursor: "pointer",
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3,
            padding: "14px 36px", transition: "transform .15s, box-shadow .15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translate(-3px,-3px)"; e.currentTarget.style.boxShadow = "6px 6px 0 rgba(232,255,71,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >프로젝트 보기</button>
          <button onClick={() => scrollTo("skills")} style={{
            background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer",
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3,
            padding: "14px 36px", transition: "border-color .2s, color .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#e8ff47"; e.currentTarget.style.color = "#e8ff47"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
          >기술 스택</button>
        </div>

        <div style={{ position: "absolute", bottom: -120, left: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: .4 }}>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, letterSpacing: 3, color: "#fff", writingMode: "vertical-rl" }}>SCROLL</span>
          <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom, #fff, transparent)" }} />
        </div>
      </div>
    </section>
  );
}

// ─── Career Section ───────────────────────────────────────────────────────────
function CareerItem({ career, index, inView }: { career: Career; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const delay = index * 0.18;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateX(-28px)",
        transition: `opacity .65s ease ${delay}s, transform .65s ease ${delay}s`,
        paddingBottom: index < careers.length - 1 ? 44 : 0,
      }}
    >
      {/* Timeline dot */}
      <div style={{
        position: "absolute", left: -47, top: 7,
        width: 14, height: 14, borderRadius: "50%",
        background: hovered ? "#e8ff47" : "#0a0a0a",
        border: `2px solid ${hovered ? "#e8ff47" : "rgba(232,255,71,0.45)"}`,
        transition: "all .25s",
        boxShadow: hovered ? "0 0 14px rgba(232,255,71,0.65)" : "none",
        zIndex: 2,
      }} />

      <div style={{
        padding: "22px 28px",
        border: `1px solid ${hovered ? "rgba(232,255,71,0.35)" : "rgba(255,255,255,0.07)"}`,
        background: hovered ? "rgba(232,255,71,0.04)" : "rgba(255,255,255,0.015)",
        transition: "all .3s cubic-bezier(.4,0,.2,1)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Left accent bar */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 2,
          background: "#e8ff47",
          transform: hovered ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "top",
          transition: "transform .35s cubic-bezier(.4,0,.2,1)",
        }} />
        <div style={{ fontFamily: "'Courier New',monospace", fontSize: 12, color: "#e8ff47", letterSpacing: 2, marginBottom: 8 }}>
          {career.period}
        </div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: "#fff", letterSpacing: 1, lineHeight: 1, marginBottom: career.description ? 8 : 0 }}>
          {career.title}
        </div>
        {career.description && (
          <div style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, whiteSpace: "pre-line" }}>
            {career.description}
          </div>
        )}
      </div>
    </div>
  );
}

function CareerSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section id="career" style={{ padding: "120px 48px", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "50%", background: "radial-gradient(ellipse at left center, rgba(232,255,71,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 72 }}>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 12, color: "#e8ff47", letterSpacing: 3 }}>00</span>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(48px,7vw,80px)", color: "#fff", margin: 0, letterSpacing: 3 }}>CAREER</h2>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(255,255,255,0.15), transparent)", marginLeft: 16 }} />
        </div>

        <div style={{ position: "relative", paddingLeft: 48 }}>
          {/* Vertical timeline line */}
          <div style={{
            position: "absolute", left: 6, top: 7, bottom: 0,
            width: 1,
            background: inView
              ? "linear-gradient(to bottom, rgba(232,255,71,0.6), rgba(232,255,71,0.05) 80%, transparent)"
              : "transparent",
            transition: "background 1s ease 0.2s",
          }} />
          {careers.map((c, i) => (
            <CareerItem key={i} career={c} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { ref, inView } = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : "translateY(40px)",
      transition: `opacity .6s ease ${index * 0.07}s, transform .6s ease ${index * 0.07}s`,
    }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative", overflow: "hidden", height: "100%",
          border: `1px solid ${hovered ? "rgba(232,255,71,0.4)" : "rgba(255,255,255,0.07)"}`,
          background: hovered ? "rgba(232,255,71,0.04)" : "rgba(255,255,255,0.02)",
          transition: "all .3s cubic-bezier(.4,0,.2,1)",
          cursor: "default",
        }}
      >
        {project.featured && (
          <div style={{ position: "absolute", top: 0, right: 0, background: "#e8ff47", color: "#0a0a0a", fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 2, padding: "3px 12px", zIndex: 1 }}>FEATURED</div>
        )}
        {project.image ? (
          <img src={project.image} alt={project.title} style={{ width: "100%", height: 180, objectFit: "cover", display: "block", filter: "grayscale(30%)" }} />
        ) : (
          <div style={{ height: 120, background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(232,255,71,0.06) 100%)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, color: "rgba(255,255,255,0.05)", letterSpacing: 4 }}>
              {String(project.id).padStart(2, "0")}
            </span>
          </div>
        )}
        <div style={{ padding: "20px 22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "#e8ff47", letterSpacing: 2 }}>{project.period}</span>
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer"
                style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.4)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)", padding: "2px 9px", transition: "all .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#e8ff47"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e8ff47"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
              >LINK ↗</a>
            )}
          </div>
          <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 21, color: "#fff", margin: "0 0 8px", letterSpacing: 1, lineHeight: 1.1 }}>{project.title}</h3>
          <p style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: 12, lineHeight: 1.7, color: "rgba(255,255,255,0.5)", margin: "0 0 14px" }}>{project.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {project.tags.map(tag => (
              <span key={tag} style={{ fontFamily: "'Courier New',monospace", fontSize: 10, letterSpacing: 1, color: "rgba(232,255,71,0.7)", border: "1px solid rgba(232,255,71,0.2)", padding: "2px 7px" }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, background: "#e8ff47", width: hovered ? "100%" : "0%", transition: "width .4s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function SkillsSection() {
  const { ref, inView } = useInView(0.1);
  const categories: { key: Tool["category"]; label: string }[] = [
    { key: "language", label: "LANGUAGES" },
    { key: "web", label: "WEB RELATED" },
    { key: "program", label: "PROGRAMS" },
  ];
  return (
    <section id="skills" style={{ padding: "120px 48px", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 72 }}>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 12, color: "#e8ff47", letterSpacing: 3 }}>02</span>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(48px,7vw,80px)", color: "#fff", margin: 0, letterSpacing: 3 }}>TECH STACK</h2>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(255,255,255,0.15), transparent)", marginLeft: 16 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
          {categories.map(({ key, label }, ci) => (
            <div key={key} style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(32px)", transition: `opacity .6s ease ${ci * 0.15}s, transform .6s ease ${ci * 0.15}s` }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 4, color: "rgba(255,255,255,0.3)", marginBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 12 }}>{label}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {tools.filter(t => t.category === key).map((tool, ti) => (
                  <div key={tool.name} style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(-16px)", transition: `opacity .5s ease ${ci * 0.15 + ti * 0.07}s, transform .5s ease ${ci * 0.15 + ti * 0.07}s` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontFamily: "'Noto Sans KR',sans-serif", fontSize: 14, color: "#fff", letterSpacing: 1 }}>{tool.name}</span>
                      <span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "rgba(232,255,71,0.6)" }}>{"●".repeat(tool.level)}{"○".repeat(5 - tool.level)}</span>
                    </div>
                    <div style={{ height: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: inView ? `${tool.level * 20}%` : "0%", background: "linear-gradient(to right, #e8ff47, rgba(232,255,71,0.4))", transition: `width .8s cubic-bezier(.4,0,.2,1) ${ci * 0.15 + ti * 0.07 + 0.2}s` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <section id="contact" style={{ padding: "120px 48px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 40 }}>
        <div>
          <div style={{ fontFamily: "'Courier New',monospace", fontSize: 12, color: "#e8ff47", letterSpacing: 3, marginBottom: 16 }}>03 / CONTACT</div>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(42px,6vw,72px)", color: "#fff", margin: "0 0 16px", lineHeight: .95, letterSpacing: 2 }}>
            LET'S BUILD<br /><span style={{ WebkitTextStroke: "2px rgba(255,255,255,0.3)", color: "transparent" }}>SOMETHING</span>
          </h2>
          <p style={{ fontFamily: "'Noto Sans KR',sans-serif", color: "rgba(255,255,255,0.45)", fontSize: 15, maxWidth: 400, lineHeight: 1.7 }}>
            새로운 프로젝트, 협업, 또는 그냥 이야기 나누고 싶다면 언제든 연락주세요.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[["GitHub", "github.com/reduction-choi", "https://github.com/reduction-choi"], ["Email", "hanwon0713@naver.com", "mailto:hanwon0713@naver.com"], ["Email", "hanwon0713@kaist.ac.kr", "mailto:hanwon0713@kaist.ac.kr"], ["Phone", "(+82)10-6631-7686", "tel:(+82)10-6631-7686"]].map(([platform, handle, href]) => (
            <a key={platform} href={href} target="_blank" rel="noreferrer" style={{
              display: "flex", alignItems: "center", gap: 20, padding: "20px 28px",
              border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none", transition: "all .25s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,255,71,0.4)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(232,255,71,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
            >
              <div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 3, color: "#fff" }}>{platform}</div>
                <div style={{ fontFamily: "'Courier New',monospace", fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{handle}</div>
              </div>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: "#e8ff47", marginLeft: "auto" }}>↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const ids = ["hero", "career", "projects", "skills", "contact"];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id || "hero"); });
    }, { threshold: 0.4 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+KR:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", cursor: "none" }}>
      <Cursor />
      <NavBar active={activeSection} />

      <div id="hero"><HeroSection /></div>
      <CareerSection />

      {/* Projects */}
      <section id="projects" style={{ padding: "120px 48px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 72 }}>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 12, color: "#e8ff47", letterSpacing: 3 }}>01</span>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(48px,7vw,80px)", color: "#fff", margin: 0, letterSpacing: 3 }}>PROJECTS</h2>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(255,255,255,0.15), transparent)", marginLeft: 16 }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {projects.map((p, i) => <ProjectCard key={`${p.id}-${i}`} project={p} index={i} />)}
          </div>
        </div>
      </section>

      <SkillsSection />
      <ContactSection />

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 4, color: "#e8ff47" }}>DEV·FOLIO</span>
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: 2 }}>
          최종 수정일: {LAST_UPDATED} · BUILT WITH REACT + TYPESCRIPT
        </span>
      </footer>
    </div>
  );
}