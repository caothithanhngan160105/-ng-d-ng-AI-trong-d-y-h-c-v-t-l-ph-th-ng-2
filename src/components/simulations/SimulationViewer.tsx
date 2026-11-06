import React, { useState } from "react";
import { MotionSimulation } from "./MotionSimulation";
import { NewtonSecondLawSimulation } from "./NewtonSecondLawSimulation";
import { HarmonicOscillatorSimulation } from "./HarmonicOscillatorSimulation";
import { WaveInterferenceSimulation } from "./WaveInterferenceSimulation";
import { LightRefractionSimulation } from "./LightRefractionSimulation";
import { MomentumSimulation } from "./MomentumSimulation";
import { ElasticCollisionSimulation } from "./ElasticCollisionSimulation";
import { InelasticCollisionSimulation } from "./InelasticCollisionSimulation";
import { CollisionLabSuite } from "./CollisionLabSuite";
import { ElectricPotentialEnergySimulation } from "./ElectricPotentialEnergySimulation";
import { ElectricPotentialSimulation } from "./ElectricPotentialSimulation";
import { MagneticFluxSimulation } from "./MagneticFluxSimulation";
import { PendulumMechanicalEnergySimulation } from "./PendulumMechanicalEnergySimulation";
import { Maximize2, Minimize2, ExternalLink, Download, CheckCircle, HardDrive } from "lucide-react";
import { downloadSimulationOffline, OFFLINE_SIM_CATALOG } from "../../utils/offlineSimulations";

interface SimulationViewerProps {
  simulationId?: string;
  className?: string;
}

export const SimulationViewer: React.FC<SimulationViewerProps> = ({
  simulationId,
  className = "",
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);

  const handleDownload = () => {
    if (!simulationId) return;
    const success = downloadSimulationOffline(simulationId);
    if (success) {
      const meta = OFFLINE_SIM_CATALOG[simulationId];
      const name = meta ? meta.filename : "Thi_nghiem_offline.html";
      setDownloadSuccessNotice(`Đã tải thành công file "${name}" về máy tính! Thầy/cô có thể chép vào USB hoặc nhấp đúp để mở trực tiếp trong trình duyệt mà không cần kết nối Internet.`);
      setTimeout(() => setDownloadSuccessNotice(null), 6000);
    }
  };

  if (!simulationId) {
    return (
      <div className="bg-slate-900/60 rounded-xl p-8 border border-slate-800 text-center text-slate-400">
        <p>Bài học này sử dụng tài liệu thực hành / sơ đồ tư duy trong SGK.</p>
      </div>
    );
  }

  const renderSim = () => {
    switch (simulationId) {
      case "sim-motion-10":
        return <MotionSimulation />;
      case "sim-newton-10":
        return <NewtonSecondLawSimulation />;
      case "sim-momentum-10":
        return <CollisionLabSuite />;
      case "sim-collision-elastic-10":
        return <ElasticCollisionSimulation />;
      case "sim-collision-inelastic-10":
        return <InelasticCollisionSimulation />;
      case "sim-oscillator-11":
        return <HarmonicOscillatorSimulation />;
      case "sim-wave-11":
        return <WaveInterferenceSimulation />;
      case "sim-potential-energy-11":
        return <ElectricPotentialEnergySimulation />;
      case "sim-electric-potential-11":
        return <ElectricPotentialSimulation />;
      case "sim-refraction-11":
        return <LightRefractionSimulation />;
      case "sim-magnetic-flux-11":
        return <MagneticFluxSimulation />;
      case "sim-pendulum-energy-10":
        return <PendulumMechanicalEnergySimulation />;
      default:
        return (
          <div className="p-8 text-center text-slate-400">
            Chưa tìm thấy mô phỏng tương ứng.
          </div>
        );
    }
  };

  return (
    <div
      id="simulation-viewer-wrapper"
      className={`relative transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto flex flex-col justify-center items-center"
          : className
      }`}
    >
      {/* Fullscreen & Download Offline bar */}
      <div className="flex flex-wrap justify-between items-center mb-2 px-1 gap-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Phòng thí nghiệm ảo tương tác (Chiếu trên lớp)
        </span>

        <div className="flex items-center gap-2">
          {/* OFFLINE DOWNLOAD BUTTON */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/80 hover:bg-emerald-800/80 border border-emerald-700/60 hover:border-emerald-500 px-3 py-1.5 rounded-lg transition-all shadow-xs"
            title="Tải toàn bộ thí nghiệm về máy dưới dạng 1 file HTML độc lập - mở chạy offline không cần Internet, không cần mở app"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tải thí nghiệm về máy (Chạy Offline)</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg transition-colors"
            title={isFullscreen ? "Thu nhỏ cửa sổ" : "Chế độ toàn màn hình cho máy chiếu"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" /> Thoát toàn màn hình
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" /> Chiếu toàn màn hình
              </>
            )}
          </button>
        </div>
      </div>

      {/* Download notification banner */}
      {downloadSuccessNotice && (
        <div className="mb-3 p-3 bg-emerald-950/90 border border-emerald-600/80 rounded-xl text-xs text-emerald-200 flex items-start gap-2 shadow-lg animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="text-emerald-300 block mb-0.5">Tải thí nghiệm thành công!</strong>
            <p className="leading-relaxed">{downloadSuccessNotice}</p>
          </div>
        </div>
      )}

      <div className={`w-full ${isFullscreen ? "max-w-4xl" : ""}`}>
        {renderSim()}
      </div>
    </div>
  );
};
