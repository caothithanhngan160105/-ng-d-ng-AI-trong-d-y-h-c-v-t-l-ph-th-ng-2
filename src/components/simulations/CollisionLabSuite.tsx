import React, { useState } from "react";
import { ElasticCollisionSimulation } from "./ElasticCollisionSimulation";
import { InelasticCollisionSimulation } from "./InelasticCollisionSimulation";
import { MomentumSimulation } from "./MomentumSimulation";
import { BookOpen, Sparkles, Scale, Zap, Info, ExternalLink } from "lucide-react";
import { MathText } from "../MathText";

interface CollisionLabSuiteProps {
  initialExperiment?: "elastic" | "inelastic" | "impulse";
}

export const CollisionLabSuite: React.FC<CollisionLabSuiteProps> = ({
  initialExperiment = "elastic",
}) => {
  const [activeExp, setActiveExp] = useState<"elastic" | "inelastic" | "impulse">(initialExperiment);

  return (
    <div className="space-y-4">
      {/* Top Switcher Bar */}
      <div className="bg-slate-900/95 p-2 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 px-2 py-1">
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-slate-200">
            BỘ THÍ NGHIỆM ĐỊNH LUẬT BẢO TOÀN ĐỘNG LƯỢNG (SGK VẬT LÍ 10 - TRANG 114)
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveExp("elastic")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition ${
              activeExp === "elastic"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-300"></span>
            1. Va chạm đàn hồi (Bảng 29.1)
          </button>

          <button
            onClick={() => setActiveExp("inelastic")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition ${
              activeExp === "inelastic"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
            2. Va chạm mềm (Bảng 29.2)
          </button>

          <button
            onClick={() => setActiveExp("impulse")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition ${
              activeExp === "impulse"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            3. Xung lượng của lực (<MathText inline>{"$\\Delta p = F\\Delta t$"}</MathText>)
          </button>
        </div>
      </div>

      {/* Active Component */}
      {activeExp === "elastic" && <ElasticCollisionSimulation />}
      {activeExp === "inelastic" && <InelasticCollisionSimulation />}
      {activeExp === "impulse" && <MomentumSimulation />}
    </div>
  );
};
