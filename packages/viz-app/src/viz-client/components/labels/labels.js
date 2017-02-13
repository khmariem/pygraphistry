import _ from 'underscore';
import Color from 'color';
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Gestures } from 'rxjs-gestures';
import { Observable } from 'rxjs/Observable';
import styles from 'viz-shared/components/labels/style.less';
import {
    curPoints, pointSizes, pointColors, edgeColors,
    vboUpdates, cameraChanges,
    labelSettings, hitmapUpdates
} from 'viz-client/legacy';

import { animationFrame as AnimationFrameScheduler } from 'rxjs/scheduler/animationFrame';

import {
    compose,
    getContext,
    mapPropsStream
} from 'recompose';

import { Label, isDark } from './label';

const WithPointsAndMousePosition = mapPropsStream((props) => props
    .combineLatest(
        Gestures.move().startWith({})
            .distinctUntilChanged((a, b) => (
                a.clientX === b.clientX &&
                a.clientY === b.clientY
            )),
        hitmapUpdates,
        cameraChanges.startWith({}),
        Observable.fromEvent(window, 'resize')
            .debounceTime(100).delay(50).startWith(null),
        (props, { clientX = 0, clientY = 0 }) => ({
            ...props, mouseX: clientX, mouseY: clientY,
        })
    )
    .auditTime(0, AnimationFrameScheduler)
    .withLatestFrom(
        pointSizes.map(({ buffer }) => new Uint8Array(buffer)),
        pointColors.map(({ buffer }) => new Uint8Array(buffer)),
        edgeColors.map(({ buffer }) => new Uint8Array(buffer)),
        curPoints.map(({ buffer }) => new Float32Array(buffer)),
        (props, sizes, pointColors, edgeColors, points) => ({ ...props, sizes, pointColors, edgeColors, points })
    )
);

class Labels extends React.Component {
    componentWillMount() {
        this.updateLabelSettings({}, this.props);
    }
    componentWillUpdate(nextProps, nextState) {
        this.updateLabelSettings(this.props, nextProps);
    }
    render() {

        let camera, canvas, matrix,
            pointSize, pixelRatio, scalingFactor;
        let { mouseX, mouseY, onLabelsUpdated,
              highlight = null, selection = null,
              renderState = null, renderingScheduler = null,
              renderer,
              labels = [], sizes = [], pointColors = [], edgeColors = [], points = [], children = []
        } = this.props;

        if (!renderState || !renderingScheduler || !(
            camera = renderState.camera) || !(
            canvas = renderState.canvas) || !(
            matrix = camera.getMatrix())) {
            labels = [];
            children = [];
        } else {
            pixelRatio = camera.pixelRatio;
            scalingFactor = camera.semanticZoom(sizes.length || 0);
        }

        let labelIndex = -1;
        const updatesToSend = [];
        const childrenToRender = [];
        const labelCount = labels.length;

        while (++labelIndex < labelCount) {

            const label = labels[labelIndex];

            if (!label || (
                label.type === undefined) || (
                label.index === undefined || (
                label.title === undefined))) {
                continue;
            }

            const { type, index } = label;
            const worldCoords = (type === 'edge') ?
                label === selection ?
                        getEdgeLabelPos(renderState, renderingScheduler, index)
                    :   camera.canvas2WorldCoords(mouseX, mouseY, canvas, matrix)
                :   { x: points[2 * index], y: points[2 * index + 1] };

            if (!worldCoords) {
                continue;
            }

            const { x, y } = camera.canvasCoords(worldCoords.x, worldCoords.y, canvas, matrix);
            const size = type === 'edge' ? 0 : // Clamp like in pointculled shader
                Math.max(5, Math.min(scalingFactor * sizes[index], 50)) / pixelRatio;

            updatesToSend.push({
                pageX: x,
                pageY: y,
                id: index,
                type, size
            });

            const child = children[labelIndex];

            if (child) {

                const radius = size * 0.5;
                const tooltipOffsetY = label !== highlight ?
                    0 : Math.min(Math.abs(15 - radius), 15);

                childrenToRender.push(React.cloneElement(child, {
                    tooltipOffsetY, sizes,
                    pixelRatio, edgeColors,
                    pointColors, scalingFactor,
                    renderState, renderingScheduler,
                    style: {
                        ...(child.props && child.props.style),
                        paddingTop: `${radius}px`,
                        transform: `${`translate3d(${x}px, ${y}px, 0)` /* force hardware acceleration */} ${
                                      `perspective(1000px)` /* force sub-pixel font rendering*/}`
                    }
                }));
            }
        }

        onLabelsUpdated && onLabelsUpdated(updatesToSend);

        return (
            <div className={classNames({
                [styles['labels-container']]: true,
                [styles['labels-container-dark']]: isDark(Color(renderer.background.color).rgb()),
                [styles['labels-zoomed-in']]: scalingFactor > 2})}>
                {childrenToRender}
            </div>
        );
    }
    updateLabelSettings(currProps, nextProps) {
        const { falcor, enabled, poiEnabled,
                renderState, renderingScheduler } = nextProps;
        if (!falcor || !renderState || !renderingScheduler || (
            currProps.enabled === enabled &&
            currProps.poiEnabled === poiEnabled)) {
            return;
        }
        labelSettings.next({ falcor, enabled, poiEnabled,
                             renderState, renderingScheduler });
    }
}

Labels = compose(
    getContext({
        falcor: PropTypes.object,
        renderState: PropTypes.object,
        onLabelsUpdated: PropTypes.func,
        renderingScheduler: PropTypes.object,
    }),
    WithPointsAndMousePosition
)(Labels);

export { Labels };

//Find label position (unadjusted and in model space)
//  Currently just picks a midEdge vertex near the ~middle
//  (In contrast, mouseover effects should use the ~Voronoi position)
//  To convert to canvas coords, use Camera (ex: see labels::renderCursor)
//  TODO use camera if edge goes off-screen
//RenderState * int -> {x: float,  y: float}
function getEdgeLabelPos (renderState, renderingScheduler, edgeIndex) {

    var numRenderedSplits = renderState.config.numRenderedSplits;
    var split = Math.floor(numRenderedSplits/2);

    var appSnapshot = renderingScheduler.appSnapshot;
    var midSpringsPos = appSnapshot.buffers.midSpringsPos;

    if (!midSpringsPos) {
        return undefined;
    }

    var midEdgesPerEdge = numRenderedSplits + 1;
    var midEdgeStride = 4 * midEdgesPerEdge;
    var idx = midEdgeStride * edgeIndex + 4 * split;

    return {x: midSpringsPos[idx], y: midSpringsPos[idx + 1]};
}
