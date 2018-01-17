import express from 'express';
import { assert } from 'chai';
import mkdirp from 'mkdirp';
import { Observable } from 'rxjs';
import request from 'request';
const get = Observable.bindNodeCallback(request.get.bind(request));

import { defaultHttpConnector } from '../../../src/shared/services/connectors/http';
import { HttpPivot } from '../../../src/shared/services/templates/http/httpPivot';

const PORT = 3001;

describe('httpPivot', function() {
    let server;
    beforeEach(function() {
        const expressApp = express();
        expressApp.get('/echo', function(req, res) {
            res.status(200).json(req.query);
        });
        expressApp.get('/timeout', () => {});
        expressApp.get('/404', (req, res) => res.status(404).json({}));
        server = expressApp.listen(PORT);
    });

    afterEach(function() {
        server.close();
    });

    ////////////////////////////////

    const httpSingleX = new HttpPivot({
        id: 'x',
        name: 'y',
        tags: [],
        attributes: [],
        connections: [],
        toUrls: () => [{ url: `http://localhost:${PORT}/echo?x=1` }],
        parameters: [],
        encodings: {}
    });

    const httpDoubleX = new HttpPivot({
        id: 'x',
        name: 'y',
        tags: [],
        attributes: [],
        connections: [],
        toUrls: () => [{ url: `http://localhost:${PORT}/echo?x=5&x=10` }],
        parameters: [],
        encodings: {}
    });

    ////////////////////////////////

    it('testEcho', done => {
        get(`http://localhost:${PORT}/echo?x=1`).subscribe(
            ([response]) => {
                assert.deepEqual(JSON.parse(response.body), { x: '1' });
                done();
            },
            v => done(new Error({ v }))
        );
    });

    it('construct', done => {
        new HttpPivot({
            id: 'x',
            name: 'y',
            tags: [],
            attributes: [],
            connections: [],
            toUrls: () => [],
            parameters: [],
            encodings: {}
        });
        done();
    });

    it('constant', done => {
        const pivot = httpSingleX;
        pivot
            .searchAndShape({
                app: {},
                pivot: {
                    id: 'x',
                    enabled: true,
                    pivotParameters: { x$$$jq: '. | [{"x": 1}, {"x": 3}]' }
                },
                pivotCache: {}
            })
            .subscribe(
                ({ pivot, ...rest }) => {
                    assert.deepEqual(pivot.events, [
                        { x: 1, EventID: 'x:0' },
                        { x: 3, EventID: 'x:1' }
                    ]);
                    assert.deepEqual(pivot.results.graph, [
                        {
                            edge: 'x:0:x',
                            col: 'x',
                            EventID: 'x:0',
                            x: 1,
                            destination: 1,
                            source: 'x:0',
                            edgeType: 'EventID->x',
                            edgeTitle: 'x:0->1',
                            time: undefined
                        },
                        {
                            edge: 'x:1:x',
                            col: 'x',
                            EventID: 'x:1',
                            x: 3,
                            destination: 3,
                            source: 'x:1',
                            edgeType: 'EventID->x',
                            edgeTitle: 'x:1->3',
                            time: undefined
                        }
                    ]);
                    assert.deepEqual(pivot.results.labels, [
                        { EventID: 'x:0', x: 1, node: 'x:0', type: 'EventID' },
                        { node: 1, type: 'x', cols: ['x'] },
                        { EventID: 'x:1', x: 3, node: 'x:1', type: 'EventID' },
                        { node: 3, type: 'x', cols: ['x'] }
                    ]);
                    done();
                },
                e => done(new Error(e))
            );
    });

    it('fromData', done => {
        const pivot = httpDoubleX;
        pivot
            .searchAndShape({
                app: {},
                pivot: {
                    id: 'x',
                    enabled: true,
                    pivotParameters: { x$$$jq: '. | [{x: .x[0]}, {x: .x[1]}]' }
                },
                pivotCache: {}
            })
            .subscribe(
                ({ pivot, ...rest }) => {
                    assert.deepEqual(pivot.events, [
                        { x: '5', EventID: 'x:0' },
                        { x: '10', EventID: 'x:1' }
                    ]);
                    assert.deepEqual(pivot.results.graph, [
                        {
                            edge: 'x:0:x',
                            col: 'x',
                            EventID: 'x:0',
                            x: '5',
                            destination: '5',
                            source: 'x:0',
                            edgeType: 'EventID->x',
                            edgeTitle: 'x:0->5',
                            time: undefined
                        },
                        {
                            edge: 'x:1:x',
                            col: 'x',
                            EventID: 'x:1',
                            x: '10',
                            destination: '10',
                            source: 'x:1',
                            edgeType: 'EventID->x',
                            edgeTitle: 'x:1->10',
                            time: undefined
                        }
                    ]);
                    assert.deepEqual(pivot.results.labels, [
                        { EventID: 'x:0', x: '5', node: 'x:0', type: 'EventID' },
                        { node: '5', type: 'x', cols: ['x'] },
                        { EventID: 'x:1', x: '10', node: 'x:1', type: 'EventID' },
                        { node: '10', type: 'x', cols: ['x'] }
                    ]);
                    done();
                },
                e => done(new Error(e))
            );
    });

    it('userEventID', done => {
        const pivot = httpDoubleX;
        pivot
            .searchAndShape({
                app: {},
                pivot: {
                    id: 'x',
                    enabled: true,
                    pivotParameters: {
                        x$$$jq: '. | [{x: .x[0], EventID: "aa"}, {x: .x[1], EventID: "bb"}]'
                    }
                },
                pivotCache: {}
            })
            .subscribe(
                ({ pivot, ...rest }) => {
                    assert.deepEqual(pivot.events, [
                        { x: '5', EventID: 'aa' },
                        { x: '10', EventID: 'bb' }
                    ]);
                    assert.deepEqual(pivot.results.graph, [
                        {
                            edge: 'aa:x',
                            col: 'x',
                            EventID: 'aa',
                            x: '5',
                            destination: '5',
                            source: 'aa',
                            edgeType: 'EventID->x',
                            edgeTitle: 'aa->5',
                            time: undefined
                        },
                        {
                            edge: 'bb:x',
                            col: 'x',
                            EventID: 'bb',
                            x: '10',
                            destination: '10',
                            source: 'bb',
                            edgeType: 'EventID->x',
                            edgeTitle: 'bb->10',
                            time: undefined
                        }
                    ]);
                    assert.deepEqual(pivot.results.labels, [
                        { EventID: 'aa', x: '5', node: 'aa', type: 'EventID' },
                        { node: '5', type: 'x', cols: ['x'] },
                        { EventID: 'bb', x: '10', node: 'bb', type: 'EventID' },
                        { node: '10', type: 'x', cols: ['x'] }
                    ]);
                    done();
                },
                e => done(new Error(e))
            );
    });

    it('no includes', done => {
        const pivot = httpSingleX;
        pivot
            .searchAndShape({
                app: {},
                pivot: {
                    id: 'x',
                    enabled: true,
                    pivotParameters: { x$$$jq: '. | import [{x: 1}, {x: 3}]' }
                },
                pivotCache: {}
            })
            .subscribe(
                ({ pivot, ...rest }) => {
                    done(new Error({ msg: 'Expected exception' }));
                },
                e => {
                    if (e && e.name === 'JqSandboxException') done();
                    else done(new Error({ msg: 'Excepted sandbox exception' }));
                }
            );
    });

    /*
	it('search multiple events', (done) => {
		const pivot = new HttpPivot({
			id: 'x', name: 'y', tags: [], attributes: [], connections: [],
			toUrls: () => 
				[{url: `http://localhost:${PORT}/echo?x=a`}, 
				 {url: `http://localhost:${PORT}/echo?x=b`}],
			parameters: [],
			encodings: {}
		});
		pivot.searchAndShape({
				app: {}, 
				pivot: {
					id: 'x',
					enabled: true, 
					pivotParameters: {'x$$$jq': '.'}					
				}, 
				pivotCache: {}})
			.subscribe(({pivot, ...rest}) => {
					assert.deepEqual(pivot.events, [{x: "a", EventID:'x:0'}, {x: "b", EventID:'x:1'}]);
					assert.deepEqual(pivot.results.graph, 
						[{x: "a", destination: "a", 'source': 'x:0', edgeType: 'EventID->x', edgeTitle: 'x:0->a'},
						 {x: "b", destination: "b", 'source': 'x:1', edgeType: 'EventID->x', edgeTitle: 'x:1->b'}]);
					assert.deepEqual(pivot.results.labels,
						[{ x: "a", node: 'x:0', type: 'EventID' },
					     { node: "a", type: 'x' },
					     { x: "b", node: 'x:1', type: 'EventID' },
					     { node: "b", type: 'x' } ]);				
					done();
				}, (e) => done(e));
	});
	*/

    it('graph', done => {
        const pivot = new HttpPivot({
            id: 'x',
            name: 'y',
            tags: [],
            attributes: [],
            connections: [],
            toUrls: () => [{ url: `http://localhost:${PORT}/echo?x=a` }],
            parameters: [],
            encodings: {}
        });
        pivot
            .searchAndShape({
                app: {},
                pivot: {
                    id: 'x',
                    enabled: true,
                    pivotParameters: {
                        x$$$jq: `. | {edges: [ {edge: "e1", source: "x", destination: "y", x: 1 }, {edge: "e2", source: "y", destination: "z", x: 3 }] }`,
                        x$$$outputType: 'graph'
                    }
                },
                pivotCache: {}
            })
            .subscribe(
                ({ pivot, ...rest }) => {
                    assert.deepEqual(pivot.events, []);
                    assert.deepEqual(pivot.graph.edges, [
                        { edge: 'e1', source: 'x', destination: 'y', x: 1 },
                        { edge: 'e2', source: 'y', destination: 'z', x: 3 }
                    ]);
                    assert.deepEqual(pivot.results.graph, [
                        { edge: 'e1', source: 'x', destination: 'y', x: 1 },
                        { edge: 'e2', source: 'y', destination: 'z', x: 3 }
                    ]);
                    assert.deepEqual(pivot.results.labels, []);
                    done();
                },
                e => done(e)
            );
    });
});