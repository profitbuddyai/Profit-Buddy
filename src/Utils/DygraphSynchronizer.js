function arraysAreEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

function attachZoomHandlers(gs, syncOpts, prevCallbacks) {
  let block = false;
  gs.forEach((g, i) => {
    g.updateOptions(
      {
        drawCallback: function (me, initial) {
          if (block || initial) {
            const prev = prevCallbacks[i]?.drawCallback;
            if (prev) prev.apply(this, arguments);
            return;
          }
          block = true;

          let opts = { dateWindow: me.xAxisRange() };
          if (syncOpts.range) opts.valueRange = me.yAxisRange();

          gs.forEach((other, j) => {
            if (other === me) {
              const prev = prevCallbacks[j]?.drawCallback;
              if (prev) prev.apply(this, arguments);
              return;
            }
            let update = !arraysAreEqual(opts.dateWindow, other.getOption('dateWindow'));
            if (!update && syncOpts.range) {
              update = !arraysAreEqual(opts.valueRange, other.getOption('valueRange'));
            }
            if (update) {
              if (!syncOpts.range) opts.valueRange = other.yAxisRange();
              other.updateOptions(opts);
            }
          });
          block = false;
        },
      },
      true
    );
  });
}

function attachSelectionHandlers(gs, prevCallbacks) {
  let block = false;
  gs.forEach((g, i) => {
    g.updateOptions(
      {
        highlightCallback: function (event, x, points, row, seriesName) {
          return null;
          if (block) return;
          block = true;
          gs.forEach((other, j) => {
            if (other === g) {
              const prev = prevCallbacks[j]?.highlightCallback;
              if (prev) prev.apply(this, arguments);
              return;
            }
            const idx = other.getRowForX(x);
            if (idx !== null) {
              other.setSelection(idx, seriesName, undefined, true);
            }
          });
          block = false;
        },
        unhighlightCallback: function () {
          if (block) return;
          block = true;
          gs.forEach((other, j) => {
            if (other === g) {
              const prev = prevCallbacks[j]?.unhighlightCallback;
              if (prev) prev.apply(this, arguments);
              return;
            }
            other.clearSelection();
          });
          block = false;
        },
      },
      true
    );
  });
}

function attachDragOverlaySyncX(gs) {
  let isDragging = false;
  let startX = null;

  gs.forEach((g) => {
    const parent = g.graphDiv;

    // create overlay canvas
    let overlay = parent.querySelector('.drag-overlay');

    if (!overlay) {
      overlay = document.createElement('canvas');
      overlay.className = 'drag-overlay';
      overlay.style.position = 'absolute';
      overlay.style.left = 0;
      overlay.style.top = 0;
      overlay.style.pointerEvents = 'none';
      overlay.width = g.width_;
      overlay.height = g.height_;
      parent.style.position = 'relative';
      parent.appendChild(overlay);
    }

    if (!g._overlayResizeInstalled) {
      g.resizeHandler = () => {
        const ov = g.graphDiv.querySelector('.drag-overlay');
        if (ov) {
          ov.width = g.width_;
          ov.height = g.height_;
        }
      };
      g._overlayResizeInstalled = true;
    }
    const canvas = g.canvas_;

    const endDragFor = (sourceGraph) => {
      // stop dragging and clear overlays
      isDragging = false;
      startX = null;
      dragSource = null;

      gs.forEach((other) => {
        const ov = other.graphDiv.querySelector('.drag-overlay');
        if (ov) {
          const ctx = ov.getContext('2d');
          ctx.clearRect(0, 0, ov.width, ov.height);
        }
      });

      // remove ephemeral listeners attached for this source graph
      const handlers = ephemeralHandlers.get(sourceGraph);
      if (handlers) {
        if (handlers.winUp) window.removeEventListener('mouseup', handlers.winUp);
        if (handlers.leave) sourceGraph.graphDiv.removeEventListener('mouseleave', handlers.leave);
        ephemeralHandlers.delete(sourceGraph);
      }
    };

    canvas.addEventListener('mousedown', (e) => {
      const coords = g.eventToDomCoords(e);
      startX = coords[0];
      isDragging = true;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const coords = g.eventToDomCoords(e);
      const endX = coords[0];

      gs.forEach((other) => {
        const overlay2 = other.graphDiv.querySelector('.drag-overlay');
        const ctx2 = overlay2.getContext('2d');
        const area = other.getArea(); // plot area

        ctx2.clearRect(0, 0, overlay2.width, overlay2.height);

        const x0 = Math.max(Math.min(startX, endX), area.x); // clip to plot area
        const x1 = Math.min(Math.max(startX, endX), area.x + area.w);
        const y0 = area.y;
        const y1 = area.y + area.h;

        ctx2.save();
        ctx2.globalAlpha = 0.3;
        ctx2.fillStyle = 'gray';
        ctx2.strokeStyle = 'black';
        ctx2.fillRect(x0, y0, x1 - x0, y1 - y0);
        ctx2.strokeRect(x0, y0, x1 - x0, y1 - y0);
        ctx2.restore();
      });
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      startX = null;

      gs.forEach((other) => {
        if (!other?.graphDiv) return;
        const overlay2 = other?.graphDiv?.querySelector('.drag-overlay');
        const ctx2 = overlay2.getContext('2d');
        ctx2.clearRect(0, 0, overlay2.width, overlay2.height);
      });
    });
  });
}

const attachVerticalLine = (graphs, scaleFactor = 1) => {
  graphs.forEach((g) => {
    const graphDiv = g.graphDiv;

    // make sure graphDiv is positioned
    graphDiv.style.position = 'relative';

    // create overlay canvas for the line
    let movingLine = graphDiv.querySelector('.moving-line-abc');
    if (!movingLine) {
      movingLine = document.createElement('canvas');
      movingLine.className = 'moving-line-abc';
      movingLine.style.position = 'absolute';
      movingLine.style.top = 0;
      movingLine.style.left = 0;
      movingLine.style.pointerEvents = 'none';
      movingLine.width = g.width_;
      movingLine.height = g.height_;
      graphDiv.appendChild(movingLine);
    }
    const ctx = movingLine.getContext('2d');

    graphDiv.addEventListener('mousemove', (e) => {
      const rect = graphDiv.getBoundingClientRect();
      const plotArea = g.plotter_.area;

      const mouseX = (e.clientX - rect.left) / scaleFactor - plotArea.x;

      if (mouseX < 0 || mouseX > plotArea.w) {
        ctx.clearRect(0, 0, movingLine.width, movingLine.height);
        return;
      }

      ctx.clearRect(0, 0, movingLine.width, movingLine.height);
      ctx.strokeStyle = 'rgb(128, 128, 128)';
      ctx.lineWidth = 1.5;
      movingLine.style.zIndex = 10;
      ctx.beginPath();
      ctx.moveTo(mouseX + plotArea.x, plotArea.y);
      ctx.lineTo(mouseX + plotArea.x, plotArea.y + plotArea.h);
      ctx.stroke();

      graphs.forEach((other) => {
        if (other === g) return;
        const otherDiv = other.graphDiv;
        const otherCanvas = otherDiv.querySelector('.moving-line-abc');
        if (!otherCanvas) return;
        const otherCtx = otherCanvas.getContext('2d');

        const otherPlotArea = other.plotter_.area;
        const scaleX = mouseX / plotArea.w;
        const otherX = scaleX * otherPlotArea.w;

        otherCtx.clearRect(0, 0, otherCanvas.width, otherCanvas.height);
        ctx.strokeStyle = 'rgb(128, 128, 128)';
        ctx.lineWidth = 1.5;
        movingLine.style.zIndex = 10;
        otherCtx.beginPath();
        otherCtx.moveTo(otherX + otherPlotArea.x, otherPlotArea.y);
        otherCtx.lineTo(otherX + otherPlotArea.x, otherPlotArea.y + otherPlotArea.h);
        otherCtx.stroke();
      });
    });

    graphDiv.addEventListener('mouseleave', () => {
      graphs.forEach((g) => {
        const canvas = g.graphDiv.querySelector('.moving-line-abc');
        if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      });
    });
  });
};

export function synchronize(graphs, opts = { selection: true, zoom: true, range: true }, scaleFactor = 1) {
  if (!graphs || graphs.length < 2) {
    throw new Error('Need at least two Dygraphs to synchronize.');
  }

  const gs = graphs;
  const prevCallbacks = [];

  let readyCount = gs.length;
  gs.forEach((g, i) => {
    g.ready(() => {
      if (--readyCount === 0) {
        const callbackTypes = ['drawCallback', 'highlightCallback', 'unhighlightCallback'];
        gs.forEach((graph, j) => {
          prevCallbacks[j] = {};
          callbackTypes.forEach((type) => {
            prevCallbacks[j][type] = graph.getFunctionOption(type);
          });
        });

        if (opts.zoom) {
          attachZoomHandlers(gs, opts, prevCallbacks);
          attachDragOverlaySyncX(gs);
        }
        // if (opts.selection) attachSelectionHandlers(gs, prevCallbacks);
        attachVerticalLine(gs, scaleFactor);
      }
    });
  });

  return {
    detach: () => {
      gs?.forEach((g, i) => {
        if (!g || !g.div) return; // skip destroyed/null graphs

        if (opts.zoom) {
          g.updateOptions({ drawCallback: prevCallbacks[i]?.drawCallback || null });
        }
        if (opts.selection) {
          g.updateOptions({
            highlightCallback: prevCallbacks[i]?.highlightCallback || null,
            unhighlightCallback: prevCallbacks[i]?.unhighlightCallback || null,
          });
        }

        const ov = g.graphDiv.querySelector('.drag-overlay');
        if (ov) {
          const ctx = ov.getContext('2d');
          ctx.clearRect(0, 0, ov.width, ov.height);
          // optional: remove overlay element
          ov.remove();
        }
      });
    },
  };
}

export function attachTooltipSync(graphs, setTooltipDatas, scaleFactor = 1) {
  const lastValidData = Array(graphs.length).fill(null);

  graphs.forEach((g, i) => {
    g.graphDiv.addEventListener('mousemove', (e) => {
      const plotArea = g.plotter_.area;
      const rect = g.graphDiv.getBoundingClientRect();
      const absoluteX = e.clientX - rect.left;


      const relativeX = absoluteX - plotArea.x * scaleFactor;
      if (relativeX < 0 || relativeX > plotArea.w * scaleFactor) {
        setTooltipDatas.forEach((setTooltip) => setTooltip((prev) => ({ ...prev, visible: false })));
        return;
      } // ignore outside graph area

      const yPixel = e.clientY - rect.top;

      const [dataX] = g.toDataCoords(relativeX / scaleFactor + 85, yPixel);

      graphs.forEach((other, j) => {
        let rowIndex = other.getRowForX(dataX);
        let isExact = true;

        if (rowIndex === null) {
          isExact = false;
          let closestIndex = null;
          let minDiff = Infinity;

          for (let k = 0; k < other.numRows(); k++) {
            const rowX = other.getValue(k, 0);

            if (rowX > dataX) continue; // ⬅️ Skip all future points

            const diff = dataX - rowX; // No need for Math.abs, since rowX <= dataX
            if (diff < minDiff) {
              minDiff = diff;
              closestIndex = k;
            }
          }

          if (closestIndex !== null) rowIndex = closestIndex;
        }

        const otherRect = other.graphDiv.getBoundingClientRect();

        let tooltipData = {
          xPixel: absoluteX,
          date: dataX,
          data: [],
          rect: otherRect,
          isExact,
        };

        if (rowIndex !== null) {
          const labels = other.getLabels();
          const xVal = other.getValue(rowIndex, 0);

          const y1Range = other.yAxisRange(0);
          const y2Range = other.yAxisRange(1);

          const seriesOpts = other.getOption('series') || {};

          for (let col = 1; col < labels.length; col++) {
            let yVal = other.getValue(rowIndex, col);
            if (yVal == null) continue;

            // normalize if series uses y2 axis
            const axis = seriesOpts[labels[col]]?.axis;
            let yValForCoord = yVal;
            if (axis === 'y2' && y2Range) {
              const [y1Min, y1Max] = y1Range;
              const [y2Min, y2Max] = y2Range;
              const ratio = (yVal - y2Min) / (y2Max - y2Min);
              yValForCoord = y1Min + ratio * (y1Max - y1Min);
            }

            const [canvasX, canvasY] = other.toDomCoords(xVal, yValForCoord);

            tooltipData.data.push({
              name: labels[col],
              yval: yVal,
              row: rowIndex,
              col,
              canvasx: canvasX * scaleFactor,
              canvasy: canvasY * scaleFactor,
            });
          }

          lastValidData[j] = tooltipData;
        } else if (lastValidData[j]) {
          tooltipData = {
            ...lastValidData[j],
            date: dataX,
            xPixel: absoluteX / scaleFactor,
            isExact: false,
          };
        }

        setTooltipDatas[j]({
          rect: otherRect,
          points: tooltipData,
          visible: true,
        });
      });
    });

    g.graphDiv.addEventListener('mouseleave', () => {
      setTooltipDatas.forEach((setTooltip) => setTooltip((prev) => ({ ...prev, visible: false })));
    });
  });
}
