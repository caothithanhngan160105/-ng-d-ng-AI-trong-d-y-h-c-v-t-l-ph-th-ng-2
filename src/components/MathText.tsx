import React from "react";
import katex from "katex";

interface MathTextProps {
  children?: string;
  text?: string;
  className?: string;
  inline?: boolean;
}

/**
 * Preprocesses physics text: converts common notations into clean LaTeX math
 * e.g., "vectơ F12 = - vectơ F21" -> "$\vec{F}_{12} = -\vec{F}_{21}$"
 */
export function normalizePhysicsMath(rawText: string): string {
  if (!rawText) return "";

  let processed = rawText;

  // Protect already-dollarized segments ($...$ or $$...$$)
  const dollarSegments: string[] = [];
  processed = processed.replace(/\$\$[\s\S]*?\$\$|\$[^\$]+?\$/g, (match) => {
    dollarSegments.push(match);
    return `__MATH_SLOT_${dollarSegments.length - 1}__`;
  });

  // Convert arrow notations and symbols
  processed = processed
    .replace(/<=>/g, " $\\Leftrightarrow$ ")
    .replace(/=>/g, " $\\Rightarrow$ ")
    .replace(/->/g, " $\\rightarrow$ ");

  // Replace common physics vector notations and formula shorthand into LaTeX
  processed = processed
    // Replace complex vector combinations first
    .replace(/vectơ\s+F12\s*\.\s*dt/gi, "$\\vec{F}_{12} \\cdot \\Delta t$")
    .replace(/vectơ\s+F21\s*\.\s*dt/gi, "$\\vec{F}_{21} \\cdot \\Delta t$")
    .replace(/vectơ\s+F\s*\.\s*dt/gi, "$\\vec{F} \\cdot \\Delta t$")
    .replace(/vectơ\s+F12/gi, "$\\vec{F}_{12}$")
    .replace(/vectơ\s+F21/gi, "$\\vec{F}_{21}$")
    .replace(/vectơ\s+F/gi, "$\\vec{F}$")
    .replace(/Delta\s+vectơ\s+p1/gi, "$\\Delta \\vec{p}_1$")
    .replace(/Delta\s+vectơ\s+p2/gi, "$\\Delta \\vec{p}_2$")
    .replace(/Delta\s+vectơ\s+p/gi, "$\\Delta \\vec{p}$")
    .replace(/Delta\s+p1/gi, "$\\Delta p_1$")
    .replace(/Delta\s+p2/gi, "$\\Delta p_2$")
    .replace(/Delta\s+p/gi, "$\\Delta p$")
    .replace(/Delta\s+t1/gi, "$\\Delta t_1$")
    .replace(/Delta\s+t2/gi, "$\\Delta t_2$")
    .replace(/Delta\s+t/gi, "$\\Delta t$")
    .replace(/vectơ\s+p1'/gi, "$\\vec{p}'_1$")
    .replace(/vectơ\s+p2'/gi, "$\\vec{p}'_2$")
    .replace(/vectơ\s+p'_1/gi, "$\\vec{p}'_1$")
    .replace(/vectơ\s+p'_2/gi, "$\\vec{p}'_2$")
    .replace(/vectơ\s+p1/gi, "$\\vec{p}_1$")
    .replace(/vectơ\s+p2/gi, "$\\vec{p}_2$")
    .replace(/vectơ\s+p_trước/gi, "$\\vec{p}_{\\text{trước}}$")
    .replace(/vectơ\s+p_sau/gi, "$\\vec{p}_{\\text{sau}}$")
    .replace(/vectơ\s+p/gi, "$\\vec{p}$")
    .replace(/vectơ\s+v1'/gi, "$\\vec{v}'_1$")
    .replace(/vectơ\s+v2'/gi, "$\\vec{v}'_2$")
    .replace(/vectơ\s+v'_1/gi, "$\\vec{v}'_1$")
    .replace(/vectơ\s+v'_2/gi, "$\\vec{v}'_2$")
    .replace(/vectơ\s+v1/gi, "$\\vec{v}_1$")
    .replace(/vectơ\s+v2/gi, "$\\vec{v}_2$")
    .replace(/vectơ\s+v'/gi, "$\\vec{v}'$")
    .replace(/vectơ\s+v/gi, "$\\vec{v}$")
    .replace(/vectơ\s+V/gi, "$\\vec{V}$")
    .replace(/vectơ\s+0/gi, "$\\vec{0}$")
    .replace(/p_trước/gi, "$p_{\\text{trước}}$")
    .replace(/p_sau/gi, "$p_{\\text{sau}}$");

  // Restore protected slots
  processed = processed.replace(/__MATH_SLOT_(\d+)__/g, (_, idx) => {
    return dollarSegments[parseInt(idx, 10)] || "";
  });

  return processed;
}

/**
 * Transforms LaTeX and math expressions into clean HTML suitable for Word .doc export
 */
export function formatMathForWord(rawText: string): string {
  if (!rawText) return "";
  let text = rawText;

  // Convert vectors
  text = text
    .replace(/\$\\vec\{F\}_\{12\}\$/g, "<i>F&#8407;</i><sub>12</sub>")
    .replace(/\$\\vec\{F\}_\{21\}\$/g, "<i>F&#8407;</i><sub>21</sub>")
    .replace(/\$\\vec\{F\}\$/g, "<i>F&#8407;</i>")
    .replace(/\$\\Delta\\s*\\vec\{p\}_1\$/g, "&Delta;<i>p&#8407;</i><sub>1</sub>")
    .replace(/\$\\Delta\\s*\\vec\{p\}_2\$/g, "&Delta;<i>p&#8407;</i><sub>2</sub>")
    .replace(/\$\\Delta\\s*\\vec\{p\}\$/g, "&Delta;<i>p&#8407;</i>")
    .replace(/\$\\vec\{p\}'_1\$/g, "<i>p&#8407;</i>'<sub>1</sub>")
    .replace(/\$\\vec\{p\}'_2\$/g, "<i>p&#8407;</i>'<sub>2</sub>")
    .replace(/\$\\vec\{p\}_1\$/g, "<i>p&#8407;</i><sub>1</sub>")
    .replace(/\$\\vec\{p\}_2\$/g, "<i>p&#8407;</i><sub>2</sub>")
    .replace(/\$\\vec\{p\}\$/g, "<i>p&#8407;</i>")
    .replace(/\$\\vec\{v\}'_1\$/g, "<i>v&#8407;</i>'<sub>1</sub>")
    .replace(/\$\\vec\{v\}'_2\$/g, "<i>v&#8407;</i>'<sub>2</sub>")
    .replace(/\$\\vec\{v\}_1\$/g, "<i>v&#8407;</i><sub>1</sub>")
    .replace(/\$\\vec\{v\}_2\$/g, "<i>v&#8407;</i><sub>2</sub>")
    .replace(/\$\\vec\{v\}'\$/g, "<i>v&#8407;</i>'")
    .replace(/\$\\vec\{v\}\$/g, "<i>v&#8407;</i>")
    .replace(/\$\\vec\{0\}\$/g, "<i>0&#8407;</i>")
    .replace(/\$\\vec\{V\}\$/g, "<i>V&#8407;</i>")
    .replace(/\$\\vec\{p\}_\\text\{trước\}\$/g, "<i>p&#8407;</i><sub>trước</sub>")
    .replace(/\$\\vec\{p\}_\\text\{sau\}\$/g, "<i>p&#8407;</i><sub>sau</sub>")
    .replace(/\$p_\\text\{trước\}\$/g, "<i>p</i><sub>trước</sub>")
    .replace(/\$p_\\text\{sau\}\$/g, "<i>p</i><sub>sau</sub>")
    .replace(/\$\\Delta t\$/g, "&Delta;<i>t</i>")
    .replace(/\$\\Rightarrow\$/g, " &rArr; ")
    .replace(/\$\\Leftrightarrow\$/g, " &hArr; ")
    .replace(/\\cdot/g, "&sdot;")
    .replace(/\\times/g, "&times;")
    // Clean remaining dollar signs if any simple formula
    .replace(/\$([^$]+)\$/g, "<i>$1</i>")
    // Fallback for verbal words
    .replace(/vectơ\s+F12/gi, "<i>F&#8407;</i><sub>12</sub>")
    .replace(/vectơ\s+F21/gi, "<i>F&#8407;</i><sub>21</sub>")
    .replace(/vectơ\s+F/gi, "<i>F&#8407;</i>")
    .replace(/vectơ\s+p1'/gi, "<i>p&#8407;</i>'<sub>1</sub>")
    .replace(/vectơ\s+p2'/gi, "<i>p&#8407;</i>'<sub>2</sub>")
    .replace(/vectơ\s+p1/gi, "<i>p&#8407;</i><sub>1</sub>")
    .replace(/vectơ\s+p2/gi, "<i>p&#8407;</i><sub>2</sub>")
    .replace(/vectơ\s+p/gi, "<i>p&#8407;</i>")
    .replace(/vectơ\s+v1'/gi, "<i>v&#8407;</i>'<sub>1</sub>")
    .replace(/vectơ\s+v2'/gi, "<i>v&#8407;</i>'<sub>2</sub>")
    .replace(/vectơ\s+v1/gi, "<i>v&#8407;</i><sub>1</sub>")
    .replace(/vectơ\s+v2/gi, "<i>v&#8407;</i><sub>2</sub>")
    .replace(/vectơ\s+v'/gi, "<i>v&#8407;</i>'")
    .replace(/vectơ\s+v/gi, "<i>v&#8407;</i>")
    .replace(/vectơ\s+0/gi, "<i>0&#8407;</i>");

  return text;
}

export const MathText: React.FC<MathTextProps> = ({
  children,
  text,
  className = "",
  inline = false,
}) => {
  const raw = text ?? children ?? "";
  const normalized = normalizePhysicsMath(raw);

  // Regex to match $$ ... $$ (display) or $ ... $ (inline)
  const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g;
  const parts = normalized.split(regex);

  const renderedElements = parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith("$$") && part.endsWith("$$") && part.length >= 4) {
      const tex = part.slice(2, -2).trim();
      try {
        const html = katex.renderToString(tex, {
          displayMode: true,
          throwOnError: false,
        });
        return (
          <span
            key={index}
            className="my-2 block overflow-x-auto text-center"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <span key={index}>{part}</span>;
      }
    }

    if (part.startsWith("$") && part.endsWith("$") && part.length >= 2) {
      const tex = part.slice(1, -1).trim();
      try {
        const html = katex.renderToString(tex, {
          displayMode: false,
          throwOnError: false,
        });
        return (
          <span
            key={index}
            className="inline-math px-0.5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <span key={index}>{part}</span>;
      }
    }

    return <span key={index}>{part}</span>;
  });

  if (inline) {
    return <span className={`math-text-wrapper ${className}`}>{renderedElements}</span>;
  }

  return <div className={`math-text-wrapper ${className}`}>{renderedElements}</div>;
};

export default MathText;
