import React from 'react';
import { formatDate, formatTime, formatYear, getSellerByTimestamp, lightenColor } from '../../../Utils/GraphUtils';
import { formatNumberWithCommas } from '../../../Utils/NumberUtil';
import { ScaleFactors } from '../../../Enums/Enums';
import { FaStar } from 'react-icons/fa';
import Rating from '../Rating';

// A CustomTooltip that assigns up to 4 tooltips to the four quadrants
// (top-left, top-right, bottom-left, bottom-right) and tries to avoid
// overlaps. Connector lines are drawn from the data point to the tooltip.


export default function CustomTooltip({ rect, points, visible, configs, size = 'large', sellerData, buyboxSellerHistory }) {

    const scaleFactor = ScaleFactors?.[size] || 1

    if (!visible || !points) return null;
    if (!rect) return null;
    if (!points.data || !Array.isArray(points.data)) return null;

    const chartW = rect.width;
    const chartH = rect.height;

    const containerStyle = {
        position: 'absolute',
        left: Math.round(rect.left + window.scrollX),
        top: Math.round(rect.top + window.scrollY),
        width: Math.round(chartW),
        height: Math.round(chartH),
        pointerEvents: 'none',
        zIndex: 1000,
    };

    const BASE_TT_W = 80;
    const BASE_TT_H = 43;
    const GAP = 6;
    const MARGIN = 20 * scaleFactor;

    const normalizePoint = (p) => {
        const px = Math.max(MARGIN, Math.min(chartW - MARGIN, Math.round(points?.xPixel)));
        const py = Math.max(MARGIN, Math.min(chartH - MARGIN, Math.round(p.canvasy)));
        return { px, py };
    };

    const quadrantPlacement = (TT_W, TT_H) => ({
        'top-left': (x, y) => ({ left: x - TT_W - (20 * scaleFactor), top: y - TT_H - (20 * scaleFactor) }),
        'top-right': (x, y) => ({ left: x + (20 * scaleFactor), top: y - TT_H - (20 * scaleFactor) }),
        'bottom-left': (x, y) => ({ left: x - TT_W - (20 * scaleFactor), top: y + (20 * scaleFactor) }),
        'bottom-right': (x, y) => ({ left: x + (20 * scaleFactor), top: y + (20 * scaleFactor) }),
    });

    // clamp that accepts width/height for accurate clamping
    const clampToChart = ({ left, top, width = BASE_TT_W * scaleFactor, height = BASE_TT_H * scaleFactor }) => {
        const pad = 4;
        const l = Math.max(pad, Math.min(chartW - width - pad, left));
        const t = Math.max(pad, Math.min(chartH - height - pad, top));
        return { left: Math.round(l), top: Math.round(t) };
    };

    const centerX = chartW / 2;
    const centerY = chartH / 2;

    const pts = points.data.map((p) => {
        const { px, py } = normalizePoint(p);
        const horiz = px < centerX ? 'left' : 'right';
        const vert = py < centerY ? 'top' : 'bottom';
        const preferred = `${vert}-${horiz}`;
        return { raw: p, px, py, preferred };
    });

    pts.sort((a, b) => {
        const da = Math.hypot(a.px - centerX, a.py - centerY);
        const db = Math.hypot(b.px - centerX, b.py - centerY);
        return db - da; // descending
    });

    // limit to up to 4 points (we have only 4 quadrants)
    const limitedPts = pts.slice(0, 4);

    const available = new Set(['top-left', 'top-right', 'bottom-left', 'bottom-right']);
    const assigned = [];

    for (const p of limitedPts) {
        let pick = null;
        if (available.has(p.preferred)) {
            pick = p.preferred;
        } else {
            // choose remaining quadrant that would place tooltip closest to the point
            let best = null;
            let bestDist = Infinity;
            for (const q of available) {
                // determine tooltip size for this point based on config (so placement uses proper size)
                const cfgForP = configs?.find(c => c.name === p.raw.name) || {};
                const isBuybox = cfgForP?.key === 'buybox';
                const TT_W = (isBuybox ? 160 : 54) * scaleFactor;
                const TT_H = (isBuybox ? 80 : 40) * scaleFactor;

                const qp = quadrantPlacement(TT_W, TT_H)[q](p.px, p.py);
                const clamped = clampToChart({ left: qp.left, top: qp.top, width: TT_W, height: TT_H });
                const centerOfTooltip = { x: qp.left + TT_W / 2, y: qp.top + TT_H / 2 };
                const dist = Math.hypot(centerOfTooltip.x - p.px, centerOfTooltip.y - p.py);
                if (dist < bestDist) {
                    bestDist = dist;
                    best = q;
                }
            }
            pick = best;
        }

        if (pick == null) {
            // fallback
            pick = 'bottom-left';
        }

        available.delete(pick);

        // determine tooltip size based on config
        const cfgForP = configs?.find(c => c.name === p.raw.name) || {};
        const isBuybox = cfgForP?.key === 'buybox';
        const TT_W_actual = (isBuybox ? 140 : 80) * scaleFactor;
        const TT_H_actual = (isBuybox ? 54 : 40) * scaleFactor;

        const rawPos = quadrantPlacement(TT_W_actual, TT_H_actual)[pick](p.px, p.py);
        const clampedPos = clampToChart({ left: rawPos.left, top: rawPos.top, width: TT_W_actual, height: TT_H_actual });

        assigned.push({
            ...p,
            quadrant: pick,
            left: clampedPos.left,
            top: clampedPos.top,
            width: TT_W_actual,
            height: TT_H_actual,
            cfg: cfgForP,
        });
    }

    // robust overlap resolver (iterative)
    function resolveOverlaps(list, chartW, chartH, GAP = 6, clampFn) {
        const maxIter = 8;

        const rectsOverlap = (a, b) => {
            return !(a.left + a.width <= b.left ||
                b.left + b.width <= a.left ||
                a.top + a.height <= b.top ||
                b.top + b.height <= a.top);
        };

        // make sure centers exist
        list.forEach(a => {
            a.centerX = a.left + a.width / 2;
            a.centerY = a.top + a.height / 2;
        });

        let iter = 0;
        while (iter < maxIter) {
            let moved = false;
            for (let i = 0; i < list.length; i++) {
                for (let j = i + 1; j < list.length; j++) {
                    const A = list[i];
                    const B = list[j];
                    if (!rectsOverlap(A, B)) continue;

                    const overlapX = Math.min(A.left + A.width, B.left + B.width) - Math.max(A.left, B.left);
                    const overlapY = Math.min(A.top + A.height, B.top + B.height) - Math.max(A.top, B.top);

                    let dirX = Math.sign(B.centerX - A.centerX) || 1;
                    let dirY = Math.sign(B.centerY - A.centerY) || 1;

                    if (overlapX >= overlapY) {
                        const shift = (overlapX / 2) + GAP;
                        B.left = B.left + shift * dirX;
                    } else {
                        const shift = (overlapY / 2) + GAP;
                        B.top = B.top + shift * dirY;
                    }

                    // clamp moved tooltip
                    const clamped = clampFn({ left: B.left, top: B.top, width: B.width, height: B.height });
                    if (clamped.left !== B.left || clamped.top !== B.top) {
                        B.left = clamped.left;
                        B.top = clamped.top;
                    }

                    // update centers
                    B.centerX = B.left + B.width / 2;
                    B.centerY = B.top + B.height / 2;

                    moved = true;
                }
            }

            // update centers for all
            list.forEach(a => {
                a.centerX = a.left + a.width / 2;
                a.centerY = a.top + a.height / 2;
            });

            if (!moved) break;
            iter++;
        }

        // final clamp pass
        list.forEach(a => {
            const clamped = clampFn({ left: a.left, top: a.top, width: a.width, height: a.height });
            a.left = clamped.left;
            a.top = clamped.top;
        });

        return list;
    }

    // run resolver to avoid collapsed/overlapping tooltips
    if (assigned.length > 1) {
        resolveOverlaps(assigned, chartW, chartH, GAP, clampToChart);
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
            willChange: 'transform',
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
                const cfg = a.cfg || configs?.find(c => c.name === a.raw.name) || {};
                const color = cfg.color || '#000';
                const lightColor = cfg.lightColor || '#f8f8f8';

                const left = Math.round(a.left);
                const top = Math.round(a.top);

                // use per-tooltip width/height for connector target
                const tx = left + (a.width / 2);
                const ty = top + (a.height / 2);
                const sx = Math.round(a.px);
                const sy = Math.round(a.py);

                const connStyle = connectorStyle(sx, sy, tx, ty, 'gray');

                const buyboxSellerData = getSellerByTimestamp(points?.date, buyboxSellerHistory, sellerData) || {};

                return (
                    <React.Fragment key={i}>
                        <div style={connStyle} className="rounded-full " />
                        <div
                            className={`transition-none ease-linear duration-75 ${cfg?.key === 'buybox' ? 'w-[160px] h-[54px]' : 'w-[80px] h-[40px]'}  flex flex-col text-sm p-1 shadow border`}
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
                            <span className="text-[#767676] text-xs/[13px]">{a.raw.name}</span>
                            <span className="text-[#2f2f2f] text-sm/[15px]">
                                {cfg.symbol || ''}{a.raw.yval !== null ? formatNumberWithCommas(a.raw.yval, cfg?.decimal ? 2 : 0, false, true) : '-'}
                            </span>
                            {cfg?.key === 'buybox' && (
                                <div className="text-[#424242] text-[12px]/[16px] flex items-center gap-1">
                                    <span className='uppercase font-semibold text-orange-500'>{buyboxSellerData?.sellerType}</span>
                                    <span className='truncate'>{buyboxSellerData?.name || 'Unknown Seller'}</span>
                                    <FaStar className='text-gray-500 min-w-[12px]' />
                                    <span>{formatNumberWithCommas(buyboxSellerData?.rating, 2, false, false)}/{buyboxSellerData?.ratingCount || '0'}</span>
                                </div>
                            )}
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}
