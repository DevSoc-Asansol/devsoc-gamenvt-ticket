"use client"
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [line1Text, setLine1Text] = useState("");
  const [line2Text, setLine2Text] = useState("");
  const [showGlow, setShowGlow] = useState(false);
  const fullLine1 = "Gaming Event";
  const fullLine2 = "by devsoc";

  useEffect(() => {
    let line1Index = 0;
    let line2Index = 0;
    let startLine2 = false;
    
    const intervalId = setInterval(() => {
      if (line1Index <= fullLine1.length) {
        setLine1Text(fullLine1.slice(0, line1Index));
        line1Index++;
      } else if (!startLine2) {
        startLine2 = true;
        setTimeout(() => {
          const line2IntervalId = setInterval(() => {
            if (line2Index <= fullLine2.length) {
              setLine2Text(fullLine2.slice(0, line2Index));
              line2Index++;
            } else {
              clearInterval(line2IntervalId);
              setShowGlow(true);
            }
          }, 100);
        }, 300);
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] bg-dot-white/[0.2] h-screen text-white bg-black items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-5xl relative inline-block">
            <span className="inline-block relative">
              {line1Text}
            </span>
          </h1>
          <h2 className="font-medium text-3xl relative inline-block">
            <span className={`inline-block relative ${showGlow ? 'flicker-glow' : ''}`}>
              {line2Text}
            </span>
          </h2>
        </div>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by Signing Up and filling the form.
          </li>
          <li>Pay and receive your ID card.</li>
        </ol>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-white/[.1] transition-transform transform hover:scale-105 flex items-center justify-center bg-black text-white gap-2 hover:text-black hover:bg-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 hover:shadow-lg"
            href="/registration"
            rel="noopener noreferrer"
          >
            Register
          </Link>
          <Link
            className="rounded-full bg-black border border-solid border-white/[.1] transition-transform transform hover:scale-105 flex items-center justify-center hover:bg-[#f2f2f2] hover:text-[#000] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 hover:shadow-lg"
            href="/idcard"
            rel="noopener noreferrer"
          >
            ID Card Status
          </Link>
        </div>
      </main>
      <style jsx>{`        
        @keyframes flicker {
          0% {
            text-shadow: 0 0 4px #fff,
                         0 0 11px #fff,
                         0 0 19px #fff,
                         0 0 40px #000,
                         0 0 80px #000,
                         0 0 90px #000,
                         0 0 100px #000,
                         0 0 150px #000;
          }
          
          18% {
            text-shadow: none;
          }
          
          20% {
            text-shadow: 0 0 4px #fff,
                         0 0 11px #fff,
                         0 0 19px #fff,
                         0 0 40px #000,
                         0 0 80px #000,
                         0 0 90px #000,
                         0 0 100px #000,
                         0 0 150px #000;
          }
          
          22% {
            text-shadow: none;
          }
          
          24% {
            text-shadow: 0 0 4px #fff,
                         0 0 11px #fff,
                         0 0 19px #fff,
                         0 0 40px #000,
                         0 0 80px #000,
                         0 0 90px #000,
                         0 0 100px #000,
                         0 0 150px #000;
          }
          
          100% {
            text-shadow: 0 0 4px #fff,
                         0 0 11px #fff,
                         0 0 19px #fff,
                         0 0 40px #0fa,
                         0 0 80px #000,
                         0 0 90px #000,
                         0 0 100px #000,
                         0 0 150px #000;
          }
        }

        .flicker-glow {
          animation: flicker 2.5s infinite alternate;
        }
      `}</style>
    </div>
  );
}