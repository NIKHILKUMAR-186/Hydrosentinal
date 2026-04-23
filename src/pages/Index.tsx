import { useCallback, useEffect, useRef, useState } from "react";
import { Droplets } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SensorCard } from "@/components/SensorCard";
import { StatusBanner } from "@/components/StatusBanner";
import { ChatPanel } from "@/components/ChatPanel";
import { Simulator } from "@/components/Simulator";
import { WaterGraph } from "@/components/WaterGraph";

// type History = Reading[];


const FEATURES = [
  {
    title: "Real-time Monitoring",
    desc: "Continuously tracks water parameters using IoT sensors.",
  },
  {
    title: "AI Insights",
    desc: "Analyzes data and gives intelligent suggestions.",
  },
  {
    title: "Smart Alerts",
    desc: "Instant alerts when water becomes unsafe.",
  },
  {
    title: "Prediction",
    desc: "Predicts future water safety using trends.",
  },
];


const TEAM = [
  {
    name: "Nikhil Kumar",
    role: "AI + Backend",
    img: "/team1.jpg",
    intro: "Expert in AI systems and backend architecture",
  },
  {
    name: "Savera",
    role: "Frontend + UI",
    img: "/team2.jpg",
    intro: "Expert in AI systems and backend architecture",
  },
  {
    name: "Member 3",
    role: "Hardware + IoT",
    img: "/team3.jpg",
    intro: "Expert in AI systems and backend architecture",
  },
  {
    name: "Member 4",
    role: "AI + Backend",
    img: "/team1.jpg",
    intro: "Expert in AI systems and backend architecture",
  },
  {
    name: "Member 5",
    role: "Frontend + UI",
    img: "/team2.jpg",
    intro: "Expert in AI systems and backend architecture",
  },
  {
    name: "Member 6",
    role: "Hardware + IoT",
    img: "/team3.jpg",
    intro: "Expert in AI systems and backend architecture",
  },
];

const WATER_QUOTES = [
  "Water is life 💧",
  "Clean water, healthy future 🌍",
  "Every drop matters 💙",
  "Safe water = Safe life",
  "Protect water, protect tomorrow",
  "Pure water is priceless",
];


type Reading = {
  id: string;
  ph: number;
  tds: number;
  turbidity: number;
  temperature: number;
  status: "SAFE" | "NOT SAFE";
  created_at: string;
};

const Index = () => {
  const [reading, setReading] = useState<Reading | null>(null);
  const [history, setHistory] = useState<Reading[]>([]);
  const [quote, setQuote] = useState(WATER_QUOTES[0]);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [simulatorRunning, setSimulatorRunning] = useState(true);


  // const [history, setHistory] = useState<History>([]);

  const graphData = history.map((item, i) => ({
    time: `#${i + 1}`,
    ph: item.ph,
    tds: item.tds,
    turbidity: item.turbidity,
  }));

  const getUsage = () => {
    if (!reading) return null;

    if (reading.status === "SAFE") {
      return "✅ Safe for drinking, washing, and farming";
    }

    if (reading.tds > 1000) {
      return "❌ Not safe for drinking. Use only for cleaning";
    }

    if (reading.turbidity > 25) {
      return "❌ Dirty water. Filter before use";
    }
    
    return "⚠️ Limited use. Treat before drinking";
  };

    

  useEffect(() => {
  if (!reading) return;

  if (reading.status === "NOT SAFE") {
    setQuote("⚠️ Water is unsafe. Avoid drinking!");
  } 
  else if (reading.turbidity > 25) {
    setQuote("💧 Water is too cloudy. Filtration needed.");
  } 
  else if (reading.tds > 1000) {
    setQuote("🧂 High TDS detected. Not ideal for drinking.");
  } 
  else if (reading.ph < 6.5 || reading.ph > 8.5) {
    setQuote("⚗️ pH imbalance detected. Check water source.");
  } 
  else {
    setQuote("✅ Water looks safe and healthy!");
  }
}, [reading]);




  const fetchLatest = useCallback(async () => {



    const { data, error } = await supabase.functions.invoke("latest");

    if (error) {
      console.error(error);
      return;
    }

    if (data?.reading) {
    setReading(data.reading as Reading);

    setHistory((prev) => {
      const updated = [...prev, data.reading];
      return updated.slice(-5);
    });
  }
}, []);

  const alertPlayedRef = useRef(false);


  useEffect(() => {
    fetchLatest();
    const id = window.setInterval(fetchLatest, 3000);
    return () => window.clearInterval(id);
  }, [fetchLatest]);

  
  useEffect(() => {
    if (!reading) return;

    if (reading.status === "SAFE") {
      alertPlayedRef.current = false;
      return;
    }

    if (!alertPlayedRef.current) {
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
      audio.play().catch(console.error);
      alertPlayedRef.current = true;
    }
  }, [reading]);


  const phOut = reading ? reading.ph < 6.5 || reading.ph > 8.5 : false;
  const tdsOut = reading ? reading.tds > 1000 : false;
  const turbOut = reading ? reading.turbidity > 25 : false;

  const getPrediction = () => {
  if (history.length < 2) return null;

  const last = history[history.length - 1];
  const prev = history[history.length - 2];

  // turbidity increasing
  if (last.turbidity > prev.turbidity && last.turbidity > 20) {
    return "⚠️ Water may become unsafe soon (getting dirty)";
  }
  console.log("history:", history);

  // TDS increasing
  if (last.tds > prev.tds && last.tds > 900) {
    return "⚠️ TDS is increasing. Water may become unsafe";
  }

  return null;
};




  return (
    <main className="min-h-screen bg-gradient-hero text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">HydroSentinel</h1>
              <p className="text-sm text-muted-foreground">Real-time water quality monitoring</p>
            </div>
          </div>
          <Simulator onPosted={fetchLatest} onRunningChange={setSimulatorRunning} />
        </header>
{/* === team details === */}
<section className="mt-12">
  <h2 className="text-xl font-bold mb-4 text-center">👨‍💻 Our Team</h2>
  <h2 className="text-lg text-primary font-semibold text-center mb-2">
  🚀 Team HYDROSENTINAL
</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {TEAM.map((member, i) => (
      <div
  key={i}
  className="rounded-xl border border-border bg-card p-4 text-center shadow-md hover:scale-105 transition cursor-pointer"
  onClick={() => setSelectedMember(member)}
>
        <img
          src={member.img}
          alt={member.name}
          className="mx-auto h-24 w-24 rounded-full object-cover border"
        />
        <p className="text-sm text-primary font-medium">
  {member.role}
</p>
        <h3 className="mt-3 font-semibold text-lg">{member.name}</h3>
        {/* <p className="text-sm text-muted-foreground">{member.role}</p> */}
      </div>
    ))}
  </div>


{selectedMember && (
  <div
  className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
  onClick={() => setSelectedMember(null)}
>
    
    <div
  className="bg-card rounded-2xl p-6 w-[90%] max-w-md text-center relative animate-scale-in"
  onClick={(e) => e.stopPropagation()}
> 
      {/* Close Button */}
      <button
        onClick={() => setSelectedMember(null)}
        className="absolute top-2 right-3 text-xl bg-red-500/20 px-2 rounded hover:bg-red-500/40"
      >
        ✖
      </button>

      {/* Image */}
      <img
        src={selectedMember.img}
        className="mx-auto h-28 w-28 rounded-full object-cover border-4 border-primary shadow-lg"
      />

      {/* Name */}
      <h2 className="mt-4 text-2xl font-bold tracking-tight">
        {selectedMember.name}
      </h2>

      {/* Role */}
      <p className="text-sm text-primary font-medium">
        {selectedMember.role}
      </p>

      {/* Intro */}
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
  {selectedMember.intro}
</p>

    </div>
  </div>
)}
</section>

<p className="text-center text-sm text-muted-foreground mt-4 max-w-xl mx-auto">
  We built HydroSentinel to solve real-world water safety issues faced in rural areas. 
  Our mission is to make clean and safe water accessible, understandable, and actionable for everyone using real-time data and AI.
</p>
        

<section className="mt-16 text-center">
  <h2 className="text-2xl font-bold mb-6">🚨 Problem & 💡 Solution</h2>

  <div className="grid gap-6 md:grid-cols-2">
    
    {/* Problem */}
    <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-5 text-left">
      <h3 className="text-lg font-semibold text-red-400 mb-2">🚨 Problem</h3>
      <p className="text-sm text-muted-foreground">
        Many communities lack real-time access to water quality data. 
        People often consume contaminated water unknowingly, leading to serious health issues. 
        There is no simple system to monitor and understand water safety instantly.
      </p>
    </div>

    {/* Solution */}
    <div className="rounded-xl border border-green-500/40 bg-green-500/10 p-5 text-left">
      <h3 className="text-lg font-semibold text-green-400 mb-2">💡 Solution</h3>
      <p className="text-sm text-muted-foreground">
        HydroSentinel provides real-time monitoring of water quality using IoT sensors. 
        It analyzes parameters like pH, TDS, and turbidity, and gives instant feedback with AI insights. 
        Users can easily understand whether water is safe or not and take necessary actions.
      </p>
    </div>

  </div>
</section>

<section className="mt-12 mb-16 text-center">
  <h2 className="text-2xl font-bold mb-6">⚡ Key Features</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

    <div className="rounded-xl border bg-card p-4 hover:scale-105 hover:shadow-lg transition duration-300">
      📡 <p className="mt-2 font-semibold">Real-time Monitoring</p>
      <p className="text-xs text-muted-foreground">Live sensor data updates</p>
    </div>

    <div className="rounded-xl border bg-card p-4 hover:scale-105 hover:shadow-lg transition duration-300">
      🤖 <p className="mt-2 font-semibold">AI Insights</p>
      <p className="text-xs text-muted-foreground">Smart water analysis</p>
    </div>

    <div className="rounded-xl border bg-card p-4 hover:scale-105 hover:shadow-lg transition duration-300">
      ⚠️ <p className="mt-2 font-semibold">Smart Alerts</p>
      <p className="text-xs text-muted-foreground">Instant unsafe warning</p>
    </div>

    <div className="rounded-xl border bg-card p-4 hover:scale-105 hover:shadow-lg transition duration-300">
      📊 <p className="mt-2 font-semibold">Prediction</p>
      <p className="text-xs text-muted-foreground">Future risk detection</p>
    </div>

  </div>
</section>



        {/* Status */}

        <StatusBanner status={reading?.status} updatedAt={reading?.created_at} simulatorRunning={simulatorRunning} />
        {reading?.status === "NOT SAFE" && (
  <div className="mt-4 rounded-xl bg-red-500/20 border border-red-500 p-4 text-red-300 font-semibold animate-pulse">
    🚨 Warning: Water is NOT SAFE! Do not drink. Use filtration or boiling.
  </div>
)}
{reading && (
  (reading.ph < 6.5 ||
    reading.ph > 8.5 ||
    reading.tds > 1000 ||
    reading.turbidity > 25) && (
    <div className="mt-2 text-sm text-red-400">
      Reason:
      {reading.ph < 6.5 || reading.ph > 8.5 ? " pH out of range," : ""}
      {reading.tds > 1000 ? " high TDS," : ""}
      {reading.turbidity > 25 ? " dirty water," : ""}
    </div>
  )
)}




        {/* Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
            <SensorCard
              label="pH"
              // value={reading?.ph}
              value={reading?.ph ?? 0}
              unit=""
              icon="ph"
              safeRange="6.5 – 8.5"
              alert={phOut}
            />
            <SensorCard
              label="TDS"
              value={reading?.tds}
              unit="ppm"
              icon="tds"
              safeRange="≤ 1000 ppm"
              alert={tdsOut}
            />
            <SensorCard
              label="Turbidity"
              value={reading?.turbidity}
              unit="NTU"
              icon="turbidity"
              safeRange="≤ 25 NTU"
              alert={turbOut}
            />
            <SensorCard
              label="Temperature"
              value={reading?.temperature}
              unit="°C"
              icon="temperature"
              safeRange="ambient"
            />
          </section>

          <aside className="h-[560px] lg:h-auto">
            <ChatPanel />
          </aside>


</div>
<div className="mt-10 p-6 rounded-2xl bg-card border border-border shadow-lg">
  <h2 className="text-lg font-semibold mb-2">📊 Water Trends Analysis</h2>

  <WaterGraph data={graphData} />
  {getPrediction() && (
  <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium animate-pulse">
    ⚠️ {getPrediction()}
  </div>
)}

  <p className="mt-4 text-sm text-muted-foreground">
    This graph visualizes real-time trends in water quality parameters like pH, TDS, and turbidity. 
AI analyzes these trends to detect anomalies and predict potential safety risks before they occur.
  </p>
</div>


        <footer className="mt-10 rounded-2xl border border-border bg-card/60 p-5 text-xs text-muted-foreground">
    <p className="text-xl font-semibold tracking-wide text-primary">💧 {quote}</p>
         {getUsage() && (
  <div className="mt-4 rounded-xl bg-yellow-500/20 border border-yellow-500 p-4 text-yellow-300 font-semibold">
    💡 {getUsage()}
  </div>
)}
        {getPrediction() && (
  <div className="mt-4 rounded-xl bg-yellow-500/20 border border-yellow-500 p-4 text-yellow-300 font-semibold">
    <p className="text-yellow-400 text-sm font-medium">
      🔮 Prediction: {getPrediction()}
    </p>
  </div>
)}

          <div className="mt-1">
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Index;
