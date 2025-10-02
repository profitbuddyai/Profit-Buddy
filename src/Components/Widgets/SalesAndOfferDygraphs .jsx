import React, { useEffect, useRef, useState } from 'react';
import Dygraph from 'dygraphs';
import 'dygraphs/dist/dygraph.css';
import CustomTooltip from '../UI/Graph/CustomTooltip';
import { formatNumberWithCommas } from '../../Utils/NumberUtil';
import { attachTooltipSync, synchronize } from '../../Utils/DygraphSynchronizer';
import Button from '../Controls/Button';
import { LuRefreshCw } from 'react-icons/lu';
import PopupMenu from '../Controls/PopupMenu';
import { IoFilter } from 'react-icons/io5';
import { OfferCountConfig, SalesConfig, ScaleFactors } from '../../Enums/Enums';

const SalesAndOfferDygraphs = ({ graphData, productInfo, currentFilter, setCurrentFilter, loading, size = 'large', totalDays }) => {

    if (!graphData?.length) return (
        <div className=" w-full border border-border !h-full min-h-[240px] flex flex-col gap-0 items-center justify-center bg-primary">
            <p className="font-normal text-lg text-secondary ">Sorry, No Price and Offer History Available</p>
            <p className="font-normal text-xs text-lText ">May be this product is new or is not offered by any seller</p>
        </div>
    );

    const salesRef = useRef(null);
    const offerRef = useRef(null);
    const [gSales, setGSales] = useState(null);
    const [gOffer, setGOffer] = useState(null);
    const [salesTooltipData, setSalesTooltipData] = useState({ x: 0, y: 0, points: [], visible: false, });
    const [offerTooltipData, setOfferTooltipData] = useState({ x: 0, y: 0, points: [], visible: false, });
    const [isZoomed, setIsZoomed] = useState(false);
    const scaleFactor = ScaleFactors?.[size] || 1




    const resetBothGraphsZoom = () => {
        if (gSales) gSales.resetZoom();
        if (gOffer) gOffer.resetZoom();
    };


    useEffect(() => {
        if (!graphData || graphData.length === 0) return;


        Dygraph.prototype.doZoomY_ = function (lowY, highY) {
            // no-op: disables Y-axis zoom entirely
        };

        const salesData = graphData.map(d => [
            new Date(d.date),
            d.amazon,
            d.newPrice,
            d.salesRank,
            d.buyBox,
        ]);

        const offerData = graphData.map(d => [
            new Date(d.date),
            d.offerCount ?? null,
        ]);

        let interactionModel = {
            ...Dygraph.defaultInteractionModel,
        };

        if (size === "small") {
            interactionModel = {
                ...Dygraph.defaultInteractionModel,
                mousedown: function (event, g, context) {
                    if (event.button === 0) {
                        return;
                    }
                },
                mousewheel: function (event, g, context) {
                    event.preventDefault();
                },
            };
        }


        const salesGraph = new Dygraph(salesRef.current, salesData, {
            labels: ["Date", ...SalesConfig.map(s => s.name)],
            animatedZooms: true,
            interactionModel,
            stepPlot: true,
            highlightCircleSize: 0,
            gridLinePattern: [],
            gridLineColor: '#cccccc',
            legend: 'never',
            colors: SalesConfig.map(s => s.color),
            drawXGrid: true,
            // yRangePad: 25,
            drawYGrid: true,
            drawCallback: (g) => {
                const ctx = g.hidden_ctx_;
                const area = g.getArea();
                ctx.save();
                ctx.strokeStyle = "#8a8a8a";
                ctx.lineWidth = 3;
                ctx.strokeRect(area.x, area.y, area.w, area.h);
                ctx.restore();
            },
            axes: {
                y: {
                    axisLabel: 'Price',
                    axisLabelWidth: 80,
                    axisLabelFontSize: 13,
                    axisLineColor: 'transparent',
                    drawGrid: false,
                    axisLineWidth: 0.1,
                    valueFormatter: v => '$' + formatNumberWithCommas(v) || Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 }),
                    axisLabelFormatter: v => formatNumberWithCommas(v),
                },
                y2: {
                    axisLabel: 'Sales Rank',
                    axisLabelWidth: 80,
                    axisLineColor: 'transparent',
                    axisLineWidth: 0.1,
                    independentTicks: true,
                    valueFormatter: v => '#' + Number(v).toLocaleString(),
                    axisLabelFormatter: v => '#' + Number(v).toLocaleString()
                },
                x: {
                    drawAxis: true,
                    axisLineColor: 'transparent',
                    axisLineWidth: 0.1,
                    axisLabelWidth: 90,
                },
            },
            series: SalesConfig.reduce((acc, s) => {
                acc[s.name] = {
                    strokeWidth: s.strokeWidth,
                    fillGraph: s.fillGraph || false,
                    axis: s.axis || 'y'
                };
                return acc;
            }, {}),



        });

        const offerGraph = new Dygraph(offerRef.current, offerData, {
            labels: ["Date", ...OfferCountConfig.map(s => s.name)],
            animatedZooms: true,
            interactionModel,
            stepPlot: true,
            gridLinePattern: [],
            highlightCircleSize: 0,
            gridLineColor: '#cccccc',
            rightGap: 90,
            // yRangePad: 25,
            legend: 'never',
            colors: OfferCountConfig.map(s => s.color),
            drawXGrid: true,
            drawYGrid: true,
            drawCallback: (g) => {
                const ctx = g.hidden_ctx_;
                const area = g.getArea();
                ctx.save();
                ctx.strokeStyle = "#8a8a8a";
                ctx.lineWidth = 3;
                ctx.strokeRect(area.x, area.y, area.w, area.h);
                ctx.restore();
            },
            axes: {
                y: {

                    axisLabel: 'Offers',
                    axisLabelWidth: 80,
                    axisLabelFontSize: 13,
                    axisLineColor: 'transparent',
                    drawGrid: false,
                    axisLineWidth: 0.1,
                    valueFormatter: v => Math.round(v).toLocaleString(),
                    axisLabelFormatter: v => Math.round(v).toLocaleString(),
                },
                x: {
                    drawAxis: true,
                    axisLineColor: 'transparent',
                    axisLineWidth: 0.1,
                    axisLabelWidth: 90,
                },
            },
            series: OfferCountConfig.reduce((acc, s) => {
                acc[s.name] = {
                    strokeWidth: s.strokeWidth,
                    fillGraph: s.fillGraph || false,
                    axis: s.axis || 'y',
                };
                return acc;
            }, {}),

        });


        const sync = synchronize([salesGraph, offerGraph], {
            zoom: size !== 'small',
            selection: true,
            range: false,
        }, scaleFactor);

        attachTooltipSync(
            [salesGraph, offerGraph],
            [setSalesTooltipData, setOfferTooltipData],
            scaleFactor
        );

        const handleZoom = () => {
            if (!salesGraph || !offerGraph) return;
            const zoomed = salesGraph.isZoomed() || offerGraph.isZoomed();
            setIsZoomed(zoomed);
        };

        salesGraph.updateOptions({ zoomCallback: handleZoom });
        offerGraph.updateOptions({ zoomCallback: handleZoom });
        const totalRows = salesData.length;
        const targetDuration = 1200;
        let startTime = null;

        function animateGraphs(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            const progress = Math.min(elapsed / targetDuration, 1);
            const nextI = Math.floor(progress * totalRows);

            if (nextI > 0) {
                salesGraph.updateOptions({
                    file: salesData.slice(0, nextI)
                });

                offerGraph.updateOptions({
                    file: offerData.slice(0, nextI).map(row => [row[0], row[1] ?? null])
                });
            }

            if (progress < 1) {
                requestAnimationFrame(animateGraphs);
            }
        }

        requestAnimationFrame(animateGraphs);

        setGSales(salesGraph);
        setGOffer(offerGraph);

        return () => {
            salesGraph.destroy();
            offerGraph.destroy();
            sync.detach();
        };
    }, [graphData]);

    // const getLastValues = (graph, labels) => {
    //     if (!graph) return {};
    //     const lastIndex = graph.numRows() - 1;
    //     const vals = {};
    //     labels.forEach(label => {
    //         const colIndex = graph.getLabels().indexOf(label);
    //         if (colIndex > 0) {
    //             const v = graph.getValue(lastIndex, colIndex);
    //             vals[label] = v != null ? v : null;
    //         }
    //     });
    //     return vals;
    // };

    // const salesLabels = SalesConfig?.map((s) => s?.name);
    // const offerLabels = OfferCountConfig?.map((s) => s?.name);
    // const salesLast = getLastValues(gSales, salesLabels);
    // const offerLast = getLastValues(gOffer, offerLabels);

    return (
        <div className='flex flex-col gap-4 w-full'>
            {size !== 'small' && (
                <div className='flex justify-between items-center'>
                    <div className='flex gap-2 items-center'>
                        <h1 className={`text-[24px]/[24px] text-secondary font-semibold fontDmmono`}>Price History</h1>
                    </div>
                    <div className='flex gap-2 justify-center items-center'>
                        {true && (<Button action={resetBothGraphsZoom} label={<LuRefreshCw />} corner='small' size='small' variant='outline' className='!px-3' />)}
                        <div className='2xl:hidden'>
                            <PopupMenu
                                trigger={
                                    <Button label={<div className='flex gap-2 items-center'><IoFilter /> Filters</div>} corner='small' className={`!px-3`} size='small' variant='outline' />
                                }
                                data={[
                                    {
                                        name: '7 days',
                                        action: () => setCurrentFilter(7),
                                        selected: currentFilter === 7,
                                    },
                                    {
                                        name: '30 days',
                                        action: () => setCurrentFilter(30),
                                        selected: currentFilter === 30,
                                    },
                                    {
                                        name: '90 days',
                                        action: () => setCurrentFilter(90),
                                        selected: currentFilter === 90,
                                    },
                                    {
                                        name: '180 days',
                                        action: () => setCurrentFilter(180),
                                        selected: currentFilter === 180,
                                    },
                                    {
                                        name: '1 year',
                                        action: () => setCurrentFilter(365),
                                        selected: currentFilter === 365,
                                    },
                                    {
                                        name: `All (${totalDays ?? ''} Days)`,
                                        action: () => setCurrentFilter(totalDays ?? 10000),
                                        selected: currentFilter === totalDays,
                                    },
                                ]}
                            />
                        </div>
                        <div className='hidden 2xl:flex gap-2'>
                            <Button action={() => setCurrentFilter(7)} disabled={loading} label='7 days' corner='small' className={`!px-3 ${currentFilter === 7 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter(30)} disabled={loading} label='30 days' corner='small' className={`!px-3 ${currentFilter === 30 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter(90)} disabled={loading} label='90 days' corner='small' className={`!px-3 ${currentFilter === 90 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter(180)} disabled={loading} label='180 days' corner='small' className={`!px-3 ${currentFilter === 180 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter(365)} disabled={loading} label='1 Year' corner='small' className={`!px-3 ${currentFilter === 365 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter(totalDays ?? 10000)} disabled={loading} label={`All (${totalDays ?? ''} Days)`} corner='small' className={`!px-3 ${currentFilter === totalDays && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                        </div>
                    </div>
                </div>
            )}
            <div className={`bg-white py-2 rounded-lg z-20 ${size === 'small' ? 'max-h-[210px]' : ''}`}>
                <ul style={{ transform: `scale(${scaleFactor})`, }} className="hidden origin-top-left sm:flex gap-4 py-2.5 px-6">
                    {SalesConfig.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[15px]">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></span>
                            <span className="font-medium text-[#000000b1]">
                                {s.name}:{" "}
                                {(!productInfo?.[s.key] || productInfo?.[s.key] < 0) ? (
                                    <i className='font-normal text-xs'>{s.notFoundText ?? 'No Record'}</i>
                                ) : (
                                    <>
                                        {s.symbol}
                                        {productInfo?.[s.key]?.toLocaleString()}
                                    </>
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
                <div ref={salesRef} className='origin-top-left' style={{ width: '100%', height: size === 'small' ? '240px' : '260px', transform: `scale(${scaleFactor})`, }} />
                <CustomTooltip {...salesTooltipData} configs={SalesConfig} size={size} />
            </div >

            <div className={`bg-white py-2 rounded-lg z-10 ${size === 'small' ? 'max-h-[210px]' : 'mt-6'}`}>

                <ul style={{ transform: `scale(${scaleFactor})`, }} className="hidden origin-top-left sm:flex gap-4 py-2.5 px-6">
                    {OfferCountConfig.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[15px]">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></span>
                            <span className="font-medium text-[#000000b1]">
                                {s.name}:{" "}
                                {(!productInfo?.[s.key] || productInfo?.[s.key] < 0) ? (
                                    <i className='font-normal text-xs'>No Record</i>
                                ) : (
                                    <>
                                        {s.symbol}
                                        {productInfo?.[s.key]?.toLocaleString()}
                                    </>
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
                <div ref={offerRef} className='origin-top-left' style={{ width: '100%', height: size === 'small' ? '240px' : '260px', transform: `scale(${scaleFactor})`, }} />
                <CustomTooltip {...offerTooltipData} configs={OfferCountConfig} size={size} />

            </div>
        </div>
    );
};

export default SalesAndOfferDygraphs;






