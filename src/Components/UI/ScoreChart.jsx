"use client";
import React, { useId } from "react";
import { FaSlash } from "react-icons/fa";
import { PieChart, Pie, Cell } from "recharts";

const value = Math.floor(Math.random() * 91) + 10;

const progress = [
    { name: "Completed", value: value }
];

const background = [
    { name: "Full", value: 100 },
];

const COLORS = [
    '#25d89030',
];


const getColor = (v) => {
    if (value / 10 < 4) return "#E6394640";
    if (value / 10 < 6) return "#FF7E2940";
    return "#25d89040";
};

const ScoreChart = ({ className }) => {

    const uniqueId = useId();

    const getGradientId = () => {
        if (value / 10 < 4) {
            return `progressGradientRed-${uniqueId}`;
        } else if (value / 10 < 6) {
            return `progressGradientYellow-${uniqueId}`;
        }
        return `progressGradientGreen-${uniqueId}`;
    }


    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="relative">
                <PieChart width={150} height={150}>
                    <Pie
                        data={background}
                        cx="50%"
                        cy="50%"
                        innerRadius={57}
                        outerRadius={70}
                        startAngle={90}
                        endAngle={-270}
                        cornerRadius={20}
                        dataKey="value"
                    >
                        <Cell fill={getColor()} stroke="none" />
                    </Pie>

                    <defs>
                        <linearGradient id={`progressGradientGreen-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#24E698" />
                            <stop offset="100%" stopColor="#1DB9A0" />
                        </linearGradient>

                        <linearGradient id={`progressGradientYellow-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FFD93D" />
                            <stop offset="100%" stopColor="#FFC107" />
                        </linearGradient>

                        <linearGradient id={`progressGradientRed-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FF6B6B" />
                            <stop offset="100%" stopColor="#E63946" />
                        </linearGradient>
                    </defs>
                    <svg>
                        <defs>
                            <filter id={`shadow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="-1" dy="-1" stdDeviation="1" floodColor="#545454" floodOpacity="0.2" />
                                <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#545454" floodOpacity="0.2" />
                            </filter>
                        </defs>
                    </svg>

                    <Pie
                        data={progress}
                        cx="50%"
                        cy="50%"
                        innerRadius={57}
                        outerRadius={70}
                        startAngle={90}
                        endAngle={90 - (progress[0].value / 100) * 360}
                        cornerRadius={20}
                        dataKey="value"
                        filter={`url(#shadow-${uniqueId})`}
                    >
                        <Cell fill={`url(#${getGradientId(progress[0].value / 10)})`} className="!shadow-xl" strokeWidth={2} stroke="none" />
                    </Pie>
                </PieChart>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-secondary flex items-end ">
                        {progress[0].value / 10}
                        <span className="inline-block rotate-[75deg] relative top-0.5 -mx-2"><FaSlash /></span>
                        <span className="text-xl relative top-2.5 ">10</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default React.memo(ScoreChart);