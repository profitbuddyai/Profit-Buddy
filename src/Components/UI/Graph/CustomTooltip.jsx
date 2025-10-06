import React from 'react';
import { formatDate, formatTime, formatYear, lightenColor } from '../../../Utils/GraphUtils';
import { formatNumberWithCommas } from '../../../Utils/NumberUtil';
import { ScaleFactors } from '../../../Enums/Enums';

// A CustomTooltip that assigns up to 4 tooltips to the four quadrants
// (top-left, top-right, bottom-left, bottom-right) and tries to avoid
// overlaps. Connector lines are drawn from the data point to the tooltip.


export default function CustomTooltip({ rect, points, visible, configs, size = 'large' }) {

    const scaleFactor = ScaleFactors?.[size] || 1
    
    if (!visible || !points) return null;
    if (!rect) return null;

    const chartW = rect.width;
    const chartH = rect.height;
    // if (points?.xPixel > chartW - 95 || points?.xPixel < 88) return;
    const containerStyle = {
        position: 'absolute',
        // top:0,
        // left:0,
        left: Math.round(rect.left + window.scrollX),
        top: Math.round(rect.top + window.scrollY),
        width: Math.round(chartW),
        height: Math.round(chartH),
        pointerEvents: 'none',
        zIndex: 1000,
        // backgroundColor:'red',
    };

    // Tooltip size (keep in sync with your classes)
    const TT_W = 80 * scaleFactor;
    const TT_H = 43 * scaleFactor;
    const GAP = 6; // minimal gap when nudging

    // helper: compute clamped canvas px/py (same as your original logic)
    const normalizePoint = (p) => {
        const px = Math.max((20 * scaleFactor), Math.min(chartW - 0, Math.round(points?.xPixel)));
        const py = Math.max((20 * scaleFactor), Math.min(chartH - 0, Math.round(p.canvasy)));
        return { px, py };
    };

    // map quadrant -> function that returns {left, top} for tooltip placement
    const quadrantPlacement = {
        'top-left': (x, y) => ({ left: x - TT_W - (20 * scaleFactor), top: y - TT_H - (20 * scaleFactor) }),
        'top-right': (x, y) => ({ left: x + (20 * scaleFactor), top: y - TT_H - (20 * scaleFactor) }),
        'bottom-left': (x, y) => ({ left: x - TT_W - (20 * scaleFactor), top: y + (20 * scaleFactor) }),
        'bottom-right': (x, y) => ({ left: x + (20 * scaleFactor), top: y + (20 * scaleFactor) }),
    };

    // ensure we stay inside chart bounds when placing tooltip
    const clampToChart = ({ left, top }) => {
        let l = left;
        let t = top;
        // keep some padding so tooltip doesn't flush to the exact border
        const pad = 4;
        l = Math.max(pad - 0, Math.min(chartW - TT_W - pad, l));
        t = Math.max(pad - 0, Math.min(chartH - TT_H - pad, t));
        return { left: l, top: t };
    };

    // compute preferred quadrant for each point
    const centerX = chartW / 2;
    const centerY = chartH / 2;

    const pts = points.data.map((p) => {
        const { px, py } = normalizePoint(p);
        const horiz = px < centerX ? 'left' : 'right';
        const vert = py < centerY ? 'top' : 'bottom';
        const preferred = `${vert}-${horiz}`;
        return { raw: p, px, py, preferred };
    });

    // Sort: we give priority to points farther from center so edges get stable spots first
    pts.sort((a, b) => {
        const da = Math.hypot(a.px - centerX, a.py - centerY);
        const db = Math.hypot(b.px - centerX, b.py - centerY);
        return db - da; // descending
    });

    const available = new Set(['top-left', 'top-right', 'bottom-left', 'bottom-right']);
    const assigned = [];

    // greedy assignment: pick preferred if free else the quadrant with minimal penalty
    for (const p of pts) {
        let pick = null;
        if (available.has(p.preferred)) {
            pick = p.preferred;
        } else {
            // choose remaining quadrant that would place tooltip closest to the point
            let best = null;
            let bestDist = Infinity;
            for (const q of available) {
                const pos = quadrantPlacement[q](p.px, p.py);
                const clamped = clampToChart(pos);
                const centerOfTooltip = { x: pos.left + TT_W / 2, y: pos.top + TT_H / 2 };
                const dist = Math.hypot(centerOfTooltip.x - p.px, centerOfTooltip.y - p.py);
                if (dist < bestDist) {
                    bestDist = dist;
                    best = q;
                }
            }
            pick = best;
        }

        if (pick == null) {
            // fallback: place at bottom-right (shouldn't happen with up to 4 points)
            pick = 'bottom-left';
        }

        available.delete(pick);
        const rawPos = quadrantPlacement[pick](p.px, p.py);
        const clampedPos = clampToChart(rawPos);
        assigned.push({ ...p, quadrant: pick, left: rawPos.left, top: rawPos.top });
    }

    // simple overlap detection and resolution pass
    function rectsOverlap(a, b) {
        return !(a.left + TT_W <= b.left || b.left + TT_W <= a.left || a.top + TT_H <= b.top || b.top + TT_H <= a.top);
    }

    // try to resolve overlaps by nudging the *later* (lower-priority) tooltip away
    for (let i = 0; i < assigned.length; i++) {
        for (let j = i + 1; j < assigned.length; j++) {
            const A = assigned[i];
            const B = assigned[j];
            if (rectsOverlap(A, B)) {
                // decide nudge direction: move B away from A along the largest overlap axis
                const overlapX = Math.min(A.left + TT_W, B.left + TT_W) - Math.max(A.left, B.left);
                const overlapY = Math.min(A.top + TT_H, B.top + TT_H) - Math.max(A.top, B.top);

                if (overlapX >= overlapY) {
                    // move horizontally
                    const shift = TT_W + GAP;
                    // try move B to the other horizontal side of its point
                    const tryLeft = B.px - TT_W - GAP;
                    const tryRight = B.px + GAP;
                    const canLeft = tryLeft >= 0;
                    const canRight = tryRight + TT_W <= chartW;
                    if (canRight) B.left = Math.min(chartW - TT_W - 4, tryRight);
                    else if (canLeft) B.left = Math.max(4, tryLeft);
                    else B.left = Math.min(chartW - TT_W - 4, B.left + shift);
                } else {
                    // move vertically
                    const shift = TT_H + GAP;
                    const tryTop = B.py - TT_H - GAP;
                    const tryBottom = B.py + GAP;
                    const canTop = tryTop >= 0;
                    const canBottom = tryBottom + TT_H <= chartH;
                    if (canBottom) B.top = Math.min(chartH - TT_H - 4, tryBottom);
                    else if (canTop) B.top = Math.max(4, tryTop);
                    else B.top = Math.min(chartH - TT_H - 4, B.top + shift);
                }
            }
        }
    }

    const connectorStyle = (sx, sy, tx, ty, color = 'gray') => {
        const dx = tx - sx;
        const dy = ty - sy;
        const len = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);

        return {
            position: 'absolute',
            left: sx,
            top: sy,
            width: Math.max(1, len),
            height: 1.5,
            transformOrigin: '0 50%',
            transform: `rotate(${angle}rad)`,
            backgroundColor: color,
            pointerEvents: 'none',
        };
    };

    return (
        <div style={containerStyle} className="pointer-events-none  origin-top-left transition-all ">
            {configs?.[0]?.name !== "Offer Count" && (
                <div style={{
                    position: 'absolute',
                    left: points?.xPixel - 60,
                    bottom: -52,
                    transform: `scale(${scaleFactor})`,
                }} className="bg-white text-sm text-nowrap p-1 rounded shadow border border-gray-300 z-30">

                    <p className='font-semibold text-black'>
                        {formatYear(points?.date)}, {formatDate(points?.date)} :
                        <span className="text-lText font-normal text-xs"> {formatTime(points?.date)}</span>
                    </p>
                </div>
            )}

            {assigned.map((a, i) => {
                const cfg = configs?.find(c => c.name === a.raw.name) || {};
                const color = cfg.color || '#000';
                const lightColor = cfg.lightColor || '#f8f8f8';

                // tooltip box coordinates are relative to chart top-left (container)
                const left = Math.round(a.left);
                const top = Math.round(a.top);

                // connector target: tooltip center
                const tx = left + TT_W / 2;
                const ty = top + TT_H / 2;
                const sx = Math.round(a.px);
                const sy = Math.round(a.py);

                const connStyle = connectorStyle(sx, sy, tx, ty, 'gray');

                return (
                    <React.Fragment key={i}>
                        <div style={connStyle} className="rounded-full " />

                        <div
                            className="transition-none ease-linear duration-75 w-[80px] h-[40px] flex flex-col text-sm p-1 shadow border"
                            style={{
                                position: 'absolute',
                                left,
                                top,
                                background: lightColor,
                                borderColor: color,
                                pointerEvents: 'none',
                                whiteSpace: 'nowrap',
                                zIndex: 10,
                                transform: `scale(${scaleFactor})`,
                            }}
                        >
                            <span className="text-[#767676] text-xs/[12px]">{a.raw.name}</span>
                            <span className="text-[#2f2f2f] font-xs/[12px]">
                                {cfg.symbol || ''}{a.raw.yval !== null ? formatNumberWithCommas(a.raw.yval, cfg?.decimal ? 2 : 0, false, true) : '-'}
                            </span>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}
